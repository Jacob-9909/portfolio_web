import { test } from "node:test";
import assert from "node:assert/strict";
import { edgePath, loopPath, shapePath } from "../src/lib/geometry.ts";

const A = { x: 0, y: 128, w: 120, h: 44 };
const B = { x: 168, y: 128, w: 124, h: 44 };
const C = { x: 180, y: 232, w: 100, h: 40 };

test("horizontal edge", () => assert.equal(edgePath(A, B), "M120 150 H168"));
test("vertical edge", () => assert.equal(edgePath(B, { x: 180, y: 232, w: 100, h: 40 }), "M230 172 V232"));
test("elbow edge", () => assert.equal(edgePath(A, C), "M120 150 H230 V232"));
test("right-to-left edge", () => assert.equal(edgePath(B, A), "M168 150 H120"));
test("upward vertical edge", () => assert.equal(edgePath({ x: 180, y: 232, w: 100, h: 40 }, B), "M230 232 V172"));
test("loop", () => assert.equal(loopPath({ x: 340, y: 128, w: 124, h: 44 }, B), "M402 128 C402 70, 230 70, 230 128"));
test("hexagon", () =>
  assert.equal(shapePath("guard", { x: 340, y: 128, w: 124, h: 44 }), "M356 128 H448 L464 150 L448 172 H356 L340 150Z"));
test("decimals are trimmed", () => assert.equal(edgePath({ x: 0, y: 0, w: 15, h: 15 }, { x: 40, y: 0, w: 10, h: 15 }), "M15 7.5 H40"));
test("every role gives a path", () => {
  for (const r of ["human", "agent", "guard", "out", "llm", "db", "tool"] as const) assert.match(shapePath(r, A), /^M/);
});
