# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Shanib Burney's single-page developer portfolio. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Zod. Package manager is **pnpm** (pinned in `package.json`; `corepack enable` sets it up).

`PORTFOLIO_SPEC.md` is the agreed content/design blueprint for this build (sections, copy, layout decisions, what was deliberately dropped from v1). Check it before changing section content, copy, or structure — it records decisions already made with Shanib, including things that must **not** appear on the site (see Constraints below).

## Commands

```bash
pnpm install
pnpm dev                    # http://localhost:3000
pnpm build && pnpm start    # production build
pnpm lint                   # eslint
pnpm typecheck              # next typegen && tsc --noEmit
```

There is no test suite. If `pnpm` isn't on PATH, prefix commands with `corepack`.

Copy `.env.example` to `.env.local` for local env vars. Without `RESEND_API_KEY` set, the contact form prints messages to the server log instead of sending them (`CONTACT_DELIVERY=log`).

## Architecture

**One page, composed of section components.** `src/app/page.tsx` renders `Nav`, then `Hero → About → Skills → Experience → Projects → Education → Contact` inside `<main>`, then `Footer`. Each section is its own component under `src/components/`; there are no routes beyond the single page (plus `robots.ts` / `sitemap.ts` for metadata).

**Content is strictly separated from components.** All copy, stats, links, timeline data, skills, and project/architecture-diagram data live in `src/content/*.ts` as typed data (no JSX, no logic). Components read from these files rather than embedding copy. When asked to change wording, stats, links, timeline entries, or project descriptions, edit the relevant file in `src/content/`, not the component:
- `profile.ts` — name, title, pitch, links, stats, availability text
- `skills.ts`, `experience.ts`, `education.ts` — respective sections
- `projects.ts` — featured projects (`featuredProjects`) including their architecture diagrams (`nodes`/`edges`), plus `moreProjects` (compact cards) and `research`

**Architecture diagrams are declarative.** Each `FeaturedProject` has `nodes: ArchNode[]` (grid position via `c` 0–4 / `r` 0–2, label, kind, optional `accent`) and `edges: [string, string][]` (node-id pairs). The Projects component renders these as an animated diagram (blocks appear, edges draw, request dots flow) — to change a diagram's shape, edit the node/edge data, not diagram-drawing logic.

**Animation conventions (Framer Motion throughout):**
- `Reveal` (`src/components/reveal.tsx`) is the shared "fade + lift in on scroll into view" wrapper used across sections — prefer it over hand-rolling `whileInView` animations.
- `useReducedMotion()` is checked per-component (see `hero.tsx`); when true, components should render their final state directly instead of animating (no typing effects, pulses, or scroll-linked motion) — this is a hard requirement from the spec, not just a nicety.
- The hero (`src/components/hero/`) is the most animation-heavy area: `hero.tsx` orchestrates scroll-linked transforms (via `useScroll`/`useTransform`) across `code-editor.tsx` (typing animation) and `node-network.tsx` (canvas-based node network). Scroll-linked transforms there are tuned against the hero's own scroll range (`useScroll({ target: heroRef, offset: [...] })`) and assume the desktop side-by-side layout; the stacked mobile layout needs separate handling (see the `skipScrollExit`/matchMedia pattern in `hero.tsx`) since the section's scrollable height differs by breakpoint.

**Contact form flow:** `contact.tsx` (client) submits via a form action to the server action `sendMessage` in `src/app/actions.ts`, which validates with a `zod` schema, checks a honeypot field and rate limit (`src/lib/spam.ts`), then sends via `src/lib/email.ts` (Resend). Shared client/server state types live in `src/lib/contact.ts` (`ContactState`). The spec describes this section as a "Postman-style" API panel (`api-panel.tsx`) that types out a mock `GET`/`POST` exchange before reusing this same server action to actually send.

**Theming:** dark by default with a light mode toggle (`theme-toggle.tsx`, `theme-script.ts` for the no-flash inline script). Design tokens (colors, fonts, light/dark values) live in `src/app/globals.css`, not in component files or Tailwind config.

**Path alias:** `@/*` → `src/*` (see `tsconfig.json`).

## Constraints from the spec (do not violate without asking)

- The travel & ticket SaaS project is **unreleased and under NDA**: never introduce its real product name anywhere — copy, alt text, file names, metadata, git history, commit messages. It stays referred to generically (e.g. "Travel & Ticket SaaS").
- RBAC is not to be listed anywhere on the site (explicit exclusion in the spec).
- No technology names in the hero pitch copy, by design (keeps it valid as the stack grows).
- `prefers-reduced-motion` must yield a fully static, final-state render — no exceptions for individual components.
