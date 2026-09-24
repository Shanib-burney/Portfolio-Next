import { education } from "@/content/education";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background.">
      <div className="grid gap-4 md:grid-cols-2">
        {education.map((e, i) => (
          <Reveal key={e.degree} delay={i * 0.08} className="h-full">
            <article className="card flex h-full flex-col p-6">
              <p className="font-mono text-[12.5px] text-accent">{e.period}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{e.degree}</h3>
              <p className="mt-1 text-[15px] text-muted">{e.institution}</p>
              {e.note ? <p className="mt-3 border-t border-line pt-3 text-[14px] text-faint">{e.note}</p> : null}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
