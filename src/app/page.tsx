"use client";

import { FlowDiagram } from "@/components/FlowDiagram";
import { AppWindow, Clients } from "@/components/AppWindow";
import { Hero } from "@/components/Hero";
import { IconSprite } from "@/components/icons";
import { ProjectStage } from "@/components/ProjectStage";
import { SiteNav } from "@/components/SiteNav";
import { LINKS, translations, type T } from "@/lib/data";
import { FLOWS } from "@/lib/flows";
import { useLanguage } from "@/lib/LanguageContext";

type Lang = "ko" | "en";

/* 임시: 새 데이터 모양을 그대로 출력한다. 카드 모양은 Career, Skills 컴포넌트로 바뀐다 */
function Rows({ id, title, rows }: { id: string; title: string; rows: { k: string; v: string }[] }) {
  return (
    <section id={id} className="mx-auto max-w-[80rem] scroll-mt-14 px-6 py-10 lg:px-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <dl className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.k} className="sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-4">
            <dt className="tabular-nums text-t-muted">{row.k}</dt>
            <dd className="text-t-body">{row.v}</dd>
          </div>
        ))}
      </dl>
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
      <SiteNav t={t} lang={lang} setLang={setLang} />
      <main id="main">
        <Hero t={t} />
        <AppWindow t={t} lang={lang} />
        <Clients t={t} />
        <ProjectStage t={t} lang={lang} />
        <PrintProjects t={t} lang={lang} />
        <Rows id="career" title={t.nav.career} rows={t.career.map((c) => ({ k: c.period, v: `${c.org}, ${c.role}` }))} />
        <Rows id="skills" title={t.nav.skills} rows={t.skills.map((g) => ({ k: g.title, v: g.items.map((i) => i.name).join(", ") }))} />
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
