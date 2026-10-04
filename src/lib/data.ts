/* 수치, 기간, 고유명사의 원장은 ~/job/02_핵심-스펙.md 와 03_스토리뱅크.md.
   여기 문구를 고칠 때는 원장과 먼저 대조한다.
   소개 문단은 본문 안에 링크가 들어가서 page.tsx에 직접 적었다. */

export interface LinkItem {
  label: string;
  url: string;
}

export interface Row {
  period: string;
  text: string;
}

/** 접어 두는 실제 산출물 (실행 결과, 코드) */
export interface CodeSample {
  label: string;
  code: string;
  caption: string;
  source?: LinkItem;
}

export interface Project {
  title: string;
  /** 소속과 기간 */
  meta: string;
  summary: string;
  points: string[];
  /** src/lib/diagrams.ts 의 키. diagrams/<키>.json 에서 만든다 */
  diagram: string;
  stack: string;
  links?: LinkItem[];
  code?: CodeSample;
}

/** 타임라인 한 줄. 기간은 02_핵심-스펙.md의 프로젝트 표와 같다 */
export interface Span {
  ko: string;
  en: string;
  /** "YYYY.MM" */
  start: string;
  /** 비우면 진행 중 */
  end?: string;
  personal?: boolean;
  /** 본문에서 이 일을 설명하는 위치 */
  href: string;
}

/* 축은 2025.01 ~ 2026.12 고정. 진행 중인 막대는 NOW까지 그린다.
   ponytail: 정적 사이트라 날짜를 계산하지 않는다. 프로젝트를 추가할 때 NOW도 같이 고친다. */
export const TIMELINE_NOW = "2026.10";

export const TIMELINE: Span[] = [
  { ko: "Altair 시각화와 모델링", en: "Altair visualization", start: "2025.01", end: "2025.04", href: "#more" },
  { ko: "범농협 영업점 어시스턴트", en: "Pan-NH branch assistant", start: "2025.04", end: "2025.08", href: "#p3" },
  { ko: "농협 맛선 추천 에이전트", en: "NH Matseon agent", start: "2025.04", end: "2025.08", href: "#more" },
  { ko: "Agent Builder", en: "Agent Builder", start: "2025.08", end: "2025.09", href: "#more" },
  { ko: "마케팅허브 Text-to-SQL", en: "Marketing Hub Text-to-SQL", start: "2025.09", end: "2026.02", href: "#p2" },
  { ko: "BestBanker", en: "BestBanker", start: "2026.02", end: "2026.04", href: "#more" },
  { ko: "선일다이파스 Text-to-SQL", en: "Seonil Dyphas Text-to-SQL", start: "2026.04", end: "2026.08", href: "#p1" },
  { ko: "Midas Touch", en: "Midas Touch", start: "2026.05", end: "2026.09", personal: true, href: "#p4" },
  { ko: "tablefold", en: "tablefold", start: "2026.08", personal: true, href: "#p0" },
  { ko: "중외제약 Tableau 대시보드", en: "JW Pharmaceutical Tableau", start: "2026.09", href: "#more" },
];

export interface Principle {
  lead: string;
  detail: string;
}

export interface Item {
  title: string;
  period: string;
  note?: string;
  links?: LinkItem[];
}

export const LINKS = {
  email: "cj0336j@gmail.com",
  github: "https://github.com/Jacob-9909",
  blog: "https://jacob-log.vercel.app/",
  // public/ 에 넣은 공개용 포트폴리오 PDF (전화번호 없음, 생년월일 대신 "1999년생").
  // 앞의 /portfolio_web 은 next.config.mjs 의 basePath 와 같아야 한다.
  // 원본을 고치면 sh scripts/web-pdf.sh 로 다시 만든다. 원본 PDF를 그대로 복사하지 않는다.
  portfolio: "/portfolio_web/woohyuck-jeong-portfolio.pdf",
  tablefold: "https://github.com/Jacob-9909/tablefold",
};

const TABLEFOLD_LINKS: LinkItem[] = [
  { label: "GitHub", url: LINKS.tablefold },
  { label: "Demo", url: "https://tablefold.vercel.app" },
];

const MIDAS_LINKS: LinkItem[] = [
  { label: "Web", url: "https://midas-touch-five.vercel.app" },
  { label: "GitHub", url: "https://github.com/Jacob-9909/midas-touch" },
];

/* tablefold 로컬 체크아웃(1c5b405)에서 fixtures/retail_50.sql로 직접 실행한 결과.
   출력은 한 글자도 고치지 않았고, 명령만 읽기 쉽게 줄을 나눴다. */
const TABLEFOLD_RUN = `$ tablefold expand "SELECT store_name, SUM(grand_total) AS revenue,
    SUM(order_items_quantity_sum) AS units
    FROM orders GROUP BY store_name" --ddl fixtures/retail_50.sql

-- models: orders | joins 2/17 (15 pruned)
WITH tf__orders AS (
  SELECT
    base.grand_total AS grand_total,
    j_stores_store_id.name AS store_name,
    agg_order_items_order_id.order_items_quantity_sum AS order_items_quantity_sum
  FROM orders AS base
  LEFT JOIN stores AS j_stores_store_id
    ON base.store_id = j_stores_store_id.id
  LEFT JOIN (
    SELECT
      order_id,
      SUM(quantity) AS order_items_quantity_sum
    FROM order_items
    GROUP BY
      order_id
  ) AS agg_order_items_order_id
    ON base.id = agg_order_items_order_id.order_id
)
SELECT
  store_name,
  SUM(grand_total) AS revenue,
  SUM(order_items_quantity_sum) AS units
FROM tf__orders AS orders
GROUP BY
  store_name`;

/* midas-touch backend/app/services/agent/graph.py 66~76행 그대로. */
const MIDAS_GRAPH = `builder.add_edge(START, "intent")
# intent → 필요한 도구 노드들(fan-out) 또는 곧장 synthesize
builder.add_conditional_edges(
    "intent",
    dispatch,
    [*TOOL_NODES, "synthesize"],
)
# 각 도구 노드 → synthesize (여러 도구가 떴으면 모두 끝난 뒤 synthesize가 1회 실행됨)
for tool_node in TOOL_NODES:
    builder.add_edge(tool_node, "synthesize")
builder.add_edge("synthesize", END)`;

const MIDAS_GRAPH_SOURCE: LinkItem = {
  label: "graph.py",
  url: "https://github.com/Jacob-9909/midas-touch/blob/main/backend/app/services/agent/graph.py",
};

const DACON: LinkItem[] = [
  { label: "대출등급 분류", url: "https://dacon.io/competitions/official/236214/overview/description" },
  { label: "소득 예측", url: "https://dacon.io/competitions/official/236230/data" },
  { label: "웹 로그 조회수 예측", url: "https://dacon.io/competitions/official/236226/overview/description" },
  { label: "제주 특산물 가격 예측", url: "https://dacon.io/competitions/official/236176/overview/description" },
  { label: "FSI AIxData Challenge 2024", url: "https://dacon.io/competitions/official/236297/overview/description" },
  { label: "Samsung AI Challenge", url: "https://dacon.io/competitions/official/236323/overview/description" },
];

const DACON_EN: LinkItem[] = [
  "loan grade classification",
  "income prediction",
  "web log view-count prediction",
  "Jeju specialty price prediction",
  "FSI AIxData Challenge 2024",
  "Samsung AI Challenge",
].map((label, i) => ({ label, url: DACON[i].url }));

const ko = {
  name: "정우혁",
  role: "AI Engineer, Didim",
  location: "서울",
  headings: {
    intro: "소개",
    principles: "에이전트를 만들 때 지키는 것",
    career: "경력",
    projects: "프로젝트",
    more: "그 밖에 한 일",
    student: "학부 때",
    skills: "기술",
  },
  labels: {
    email: "이메일",
    blog: "블로그",
    portfolio: "포트폴리오 PDF",
    dacon: "DACON 경진대회",
    toc: "목차",
    skip: "본문으로 건너뛰기",
    top: "맨 위로",
    theme: "밝기 전환",
    language: "언어",
    timeline: "2025년 1월부터 한 일",
    work: "Didim",
    personal: "개인 프로젝트",
    ongoing: "진행 중",
    months: "개월",
  },
  principles: [
    { lead: "틀리면 안 되는 숫자는 코드로 계산합니다.", detail: "Midas Touch에서 세액, 84점 청약 가점, 사기 판정을 코드로 계산하고 LLM에는 의도 분류와 작문만 맡겼습니다." },
    { lead: "도구 선택은 의도 분류 노드가 정합니다.", detail: "맛선에서 모델이 도구를 직접 고르는 Tool Calling이 느리고 응답이 매번 달라서 LangGraph 노드로 분리했습니다. Midas Touch도 같은 구조입니다." },
    { lead: "자기수정에는 상한을 둡니다.", detail: "마케팅허브와 선일다이파스 모두 SQL 재생성을 3회로 제한했습니다." },
    { lead: "틀린 답은 노드 단위로 추적합니다.", detail: "Opik으로 만든 사내 LLMOps 도구에서 노드별 출력을 열어 보고 어긋난 노드만 고칩니다." },
    { lead: "답변에는 근거를 붙입니다.", detail: "범농협 RAG는 답변마다 문서명과 페이지를 표시합니다." },
  ] as Principle[],
  career: [
    { period: "2025.01 ~ 현재", text: "Didim, AI Engineer (LLM, ML)" },
    { period: "2024.09 ~ 2024.12", text: "ODOC, Associate Product Manager 인턴" },
    { period: "2019.03 ~ 2025.02", text: "국민대학교 회계학과, AI빅데이터융합경영학과 복수전공" },
  ] as Row[],
  projects: [
    {
      title: "tablefold",
      meta: "개인 오픈소스, 2026.08 ~ 진행 중",
      summary:
        "테이블 수십 개짜리 스키마를 LLM이 읽기 쉬운 넓은 논리 모델 몇 개로 접고, LLM이 쓴 논리 SQL을 물리 SQL로 펼치는 오픈소스입니다.",
      points: [
        "물리 테이블 53개를 논리 모델 7개(약 3k 토큰)로 압축",
        "조인 경로와 집계 단위는 그래프 알고리즘이 정하고, LLM은 조인 없이 SQL 작성",
        "골드셋 50문항을 결과 값까지 비교, 테스트 410개를 CI로 실행",
      ],
      diagram: "tablefold",
      stack: "Python, PostgreSQL, FastAPI, 그래프 알고리즘",
      links: TABLEFOLD_LINKS,
      code: {
        label: "실제 실행 결과 보기",
        code: TABLEFOLD_RUN,
        caption:
          "저장소의 예제 스키마로 직접 실행한 결과입니다. 조인 17개 중 쓰인 2개만 남고, 1:N 자식인 order_items는 먼저 집계한 뒤 조인됩니다.",
      },
    },
    {
      title: "선일다이파스 Text-to-SQL",
      meta: "Didim, 2026.04 ~ 2026.08",
      summary: "SQL을 모르는 제조 현장 실무진이 ERP 데이터를 자연어로 직접 조회하는 에이전트입니다.",
      points: [
        "조회 대기가 2~3일에서 30초로 줄었고, 현장 실무진 120명이 월 600회 사용",
        "진천공장 실무진을 직접 인터뷰해 요구를 확인",
        "결과가 0행이면 이전 월 조회 같은 대안을 되묻기",
      ],
      diagram: "seonil",
      stack: "Python, LangGraph, FastAPI, PgVector, 온프레미스",
    },
    {
      title: "농협은행 마케팅허브 Text-to-SQL",
      meta: "Didim, 2025.09 ~ 2026.02",
      summary: "외부 API를 쓸 수 없는 폐쇄망에서 마케팅 담당자의 질의를 SQL로 바꾸는 에이전트입니다.",
      points: [
        "현업 질의 100개 테스트셋 정확도 60%에서 95~100% (팀 성과), 현업 20명이 월 200회 사용",
        "Gemma와 EXAONE을 검토한 뒤 GPT-oss-120b 선정, KURE-V1을 금융 용어로 파인튜닝",
        "현업이 메타데이터를 직접 등록하는 메타 어드민의 기획과 핵심 기능 개발",
      ],
      diagram: "marketinghub",
      stack: "Python, LangGraph, FastAPI, PgVector, vLLM, Fine-tuning",
    },
    {
      title: "범농협 영업점 어시스턴트",
      meta: "농협중앙회, 삼일PwC, 삼정KPMG, Google과 협업, 2025.04 ~ 2025.08",
      summary: "영업점 직원이 상호금융 규정을 물으면 근거 문서와 페이지를 붙여 답하는 RAG입니다.",
      points: [
        "업무방법서 약 60개, 3,000페이지가 대상",
        "표와 2단 레이아웃을 지키려고 수치 테이블 파이프라인을 분리하고 Vision OCR로 마크다운 변환",
        "출처를 누르면 원문 해당 위치가 열리는 기능을 요구서 밖에서 제안",
      ],
      diagram: "nh-rag",
      stack: "Python, GCP, Google ADK, LangGraph, React",
    },
    {
      title: "Midas Touch",
      meta: "개인 프로젝트, 2026.05 ~ 2026.09",
      summary: "세율과 공제 숫자를 지어내지 않는 금융 비서입니다. 2026 금융 AI Challenge에 출품했습니다.",
      points: [
        "도구 12종 중 필요한 것만 동시에 실행하고, LLM 호출은 질문당 최대 2회",
        "세액, 84점 청약 가점, 사기 판정은 코드로 계산",
        "주가 진단 적중률 58.4%가 항상 관망한 경우(57.7%)와 차이 없다는 채점 결과를 그대로 공개",
      ],
      diagram: "midas",
      stack: "Python, LangGraph, FastAPI, PgVector, Neo4j, Next.js",
      links: MIDAS_LINKS,
      code: {
        label: "그래프 배선 코드 보기",
        code: MIDAS_GRAPH,
        caption: "에이전트 그래프를 조립하는 코드의 일부입니다.",
        source: MIDAS_GRAPH_SOURCE,
      },
    },
    {
      title: "KoFinSQL",
      meta: "연구, 제1저자, NeurIPS 2026 제출",
      summary: "한국어 금융 Text-to-SQL에 맞춘 3B 소형 모델 연구입니다.",
      points: [
        "Accuracy 8.20/10, 비교한 3B 이하 모델 5개 중 1위",
        "1단계는 기재부 경제 용어 3,031개와 KDB 금융 리스크 용어 202개로 학습",
        "2단계는 DART 재무공시로 만든 SQL 중 실제 DB에서 실행 검증된 쌍만 사용",
      ],
      diagram: "kofinsql",
      stack: "Python, Fine-tuning, LangChain Deep Agent, BM25와 벡터 RRF",
    },
  ] as Project[],
  more: [
    { title: "중외제약 Tableau 대시보드", period: "2026.09 ~ 진행 중", note: "ERP에서 내려받아 수기 엑셀로 만들던 경영 리포트를 7개 계열사 대시보드로 옮기는 중입니다." },
    { title: "농협은행 BestBanker", period: "2026.02 ~ 2026.04", note: "내규 문서 RAG와 멀티 에이전트로 영업점 직원의 실적 점수를 계산하고, 승진에 유리한 상품을 추천합니다." },
    { title: "Agent Builder", period: "2025.08 ~ 2025.09", note: "사내 솔루션 경진대회 우수상. Notion, Tavily, Slack, RAG MCP 툴을 만들었습니다." },
    { title: "농협 맛선 상품 추천 에이전트", period: "2025.04 ~ 2025.08", note: "12가지 고객 페르소나와 하이브리드 RAG로 쌀과 잡곡을 추천합니다. Tool Calling이 느리고 응답이 매번 달라서 LangGraph 의도 분류 노드로 바꿨습니다." },
    { title: "Altair 시각화와 모델링", period: "2025.01 ~ 2025.04", note: "AI Studio와 Panopticon으로 주식, 산불 예측 모델과 재고 관리 모델을 만들었습니다." },
  ] as Item[],
  student: [
    { title: "BDA 데이터분석 공모전", period: "2023", note: "60개 팀 중 상위 8팀에 선정돼 CJ 본사에서 발표했습니다.", links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/CJ_bda_proj" }] },
    { title: "K리그 승률예측, 한이음", period: "2024", links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/K_league_soccer_AI" }, { label: "YouTube", url: "https://youtu.be/CRZJHyEIVEk?si=A8kmmgZGdbYJezqY" }] },
    { title: "LG Aimers, Display Glass 불량 예측", period: "2024", links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/LG_aimers" }] },
    { title: "미래에셋 AI Data Festival", period: "2024" },
    { title: "국민대학교 AI빅데이터분석 경진대회", period: "2024" },
    { title: "K-Water 물 빅데이터 공모전", period: "2023", links: [{ label: "자료", url: "https://drive.google.com/file/d/10xv5OkwS867kudIYXibXxxYiwniu4B3N/view?usp=drive_link" }] },
  ] as Item[],
  dacon: DACON,
  skills: [
    { period: "언어", text: "Python, Java, SQL" },
    { period: "AI", text: "LangGraph, RAG, Fine-tuning, Google ADK, MCP, vLLM, Deep Agent, PyTorch" },
    { period: "백엔드", text: "FastAPI, PostgreSQL, PgVector, Neo4j, Oracle, MSSQL" },
    { period: "인프라", text: "GCP (Vertex AI), Docker, Kubernetes, Prometheus, Opik" },
    { period: "도구", text: "Tableau, React, Next.js, Claude Code, Codex, Gemini, Kiro" },
    { period: "자격", text: "빅데이터분석기사, SQLD, ADsP, 컴퓨터활용능력 1급, TOEIC Speaking AL" },
  ] as Row[],
};

const en: typeof ko = {
  name: "Woohyuck Jeong",
  role: "AI Engineer, Didim",
  location: "Seoul",
  headings: {
    intro: "About",
    principles: "How I build agents",
    career: "Experience",
    projects: "Projects",
    more: "Other work",
    student: "As a student",
    skills: "Skills",
  },
  labels: {
    email: "Email",
    blog: "Blog",
    portfolio: "Portfolio PDF",
    dacon: "DACON competitions",
    toc: "Contents",
    skip: "Skip to content",
    top: "Back to top",
    theme: "Toggle theme",
    language: "Language",
    timeline: "Work since January 2025",
    work: "Didim",
    personal: "Personal project",
    ongoing: "ongoing",
    months: " mo",
  },
  principles: [
    { lead: "Numbers that must be right are computed in code.", detail: "In Midas Touch, tax amounts, the 84-point housing subscription score and fraud checks run in code. The LLM only classifies intent and writes." },
    { lead: "An intent node picks the tools.", detail: "On Matseon, letting the model call tools directly was slow and gave a different answer each time, so I moved routing into a LangGraph node. Midas Touch has the same structure." },
    { lead: "Self-correction has a cap.", detail: "Both Marketing Hub and Seonil Dyphas limit SQL regeneration to 3 tries." },
    { lead: "Wrong answers are traced node by node.", detail: "With our in-house LLMOps tool built on Opik, I open each node's output and change only the node that was off." },
    { lead: "Answers carry their sources.", detail: "The Pan-NH RAG shows the document name and page with every answer." },
  ],
  career: [
    { period: "2025.01 ~ now", text: "Didim, AI Engineer (LLM, ML)" },
    { period: "2024.09 ~ 2024.12", text: "ODOC, Associate Product Manager intern" },
    { period: "2019.03 ~ 2025.02", text: "Kookmin University, Accounting with a double major in AI Big Data Convergence Management" },
  ],
  projects: [
    {
      title: "tablefold",
      meta: "personal open source, 2026.08 ~ ongoing",
      summary:
        "Open source that folds a schema of dozens of tables into a few wide logical models an LLM can read, then expands the LLM's logical SQL into physical SQL.",
      points: [
        "53 physical tables compressed into 7 logical models (about 3k tokens)",
        "Graph algorithms decide join paths and grain, so the LLM writes SQL without joins",
        "A 50-question gold set compared down to result values, 410 tests in CI",
      ],
      diagram: "tablefold",
      stack: "Python, PostgreSQL, FastAPI, graph algorithms",
      links: TABLEFOLD_LINKS,
      code: {
        label: "Show a real run",
        code: TABLEFOLD_RUN,
        caption:
          "A real run on the example schema in the repo. Of 17 joins only the 2 that are used remain, and the 1:N child order_items is aggregated before it is joined.",
      },
    },
    {
      title: "Seonil Dyphas Text-to-SQL",
      meta: "Didim, 2026.04 ~ 2026.08",
      summary: "An agent that lets factory staff who do not know SQL query ERP data in plain language.",
      points: [
        "Wait for a data request went from 2 to 3 days to 30 seconds; 120 people run 600 queries a month",
        "I interviewed staff at the Jincheon plant myself to confirm what they needed",
        "On zero rows it asks back with an alternative such as the previous month",
      ],
      diagram: "seonil",
      stack: "Python, LangGraph, FastAPI, PgVector, on-premise",
    },
    {
      title: "NH Bank Marketing Hub Text-to-SQL",
      meta: "Didim, 2025.09 ~ 2026.02",
      summary: "An agent that turns marketers' questions into SQL inside a closed network with no external APIs.",
      points: [
        "Accuracy on a 100-question test set from business users went from 60% to 95~100% (team result); 20 people use it 200 times a month",
        "Chose GPT-oss-120b after evaluating Gemma and EXAONE, and fine-tuned KURE-V1 on financial terms",
        "Planning and core features for Meta Admin, where business users register metadata themselves",
      ],
      diagram: "marketinghub",
      stack: "Python, LangGraph, FastAPI, PgVector, vLLM, fine-tuning",
    },
    {
      title: "Pan-NH branch assistant",
      meta: "with NACF, Samil PwC, Samjong KPMG and Google, 2025.04 ~ 2025.08",
      summary: "RAG that answers branch staff's questions on mutual-finance regulations with the source document and page.",
      points: [
        "About 60 operation manuals, 3,000 pages",
        "A separate pipeline for numeric tables and Vision OCR to markdown, to keep tables and two-column layouts intact",
        "Proposed opening the source at the cited position, outside the requirements",
      ],
      diagram: "nh-rag",
      stack: "Python, GCP, Google ADK, LangGraph, React",
    },
    {
      title: "Midas Touch",
      meta: "personal project, 2026.05 ~ 2026.09",
      summary: "A finance assistant that does not invent tax rates or deductions. Entered in the 2026 Financial AI Challenge.",
      points: [
        "Runs only the needed tools out of 12 in parallel, with at most 2 LLM calls per question",
        "Tax amounts, the 84-point housing subscription score and fraud checks are computed in code",
        "Published as is: its stock hit rate of 58.4% was no better than always holding (57.7%)",
      ],
      diagram: "midas",
      stack: "Python, LangGraph, FastAPI, PgVector, Neo4j, Next.js",
      links: MIDAS_LINKS,
      code: {
        label: "Show the graph wiring code",
        code: MIDAS_GRAPH,
        caption: "Part of the code that wires the agent graph.",
        source: MIDAS_GRAPH_SOURCE,
      },
    },
    {
      title: "KoFinSQL",
      meta: "research, first author, submitted to NeurIPS 2026",
      summary: "Research on a 3B small model tuned for Korean financial Text-to-SQL.",
      points: [
        "Accuracy 8.20/10, first among the five models of 3B or smaller that I compared",
        "Stage 1 trains on 3,031 economic terms from the Ministry of Economy and Finance and 202 KDB financial risk terms",
        "Stage 2 uses only SQL pairs from DART disclosures that executed correctly on a real database",
      ],
      diagram: "kofinsql",
      stack: "Python, fine-tuning, LangChain Deep Agent, BM25 and vector RRF",
    },
  ],
  more: [
    { title: "JW Pharmaceutical Tableau dashboards", period: "2026.09 ~ ongoing", note: "Moving management reports built by hand in Excel from ERP exports into dashboards for 7 affiliates." },
    { title: "NH Bank BestBanker", period: "2026.02 ~ 2026.04", note: "Scores branch employees' performance with RAG over internal regulations and a multi-agent setup, and recommends products that help toward promotion." },
    { title: "Agent Builder", period: "2025.08 ~ 2025.09", note: "Excellence Award at the in-house solution contest. I built the Notion, Tavily, Slack and RAG MCP tools." },
    { title: "NH Matseon product recommendation agent", period: "2025.04 ~ 2025.08", note: "Recommends rice and grains with 12 customer personas and hybrid RAG. Tool calling was slow and inconsistent, so I replaced it with a LangGraph intent-classification node." },
    { title: "Altair visualization and modeling", period: "2025.01 ~ 2025.04", note: "Stock and wildfire prediction models and an inventory model with AI Studio and Panopticon." },
  ],
  student: [
    { title: "BDA Data Analysis Contest", period: "2023", note: "Top 8 of 60 teams, presented at CJ headquarters.", links: ko.student[0].links },
    { title: "K-League win rate prediction, Hanium", period: "2024", links: ko.student[1].links },
    { title: "LG Aimers, display glass defect prediction", period: "2024", links: ko.student[2].links },
    { title: "Mirae Asset AI Data Festival", period: "2024" },
    { title: "Kookmin University AI Big Data Contest", period: "2024" },
    { title: "K-Water Water Big Data Contest", period: "2023", links: [{ label: "Slides", url: ko.student[5].links![0].url }] },
  ],
  dacon: DACON_EN,
  skills: [
    { period: "Languages", text: "Python, Java, SQL" },
    { period: "AI", text: "LangGraph, RAG, fine-tuning, Google ADK, MCP, vLLM, Deep Agent, PyTorch" },
    { period: "Backend", text: "FastAPI, PostgreSQL, PgVector, Neo4j, Oracle, MSSQL" },
    { period: "Infra", text: "GCP (Vertex AI), Docker, Kubernetes, Prometheus, Opik" },
    { period: "Tools", text: "Tableau, React, Next.js, Claude Code, Codex, Gemini, Kiro" },
    { period: "Certificates", text: "Big Data Analysis Engineer, SQLD, ADsP, Computer Literacy Level 1, TOEIC Speaking AL" },
  ],
};

export const translations = { ko, en };
