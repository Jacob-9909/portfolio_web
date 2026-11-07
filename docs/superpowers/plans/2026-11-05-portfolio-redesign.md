# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the document-style portfolio with a dark, Maggie-Appleton-toned page: a one-sentence hero with hover evidence, a four-project "list + fixed stage" where an agent diagram steps through its flow, then career and skills.

**Architecture:** Pure logic (stage reducer, SVG geometry, flow data integrity) lives in small `src/lib/*.ts` modules tested with Node's built-in runner. Each project's diagram is hand-authored data in `src/lib/flows.ts` (explicit node boxes, edges, loops, steps) rendered by one `FlowDiagram` SVG component. The archify pipeline (`diagrams/`, `src/lib/diagrams.ts`) is retired.

**Tech Stack:** Next.js 14 App Router (static export, `basePath: "/portfolio_web"`), React 18, Tailwind 3, TypeScript, `node --test` (Node 26 strips types natively; no new dependencies).

**Spec:** `docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md`

## Global Constraints

- Dark theme only. Colors: bg `#1b1915`, text `#ede7db`, body `#cfc8ba`, muted `#a39b8d`, dim `#5d574d`, line `#3a362f`, accent (hi) `#f0866a` as one CSS variable.
- Role colors: human `#d9c2a0`, agent `#f0866a`, guard `#7fc8b8`, out `#9db4ff`, llm/db/tool `#a39b8d`.
- Fonts: headings Hahmlet (Google Fonts `<link>`, weights 300/400/600), body Pretendard Variable (existing CDN link). `word-break: keep-all`.
- Motion: every transition ≤ 0.3s, reacts immediately to input; no custom cursor; no scroll-driven steps; `prefers-reduced-motion` disables transitions and the loop pulse.
- Rejected patterns must not appear: uppercase letter-spaced kickers, pill tags, bordered card grids, gradients, emoji, typing animations, handwriting fonts.
- Copy: 합니다체; no third-person self-introduction; no grand declaratives; concrete nouns and numbers; anything invented (e.g. example question) is labeled 예시 / example. Facts must stay within `~/job/02_핵심-스펙.md`, `~/job/03_스토리뱅크.md`, and current `src/lib/data.ts`. Marketing Hub accuracy always carries "(팀 성과)" / "(team result)". 맛선: never state a final routing accuracy, never say the ADK issue was merged upstream.
- Projects, in order: `seonil`, `marketinghub`, `nhrag`, `matseon`. Remaining sections: career, skills. Removed: principles, timeline, "그 밖에 한 일", student, DACON, theme toggle.
- KO/EN toggle stays (`src/lib/LanguageContext.tsx`, unchanged).
- Keep static export and `basePath`. No new npm dependencies.
- Contrast WCAG AA; whole stage usable by keyboard; diagrams have a text alternative.

## Review Focus

1. Arrow keys pressed while focus is outside the project widget must scroll the page normally, not change projects or steps. (Task 7 manual check.)
2. Selecting a project with fewer steps than the current step index must land on step 0, never an out-of-range step. (Task 1 test `selectProject resets step`.)
3. Switching KO/EN mid-walkthrough keeps the same project and step. (Task 7 manual check; state lives outside language.)
4. On a touch device (no hover) every hero evidence note is reachable by tap and closable. (Task 6 manual check at 390px with touch emulation.)
5. Under `prefers-reduced-motion: reduce` the retry-loop pulse does not animate. (Task 5 manual check with emulation.)

---

### Task 1: Test harness and stage reducer

**Files:**
- Modify: `package.json` (add `"test": "node --test tests/"` to scripts)
- Modify: `tsconfig.json` (add `"allowImportingTsExtensions": true` to compilerOptions so tests can import `../src/lib/x.ts`)
- Create: `src/lib/stage.ts`
- Test: `tests/stage.test.ts`

**Interfaces:**
- Produces:
  - `type StageState = { project: number; step: number }`
  - `type StageAction = { type: "next" } | { type: "prev" } | { type: "goto"; step: number } | { type: "selectProject"; project: number }`
  - `stageReducer(state: StageState, action: StageAction, stepCounts: number[]): StageState` — `stepCounts[i]` = number of steps of project `i`.
  - `nodeState(itemStep: number, current: number): "future" | "current" | "past"`

- [ ] **Step 1: Write the failing tests** in `tests/stage.test.ts` using `node:test` and `node:assert/strict`, importing from `../src/lib/stage.ts`:

```ts
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
```

- [ ] **Step 2: Run** `npm test` — Expected: FAIL (cannot find module `../src/lib/stage.ts`).
- [ ] **Step 3: Implement** `stageReducer` and `nodeState` in `src/lib/stage.ts`. No enums (Node type stripping does not support them).
- [ ] **Step 4: Run** `npm test` — Expected: 6 passing. Run `npx tsc --noEmit` — Expected: no errors.
- [ ] **Step 5: Commit** `git add package.json tsconfig.json src/lib/stage.ts tests/stage.test.ts && git commit -m "feat: stage reducer with node test runner"`

### Task 2: SVG geometry

**Files:**
- Create: `src/lib/geometry.ts`
- Test: `tests/geometry.test.ts`

**Interfaces:**
- Produces:
  - `type Box = { x: number; y: number; w: number; h: number }` (top-left origin)
  - `type Role = "human" | "agent" | "guard" | "out" | "llm" | "db" | "tool"`
  - `edgePath(a: Box, b: Box): string` — orthogonal connector from `a` to `b`. Same center y (|Δ| < 1): horizontal from the facing side of `a` to the facing side of `b`. Same center x: vertical from facing top/bottom. Otherwise elbow: horizontal out of `a`'s facing side to `b`'s center x, then vertical into `b`'s facing top/bottom. Ends exactly on `b`'s border (arrowheads come from an SVG marker).
  - `loopPath(from: Box, to: Box, lift?: number): string` — default `lift = 58`; cubic arc between the two boxes' top centers: `M fcx fy C fcx fy-lift, tcx ty-lift, tcx ty` where `fy = from.y`, `ty = to.y`.
  - `shapePath(role: Role, b: Box): string` — outline per role: human = speech bubble with tail bottom-left, out = speech bubble with tail bottom-right, guard = hexagon with 16px points left/right, agent = rect radius 10, llm = rect radius 4 (pins drawn separately by the component), db = cylinder (ellipse ry 9), tool = rect radius 8 (component dashes it).
  - Numbers in output strings are integers or trimmed decimals (no `150.000`).

- [ ] **Step 1: Write the failing tests:**

```ts
const A = { x: 0, y: 128, w: 120, h: 44 };
const B = { x: 168, y: 128, w: 124, h: 44 };
const C = { x: 180, y: 232, w: 100, h: 40 };
test("horizontal edge", () => assert.equal(edgePath(A, B), "M120 150 H168"));
test("vertical edge", () => assert.equal(edgePath(B, { x: 180, y: 232, w: 100, h: 40 }), "M230 172 V232"));
test("elbow edge", () => assert.equal(edgePath(A, C), "M120 150 H230 V232"));
test("right-to-left edge", () => assert.equal(edgePath(B, A), "M168 150 H120"));
test("loop", () => assert.equal(loopPath({ x: 340, y: 128, w: 124, h: 44 }, B), "M402 128 C402 70, 230 70, 230 128"));
test("hexagon", () => assert.equal(shapePath("guard", { x: 340, y: 128, w: 124, h: 44 }), "M356 128 H448 L464 150 L448 172 H356 L340 150Z"));
test("every role gives a path", () => {
  for (const r of ["human", "agent", "guard", "out", "llm", "db", "tool"] as const)
    assert.match(shapePath(r, A), /^M/);
});
```

- [ ] **Step 2: Run** `npm test` — Expected: geometry tests FAIL (module missing).
- [ ] **Step 3: Implement** `src/lib/geometry.ts` to the signatures above. Reference shapes: `.superpowers/brainstorm/13246-1793879179/content/spike-v4.html` (bubble, hexagon, cylinder paths).
- [ ] **Step 4: Run** `npm test` — Expected: all passing.
- [ ] **Step 5: Commit** `git commit -m "feat: svg geometry for flow diagrams"` (add both files).

### Task 3: Dark theme foundation

**Files:**
- Modify: `tailwind.config.ts` — replace `colors.t` with `bg, text, body, muted, dim, line, hi` mapped to `rgb(var(--t-<name>) / <alpha-value>)`; add `fontFamily.serif: ["Hahmlet", "serif"]`; remove `darkMode`.
- Modify: `src/app/globals.css` — rewrite: `:root` tokens (Global Constraints values as RGB triplets, plus `--r-human … --r-tool`), `color-scheme: dark`, base link/focus/selection styles using `--t-hi`, `.ph` hover-phrase styles (accent fills left→right over 0.25s, dashed underline, text turns bg color), `@media print` (white bg, black text, links plain), `@media (prefers-reduced-motion: reduce)` (transitions off). Delete all archify `.diagram`/`.c-*`/`.a-*` rules and `--d-*` vars.
- Modify: `src/app/layout.tsx` — remove theme `<script>`; `themeColor: "#1b1915"`; add Hahmlet `<link href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@300;400;600&display=swap">`; `<html lang="ko" className="...">`; update `DESCRIPTION` to "디딤 AI Engineer 정우혁입니다. 은행 폐쇄망과 공장에서 Text-to-SQL 에이전트를 만들어 왔습니다."
- Modify: `.gitignore` — add `.superpowers/`.

**Interfaces:**
- Produces: Tailwind classes `bg-t-bg text-t-text text-t-body text-t-muted text-t-dim border-t-line text-t-hi bg-t-hi font-serif`; CSS vars `--t-*`, `--r-human`, `--r-agent`, `--r-guard`, `--r-out`, `--r-res` (RGB triplets); CSS class `.ph`.

- [ ] **Step 1: Apply the three file edits and `.gitignore`.**
- [ ] **Step 2: Run** `npm run build` — Expected: build succeeds (old page renders with missing colors; it is replaced in Task 8).
- [ ] **Step 3: Commit** `git commit -m "feat: dark theme tokens and fonts"`.

### Task 4: Content data and flows

**Files:**
- Modify: `src/lib/data.ts` — rewrite `translations` (ko, en) to the shape below; keep `LINKS` (email, github, blog, portfolio) and the ledger comment at the top; delete `TIMELINE`, `TIMELINE_NOW`, `Span`, `Principle`, `Item`, `CodeSample`, tablefold/Midas/DACON constants, `principles`, `more`, `student`, `dacon`.
- Create: `src/lib/flows.ts`
- Modify (temporary): `src/app/page.tsx` — replace with a minimal client shell rendering `<main id="main" />` inside the layout, because the old page depends on removed data. Tasks 5–8 mount components into it.
- Test: `tests/flows.test.ts`

**Interfaces:**
- Consumes: `Box`, `Role` from `src/lib/geometry.ts`.
- Produces (data.ts):
  - `type ProjectId = "seonil" | "marketinghub" | "nhrag" | "matseon"`
  - `type Seg = string | { text: string; note: string; src: string }`
  - `interface Project { id: ProjectId; title: string; meta: string; headline: string; number: string; stack: string }`
  - `export type T = (typeof translations)["ko"]`
  - `translations[lang]` = `{ name, role, hero: { title: Seg[]; sub: Seg[] }, nav: { projects, career, skills, blog, email, github, portfolio, language }, labels: { step, example, prev, next, skip }, projects: Project[], career: Row[], skills: Row[] }`; `Row` unchanged.
- Produces (flows.ts):
  - `type L = { ko: string; en: string }`
  - `interface FlowNode extends Box { id: string; role: Role; step: number; label: L; sub?: L }`
  - `interface FlowEdge { from: string; to: string; step: number; link?: boolean }` (`link` = dotted resource connection, no arrow)
  - `interface FlowLoop { from: string; to: string; step: number; tries: number; note: L }`
  - `interface Flow { width: number; height: number; nodes: FlowNode[]; edges: FlowEdge[]; loops: FlowLoop[]; steps: L[] }`
  - `const FLOWS: Record<ProjectId, Flow>`

**Fixed copy (ko):**
- hero.title: `["틀리면 안 되는 ", { text: "숫자", note: "Text-to-SQL에서 숫자는 LLM이 쓰지 않고 DB 쿼리 결과에서 나옵니다. 범농협 RAG에서는 수치 표를 따로 처리하는 파이프라인을 분리했습니다.", src: "선일다이파스 · 마케팅허브 · 범농협" }, "는 LLM한테 맡기지 않습니다."]`
- hero.sub: `["정우혁 · Didim AI Engineer. ", { text: "은행 폐쇄망", note: "외부 API를 쓸 수 없는 농협은행 마케팅허브에서 현업 질의 정확도를 60%에서 95~100%로 올렸습니다 (팀 성과).", src: "농협은행 마케팅허브 Text-to-SQL" }, "과 ", { text: "공장", note: "조회 한 번에 2~3일 기다리던 진천공장 실무진이 이제 30초 만에 답을 받습니다.", src: "선일다이파스 Text-to-SQL" }, "에서 Text-to-SQL 에이전트를 만들어 왔습니다."]`
- en hero.title main sentence: "I don't let LLMs handle numbers that can't be wrong." (phrase = "numbers"). en hero.sub: "Woohyuck Jeong · AI Engineer at Didim. I've been building Text-to-SQL agents for closed-network banks and factories." Translate notes faithfully.
- Project `number` (ko / en): seonil `2~3일 → 30초` / `2–3 days → 30 s`; marketinghub `60% → 95~100% (팀 성과)` / `60% → 95–100% (team result)`; nhrag `3,000쪽` / `3,000 pages`; matseon `첫 토큰 20% 단축` / `First token 20% faster`.
- Project meta/stack: reuse current `data.ts` values for seonil, marketinghub, nhrag. matseon: meta `농협중앙회 · Didim, 2025.04 ~ 2025.08` / `NACF · Didim, 2025.04 ~ 2025.08`; stack `Python, Google ADK, LangGraph, React, Vertex AI Search, Google Search`; title `농협 맛선 상품 추천 에이전트` / `NH Matseon product recommendation agent`; headline `쌀과 잡곡을 고객 취향에 맞춰 추천하는 농협 상품몰 에이전트`.
- seonil headline: `공장 실무진이 전산팀을 거치지 않고 ERP에 직접 묻는 에이전트`. Others: write one line in the same register.
- seonil steps (ko, exact):
  1. `진천공장 실무진은 SQL을 모릅니다. 전에는 전산팀에 요청하고 답을 2~3일 기다렸습니다. 예시 질문: "지난달 품목별 생산량 보여줘"`
  2. `의도를 분류하고 필요한 스키마만 골라, 공장 안의 온프레미스 LLM이 SQL을 작성합니다. 데이터는 밖으로 나가지 않습니다.`
  3. `sqlglot으로 문법을, NOEXEC로 실행 계획을 확인합니다. 통과하지 못하면 다시 쓰게 하되 3회까지만입니다.`
  4. `결과가 0행이면 "없음"으로 끝내지 않고 이전 월로 다시 볼지 묻습니다. 진천공장 실무진 인터뷰에서 나온 요구입니다.`
  5. `조회 대기가 2~3일에서 30초로 줄었습니다. 현장 실무진 120명이 한 달에 600번 씁니다.`

**Node → step mapping** (labels/sublabels from `diagrams/<key>.json` and `diagrams/en.json`; coordinates are yours within the flow's width/height, main lane center y ≈ 150, resource lane below):

| Flow | Step 0 | Step 1 | Step 2 | Step 3 | Step 4 | Loop |
|---|---|---|---|---|---|---|
| seonil | q (human) | gen (agent), llm (llm) | check (guard), erp (db) | answer (out) | — (result) | check→gen, step 2, tries 3, "실패하면 다시 생성" |
| marketinghub | q (human) | retrieve (agent), meta (db), admin (out) | gen (agent), llm (llm) | explain (guard), oracle (db) | — (result) | explain→gen, step 3, tries 3, "오류면 다시 생성" |
| nhrag | docs (human) | ocr (llm) | chunk (agent), index (db) | search (agent), llm (llm) | ui (out) | none |
| matseon | taste (human: "고객 취향" / "게임하기 UI") | intent (agent: "의도 분류" / "LangGraph 노드") | rag (agent: "하이브리드 RAG" / "페르소나 12종"), vsearch (db: "Vertex AI Search" / "사내 상품"), gsearch (tool: "Google Search" / "외부 정보") | answer (out: "추천 답변" / "React 스트리밍") | — | none |

Step facts for the non-fixed flows (write the copy, ≤ 2 sentences each, ko + en):
- marketinghub: closed network, no external API → metadata search, business users register metadata in Meta Admin, KURE-V1 fine-tuned on finance terms → Pseudo-SQL first, GPT-oss-120b on vLLM chosen after Gemma and EXAONE → SQL Explain check, regenerate up to 3 times → accuracy on 100 real questions 60% → 95~100% (팀 성과), 20 users, 200 times a month.
- nhrag: ~60 manuals, 3,000 pages → Vision OCR to markdown keeping tables and two-column layout, numeric tables in a separate pipeline → clause-level chunks keeping document name and page → branch staff question, evidence search, LLM answer → answer shows document and page; proposed (outside requirements) opening the source at the cited position.
- matseon: game-style UI collects household type and texture preference → first design was Tool Calling; it kept failing, was slow and inconsistent, so routing moved to a LangGraph intent node, judged by routing accuracy on scenarios ("찰진 저당 잡곡" vs "잘 팔리는 잡곡") → 12 personas in the prompt, hybrid RAG over Vertex AI Search (in-house products) and Google Search → streaming answer; found a sync call blocking the event loop inside Google ADK `lite_llm`, first token 20% faster (measured per node in the LLMOps tool), filed an upstream issue.

- [ ] **Step 1: Write the failing integrity test** `tests/flows.test.ts` importing `FLOWS` from `../src/lib/flows.ts` and `translations` from `../src/lib/data.ts`:

```ts
const ids = ["seonil", "marketinghub", "nhrag", "matseon"] as const;
test("project order", () => {
  assert.deepEqual(translations.ko.projects.map(p => p.id), ids);
  assert.deepEqual(translations.en.projects.map(p => p.id), ids);
});
for (const id of ids) test(`${id} flow is consistent`, () => {
  const f = FLOWS[id];
  const nodeIds = new Set(f.nodes.map(n => n.id));
  assert.equal(nodeIds.size, f.nodes.length);
  for (const n of f.nodes) assert.ok(n.step >= 0 && n.step < f.steps.length, n.id);
  for (const e of [...f.edges, ...f.loops]) { assert.ok(nodeIds.has(e.from)); assert.ok(nodeIds.has(e.to)); assert.ok(e.step < f.steps.length); }
  assert.ok(f.nodes.some(n => n.step === 0));
  for (const s of f.steps) { assert.ok(s.ko.trim()); assert.ok(s.en.trim()); }
  for (const n of f.nodes) { assert.ok(n.x >= 0 && n.y >= 0 && n.x + n.w <= f.width && n.y + n.h <= f.height, n.id); }
});
test("marketinghub keeps team-result label", () => {
  const p = translations.ko.projects.find(p => p.id === "marketinghub");
  assert.match(p!.number, /팀 성과/);
});
test("no self third-person intro", () => {
  assert.doesNotMatch(JSON.stringify(translations.ko.hero), /정우혁은/);
});
```

Note: `data.ts` must import nothing with an `@/` alias (only `import type`), so Node can load it.

- [ ] **Step 2: Run** `npm test` — Expected: FAIL (flows module missing / old data shape).
- [ ] **Step 3: Rewrite `src/lib/data.ts` and create `src/lib/flows.ts`** per the interfaces, fixed copy and mapping table.
- [ ] **Step 4: Run** `npm test && npm run build` — Expected: all tests pass; build succeeds with the shell page.
- [ ] **Step 5: Show the user** every step text (ko) for marketinghub, nhrag, matseon and the four headlines; apply their edits before continuing. Re-run `npm test`.
- [ ] **Step 6: Commit** `git commit -m "feat: four-project content and flow data"`.

### Task 5: FlowDiagram component

**Files:**
- Create: `src/components/FlowDiagram.tsx`
- Create: `src/components/icons.tsx` (one `<symbol>` set: user, code, shield, chat, chip, db, globe — 18×18 viewBox, stroke 1.6, paths from `spike-v4.html`; add a simple globe for `tool`)

**Interfaces:**
- Consumes: `Flow`, `FlowNode` from flows.ts; `edgePath`, `loopPath`, `shapePath` from geometry.ts; `nodeState` from stage.ts.
- Produces: `FlowDiagram({ flow, step, lang, title }: { flow: Flow; step: number; lang: "ko" | "en"; title: string }): JSX.Element` — an `<svg role="img">` with `<title>` = `title` and `<desc>` = all node labels in order.

Rendering rules (spec 3.5):
- Node group gets role color via `--k: var(--r-<role>)` (llm/db/tool → `--r-res`). Role caption above-left of the shape (사람/에이전트/검증/응답/자원 · Person/Agent/Check/Response/Resource), 11.5px, role color. Icon left inside shape, label 15.5px weight 500, sublabel 12.5px muted below.
- State by `nodeState(node.step, step)`: future → opacity 0.28; past → fill role 8%; current → fill role 26%, stroke 2.2. Transitions 0.15s.
- Edges: muted, 1.8px, arrow marker; drawn (stroke-dashoffset 0.3s ease-out) once `edge.step <= step`; `link` edges dotted, no marker. llm nodes get 5 pins top and bottom.
- Loops: drawn in the `from` node's role color when `loop.step <= step`; while `loop.step === step` a 5px dot travels the loop (requestAnimationFrame or interval) and the note shows "`{note} · k / tries`", then "통과"/"passed" on the last lap; no dot and no interval when `matchMedia("(prefers-reduced-motion: reduce)")` matches.

- [ ] **Step 1: Implement both files.**
- [ ] **Step 2: Temporary visual check** — render `<FlowDiagram flow={FLOWS.seonil} step={2} … />` in `src/app/page.tsx` temporarily (replace body), run `npm run dev`, open `http://localhost:3100/portfolio_web/` at 1280×800 and compare with `spike-v4.html` step 3. Expected: same roles/shapes/colors, current node filled, loop dot moving. Repeat for the other three flows at their last step; check no labels overlap edges.
- [ ] **Step 3: Reduced motion check** — emulate `prefers-reduced-motion: reduce` in DevTools; Expected: no moving dot.
- [ ] **Step 4: Revert the temporary page edit; `npm run build` passes. Commit** `git commit -m "feat: FlowDiagram component"`.

### Task 6: Hero

**Files:**
- Create: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `Seg`, `translations` from data.ts; `useLanguage`.
- Produces: `Hero({ t, lang }: { t: T; lang: "ko" | "en" }): JSX.Element` (`T` from data.ts), plus top nav (name left; 프로젝트 · 경력 · 기술 anchors, blog link, KO/EN switch right).

Behavior: full-viewport-height section (min-h ≈ 92vh). `hero.title` in Hahmlet 300 (name-free sentence), clamp(2.4rem, 5.4vw, 4.6rem), line-height 1.22. `hero.sub` Pretendard 1.2rem, body color, max 34em. Each object `Seg` renders as `<button type="button" className="ph" aria-expanded aria-controls>`; note opens on pointer hover, keyboard focus, or click/tap, closes on leave/blur/Escape/second tap; note is a small panel below the phrase (`#26231e`, 1px line border, 13.5px, source line muted). One note open at a time.

- [ ] **Step 1: Implement and mount `<Hero>` in the shell page** (`useLanguage()` → `t = translations[lang]`).
- [ ] **Step 2: Verify in dev server**: hover each phrase at 1280px → accent sweep ≤ 0.25s and note appears; Tab to each phrase → note appears; Escape closes. DevTools device mode 390×844 with touch → tap opens, tap again closes.
- [ ] **Step 3: Commit** `git commit -m "feat: hero with evidence notes"`.

### Task 7: ProjectStage (desktop stage + mobile accordion)

**Files:**
- Create: `src/components/ProjectStage.tsx`

**Interfaces:**
- Consumes: `stageReducer`, `StageState` (stage.ts); `FLOWS` (flows.ts); `FlowDiagram`; `Project` (data.ts).
- Produces: `ProjectStage({ t, lang }: { t: T; lang: "ko" | "en" }): JSX.Element`, section `id="projects"`. Mount it under `<Hero>` in the page.

Behavior:
- State via `useReducer` with `stepCounts = t.projects.map(p => FLOWS[p.id].steps.length)`; state is independent of `lang`.
- **lg and up:** grid `15rem | 1fr`, section fits one viewport height, no sticky, no scroll-driven steps. Left: `role="tablist" aria-orientation="vertical"` of four `role="tab"` buttons (title + `number` in muted under it), roving tabindex, selected has 2px left border in accent. ↑/↓ move selection only while focus is in the tablist. Right: `role="tabpanel"` with meta (muted 14px), headline (Hahmlet 400, ~1.6rem), stack line (muted 13px), `FlowDiagram`, step text panel (text swaps in place, `aria-live="polite"`), step bar (one 22×3px segment per step, filled up to current, each a button "단계 n" / "Step n"), prev/next buttons, "n / N". ←/→ change steps while focus is anywhere inside the stage.
- **below lg:** the tablist/panel is hidden; render a list of four rows (title, number); tapping a row opens it in place (only one open) showing headline, `FlowDiagram` (horizontal scroll if narrower than ~36rem), step text and prev/next.
- `print:hidden` on the whole interactive stage (print output comes from Task 8).

- [ ] **Step 1: Implement.**
- [ ] **Step 2: Verify in dev server at 1280×800:** click each project → diagram swaps, step resets to 1; ←/→ with focus in stage changes steps; focus on the hero (outside stage) and press ↓ → page scrolls, stage unchanged (Review Focus 1); on step 3 switch to EN → same project and step (Review Focus 3). At 390×844: rows expand one at a time, steps work by buttons.
- [ ] **Step 3: Commit** `git commit -m "feat: project stage with keyboard and mobile accordion"`.

### Task 8: Page assembly and pipeline removal

**Files:**
- Modify (rewrite): `src/app/page.tsx` — compose `Hero`, `ProjectStage`, career section (`id="career"`), skills section (`id="skills"`), footer (email, blog, GitHub, portfolio PDF from `LINKS`), and a `hidden print:block` section that lists the four projects with `FlowDiagram` at the last step plus an ordered list of all step texts.
- Delete: `src/lib/diagrams.ts`, `diagrams/` (build.py, all JSON).

Career/skills: Hahmlet 400 section heading (~1.5rem), two-column `period | text` rows (`9.5rem` first column on sm+), rows separated by spacing not lines, body color text, muted period. Max width 46rem. No other sections.

- [ ] **Step 1: Rewrite `page.tsx`, delete the archify files.** `grep -rn "diagrams\|DIAGRAMS\|TIMELINE\|principles" src` → Expected: no matches.
- [ ] **Step 2: Run** `npm test && npm run lint && npm run build` — Expected: all succeed; `out/index.html` exists.
- [ ] **Step 3: Verify built output under the real base path:** in the session scratch dir, `mkdir -p site && ln -sfn "$PWD/out" site/portfolio_web && python3 -m http.server -d site 3200`, open `http://localhost:3200/portfolio_web/`; Expected: fonts load, PDF link resolves. Check at 1280×800 and 390×844 that the page order is hero → projects → career → skills → footer, and Chrome print preview (Emulate CSS media "print") shows white background, four projects with diagrams and step lists, no stage controls.
- [ ] **Step 4: Commit** `git commit -m "feat: assemble redesigned page, retire archify diagrams"`.

### Task 9: Legacy cleanup and final check

**Files:**
- Delete (after the check below): `css/`, `scss/`, `fonts/`, `js/`, `images/`, `index.html`, `single.html`, `design/tablefold-figma.html` (untracked).

- [ ] **Step 1: Confirm unused:** `grep -rn "css/\|scss/\|fonts/\|js/\|images/\|single.html" src next.config.mjs .github` → Expected: no matches. If anything matches, keep that path and note it.
- [ ] **Step 2: Ask the user before deleting** `images/` and `design/` (they may hold assets they want); delete the rest with `git rm -r`.
- [ ] **Step 3: Run** `npm test && npm run build` — Expected: pass.
- [ ] **Step 4: Final screenshots** at 1280×800 (hero, stage on each project's last step) and 390×844 for the user to review.
- [ ] **Step 5: Commit** `git commit -m "chore: remove legacy static site assets"`.
