# Shanib Burney · Portfolio (v2)

Single-page developer portfolio built from `PORTFOLIO_SPEC.md` in this folder.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Zod

## Run it

Uses **pnpm** (version pinned in `package.json`; `corepack enable` sets it up automatically).

```bash
pnpm install
pnpm dev           # http://localhost:3000
pnpm build && pnpm start   # production build
pnpm lint
pnpm typecheck
```

If `pnpm` isn't on your PATH, prefix the commands with `corepack` (e.g. `corepack pnpm install`).

Copy `.env.example` to `.env.local` and fill it in when you deploy. In development the contact form prints messages to the terminal instead of sending them.

## Where things live

| What | Where |
|---|---|
| All text, stats, links | `src/content/profile.ts` |
| Skills | `src/content/skills.ts` |
| Experience timeline (roles, highlights, metrics) | `src/content/experience.ts` |
| Projects and their architecture diagrams | `src/content/projects.ts` |
| Education | `src/content/education.ts` |
| Colors, fonts, light/dark tokens | `src/app/globals.css` |
| Sections | `src/components/*` (hero in `components/hero/`, contact in `components/contact/`) |
| Contact form server action | `src/app/actions.ts` (Resend email, honeypot, rate limit) |
| CV PDF | `public/cv/Shanib-Burney-CV.pdf` |
| Portrait | `public/images/shanib-burney.jpg` |

Diagram layout: each node has a column `c` (0–4) and row `r` (0–2); edges are `[from, to]` node ids.

## Before launch

- Replace `public/cv/Shanib-Burney-CV.pdf` with the updated CV (title "Senior Software Engineer", 1 Jul 2025 promotion). Keep the same file name.
- Set `NEXT_PUBLIC_SITE_URL`, then `SITE_INDEXABLE=true`.
- Add `RESEND_API_KEY` (and `CONTACT_FROM_EMAIL` once a domain is verified) so the contact form sends real email.
- The travel & ticket SaaS is under NDA: never add its product name anywhere.
