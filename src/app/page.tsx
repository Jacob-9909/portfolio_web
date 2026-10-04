"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import profile from "@/assets/profile.jpg";
import { useLanguage } from "@/lib/LanguageContext";
import {
  LINKS,
  TIMELINE,
  TIMELINE_NOW,
  translations,
  type CodeSample,
  type Item,
  type LinkItem,
  type Row,
} from "@/lib/data";
import { DIAGRAMS } from "@/lib/diagrams";

type T = (typeof translations)["ko"];

const PROJECT_IDS = translations.ko.projects.map((_, i) => `p${i}`);
/** 화면에 놓인 순서. 사이드바가 지나온 구간과 남은 구간을 이 순서로 가린다 */
const SECTION_IDS = ["intro", "principles", "career", "projects", ...PROJECT_IDS, "more", "skills"];

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function InlineLinks({ links }: { links?: LinkItem[] }) {
  if (!links?.length) return null;
  return (
    <>
      {links.map((link) => (
        <span key={link.url}>
          {" "}
          <Ext href={link.url}>{link.label}</Ext>
        </span>
      ))}
    </>
  );
}

function Rows({ rows }: { rows: Row[] }) {
  return (
    <dl className="space-y-1.5">
      {rows.map((row) => (
        <div key={row.period} className="sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-4">
          <dt className="tabular-nums text-t-muted">{row.period}</dt>
          <dd>{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function Items({ items }: { items: Item[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item.title}>
          <span className="font-semibold">{item.title}</span>{" "}
          <span className="text-t-muted">({item.period})</span>
          {item.note && <> {item.note}</>}
          <InlineLinks links={item.links} />
        </li>
      ))}
    </ul>
  );
}

/** 제목에 마우스를 올리면 나오는 # 링크. 특정 섹션 주소를 복사해 보낼 때 쓴다 */
function HashLink({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`#${id}`}
      className="ml-2 font-normal text-t-muted no-underline opacity-0 focus:opacity-100 group-hover:opacity-100 print:hidden"
    >
      #
    </a>
  );
}

const ICON_PATHS = {
  sun: "M12 3v2m0 14v2m9-9h-2M5 12H3m15.4-6.4L17 7M7 17l-1.4 1.4m12.8 0L17 17M7 7 5.6 5.6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  moon: "M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  up: "M12 19V5m-6 6 6-6 6 6",
};

function Icon({ name, className }: { name: keyof typeof ICON_PATHS; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

const ICON_BUTTON =
  "flex h-8 w-8 items-center justify-center rounded-md border border-t-border text-t-muted hover:bg-t-code hover:text-t-text";

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.theme = dark ? "dark" : "light";
  } catch {
    /* private mode 등 — 무시 */
  }
}

/** 언어와 밝기 전환. 데스크톱은 사이드바, 모바일은 상단 바에 놓인다 */
function Controls({ t }: { t: T }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <div
        role="group"
        aria-label={t.labels.language}
        className="flex h-8 overflow-hidden rounded-md border border-t-border text-xs"
      >
        {(["ko", "en"] as const).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`px-2.5 ${
              lang === code
                ? "bg-t-text font-semibold text-t-bg"
                : "text-t-muted hover:bg-t-code hover:text-t-text"
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <button onClick={toggleTheme} aria-label={t.labels.theme} className={ICON_BUTTON}>
        <Icon name="moon" className="dark:hidden" />
        <Icon name="sun" className="hidden dark:block" />
      </button>
    </div>
  );
}

/** 글은 읽기 편한 폭으로 묶고, 그림은 본문 칸 전체를 쓴다 */
const PROSE = "max-w-[46rem]";

/** 구분선과 제목이 붙은 본문 섹션 */
function Section({
  id,
  title,
  wide,
  children,
}: {
  id: string;
  title: string;
  /** 그림이 들어가는 섹션은 본문 폭 제한을 풀어 준다 */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-16 lg:scroll-mt-8 border-t border-t-border pt-8">
      <h2 className="group mb-5 text-xl font-bold">
        {title}
        <HashLink id={id} />
      </h2>
      <div className={wide ? undefined : PROSE}>{children}</div>
    </section>
  );
}

/** 지금 화면 위쪽에 걸려 있는 섹션 id */
function useActiveSection() {
  const [active, setActive] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

/** 목차. 에이전트 실행 기록처럼 지나온 노드는 채우고, 현재 노드는 강조하고, 남은 노드는 비워 둔다 */
function Toc({
  t,
  active,
  className,
  onNavigate,
}: {
  t: T;
  active: string;
  className?: string;
  /** 모바일 메뉴는 항목을 누르면 닫는다 */
  onNavigate?: () => void;
}) {
  const activeIndex = SECTION_IDS.indexOf(active);
  const items = [
    { id: "intro", label: t.headings.intro },
    { id: "principles", label: t.headings.principles },
    { id: "career", label: t.headings.career },
    {
      id: "projects",
      label: t.headings.projects,
      children: t.projects.map((p, i) => ({ id: PROJECT_IDS[i], label: p.title })),
    },
    { id: "more", label: t.headings.more },
    { id: "skills", label: t.headings.skills },
  ];

  const cap = "pl-5 font-mono text-[10px] tracking-wider text-t-muted";

  return (
    <nav aria-label={t.labels.toc} className={className}>
      <div className="ml-1 border-l border-t-border">
        <p className={`${cap} pb-1`}>START</p>
        <ol>
          {items.map((item) => {
            const index = SECTION_IDS.indexOf(item.id);
            const isActive =
              item.id === active ||
              (item.id === "projects" && PROJECT_IDS.includes(active));
            const passed = !isActive && index < activeIndex;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={onNavigate}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative flex items-center py-1.5 pl-5 text-sm no-underline hover:text-t-text ${
                    isActive ? "font-semibold text-t-text" : "text-t-muted"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute -left-[5px] h-[9px] w-[9px] rounded-full border ${
                      isActive
                        ? "accent-fill"
                        : passed
                          ? "border-t-muted bg-t-muted"
                          : "border-t-muted bg-t-bg"
                    }`}
                  />
                  {item.label}
                </a>
                {item.children && (
                  <ol className="pb-1">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          onClick={onNavigate}
                          className={`relative block py-1 pl-9 text-[13px] leading-snug no-underline hover:text-t-text ${
                            child.id === active
                              ? "accent-text font-semibold"
                              : "text-t-muted"
                          }`}
                        >
                          <span
                            aria-hidden
                            className="absolute left-0 top-[0.95em] w-5 border-t border-t-border"
                          />
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
        <p className={`${cap} pt-1`}>END</p>
      </div>
    </nav>
  );
}

const AXIS_MONTHS = 24; // 2025.01 ~ 2026.12
const monthIndex = (ym: string) => {
  const [y, m] = ym.split(".").map(Number);
  return (y - 2025) * 12 + (m - 1);
};

/** 프로젝트 기간을 트레이스 워터폴처럼 한눈에 — 분기 눈금 위에 막대, 옆에 기간과 개월 수 */
function Timeline({ t, lang }: { t: T; lang: "ko" | "en" }) {
  const cols = "grid grid-cols-[8.5rem_1fr] gap-x-3 sm:grid-cols-[13.5rem_1fr]";
  const quarters = [0, 1, 2, 3, 4, 5, 6, 7];
  const monthLabel = (q: number) =>
    lang === "ko" ? `${(q % 4) * 3 + 1}월` : ["Jan", "Apr", "Jul", "Oct"][q % 4];

  /** 분기마다 세로 눈금, 연초는 진하게 */
  const grid = quarters.map((q) => (
    <span
      key={q}
      aria-hidden
      className={`absolute inset-y-0 border-l ${
        q % 4 === 0 ? "border-t-muted/60" : "border-t-border"
      }`}
      style={{ left: `${q * 12.5}%` }}
    />
  ));

  return (
    <figure className="mb-10">
      <figcaption className="mb-3 font-semibold">{t.labels.timeline}</figcaption>

      <div className={`${cols} border-b border-t-border pb-1.5 text-xs`}>
        <span />
        <div className="relative h-9">
          {quarters.map((q) => (
            <span
              key={q}
              className="absolute bottom-0 pl-1.5 text-t-muted"
              style={{ left: `${q * 12.5}%` }}
            >
              {q % 4 === 0 && (
                <span className="block text-sm font-semibold text-t-text">
                  {2025 + q / 4}
                </span>
              )}
              <span className="hidden sm:inline">{monthLabel(q)}</span>
            </span>
          ))}
        </div>
      </div>

      <ol>
        {TIMELINE.map((span) => {
          const start = monthIndex(span.start);
          const end = monthIndex(span.end ?? TIMELINE_NOW);
          const left = (start / AXIS_MONTHS) * 100;
          const right = ((end + 1) / AXIS_MONTHS) * 100;
          const period = `${span.start} ~ ${span.end ?? t.labels.ongoing}`;
          const duration = span.end ? `${end - start + 1}${t.labels.months}` : "";
          // 막대 오른쪽에 글자를 둘 자리가 모자라면 왼쪽에 둔다
          const labelOnLeft = right > 62;

          return (
            <li
              key={span.ko}
              className={`${cols} items-stretch border-b border-t-border text-sm`}
            >
              <a
                href={span.href}
                title={span[lang]}
                className="truncate py-2 font-medium text-t-text no-underline hover:underline"
              >
                {span[lang]}
              </a>
              <div className="relative">
                {grid}
                <span
                  aria-hidden
                  className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-sm ${
                    span.personal ? "accent-outline" : "accent-fill"
                  }`}
                  style={{ left: `${left}%`, width: `${right - left}%` }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-t-bg px-1 text-xs tabular-nums text-t-muted"
                  style={
                    labelOnLeft
                      ? { right: `calc(${100 - left}% + 4px)` }
                      : { left: `calc(${right}% + 4px)` }
                  }
                >
                  <span className={duration ? "hidden sm:inline" : undefined}>
                    {period}
                    {duration && ", "}
                  </span>
                  {duration}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 flex gap-5 text-sm text-t-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="accent-fill h-3 w-5 rounded-sm" />
          {t.labels.work}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="accent-outline h-3 w-5 rounded-sm" />
          {t.labels.personal}
        </span>
      </p>
    </figure>
  );
}

/** 접어 둔 실제 산출물 — 실행 결과나 코드 */
function CodeDetails({ sample }: { sample: CodeSample }) {
  return (
    <details className={`${PROSE} mt-3`}>
      <summary className="cursor-pointer text-sm text-t-muted hover:text-t-text">
        {sample.label}
      </summary>
      <pre className="mt-2 overflow-x-auto border border-t-border bg-t-code px-4 py-3 font-mono text-[12.5px] leading-[1.65]">
        {sample.code.split("\n").map((line, i) => {
          const trimmed = line.trimStart();
          const isComment = trimmed.startsWith("#") || trimmed.startsWith("--");
          return (
            <span key={i} className={isComment ? "text-t-muted" : undefined}>
              {line}
              {"\n"}
            </span>
          );
        })}
      </pre>
      <p className="mt-2 text-sm text-t-muted">
        {sample.caption}
        {sample.source && (
          <>
            {" "}
            <Ext href={sample.source.url}>{sample.source.label}</Ext>
          </>
        )}
      </p>
    </details>
  );
}

function BioKo() {
  return (
    <>
      <p>
        디딤에서 AI Engineer로 일하고 있습니다. 금융과 제조 고객사의 현업
        담당자가 개발자에게 요청하지 않고 직접 데이터를 조회하고 규정을
        찾아보도록 Text-to-SQL과 RAG 에이전트를 만듭니다.
      </p>
      <p>
        농협은행 마케팅허브와 선일다이파스에 구축한 Text-to-SQL은 지금 현업
        140명이 월 800회 씁니다.
      </p>
      <p>
        대학에서는 회계학을 전공했습니다. AI빅데이터융합경영을 복수전공하면서
        수십만 줄의 주가 데이터를 pandas로 정리한 수업을 듣고 진로를
        바꿨습니다. 맡은 프로젝트의 데이터가 대부분 ERP여서, 매출을 언제
        인식하고 어떤 항목이 집계에서 빠지는지 같은 현업의 기준을 되묻지 않고
        따라갈 수 있었습니다.
      </p>
      <p>
        회사 밖에서는 스키마를 접어 LLM 컨텍스트를 줄이는 오픈소스{" "}
        <Ext href={LINKS.tablefold}>tablefold</Ext>를 만들고 있고, 한국어 금융
        Text-to-SQL용 소형 모델 연구를 제1저자로 NeurIPS 2026에 제출했습니다.
        글은 <Ext href={LINKS.blog}>블로그</Ext>에 씁니다. 고등학생 때 시작한
        달리기를 지금도 꾸준히 합니다.
      </p>
    </>
  );
}

function BioEn() {
  return (
    <>
      <p>
        I work as an AI Engineer at Didim. I build Text-to-SQL and RAG agents so
        that people in finance and manufacturing can query data and look up
        regulations themselves, without filing a request to a developer.
      </p>
      <p>
        The Text-to-SQL systems I built for NH Bank Marketing Hub and Seonil
        Dyphas are now used by 140 people, 800 times a month.
      </p>
      <p>
        I majored in accounting. A class in my second major, where I cleaned up
        hundreds of thousands of rows of stock prices with pandas, is what made
        me change direction. Most of the data in my projects has been ERP data,
        so I could follow how business users define things like when revenue is
        recognized and which items are left out of a total, without asking them
        to explain.
      </p>
      <p>
        Outside work I build <Ext href={LINKS.tablefold}>tablefold</Ext>, an
        open-source tool that folds a database schema to shrink LLM context, and
        I submitted a first-author paper on a small model for Korean financial
        Text-to-SQL to NeurIPS 2026. I write on my{" "}
        <Ext href={LINKS.blog}>blog</Ext>. I started running in high school and
        still run regularly.
      </p>
    </>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  const contactLinks = (
    <>
      <a href={`mailto:${LINKS.email}`}>{t.labels.email}</a>
      <Ext href={LINKS.github}>GitHub</Ext>
      <Ext href={LINKS.blog}>{t.labels.blog}</Ext>
      <Ext href={LINKS.portfolio}>{t.labels.portfolio}</Ext>
    </>
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-30 focus:rounded-md focus:bg-t-bg focus:px-3 focus:py-2"
      >
        {t.labels.skip}
      </a>

      {/* 모바일 상단 바 — 데스크톱은 사이드바가 같은 역할을 한다 */}
      <header className="sticky top-0 z-20 border-b border-t-border bg-t-bg/90 backdrop-blur lg:hidden print:hidden">
        <div className="flex h-12 items-center justify-between px-5">
          <a href="#top" className="font-bold text-t-text no-underline">
            {t.name}
          </a>
          <div className="flex items-center gap-2">
            <Controls t={t} />
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t.labels.toc}
              className={ICON_BUTTON}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div id="mobile-menu" className="max-h-[70vh] overflow-y-auto border-t border-t-border bg-t-bg px-5 py-3">
            <Toc t={t} active={active} onNavigate={() => setMenuOpen(false)} />
          </div>
        )}
      </header>

      <div
        id="top"
        className="mx-auto max-w-[80rem] px-5 py-8 text-[16px] leading-[1.75] lg:grid lg:grid-cols-[15rem_minmax(0,56rem)] lg:gap-x-16 lg:py-16 print:block print:py-0"
      >
        <aside className="lg:sticky lg:top-12 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
          <div className="flex items-center gap-5 lg:block">
            <Image
              src={profile}
              alt={t.name}
              width={84}
              height={112}
              priority
              className="rounded"
            />
            <div className="lg:mt-4">
              <h1 className="text-2xl font-bold leading-tight">
                {t.name}{" "}
                <span className="text-lg font-normal text-t-muted">Jacob</span>
              </h1>
              <p className="mt-1 text-[15px] leading-snug text-t-muted">
                {t.role}, {t.location}
              </p>
              <p className="mt-2 flex flex-wrap gap-x-3.5 text-[15px]">{contactLinks}</p>
            </div>
          </div>

          <Toc t={t} active={active} className="mt-8 hidden lg:block print:hidden" />

          <div className="mt-6 hidden lg:block print:hidden">
            <Controls t={t} />
          </div>
        </aside>

        <main id="main" className="mt-10 lg:mt-0">
        <section id="intro" className={`${PROSE} scroll-mt-16 lg:scroll-mt-8 space-y-4`}>
          {lang === "ko" ? <BioKo /> : <BioEn />}
        </section>

        <Section id="principles" title={t.headings.principles}>
          <ul className="list-disc space-y-2 pl-5">
            {t.principles.map((item) => (
              <li key={item.lead}>
                <span className="font-semibold">{item.lead}</span> {item.detail}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="career" title={t.headings.career}>
          <Rows rows={t.career} />
        </Section>

        <Section id="projects" title={t.headings.projects} wide>
          <Timeline t={t} lang={lang} />
          <div className="divide-y divide-t-border border-t border-t-border">
            {t.projects.map((project, i) => (
              <article key={project.title} id={PROJECT_IDS[i]} className="scroll-mt-16 lg:scroll-mt-8 py-8">
                <h3 className="group text-lg font-semibold">
                  {project.title}{" "}
                  <span className="text-base font-normal text-t-muted">
                    ({project.meta})
                  </span>
                  <HashLink id={PROJECT_IDS[i]} />
                </h3>
                <p className={`${PROSE} mt-1.5`}>{project.summary}</p>
                {/* archify로 만든 정적 SVG. 내용은 diagrams/*.json 에서만 나온다 */}
                <div
                  className="diagram mt-4"
                  dangerouslySetInnerHTML={{ __html: DIAGRAMS[project.diagram] }}
                />
                <ul className={`${PROSE} mt-4 list-disc space-y-1 pl-5`}>
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {project.code && <CodeDetails sample={project.code} />}
                <p className="mt-3 text-sm text-t-muted">
                  {project.stack}
                  <InlineLinks links={project.links} />
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="more" title={t.headings.more}>
          <Items items={t.more} />
          <details className="mt-6">
            <summary className="cursor-pointer font-semibold">
              {t.headings.student} ({t.student.length + t.dacon.length})
            </summary>
            <div className="mt-3">
              <Items items={t.student} />
              <p className="mt-2 pl-5">
                {t.labels.dacon}:
                {t.dacon.map((link, i) => (
                  <span key={link.url}>
                    {i > 0 && ","} <Ext href={link.url}>{link.label}</Ext>
                  </span>
                ))}
              </p>
            </div>
          </details>
        </Section>

        <Section id="skills" title={t.headings.skills}>
          <Rows rows={t.skills} />
        </Section>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-t-border pt-5 text-sm text-t-muted">
          <span>
            &copy; {new Date().getFullYear()} {t.name}
          </span>
          <span className="flex flex-wrap gap-x-4">{contactLinks}</span>
        </footer>
        </main>
      </div>

      {/* 첫 화면을 벗어나면 나타나는 맨 위로 버튼 */}
      <a
        href="#top"
        aria-label={t.labels.top}
        tabIndex={active === "intro" ? -1 : 0}
        className={`fixed bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-t-border bg-t-bg text-t-muted no-underline shadow-sm transition-opacity duration-200 hover:text-t-text print:hidden ${
          active === "intro" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Icon name="up" />
      </a>
    </>
  );
}
