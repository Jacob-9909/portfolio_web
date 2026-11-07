import { test } from "node:test";
import assert from "node:assert/strict";
import { stageReducer, nodeState, isAccordionOpen } from "../src/lib/stage.ts";

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

test("accordion row is open only when it is also the stage's project", () => {
  // 모바일에서 4번째를 열고, 데스크톱에서 1번째의 5단계로 간 뒤 돌아온 상황
  assert.equal(isAccordionOpen(3, { project: 0, step: 4 }, 3), false);
  assert.equal(isAccordionOpen(3, { project: 3, step: 1 }, 3), true);
  assert.equal(isAccordionOpen(null, { project: 3, step: 1 }, 3), false);
});

test("stepTitle uses the first node that appears at the step, else the fallback", async () => {
  const { stepTitle } = await import("../src/lib/stage.ts");
  const flow = {
    nodes: [
      { step: 0, label: { ko: "질문", en: "Ask" } },
      { step: 1, label: { ko: "생성", en: "Write" } },
      { step: 1, label: { ko: "LLM", en: "LLM" } },
    ],
    steps: [{ ko: "a", en: "a" }, { ko: "b", en: "b" }, { ko: "c", en: "c" }],
  };
  assert.equal(stepTitle(flow, 0, "ko", "결과"), "질문");
  assert.equal(stepTitle(flow, 1, "en", "Result"), "Write");
  assert.equal(stepTitle(flow, 2, "ko", "결과"), "결과");
});
