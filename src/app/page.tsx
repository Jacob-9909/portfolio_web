"use client";

import { FlowDiagram } from "@/components/FlowDiagram";
import { Hero } from "@/components/Hero";
import { IconSprite } from "@/components/icons";
import { ProjectStage } from "@/components/ProjectStage";
import { LINKS, translations, type Row, type T } from "@/lib/data";
import { FLOWS } from "@/lib/flows";
import { useLanguage } from "@/lib/LanguageContext";

type Lang = "ko" | "en";

function Rows({ id, title, rows }: { id: string; title: string; rows: Row[] }) {
  return (
    <section id={id} className="mx-auto max-w-[80rem] scroll-mt-14 px-6 py-10 lg:px-10">
      <div className="max-w-[46rem]">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <dl className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.period} className="sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-4">
              <dt className="tabular-nums text-t-muted">{row.period}</dt>
              <dd className="text-t-body">{row.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** 인쇄와 PDF 저장용: 무대 대신 네 프로젝트의 모든 단계를 펼쳐 둔다 */
function PrintProjects({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section className="hidden px-6 print:block">
      <h2 className="break-after-avoid text-2xl font-semibold tracking-tight">{t.nav.projects}</h2>
      {t.projects.map((p) => {
        const flow = FLOWS[p.id];
        return (
          <article key={p.id} className="mt-8 break-inside-avoid">
            <p className="text-sm text-t-muted">{p.meta}</p>
            <h3 className="mt-1 text-lg font-semibold">
              {p.title} <span className="font-normal text-t-muted">· {p.number}</span>
            </h3>
            <p className="mt-1">{p.headline}</p>
            <p className="text-sm text-t-muted">{p.stack}</p>
            <div className="mt-4 max-w-[36rem]">
              <FlowDiagram flow={flow} step={flow.steps.length - 1} lang={lang} title={p.title} />
            </div>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm">
              {flow.steps.map((s, i) => (
                <li key={i}>{s[lang]}</li>
              ))}
            </ol>
          </article>
        );
      })}
    </section>
  );
}

export default function Home() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const contacts = (
    <>
      <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
      <a href={LINKS.github} target="_blank" rel="noopener noreferrer">{t.nav.github}</a>
      <a href={LINKS.blog} target="_blank" rel="noopener noreferrer">{t.nav.blog}</a>
      <a href={LINKS.portfolio} target="_blank" rel="noopener noreferrer">{t.nav.portfolio}</a>
    </>
  );

  return (
    <>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-40 focus:rounded-md focus:bg-t-raise focus:px-3 focus:py-2"
      >
        {t.labels.skip}
      </a>
      <IconSprite />
      <header className="sticky top-0 z-20 border-b border-t-line/60 bg-t-bg/85 backdrop-blur-md print:hidden">
        <nav className="mx-auto flex h-14 max-w-[80rem] items-center justify-between px-6 text-sm text-t-muted lg:px-10">
          <a href="#main" className="font-semibold text-t-text no-underline">{t.name}</a>
          <div className="flex items-center gap-5">
            <a href="#projects" className="hidden no-underline hover:text-t-text sm:inline">{t.nav.projects}</a>
            <a href="#career" className="hidden no-underline hover:text-t-text sm:inline">{t.nav.career}</a>
            <a href="#skills" className="hidden no-underline hover:text-t-text sm:inline">{t.nav.skills}</a>
            <a href={LINKS.blog} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-t-text">
              {t.nav.blog}
            </a>
            <div role="group" aria-label={t.nav.language} className="flex gap-1">
              {(["ko", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`px-1 py-2 ${lang === code ? "text-t-text" : "hover:text-t-text"}`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>
      <main id="main">
        <Hero t={t} />
        <ProjectStage t={t} lang={lang} />
        <PrintProjects t={t} lang={lang} />
        <Rows id="career" title={t.nav.career} rows={t.career} />
        <Rows id="skills" title={t.nav.skills} rows={t.skills} />
      </main>
      <footer className="mx-auto mt-8 flex max-w-[80rem] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-t-line px-6 py-8 text-sm text-t-muted lg:px-10">
        <span>
          {t.name} · {t.role}
        </span>
        <span className="flex flex-wrap gap-x-5 gap-y-2">{contacts}</span>
      </footer>
    </>
  );
}
