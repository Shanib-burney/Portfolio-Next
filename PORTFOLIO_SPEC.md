# PORTFOLIO_SPEC.md — Shanib Burney (v2)

> Blueprint for the single-page developer portfolio, agreed with Shanib on 2026-09-24.
> Replaces the multi-page v1 plan in `../Portfolio/PORTFOLIO_SPEC.md`, which stays as it was for reference.
> Facts come from `../Shanib_CV_Senior_Full_Stack.pdf` plus details Shanib confirmed directly (listed in this file). Nothing else may be invented; unknowns are marked **[GAP]**.
> Status: **content agreed, not built yet.**

## 1. What changes
- **Single page** with anchored sections; multi-page later (each section can become its own route).
- **Dropped:** system-diagram brand metaphor, recruiter/client "doors", separate Services / Process / Stack / CV pages, Services section, principles section, testimonials, pricing, "Environments" (Production/Staging/Roadmap) labels, "currently learning" and "next up" skill groups.
- **Naming:** Qntar (public product) and Mythod are named. The travel & ticket SaaS is **unreleased and under NDA**: never use its product name anywhere (copy, alt text, file names, metadata). Other projects stay anonymized.
- **Title:** Senior **Software** Engineer everywhere (was Senior Full Stack Engineer). The CV PDF and its filename should be updated to match.

## 2. Look and feel
- Dark by default, full **light mode** (toggle in nav; first visit follows the OS; choice remembered). Circular reveal on theme switch.
- Fonts: Inter (text), JetBrains Mono (labels, code). **Accent: indigo `#6366f1`.** No accent picker on the live site.
- Numbered mono section labels (`01. About`), rounded cards, soft glows, subtle dot grid.
- **Framer Motion** for all UI and interaction animation. Optional **Higgsfield** clip only as a faint background atmosphere behind the hero, loaded after first paint, desktop only, never on reduced motion or data-saver. The hero must be complete without it.
- `prefers-reduced-motion`: everything renders in its final state, no typing, pulses or scroll-linked motion.
- Approved prototypes: `hero-preview.html`, `portfolio-demo.html` (in the session outputs).

## 3. Nav
`SB_` monogram · 01 About · 02 Skills · 03 Experience · 04 Projects · 05 Education · 06 Contact · theme toggle · `CV ↓` (downloads the CV PDF)

**Small screens (below ~860 px):** the section links are hidden and a **menu button** (hamburger icon, becomes ✕ when open) appears next to the theme toggle. Tapping it opens a panel under the top bar (Framer Motion slide/fade, links stagger in) listing all six sections with their numbers, plus the `CV ↓` button. Tapping a link scrolls to that section and closes the menu; it also closes on ✕, Esc or a tap outside. While open, page scroll is locked; the button has `aria-expanded` / `aria-controls`, focus moves into the panel and returns to the button on close. Reference: muhammad-ammar-dev.vercel.app.

## 4. Hero
- Prompt line `~/shanib-burney $` + pill: **Open to full-time (onsite or remote), project & contract work**
- Name: **Shanib Burney** (word-by-word reveal). Title: **Senior Software Engineer**
- Pitch: *"I build scalable web products end to end: APIs, microservices, frontends, and the cloud infrastructure they run on."* No technology names in the hero, so it stays valid as the stack grows (FastAPI, Spring Boot, agentic AI later).
- Buttons: **View projects** (primary) · **Download CV**
- Links: LinkedIn `https://www.linkedin.com/in/shanib-burney-4a63b51bb/` · Email `shanib.burney@gmail.com` · Phone `+92 341 2977002` (`tel:+923412977002`) · Karachi, Pakistan
- Stats (count up): **5+** Years experience · **7** Team members led · **10+** Projects delivered
- Visual (no photo): code editor typing `engineer.ts` → `engineer.run()` → terminal log (`✓ services online`, `✓ 10+ projects deployed`, `✓ team: 7 members led`, `● status: open to work`) → node network lights up with request pulses. Cursor-following glow and parallax. On scroll the editor tilts back and fades, the network spreads and dissolves into About.

## 5. 01. About
Layout: portrait left (Shanib's photo, cropped to head and shoulders, which also removes the photographer watermark; indigo glow border, slight hover tilt), text right, quick facts below.

> I'm a Senior Software Engineer with 5+ years of experience building software products, scalable backend systems and cloud-native applications.
>
> I've worked across SaaS, fintech, marketplace and business management platforms, building everything from APIs and dashboards to microservices and event-driven systems.
>
> I enjoy the parts of software that take more than writing code: designing systems, making architectural decisions, integrating services, improving performance, and turning complex requirements into reliable products.
>
> Over the years I've grown into technical leadership: leading teams, breaking down work, running design and code reviews, mentoring developers, and helping teams ship production software.
>
> Today I work across the full stack, with a focus on backend engineering, system architecture, cloud infrastructure, and products that scale with the business.
>
> I keep expanding my toolkit as technology evolves, exploring new areas and bringing the most useful ones into the products I build.

Quick facts: Karachi, Pakistan · Open to relocation · Onsite / remote / contract · English, Urdu · shanib.burney@gmail.com

## 6. 02. Skills
- **Languages:** JavaScript (ES6+), TypeScript, Python, C#
- **Backend & APIs:** Node.js, NestJS, Express, REST, GraphQL, JWT auth, Socket.io
- **Frontend:** React, Next.js, Redux, Tailwind CSS, Flutter, Material UI
- **Data:** PostgreSQL, MongoDB, Redis, SQL Server, MySQL, Firebase
- **Cloud & DevOps:** Docker, Kubernetes, AWS (EC2, S3), CI/CD, NATS, BullMQ, Nx monorepo

RBAC is not listed anywhere on the site.

## 7. 03. Experience: vertical timeline
Changed on 2026-09-25 from the git-log idea to a simpler, more readable vertical timeline.

A vertical line on the left that fills with the accent color as you scroll; one node per role (the current role's node is filled and glowing). Each role: period, company and placement note on the left; a card on the right with title, badges ("Promoted", "Current"), highlight bullets, optional metric row and tech chips. Roles fade up as they scroll into view. Single column on phones.

| Period | Title | Company line | Highlights / metrics |
|---|---|---|---|
| Jul 2025 – Present | Senior Software Engineer · Project Lead (Promoted, Current) | Mythod · employed by Sunbonn, placed full-time at Mythod (Saudi Arabia) | Leads a team of 7 (planning, allocation, decisions, interviews, design reviews); CI/CD pipelines; clustered Redis caching; Qntar Nx monorepo backend. Metrics: 50%+ faster deployments · ~45% less database load · 7 team members led |
| Jul 2022 – Jun 2025 | Mid-Level Software Engineer | Mythod · same placement note | Travel & ticket SaaS: multi-service NestJS backend with NATS events; Kubernetes with PostgreSQL, MongoDB, Redis, zero-downtime deploys; led the project informally before the official lead role |
| Feb 2022 – Jul 2022 | MERN Stack Developer | ePaging | NFT social platform and marketplace, wallet auth and transaction APIs; REST APIs and UI for minting, trading, profiles |
| Nov 2020 – Jan 2022 | Software Engineer | Teciz | Full stack client projects (HR, hospitality, fitness): Employee & Sales, Gym Management, multi-tenant Hotel SaaS |

Period placement (confirmed): microservices platform (the travel & ticket SaaS) **before** the promotion; CI/CD 50%+, Redis ~45% and Qntar **after**. The travel & ticket SaaS stays unnamed (NDA).

## 8. 04. Projects: architecture that builds itself
Tabs on the left; the selected project's architecture assembles block by block, edges draw, then request dots flow. Below the diagram: role label, name, link, description, tech chips.

**Qntar** · `qntar.com` · *Personal finance app* · role label **Project Lead · Mythod**
- Diagram: Mobile App (iOS · Android) → API Service → {BullMQ, PostgreSQL, Redis}; BullMQ → Sync Service → Banking APIs; Sync Service → PostgreSQL. Dashed frame "nx monorepo · backend" around the backend.
- Flow (confirmed): the API service enqueues jobs on BullMQ; the sync service processes them and pulls data from banking APIs.
- Copy: "A personal-finance app: people link their bank and card accounts, see spending categorized automatically, and set budgets and goals. The backend is an Nx monorepo: an API service, plus a sync service that pulls account data from banking APIs through BullMQ job queues. Redis caching cut database load by ~30%, and JWT auth protects financial data."
- Chips: NestJS, Nx monorepo, PostgreSQL, Redis, BullMQ, JWT, Banking APIs

**Travel & Ticket Management SaaS** (product name withheld under NDA; no "unreleased" label on the site) · *Microservices · event-driven* · role label **Lead developer · Mythod**
- Diagram (approved by Shanib, NDA-safe as long as the product is unnamed): Web / Mobile → API → 3 × NestJS service; all services publish/subscribe through NATS (event bus); some services own their data in PostgreSQL, others in MongoDB (polyglot persistence); Redis alongside the API as cache. Dashed frame "kubernetes · docker". Service names unknown, shown as "Service" [GAP: real service names, optional]. [GAP: what Redis is used for, assumed caching].
- Copy: "A travel and ticket management SaaS. I architected a multi-service NestJS backend where services talk through NATS events instead of direct calls, which reduced coupling between them and made the system more resilient. Each service owns its data, in PostgreSQL or MongoDB depending on its needs, with Redis for caching. It runs in Docker containers on Kubernetes, with zero-downtime deployments."
- Chips: NestJS, Microservices, NATS, PostgreSQL, MongoDB, Redis, Docker, Kubernetes

**Hotel Management SaaS** · private project · *Multi-tenant SaaS · many properties* · role label **Software Engineer · Teciz**
- Diagram: Hotel Staff (web client) → REST API (Node.js) → Bookings / Rooms (inventory) / Guests → PostgreSQL. Frame "multi-tenant backend · one platform, many properties".
- Copy: "A SaaS platform that lets many hotels run bookings, room inventory and guest management from one system. I built the multi-tenant Node.js backend with REST APIs, and designed a normalized PostgreSQL schema with optimized queries so multiple properties can operate at the same time."
- Chips: Node.js, REST APIs, PostgreSQL, Multi-tenant

Compact cards below the diagram: NFT Social & Marketplace (ePaging), Employee & Sales Management (Teciz), Gym Management (Teciz). Research row: Multimodal Image Captioning Benchmark (39 ms vs 250 ms, 6× lower latency) and COVID-19 Prediction (MS coursework).

## 9. 05. Education
- MS Data Science, NED University of Engineering & Technology, Karachi (2024 – present)
- BS Software Engineering, UBIT, University of Karachi (2018 – 2021), CGPA 3.25 / 4

## 10. 06. Contact: API client
- Left: cards for Email, Phone, LinkedIn, Location ("Karachi, Pakistan · open to relocation").
- Right: Postman-style panel. On scroll into view it runs `GET /api/v1/contact` and types the JSON response (name, email, phone, LinkedIn, location, `open_to: ["full-time", "remote", "projects", "contract"]`). Then it switches to `POST /api/v1/messages` with an editable body (name, email, message). Send validates (422 with missing fields) and submits through the existing Server Action + Resend + honeypot + rate limit (built in v1, see ../Portfolio/PORTFOLIO_SPEC.md §29), responding `201 Created`.
- Footer: © year, name, links.

## 11. Build notes (for when building starts)
- Keep the existing Next.js 16 / Tailwind v4 / Zod content pipeline; replace routes with one page composed of section components. Add `framer-motion`.
- Content model changes needed: role stages (promotion within one employer), `employer` vs `workplace` (Sunbonn vs Mythod), project `name` + `link` + public naming for Qntar only, `languages` spoken, skills grouping per §6, remove `rbac`.
- Update the CV PDF: title "Senior Software Engineer", promotion on 1 Jul 2025, "Next.js" spelling.
- Portrait asset: crop the supplied photo, export AVIF/WebP, ~800 px square, with alt text.
