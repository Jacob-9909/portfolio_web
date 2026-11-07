# 포트폴리오 2차 리디자인 (Linear 방향) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 시안(`docs/superpowers/specs/2026-11-07-linear-mockup.html`)대로 사이트 전체를 차가운 검정·카드·역할 배지 디자인으로 바꾸고, 첫 화면에 네 프로젝트의 샘플 결과를 보여 주는 앱 창을 넣는다.

**Architecture:** 사실은 `src/lib/data.ts`(칸을 나눈 프로젝트 정보, 원칙, 경력, 기술), 앱 창 샘플은 새 `src/lib/samples.ts`에 둔다. 순수 로직(굵게 표시 파서, SQL 강조, 등각 그림 경로)은 `src/lib/`에 두고 `node --test`로 검사한다. 화면은 섹션별 컴포넌트로 나누고, 프로젝트 무대는 지금의 리듀서·`FlowDiagram`을 그대로 쓰면서 겉모습만 바꾼다.

**Tech Stack:** Next.js 14 App Router (`output: "export"`, basePath `/portfolio_web`), React 18, Tailwind 3, TypeScript, `node --test` (Node 26 타입 스트리핑).

**Spec:** `docs/superpowers/specs/2026-11-07-portfolio-linear-redesign-design.md`

## Global Constraints

- 브랜치 `redesign/linear` (기준 `feat/sticky-nav`, PR #2 미병합). push·merge·PR은 사용자가 요청할 때만.
- 어두운 테마만. KO/EN 모두. 언어를 바꿔도 앱 창 탭·무대 프로젝트·단계는 유지.
- 색 (spec §4.1): 바탕 `#08090a`, 띠 `#0d0e10`, 카드 `#111215`~`#17181c`, 글자 `#f7f8f8`, 본문 `#d0d6e0`, 보조 `#8a8f98`/`#9ba1ab`, 흐림 `#62666d`, 선 `#23252a`~`#2b2d33`. 역할 색 그대로: 사람 `217 194 160`, 에이전트(코랄) `240 134 106`, 검증 `127 200 184`, 응답 `157 180 255`, 자원 `138 143 152`.
- 글꼴 Pretendard 하나. Hahmlet 제거. 숫자·코드·FIG 라벨은 시스템 고정폭(`ui-monospace, Menlo, monospace`).
- 앱 창: 누를 때만 탭 전환(자동 전환·진행 막대 없음). 탭 줄 오른쪽 끝 "샘플 화면 · 예시 데이터"(EN "Sample screen · example data") 알약 상시 표시. 창 안 글씨 13px 이상. 누를 수 있는 것은 탭뿐.
- 사실/샘플 경계 (spec §4.10): 프로젝트 정보·대표 숫자·기간·스택·30초·재생성 상한 3회·사내 vLLM·외부 API 없음·3,000쪽·페르소나 12개·Vertex AI Search/Google Search·첫 토큰 20% 단축·쌀 상품 이름만 사실. 새 사실을 만들지 않는다. 1차 spec §3.4.1 "쓰면 안 되는 것"은 샘플에도 금지.
- 자기를 3인칭으로 소개하는 문구 금지(`정우혁은`).
- 아이콘은 `public/icons/`에 둔다. 런타임에 외부 이미지 URL을 쓰지 않는다.
- 섹션 띠 위아래 여백 84px 안팎. 움직임 0.15~0.3s, `prefers-reduced-motion`이면 끈다.
- `node --test`가 읽는 `src/lib/*.ts`는 `import type`만 쓰고 enum을 쓰지 않는다. 테스트는 `../src/lib/x.ts`로 import.
- 지금 테스트 25개는 계속 통과(내용이 바뀌는 테스트는 그 task에서 같이 고친다).

## Review Focus

1. 언어 전환: 앱 창에서 3번째 탭을 연 채 EN으로 바꾸면 같은 탭이 열려 있어야 한다. → Task 5 브라우저 확인.
2. 390px 모바일: 앱 창이 페이지를 가로로 밀면 안 된다. 탭 줄과 SQL 블록만 자기 안에서 가로 스크롤. → Task 5, Task 9 브라우저 확인.
3. 키보드: 앱 창 탭에서 ←→/Home/End가 탭을 옮기고, 무대의 ←→(단계 이동)와 섞이지 않는다. 프로젝트 탭에서 ←→는 프로젝트, 다이어그램 카드 안에서 ←→는 단계. → Task 5, Task 7 브라우저 확인.
4. 움직임 줄이기: 커서 깜빡임과 전환이 꺼진다. → Task 9 확인.
5. 인쇄: 내비·앱 창은 빠지고, 띠·카드는 흰 바탕, 프로젝트 넷이 모든 단계와 함께 펼쳐진다. → Task 9 PDF 확인.

---

### Task 1: 색·글꼴 토큰 교체

**Files:**
- Modify: `src/app/globals.css` (`:root` 토큰, print 블록)
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx` (Hahmlet 링크 제거, `themeColor: "#08090a"`)
- Modify: 지금 `font-serif`를 쓰는 곳 전부 (`grep -rn font-serif src`)

**Interfaces:**
- Produces: Tailwind 색 `t-bg`(8 9 10), `t-band`(13 14 16), `t-card`(17 18 21), `t-raise`(23 24 28), `t-text`(247 248 248), `t-body`(208 214 224), `t-muted`(155 161 171), `t-dim`(98 102 109), `t-line`(35 37 42), `t-edge`(43 45 51), `t-hi`(240 134 106), 역할 `r-human`/`r-agent`/`r-guard`/`r-out`/`r-res`(Tailwind 색으로도 노출: `role.human` 등). `fontFamily.mono`. `serif` 제거.

- [ ] **Step 1:** `:root` 값을 위 숫자로 바꾸고 `--t-band`, `--t-card`, `--t-raise`, `--t-edge`를 더한다. `--r-res`는 `138 143 152`. print 블록에 새 토큰(`band`, `card`, `raise`, `edge`)도 흰색/옅은 회색으로 넣는다.
- [ ] **Step 2:** `tailwind.config.ts`에 새 토큰과 `role` 색(`rgb(var(--r-x) / <alpha-value>)`), `mono` 글꼴을 넣고 `serif`를 지운다. `font-serif` 사용처를 `font-sans`(제목은 `font-semibold tracking-tight`)로 바꾼다.
- [ ] **Step 3:** 확인. Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`. Expected: 25 pass, 오류·경고 없음, 빌드 성공.
- [ ] **Step 4:** 1440×900 스크린샷으로 바탕이 차가운 검정이고 다이어그램 역할 색이 그대로인지 본다.
- [ ] **Step 5: Commit** `git commit -am "feat: cool-black tokens, single sans font"`

### Task 2: 사실 데이터 구조

**Files:**
- Modify: `src/lib/data.ts`
- Create: `tests/data.test.ts`
- Modify: `tests/flows.test.ts` (team-result 테스트는 그대로 두고, 새 칸 검사는 data.test로)

**Interfaces:**
- Produces (모두 `translations.ko`/`en`에 같은 모양으로):
  ```ts
  export type Kind = "sql" | "rag" | "rec";
  export interface Fact { label: string; value: string }
  export interface Metric { value: string; label: string }
  export interface Project { id; title; kind: Kind; kindLabel: string; meta; headline; number; stack;
    facts: Fact[];      // 앱 창 왼쪽·무대 왼쪽에 순서대로 (고객 또는 협업 / 기간 / 환경? / 스택)
    metrics: Metric[] } // 1~3개, metrics[0].value 는 number 에서 "(팀 성과)" 같은 괄호를 뺀 값
  export interface Principle { kind: Kind; fig: "bars" | "docs" | "router"; no: string; title: string; body: string /* **굵게** 표기 */; projects: string }
  export interface CareerItem { badge: string; period: string; org: string; role: string; text?: string; now?: boolean }
  export interface SkillItem { name: string; icon: string /* public/icons/<icon>.svg */ }
  export interface SkillGroup { title: string; variant?: "main" | "lang" | "cert"; items: SkillItem[] }
  ```
  `T`에 더해지는 키: `nav.contact`, `hero.sub`(근거 메모 3개), `labels.sample`, `labels.projectInfo`, `labels.runLog`, `labels.clients`, `sections: { how, projects, career, skills }`, `statement: { lead, rest }`, `principles: Principle[]`, `clients: string[]`, `career: CareerItem[]`, `skills: SkillGroup[]`.
- `Row`, 옛 `career`/`skills`(Row[]) 모양은 없앤다. `page.tsx`의 `Rows`가 깨지므로 이 task에서 임시로 새 모양을 그대로 출력하게만 고친다(Task 8에서 교체).

값 (KO, spec과 `flows.ts`에서 그대로):

| id | kindLabel | facts | metrics |
|---|---|---|---|
| seonil | Text-to-SQL | 고객 선일다이파스 진천공장 / 기간 Didim · 2026.04 ~ 08 / 환경 온프레미스 · MSSQL ERP / 스택 (지금 stack) | 2~3일 → 30초·조회 대기, 120명·현장 사용자, 월 600회·사용 |
| marketinghub | Text-to-SQL | 고객 NH농협은행 / 기간 Didim · 2025.09 ~ 2026.02 / 환경 은행 폐쇄망 · 외부 API 없음 / 스택 | 60% → 95~100%·정확도 (팀 성과), 20명·현업 사용자, 월 200회·사용 |
| nhrag | RAG 챗봇 | 협업 농협중앙회 · 삼일PwC · 삼정KPMG · Google / 기간 2025.04 ~ 08 / 스택 | 3,000쪽·업무방법서, 약 60개·문서 |
| matseon | 추천 에이전트 | 고객 농협중앙회 / 기간 Didim · 2025.04 ~ 08 / 스택 | 첫 토큰 20% 단축·응답 속도, 12가지·고객 페르소나 |

- `hero.sub` KO: `"디딤 AI Engineer 정우혁. "`, {`은행`, 지금 "은행 폐쇄망" 메모}, `", "`, {`공장`, 지금 "공장" 메모}, `", "`, {`농협 상품몰`, note `"농협 맛선 상품몰에서 쌀과 잡곡을 취향에 맞춰 추천하는 에이전트를 만들었습니다. 첫 토큰 응답을 20% 줄였습니다."`, src `"농협 맛선 추천 에이전트"`}, `"에서 Text-to-SQL·RAG 챗봇·추천 에이전트를 만들어 왔습니다."`. EN도 같은 구조.
- `statement`, `principles`, `clients`, `career`, `skills`(그룹 순서: AI main, 언어 lang, 백엔드·데이터, 인프라, 도구, 자격 cert) 문구는 spec §3.2·§3.4와 시안 그대로. 아이콘 키는 Task 3의 파일 이름.

- [ ] **Step 1: 실패하는 테스트 작성** `tests/data.test.ts`:
  ```ts
  for (const lang of ["ko", "en"] as const) {
    test(`${lang} projects have facts and 1-3 metrics`, () => {
      for (const p of translations[lang].projects) {
        assert.ok(p.facts.length >= 3 && p.facts.every((f) => f.label && f.value), p.id);
        assert.ok(p.metrics.length >= 1 && p.metrics.length <= 3, p.id);
        assert.ok(p.number.startsWith(p.metrics[0].value), p.id);
      }
    });
    test(`${lang} hero sub has three evidence notes`, () => {
      assert.equal(translations[lang].hero.sub.filter((s) => typeof s !== "string").length, 3);
    });
    test(`${lang} skills: icon keys and variants`, () => {
      const groups = translations[lang].skills;
      assert.deepEqual(groups.map((g) => g.variant ?? null), ["main", "lang", null, null, null, "cert"]);
      for (const g of groups) if (g.variant !== "cert") for (const i of g.items) assert.match(i.icon, /^[a-z0-9-]+$/);
    });
  }
  test("ko and en share shape", () => { /* principles 3개, career 3개, skills 아이템 수, metrics 수가 언어별로 같다 */ });
  test("marketinghub metric keeps team-result label", () => {
    assert.match(translations.ko.projects[1].metrics[0].label, /팀 성과/);
    assert.match(translations.en.projects[1].metrics[0].label, /team result/);
  });
  test("no self third-person intro", () => assert.doesNotMatch(JSON.stringify(translations.ko), /정우혁은/));
  ```
- [ ] **Step 2:** Run `node --test tests/data.test.ts`. Expected: FAIL (`facts` undefined 등).
- [ ] **Step 3:** `data.ts`를 위 Interfaces와 값으로 고친다. `page.tsx`가 컴파일되도록 임시 출력만 고친다.
- [ ] **Step 4:** Run `npm test && npx tsc --noEmit`. Expected: 전부 PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: structured project facts, principles, career, skills data"`

### Task 3: 기술 아이콘 타일

**Files:**
- Create: `public/icons/*.svg`
- Create: `tests/icons.test.ts`

**Interfaces:**
- Consumes: Task 2의 `SkillItem.icon`.
- Produces: 아이콘 파일 이름 = `icon` 키. 모든 파일은 256×256 viewBox, `rx=60` 둥근 사각 바탕 `#242938` 위에 로고.

출처 (spec §3.4 순서): skillicons.dev(`https://skillicons.dev/icons?i=<name>`, MIT) → python, java, pytorch, fastapi, postgres(PostgreSQL), docker, kubernetes, prometheus, gcp, react, nextjs. 사용자 README `Jacob-9909/Jacob-9909` `assets/` → langgraph(LangGraph), langchain(Deep Agent), mcp(MCP, 흰색), google-adk(PNG를 SVG 타일 안 `<image>`로 base64 삽입). Simple Icons(`https://cdn.simpleicons.org/<slug>`) 글리프를 타일에 얹기 → neo4j, vllm, claude(Claude Code), gemini(slug `googlegemini`). 글자 타일 → oracle "ORA" `#e2483d`, mssql "MS" `#cc2927`, pgvector "pgv" `#6f9fd8`, opik "Op" `#f5a524`, tableau "T" `#e97627`, codex "Cx" `#ffffff`, kiro "K" `#9f7aea`. 선 그림 타일 → rag(문서+돋보기, 응답 파랑), finetuning(슬라이더 3개, 코랄), sql(원통, 청록). 모양은 시안과 같게. 받은 파일은 저장소에 그대로 넣는다(빌드 때 다시 받지 않는다).

- [ ] **Step 1: 실패하는 테스트** `tests/icons.test.ts`: `translations.ko.skills`의 cert 아닌 그룹 아이템마다 `existsSync("public/icons/<icon>.svg")`이고, 파일 내용이 `<svg`로 시작하며 `http`를 포함하지 않는다(외부 참조 금지).
- [ ] **Step 2:** Run `node --test tests/icons.test.ts`. Expected: FAIL (파일 없음).
- [ ] **Step 3:** 위 출처대로 파일을 만든다.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `git add public/icons tests/icons.test.ts && git commit -m "feat: vendored skill icon tiles"`

### Task 4: 순수 로직 (굵게 파서, SQL 강조, 등각 그림)

**Files:**
- Create: `src/lib/rich.ts`, `src/lib/sql.ts`, `src/lib/iso.ts`
- Create: `tests/rich.test.ts`, `tests/sql.test.ts`, `tests/iso.test.ts`

**Interfaces:**
- Produces:
  - `rich(s: string): (string | { b: string })[]` — `**굵게**`만 해석. 짝 없는 `**`는 글자 그대로.
  - `highlightSql(sql: string, marks?: string[]): { t: string; k?: "kw" | "mark" }[]` — 키워드(대소문자 무관, 단어 경계): `WITH SELECT TOP FROM WHERE AND OR JOIN LEFT ON AS GROUP BY ORDER DESC ASC BETWEEN CAST DECIMAL NULLIF RANK OVER COUNT DISTINCT SUM MIN MAX ROUND`. `marks`의 단어는 `"mark"`. 나머지는 이어 붙인 평문 토큰.
  - `isoBox(x, y, z, w, d, h, s = 1, ox = 150, oy = 110): string[]` — 왼쪽·오른쪽·윗면 세 경로(`M…Z`), 소수 첫째 자리. 투영: `X = ox + (x−y)·cos30°·s`, `Y = oy + (x+y)·sin30°·s − z·s`.
  - `FIGS: Record<"bars" | "docs" | "router", { d: string; accent?: "out" | "hi" | "guard" }[]>` — 시안의 세 그림(막대 6개 / 문서 7장 더미 + 파란 한 장과 줄 4개 / 판 2개 → 상자 → 두 갈래, 한 갈래 코랄). 바탕 viewBox `0 0 300 220`.

- [ ] **Step 1: 실패하는 테스트**
  ```ts
  assert.deepEqual(rich("a **b** c"), ["a ", { b: "b" }, " c"]);
  assert.deepEqual(rich("x ** y"), ["x ** y"]);
  const toks = highlightSql("select a from t where b = 'x'", ["a"]);
  assert.deepEqual(toks.filter((t) => t.k === "kw").map((t) => t.t.toUpperCase()), ["SELECT", "FROM", "WHERE"]);
  assert.equal(toks.find((t) => t.k === "mark")?.t, "a");
  assert.equal(toks.map((t) => t.t).join(""), "select a from t where b = 'x'");
  const faces = isoBox(0, 0, 0, 10, 10, 10);
  assert.equal(faces.length, 3); assert.ok(faces.every((d) => d.startsWith("M") && d.endsWith("Z")));
  for (const k of ["bars", "docs", "router"] as const) assert.ok(FIGS[k].length > 0);
  assert.ok(FIGS.docs.some((p) => p.accent === "out")); assert.ok(FIGS.router.some((p) => p.accent === "hi"));
  ```
- [ ] **Step 2:** Run `node --test tests/rich.test.ts tests/sql.test.ts tests/iso.test.ts`. Expected: FAIL (모듈 없음).
- [ ] **Step 3:** 세 파일 구현.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5: Commit** `git commit -m "feat: rich text, SQL highlight, isometric figure helpers"`

### Task 5: 앱 창 샘플 데이터와 첫 화면

**Files:**
- Create: `src/lib/samples.ts`, `tests/samples.test.ts`
- Create: `src/components/AppWindow.tsx`, `src/components/SampleCards.tsx`, `src/components/RiceBag.tsx`, `src/components/SiteNav.tsx`
- Modify: `src/components/Hero.tsx`, `src/app/page.tsx`

**Interfaces:**
- Consumes: Task 2 `Project.facts/metrics`, `labels.sample/projectInfo/runLog/clients`, `clients`; Task 4 `rich`, `highlightSql`.
- Produces:
  ```ts
  type L = { ko: string; en: string };
  type Role = "agent" | "guard" | "out" | "human" | "cite";
  type Base = { role: Role; badge: L; title: L; meta: L };
  export type SampleCard =
    | (Base & { kind: "note" })                                   // 한 줄짜리 카드
    | (Base & { kind: "sql"; sql: string; marks?: string[] })
    | (Base & { kind: "table"; text?: L; head: L[]; rows: string[][]; tone?: (null | "up" | "down" | "strong")[][] })
    | (Base & { kind: "points"; text: L; points: { title: L; body: L; ref: L }[] })
    | (Base & { kind: "cites"; cites: { text: L; page?: string; note?: L }[]; follow: L[] })
    | (Base & { kind: "products"; products: { name: L; desc: L; bag: BagSpec }[]; text: L });
  export type BagSpec = { brand: L; name: L; weight: L; body: string; band: string };
  export type RailRow = { k: L; v: L; tone?: "ok" | "bad" | "big" } | { err: string };
  export interface SampleTab { id: ProjectId; tab: L; tag: string; ask: { who: L; text: L }; cards: SampleCard[]; rail: { title: L; groups: RailRow[][] } }
  export const SAMPLES: SampleTab[];
  ```
  `<AppWindow t lang />`, `<SiteNav t lang setLang />`.
- 내용: 시안의 네 탭을 그대로 옮기고(질문·쿼리·표·답·근거·상품·실행 기록) EN을 단다. 텍스트 안 굵게는 `**`. 쌀 포대 4개 색: 철원오대쌀 몸통 `#d8c9a8` 띠 `#3d6b4f`, 신동진 `#e6dcc6`/`#b0473a`, 찰현미 `#a8865a`/`#5a3d24`, 찰오곡 `#c9b48a`/`#2f4a6b`.

동작:
- 탭은 ARIA tabs(`role=tablist/tab/tabpanel`, roving tabindex, ←→ Home End). 클릭·키로만 바뀜. 선택 탭 상태는 `useState`로 `AppWindow` 안에 두고 언어와 무관.
- 데스크톱(lg↑): `grid-cols-[200px_1fr_270px]`. 네 패널을 같은 격자 칸에 겹쳐 렌더하고(`[grid-area:1/1]`), 안 보이는 패널은 `invisible` + `aria-hidden` + `inert` → 창 높이는 가장 긴 탭에 맞춰 고정(spec §4.6).
- 모바일(lg↓): 왼쪽·오른쪽 칸 숨김, 카드 위에 `{title} · {metrics[0].value}` 한 줄. 비활성 패널은 `hidden`. 탭 줄과 `pre`는 `overflow-x-auto`.
- 왼쪽 칸: "프로젝트 정보" 작은 제목, 이름, `facts`, 맨 아래 `metrics[0]`(코랄 굵게). 누를 수 있게 보이는 하이라이트·hover 없음.
- 카드: 왼쪽 3px 역할 색 띠, 머리줄 "배지 + 굵은 제목 + 회색 meta". 표의 `up` 청록·`down` 코랄·`strong` 흰 굵게. 스트리밍 커서는 CSS 깜빡임(움직임 줄이기면 정지).
- 첫 화면: `SiteNav`(고정 내비 + 오른쪽 "연락하기" 흰 알약 → `mailto:`), 큰 문장(Pretendard 600, `clamp(2.4rem,4.6vw,3.6rem)`, 근거 메모 유지), 소개 줄 + "포트폴리오 PDF →", `AppWindow`, 고객사 띠와 캡션.

- [ ] **Step 1: 실패하는 테스트** `tests/samples.test.ts`:
  ```ts
  assert.deepEqual(SAMPLES.map((s) => s.id), ["seonil", "marketinghub", "nhrag", "matseon"]);
  // 모든 {ko,en} 객체를 재귀로 찾아 둘 다 비어 있지 않은지
  walkL(SAMPLES, (l, path) => { assert.ok(l.ko.trim(), path); assert.ok(l.en.trim(), path); });
  for (const s of SAMPLES) for (const c of s.cards) {
    if (c.kind === "table") for (const r of c.rows) assert.equal(r.length, c.head.length);
    if (c.kind === "sql") assert.ok(c.sql.trim());
  }
  assert.equal(SAMPLES[3].cards.find((c) => c.kind === "products")!.products.length, 4);
  assert.doesNotMatch(JSON.stringify(SAMPLES), /정우혁은/);
  ```
- [ ] **Step 2:** Run `node --test tests/samples.test.ts`. Expected: FAIL.
- [ ] **Step 3:** `samples.ts` 작성 → 테스트 PASS 확인.
- [ ] **Step 4:** 컴포넌트 작성, `page.tsx`에서 기존 내비를 `SiteNav`로 교체하고 `Hero` 아래에 `AppWindow`와 고객사 띠를 넣는다.
- [ ] **Step 5:** Run `npm test && npx tsc --noEmit && npm run lint`. Expected: PASS, 경고 없음.
- [ ] **Step 6: 브라우저 확인** (dev 서버, 1440×900과 390×844):
  - 네 탭을 눌러 시안과 같은 내용이 나오는지, 탭을 바꿔도 아래 고객사 띠 위치가 그대로인지(높이 고정).
  - 3번째 탭 연 채 EN 전환 → 같은 탭 유지 (Review Focus 1).
  - 탭에 포커스 두고 → End Home 동작, 5초 기다려도 탭이 안 바뀜.
  - 390px에서 `document.documentElement.scrollWidth === 390` (Review Focus 2).
- [ ] **Step 7: Commit** `git commit -m "feat: hero app window with four sample tabs"`

### Task 6: 섹션 띠와 01 일하는 방식

**Files:**
- Create: `src/components/Section.tsx`, `src/components/Principles.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: Task 2 `sections`, `statement`, `principles`; Task 4 `rich`, `FIGS`.
- Produces: `<Section id no label tone="base" | "band">{children}</Section>` — 전체 폭 띠(`bg-t-bg` 또는 `bg-t-band`), 위쪽 1px 선, `py-[84px]`, 안쪽 `max-w-[80rem]`. 머리: 코랄 고정폭 번호 배지(`01`) + 굵은 섹션 이름.

- [ ] **Step 1:** `Section`, `Principles` 작성. 큰 문장은 `lead` 흰색 + `rest` `t-dim`. 카드 3장: 위 3px 역할 색(`sql`→agent, `rag`→out, `rec`→guard), 유형 배지, FIG 번호(고정폭), `FIGS[fig]` SVG(면 채움 `#0b0c0e`, 선 `#5b5f68`, accent 경로는 역할 색), 굵은 제목, `rich(body)`, 아래 구분선과 `projects`.
- [ ] **Step 2:** `page.tsx`에 `<Section no="01" tone="base">`로 넣는다(띠는 01 base, 02 band, 03 base, 04 band).
- [ ] **Step 3:** Run `npm test && npx tsc --noEmit && npm run lint`. Expected: PASS.
- [ ] **Step 4:** 1440 스크린샷을 시안의 같은 구간과 나란히 놓고 비교.
- [ ] **Step 5: Commit** `git commit -m "feat: section bands and principles cards"`

### Task 7: 02 프로젝트 무대 새 모양

**Files:**
- Modify: `src/components/ProjectStage.tsx`
- Modify: `src/components/FlowDiagram.tsx` (필요할 때만: 범례는 바깥에서 그린다)
- Test: `tests/stage.test.ts` (리듀서는 그대로, 테스트 유지)

**Interfaces:**
- Consumes: `stageReducer`, `isAccordionOpen`, `FLOWS`, `FlowDiagram({flow, step, lang, title})`, Task 2 `Project.kindLabel/facts/metrics/headline`, `labels.roles`.
- Produces: 같은 export `ProjectStage({t, lang})`.

데스크톱:
- 위: 프로젝트 탭 줄(알약, `제목 + 회색 kindLabel`, 선택은 흰 바탕 검은 글씨). `role=tablist`, `aria-orientation="horizontal"`, ←→ Home End로 프로젝트 선택(roving).
- 아래 `grid-cols-[330px_1fr] gap-7`. 왼쪽: `headline`(26px 700), metrics 카드(첫 값 코랄, 나머지 흰색, 오른쪽에 이름), facts 목록(고객/협업 항목은 빼고 기간·환경·스택).
- 오른쪽 다이어그램 카드(`tabpanel`, `tabIndex=0`): 머리줄 "작동 구조 / How it works" + 역할 범례(사람·에이전트·검증·응답·자원 네모 점), `FlowDiagram`, 그 아래 단계 카드 줄(`grid-cols-{steps}`; 4~5개). 단계 카드는 `button`, `aria-current="step"`, 누르면 `goto`. 현재 카드는 청록 테두리·청록 번호 원. 지금의 `StepControls`(막대·이전/다음)는 지운다.
- ←→ 단계 이동은 다이어그램 카드 안 키 입력만 받는다(탭 줄의 ←→와 분리, Review Focus 3). 현재 단계 문구는 `aria-live="polite"`인 시각적으로 숨긴 요소에도 넣는다.
모바일: 지금의 목록 펼침을 유지하고 새 카드 모양만 입힌다(단계 카드는 세로로 쌓고, 누르면 그 단계로).

- [ ] **Step 1:** 위대로 고친다.
- [ ] **Step 2:** Run `npm test && npx tsc --noEmit && npm run lint`. Expected: PASS (stage 7개 포함).
- [ ] **Step 3: 브라우저 확인:** 프로젝트 탭에서 → 두 번 → 세 번째 프로젝트, 다이어그램 카드 클릭 후 → 세 번 → 4단계 카드 강조. 탭 줄 ←→가 단계를 바꾸지 않는지. lg 경계를 넘나든 뒤 목록 펼침이 깨지지 않는지(1차 C1 회귀).
- [ ] **Step 4: Commit** `git commit -am "feat: project stage with pill tabs, metrics and step cards"`

### Task 8: 03 경력, 04 기술, 푸터

**Files:**
- Create: `src/components/Career.tsx`, `src/components/Skills.tsx`
- Modify: `src/app/page.tsx` (Task 2의 임시 출력 제거, 푸터 정리)

**Interfaces:**
- Consumes: Task 2 `career`, `skills`; Task 3 아이콘(`${basePath}/icons/<icon>.svg` — `next.config.mjs`의 basePath를 상수로 가져오거나 `LINKS.portfolio`처럼 `/portfolio_web` 접두어).
- Produces: `<Career items />`, `<Skills groups />`.

- [ ] **Step 1:** Career: `grid-cols-[1.3fr_1fr_1fr]` 카드 3장, `now` 카드만 코랄 테두리·위쪽 옅은 코랄 그라데이션·"현재" 배지. 배지·기간(고정폭)·굵은 기관명·역할·설명.
- [ ] **Step 2:** Skills: 3열 격자. `main`은 두 칸, 아이콘 38px 4열 × 2줄. `lang`은 세로 목록 30px. 두 카드는 같은 높이로 늘고 칩이 높이를 나눠 채운다(`flex-col` + `grid-auto-rows:1fr`). 나머지 카드는 24px 칩. `cert`는 한 줄 전체, 청록 체크. 칩은 `img`(alt 빈 문자열, 이름은 옆 글자) + 이름.
- [ ] **Step 3:** 푸터: 이름·직함, 이메일·GitHub·블로그·포트폴리오 PDF.
- [ ] **Step 4:** Run `npm test && npx tsc --noEmit && npm run lint && npm run build`. Expected: PASS, 빌드 성공.
- [ ] **Step 5:** 1440 스크린샷에서 기술 카드에 빈 공간이 남지 않는지, 아이콘 25개가 모두 뜨는지(`[...document.images].filter(i=>!i.naturalWidth).length === 0`).
- [ ] **Step 6: Commit** `git commit -m "feat: career cards and skills with icon tiles"`

### Task 9: 마무리 (인쇄, 모바일, 정리, 최종 확인)

**Files:**
- Modify: `src/app/page.tsx` (`PrintProjects`), `src/app/globals.css` (print·reduced-motion)
- Delete: 쓰지 않게 된 코드(`StepControls`, `font-serif` 잔재, 옛 `Rows`)

- [ ] **Step 1:** 인쇄: `SiteNav`, `AppWindow`, 고객사 띠는 `print:hidden`. 띠·카드 바탕은 print 토큰으로 흰색. `PrintProjects`는 새 토큰으로 그대로 동작(프로젝트 넷 + 모든 단계).
- [ ] **Step 2:** 움직임 줄이기: 커서 깜빡임·탭 전환·다이어그램 고리 모두 정지(기존 전역 규칙 + `FlowDiagram`의 matchMedia 확인).
- [ ] **Step 3:** 390×844: 원칙·경력·기술 카드 한 줄에 하나, `scrollWidth === 390`.
- [ ] **Step 4:** Run `npm test && npx tsc --noEmit && npm run lint && npm run build`. Expected: 전부 PASS.
- [ ] **Step 5:** 정적 빌드를 `/portfolio_web` 경로로 띄워 아이콘·PDF·폰트가 뜨는지, 헤드리스 Chrome 인쇄 PDF가 흰 바탕이고 내비·앱 창이 없는지 확인(Review Focus 4, 5).
- [ ] **Step 6: Commit** `git commit -am "chore: print, reduced motion, mobile pass, remove dead code"`
