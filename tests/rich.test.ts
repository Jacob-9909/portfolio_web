import { test } from "node:test";
import assert from "node:assert/strict";
import { rich } from "../src/lib/rich.ts";

test("rich parses **bold** spans", () => {
  assert.deepEqual(rich("a **b** c"), ["a ", { b: "b" }, " c"]);
  assert.deepEqual(rich("**x**"), [{ b: "x" }]);
  assert.deepEqual(rich("**a** and **b**"), [{ b: "a" }, " and ", { b: "b" }]);
});

test("rich leaves unpaired markers as text", () => {
  assert.deepEqual(rich("x ** y"), ["x ** y"]);
  assert.deepEqual(rich("plain"), ["plain"]);
});
