"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { featuredProjects, moreProjects, research, type ArchNode, type CardProject, type FeaturedProject } from "@/content/projects";
import { External } from "./icons";
import { Reveal } from "./reveal";
import { Section } from "./section";

const COLS = [14, 142, 270, 398, 526];
const ROWS = [40, 140, 240];
const NW = 108;
const NH = 50;

const pos = (n: ArchNode) => [COLS[n.c]!, ROWS[n.r]!] as const;

function edgePath(a: ArchNode, b: ArchNode) {
  const [ax, ay] = pos(a);
  const [bx, by] = pos(b);
  if (b.c > a.c) {
    const x1 = ax + NW, y1 = ay + NH / 2, x2 = bx, y2 = by + NH / 2;
    return `M${x1},${y1} C${x1 + 36},${y1} ${x2 - 36},${y2} ${x2},${y2}`;
  }
  if (b.c === a.c) {
    const x = ax + NW / 2;
    return by > ay ? `M${x},${ay + NH} L${x},${by}` : `M${x},${ay} L${x},${by + NH}`;
  }
  // Backward edge: from the source's bottom to the target's right side.
  const x1 = ax + NW / 2, y1 = ay + NH, x2 = bx + NW, y2 = by + NH / 2;
  return `M${x1},${y1} C${x1},${y2} ${x1},${y2} ${x2},${y2}`;
}

function Diagram({ project, play }: { project: FeaturedProject; play: boolean }) {
  const reduce = useReducedMotion();
  const byId = Object.fromEntries(project.nodes.map((n) => [n.id, n]));
  const order = [...project.nodes].sort((a, b) => a.c - b.c || a.r - b.r);
  const step = 0.14;
  const appear = (id: string) => order.findIndex((n) => n.id === id) * step;
  const { frame } = project;

  return (
    <svg
      viewBox="0 0 648 312"
      role="img"
      aria-label={`Architecture of ${project.name}: ${project.nodes.map((n) => n.label).join(", ")}`}
      className="block h-auto w-full"
    >
      {frame ? (
        <motion.g initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
          <rect
            x={COLS[frame.from]! - 10}
            y={18}
            width={COLS[frame.to]! + NW - COLS[frame.from]! + 20}
            height={ROWS[2]! + NH - 4}
            rx={14}
            fill="rgba(var(--accent-rgb),0.03)"
            stroke="rgba(var(--accent-rgb),0.35)"
            strokeDasharray="5 5"
          />
          <text x={COLS[frame.from]! - 2} y={12} className="fill-accent font-mono text-[10.5px] tracking-wide">
            {frame.label}
          </text>
        </motion.g>
      ) : null}

      {project.edges.map(([f, t]) => {
        const a = byId[f]!;
        const b = byId[t]!;
        return (
          <motion.path
            key={`${f}-${t}`}
            d={edgePath(a, b)}
            fill="none"
            stroke="rgba(var(--accent-rgb),0.5)"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={play ? { pathLength: 1 } : {}}
            transition={{ duration: 0.7, delay: Math.max(appear(f), appear(t)) + 0.2 }}
          />
        );
      })}

      {play && !reduce
        ? project.edges.map(([f, t], j) => (
            <circle key={`dot-${f}-${t}`} r={3.2} className="fill-accent" style={{ filter: "drop-shadow(0 0 4px rgba(var(--accent-rgb),0.9))" }}>
              <animateMotion
                dur={`${(1.4 + (j % 3) * 0.35).toFixed(2)}s`}
                begin={`${(order.length * step + 1 + j * 0.23).toFixed(2)}s`}
                repeatCount="indefinite"
                path={edgePath(byId[f]!, byId[t]!)}
              />
            </circle>
          ))
        : null}

      {project.nodes.map((n) => {
        const [x, y] = pos(n);
        return (
          <g key={n.id} transform={`translate(${x},${y})`}>
            <motion.g
              initial={{ opacity: 0, y: -14 }}
              animate={play ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: appear(n.id), ease: [0.2, 0.8, 0.2, 1] }}
            >
              <rect
                width={NW}
                height={NH}
                rx={10}
                fill="var(--node-bg)"
                stroke={n.accent ? "rgba(var(--accent-rgb),0.7)" : "var(--line)"}
                strokeWidth={1.2}
              />
              <text x={NW / 2} y={21} textAnchor="middle" dominantBaseline="middle" className="fill-fg font-mono text-[12px]">
                {n.label}
              </text>
              <text x={NW / 2} y={37} textAnchor="middle" dominantBaseline="middle" className="fill-faint font-mono text-[9.5px]">
                {n.kind}
              </text>
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

function SmallCard({ p, badge }: { p: CardProject; badge?: string }) {
  return (
    <div className="card flex h-full flex-col p-5 transition-colors hover:border-accent/50">
      <p className="font-mono text-[11px] tracking-[0.05em] text-accent uppercase">{badge ?? p.role}</p>
      <h4 className="mt-1.5 text-[16px] font-semibold">{p.name}</h4>
      {badge ? <p className="mt-0.5 text-[12.5px] text-faint">{p.role}</p> : null}
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{p.description}</p>
      {p.metric ? <p className="mt-3 font-mono text-[12.5px] text-ok">▲ {p.metric}</p> : null}
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.chips.map((c) => (
          <li key={c} className="chip">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Projects() {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });
  const project = featuredProjects[index]!;

  function onTabKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + featuredProjects.length) % featuredProjects.length;
    setIndex(next);
    document.getElementById(`tab-${featuredProjects[next]!.slug}`)?.focus();
  }

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work, drawn as systems."
      lead="Pick a project and its architecture assembles itself, then requests start flowing through it."
    >
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Reveal className="min-w-0">
          <div role="tablist" aria-label="Featured projects" aria-orientation="vertical" className="flex gap-2.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {featuredProjects.map((p, i) => (
              <button
                key={p.slug}
                id={`tab-${p.slug}`}
                role="tab"
                type="button"
                aria-selected={i === index}
                aria-controls="project-panel"
                tabIndex={i === index ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={onTabKey}
                className={`min-w-[210px] rounded-xl border px-4 py-3.5 text-left transition-colors ${
                  i === index ? "border-accent/60 bg-accent/10" : "border-line bg-ghost hover:border-faint"
                }`}
              >
                <span className="mb-0.5 block text-[15px] font-semibold text-fg">{p.name}</span>
                <span className="text-[13px] text-muted">{p.tag}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div ref={cardRef} id="project-panel" role="tabpanel" aria-labelledby={`tab-${project.slug}`} className="card">
            <div className="card-bar">
              <span className="traffic" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="ml-2.5 truncate">{project.slug}.architecture.svg</span>
            </div>
            <div className="overflow-x-auto px-2 pt-2">
              <div className="min-w-[560px]">
                <Diagram key={project.slug} project={project} play={inView} />
              </div>
            </div>
            <div className="border-t border-line px-5 pt-4 pb-5">
              <p className="font-mono text-[11.5px] tracking-[0.04em] text-accent uppercase">{project.role}</p>
              <h3 className="mt-1.5 flex flex-wrap items-baseline gap-x-3 text-lg font-bold tracking-tight">
                {project.name}
                {project.link ? (
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[12.5px] font-normal text-accent hover:underline"
                  >
                    {project.link.label} <External className="size-3" />
                  </a>
                ) : null}
              </h3>
              <p className="mt-1.5 mb-3.5 max-w-3xl text-[14.5px] leading-relaxed text-muted">{project.description}</p>
              <ul className="flex flex-wrap gap-1.5">
                {project.chips.map((c) => (
                  <li key={c} className="chip">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <h3 className="mt-16 font-mono text-[13px] text-muted">
        <span className="text-faint">{"//"}</span> more projects
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {moreProjects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06} className="h-full">
            <SmallCard p={p} />
          </Reveal>
        ))}
      </div>

      <h3 className="mt-12 font-mono text-[13px] text-muted">
        <span className="text-faint">{"//"}</span> research
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {research.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.06} className="h-full">
            <SmallCard p={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
