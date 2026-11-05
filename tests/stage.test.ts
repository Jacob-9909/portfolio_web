import { test } from "node:test";
import assert from "node:assert/strict";
import { stageReducer, nodeState } from "../src/lib/stage.ts";

const counts = [5, 3];

test("next advances and clamps at last step", () => {
  assert.deepEqual(stageReducer({ project: 0, step: 3 }, { type: "next" }, counts), { project: 0, step: 4 });
  assert.deepEqual(stageReducer({ project: 0, step: 4 }, { type: "next" }, counts), { project: 0, step: 4 });
});

test("prev clamps at 0", () => {
  assert.deepEqual(stageReducer({ project: 0, step: 0 }, { type: "prev" }, counts), { project: 0, step: 0 });
});

test("goto clamps into range", () => {
  assert.deepEqual(stageReducer({ project: 1, step: 0 }, { type: "goto", step: 9 }, counts), { project: 1, step: 2 });
});

test("selectProject resets step", () => {
  assert.deepEqual(stageReducer({ project: 0, step: 4 }, { type: "selectProject", project: 1 }, counts), { project: 1, step: 0 });
});

test("selectProject ignores out-of-range project", () => {
  assert.deepEqual(stageReducer({ project: 0, step: 2 }, { type: "selectProject", project: 7 }, counts), { project: 0, step: 2 });
});

test("nodeState", () => {
  assert.equal(nodeState(3, 2), "future");
  assert.equal(nodeState(2, 2), "current");
  assert.equal(nodeState(1, 2), "past");
});
