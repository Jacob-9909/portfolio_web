/* 프로젝트별 에이전트 흐름. 좌표를 손으로 정한 데이터이고 FlowDiagram 이 그린다.
   노드의 step 은 그 노드가 처음 켜지는 단계(0부터)다. 문구 규칙과 사실 범위는 data.ts 첫 주석과 같다.
   node --test 가 직접 읽으므로 import type 만 쓴다. */

import type { Box, Role } from "./geometry";
import type { ProjectId } from "./data";

export type L = { ko: string; en: string };

export interface FlowNode extends Box {
  id: string;
  role: Role;
  step: number;
  label: L;
  sub?: L;
  /** 역할 이름 대신 노드 위에 쓸 말 (예: 문서) */
  caption?: L;
}

export interface FlowEdge {
  from: string;
  to: string;
  step: number;
  /** 노드와 자원을 잇는 점선. 화살촉이 없다 */
  link?: boolean;
}

export interface FlowLoop {
  from: string;
  to: string;
  step: number;
  tries: number;
  note: L;
}

export interface Flow {
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
  loops: FlowLoop[];
  steps: L[];
}

/* 기본 배치: 위 줄(흐름) 상자는 y 128, 높이 44 / 아래 줄(자원)은 y 232, 높이 40 */
const MAIN = { y: 128, h: 44 };
const RES = { y: 232, h: 40 };

const seonil: Flow = {
  width: 600,
  height: 320,
  nodes: [
    { id: "q", role: "human", step: 0, x: 0, w: 120, ...MAIN, label: { ko: "현업 질문", en: "User query" }, sub: { ko: "자연어", en: "Natural language" } },
    { id: "gen", role: "agent", step: 1, x: 168, w: 124, ...MAIN, label: { ko: "SQL 생성", en: "Write SQL" }, sub: { ko: "의도 분류 · 스키마 선택", en: "Intent · schema selection" } },
    { id: "check", role: "guard", step: 2, x: 340, w: 124, ...MAIN, label: { ko: "사전 검증", en: "Pre-check" }, sub: { ko: "sqlglot · NOEXEC", en: "sqlglot · NOEXEC" } },
    { id: "answer", role: "out", step: 3, x: 504, w: 96, ...MAIN, label: { ko: "답변", en: "Answer" }, sub: { ko: "0행이면 되묻기", en: "Asks back on 0 rows" } },
    { id: "llm", role: "llm", step: 1, x: 180, w: 100, ...RES, label: { ko: "LLM", en: "LLM" }, sub: { ko: "온프레미스", en: "On-premises" } },
    { id: "erp", role: "db", step: 2, x: 352, w: 100, ...RES, label: { ko: "ERP DB", en: "ERP DB" }, sub: { ko: "MSSQL", en: "MSSQL" } },
  ],
  edges: [
    { from: "q", to: "gen", step: 1 },
    { from: "gen", to: "check", step: 2 },
    { from: "check", to: "answer", step: 3 },
    { from: "gen", to: "llm", step: 1, link: true },
    { from: "check", to: "erp", step: 2, link: true },
  ],
  loops: [{ from: "check", to: "gen", step: 2, tries: 3, note: { ko: "실패하면 다시 생성", en: "Retry on failure" } }],
  steps: [
    {
      ko: '진천공장 실무진은 SQL을 모릅니다. 전에는 전산팀에 요청하고 답을 2~3일 기다렸습니다. 예시 질문: "지난달 품목별 생산량 보여줘"',
      en: 'Staff at the Jincheon plant don\'t know SQL. They used to ask IT and wait 2–3 days for an answer. Example question: "Show last month\'s output by item"',
    },
    {
      ko: "의도를 분류하고 필요한 스키마만 골라, 공장 안의 온프레미스 LLM이 SQL을 작성합니다. 데이터는 밖으로 나가지 않습니다.",
      en: "It classifies the intent, picks only the schema it needs, and an on-premises LLM inside the plant writes the SQL. Data never leaves the site.",
    },
    {
      ko: "sqlglot으로 문법을, NOEXEC로 실행 계획을 확인합니다. 통과하지 못하면 다시 쓰게 하되 3회까지만입니다.",
      en: "sqlglot checks the syntax and NOEXEC checks the execution plan. If it fails, the SQL is rewritten, at most 3 times.",
    },
    {
      ko: '결과가 0행이면 "없음"으로 끝내지 않고 이전 월로 다시 볼지 묻습니다. 진천공장 실무진 인터뷰에서 나온 요구입니다.',
      en: 'On zero rows it doesn\'t stop at "nothing found"; it asks whether to check the previous month. That request came from interviewing the plant staff.',
    },
    {
      ko: "조회 대기가 2~3일에서 30초로 줄었습니다. 현장 실무진 120명이 한 달에 600번 씁니다.",
      en: "The wait went from 2–3 days to 30 seconds. 120 people on the floor use it 600 times a month.",
    },
  ],
};

const marketinghub: Flow = {
  width: 660,
  height: 320,
  nodes: [
    { id: "q", role: "human", step: 0, x: 0, w: 130, ...MAIN, label: { ko: "현업 질의", en: "Query" }, sub: { ko: "자연어", en: "Natural language" } },
    { id: "retrieve", role: "agent", step: 1, x: 170, w: 160, ...MAIN, label: { ko: "메타데이터 검색", en: "Meta search" } },
    { id: "gen", role: "agent", step: 2, x: 370, w: 124, ...MAIN, label: { ko: "SQL 생성", en: "Write SQL" }, sub: { ko: "Pseudo-SQL 먼저", en: "Pseudo-SQL first" } },
    { id: "explain", role: "guard", step: 3, x: 534, w: 110, ...MAIN, label: { ko: "검증", en: "Validate" }, sub: { ko: "SQL Explain", en: "SQL Explain" } },
    { id: "admin", role: "out", step: 1, x: 10, w: 150, ...RES, label: { ko: "메타 어드민", en: "Meta admin" }, sub: { ko: "현업이 직접 등록", en: "Users register" } },
    { id: "meta", role: "db", step: 1, x: 200, w: 100, ...RES, label: { ko: "메타 DB", en: "Meta DB" }, sub: { ko: "KURE-V1 임베딩", en: "KURE-V1 vectors" } },
    { id: "llm", role: "llm", step: 2, x: 372, w: 120, ...RES, label: { ko: "GPT-oss-120b", en: "GPT-oss-120b" }, sub: { ko: "vLLM 서빙", en: "vLLM serving" } },
    { id: "oracle", role: "db", step: 3, x: 539, w: 100, ...RES, label: { ko: "Oracle", en: "Oracle" }, sub: { ko: "마케팅허브 DB", en: "Marketing Hub DB" } },
  ],
  edges: [
    { from: "q", to: "retrieve", step: 1 },
    { from: "retrieve", to: "gen", step: 2 },
    { from: "gen", to: "explain", step: 3 },
    { from: "admin", to: "meta", step: 1 },
    { from: "retrieve", to: "meta", step: 1, link: true },
    { from: "gen", to: "llm", step: 2, link: true },
    { from: "explain", to: "oracle", step: 3, link: true },
  ],
  loops: [{ from: "explain", to: "gen", step: 3, tries: 3, note: { ko: "오류면 다시 생성", en: "Retry on error" } }],
  steps: [
    {
      ko: "농협은행 마케팅 담당자가 자연어로 질의합니다. 은행 폐쇄망이라 외부 API는 하나도 쓸 수 없습니다.",
      en: "A marketer at NH Bank asks in plain language. The bank runs on a closed network, so no external API is allowed.",
    },
    {
      ko: "질의에 맞는 테이블과 컬럼을 메타데이터에서 찾습니다. 메타데이터는 현업이 메타 어드민에서 직접 등록하고, 검색에는 금융 용어로 파인튜닝한 KURE-V1을 씁니다.",
      en: "It looks up matching tables and columns in the metadata. Business users register that metadata themselves in Meta Admin, and search uses KURE-V1 fine-tuned on finance terms.",
    },
    {
      ko: "바로 SQL을 쓰지 않고 Pseudo-SQL을 먼저 만듭니다. 모델은 Gemma와 EXAONE을 검토한 뒤 vLLM으로 띄운 GPT-oss-120b를 골랐습니다.",
      en: "It drafts Pseudo-SQL before writing real SQL. The model is GPT-oss-120b served on vLLM, chosen after evaluating Gemma and EXAONE.",
    },
    {
      ko: "실행 전에 SQL Explain으로 검증합니다. 오류가 나면 다시 쓰게 하되 3회까지만입니다.",
      en: "SQL Explain checks the query before it runs. On an error it rewrites, at most 3 times.",
    },
    {
      ko: "현업 질의 100개 테스트셋 정확도가 60%에서 95~100%로 올랐습니다 (팀 성과). 현업 20명이 한 달에 200번 씁니다.",
      en: "Accuracy on a 100-question test set from business users went from 60% to 95–100% (team result). 20 people use it 200 times a month.",
    },
  ],
};

/* 위 줄은 문서를 지식으로(왼→오), 아래 줄은 질문에서 답변까지(오→왼) */
const TOP = { y: 40, h: 44 };
const BOTTOM = { y: 190, h: 44 };

const nhrag: Flow = {
  width: 720,
  height: 290,
  nodes: [
    { id: "docs", role: "human", step: 0, x: 0, w: 134, ...TOP, caption: { ko: "문서", en: "Docs" }, label: { ko: "업무방법서", en: "Manuals" }, sub: { ko: "60개, 3,000쪽", en: "60 docs, 3K pages" } },
    { id: "ocr", role: "llm", step: 1, x: 170, w: 140, ...TOP, label: { ko: "Vision OCR", en: "Vision OCR" }, sub: { ko: "레이아웃 보존", en: "Layout preserved" } },
    { id: "chunk", role: "agent", step: 2, x: 346, w: 166, ...TOP, label: { ko: "조항 단위 청킹", en: "Clause chunking" }, sub: { ko: "문서명, 페이지 유지", en: "Doc name, page kept" } },
    { id: "index", role: "db", step: 2, x: 548, w: 150, ...TOP, label: { ko: "검색 인덱스", en: "Index" } },
    { id: "search", role: "agent", step: 3, x: 548, w: 150, ...BOTTOM, label: { ko: "근거 검색", en: "Retrieval" }, sub: { ko: "영업점 직원 질문", en: "Staff question" } },
    { id: "llm", role: "llm", step: 3, x: 380, w: 110, ...BOTTOM, label: { ko: "LLM", en: "LLM" }, sub: { ko: "답변 생성", en: "Answer generation" } },
    { id: "ui", role: "out", step: 4, x: 170, w: 140, ...BOTTOM, label: { ko: "답변 화면", en: "Answer" }, sub: { ko: "문서명, 페이지 표시", en: "Cites doc, page" } },
  ],
  edges: [
    { from: "docs", to: "ocr", step: 1 },
    { from: "ocr", to: "chunk", step: 2 },
    { from: "chunk", to: "index", step: 2 },
    { from: "index", to: "search", step: 3 },
    { from: "search", to: "llm", step: 3 },
    { from: "llm", to: "ui", step: 4 },
  ],
  loops: [],
  steps: [
    {
      ko: "영업점 직원이 찾아보는 상호금융 업무방법서는 약 60개, 3,000쪽입니다.",
      en: "Branch staff look things up in about 60 mutual-finance operation manuals, 3,000 pages in all.",
    },
    {
      ko: "업무방법서를 Vision OCR로 마크다운으로 바꿉니다. 표와 2단 레이아웃을 지키려고 수치 표는 별도 파이프라인으로 처리합니다.",
      en: "Vision OCR converts the manuals to markdown. To keep tables and two-column layouts intact, numeric tables go through a separate pipeline.",
    },
    {
      ko: "조항 단위로 잘라 색인하고, 조각마다 문서명과 페이지를 붙여 둡니다.",
      en: "Text is split by clause and indexed, and every chunk keeps its document name and page.",
    },
    {
      ko: "직원이 규정을 물으면 근거 조항을 찾고, LLM이 그 조항을 바탕으로 답을 씁니다.",
      en: "When staff ask about a rule, it retrieves the relevant clauses and the LLM writes an answer from them.",
    },
    {
      ko: "답변마다 문서명과 페이지를 표시합니다. 출처를 누르면 원문 해당 위치가 열리는 기능은 요구서에 없었는데 직접 제안했습니다.",
      en: "Every answer shows the document and page. Opening the original at the cited spot when you click a source was not in the requirements; I proposed it.",
    },
  ],
};

const matseon: Flow = {
  width: 720,
  height: 320,
  nodes: [
    { id: "taste", role: "human", step: 0, x: 0, w: 120, ...MAIN, label: { ko: "고객 취향", en: "Taste" }, sub: { ko: "게임하기 UI", en: "Game-style UI" } },
    { id: "intent", role: "agent", step: 1, x: 156, w: 130, ...MAIN, label: { ko: "의도 분류", en: "Intent" }, sub: { ko: "LangGraph 노드", en: "LangGraph node" } },
    { id: "rag", role: "agent", step: 2, x: 322, w: 220, ...MAIN, label: { ko: "하이브리드 RAG", en: "Hybrid RAG" }, sub: { ko: "페르소나 12종", en: "12 personas" } },
    { id: "answer", role: "out", step: 3, x: 578, w: 130, ...MAIN, label: { ko: "추천 답변", en: "Recommendation" }, sub: { ko: "React 스트리밍", en: "React streaming" } },
    { id: "vsearch", role: "db", step: 2, x: 262, w: 170, ...RES, label: { ko: "Vertex AI Search", en: "Vertex AI Search" }, sub: { ko: "사내 상품", en: "In-house products" } },
    { id: "gsearch", role: "tool", step: 2, x: 452, w: 160, ...RES, label: { ko: "Google Search", en: "Google Search" }, sub: { ko: "외부 정보", en: "Outside info" } },
  ],
  edges: [
    { from: "taste", to: "intent", step: 1 },
    { from: "intent", to: "rag", step: 2 },
    { from: "rag", to: "answer", step: 3 },
    { from: "rag", to: "vsearch", step: 2, link: true },
    { from: "rag", to: "gsearch", step: 2, link: true },
  ],
  loops: [],
  steps: [
    {
      ko: "농협 상품몰에서 쌀과 잡곡을 고르는 고객에게 '게임하기' 화면으로 가구 형태와 좋아하는 식감을 먼저 묻습니다.",
      en: "Shoppers choosing rice and grains on the NH mall first play a short game that asks about their household and the textures they like.",
    },
    {
      ko: '처음엔 모델이 도구를 직접 고르는 Tool Calling이었는데, 자꾸 실패했고 느리고 답이 매번 달랐습니다. 그래서 라우팅을 LangGraph 의도 분류 노드로 떼어 내고, "찰진 저당 잡곡"과 "잘 팔리는 잡곡"처럼 갈 길이 다른 질의를 시나리오로 나눠 라우팅 정확도로 확인했습니다.',
      en: 'The first version used Tool Calling, letting the model pick tools itself; it kept failing, was slow, and answered differently every time. I moved routing into a LangGraph intent node and checked routing accuracy on scenarios that must split, like "chewy low-sugar grains" versus "best-selling grains".',
    },
    {
      ko: "12가지 고객 페르소나를 프롬프트에 넣고, 사내 상품 지식(Vertex AI Search)과 외부 정보(Google Search)를 합친 하이브리드 RAG로 상품을 고릅니다.",
      en: "Twelve customer personas go into the prompt, and a hybrid RAG over in-house product knowledge (Vertex AI Search) and outside information (Google Search) picks the products.",
    },
    {
      ko: "추천은 React 화면에 스트리밍으로 나가는데, 응답이 자주 멈췄습니다. Google ADK lite_llm 안에서 이벤트 루프를 막던 동기 함수를 찾아 고쳐 첫 토큰 응답 시간을 20% 줄였고, 원인은 공식 저장소에 이슈로 올렸습니다.",
      en: "Recommendations stream into a React UI, and the stream kept stalling. I found a sync call blocking the event loop inside Google ADK's lite_llm, fixed it to cut first-token time by 20%, and filed the cause as an upstream issue.",
    },
  ],
};

export const FLOWS: Record<ProjectId, Flow> = { seonil, marketinghub, nhrag, matseon };
