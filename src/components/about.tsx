"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { Globe, Mail, Pin } from "./icons";
import { Portrait } from "./portrait";
import { Reveal } from "./reveal";
import { Section } from "./section";

const facts = [
  { label: "Location", value: `${profile.location} · open to relocation`, icon: Pin },
  { label: "Open to", value: "Onsite, remote, project & contract work", icon: Globe },
  { label: "Languages", value: profile.languages.join(", "), icon: Globe },
  { label: "Email", value: profile.email, icon: Mail, href: `mailto:${profile.email}` },
];

// Below `lg` the full bio runs long enough that most readers won't scroll
// through it, so only the first few paragraphs show by default there.
const MOBILE_VISIBLE = 3;

export function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section id="about" eyebrow="About" title="Engineering the systems behind the product.">
      <div className="grid items-start gap-14 lg:grid-cols-[380px_1fr] lg:gap-20">
        <Reveal className="pt-2">
          <Portrait />
        </Reveal>
        <div>
          <div className="max-w-[75ch] space-y-4 text-[16.5px] leading-[1.75] text-muted">
            {profile.about.map((para, i) => (
              <Reveal
                key={i}
                delay={i * 0.05}
                y={16}
                className={i >= MOBILE_VISIBLE && !expanded ? "hidden lg:block" : undefined}
              >
                <p className={i === 0 ? "text-lg text-fg" : undefined}>{para}</p>
              </Reveal>
            ))}
          </div>
          {profile.about.length > MOBILE_VISIBLE ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-3 font-mono text-[13px] text-accent transition-colors hover:text-fg lg:hidden"
            >
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          ) : null}
          <Reveal delay={0.2}>
            <dl className="mt-10 grid gap-3 sm:grid-cols-2">
              {facts.map(({ label, value, icon: Icon, href }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-line bg-ghost px-4 py-3.5">
                  <Icon className="mt-0.5 size-4 flex-none text-accent" />
                  <div className="min-w-0">
                    <dt className="font-mono text-[11px] tracking-[0.06em] text-faint uppercase">{label}</dt>
                    <dd className="mt-0.5 text-[15px] break-words text-fg">
                      {href ? (
                        <a href={href} className="transition-colors hover:text-accent">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
