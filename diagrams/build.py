#!/usr/bin/env python3
"""프로젝트 다이어그램 빌드.

diagrams/*.json (archify workflow 스펙)을 검증하고 렌더링한 뒤,
SVG만 꺼내 src/lib/diagrams.ts 로 내보낸다. 색과 글꼴은 사이트의
globals.css(.diagram)가 입힌다.

    python3 diagrams/build.py

archify 스킬(~/.claude/skills/archify)과 node가 필요하다.
"""

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
ARCHIFY = Path.home() / ".claude/skills/archify/bin/archify.mjs"
OUT = HERE.parent / "src/lib/diagrams.ts"

# 색 범례. 그림마다 실제로 쓰인 종류만 그림 아래에 나온다.
# 색 자체는 src/app/globals.css 의 --d-* 에 있다.
LEGEND = {
    "mode": "auto",
    "entries": {
        "backend": {"label": "에이전트 로직"},
        "cloud": {"label": "LLM, 모델"},
        "database": {"label": "DB, 인덱스"},
        "security": {"label": "검증"},
        "messagebus": {"label": "도구, 외부 API"},
        "frontend": {"label": "화면, 결과"},
        "external": {"label": "사람, 문서"},
    },
}


def render(spec: Path, workdir: Path) -> str:
    """deliver는 showcase 검증을 통과해야만 HTML을 만든다."""
    # deliver가 스펙 옆에 스냅샷을 남기므로 임시 폴더로 복사해서 돌린다
    tmp_spec = workdir / spec.name
    data = json.loads(spec.read_text(encoding="utf-8"))
    data["meta"]["legend"] = LEGEND
    tmp_spec.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    html = workdir / (spec.stem + ".html")
    result = subprocess.run(
        ["node", str(ARCHIFY), "deliver", "workflow", str(tmp_spec), str(html),
         "--quality", "showcase", "--json"],
        capture_output=True, text=True,
    )
    receipt = json.loads(result.stdout or "{}")
    if result.returncode != 0 or not receipt.get("ok"):
        sys.exit(f"{spec.name}: archify deliver failed\n{receipt.get('error', result.stderr)}")
    return html.read_text(encoding="utf-8")


def extract_svg(html: str, key: str) -> str:
    svg = re.search(r"<svg viewBox.*?</svg>", html, re.S).group(0)

    # 한 페이지에 여러 장이 들어가므로 id가 겹치지 않게 접두사를 붙인다
    for ident in set(re.findall(r'id="([^"]+)"', svg)):
        svg = svg.replace(f'id="{ident}"', f'id="{key}-{ident}"')
        svg = svg.replace(f"url(#{ident})", f"url(#{key}-{ident})")
    svg = re.sub(
        r'aria-labelledby="([^"]+)"',
        lambda m: 'aria-labelledby="%s"' % " ".join(f"{key}-{i}" for i in m.group(1).split()),
        svg,
    )

    # 범례: "Legend" 제목을 빼고, 레인 왼쪽 선에 맞춰 레인 바로 아래로 옮기고, 글자를 키운다
    svg = re.sub(r'<text[^>]*>Legend</text>', "", svg)
    head, sep, legend = svg.partition("<g data-legend ")
    if sep:
        legend = legend.replace('font-size="7"', 'font-size="8.5"')
        svg = head + '<g transform="translate(22 -14)" data-legend ' + legend

    # 배경 격자, 주석, 뷰어 전용 data 속성, 레인 번호("01 / ")는 뺀다
    svg = re.sub(r'<rect width="100%" height="100%" fill="url\(#[^)]*grid\)"\s*/>', "", svg)
    svg = re.sub(r"<pattern.*?</pattern>", "", svg, flags=re.S)
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
    svg = re.sub(r'\sdata-[a-z-]+(="[^"]*")?', "", svg)
    svg = re.sub(r">\d\d / ", ">", svg)
    # 정적 그림이라 뷰어의 노드 포커스 버튼 속성도 뺀다
    svg = re.sub(r' tabindex="0" role="button" aria-label="[^"]*" aria-pressed="false"', "", svg)

    # 레인 바깥 여백을 잘라내고, 아래에 범례 한 줄 자리를 남긴다
    lanes = [
        (float(y), float(h))
        for y, h in re.findall(r'<rect x="40" y="([\d.]+)" width="640" height="([\d.]+)"', svg)
    ]
    bottom = max(y + h for y, h in lanes)
    top = min(y for y, _ in lanes)
    svg = re.sub(r'viewBox="[^"]+"', f'viewBox="32 {top - 8:g} 656 {bottom - top + 46:g}"', svg, count=1)

    return re.sub(r"\n\s*\n+", "\n", svg).strip()


def main() -> None:
    specs = sorted(HERE.glob("*.json"))
    diagrams = {}
    with tempfile.TemporaryDirectory() as tmp:
        for spec in specs:
            diagrams[spec.stem] = extract_svg(render(spec, Path(tmp)), spec.stem)
            print(f"ok  {spec.stem}")

    body = ",\n".join(f"  {json.dumps(k)}: {json.dumps(v, ensure_ascii=False)}" for k, v in diagrams.items())
    OUT.write_text(
        "/* 자동 생성 파일. 직접 고치지 말고 diagrams/*.json 을 고친 뒤\n"
        "   python3 diagrams/build.py 를 다시 돌린다. */\n"
        f"export const DIAGRAMS: Record<string, string> = {{\n{body},\n}};\n",
        encoding="utf-8",
    )
    print(f"wrote {OUT.relative_to(HERE.parent)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
