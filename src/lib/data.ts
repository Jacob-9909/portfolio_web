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
  narrative: "회계의 정밀함에서 에이전트의 지능까지, 새로운 가치를 만들다.",
  email: "cj0336j@gmail.com",
  github: "https://github.com/Jacob-9909",
  blog: "https://jacob-log.vercel.app/",
  resume: "https://drive.google.com/file/d/1YDyQ9YTVvB4BLzqKwI_zdAzH56WAXGAo/view?usp=drive_link",
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
  narrative: "From the precision of accounting to the intelligence of agents, creating new value.",
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
    title: "선일다이파스 자연어 기반 SQL 생성 (Text-to-SQL)",
    org: "선일다이파스 , Didim",
    period: "2026.04 → 진행중",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG"],
    description: "선일다이파스 제조업 기반 자연어 기반 SQL 생성 에이전트 개발",
  },
  {
    title: "농협은행 BestBanker",
    org: "농협은행 , Didim",
    period: "2026.02 → 2026.04",
    stack: ["Python", "Google ADK", "PgVector", "RAG", "GCP"],
    description: "농협은행 영업점 직원 내규 문서 기반 실적 계산 에이전트 개발. GCP Vertex AI 기반 어시스턴트 개발",
  },
  {
    title: "농협은행 자연어 기반 SQL 생성 (Text-to-SQL)",
    org: "농협은행 마케팅허브 , Didim",
    period: "2025.09 → 2026.02",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG", "Fine-tuning"],
    description: "마케팅허브 데이터 기반 LLM 활용 SQL 생성 서비스 개발 및 금융 데이터 Fine-tuning을 통한 모델 성능 향상",
  },
  {
    title: "Agent Builder (내부 솔루션)",
    org: "Didim",
    period: "2025.06 → 2025.07",
    stack: ["Python", "TypeScript", "Google ADK", "MCP"],
    description: "MCP 프로토콜 기반 솔루션 파트 개발 (Notion, Tavily, Slack, RAG MCP tool) 및 DB 연결/Metric 관리",
  },
  {
    title: "범농협 생성형 AI 도입 및 구축",
    org: "범농협 (농협중앙회 , 삼일PWC , 삼정KPMG , Google)",
    period: "2025.04 → 2025.08",
    stack: ["Python", "GCP", "Google ADK", "LangGraph", "React", "MCP"],
    description: "범농협 AI 도입 — 영업점 질의사항 대응 어시스턴트 (GCP Vertex AI) 및 대화형 상품 큐레이션 챗봇"
  },
  {
    title: "Altair 솔루션 기반 시각화 및 모델링",
    org: "Altair",
    period: "2025.01 → 2025.04",
    stack: ["Python", "PostgreSQL", "Altair", "ML", "PyTorch"],
    description: "AI Studio & Panopticon 활용 주식/산불 예측 모델링 및 Artbox 데이터 기반 재고 관리 모델 개발",
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
    description: "GCP 기반 머신러닝/딥러닝 모델을 사용한 K리그 승률 및 순위 예측 모델 개발",
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
    title: "Seonil Dyphas Text-to-SQL",
    org: "Seonil Dyphas, Didim",
    period: "2026.04 → Present",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG"],
    description: "Developed natural language based SQL generation agent for manufacturing industry",
  },
  {
    title: "NH Bank BestBanker",
    org: "NH Bank, Didim",
    period: "2026.02 → 2026.04",
    stack: ["Python", "Google ADK", "PgVector", "RAG", "GCP"],
    description: "Developed performance calculation agent based on internal regulations. Developed GCP Vertex AI assistant",
  },
  {
    title: "NH Bank Text-to-SQL",
    org: "NH Bank Marketing Hub, Didim",
    period: "2025.09 → 2026.02",
    stack: ["Python", "LangGraph", "FastAPI", "PgVector", "RAG", "Fine-tuning"],
    description: "Developed LLM-based SQL generation service and improved model performance through fine-tuning",
  },
  {
    title: "Agent Builder (Internal Solution)",
    org: "Didim",
    period: "2025.06 → 2025.07",
    stack: ["Python", "TypeScript", "Google ADK", "MCP"],
    description: "Developed MCP protocol-based solution parts (Notion, Tavily, Slack, RAG MCP tool) and DB integration",
  },
  {
    title: "Pan-NH Generative AI Introduction",
    org: "Pan-NH (NH NACF, PwC, KPMG, Google)",
    period: "2025.04 → 2025.08",
    stack: ["Python", "GCP", "Google ADK", "LangGraph", "React", "MCP"],
    description: "Introduced AI to Pan-NH — GCP Vertex AI based query response assistant and product curation chatbot"
  },
  {
    title: "Altair Visualization & Modeling",
    org: "Altair",
    period: "2025.01 → 2025.04",
    stack: ["Python", "PostgreSQL", "Altair", "ML", "PyTorch"],
    description: "Stock/wildfire prediction modeling using AI Studio & Panopticon, and Artbox inventory management model",
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
    description: "Developed K-League match win rate and ranking prediction model using GCP-based ML/DL models",
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
    description: "Developed AI model and general process for predicting defects in Automotive Display Glass Line",
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
  { category: "Cloud", items: ["GCP"] },
  { category: "DevOps", items: ["Docker", "Kubernetes"] },
  { category: "Frontend", items: ["React", "HTML", "CSS"] },
  { category: "Tools", items: ["Tableau", "Figma", "Git", "Claude Code"] },
];

const CERTIFICATIONS_KO = [
  "빅데이터 분석기사",
  "데이터분석 준전문가 (ADsP)",
  "SQL 개발자 (SQLD)",
  "컴퓨터활용능력 1급",
  "TOEIC 880",
  "운전면허 1종 보통",
];

const CERTIFICATIONS_EN = [
  "Big Data Analytics Professional",
  "Advanced Data Analytics Semi-Professional (ADsP)",
  "SQL Developer (SQLD)",
  "Computer Literacy Level 1",
  "TOEIC 880",
  "Driver's License Type 1 Regular",
];

const SIDE_PROJECTS_KO: SideProjectItem[] = [
  { title: "고객 대출등급 분류 ML Model", url: "https://dacon.io/competitions/official/236214/overview/description", note: "DACON 공식 경진 , 분류,검증 파이프라인 설계 후 제출" },
  { title: "소득 예측 ML Model", url: "https://dacon.io/competitions/official/236230/data", note: "DACON 공식 경진 , 회귀,특성 엔지니어링 중심으로 제출" },
  { title: "웹 로그 기반 조회수 예측 ML Model", url: "https://dacon.io/competitions/official/236226/overview/description", note: "DACON 공식 경진 , 로그,시계열 특성 가공 및 모델 제출" },
  { title: "제주 특산물 가격 예측 ML Model", url: "https://dacon.io/competitions/official/236176/overview/description", note: "DACON 공식 경진 , 시계열,파생 변수 반영 후 제출" },
  { title: "FSI AIxData Challenge 2024", url: "https://dacon.io/competitions/official/236297/overview/description", note: "금융 도메인 경진 , 데이터 생성,모델링 제출" },
  { title: "Samsung AI Challenge: Black-box Optimization", url: "https://dacon.io/competitions/official/236323/overview/description", note: "블랙박스 최적화 트랙 , 탐색,제약 반영 실험 및 제출" },
];

const SIDE_PROJECTS_EN: SideProjectItem[] = [
  { title: "Customer Loan Rating ML Model", url: "https://dacon.io/competitions/official/236214/overview/description", note: "DACON Official Competition, designed classification/validation pipeline" },
  { title: "Income Prediction ML Model", url: "https://dacon.io/competitions/official/236230/data", note: "DACON Official Competition, focused on regression/feature engineering" },
  { title: "Web Log Based View Prediction ML Model", url: "https://dacon.io/competitions/official/236226/overview/description", note: "DACON Official Competition, processed log/time-series features" },
  { title: "Jeju Specialty Product Price Prediction ML Model", url: "https://dacon.io/competitions/official/236176/overview/description", note: "DACON Official Competition, reflected time-series/derived variables" },
  { title: "FSI AIxData Challenge 2024", url: "https://dacon.io/competitions/official/236297/overview/description", note: "Financial domain competition, generated data and submitted modeling" },
  { title: "Samsung AI Challenge: Black-box Optimization", url: "https://dacon.io/competitions/official/236323/overview/description", note: "Black-box optimization track, reflected search/constraints experiments" },
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
      career: "Career",
      workExperience: "Work Experience",
      education: "Education",
      projects: "Projects",
      skills: "Skills",
      sideProjects: "Side Projects",
      certifications: "Certifications",
      contact: "Contact",
      home: "Home",
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
      career: "Career",
      workExperience: "Work Experience",
      education: "Education",
      projects: "Projects",
      skills: "Skills",
      sideProjects: "Side Projects",
      certifications: "Certifications",
      contact: "Contact",
      home: "Home",
    }
  }
};
