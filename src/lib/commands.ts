import { translations } from "./data";

export interface CommandResult {
  output: string;
  isError?: boolean;
  /** 지정된 섹션으로 스크롤 */
  navigate?: string;
  /** 새 탭으로 열 URL */
  url?: string;
}

export interface CommandSpec {
  name: string;
  args?: string;
  desc: { ko: string; en: string };
  aliases?: string[];
}

export const COMMAND_SPECS: CommandSpec[] = [
  { name: "help", desc: { ko: "사용 가능한 명령어", en: "show this message" } },
  { name: "whoami", desc: { ko: "한 줄 소개", en: "one-line intro" } },
  { name: "cat", args: "jacob.yaml", desc: { ko: "모델카드 보기", en: "view model card" } },
  { name: "about", desc: { ko: "상세 프로필 & 스토리", en: "detailed profile" } },
  { name: "career", aliases: ["experience"], desc: { ko: "경력 타임라인", en: "work experience" } },
  { name: "projects", args: "[--featured]", desc: { ko: "프로젝트 전체 목록", en: "project index" } },
  { name: "skills", desc: { ko: "기술 스택", en: "tech stack" } },
  { name: "contact", args: "--open", desc: { ko: "연락처 & 링크", en: "email & links" } },
  { name: "open", args: "<target>", desc: { ko: "github | blog | resume 열기", en: "open github | blog | resume" } },
  { name: "cd", args: "<section>", desc: { ko: "섹션으로 이동", en: "jump to a section" } },
  { name: "ls", desc: { ko: "섹션 목록", en: "list sections" } },
  { name: "system", args: "--status", desc: { ko: "시스템 상태", en: "runtime status" } },
  { name: "clear", desc: { ko: "터미널 지우기", en: "clear terminal" } },
];

const OPEN_TARGETS = ["github", "blog", "resume", "email"];

export const SECTIONS = ["home", "career", "projects", "skills", "side-projects", "contact"];

/** TAB 완성용: 명령어별 인자 후보 */
export function argCandidates(cmdName: string): string[] {
  switch (cmdName) {
    case "cd":
      return SECTIONS.map((s) => `${s}/`);
    case "open":
      return OPEN_TARGETS;
    case "projects":
      return ["--featured"];
    case "contact":
      return ["--open"];
    case "system":
      return ["--status"];
    case "cat":
      return ["jacob.yaml"];
    default:
      return [];
  }
}

function resolve(name: string): CommandSpec | undefined {
  return COMMAND_SPECS.find(
    (s) => s.name === name || s.aliases?.includes(name)
  );
}

/** 가장 가까운 명령어 후보 추천 (오타 교정용) */
function suggest(cmd: string): string | undefined {
  let best: { name: string; score: number } | undefined;
  for (const spec of COMMAND_SPECS) {
    const names = [spec.name, ...(spec.aliases ?? [])];
    for (const n of names) {
      const score = similarity(cmd, n);
      if (!best || score > best.score) best = { name: n, score };
    }
  }
  return best && best.score >= 0.4 ? best.name : undefined;
}

function similarity(a: string, b: string): number {
  // 1 - normalized levenshtein distance
  const m = a.length;
  const n = b.length;
  if (!m || !n) return 0;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return 1 - dp[m][n] / Math.max(m, n);
}

export function processCommand(
  input: string,
  lang: "ko" | "en" = "ko"
): CommandResult {
  const t = translations[lang];
  const raw = input.trim();
  const cmd = raw.toLowerCase();

  /* ── help ─────────────────────────────────────────────── */
  if (cmd === "help") {
    const rows = COMMAND_SPECS.map((s) => {
      const usage = `${s.name} ${s.args ?? ""}`.trim().padEnd(18);
      return `  ${usage} ${s.desc[lang]}`;
    });
    return {
      output: [
        "available commands:",
        "",
        ...rows,
        "",
        `  * TAB 자동완성 · ↑↓ 커맨드 히스토리${lang === "en" ? " (tab to complete)" : ""}`,
      ].join("\n"),
    };
  }

  /* ── cat jacob.yaml (모델카드) ─────────────────────────── */
  if (cmd === "cat jacob.yaml" || cmd === "cat jacobian.yaml" || cmd === "cat model-card.yaml") {
    return {
      output: [
        "# model card — generated from real data, not vibes",
        "---",
        "name: Woohyuck Jeong",
        "alias: Jacob",
        "version: 3.0.0          # 회계 → AI 전환을 major로",
        "release_date: 2025-01",
        "status: running         # didim 재직 중",
        "base_model: 국민대 회계학과 + AI빅데이터융합경영",
        "fine_tuned_on:",
        "  - 농협은행 내규 문서 / 마케팅 데이터",
        "  - Text-to-SQL · Multi-Agent 파이프라인",
        "tools:",
        "  - langgraph           # 멀티 에이전트 오케스트레이션",
        "  - google-adk          # Vertex AI 에이전트",
        "  - mcp                 # 툴 프로토콜 설계",
        "  - fastapi/postgres    # 서빙 계층",
        "context_window: 넓은 편. 회의록·내규·스키마 동시 처리",
        "hallucination_rate: 낮음 — 결정론적 파이프라인 선호",
        "known_limitations:",
        "  - 디자인 감각은 이 사이트가 증거임",
        "  - 새벽 2시 이후 성능 저하 (커피 의존성 존재)",
        "intended_use: 금융/데이터 도메인의 에이전트 개발",
        "---",
      ].join("\n"),
    };
  }

  if (cmd.startsWith("cat")) {
    const file = cmd.split(/\s+/)[1] ?? "";
    return {
      output: `cat: ${file}: No such file\navailable: jacob.yaml`,
      isError: true,
    };
  }

  /* ── whoami ───────────────────────────────────────────── */
  if (cmd === "whoami") {
    return {
      output: [
        `${t.PROFILE.name} (${t.PROFILE.alias}) — ${t.PROFILE.role} @ ${t.PROFILE.company}`,
        lang === "ko"
          ? "회계학과 출신. 요즘은 금융 문서와 SQL을 읽는 AI 에이전트를 만듭니다."
          : "Ex-accounting student, now building agents that read documents and SQL.",
      ].join("\n"),
    };
  }

  /* ── about ────────────────────────────────────────────── */
  if (cmd === "about") {
    return {
      output:
        lang === "ko"
          ? [
              `${t.PROFILE.name} (${t.PROFILE.alias})`,
              `${t.PROFILE.role} @ ${t.PROFILE.company}`,
              "",
              "story:",
              "  국민대 회계학과에서 시작해 AI빅데이터융합경영까지.",
              "  결산 보고서를 읽던 손으로 지금은 농협은행의",
              "  내규 문서와 마케팅 DB 쿼리를 읽는 에이전트를 만듭니다.",
              "",
              "now:",
              "  · Text-to-SQL / Multi-Agent 파이프라인 설계",
              "  · 오픈소스 tablefold 유지보수",
              "",
              "links:",
              "  email   cj0336j@gmail.com",
              "  github  github.com/Jacob-9909",
              "  blog    jacob-log.vercel.app",
            ].join("\n")
          : [
              `${t.PROFILE.name} (${t.PROFILE.alias})`,
              `${t.PROFILE.role} @ ${t.PROFILE.company}`,
              "",
              "story:",
              "  Started at Kookmin University studying accounting,",
              "  then added AI & Big Data convergence on top.",
              "  The hands that read financial statements now build",
              "  agents that read NH Bank regulations and marketing SQL.",
              "",
              "now:",
              "  · Designing Text-to-SQL / multi-agent pipelines",
              "  · Maintaining the open-source project tablefold",
              "",
              "links:",
              "  email   cj0336j@gmail.com",
              "  github  github.com/Jacob-9909",
              "  blog    jacob-log.vercel.app",
            ].join("\n"),
    };
  }

  /* ── career ───────────────────────────────────────────── */
  if (cmd === "career" || cmd === "experience") {
    const lines = ["~/career", ""];
    for (const item of t.CAREER) {
      lines.push(`${item.period}  ${item.company}`);
      lines.push(`  ${item.role}${item.active ? "  [current]" : ""}`);
      for (const task of item.tasks.slice(0, 4)) {
        lines.push(`  · ${task}`);
      }
      lines.push("");
    }
    lines.push("-> 'cd career' 로 섹션 이동");
    return { output: lines.join("\n").trimEnd() };
  }

  /* ── projects ─────────────────────────────────────────── */
  if (cmd === "projects" || cmd === "projects --list") {
    const lines = [`~/projects  (${t.PROJECTS.length} entries)`, ""];
    t.PROJECTS.forEach((p, i) => {
      const marker = p.status === "running" ? "●" : "✓";
      lines.push(`${String(i + 1).padStart(2, "0")}  ${marker}  ${p.title}`);
      lines.push(`    ${p.org} · ${p.period}`);
      if (p.links?.length) {
        for (const link of p.links) {
          const short = link.url.replace(/^https?:\/\/(www\.)?/, "");
          lines.push(`    -> ${short}`);
        }
      }
    });
    lines.push("");
    lines.push("-> featured: 'projects --featured'");
    return { output: lines.join("\n") };
  }

  if (cmd === "projects --featured") {
    const p = t.PROJECTS[0];
    return {
      output: [
        "~/projects/tablefold",
        "".padEnd(50, "-"),
        `desc   ${p.description}`,
        `stack  ${p.stack.join(" / ")}`,
        `link   ${p.links?.[0]?.url ?? "-"}`,
      ].join("\n"),
    };
  }

  /* ── skills ───────────────────────────────────────────── */
  if (cmd === "skills") {
    const lines = ["~/skills"];
    for (const group of t.SKILLS) {
      lines.push(`  ${group.category.padEnd(10)} ${group.items.join(" / ")}`);
    }
    return { output: lines.join("\n") };
  }

  /* ── contact ──────────────────────────────────────────── */
  if (cmd === "contact" || cmd === "contact --open") {
    return {
      output: [
        `$ contact --open`,
        "",
        `  email    ${t.PROFILE.email}`,
        `  github   github.com/Jacob-9909`,
        `  blog     jacob-log.vercel.app`,
        `  resume   drive.google.com (PDF)`,
        "",
        lang === "ko"
          ? "  협업, 프로젝트, 혹은 가볍게 인사까지 — 답장은 빠릅니다."
          : "  Work, projects, or just saying hi — replies are fast.",
        "",
        lang === "ko"
          ? "  tip: 'open resume' 으로 바로 열기"
          : "  tip: run 'open resume' to open it directly",
      ].join("\n"),
    };
  }

  /* ── open <target> ────────────────────────────────────── */
  if (cmd.startsWith("open")) {
    const target = cmd.split(/\s+/)[1];
    const map: Record<string, { url: string; label: string }> = {
      github: { url: t.PROFILE.github, label: "GitHub" },
      blog: { url: t.PROFILE.blog, label: "Blog" },
      resume: { url: t.PROFILE.resume, label: "Resume" },
      email: { url: `mailto:${t.PROFILE.email}`, label: "Email" },
    };
    if (!target || !map[target]) {
      return {
        output: `usage: open <github|blog|resume|email>${
          target ? `\nunknown target: ${target}` : ""
        }`,
        isError: true,
      };
    }
    return {
      output: `opening ${map[target].label}...`,
      url: map[target].url,
    };
  }

  /* ── ls ───────────────────────────────────────────────── */
  if (cmd === "ls") {
    return { output: SECTIONS.map((s) => `${s}/`).join("   ") };
  }

  /* ── cd <section> ─────────────────────────────────────── */
  if (cmd.startsWith("cd")) {
    const target = cmd.split(/\s+/)[1];
    if (!target || target === "~") {
      return { output: "~", navigate: "home" };
    }
    const clean = target.replace(/\/$/, "");
    if (SECTIONS.includes(clean)) {
      return { output: `→ /${clean}`, navigate: clean };
    }
    return {
      output: `cd: no such section: ${target}\navailable: ${SECTIONS.join(", ")}`,
      isError: true,
    };
  }

  /* ── system --status ──────────────────────────────────── */
  if (cmd === "system --status" || cmd === "status" || cmd === "system") {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 8);
    return {
      output: [
        `[SYSTEM STATUS — ${date}]`,
        "-".repeat(44),
        "  runtime       next.js static export",
        "  deploy        github pages (actions)",
        "  region        seoul, kr",
        `  local time    ${time} KST`,
        "-".repeat(44),
        lang === "ko"
          ? "  이 사이트의 모든 상태 값은 실제 측정값입니다."
          : "  every status value here is real, not decoration.",
      ].join("\n"),
    };
  }

  /* ── sudo easter egg ──────────────────────────────────── */
  if (cmd.startsWith("sudo")) {
    return {
      output:
        lang === "ko"
          ? "jacob is not in the sudoers file.\n이 사실은 매니저에게 보고될 것입니다... 아마 웃으며 넘길 겁니다."
          : "jacob is not in the sudoers file.\nThis incident will be reported... he'd probably laugh it off.",
    };
  }

  /* ── hidden easter egg ────────────────────────────────── */
  if (cmd === "hidden") {
    return {
      output: [
        "",
        "  *** ACCESS GRANTED ***",
        "",
        "  So you found this. Congratulations.",
        "  I surrender to your persistence.",
        "",
        "  +----------------------------------+",
        "  |  EXPLORER BADGE  [ UNLOCKED ]    |",
        "  +----------------------------------+",
        "",
      ].join("\n"),
    };
  }

  /* ── clear ────────────────────────────────────────────── */
  if (cmd === "clear") {
    return { output: "" };
  }

  /* ── unknown → 오타 제안 ──────────────────────────────── */
  const hint = suggest(cmd.split(/\s+/)[0]);
  return {
    output: `command not found: ${raw}\n${hint ? `did you mean '${hint}'?` : ""}\ntype 'help' for available commands.`,
    isError: true,
  };
}
