"use client";

import { motion } from "framer-motion";
import { Mail, Code2, BookOpen, FileDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/data";

export default function ContactSection() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { PROFILE } = t;

  const links = [
    {
      href: `mailto:${PROFILE.email}`,
      icon: <Mail size={16} />,
      label: "Email",
      sub: PROFILE.email,
    },
    {
      href: PROFILE.github,
      icon: <Code2 size={16} />,
      label: "GitHub",
      sub: "Jacob-9909",
    },
    {
      href: PROFILE.blog,
      icon: <BookOpen size={16} />,
      label: "Blog",
      sub: "jacob-log.vercel.app",
    },
    {
      href: PROFILE.resume,
      icon: <FileDown size={16} />,
      label: "Resume",
      sub: "Download",
    },
  ];

  return (
    <section id="contact" className="px-4 md:px-6 lg:px-8 py-16">
      <div className="section-divider mb-10">{t.SECTIONS.contact}</div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface p-4 flex flex-col items-center text-center gap-2 group"
          >
            <span className="text-t-muted group-hover:text-t-amber transition-colors">
              {link.icon}
            </span>
            <span className="text-t-text text-sm font-medium">
              {link.label}
            </span>
            <span className="text-t-muted text-[10px] leading-tight break-all">
              {link.sub}
            </span>
          </a>
        ))}
      </motion.div>

      <p className="text-t-muted/40 text-[10px] mt-16 text-center max-w-3xl">
        &copy; {new Date().getFullYear()} Woohyuck Jeong. Built with Next.js &amp;
        Tailwind CSS.
      </p>
    </section>
  );
}
