export const PROFILE = {
  name: "WOOHYUCK JEONG",
  alias: "Jacob",
  role: "AI Researcher",
  company: "Didim",
  narrative:
    "회계의 정밀함에서 에이전트의 지능까지, 새로운 가치를 만들다.",
  email: "cj0336j@gmail.com",
  github: "https://github.com/Jacob-9909",
  blog: "https://jacob-log.vercel.app/",
  resume:
    "https://drive.google.com/file/d/1h3EYq_e8S_4B-c6785679ikwz2ZJepdw/view?usp=sharing",
  coreStack: [
    "Python",
    "LangGraph",
    "Google ADK",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "GCP",
    "RAG",
    "Pytorch",
    "Fine-tuning",
  ],
};

export interface CareerItem {
  company: string;
  role: string;
  period: string;
  active: boolean;
  description: string;
  stack: string[];
  tasks: string[];
}

export const CAREER: CareerItem[] = [
  {
    company: "Didim",
    role: "AI Researcher (LLM, ML)",
    period: "2025.01 → now",
    active: true,
    description: "AI · Big Data · Cloud 매니지먼트 전문기업",
    stack: [
      "Python",
      "Java",
      "PostgreSQL",
      "FastAPI",
      "LangGraph",
      "RAG",
      "GCP",
      "Google ADK",
      "React",
      "Docker",
      "MCP",
    ],
    tasks: [
      "농협은행 BestBanker 실적 계산 멀티 에이전트 개발",
      "농협중앙회 & 삼일PWC & 삼정KPMG & Google: 범농협 AI 도입 및 생성형 AI 구축",
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
    stack: ["Python", "SQL", "Datagrip", "Jira", "Figma"],
    tasks: [
      "Contents Data 영상 수집 및 DB화",
      "교육 플랫폼 Curriculum 기획",
      "Log data & User flow 분석",
    ],
  },
];

export const EDUCATION = [
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

export interface ProjectItem {
  title: string;
  org: string;
  period: string;
  stack: string[];
  description: string;
  links?: { label: string; url: string }[];
}

export const PROJECTS: ProjectItem[] = [
  {
    title: "자연어 기반 SQL 생성 (Text-to-SQL)",
    org: "농협은행 마케팅허브 · 디딤365",
    period: "2025.07 → 2025.11",
    stack: ["Python", "LangGraph", "FastAPI", "Pgvector", "RAG", "Fine-tuning"],
    description:
      "마케팅허브 데이터 기반 LLM 활용 SQL 생성 서비스 개발 및 금융 데이터 Fine-tuning을 통한 모델 성능 향상",
  },
  {
    title: "Agent Builder (내부 솔루션)",
    org: "디딤365",
    period: "2025.06 → 2025.07",
    stack: ["Python", "TypeScript", "Google ADK", "MCP"],
    description:
      "MCP 프로토콜 기반 솔루션 파트 개발 (Notion, Tavily, Slack, RAG MCP tool) 및 DB 연결/Metric 관리",
  },
  {
    title: "범농협 생성형 AI 도입 및 구축",
    org: "농협중앙회 · 삼일PWC · 삼정KPMG · Google",
    period: "2025.04 → 2025.08",
    stack: ["Python", "GCP", "Google ADK", "LangGraph", "React", "MCP"],
    description:
      "범농협 AI 도입 — 영업점 질의사항 대응 어시스턴트 (GCP Vertex AI) 및 대화형 상품 큐레이션 챗봇"
  },
  {
    title: "Altair 솔루션 기반 시각화 및 모델링",
    org: "Altair",
    period: "2025.01 → 2025.04",
    stack: ["Python", "PostgreSQL", "Altair", "ML", "Pytorch"],
    description:
      "AI Studio & Panopticon 활용 주식/산불 예측 모델링 및 Artbox 데이터 기반 재고 관리 모델 개발",
  },
  {
    title: "제2회 국민대학교 AI빅데이터분석 경진대회",
    org: "국민대학교",
    period: "2024.10 → 2024.11",
    stack: ["Python"],
    description:
      "한국기계산업진흥회 후원 — 주요 5개 산업 품목 1개년 무역량 예측 알고리즘 개발",
  },
  {
    title: "K리그 승률예측 프로그램 개발",
    org: "한이음",
    period: "2024.04 → 2024.11",
    stack: ["Python", "Tableau", "GCP", "MySQL"],
    description:
      "GCP 기반 머신러닝/딥러닝 모델을 사용한 K리그 승률 및 순위 예측 모델 개발",
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
    description:
      "Automotive Display Glass Sub assembly Line 불량 예측 AI 모델 및 범용 프로세스 개발",
    links: [
      { label: "GitHub", url: "https://github.com/Jacob-9909/LG_aimers" },
    ],
  },
  {
    title: "미래에셋 AI Data Festival",
    org: "미래에셋증권 · Naver Cloud",
    period: "2024.07 → 2024.08",
    stack: ["Python", "Tableau"],
    description:
      "미래에셋증권 데이터 기반 HyperClova X 활용 금융 투자 교육 AI 서비스 개발",
  },
  {
    title: "K-Water 대국민 물 빅데이터 공모전",
    org: "K-Water",
    period: "2023.06 → 2023.08",
    stack: ["Excel", "Python", "Tableau"],
    description:
      "전국 단위 농업 용수 사용 최적화를 위한 데이터 구축 및 가뭄 예방 시스템 제안",
    links: [
      {
        label: "Link",
        url: "https://drive.google.com/file/d/10xv5OkwS867kudIYXibXxxYiwniu4B3N/view?usp=drive_link",
      },
    ],
  },
  {
    title: "BDA 데이터분석 활용 공모전",
    org: "CJ제일제당 · 한국빅데이터학회",
    period: "2023.04 → 2023.06",
    stack: ["Excel", "Python", "Tableau"],
    description:
      "CJ제일제당 11번가/네이버 소비자 주문 내역 기반 마케팅 프로모션 제안",
    links: [
      { label: "GitHub", url: "https://github.com/Jacob-9909/CJ_bda_proj" },
    ],
  },
];

export const SKILLS: { category: string; items: string[] }[] = [
  { category: "Languages", items: ["Python", "Java", "SQL"] },
  {
    category: "AI / ML",
    items: ["LangGraph", "RAG", "Fine-tuning", "Google ADK", "Pytorch", "MCP"],
  },
  { category: "Backend", items: ["FastAPI", "PostgreSQL"] },
  {
    category: "Cloud",
    items: ["GCP"],
  },
  { category: "DevOps", items: ["Docker", "Kubernetes"] },
  { category: "Frontend", items: ["React", "html", "css",] },
  { category: "Tools", items: ["Tableau", "Figma", "Datagrip", "Git", "Claude Code"] },
];

export const CERTIFICATIONS = [
  "빅데이터 분석기사",
  "데이터분석 준전문가 (ADsP)",
  "SQL 개발자 (SQLD)",
  "컴퓨터활용능력 1급",
  "TOEIC 880",
  "운전면허 1종 보통",
];

export interface SideProjectItem {
  title: string;
  url: string;
}

export const SIDE_PROJECTS: SideProjectItem[] = [
  {
    title: "고객 대출등급 분류 ML Model",
    url: "https://dacon.io/competitions/official/236214/overview/description",
  },
  {
    title: "소득 예측 ML Model",
    url: "https://dacon.io/competitions/official/236230/data",
  },
  {
    title: "웹 로그 기반 조회수 예측 ML Model",
    url: "https://dacon.io/competitions/official/236226/overview/description",
  },
  {
    title: "제주 특산물 가격 예측 ML Model",
    url: "https://dacon.io/competitions/official/236176/overview/description",
  },
  {
    title: "FSI AIxData Challenge 2024",
    url: "https://dacon.io/competitions/official/236297/overview/description",
  },
  {
    title: "Samsung AI Challenge: Black-box Optimization",
    url: "https://dacon.io/competitions/official/236323/overview/description",
  },
];
