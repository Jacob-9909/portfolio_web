#!/bin/sh
# 공개용 포트폴리오 PDF를 다시 만든다.
# 원본(~/job/docs/02_포트폴리오/design/포트폴리오.html)은 건드리지 않고, 복사본에서
# 전화번호를 지우고 생년월일을 태어난 해만 남긴 뒤 Chrome으로 PDF를 뽑는다.
#
#   sh scripts/web-pdf.sh
set -eu

SRC="$HOME/job/docs/02_포트폴리오/design"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/woohyuck-jeong-portfolio.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cp -R "$SRC/." "$WORK/"
sed -e '/<span>010-[0-9-]*<\/span>/d' \
    -e 's|<span>\([0-9]\{4\}\)\. [0-9]\{2\}\. [0-9]\{2\}</span>|<span>\1년생</span>|' \
    "$WORK/포트폴리오.html" > "$WORK/web.html"

# 지워지지 않았으면 공개 파일을 만들지 않는다
if grep -q '010-[0-9]\{4\}-[0-9]\{4\}\|<span>[0-9]\{4\}\. [0-9]\{2\}\. [0-9]\{2\}</span>' "$WORK/web.html"; then
  echo "전화번호나 생년월일이 남아 있습니다. 원본 HTML의 표기가 바뀌었는지 확인하세요." >&2
  exit 1
fi

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=15000 --print-to-pdf="$OUT" "file://$WORK/web.html" 2>/dev/null
echo "wrote $OUT"
