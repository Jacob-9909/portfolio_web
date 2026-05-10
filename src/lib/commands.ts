export interface CommandResult {
  output: string;
  isError?: boolean;
}

export function processCommand(input: string): CommandResult {
  const cmd = input.trim().toLowerCase();

  if (cmd === "help") {
    return {
      output: [
        "+------------------------------------------+",
        "|  Available Commands                      |",
        "+------------------------------------------+",
        "|  help              Show this message     |",
        "|  about             Bio & contact info    |",
        "|  projects --list   Project directory     |",
        "|  system --status   Deployment status     |",
        "|  clear             Clear terminal        |",
        "|  hidden            ???                   |",
        "+------------------------------------------+",
      ].join("\n"),
    };
  }

  if (cmd === "about") {
    return {
      output: [
        "+------------------------------------------+",
        "|  Woohyuck Jeong (Jacob)                  |",
        "|  ML Engineer @ Didim                   |",
        "+------------------------------------------+",
        "|  Specialization:                         |",
        "|    -> Multi-Agent System Development     |",
        "|    -> Meta Database Design               |",
        "|    -> RAG Optimization & Retrieval       |",
        "|                                          |",
        "|  Education:                              |",
        "|    Kookmin Univ. - Accounting & AI       |",
        "|    Big Data Convergence                  |",
        "|                                          |",
        "|  Contact:                                |",
        "|    [e] cj0336j@gmail.com                 |",
        "+------------------------------------------+",
      ].join("\n"),
    };
  }

  if (cmd === "projects --list") {
    return {
      output: [
        "~/projects",
        "|",

        "+- nh-bestbanker/",
        "|  +- desc:    농협은행 영업적 지원 내규 기반 실적 계산 에이전트 개발",
        "|  +- stack:   Python / Google ADK / PgVector / RAG / GCP",
        "|  +- org:     농협은행 x Didim",
        "|  `- status:  complete",
        "|",
        "+- nh-t2sql/",
        "|  +- desc:    농협은행 Marketing Hub Text-to-SQL",
        "|  +- stack:   LangGraph / RAG / Fine-tuning",
        "|  +- org:     농협은행 x Didim",
        "|  `- status:  complete",
        "|",
        "+- nh-genai/",
        "|  +- desc:    범농협 생성형 AI 도입 및 구축",
        "|  +- stack:   GCP Vertex AI / Google ADK",
        "|  +- org:     범농협 (농협중앙회 x PWC x KPMG x Google)",
        "|  `- status:  complete",
        "|",
        "+- agent-builder/",
        "|  +- desc:    Internal Agent Builder Solution",
        "|  +- stack:   Google ADK / MCP / Prometheus / Redis",
        "|  +- org:     Didim",
        "|  `- status:  complete",
        "|",
        "`- k-league-predict/",
        "   +- desc:    K-League Match Prediction Model",
        "   +- stack:   XGBoost / LightGBM / GCP",
        "   +- org:     한이음",
        "   `- status:  complete",
      ].join("\n"),
    };
  }

  if (cmd === "hidden") {
    return {
      output: [
        "",
        "  *** ACCESS GRANTED ***",
        "",
        "  So you found this.",
        "  Congratulations.",
        "",
        "  I surrender to",
        "  your persistence.",
        "",
        "  +----------------------------------+",
        "  |  EXPLORER BADGE  [ UNLOCKED ]    |",
        "  +----------------------------------+",
        "",
      ].join("\n"),
    };
  }

  if (cmd === "system --status") {
    const now = new Date();
    const ts = now.toISOString().slice(0, 19).replace("T", " ");
    const time = now.toTimeString().slice(0, 8);
    return {
      output: [
        `[SYSTEM STATUS - ${now.toISOString().split("T")[0]}]`,
        "-".repeat(42),
        `  Deployment    [OK] GitHub Pages`,
        `  CI Pipeline   [OK] GitHub Actions`,
        `  Last Build    ${ts}`,
        "-".repeat(42),
        "",
        "  Recent Activity:",
        `  [${time}] Build started`,
        `  [${time}] Dependencies installed`,
        `  [${time}] TypeScript compiled`,
        `  [${time}] Static export generated`,
        `  [${time}] Deployed to production [OK]`,
      ].join("\n"),
    };
  }

  return {
    output: `Command not found: ${input}\nType 'help' for available commands.`,
    isError: true,
  };
}
