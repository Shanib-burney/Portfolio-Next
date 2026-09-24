"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile, sections } from "@/content/profile";
import { Download } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock scroll, close on Esc / outside tap / desktop resize, manage focus.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onMq);
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line bg-[var(--nav-bg)] backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="container-x flex h-[72px] items-center justify-between">
        <a href="#top" className="font-mono text-lg font-medium tracking-tight" aria-label={`${profile.name}, back to top`}>
          SB<span className="text-accent [animation:blink_1.1s_steps(1)_infinite]">_</span>
        </a>

        <ul className="hidden items-center gap-7 text-sm text-muted min-[900px]:flex">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`transition-colors hover:text-fg ${active === s.id ? "text-fg" : ""}`}
              >
                <span className="mr-1 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}.</span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href={profile.cv.href}
            download={profile.cv.fileName}
            className="hidden items-center gap-1.5 rounded-[10px] border border-line px-4 py-[9px] text-sm transition-colors hover:border-accent hover:bg-accent/10 sm:inline-flex"
          >
            CV <Download className="size-3.5" />
          </a>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? close() : setOpen(true))}
            className="relative grid size-10 place-items-center rounded-[10px] border border-line bg-ghost transition-colors hover:border-accent min-[900px]:hidden"
          >
            <span className="relative block h-3 w-[18px]" aria-hidden>
              <motion.span
                className="absolute left-0 block h-[2px] w-full rounded bg-fg"
                animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute top-[5px] left-0 block h-[2px] w-full rounded bg-fg"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute left-0 block h-[2px] w-full rounded bg-fg"
                animate={open ? { top: 5, rotate: -45 } : { top: 10, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            key="menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="border-t border-line bg-[var(--nav-bg)] backdrop-blur-md min-[900px]:hidden"
          >
            <motion.ul
              className="container-x flex max-h-[calc(100dvh-72px)] flex-col overflow-y-auto py-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
            >
              {sections.map((s, i) => (
                <motion.li key={s.id} variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-3 rounded-xl px-3 py-3.5 text-lg transition-colors hover:bg-ghost-h ${
                      active === s.id ? "text-fg" : "text-muted"
                    }`}
                  >
                    <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}.</span>
                    {s.label}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }} className="mt-3 px-3 pb-2">
                <a
                  href={profile.cv.href}
                  download={profile.cv.fileName}
                  onClick={() => setOpen(false)}
                  className="glow-accent inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-semibold text-white"
                >
                  Download CV <Download className="size-4" />
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
