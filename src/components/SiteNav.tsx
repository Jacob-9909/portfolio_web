"use client";

/* 화면 맨 위에 고정된 내비. 오른쪽 끝의 흰 알약은 메일 쓰기로 바로 간다. */

import { LINKS, type T } from "@/lib/data";

type Lang = "ko" | "en";

export function SiteNav({ t, lang, setLang }: { t: T; lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-t-line/70 bg-t-bg/85 backdrop-blur-md print:hidden">
      <nav className="mx-auto flex h-14 max-w-[80rem] items-center justify-between px-6 text-sm text-t-muted lg:px-10">
        <a href="#main" className="text-[15px] font-semibold text-t-text no-underline">
          {t.name}
        </a>
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
          <a
            href={`mailto:${LINKS.email}`}
            className="hidden rounded-full bg-t-text px-3.5 py-1.5 text-[13px] font-medium text-t-bg no-underline hover:bg-white hover:text-t-bg sm:inline"
          >
            {t.nav.contact}
          </a>
        </div>
      </nav>
    </header>
  );
}
