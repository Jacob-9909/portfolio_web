/* 수치, 기간, 고유명사의 원장은 ~/job/02_핵심-스펙.md 와 03_스토리뱅크.md.
   여기 문구를 고칠 때는 원장과 먼저 대조한다.
   다이어그램과 단계 설명은 flows.ts 에 있다.
   node --test 가 이 파일을 직접 읽으므로 값 import 는 두지 않는다 (import type 만). */

export type ProjectId = "seonil" | "marketinghub" | "nhrag" | "matseon";

/** 첫 화면 문장 조각. 객체는 손을 대면 근거 메모가 뜨는 문구 */
export type Seg = string | { text: string; note: string; src: string };

export interface Project {
  id: ProjectId;
  title: string;
  /** 소속과 기간 */
  meta: string;
  /** 무대에 크게 나오는 한 줄 */
  headline: string;
  /** 목록에 붙는 대표 숫자 */
  number: string;
  stack: string;
}

export interface Row {
  period: string;
  text: string;
}

export const LINKS = {
  email: "cj0336j@gmail.com",
  github: "https://github.com/Jacob-9909",
  blog: "https://jacob-log.vercel.app/",
  // public/ 에 넣은 공개용 포트폴리오 PDF (전화번호 없음, 생년월일 대신 "1999년생").
  // 앞의 /portfolio_web 은 next.config.mjs 의 basePath 와 같아야 한다.
  // 원본을 고치면 sh scripts/web-pdf.sh 로 다시 만든다. 원본 PDF를 그대로 복사하지 않는다.
  portfolio: "/portfolio_web/woohyuck-jeong-portfolio.pdf",
};

const ko = {
  name: "정우혁",
  role: "AI Engineer, Didim",
  hero: {
    title: [
      "틀리면 안 되는 ",
      {
        text: "숫자",
        note: "Text-to-SQL에서 숫자는 LLM이 쓰지 않고 DB 쿼리 결과에서 나옵니다. 범농협 RAG에서는 수치 표를 따로 처리하는 파이프라인을 분리했습니다.",
        src: "선일다이파스 · 마케팅허브 · 범농협",
      },
      "는 LLM한테 맡기지 않습니다.",
    ] as Seg[],
    sub: [
      "정우혁 · Didim AI Engineer. ",
      {
        text: "은행 폐쇄망",
        note: "외부 API를 쓸 수 없는 농협은행 마케팅허브에서 현업 질의 정확도를 60%에서 95~100%로 올렸습니다 (팀 성과).",
        src: "농협은행 마케팅허브 Text-to-SQL",
      },
      "과 ",
      {
        text: "공장",
        note: "조회 한 번에 2~3일 기다리던 진천공장 실무진이 이제 30초 만에 답을 받습니다.",
        src: "선일다이파스 Text-to-SQL",
      },
      "에서 Text-to-SQL 에이전트를 만들어 왔습니다.",
    ] as Seg[],
  },
  nav: {
    projects: "프로젝트",
    career: "경력",
    skills: "기술",
    blog: "블로그",
    email: "이메일",
    github: "GitHub",
    portfolio: "포트폴리오 PDF",
    language: "언어",
  },
  labels: {
    step: "단계",
    example: "예시",
    prev: "이전",
    next: "다음",
    skip: "본문으로 건너뛰기",
    passed: "통과",
    roles: { human: "사람", agent: "에이전트", guard: "검증", out: "응답", res: "자원" },
  },
  projects: [
    {
      id: "seonil",
      title: "선일다이파스 Text-to-SQL",
      meta: "Didim, 2026.04 ~ 2026.08",
      headline: "공장 실무진이 전산팀을 거치지 않고 ERP에 직접 묻는 에이전트",
      number: "2~3일 → 30초",
      stack: "Python, LangGraph, FastAPI, PgVector, 온프레미스",
    },
    {
      id: "marketinghub",
      title: "농협은행 마케팅허브 Text-to-SQL",
      meta: "Didim, 2025.09 ~ 2026.02",
      headline: "외부 API 없는 은행 폐쇄망에서 마케팅 질의를 SQL로 바꾸는 에이전트",
      number: "60% → 95~100% (팀 성과)",
      stack: "Python, LangGraph, FastAPI, PgVector, vLLM, Fine-tuning",
    },
    {
      id: "nhrag",
      title: "범농협 영업점 어시스턴트",
      meta: "농협중앙회, 삼일PwC, 삼정KPMG, Google과 협업, 2025.04 ~ 2025.08",
      headline: "상호금융 규정을 물으면 근거 문서와 쪽수를 붙여 답하는 RAG",
      number: "3,000쪽",
      stack: "Python, GCP, Google ADK, LangGraph, React",
    },
    {
      id: "matseon",
      title: "농협 맛선 상품 추천 에이전트",
      meta: "농협중앙회 · Didim, 2025.04 ~ 2025.08",
      headline: "쌀과 잡곡을 고객 취향에 맞춰 추천하는 농협 상품몰 에이전트",
      number: "첫 토큰 20% 단축",
      stack: "Python, Google ADK, LangGraph, React, Vertex AI Search, Google Search",
    },
  ] as Project[],
  career: [
    { period: "2025.01 ~ 현재", text: "Didim, AI Engineer (LLM, ML)" },
    { period: "2024.09 ~ 2024.12", text: "ODOC, Associate Product Manager 인턴" },
    { period: "2019.03 ~ 2025.02", text: "국민대학교 회계학과, AI빅데이터융합경영학과 복수전공" },
  ] as Row[],
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
  hero: {
    title: [
      "I don't let LLMs handle ",
      {
        text: "numbers",
        note: "In Text-to-SQL, numbers come from database query results, not from the LLM. In the Pan-NH RAG, numeric tables run through a separate pipeline.",
        src: "Seonil Dyphas · Marketing Hub · Pan-NH",
      },
      " that can't be wrong.",
    ],
    sub: [
      "Woohyuck Jeong · AI Engineer at Didim. I've been building Text-to-SQL agents for ",
      {
        text: "closed-network banks",
        note: "At NH Bank's Marketing Hub, with no external APIs, accuracy on business users' questions went from 60% to 95–100% (team result).",
        src: "NH Bank Marketing Hub Text-to-SQL",
      },
      " and ",
      {
        text: "factories",
        note: "Staff at the Jincheon plant who waited 2–3 days for each data request now get answers in 30 seconds.",
        src: "Seonil Dyphas Text-to-SQL",
      },
      ".",
    ],
  },
  nav: {
    projects: "Projects",
    career: "Experience",
    skills: "Skills",
    blog: "Blog",
    email: "Email",
    github: "GitHub",
    portfolio: "Portfolio PDF",
    language: "Language",
  },
  labels: {
    step: "Step",
    example: "example",
    prev: "Previous",
    next: "Next",
    skip: "Skip to content",
    passed: "passed",
    roles: { human: "Person", agent: "Agent", guard: "Check", out: "Response", res: "Resource" },
  },
  projects: [
    {
      id: "seonil",
      title: "Seonil Dyphas Text-to-SQL",
      meta: "Didim, 2026.04 ~ 2026.08",
      headline: "Factory staff query the ERP directly, without going through IT",
      number: "2–3 days → 30 s",
      stack: "Python, LangGraph, FastAPI, PgVector, on-premise",
    },
    {
      id: "marketinghub",
      title: "NH Bank Marketing Hub Text-to-SQL",
      meta: "Didim, 2025.09 ~ 2026.02",
      headline: "Turning marketing questions into SQL inside a bank network with no external APIs",
      number: "60% → 95–100% (team result)",
      stack: "Python, LangGraph, FastAPI, PgVector, vLLM, fine-tuning",
    },
    {
      id: "nhrag",
      title: "Pan-NH branch assistant",
      meta: "with NACF, Samil PwC, Samjong KPMG and Google, 2025.04 ~ 2025.08",
      headline: "RAG that answers rule questions with the source document and page",
      number: "3,000 pages",
      stack: "Python, GCP, Google ADK, LangGraph, React",
    },
    {
      id: "matseon",
      title: "NH Matseon product recommendation agent",
      meta: "NACF · Didim, 2025.04 ~ 2025.08",
      headline: "Recommending rice and grains to match each shopper's taste on the NH mall",
      number: "First token 20% faster",
      stack: "Python, Google ADK, LangGraph, React, Vertex AI Search, Google Search",
    },
  ],
  career: [
    { period: "2025.01 ~ now", text: "Didim, AI Engineer (LLM, ML)" },
    { period: "2024.09 ~ 2024.12", text: "ODOC, Associate Product Manager intern" },
    { period: "2019.03 ~ 2025.02", text: "Kookmin University, Accounting with a double major in AI Big Data Convergence Management" },
  ],
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
export type T = (typeof translations)["ko"];
