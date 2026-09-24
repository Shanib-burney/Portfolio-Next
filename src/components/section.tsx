import { sectionNumber, type SectionId } from "@/content/profile";
import { Reveal } from "./reveal";

type SectionProps = {
  id: SectionId;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
};

export function Section({ id, eyebrow, title, lead, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="container-x relative py-24 md:py-28"
    >
      <Reveal>
        <p className="font-mono text-[13px] tracking-wide text-accent">
          {sectionNumber(id)}. {eyebrow}
        </p>
        <h2
          id={`${id}-title`}
          className="mt-2.5 max-w-3xl text-[clamp(30px,4vw,46px)] leading-[1.08] font-bold tracking-[-0.035em]"
        >
          {title}
        </h2>
        {lead ? <p className="mt-3.5 max-w-[620px] text-base leading-relaxed text-muted">{lead}</p> : null}
      </Reveal>
      <div className="mt-11">{children}</div>
    </section>
  );
}
