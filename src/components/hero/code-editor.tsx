"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Token = [cls: "k" | "v" | "s" | "p" | "f", text: string];

const LINES: Token[][] = [
  [["k", "const "], ["v", "engineer"], ["p", " = {"]],
  [["p", "  "], ["v", "name"], ["p", ": "], ["s", '"Shanib Burney"'], ["p", ","]],
  [["p", "  "], ["v", "role"], ["p", ": "], ["s", '"Senior Software Engineer"'], ["p", ","]],
  [["p", "  "], ["v", "builds"], ["p", ": ["]],
  [["p", "    "], ["s", '"APIs"'], ["p", ", "], ["s", '"microservices"'], ["p", ","]],
  [["p", "    "], ["s", '"frontends"'], ["p", ", "], ["s", '"cloud infra"'], ["p", ","]],
  [["p", "  ],"]],
  [["p", "  "], ["v", "status"], ["p", ": "], ["s", '"open_to_work"'], ["p", ","]],
  [["p", "};"]],
  [],
  [["v", "engineer"], ["p", "."], ["f", "run"], ["p", "();"]],
];

const TERMINAL: { tone: "dim" | "accent" | "ok"; text: string }[] = [
  { tone: "dim", text: "$ ts-node engineer.ts" },
  { tone: "accent", text: "▸ booting services…" },
  { tone: "ok", text: "✓ services online" },
  { tone: "ok", text: "✓ 10+ projects deployed" },
  { tone: "ok", text: "✓ 5+ years of experience" },
  { tone: "accent", text: "● status: open to work" },
];

const TOTAL = LINES.reduce((n, l) => n + l.reduce((m, [, t]) => m + t.length, 0), 0);

/** Renders the code with only the first `count` characters visible. */
function renderCode(count: number, showCaret: boolean) {
  // The line being typed is the first one whose last character is beyond `count`.
  let start = 0;
  let current = LINES.length - 1;
  for (let i = 0; i < LINES.length; i++) {
    const len = LINES[i]!.reduce((m, [, t]) => m + t.length, 0);
    if (start + len > count) {
      current = i;
      break;
    }
    start += len;
  }
  let left = count;
  return LINES.map((line, i) => {
    if (i > current) return null;
    const parts = line.map(([cls, text], j) => {
      const shown = text.slice(0, Math.max(0, left));
      left -= text.length;
      return shown ? (
        <span key={j} className={`tok-${cls}`}>
          {shown}
        </span>
      ) : null;
    });
    const caretHere = showCaret && i === current;
    return (
      <div key={i} className="flex whitespace-pre">
        <span className="w-11 flex-none pr-[18px] text-right text-faint select-none">{i + 1}</span>
        <span className="text-fg">
          {parts}
          {caretHere ? <span className="caret" /> : null}
        </span>
      </div>
    );
  });
}

type Props = { onRun?: (alive: boolean) => void; reduce: boolean };

export function CodeEditor({ onRun, reduce }: Props) {
  const [typedChars, setChars] = useState(0);
  const [shownRows, setTermRows] = useState(0);
  const [terminalOpen, setTermOpen] = useState(false);
  const run = useRef(0);

  const play = useCallback(() => {
    const id = ++run.current;
    const alive = () => id === run.current;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      setChars(0);
      setTermRows(0);
      setTermOpen(false);
      onRun?.(false);
      await wait(900);
      let n = 0;
      const flat = LINES.flatMap((l) => l.flatMap(([, t]) => t.split("")).concat("\n"));
      for (const ch of flat) {
        if (!alive()) return;
        if (ch === "\n") {
          await wait(80);
          continue;
        }
        n += 1;
        setChars(n);
        await wait(ch === " " ? 5 : 12 + Math.random() * 18);
      }
      await wait(450);
      if (!alive()) return;
      setTermOpen(true);
      await wait(350);
      for (let i = 0; i < TERMINAL.length; i++) {
        if (!alive()) return;
        setTermRows(i + 1);
        if (TERMINAL[i]!.text.startsWith("✓ services")) onRun?.(true);
        await wait(TERMINAL[i]!.text.startsWith("▸") ? 700 : 380);
      }
    })();
  }, [onRun]);

  useEffect(() => {
    if (reduce) {
      // Reduced motion: show the finished editor and terminal straight away.
      const t = setTimeout(() => {
        setChars(TOTAL);
        setTermRows(TERMINAL.length);
        setTermOpen(true);
        onRun?.(true);
      }, 0);
      return () => clearTimeout(t);
    }
    play();
    return () => {
      run.current += 1;
    };
  }, [play, reduce, onRun]);

  const chars = typedChars;
  const termRows = shownRows;
  const termOpen = terminalOpen;
  const typing = chars < TOTAL;

  return (
    <div
      role="img"
      aria-label="Code editor typing a profile object for Shanib Burney, then running it: services online, 10+ projects deployed, team of 7 led, status open to work."
      className="card relative backdrop-blur-sm"
    >
      <div className="card-bar">
        <span className="traffic" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="ml-3 flex items-center gap-2 rounded-[7px] border border-line bg-ghost-h px-3 py-1 text-fg">
          <span className="text-[10.5px] font-semibold text-[#3b82f6]">TS</span>engineer.ts
        </span>
        <button
          type="button"
          onClick={play}
          className="ml-auto rounded-[7px] border border-line px-2.5 py-1 text-[11.5px] transition-colors hover:border-accent hover:text-fg motion-reduce:hidden"
        >
          ↻ replay
        </button>
      </div>

      <div aria-hidden className="min-h-[292px] py-[18px] font-mono text-[12px] leading-[1.75] sm:text-[13.5px] 2xl:text-[14.5px]">
        {renderCode(chars, typing)}
      </div>

      <AnimatePresence initial={false}>
        {termOpen ? (
          <motion.div
            aria-hidden
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden border-t border-line bg-term font-mono text-[12.5px] leading-[1.8]"
          >
            <div className="px-[18px] pt-3 pb-3.5">
              <div className="mb-1.5 flex gap-4 text-[11px] tracking-[0.06em] text-faint uppercase">
                <b className="border-b border-accent pb-0.5 font-medium text-fg">Terminal</b>
                <span>Output</span>
                <span>Problems</span>
              </div>
              {TERMINAL.slice(0, termRows).map((row) => (
                <motion.div
                  key={row.text}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                  className={row.tone === "ok" ? "text-ok" : row.tone === "accent" ? "text-accent" : "text-faint"}
                >
                  {row.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
