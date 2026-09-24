"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { roles } from "@/content/experience";
import { Section } from "./section";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  // The accent line fills in as the timeline scrolls past.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked.">
      <ol ref={listRef} className="relative ml-2 sm:ml-3">
        {/* Track and progress line */}
        <span aria-hidden className="absolute top-2 bottom-2 left-0 w-px bg-line" />
        <motion.span
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute top-2 bottom-2 left-0 w-px origin-top bg-gradient-to-b from-accent via-accent to-accent/30"
        />

        {roles.map((role, i) => (
          <motion.li
            key={`${role.company}-${role.period}`}
            className="relative pb-12 pl-8 last:pb-0 sm:pl-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Node */}
            <span
              aria-hidden
              className={`absolute top-1.5 -left-[7px] size-[15px] rounded-full border-[3px] ${
                role.current ? "border-accent bg-accent shadow-[0_0_0_5px_rgba(var(--accent-rgb),0.18)]" : "border-accent bg-bg"
              }`}
            />

            <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[240px_1fr]">
              {/* Left column: period and company */}
              <div>
                <p className="font-mono text-[13px] text-accent">{role.period}</p>
                <p className="mt-1.5 text-lg font-semibold">{role.company}</p>
                {role.note ? <p className="mt-1 text-[13.5px] leading-snug text-faint">{role.note}</p> : null}
              </div>

              {/* Right column: the role */}
              <div className="card p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-[19px] font-bold tracking-tight">{role.title}</h3>
                  {role.badge ? (
                    <span className="rounded-full border border-ok/40 bg-ok/10 px-2.5 py-0.5 font-mono text-[11px] text-ok">
                      {role.badge}
                    </span>
                  ) : null}
                  {role.current ? (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] text-accent">
                      Current
                    </span>
                  ) : null}
                </div>

                <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-muted">
                  {role.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden className="mt-[9px] size-1.5 flex-none rounded-full bg-accent/70" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {role.metrics ? (
                  <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5">
                    {role.metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="sr-only">{m.label}</dt>
                        <dd className="text-2xl font-bold tracking-tight text-fg">{m.value}</dd>
                        <dd aria-hidden className="mt-0.5 text-[12.5px] text-muted">
                          {m.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {role.tech.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
