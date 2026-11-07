/* 첫 화면 앱 창의 샘플. 질문, 쿼리, 표 수치, 규정 내용, 쪽수, 상품 설명은 지어낸 예시다.
   창에는 늘 "샘플 화면 · 예시 데이터" 표시가 붙는다.
   사실은 여기 두지 않는다: 프로젝트 정보와 대표 숫자는 data.ts 에서 가져온다.
   실행 기록 중 사실인 값(30초, 재생성 상한 3회, 사내 vLLM, 외부 API 없음, 3,000쪽, 페르소나 12개,
   Vertex AI Search/Google Search, 첫 토큰 20% 단축)만 실제 값을 쓴다. 쌀 상품 이름은 실제 농협 상품이다.
   **굵게** 표기를 쓴다. node --test 가 직접 읽으므로 import type 만 둔다. */

import type { ProjectId } from "./data";

export type L = { ko: string; en: string };
export type CardRole = "agent" | "guard" | "out" | "human" | "cite";
type Base = { role: CardRole; badge: L; title: L; meta: L };
export type BagSpec = { brand: L; name: L; weight: L; body: string; band: string };
export type Tone = null | "up" | "down" | "strong";

export type SampleCard =
  | (Base & { kind: "note" })
  | (Base & { kind: "sql"; sql: string; marks?: string[] })
  | (Base & { kind: "table"; text?: L; head: L[]; rows: string[][]; tone?: Tone[][] })
  | (Base & { kind: "points"; text: L; points: { title: L; body: L; ref: L }[] })
  | (Base & { kind: "cites"; cites: { text: L; page?: string; note?: L }[]; follow: L[] })
  | (Base & { kind: "products"; products: { name: L; desc: L; bag: BagSpec }[]; text: L });

export type RailRow = { k: L; v: L; tone?: "ok" | "bad" | "big" } | { err: string };

export interface SampleTab {
  id: ProjectId;
  tab: L;
  tag: string;
  ask: { who: L; text: L };
  cards: SampleCard[];
  rail: { title: L; groups: RailRow[][] };
}

const l = (ko: string, en: string): L => ({ ko, en });
const ok = l("통과", "passed");

const ERP_SQL = `WITH prod AS (
  SELECT item_cd, SUM(prod_qty) AS qty FROM mes_prod
  WHERE prod_dt >= '2026-07-01' AND prod_dt < '2026-08-01'
  GROUP BY item_cd
), pl AS (
  SELECT item_cd, SUM(plan_qty) AS plan_qty FROM prod_plan
  WHERE plan_ym = '202607' GROUP BY item_cd
)
SELECT TOP 10 i.item_nm, p.qty, pl.plan_qty,
  CAST(p.qty * 100.0 / NULLIF(pl.plan_qty, 0) AS DECIMAL(5,1)) AS rate,
  RANK() OVER (ORDER BY p.qty DESC) AS rnk
FROM prod p JOIN item_mst i ON i.item_cd = p.item_cd
LEFT JOIN pl ON pl.item_cd = p.item_cd ORDER BY rnk`;

const MKT_SQL = `WITH new_cust AS (
  SELECT cust_id, branch_cd FROM cust
  WHERE join_dt BETWEEN '2026-04-01' AND '2026-06-30'
    AND age BETWEEN 30 AND 39
), saving AS (
  SELECT cust_id, MIN(open_dt) AS first_open FROM acct
  WHERE prod_type = 'SAVING' AND status = 'ACTIVE' GROUP BY cust_id
)
SELECT b.region_nm, COUNT(n.cust_id) AS new_cnt,
  COUNT(s.cust_id) AS saving_cnt,
  ROUND(COUNT(s.cust_id) * 100.0 / COUNT(n.cust_id), 1) AS rate
FROM new_cust n JOIN branch b ON b.branch_cd = n.branch_cd
LEFT JOIN saving s ON s.cust_id = n.cust_id
GROUP BY b.region_nm ORDER BY rate DESC`;

export const SAMPLES: SampleTab[] = [
  {
    id: "seonil",
    tab: l("ERP 질의", "ERP query"),
    tag: "Text-to-SQL",
    ask: {
      who: l("현업 질문", "Staff question"),
      text: l(
        "지난달 품목별 생산량이랑 **계획 대비 달성률** 보여줘",
        "Show last month's output by item and **progress against plan**",
      ),
    },
    cards: [
      {
        kind: "sql",
        role: "agent",
        badge: l("SQL 생성", "Write SQL"),
        title: l("생성된 쿼리", "Generated query"),
        meta: l("테이블 412개 중 3개 선택", "3 of 412 tables picked"),
        sql: ERP_SQL,
      },
      {
        kind: "note",
        role: "guard",
        badge: l("사전 검증", "Pre-check"),
        title: ok,
        meta: l("읽기 전용 · sqlglot 파싱 · NOEXEC 실행 계획", "Read-only · sqlglot parse · NOEXEC plan"),
      },
      {
        kind: "table",
        role: "out",
        badge: l("결과", "Result"),
        title: l("4개 품목", "4 items"),
        meta: l("숫자는 쿼리 결과 그대로", "Numbers come straight from the query"),
        head: [l("품목", "Item"), l("생산량", "Output"), l("계획", "Plan"), l("달성률", "vs plan")],
        rows: [
          ["베어링 A-12", "18,420", "17,500", "105.3%"],
          ["샤프트 S-3", "12,075", "13,000", "92.9%"],
          ["하우징 H-7", "9,310", "9,000", "103.4%"],
          ["부싱 B-2", "7,880", "9,200", "85.7%"],
        ],
        tone: [
          [null, null, null, "up"],
          [null, null, null, "down"],
          [null, null, null, "up"],
          [null, null, null, "down"],
        ],
      },
    ],
    rail: {
      title: l("실행 기록", "Run log"),
      groups: [
        [
          { k: l("의도 분류", "Intent"), v: l("생산 · 계획", "Output · plan") },
          { k: l("스키마 선택", "Schema"), v: l("3 / 412", "3 / 412") },
        ],
        [
          { k: l("sqlglot 파싱", "sqlglot parse"), v: ok, tone: "ok" },
          { k: l("NOEXEC 검사", "NOEXEC check"), v: ok, tone: "ok" },
        ],
        [
          { k: l("숫자 출처", "Numbers from"), v: l("쿼리 결과", "Query result") },
          { k: l("응답까지", "Time to answer"), v: l("30초", "30 s"), tone: "big" },
        ],
      ],
    },
  },
  {
    id: "marketinghub",
    tab: l("마케팅 질의", "Marketing query"),
    tag: "Text-to-SQL",
    ask: {
      who: l("현업 질문", "Staff question"),
      text: l(
        "지난 분기 **30대 신규 고객**의 지역별 **적금 가입률** 알려줘",
        "What was the **savings sign-up rate** by region for **new customers in their 30s** last quarter?",
      ),
    },
    cards: [
      {
        kind: "sql",
        role: "agent",
        badge: l("SQL 생성", "Write SQL"),
        title: l("2회차 쿼리", "Second attempt"),
        meta: l("1회차 오류 내용을 넣어 재생성", "Rewritten with the first error fed back"),
        sql: MKT_SQL,
        marks: ["region_nm"],
      },
      {
        kind: "note",
        role: "guard",
        badge: l("검증", "Check"),
        title: l("2회차 통과", "Passed on try 2"),
        meta: l("1회차는 없는 컬럼 branch.region 으로 실패", "Try 1 failed on a missing column, branch.region"),
      },
      {
        kind: "table",
        role: "out",
        badge: l("답변", "Answer"),
        title: l("경기 34.2%가 가장 높음", "Gyeonggi is highest at 34.2%"),
        meta: l("숫자는 결과에서 그대로", "Numbers taken from the result"),
        text: l(
          "30대 신규 고객의 적금 가입률은 **경기 34.2%**가 가장 높고, 이어서 **서울 29.1%**, **충청 25.1%**입니다.",
          "Among new customers in their 30s, **Gyeonggi is highest at 34.2%**, followed by **Seoul at 29.1%** and **Chungcheong at 25.1%**.",
        ),
        head: [l("지역", "Region"), l("신규", "New"), l("적금 가입", "Savings"), l("가입률", "Rate")],
        rows: [
          ["경기", "1,842", "630", "34.2%"],
          ["서울", "2,410", "701", "29.1%"],
          ["충청", "960", "241", "25.1%"],
        ],
        tone: [
          [null, null, null, "strong"],
          [null, null, null, null],
          [null, null, null, null],
        ],
      },
    ],
    rail: {
      title: l("실행 기록", "Run log"),
      groups: [
        [
          { k: l("1회차 검증", "Check, try 1"), v: l("실패", "failed"), tone: "bad" },
          { err: "column not found: branch.region\n→ rewrite with branch.region_nm" },
        ],
        [
          { k: l("2회차 검증", "Check, try 2"), v: ok, tone: "ok" },
          { k: l("재생성 상한", "Rewrite limit"), v: l("3회", "3 tries") },
        ],
        [
          { k: l("모델", "Model"), v: l("사내 vLLM", "In-house vLLM") },
          { k: l("외부 API", "External APIs"), v: l("없음", "none") },
        ],
      ],
    },
  },
  {
    id: "nhrag",
    tab: l("규정 챗봇", "Rules chatbot"),
    tag: "RAG",
    ask: {
      who: l("창구 직원", "Branch staff"),
      text: l(
        "조합원 아닌 고객도 **예탁금 가입**이 되나요? 혜택 차이도 알려주세요",
        "Can a non-member open a **deposit account**? What benefits differ?",
      ),
    },
    cards: [
      {
        kind: "note",
        role: "agent",
        badge: l("규정 검색", "Rule search"),
        title: l("4건 사용", "4 clauses used"),
        meta: l("후보 조항 12건 → 재정렬", "12 candidates → reranked"),
      },
      {
        kind: "points",
        role: "out",
        badge: l("답변", "Answer"),
        title: l("가입 가능 · 세 가지가 다름", "Yes · three things differ"),
        meta: l("문장마다 근거 번호", "A source number on each point"),
        text: l(
          "네, 비조합원도 가입할 수 있습니다. 다만 아래 세 가지가 다릅니다.",
          "Yes, non-members can open one. Three things are different.",
        ),
        points: [
          {
            title: l("비과세", "Tax exemption"),
            body: l(
              "조합원과 준조합원만 1인당 3천만 원까지 비과세 예탁금 대상입니다. 비조합원은 일반과세입니다.",
              "Only members and associate members get tax-free deposits up to 30 million won each. Non-members are taxed normally.",
            ),
            ref: l("근거 1 · 2", "Sources 1 · 2"),
          },
          {
            title: l("우대금리", "Preferential rate"),
            body: l("조합원 우대금리(0.1~0.3%p)는 적용되지 않습니다.", "The member rate bonus (0.1–0.3%p) does not apply."),
            ref: l("근거 3", "Source 3"),
          },
          {
            title: l("창구 안내", "At the counter"),
            body: l(
              "출자금을 내고 준조합원으로 가입하면 비과세를 받을 수 있어, 가입 시 함께 안내합니다.",
              "Joining as an associate member with a small capital contribution unlocks the exemption, so staff mention it at sign-up.",
            ),
            ref: l("근거 4", "Source 4"),
          },
        ],
      },
      {
        kind: "cites",
        role: "cite",
        badge: l("근거", "Sources"),
        title: l("문서 4건", "4 documents"),
        meta: l("문서명 · 쪽수", "Document · page"),
        cites: [
          { text: l("상호금융 수신업무방법서 제3장", "Deposit operations manual, ch. 3"), page: "p.412" },
          { text: l("표 3-2 비과세 한도", "Table 3-2 tax-free limits"), note: l("표 전용 처리", "table pipeline") },
          { text: l("금리 운용 기준", "Rate policy"), page: "p.97" },
          { text: l("창구 FAQ 2026-1", "Counter FAQ 2026-1"), page: "p.12" },
        ],
        follow: [l("준조합원 가입 절차는?", "How do I join as an associate member?"), l("비과세 한도 남은 금액 계산", "How much tax-free room is left?")],
      },
    ],
    rail: {
      title: l("근거", "Sources"),
      groups: [
        [
          { k: l("검색 범위", "Search scope"), v: l("규정집 3,000쪽", "3,000 pages of rules") },
          { k: l("후보 → 사용", "Candidates → used"), v: l("12 → 4", "12 → 4") },
        ],
        [
          { k: l("표 데이터", "Tables"), v: l("별도 파이프라인", "Separate pipeline") },
          { k: l("답변 형식", "Answer format"), v: l("문서 · 쪽수 첨부", "Document · page attached") },
        ],
        [{ k: l("근거 없는 문장", "Unsourced sentences"), v: l("0", "0"), tone: "big" }],
      ],
    },
  },
  {
    id: "matseon",
    tab: l("쌀·잡곡 추천", "Rice & grains"),
    tag: "Agent",
    ask: {
      who: l("고객", "Shopper"),
      text: l(
        "**2인 가구**인데 **찰진 밥** 좋아해요. 쌀이랑 섞어 먹을 잡곡도 추천해줘",
        "We're a **household of two** and like **sticky rice**. What should we mix in?",
      ),
    },
    cards: [
      {
        kind: "note",
        role: "agent",
        badge: l("의도 분류", "Intent"),
        title: l("취향 기반 추천", "Taste-based pick"),
        meta: l("\"잘 팔리는 잡곡\"과는 다른 경로", "A different route from \"best-selling grains\""),
      },
      {
        kind: "note",
        role: "human",
        badge: l("페르소나", "Persona"),
        title: l("소량 구매 · 식감 중시", "Small packs · texture first"),
        meta: l("12가지 중 1개 매칭", "Matched 1 of 12"),
      },
      {
        kind: "products",
        role: "out",
        badge: l("추천", "Picks"),
        title: l("상품 4개", "4 products"),
        meta: l("사내 상품 지식 + 외부 정보", "In-house catalog + web"),
        products: [
          {
            name: l("김화농협 철원오대쌀", "Gimhwa NH Cheorwon Odae rice"),
            desc: l("10kg · 찰기와 윤기", "10 kg · sticky and glossy"),
            bag: { brand: l("김화농협", "Gimhwa NH"), name: l("철원오대쌀", "Odae rice"), weight: l("10kg · 26년산", "10 kg · 2026"), body: "#d8c9a8", band: "#3d6b4f" },
          },
          {
            name: l("정읍시농협 신동진", "Jeongeup NH Sindongjin"),
            desc: l("10kg · 밥알 굵고 찰짐", "10 kg · large, chewy grains"),
            bag: { brand: l("정읍시농협", "Jeongeup NH"), name: l("신동진", "Sindongjin"), weight: l("10kg · 상등급", "10 kg · grade A"), body: "#e6dcc6", band: "#b0473a" },
          },
          {
            name: l("국산 찰현미", "Korean sweet brown rice"),
            desc: l("4kg · 백미와 2:1", "4 kg · 2:1 with white rice"),
            bag: { brand: l("국산 · 농협", "Korean · NH"), name: l("찰현미", "Brown rice"), weight: l("4kg", "4 kg"), body: "#a8865a", band: "#5a3d24" },
          },
          {
            name: l("국산 찰오곡", "Korean five-grain mix"),
            desc: l("700g × 2 · 2인 소포장", "700 g × 2 · small packs"),
            bag: { brand: l("국산 · 농협", "Korean · NH"), name: l("찰오곡", "Five grains"), weight: l("700g × 2", "700 g × 2"), body: "#c9b48a", band: "#2f4a6b" },
          },
        ],
        text: l(
          "찰진 밥을 좋아하시면 **철원오대쌀에 찰현미를 2:1**로 섞어 보세요. 두 분이 한 달에 드시기엔 10kg이 넉넉하니, 잡곡은 **소포장 찰오곡**으로 시작하시는 걸 추천해요",
          "If you like sticky rice, try **Odae rice with brown rice at 2:1**. 10 kg lasts two people well over a month, so start the grains with the **small five-grain packs**",
        ),
      },
    ],
    rail: {
      title: l("실행 기록", "Run log"),
      groups: [
        [
          { k: l("라우팅", "Routing"), v: l("의도 분류 노드", "Intent node") },
          { k: l("페르소나", "Persona"), v: l("12개 중 1개", "1 of 12") },
        ],
        [
          { k: l("상품 검색", "Catalog search"), v: l("Vertex AI Search", "Vertex AI Search") },
          { k: l("외부 정보", "Web info"), v: l("Google Search", "Google Search") },
        ],
        [
          { k: l("응답", "Response"), v: l("스트리밍", "Streaming") },
          { k: l("첫 토큰", "First token"), v: l("20% 단축", "20% faster"), tone: "big" },
        ],
      ],
    },
  },
];
