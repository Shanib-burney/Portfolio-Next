import { skillGroups } from "@/content/skills";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="What I work with.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.name} delay={i * 0.06}>
            <div className="card h-full p-5 transition-colors hover:border-accent/50">
              <h3 className="flex items-center gap-2 font-mono text-[13px] text-accent">
                <span className="text-faint">{"//"}</span> {group.name}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip text-[12.5px] text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
