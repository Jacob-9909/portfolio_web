export interface CareerItem {
  company: string;
  role: string;
  period: string;
  active: boolean;
  description: string;
  stack: string[];
  tasks: string[];
}

export interface ProjectItem {
  title: string;
  org: string;
  period: string;
  stack: string[];
  description: string;
  /** 에이전트 스타일 상태 배지 (기본값: complete) */
  status?: "running" | "complete";
  /** featured 카드용 정적 파이프라인 노드 */
  pipeline?: string[];
  links?: { label: string; url: string }[];
}

export interface SideProjectItem {
  title: string;
  url: string;
  note: string;
}

const PROFILE_KO = {
  name: "WOOHYUCK JEONG",
  alias: "Jacob",
  role: "AI Engineer",
  company: "Didim",
  narrative: "회계학과에서 결산 보고서를 읽다가, 지금은 금융 현장의 문서와 쿼리를 읽는 AI 에이전트를 만듭니다. 틈틈이 Text-to-SQL 오픈소스 tablefold를 손보고 있습니다.",
  email: "cj0336j@gmail.com",
  github: "https://github.com/Jacob-9909",
  blog: "https://jacob-log.vercel.app/",
  resume: "https://drive.google.com/file/d/1-9p6MyBXtXMhgFPi1dYDymgRAVcALpDQ/view?usp=sharing",
  coreStack: [
    "Python",
    "LangGraph",
    "Google ADK",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "GCP",
    "RAG-Pipeline",
    "vLLM",
    "PyTorch",
    "Fine-tuning",
  ],
};

const PROFILE_EN = {
  ...PROFILE_KO,
  narrative: "I studied accounting and read financial statements. Now I build agents that read documents and SQL for a living — and maintain tablefold, an open-source Text-to-SQL pipeline, on the side.",
};

const CAREER_KO: CareerItem[] = [
  {
    company: "Didim",
    role: "AI Engineer (LLM, ML)",
    period: "2025.01 → now",
    active: true,
    description: "AI , Big Data , Cloud 매니지먼트 전문기업",
    stack: [
      "Python", "Java", "PostgreSQL", "FastAPI", "LangGraph", "RAG", "GCP", "Google ADK", "React", "Docker", "MCP"
    ],
    tasks: [
      "농협은행 BestBanker 실적 계산 멀티 에이전트 개발",
      "범농협 (농협중앙회 , 삼일PWC , 삼정KPMG , Google) AI 도입 및 생성형 AI 구축",
      "농협은행 마케팅허브: 데이터 기반 자연어 SQL 생성 Text-to-SQL",
      "자체 솔루션 Agent Builder 개발",
      "Altair: 솔루션 기반 데이터 시각화 및 ML 모델링",
    ],
  },
  {
    company: "ODOC",
    role: "Intern: Associate Product Manager",
    period: "2024.09 → 2024.12",
    active: false,
    description: "AX-ONE 생성형 AI 교육 플랫폼 서비스",
    stack: ["Python", "SQL", "DataGrip", "Jira", "Figma"],
    tasks: [
      "Contents Data 영상 수집 및 DB화",
      "교육 플랫폼 Curriculum 기획",
      "Log data & User flow 분석",
    ],
  },
];

const CAREER_EN: CareerItem[] = [
  {
    company: "Didim",
    role: "AI Engineer (LLM, ML)",
    period: "2025.01 → now",
    active: true,
    description: "AI, Big Data, Cloud Management Specialized Company",
    stack: [
      "Python", "Java", "PostgreSQL", "FastAPI", "LangGraph", "RAG", "GCP", "Google ADK", "React", "Docker", "MCP"
    ],
    tasks: [
      "Developed multi-agent for calculating NH Bank BestBanker performance",
      "Introduced and built generative AI for Pan-NH (NH NACF, Samil PwC, Samjong KPMG, Google)",
      "NH Bank Marketing Hub: Developed data-driven natural language Text-to-SQL",
      "Developed in-house solution Agent Builder",
      "Altair: Solution-based data visualization and ML modeling",
    ],
  },
  {
    company: "ODOC",
    role: "Intern: Associate Product Manager",
    period: "2024.09 → 2024.12",
    active: false,
    description: "AX-ONE Generative AI Education Platform Service",
    stack: ["Python", "SQL", "DataGrip", "Jira", "Figma"],
    tasks: [
      "Collected contents data (video) and built DB",
      "Planned curriculum for education platform",
      "Analyzed log data & user flow",
    ],
  },
];

const EDUCATION_KO = [
  {
    school: "국민대학교",
    major: "회계학과 & AI빅데이터융합경영학과",
    period: "2019.03 → 2025.02",
  },
  {
    school: "동두천외국어고등학교",
    major: "영어 & 중국어",
    period: "2015.03 → 2018.02",
  },
];

const EDUCATION_EN = [
  {
    school: "Kookmin University",
    major: "Accounting & AI Big Data Convergence Management",
    period: "2019.03 → 2025.02",
  },
  {
    school: "Dongducheon Foreign Language High School",
    major: "English & Chinese",
    period: "2015.03 → 2018.02",
  },
];

const PROJECTS_KO: ProjectItem[] = [
  {
    title: "tablefold — 스키마 폴딩 기반 Text-to-SQL 컨텍스트 압축",
    org: "개인 프로젝트 (Open Source)",
    period: "2026.08 → 진행중",
    stack: ["Python", "PostgreSQL", "LLM", "FastAPI", "Graph"],
    description:
      "Wren AI의 시맨틱 레이어에서 착안. 53개 물리 테이블을 7개 와이드 논리 모델(약 3k 토큰)로 접고, LLM이 쓴 논리 SQL을 조인 프루닝·그레인 보존 규칙으로 실행 가능한 물리 SQL로 펼치는 결정론적 파이프라인. 스키마가 커질수록 폭발하는 프롬프트 비용을 구조로 해결한 게 포인트.",
    status: "running",
    pipeline: ["53 tables", "fold", "7 logical", "LLM SQL", "unfold", "physical SQL"],
    links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/tablefold" }],
  },
  {
    title: "선일다이파스 자연어 기반 SQL 생성 (Text-to-SQL)",
    org: "선일다이파스 , Didim",
    period: "2026.04 → 진행중",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG"],
    description: "선일다이파스 제조 데이터를 대상으로 자연어 질의 → SQL 답변 에이전트를 구축 중. PgVector 기반 RAG로 스키마 컨텍스트를 보강합니다.",
    status: "running",
  },
  {
    title: "농협은행 BestBanker",
    org: "농협은행 , Didim",
    period: "2026.02 → 2026.04",
    stack: ["Python", "Google ADK", "PgVector", "RAG", "GCP"],
    description: "영업점 직원의 내규 문서를 읽고 실적 계산을 대신 수행하는 에이전트. GCP Vertex AI 기반 어시스턴트로 구축했습니다.",
  },
  {
    title: "농협은행 자연어 기반 SQL 생성 (Text-to-SQL)",
    org: "농협은행 마케팅허브 , Didim",
    period: "2025.09 → 2026.02",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG", "Fine-tuning"],
    description: "마케팅허브 데이터에 자연어로 질문하면 SQL로 답하는 서비스. 금융 도메인 Fine-tuning으로 모델 정확도를 끌어올렸습니다.",
  },
  {
    title: "Agent Builder (내부 솔루션)",
    org: "Didim",
    period: "2025.06 → 2025.07",
    stack: ["Python", "TypeScript", "Google ADK", "MCP"],
    description: "MCP 프로토콜 기반 툴 파트 담당 — Notion, Tavily, Slack, RAG MCP tool을 만들고 DB 연결과 Metric 관리까지 맡았습니다.",
  },
  {
    title: "범농협 생성형 AI 도입 및 구축",
    org: "범농협 (농협중앙회 , 삼일PWC , 삼정KPMG , Google)",
    period: "2025.04 → 2025.08",
    stack: ["Python", "GCP", "Google ADK", "LangGraph", "React", "MCP"],
    description: "범농협(농협중앙회, 삼일PWC, 삼정KPMG, Google) 생성형 AI 도입. GCP Vertex AI 기반 영업점 질의응답 어시스턴트와 상품 큐레이션 챗봇을 구축했습니다.",
  },
  {
    title: "Altair 솔루션 기반 시각화 및 모델링",
    org: "Altair",
    period: "2025.01 → 2025.04",
    stack: ["Python", "PostgreSQL", "Altair", "ML", "PyTorch"],
    description: "AI Studio & Panopticon으로 주식·산불 예측 모델을 만들고, Artbox 판매 데이터로 재고 관리 모델까지 확장했습니다.",
  },
  {
    title: "제2회 국민대학교 AI빅데이터분석 경진대회",
    org: "국민대학교",
    period: "2024.10 → 2024.11",
    stack: ["Python"],
    description: "한국기계산업진흥회 후원 — 주요 5개 산업 품목 1개년 무역량 예측 알고리즘 개발",
  },
  {
    title: "K리그 승률예측 프로그램 개발",
    org: "한이음",
    period: "2024.04 → 2024.11",
    stack: ["Python", "Tableau", "GCP", "MySQL"],
    description: "GCP 위에 머신러닝/딥러닝 파이프라인을 올려 K리그 경기 승률과 순위를 예측한 프로젝트.",
    links: [
      { label: "GitHub", url: "https://github.com/Jacob-9909/K_league_soccer_AI" },
      { label: "YouTube", url: "https://youtu.be/CRZJHyEIVEk?si=A8kmmgZGdbYJezqY" },
    ],
  },
  {
    title: "LG Aimers: Display Glass 불량 예측",
    org: "LG",
    period: "2024.07 → 2024.09",
    stack: ["Python", "Tableau"],
    description: "Automotive Display Glass Sub assembly Line 불량 예측 AI 모델 및 범용 프로세스 개발",
    links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/LG_aimers" }],
  },
  {
    title: "미래에셋 AI Data Festival",
    org: "미래에셋증권 , Naver Cloud",
    period: "2024.07 → 2024.08",
    stack: ["Python", "Tableau"],
    description: "미래에셋증권 데이터 기반 HyperClova X 활용 금융 투자 교육 AI 서비스 개발",
  },
  {
    title: "K-Water 대국민 물 빅데이터 공모전",
    org: "K-Water",
    period: "2023.06 → 2023.08",
    stack: ["Excel", "Python", "Tableau"],
    description: "전국 단위 농업 용수 사용 최적화를 위한 데이터 구축 및 가뭄 예방 시스템 제안",
    links: [
      { label: "Link", url: "https://drive.google.com/file/d/10xv5OkwS867kudIYXibXxxYiwniu4B3N/view?usp=drive_link" },
    ],
  },
  {
    title: "BDA 데이터분석 활용 공모전",
    org: "CJ제일제당 , 한국빅데이터학회",
    period: "2023.04 → 2023.06",
    stack: ["Excel", "Python", "Tableau"],
    description: "CJ제일제당 11번가/네이버 소비자 주문 내역 기반 마케팅 프로모션 제안",
    links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/CJ_bda_proj" }],
  },
];

const PROJECTS_EN: ProjectItem[] = [
  {
    title: "tablefold — Schema Folding for Text-to-SQL Context",
    org: "Personal Project (Open Source)",
    period: "2026.08 → Present",
    stack: ["Python", "PostgreSQL", "LLM", "FastAPI", "Graph"],
    description:
      "Inspired by Wren AI's semantic layer — folds 53 physical tables into 7 wide logical models (~3k tokens), then expands LLM-written logical SQL back into executable physical SQL with join pruning and grain preservation. The point: solving exploding prompt cost with structure, not bigger context windows.",
    status: "running",
    pipeline: ["53 tables", "fold", "7 logical", "LLM SQL", "unfold", "physical SQL"],
    links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/tablefold" }],
  },
  {
    title: "Seonil Dyphas Text-to-SQL",
    org: "Seonil Dyphas, Didim",
    period: "2026.04 → Present",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG"],
    description: "Manufacturing data, natural-language in, SQL out — currently building the agent, with PgVector-backed RAG supplying schema context.",
    status: "running",
  },
  {
    title: "NH Bank BestBanker",
    org: "NH Bank, Didim",
    period: "2026.02 → 2026.04",
    stack: ["Python", "Google ADK", "PgVector", "RAG", "GCP"],
    description: "An agent that reads NH Bank's internal regulation documents and calculates employee performance on their behalf. Runs on GCP Vertex AI.",
  },
  {
    title: "NH Bank Text-to-SQL",
    org: "NH Bank Marketing Hub, Didim",
    period: "2025.09 → 2026.02",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG", "Fine-tuning"],
    description: "Natural-language questions over Marketing Hub data, answered in SQL. Improved accuracy with financial-domain fine-tuning.",
  },
  {
    title: "Agent Builder (Internal Solution)",
    org: "Didim",
    period: "2025.06 → 2025.07",
    stack: ["Python", "TypeScript", "Google ADK", "MCP"],
    description: "Owned the MCP tool layer — Notion, Tavily, Slack and RAG tools, plus DB connections and metric management.",
  },
  {
    title: "Pan-NH Generative AI Introduction",
    org: "Pan-NH (NH NACF, PwC, KPMG, Google)",
    period: "2025.04 → 2025.08",
    stack: ["Python", "GCP", "Google ADK", "LangGraph", "React", "MCP"],
    description: "Introduced generative AI across Pan-NH (NH NACF, PwC, KPMG, Google) — a Vertex AI query assistant and a product curation chatbot.",
  },
  {
    title: "Altair Visualization & Modeling",
    org: "Altair",
    period: "2025.01 → 2025.04",
    stack: ["Python", "PostgreSQL", "Altair", "ML", "PyTorch"],
    description: "Built stock and wildfire prediction models with AI Studio & Panopticon, then extended into an inventory model on Artbox sales data.",
  },
  {
    title: "Kookmin Univ AI Big Data Contest",
    org: "Kookmin University",
    period: "2024.10 → 2024.11",
    stack: ["Python"],
    description: "Sponsored by KOAMI — Developed 1-year trade volume prediction algorithm for 5 major industry items",
  },
  {
    title: "K-League Win Rate Prediction",
    org: "Hanium",
    period: "2024.04 → 2024.11",
    stack: ["Python", "Tableau", "GCP", "MySQL"],
    description: "K-League match and ranking prediction — ML/DL pipelines running on GCP, results visualized in Tableau.",
    links: [
      { label: "GitHub", url: "https://github.com/Jacob-9909/K_league_soccer_AI" },
      { label: "YouTube", url: "https://youtu.be/CRZJHyEIVEk?si=A8kmmgZGdbYJezqY" },
    ],
  },
  {
    title: "LG Aimers: Display Glass Defect Prediction",
    org: "LG",
    period: "2024.07 → 2024.09",
    stack: ["Python", "Tableau"],
    description: "Defect prediction for automotive display glass sub-assembly lines, packaged as a reusable process.",
    links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/LG_aimers" }],
  },
  {
    title: "Mirae Asset AI Data Festival",
    org: "Mirae Asset Securities, Naver Cloud",
    period: "2024.07 → 2024.08",
    stack: ["Python", "Tableau"],
    description: "Developed financial investment education AI service using HyperClova X",
  },
  {
    title: "K-Water Water Big Data Contest",
    org: "K-Water",
    period: "2023.06 → 2023.08",
    stack: ["Excel", "Python", "Tableau"],
    description: "Constructed data for optimizing agricultural water usage and proposed a drought prevention system",
    links: [
      { label: "Link", url: "https://drive.google.com/file/d/10xv5OkwS867kudIYXibXxxYiwniu4B3N/view?usp=drive_link" },
    ],
  },
  {
    title: "BDA Data Analysis Contest",
    org: "CJ CheilJedang, KSBDA",
    period: "2023.04 → 2023.06",
    stack: ["Excel", "Python", "Tableau"],
    description: "Proposed marketing promotions based on consumer order history from 11st/Naver for CJ",
    links: [{ label: "GitHub", url: "https://github.com/Jacob-9909/CJ_bda_proj" }],
  },
];

const SKILLS = [
  { category: "Languages", items: ["Python", "Java", "SQL"] },
  { category: "AI / ML", items: ["LangGraph", "RAG", "Fine-tuning", "Google ADK", "PyTorch", "MCP"] },
  { category: "Backend", items: ["FastAPI", "PostgreSQL"] },
  { category: "Cloud", items: ["GCP", "Vertex AI", "Cloud Run"] },
  { category: "DevOps", items: ["Docker", "Kubernetes"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { category: "Tools", items: ["Tableau", "Figma", "Git", "Claude Code"] },
];

const CERTIFICATIONS_KO = [
  "빅데이터 분석기사",
  "데이터분석 준전문가 (ADsP)",
  "SQL 개발자 (SQLD)",
  "컴퓨터활용능력 1급",
  "TOEIC 880",
];

const CERTIFICATIONS_EN = [
  "Big Data Analytics Professional",
  "Advanced Data Analytics Semi-Professional (ADsP)",
  "SQL Developer (SQLD)",
  "Computer Literacy Level 1",
];

const SIDE_PROJECTS_KO: SideProjectItem[] = [
  { title: "고객 대출등급 분류 ML Model", url: "https://dacon.io/competitions/official/236214/overview/description", note: "DACON 공식 경진 — 분류·검증 파이프라인 설계 후 제출" },
  { title: "소득 예측 ML Model", url: "https://dacon.io/competitions/official/236230/data", note: "DACON 공식 경진 — 회귀와 특성 엔지니어링 위주로 접근" },
  { title: "웹 로그 기반 조회수 예측 ML Model", url: "https://dacon.io/competitions/official/236226/overview/description", note: "DACON 공식 경진 — 로그·시계열 특성 가공이 핵심이었던 대회" },
  { title: "제주 특산물 가격 예측 ML Model", url: "https://dacon.io/competitions/official/236176/overview/description", note: "DACON 공식 경진 — 파생 변수 만들기로 점수를 끌어올린 케이스" },
  { title: "FSI AIxData Challenge 2024", url: "https://dacon.io/competitions/official/236297/overview/description", note: "금융 도메인 경진 — 데이터 생성부터 모델링까지 전 과정 참여" },
  { title: "Samsung AI Challenge: Black-box Optimization", url: "https://dacon.io/competitions/official/236323/overview/description", note: "블랙박스 최적화 트랙 — 탐색 전략과 제약 조건 실험" },
];

const SIDE_PROJECTS_EN: SideProjectItem[] = [
  { title: "Customer Loan Rating ML Model", url: "https://dacon.io/competitions/official/236214/overview/description", note: "DACON official — designed the classification & validation pipeline" },
  { title: "Income Prediction ML Model", url: "https://dacon.io/competitions/official/236230/data", note: "DACON official — regression with heavy feature engineering" },
  { title: "Web Log Based View Prediction ML Model", url: "https://dacon.io/competitions/official/236226/overview/description", note: "DACON official — log & time-series feature processing" },
  { title: "Jeju Specialty Product Price Prediction ML Model", url: "https://dacon.io/competitions/official/236176/overview/description", note: "DACON official — derived variables did the heavy lifting" },
  { title: "FSI AIxData Challenge 2024", url: "https://dacon.io/competitions/official/236297/overview/description", note: "Finance-domain challenge — from data generation to modeling" },
  { title: "Samsung AI Challenge: Black-box Optimization", url: "https://dacon.io/competitions/official/236323/overview/description", note: "Black-box optimization track — search strategy & constraint experiments" },
];

export const translations = {
  ko: {
    PROFILE: PROFILE_KO,
    CAREER: CAREER_KO,
    EDUCATION: EDUCATION_KO,
    PROJECTS: PROJECTS_KO,
    SKILLS,
    CERTIFICATIONS: CERTIFICATIONS_KO,
    SIDE_PROJECTS: SIDE_PROJECTS_KO,
    SECTIONS: {
      career: "career.log",
      workExperience: "work-experience",
      education: "education",
      projects: "projects/",
      skills: "tools.yaml",
      sideProjects: "experiments/",
      certifications: "certs",
      contact: "contact --open",
      home: "~",
    }
  },
  en: {
    PROFILE: PROFILE_EN,
    CAREER: CAREER_EN,
    EDUCATION: EDUCATION_EN,
    PROJECTS: PROJECTS_EN,
    SKILLS,
    CERTIFICATIONS: CERTIFICATIONS_EN,
    SIDE_PROJECTS: SIDE_PROJECTS_EN,
    SECTIONS: {
      career: "career.log",
      workExperience: "work-experience",
      education: "education",
      projects: "projects/",
      skills: "tools.yaml",
      sideProjects: "experiments/",
      certifications: "certs",
      contact: "contact --open",
      home: "~",
    }
  }
};
