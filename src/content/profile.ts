/**
 * Profile content. Source of truth: ../PORTFOLIO_SPEC.md (v2) and the CV.
 * Never add facts that are not in one of those two.
 */
export const profile = {
  name: "Shanib Burney",
  legalName: "Syed Muhammad Shanib Burney",
  title: "Senior Software Engineer",
  pitch:
    "I build scalable web products end to end: APIs, microservices, frontends, and the cloud infrastructure they run on.",
  availability: "Open to full-time (onsite or remote), project & contract work",
  email: "shanib.burney@gmail.com",
  phone: { display: "+92 341 2977002", href: "tel:+923412977002" },
  linkedin: {
    url: "https://www.linkedin.com/in/shanib-burney-4a63b51bb/",
    handle: "shanib-burney-4a63b51bb",
  },
  location: "Karachi, Pakistan",
  languages: ["English", "Urdu"],
  openTo: ["full-time", "remote", "projects", "contract"],
  cv: {
    href: "/cv/Shanib-Burney-CV.pdf",
    fileName: "Shanib-Burney-CV.pdf",
  },
  portrait: {
    src: "/images/shanib-burney.jpg",
    alt: "Portrait of Shanib Burney in a navy blazer",
  },
  stats: [
    { value: 5, suffix: "+", label: "Years experience" },
    { value: 7, suffix: "", label: "Team members led" },
    { value: 10, suffix: "+", label: "Projects delivered" },
  ],
  about: [
    "I'm a Senior Software Engineer with 5+ years of experience building software products, scalable backend systems and cloud-native applications.",
    "I've worked across SaaS, fintech, marketplace and business management platforms, building everything from APIs and dashboards to microservices and event-driven systems.",
    "I enjoy the parts of software that take more than writing code: designing systems, making architectural decisions, integrating services, improving performance, and turning complex requirements into reliable products.",
    "Over the years I've grown into technical leadership: leading teams, breaking down work, running design and code reviews, mentoring developers, and helping teams ship production software.",
    "Today I work across the full stack, with a focus on backend engineering, system architecture, cloud infrastructure, and products that scale with the business.",
    "I keep expanding my toolkit as technology evolves, exploring new areas and bringing the most useful ones into the products I build.",
  ],
} as const;

export const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export function sectionNumber(id: SectionId): string {
  const i = sections.findIndex((s) => s.id === id);
  return String(i + 1).padStart(2, "0");
}
