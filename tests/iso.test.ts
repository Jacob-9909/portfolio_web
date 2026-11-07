import { test } from "node:test";
import assert from "node:assert/strict";
import { FIGS, isoBox } from "../src/lib/iso.ts";

test("isoBox returns three closed faces", () => {
  const faces = isoBox(0, 0, 0, 10, 10, 10);
  assert.equal(faces.length, 3);
  assert.ok(faces.every((d) => d.startsWith("M") && d.endsWith("Z")));
});

test("isoBox projects the origin to the given offset", () => {
  const [left] = isoBox(0, 0, 0, 0, 0, 0, 1, 150, 110);
  assert.ok(left.startsWith("M150,110"));
});

test("figures exist with their accents", () => {
  for (const k of ["bars", "docs", "router"] as const) assert.ok(FIGS[k].length > 0, k);
  assert.ok(FIGS.docs.some((p) => p.accent === "out"));
  assert.ok(FIGS.router.some((p) => p.accent === "hi"));
});
