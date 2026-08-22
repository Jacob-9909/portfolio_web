"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";

export default function ContactSection() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { PROFILE } = t;

  return (
    <section id="contact" className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-4xl">
        <div className="section-divider mb-10">{t.SECTIONS.contact}</div>

        <Reveal>
          <div className="card-surface grid grid-cols-1 md:grid-cols-[1.4fr_1fr] divide-y md:divide-y-0 md:divide-x divide-t-border/60">
            {/* 좌: 이메일 CTA */}
            <div className="p-6 md:p-8">
              <p className="font-mono text-xs text-t-muted">
                <span className="text-t-green">$</span> contact --open
              </p>

              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-block mt-4 text-lg md:text-xl font-semibold text-t-text hover:text-t-amber transition-colors break-all"
              >
                {PROFILE.email}
              </a>

              <p className="font-mono text-[11px] text-t-muted mt-3 leading-relaxed">
                {lang === "ko"
                  ? "// 협업, 프로젝트, 혹은 가볍게 인사까지 — 답장은 빠릅니다"
                  : "// Work, projects, or just saying hi — replies are fast."}
              </p>
            </div>

            {/* 우: 링크 리스트 */}
            <div className="p-6 md:p-8 flex flex-col justify-center gap-3">
              <LinkRow label="GitHub" value="Jacob-9909" href={PROFILE.github} />
              <LinkRow label="Blog" value="jacob-log.vercel.app" href={PROFILE.blog} />
              <LinkRow label="Resume" value="PDF ↓" href={PROFILE.resume} />
            </div>
          </div>
        </Reveal>

        <p className="font-mono text-t-muted/60 text-[11px] mt-12">
          &copy; {new Date().getFullYear()} {PROFILE.name} ({PROFILE.alias})
          <span className="mx-2 text-t-dim">&middot;</span>
          Next.js &amp; Tailwind CSS
        </p>
      </div>
    </section>
  );
}

function LinkRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-baseline justify-between gap-4 border-b border-t-border/50 pb-2.5 hover:border-t-amber/40 transition-colors"
    >
      <span className="font-mono text-xs text-t-muted group-hover:text-t-amber transition-colors shrink-0">
        {label}
      </span>
      <span className="text-t-text/80 text-xs group-hover:text-t-amber transition-colors truncate">
        {value}
      </span>
    </a>
  );
}
