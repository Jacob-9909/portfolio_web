/* 프로젝트 무대의 상태: 어느 프로젝트의 몇 번째 단계를 보고 있는지.
   언어와 무관하게 유지되어야 해서 화면 컴포넌트 밖에 둔다. */

export type StageState = { project: number; step: number };

export type StageAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "goto"; step: number }
  | { type: "selectProject"; project: number };

const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max);

/** stepCounts[i] 는 i번째 프로젝트의 단계 수 */
export function stageReducer(state: StageState, action: StageAction, stepCounts: number[]): StageState {
  const last = (stepCounts[state.project] ?? 1) - 1;
  switch (action.type) {
    case "next":
      return { ...state, step: clamp(state.step + 1, last) };
    case "prev":
      return { ...state, step: clamp(state.step - 1, last) };
    case "goto":
      return { ...state, step: clamp(action.step, last) };
    case "selectProject":
      if (action.project < 0 || action.project >= stepCounts.length) return state;
      return { project: action.project, step: 0 };
  }
}

/** 다이어그램 요소가 처음 켜지는 단계(itemStep)와 지금 단계로 상태를 정한다 */
export function nodeState(itemStep: number, current: number): "future" | "current" | "past" {
  if (itemStep > current) return "future";
  return itemStep === current ? "current" : "past";
}
