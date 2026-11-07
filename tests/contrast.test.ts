import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/* 작은 글씨에 쓰는 회색 토큰이 카드 바탕들 위에서 WCAG AA(4.5:1)를 넘는지.
   값은 globals.css 의 :root 에서 읽는다 (인쇄 블록 제외). */
const css = readFileSync("src/app/globals.css", "utf8").split("@media print")[0];
const token = (name: string) => {
  const m = css.match(new RegExp(`--${name}:\\s*(\\d+) (\\d+) (\\d+);`));
  assert.ok(m, name);
  return [m[1], m[2], m[3]].map(Number);
};
const lum = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: number[], b: number[]) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

for (const fg of ["t-dim", "t-muted", "t-body"]) {
  test(`${fg} meets 4.5:1 on every surface`, () => {
    for (const bg of ["t-bg", "t-band", "t-card", "t-raise"]) {
      const r = ratio(token(fg), token(bg));
      assert.ok(r >= 4.5, `${fg} on ${bg}: ${r.toFixed(2)}`);
    }
    /* 카드 안에 직접 쓴 가장 밝은 바탕 (#1d1e23) */
    const r = ratio(token(fg), [29, 30, 35]);
    assert.ok(r >= 4.5, `${fg} on #1d1e23: ${r.toFixed(2)}`);
  });
}
