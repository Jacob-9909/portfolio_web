/* 수치, 기간, 고유명사의 원장은 ~/job/02_핵심-스펙.md 와 03_스토리뱅크.md.
   여기 문구를 고칠 때는 원장과 먼저 대조한다.
   다이어그램과 단계 설명은 flows.ts 에 있다.
   node --test 가 이 파일을 직접 읽으므로 값 import 는 두지 않는다 (import type 만). */

export type ProjectId = "seonil" | "marketinghub" | "nhrag" | "matseon";

/** 첫 화면 문장 조각. 객체는 손을 대면 근거 메모가 뜨는 문구 */
export type Seg = string | { text: string; note: string; src: string };

/** 프로젝트 유형: Text-to-SQL, RAG 챗봇, 추천 에이전트 */
export type Kind = "sql" | "rag" | "rec";

export interface Fact {
  label: string;
  value: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: ProjectId;
  title: string;
  kind: Kind;
  kindLabel: string;
  /** 소속과 기간 (인쇄용 한 줄) */
  meta: string;
  /** 무대에 크게 나오는 한 줄 */
  headline: string;
  /** 목록에 붙는 대표 숫자 */
  number: string;
  stack: string;
  /** 앱 창 왼쪽과 무대 왼쪽에 순서대로 나오는 정보. 첫 칸은 고객(또는 협업) */
  facts: Fact[];
  /** 숫자 카드 1~3개. 첫 값은 number 의 앞부분과 같다. 새 수치는 만들지 않고 flows.ts 단계 문구에 있는 값만 쓴다 */
  metrics: Metric[];
}

export interface Principle {
  kind: Kind;
  fig: "bars" | "docs" | "router";
  no: string;
  title: string;
  /** **굵게** 표기를 쓴다 */
  body: string;
  projects: string;
}

export interface CareerItem {
  badge: string;
  period: string;
  org: string;
  role: string;
  text?: string;
  now?: boolean;
}

export interface SkillItem {
  name: string;
  /** public/icons/<icon>.svg */
  icon: string;
}

export interface SkillGroup {
  title: string;
  variant?: "main" | "lang" | "cert";
  items: SkillItem[];
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
      "디딤 AI Engineer 정우혁. ",
      {
        text: "은행",
        note: "외부 API를 쓸 수 없는 농협은행 마케팅허브에서 현업 질의 정확도를 60%에서 95~100%로 올렸습니다 (팀 성과).",
        src: "농협은행 마케팅허브 Text-to-SQL",
      },
      ", ",
      {
        text: "공장",
        note: "조회 한 번에 2~3일 기다리던 진천공장 실무진이 이제 30초 만에 답을 받습니다.",
        src: "선일다이파스 Text-to-SQL",
      },
      ", ",
      {
        text: "농협 상품몰",
        note: "농협 맛선 상품몰에서 쌀과 잡곡을 취향에 맞춰 추천하는 에이전트를 만들었습니다. 첫 토큰 응답을 20% 줄였습니다.",
        src: "농협 맛선 추천 에이전트",
      },
      "에서 Text-to-SQL·RAG 챗봇·추천 에이전트를 만들어 왔습니다.",
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
    contact: "연락하기",
  },
  labels: {
    step: "단계",
    skip: "본문으로 건너뛰기",
    passed: "통과",
    roles: { human: "사람", agent: "에이전트", guard: "검증", out: "응답", res: "자원" },
    sample: "샘플 화면 · 예시 데이터",
    projectInfo: "프로젝트 정보",
    runLog: "실행 기록",
    clients: "함께 일한 곳",
    howItWorks: "작동 구조",
    result: "결과",
    now: "현재",
  },
  sections: { how: "일하는 방식", projects: "프로젝트 · 어떻게 돌아가나", career: "경력", skills: "기술" },
  statement: {
    lead: "SQL을 쓰든, 규정을 찾든, 상품을 고르든 같은 원칙으로 만듭니다.",
    rest: "LLM에게는 말을 맡기고, 숫자와 근거와 분기는 코드가 책임집니다.",
  },
  principles: [
    { kind: "sql", fig: "bars", no: "FIG 0.1", title: "숫자는 DB가 계산", body: "답 속 숫자는 쿼리 결과에서 옵니다. 쿼리는 실행 전에 **sqlglot · NOEXEC**로 검사합니다.", projects: "선일다이파스 · 마케팅허브" },
    { kind: "rag", fig: "docs", no: "FIG 0.2", title: "답에는 근거를 붙인다", body: "규정 **3,000쪽**에서 찾은 문서와 쪽수를 답에 붙입니다. 표는 별도 파이프라인으로 처리합니다.", projects: "범농협 영업점" },
    { kind: "rec", fig: "router", no: "FIG 0.3", title: "분기는 코드가 정한다", body: "모델이 도구를 고르던 방식을 **의도 분류 노드**로 바꿔, 늦고 매번 다르던 응답을 잡았습니다.", projects: "농협 맛선" },
  ] as Principle[],
  clients: ["선일다이파스", "NH농협은행", "농협중앙회", "삼일PwC", "삼정KPMG", "Google"],
  projects: [
    {
      id: "seonil",
      title: "선일다이파스 Text-to-SQL",
      kind: "sql",
      kindLabel: "Text-to-SQL",
      meta: "Didim, 2026.04 ~ 2026.08",
      headline: "공장 실무진이 전산팀을 거치지 않고 ERP에 직접 묻는 에이전트",
      number: "2~3일 → 30초",
      stack: "Python, LangGraph, FastAPI, PgVector, 온프레미스",
      facts: [
        { label: "고객", value: "선일다이파스 진천공장" },
        { label: "기간", value: "Didim · 2026.04 ~ 08" },
        { label: "환경", value: "온프레미스 · MSSQL ERP" },
        { label: "스택", value: "Python · LangGraph · FastAPI · PgVector" },
      ],
      metrics: [
        { value: "2~3일 → 30초", label: "조회 대기" },
        { value: "120명", label: "현장 사용자" },
        { value: "월 600회", label: "사용" },
      ],
    },
    {
      id: "marketinghub",
      title: "농협은행 마케팅허브 Text-to-SQL",
      kind: "sql",
      kindLabel: "Text-to-SQL",
      meta: "Didim, 2025.09 ~ 2026.02",
      headline: "외부 API 없는 은행 폐쇄망에서 마케팅 질의를 SQL로 바꾸는 에이전트",
      number: "60% → 95~100% (팀 성과)",
      stack: "Python, LangGraph, FastAPI, PgVector, vLLM, Fine-tuning",
      facts: [
        { label: "고객", value: "NH농협은행" },
        { label: "기간", value: "Didim · 2025.09 ~ 2026.02" },
        { label: "환경", value: "은행 폐쇄망 · 외부 API 없음" },
        { label: "스택", value: "Python · LangGraph · vLLM · Fine-tuning" },
      ],
      metrics: [
        { value: "60% → 95~100%", label: "정확도 (팀 성과)" },
        { value: "20명", label: "현업 사용자" },
        { value: "월 200회", label: "사용" },
      ],
    },
    {
      id: "nhrag",
      title: "범농협 영업점 어시스턴트",
      kind: "rag",
      kindLabel: "RAG 챗봇",
      meta: "농협중앙회, 삼일PwC, 삼정KPMG, Google과 협업, 2025.04 ~ 2025.08",
      headline: "상호금융 규정을 물으면 근거 문서와 쪽수를 붙여 답하는 RAG",
      number: "3,000쪽",
      stack: "Python, GCP, Google ADK, LangGraph, React",
      facts: [
        { label: "협업", value: "농협중앙회 · 삼일PwC · 삼정KPMG · Google" },
        { label: "기간", value: "2025.04 ~ 08" },
        { label: "스택", value: "Python · GCP · Google ADK · LangGraph · React" },
      ],
      metrics: [
        { value: "3,000쪽", label: "업무방법서" },
        { value: "약 60개", label: "문서" },
      ],
    },
    {
      id: "matseon",
      title: "농협 맛선 상품 추천 에이전트",
      kind: "rec",
      kindLabel: "추천 에이전트",
      meta: "농협중앙회 · Didim, 2025.04 ~ 2025.08",
      headline: "쌀과 잡곡을 고객 취향에 맞춰 추천하는 농협 상품몰 에이전트",
      number: "첫 토큰 20% 단축",
      stack: "Python, Google ADK, LangGraph, React, Vertex AI Search, Google Search",
      facts: [
        { label: "고객", value: "농협중앙회" },
        { label: "기간", value: "Didim · 2025.04 ~ 08" },
        { label: "스택", value: "Python · Google ADK · LangGraph · Vertex AI Search" },
      ],
      metrics: [
        { value: "첫 토큰 20% 단축", label: "응답 속도" },
        { value: "12가지", label: "고객 페르소나" },
      ],
    },
  ] as Project[],
  career: [
    { badge: "현재", period: "2025.01 — 현재", org: "Didim", role: "AI Engineer · LLM, ML", text: "금융·제조 고객의 Text-to-SQL, RAG 챗봇, 추천 에이전트를 만듭니다.", now: true },
    { badge: "인턴", period: "2024.09 — 2024.12", org: "ODOC", role: "Associate Product Manager" },
    { badge: "학력", period: "2019.03 — 2025.02", org: "국민대학교", role: "회계학 · AI빅데이터융합경영 복수전공" },
  ] as CareerItem[],
  skills: [
    { title: "AI", variant: "main", items: [
      { name: "LangGraph", icon: "langgraph" }, { name: "RAG", icon: "rag" }, { name: "Fine-tuning", icon: "finetuning" },
      { name: "Google ADK", icon: "google-adk" }, { name: "MCP", icon: "mcp" }, { name: "vLLM", icon: "vllm" },
      { name: "Deep Agent", icon: "langchain" }, { name: "PyTorch", icon: "pytorch" },
    ] },
    { title: "언어", variant: "lang", items: [
      { name: "Python", icon: "python" }, { name: "Java", icon: "java" }, { name: "SQL", icon: "sql" },
    ] },
    { title: "백엔드 · 데이터", items: [
      { name: "FastAPI", icon: "fastapi" }, { name: "PostgreSQL", icon: "postgres" }, { name: "PgVector", icon: "pgvector" },
      { name: "Neo4j", icon: "neo4j" }, { name: "Oracle", icon: "oracle" }, { name: "MSSQL", icon: "mssql" },
    ] },
    { title: "인프라", items: [
      { name: "GCP · Vertex AI", icon: "gcp" }, { name: "Docker", icon: "docker" }, { name: "Kubernetes", icon: "kubernetes" },
      { name: "Prometheus", icon: "prometheus" }, { name: "Opik", icon: "opik" },
    ] },
    { title: "도구", items: [
      { name: "Tableau", icon: "tableau" }, { name: "React", icon: "react" }, { name: "Next.js", icon: "nextjs" },
      { name: "Claude Code", icon: "claude" }, { name: "Codex", icon: "codex" }, { name: "Gemini", icon: "gemini" }, { name: "Kiro", icon: "kiro" },
    ] },
    { title: "자격", variant: "cert", items: [
      { name: "빅데이터분석기사", icon: "" }, { name: "SQLD", icon: "" }, { name: "ADsP", icon: "" },
      { name: "컴퓨터활용능력 1급", icon: "" }, { name: "TOEIC Speaking AL", icon: "" },
    ] },
  ] as SkillGroup[],
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
      "Woohyuck Jeong, AI Engineer at Didim. I've built Text-to-SQL, RAG chatbots and recommendation agents for ",
      {
        text: "banks",
        note: "At NH Bank's Marketing Hub, with no external APIs, accuracy on business users' questions went from 60% to 95–100% (team result).",
        src: "NH Bank Marketing Hub Text-to-SQL",
      },
      ", ",
      {
        text: "factories",
        note: "Staff at the Jincheon plant who waited 2–3 days for each data request now get answers in 30 seconds.",
        src: "Seonil Dyphas Text-to-SQL",
      },
      " and ",
      {
        text: "the NH online mall",
        note: "On NH's Matseon mall I built an agent that recommends rice and grains to match each shopper's taste, and cut time to first token by 20%.",
        src: "NH Matseon recommendation agent",
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
    contact: "Contact",
  },
  labels: {
    step: "Step",
    skip: "Skip to content",
    passed: "passed",
    roles: { human: "Person", agent: "Agent", guard: "Check", out: "Response", res: "Resource" },
    sample: "Sample screen · example data",
    projectInfo: "Project",
    runLog: "Run log",
    clients: "Worked with",
    howItWorks: "How it works",
    result: "Result",
    now: "Now",
  },
  sections: { how: "How I build", projects: "Projects · how they work", career: "Experience", skills: "Skills" },
  statement: {
    lead: "Whether it writes SQL, looks up rules or picks products, I build it on the same rules.",
    rest: "The LLM handles language. Code is responsible for numbers, sources and routing.",
  },
  principles: [
    { kind: "sql", fig: "bars", no: "FIG 0.1", title: "The database does the math", body: "Numbers in an answer come from query results. Every query is checked with **sqlglot · NOEXEC** before it runs.", projects: "Seonil Dyphas · Marketing Hub" },
    { kind: "rag", fig: "docs", no: "FIG 0.2", title: "Every answer cites its source", body: "Answers carry the document and page found in **3,000 pages** of rules. Tables go through a separate pipeline.", projects: "Pan-NH branches" },
    { kind: "rec", fig: "router", no: "FIG 0.3", title: "Code decides the route", body: "I replaced model-chosen tool calls with an **intent classification node**, fixing slow answers that changed every time.", projects: "NH Matseon" },
  ],
  clients: ["Seonil Dyphas", "NH Bank", "NACF", "Samil PwC", "Samjong KPMG", "Google"],
  projects: [
    {
      id: "seonil",
      title: "Seonil Dyphas Text-to-SQL",
      kind: "sql",
      kindLabel: "Text-to-SQL",
      meta: "Didim, 2026.04 ~ 2026.08",
      headline: "Factory staff query the ERP directly, without going through IT",
      number: "2–3 days → 30 s",
      stack: "Python, LangGraph, FastAPI, PgVector, on-premise",
      facts: [
        { label: "Client", value: "Seonil Dyphas, Jincheon plant" },
        { label: "Period", value: "Didim · 2026.04 ~ 08" },
        { label: "Setup", value: "On-premise · MSSQL ERP" },
        { label: "Stack", value: "Python · LangGraph · FastAPI · PgVector" },
      ],
      metrics: [
        { value: "2–3 days → 30 s", label: "Wait per query" },
        { value: "120", label: "Floor users" },
        { value: "600 / month", label: "Uses" },
      ],
    },
    {
      id: "marketinghub",
      title: "NH Bank Marketing Hub Text-to-SQL",
      kind: "sql",
      kindLabel: "Text-to-SQL",
      meta: "Didim, 2025.09 ~ 2026.02",
      headline: "Turning marketing questions into SQL inside a bank network with no external APIs",
      number: "60% → 95–100% (team result)",
      stack: "Python, LangGraph, FastAPI, PgVector, vLLM, fine-tuning",
      facts: [
        { label: "Client", value: "NH Bank" },
        { label: "Period", value: "Didim · 2025.09 ~ 2026.02" },
        { label: "Setup", value: "Closed bank network · no external APIs" },
        { label: "Stack", value: "Python · LangGraph · vLLM · fine-tuning" },
      ],
      metrics: [
        { value: "60% → 95–100%", label: "Accuracy (team result)" },
        { value: "20", label: "Business users" },
        { value: "200 / month", label: "Uses" },
      ],
    },
    {
      id: "nhrag",
      title: "Pan-NH branch assistant",
      kind: "rag",
      kindLabel: "RAG chatbot",
      meta: "with NACF, Samil PwC, Samjong KPMG and Google, 2025.04 ~ 2025.08",
      headline: "RAG that answers rule questions with the source document and page",
      number: "3,000 pages",
      stack: "Python, GCP, Google ADK, LangGraph, React",
      facts: [
        { label: "With", value: "NACF · Samil PwC · Samjong KPMG · Google" },
        { label: "Period", value: "2025.04 ~ 08" },
        { label: "Stack", value: "Python · GCP · Google ADK · LangGraph · React" },
      ],
      metrics: [
        { value: "3,000 pages", label: "Operating manuals" },
        { value: "About 60", label: "Documents" },
      ],
    },
    {
      id: "matseon",
      title: "NH Matseon product recommendation agent",
      kind: "rec",
      kindLabel: "Recommendation agent",
      meta: "NACF · Didim, 2025.04 ~ 2025.08",
      headline: "Recommending rice and grains to match each shopper's taste on the NH mall",
      number: "First token 20% faster",
      stack: "Python, Google ADK, LangGraph, React, Vertex AI Search, Google Search",
      facts: [
        { label: "Client", value: "NACF" },
        { label: "Period", value: "Didim · 2025.04 ~ 08" },
        { label: "Stack", value: "Python · Google ADK · LangGraph · Vertex AI Search" },
      ],
      metrics: [
        { value: "First token 20% faster", label: "Response speed" },
        { value: "12", label: "Shopper personas" },
      ],
    },
  ],
  career: [
    { badge: "Now", period: "2025.01 — now", org: "Didim", role: "AI Engineer · LLM, ML", text: "I build Text-to-SQL, RAG chatbots and recommendation agents for finance and manufacturing clients.", now: true },
    { badge: "Intern", period: "2024.09 — 2024.12", org: "ODOC", role: "Associate Product Manager" },
    { badge: "Education", period: "2019.03 — 2025.02", org: "Kookmin University", role: "Accounting · double major in AI Big Data Convergence Management" },
  ],
  skills: [
    { title: "AI", variant: "main", items: ko.skills[0].items },
    { title: "Languages", variant: "lang", items: ko.skills[1].items },
    { title: "Backend · data", items: ko.skills[2].items },
    { title: "Infra", items: ko.skills[3].items },
    { title: "Tools", items: ko.skills[4].items },
    { title: "Certificates", variant: "cert", items: [
      { name: "Big Data Analysis Engineer", icon: "" }, { name: "SQLD", icon: "" }, { name: "ADsP", icon: "" },
      { name: "Computer Literacy Level 1", icon: "" }, { name: "TOEIC Speaking AL", icon: "" },
    ] },
  ],
};

export const translations = { ko, en };
export type T = (typeof translations)["ko"];
