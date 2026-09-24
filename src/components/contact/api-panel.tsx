"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendMessage } from "@/app/actions";
import { profile } from "@/content/profile";
import { initialContactState, type ContactState } from "@/lib/contact";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "";
/** Shown before the path in the URL bar; hidden until the site has a real domain. */
const HOST = /localhost|127\.0\.0\.1/.test(SITE) ? "" : SITE.replace(/\/$/, "");

/** Minimal JSON highlighter: keys, strings and punctuation. */
function highlight(json: string) {
  const out: React.ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(json))) {
    if (m.index > last) out.push(<span key={i++} className="tok-p">{json.slice(last, m.index)}</span>);
    if (m[2]) {
      out.push(<span key={i++} className="tok-v">{m[1]}</span>, <span key={i++} className="tok-p">{m[2]}</span>);
    } else {
      out.push(<span key={i++} className="tok-s">{m[1]}</span>);
    }
    last = re.lastIndex;
  }
  if (last < json.length) out.push(<span key={i++} className="tok-p">{json.slice(last)}</span>);
  return out;
}

/** Types a JSON body out, then shows it highlighted. */
function useTyped(text: string, reduce: boolean) {
  const [progress, setProgress] = useState<{ text: string; n: number }>({ text: "", n: 0 });
  useEffect(() => {
    if (reduce || !text) return;
    let n = 0;
    const id = setInterval(() => {
      n += 3;
      setProgress({ text, n });
      if (n >= text.length) clearInterval(id);
    }, 8);
    return () => clearInterval(id);
  }, [text, reduce]);
  // Progress belongs to a previous body until the interval catches up with the new one.
  const shown = reduce ? text.length : progress.text === text ? progress.n : 0;
  return shown >= text.length ? highlight(text) : text.slice(0, shown);
}

type Response = { status: React.ReactNode; body: string } | null;

function toResponse(state: ContactState): Response {
  switch (state.status) {
    case "success":
      return {
        status: (
          <>
            <span className="font-semibold text-ok">201 Created</span> · {state.ms} ms
          </>
        ),
        body: JSON.stringify({ status: "received", from: state.name, reply: "by email" }, null, 2),
      };
    case "invalid":
      return {
        status: (
          <>
            <span className="font-semibold text-str">422 Unprocessable</span> · check the body
          </>
        ),
        body: JSON.stringify(
          {
            error: "validation_failed",
            fields: state.fields,
            hint: "name: 2+ chars, email: valid address, message: 10+ chars",
          },
          null,
          2,
        ),
      };
    case "error":
      return {
        status: <span className="font-semibold text-str">{state.code} Error</span>,
        body: JSON.stringify({ error: state.message }, null, 2),
      };
    default:
      return null;
  }
}

const GET_BODY = JSON.stringify(
  {
    name: profile.name,
    email: profile.email,
    phone: profile.phone.display,
    linkedin: `in/${profile.linkedin.handle}`,
    location: profile.location,
    open_to: profile.openTo,
  },
  null,
  2,
);

export function ApiPanel() {
  const reduce = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [phase, setPhase] = useState<"idle" | "loading" | "get" | "post">("idle");
  const [state, formAction, pending] = useActionState(sendMessage, initialContactState);

  // Run the GET once the panel scrolls into view, then hand over to the POST form.
  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const t = setTimeout(() => setPhase("loading"), 0);
    return () => clearTimeout(t);
  }, [inView, phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("get"), reduce ? 0 : 700);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "get") return;
    const t = setTimeout(() => setPhase("post"), reduce ? 0 : 2600);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  const post = phase === "post";
  const response: Response = post
    ? toResponse(state)
    : phase === "get"
      ? {
          status: (
            <>
              <span className="font-semibold text-ok">200 OK</span> · 38 ms · 312 B
            </>
          ),
          body: GET_BODY,
        }
      : null;
  const typed = useTyped(response?.body ?? "", reduce);
  const loading = phase === "loading" || pending;
  const values = state.status === "invalid" || state.status === "error" ? state.values : undefined;
  const invalid = state.status === "invalid" ? state.fields : [];

  return (
    <div ref={ref} className="card">
      <form action={formAction} noValidate aria-describedby="api-status">
        <div className="flex flex-wrap gap-2 border-b border-line p-3.5 sm:flex-nowrap">
          <span
            className={`rounded-lg border px-3 py-2 font-mono text-[12.5px] font-semibold ${
              post ? "border-str/30 bg-str/10 text-str" : "border-ok/30 bg-ok/10 text-ok"
            }`}
          >
            {post ? "POST" : "GET"}
          </span>
          <span className="min-w-0 flex-1 truncate rounded-lg border border-line bg-inset px-3 py-2 font-mono text-[13px]">
            <span className="text-faint">{HOST}</span>
            {post ? "/api/v1/messages" : "/api/v1/contact"}
          </span>
          <button
            type={post ? "submit" : "button"}
            disabled={pending || !post}
            className="rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send"}
          </button>
        </div>

        {post ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.4 }}>
            <div className="flex gap-4 px-4 pt-2.5 font-mono text-[11.5px] tracking-[0.05em] text-faint uppercase">
              <b className="border-b border-accent pb-1 font-medium text-fg">Body</b>
              <span>Headers</span>
            </div>
            <div className="space-y-1 px-4 pt-3 pb-2 font-mono text-[13px] leading-8">
              {(
                [
                  ["name", "Your name", "text", "name"],
                  ["email", "you@company.com", "email", "email"],
                ] as const
              ).map(([field, placeholder, type, autoComplete]) => (
                <label key={field} className="flex items-center gap-2">
                  <span className="tok-v whitespace-nowrap">&quot;{field}&quot;:</span>
                  <input
                    name={field}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    defaultValue={values?.[field]}
                    aria-invalid={invalid.includes(field) || undefined}
                    className="min-w-0 flex-1 border-b border-dashed border-line bg-transparent px-0.5 text-str outline-none placeholder:text-faint focus:border-accent aria-invalid:border-str"
                  />
                </label>
              ))}
              <label className="flex items-start gap-2">
                <span className="tok-v whitespace-nowrap">&quot;message&quot;:</span>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell me about the role or project"
                  defaultValue={values?.message}
                  aria-invalid={invalid.includes("message") || undefined}
                  className="min-w-0 flex-1 resize-none border-b border-dashed border-line bg-transparent px-0.5 leading-7 text-str outline-none placeholder:text-faint focus:border-accent aria-invalid:border-str"
                />
              </label>
              <label aria-hidden className="absolute -left-[9999px]">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          </motion.div>
        ) : null}
      </form>

      <div className="h-0.5 overflow-hidden">
        <motion.div
          className="h-full bg-accent shadow-[0_0_10px_var(--accent)]"
          initial={{ width: "0%" }}
          animate={loading ? { width: "90%" } : response ? { width: "100%", opacity: 0 } : { width: "0%" }}
          transition={{ duration: loading ? 0.7 : 0.4 }}
        />
      </div>
      <p id="api-status" aria-live="polite" className="flex min-h-10 items-center gap-3 border-t border-line px-4 py-2.5 font-mono text-[12px] text-faint">
        {loading ? "Sending…" : response ? response.status : post ? "Your turn: fill in the body and hit Send." : "Waiting to send…"}
      </p>
      <pre className="min-h-[170px] px-4 pb-5 font-mono text-[13px] leading-[1.75] whitespace-pre-wrap text-fg">{typed}</pre>
    </div>
  );
}
