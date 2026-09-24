/**
 * Career timeline, newest first. Source: CV plus details Shanib confirmed
 * (promotion on 1 Jul 2025, Mythod via Sunbonn, team of 7).
 */
export type Role = {
  title: string;
  company: string;
  /** Short line under the company, e.g. how the placement worked. */
  note?: string;
  period: string;
  current?: boolean;
  /** Shown as a small badge, e.g. "Promoted". */
  badge?: string;
  highlights: string[];
  metrics?: { value: string; label: string }[];
  tech: string[];
};

export const roles: Role[] = [
  {
    title: "Senior Software Engineer · Project Lead",
    company: "Mythod",
    note: "Employed by Sunbonn, placed full-time at Mythod (Saudi Arabia)",
    period: "Jul 2025 – Present",
    current: true,
    badge: "Promoted",
    highlights: [
      "Lead a team of 7: sprint planning, task allocation, technical decisions, interviews and design reviews.",
      "Built automated CI/CD pipelines for build, test and release across staging and production.",
      "Implemented clustered Redis caching on high-traffic API endpoints.",
      "Qntar: Nx monorepo backend with an API service and a BullMQ-driven sync service for banking data.",
    ],
    metrics: [
      { value: "50%+", label: "faster deployments" },
      { value: "~45%", label: "less database load" },
      { value: "7", label: "team members led" },
    ],
    tech: ["NestJS", "TypeScript", "Nx", "BullMQ", "Redis", "PostgreSQL", "CI/CD"],
  },
  {
    title: "Mid-Level Software Engineer",
    company: "Mythod",
    note: "Employed by Sunbonn, placed full-time at Mythod (Saudi Arabia)",
    period: "Jul 2022 – Jun 2025",
    highlights: [
      "Architected a multi-service NestJS backend for a travel & ticket SaaS, with NATS events between services.",
      "Production environment on Kubernetes with PostgreSQL, MongoDB and Redis, built for high availability and zero-downtime deployments.",
      "Led the project informally before the official lead role.",
    ],
    tech: ["NestJS", "Microservices", "NATS", "Kubernetes", "Docker", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    title: "MERN Stack Developer",
    company: "ePaging",
    period: "Feb 2022 – Jul 2022",
    highlights: [
      "Built an NFT social media platform and marketplace, including wallet authentication and transaction APIs.",
      "REST APIs and UI for NFT minting, trading and user profiles, with optimized queries and caching.",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    title: "Software Engineer",
    company: "Teciz",
    period: "Nov 2020 – Jan 2022",
    highlights: [
      "Full stack delivery for client projects in HR, hospitality and fitness.",
      "Built an Employee & Sales Management System, a Gym Management System, and a multi-tenant Hotel Management SaaS.",
    ],
    tech: ["Node.js", "Express", "React", "Flutter", "SQL Server", "PostgreSQL"],
  },
];
