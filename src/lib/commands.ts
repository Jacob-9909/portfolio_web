export interface CommandResult {
  output: string;
  isError?: boolean;
}

export function processCommand(input: string): CommandResult {
  const cmd = input.trim().toLowerCase();

  if (cmd === "help") {
    return {
      output: [
        "\u250c\u2500 Available Commands \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
        "\u2502                                          \u2502",
        "\u2502  help              Show this message      \u2502",
        "\u2502  about             Bio & contact info     \u2502",
        "\u2502  projects --list   Project directory      \u2502",
        "\u2502  system --status   Deployment status      \u2502",
        "\u2502  clear             Clear terminal         \u2502",
        "\u2502                                          \u2502",
        "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
      ].join("\n"),
    };
  }

  if (cmd === "about") {
    return {
      output: [
        "\u250c\u2500 ABOUT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510",
        "\u2502                                          \u2502",
        "\u2502  Woohyuck Jeong (Jacob)                  \u2502",
        "\u2502  AI Researcher @ Didim365                \u2502",
        "\u2502                                          \u2502",
        "\u2502  Specialization:                         \u2502",
        "\u2502    \u2192 Multi-Agent System Design            \u2502",
        "\u2502    \u2192 Fin-MARS (Financial T2SQL)           \u2502",
        "\u2502    \u2192 RAG Optimization & Retrieval         \u2502",
        "\u2502                                          \u2502",
        "\u2502  Education:                               \u2502",
        "\u2502    Kookmin Univ. \u2014 Accounting & AI        \u2502",
        "\u2502    Big Data Convergence                   \u2502",
        "\u2502                                          \u2502",
        "\u2502  Contact:                                 \u2502",
        "\u2502    \u2709  cj0336j@gmail.com                   \u2502",
        "\u2502                                          \u2502",
        "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518",
      ].join("\n"),
    };
  }

  if (cmd === "projects --list") {
    return {
      output: [
        "\ud83d\udcc1 ~/projects",
        "\u2502",
        "\u251c\u2500 fin-mars/",
        "\u2502  \u251c\u2500 desc:    GRPO-based Multi-Agent T2SQL Framework",
        "\u2502  \u251c\u2500 status:  active",
        "\u2502  \u251c\u2500 metric:  accuracy 86%",
        "\u2502  \u2514\u2500 deploy:  GitHub Actions \u2192 stable",
        "\u2502",
        "\u251c\u2500 nh-sales-poc/",
        "\u2502  \u251c\u2500 desc:    NH Sales Branch Assistant PoC",
        "\u2502  \u251c\u2500 stack:   GCP Vertex AI \u00b7 Cloud Run",
        "\u2502  \u251c\u2500 status:  stable",
        "\u2502  \u2514\u2500 deploy:  GitHub Actions \u2192 production",
        "\u2502",
        "\u2514\u2500 k-league-predict/",
        "   \u251c\u2500 desc:    K-League Match Prediction Model",
        "   \u251c\u2500 model:   XGBoost + LightGBM Ensemble",
        "   \u251c\u2500 status:  complete",
        "   \u2514\u2500 metric:  accuracy 0.86",
      ].join("\n"),
    };
  }

  if (cmd === "system --status") {
    const now = new Date();
    const ts = now.toISOString().slice(0, 19).replace("T", " ");
    const time = now.toTimeString().slice(0, 8);
    return {
      output: [
        `[SYSTEM STATUS \u2014 ${now.toISOString().split("T")[0]}]`,
        "\u2501".repeat(42),
        `  Deployment    \u2713 Success (GitHub Pages)`,
        `  CI Pipeline   \u2713 GitHub Actions`,
        `  Last Build    ${ts}`,
        `  Uptime        99.9%`,
        "\u2501".repeat(42),
        "",
        "  Recent Activity:",
        `  [${time}] Build started`,
        `  [${time}] Dependencies installed`,
        `  [${time}] TypeScript compiled`,
        `  [${time}] Static export generated`,
        `  [${time}] Deployed to production \u2713`,
      ].join("\n"),
    };
  }

  return {
    output: `Command not found: ${input}\nType 'help' for available commands.`,
    isError: true,
  };
}
