/**
 * Projects. The travel & ticket SaaS is unreleased and under NDA:
 * never add its product name anywhere (copy, alt text, file names, metadata).
 */
export type ArchNode = {
  id: string;
  /** column 0–4 */
  c: number;
  /** row 0–2 */
  r: number;
  label: string;
  kind: string;
  accent?: boolean;
};

export type FeaturedProject = {
  slug: string;
  name: string;
  tag: string;
  role: string;
  link?: { href: string; label: string };
  description: string;
  chips: string[];
  frame?: { from: number; to: number; label: string };
  nodes: ArchNode[];
  edges: [string, string][];
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "qntar",
    name: "Qntar",
    tag: "Personal finance app",
    role: "Project Lead · Mythod",
    link: { href: "https://www.qntar.com/", label: "qntar.com" },
    description:
      "A personal-finance app: people link their bank and card accounts, see spending categorized automatically, and set budgets and goals. The backend is an Nx monorepo: an API service, plus a sync service that pulls account data from banking APIs through BullMQ job queues. Redis caching cut database load by ~30%, and JWT auth protects financial data.",
    chips: ["NestJS", "Nx monorepo", "PostgreSQL", "Redis", "BullMQ", "JWT", "Banking APIs"],
    frame: { from: 1, to: 3, label: "nx monorepo · backend" },
    nodes: [
      { id: "app", c: 0, r: 1, label: "Mobile App", kind: "iOS · Android" },
      { id: "api", c: 1, r: 1, label: "API Service", kind: "service", accent: true },
      { id: "bull", c: 2, r: 0, label: "BullMQ", kind: "job queue" },
      { id: "db", c: 2, r: 1, label: "PostgreSQL", kind: "database" },
      { id: "redis", c: 2, r: 2, label: "Redis", kind: "cache" },
      { id: "sync", c: 3, r: 0, label: "Sync Service", kind: "service", accent: true },
      { id: "bank", c: 4, r: 0, label: "Banking APIs", kind: "external" },
    ],
    edges: [
      ["app", "api"],
      ["api", "bull"],
      ["api", "db"],
      ["api", "redis"],
      ["bull", "sync"],
      ["sync", "bank"],
      ["sync", "db"],
    ],
  },
  {
    slug: "travel-ticket-saas",
    name: "Travel & Ticket SaaS",
    tag: "Microservices · event-driven",
    role: "Lead developer · Mythod",
    description:
      "A travel and ticket management SaaS. I architected a multi-service NestJS backend where services talk through NATS events instead of direct calls, which reduced coupling between them and made the system more resilient. Each service owns its data, in PostgreSQL or MongoDB depending on its needs, with Redis for caching. It runs in Docker containers on Kubernetes, with zero-downtime deployments.",
    chips: ["NestJS", "Microservices", "NATS", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes"],
    frame: { from: 1, to: 3, label: "kubernetes · docker" },
    nodes: [
      { id: "cl", c: 0, r: 1, label: "Web / Mobile", kind: "client" },
      { id: "api", c: 1, r: 1, label: "API", kind: "nestjs", accent: true },
      { id: "redis", c: 1, r: 2, label: "Redis", kind: "cache" },
      { id: "s1", c: 2, r: 0, label: "Service", kind: "nestjs", accent: true },
      { id: "s2", c: 2, r: 1, label: "Service", kind: "nestjs", accent: true },
      { id: "s3", c: 2, r: 2, label: "Service", kind: "nestjs", accent: true },
      { id: "nats", c: 3, r: 1, label: "NATS", kind: "event bus" },
      { id: "pg", c: 4, r: 0, label: "PostgreSQL", kind: "database" },
      { id: "mongo", c: 4, r: 2, label: "MongoDB", kind: "database" },
    ],
    edges: [
      ["cl", "api"],
      ["api", "redis"],
      ["api", "s1"],
      ["api", "s2"],
      ["api", "s3"],
      ["s1", "nats"],
      ["s2", "nats"],
      ["s3", "nats"],
      ["s1", "pg"],
      ["s3", "mongo"],
    ],
  },
  {
    slug: "hotel-management-saas",
    name: "Hotel Management SaaS",
    tag: "Multi-tenant SaaS · many properties",
    role: "Software Engineer · Teciz",
    description:
      "A SaaS platform that lets many hotels run bookings, room inventory and guest management from one system. I built the multi-tenant Node.js backend with REST APIs, and designed a normalized PostgreSQL schema with optimized queries so multiple properties can operate at the same time.",
    chips: ["Node.js", "REST APIs", "PostgreSQL", "Multi-tenant"],
    frame: { from: 1, to: 3, label: "multi-tenant backend · one platform, many properties" },
    nodes: [
      { id: "cl", c: 0, r: 1, label: "Hotel Staff", kind: "web client" },
      { id: "api", c: 1, r: 1, label: "REST API", kind: "node.js", accent: true },
      { id: "b", c: 2, r: 0, label: "Bookings", kind: "module", accent: true },
      { id: "i", c: 2, r: 1, label: "Rooms", kind: "inventory", accent: true },
      { id: "g", c: 2, r: 2, label: "Guests", kind: "module", accent: true },
      { id: "db", c: 3, r: 1, label: "PostgreSQL", kind: "normalized" },
    ],
    edges: [
      ["cl", "api"],
      ["api", "b"],
      ["api", "i"],
      ["api", "g"],
      ["b", "db"],
      ["i", "db"],
      ["g", "db"],
    ],
  },
];

export type CardProject = {
  name: string;
  role: string;
  description: string;
  chips: string[];
  metric?: string;
};

export const moreProjects: CardProject[] = [
  {
    name: "NFT Social & Marketplace",
    role: "MERN Stack Developer · ePaging",
    description:
      "NFT minting, peer-to-peer trading and a social feed on an Express backend, with indexed MongoDB schemas and blockchain APIs for wallet verification and on-chain transaction validation.",
    chips: ["React", "Node.js", "Express", "MongoDB", "Blockchain APIs"],
  },
  {
    name: "Employee & Sales Management",
    role: "Software Engineer · Teciz",
    description:
      "An ERP-style system for a mid-sized fertilizer company covering employees, sales tracking and reporting, with SQL Server query optimizations behind real-time analytics dashboards.",
    chips: ["React", "Node.js", "Express", "SQL Server"],
  },
  {
    name: "Gym Management",
    role: "Software Engineer · Teciz",
    description:
      "REST APIs serving a Flutter mobile app and a React admin panel for members, attendance and billing, with automated membership renewals and payment tracking.",
    chips: ["Node.js", "SQL Server", "Flutter", "React"],
  },
];

export const research: CardProject[] = [
  {
    name: "Multimodal Image Captioning Benchmark",
    role: "MS Data Science · NED",
    description:
      "Benchmarked CNN-LSTM, ViT-GPT2 and BLIP on Flickr8k. The CNN-LSTM ran 6× faster (39 ms vs 250 ms) with 3.5× fewer parameters. Live Streamlit dashboard for side-by-side captions.",
    chips: ["PyTorch", "Hugging Face", "Streamlit"],
    metric: "6× lower latency",
  },
  {
    name: "COVID-19 Prediction",
    role: "MS Data Science · NED",
    description:
      "Compared four classifiers on patient symptom data with 3-fold stratified cross-validation, with feature correlations and per-model precision, recall and F1.",
    chips: ["scikit-learn", "Pandas", "Seaborn"],
  },
];
