"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { ArrowRight, Download, LinkedIn, Mail, Phone, Pin } from "../icons";
import { CodeEditor } from "./code-editor";
import { NodeNetwork } from "./node-network";

const ease = [0.2, 0.8, 0.2, 1] as const;

function CountUp({ to, reduce }: { to: number; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : 1.4,
      delay: reduce ? 0 : 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

/** Button that leans slightly toward the cursor. */
function Magnetic({ children, className, ...rest }: React.ComponentProps<typeof motion.a>) {
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  return (
    <motion.a
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.18);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

export function Hero() {
  const reduce = Boolean(useReducedMotion());
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [alive, setAlive] = useState(false);
  const onRun = useCallback((v: boolean) => setAlive(v), []);

  // Below `lg` the hero stacks copy above the editor, so the section is
  // taller than the viewport and the editor sits further down the page.
  // The scroll-linked exit below is tuned for the side-by-side desktop
  // layout; on mobile it would already be well underway (editor faded/
  // tilted) by the time the editor first scrolls into view, so skip it there.
  const [skipScrollExit, setSkipScrollExit] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onMq = () => setSkipScrollExit(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);
  const skipExit = reduce || skipScrollExit;

  // Scroll-linked exit: the editor tilts back and fades, the copy drifts up.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useTransform(scrollYProgress, [0, 0.8], [0, 1], { clamp: true });
  const edRotate = useTransform(p, [0, 1], [0, 24]);
  const edY = useTransform(p, [0, 1], [0, 60]);
  const edScale = useTransform(p, [0, 1], [1, 0.9]);
  const edOpacity = useTransform(p, [0, 1], [1, 0.15]);
  const copyY = useTransform(p, [0, 1], [0, -40]);
  const copyOpacity = useTransform(p, [0, 1], [1, 0.1]);
  const cueOpacity = useTransform(p, [0, 0.3], [1, 0]);

  const words = profile.name.split(" ");

  return (
    <section
      id="top"
      ref={heroRef}
      aria-label="Introduction"
      className="relative isolate flex min-h-svh items-center overflow-hidden"
      onPointerMove={(e) => {
        if (reduce || !glowRef.current || !heroRef.current) return;
        const r = heroRef.current.getBoundingClientRect();
        glowRef.current.style.left = `${e.clientX - r.left}px`;
        glowRef.current.style.top = `${e.clientY - r.top}px`;
      }}
    >
      {/* Background layers. The atmosphere layer is where an optional Higgsfield clip would sit. */}
      <div aria-hidden className="atmos absolute -inset-[20%] -z-40" />
      <div
        aria-hidden
        className="grid-dots absolute inset-0 -z-30 [mask-image:radial-gradient(ellipse_80%_70%_at_60%_45%,#000_40%,transparent_100%)]"
      />
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute top-[45%] left-[60%] -z-20 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.16),transparent_65%)]"
      />
      <NodeNetwork alive={alive} reduce={reduce} hostRef={heroRef} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-b from-transparent to-bg" />

      <div className="container-x grid grid-cols-1 items-center gap-12 pt-28 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 2xl:gap-24">
        <motion.div style={skipExit ? undefined : { y: copyY, opacity: copyOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[13px] text-muted"
          >
            <span>
              <span className="text-ok">~/shanib-burney</span> $<span className="caret ml-1" />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1.5 font-sans text-[12.5px] text-fg">
              <span className="ping-dot size-[7px] rounded-full bg-ok" />
              {profile.availability}
            </span>
          </motion.div>

          <h1 className="text-[clamp(44px,6.4vw,112px)] leading-[0.98] font-extrabold tracking-[-0.045em]" aria-label={profile.name}>
            {words.map((w, i) => (
              <Fragment key={w}>
                {i > 0 ? " " : null}
                <span className="-mx-[0.1em] -mb-[0.12em] inline-block overflow-hidden px-[0.1em] pb-[0.2em] align-top" aria-hidden>
                  <motion.span
                    className={`-mx-[0.08em] inline-block px-[0.08em] ${i === words.length - 1 ? "text-gradient" : ""}`}
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease }}
                  >
                    {w}
                  </motion.span>
                </span>
              </Fragment>
            ))}
          </h1>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
          >
            {[
              <p key="title" className="mt-[18px] text-[clamp(17px,2vw,21px)] font-semibold">
                {profile.title}
              </p>,
              <p key="pitch" className="mt-3.5 max-w-[560px] text-[16.5px] 2xl:text-lg leading-[1.65] text-muted">
                {profile.pitch}
              </p>,
              <div key="ctas" className="mt-8 flex flex-wrap gap-3">
                <Magnetic
                  href="#projects"
                  className="glow-accent inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white"
                >
                  View projects <ArrowRight className="size-4" />
                </Magnetic>
                <Magnetic
                  href={profile.cv.href}
                  download={profile.cv.fileName}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-ghost px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-ghost-h"
                >
                  Download CV <Download className="size-4" />
                </Magnetic>
              </div>,
              <ul key="links" className="mt-7 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-sm text-muted">
                <li>
                  <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[7px] transition-colors hover:text-fg">
                    <LinkedIn className="size-4" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-[7px] transition-colors hover:text-fg">
                    <Mail className="size-4" /> Email
                  </a>
                </li>
                <li>
                  <a href={profile.phone.href} className="inline-flex items-center gap-[7px] transition-colors hover:text-fg">
                    <Phone className="size-4" /> {profile.phone.display}
                  </a>
                </li>
                <li className="inline-flex items-center gap-[7px]">
                  <Pin className="size-4" /> {profile.location}
                </li>
              </ul>,
              <dl key="stats" className="mt-10 flex flex-wrap gap-x-[clamp(24px,4vw,48px)] gap-y-5 border-t border-line pt-7">
                {profile.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">
                      {s.value}
                      {s.suffix} {s.label}
                    </dt>
                    <dd aria-hidden className="text-[clamp(26px,3vw,34px)] leading-none font-bold tracking-[-0.03em]">
                      <CountUp to={s.value} reduce={reduce} />
                      <span className="text-accent">{s.suffix}</span>
                    </dd>
                    <dd aria-hidden className="mt-1.5 text-[13px] text-muted">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>,
            ].map((child) => (
              <motion.div
                key={child.key}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="[perspective:1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, delay: 0.5, ease }}
          >
            <motion.div
              style={skipExit ? undefined : { rotateX: edRotate, y: edY, scale: edScale, opacity: edOpacity, transformOrigin: "50% 100%" }}
            >
              <CodeEditor onRun={onRun} reduce={reduce} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        style={reduce ? undefined : { opacity: cueOpacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-faint sm:flex"
      >
        <span className="scroll-wheel relative h-[34px] w-[22px] rounded-xl border-[1.5px] border-faint" />
        SCROLL
      </motion.a>
    </section>
  );
}
