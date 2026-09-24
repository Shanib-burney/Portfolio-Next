import { profile } from "@/content/profile";
import { LinkedIn, Mail, Phone, Pin } from "../icons";
import { Reveal } from "../reveal";
import { Section } from "../section";
import { ApiPanel } from "./api-panel";

const cards = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "Phone", value: profile.phone.display, href: profile.phone.href, icon: Phone },
  { label: "LinkedIn", value: profile.linkedin.handle, href: profile.linkedin.url, icon: LinkedIn, external: true },
  { label: "Location", value: `${profile.location} · open to relocation`, icon: Pin },
];

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something."
      lead={`${profile.availability}. The panel fetches my contact details, then lets you POST a message straight to my inbox.`}
    >
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.25fr]">
        <Reveal className="min-w-0">
          <ul className="flex flex-col gap-3">
            {cards.map(({ label, value, href, icon: Icon, external }) => {
              const inner = (
                <>
                  <span className="grid size-10 flex-none place-items-center rounded-[10px] border border-line bg-ghost text-accent">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] tracking-[0.05em] text-faint uppercase">{label}</span>
                    <span className="block truncate text-[15px] text-fg">{value}</span>
                  </span>
                </>
              );
              const cls = "flex items-center gap-4 rounded-xl border border-line bg-ghost px-4 py-3.5";
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`${cls} transition-[border-color,transform] duration-200 hover:translate-x-1 hover:border-accent/60`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          <ApiPanel />
        </Reveal>
      </div>
    </Section>
  );
}
