export type SkillGroup = { name: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { name: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "Python", "C#"] },
  {
    name: "Backend & APIs",
    items: ["Node.js", "NestJS", "Express", "REST", "GraphQL", "JWT auth", "Socket.io"],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Redux", "Tailwind CSS", "Flutter", "Material UI"],
  },
  {
    name: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis", "SQL Server", "MySQL", "Firebase"],
  },
  {
    name: "Cloud & DevOps",
    items: ["Docker", "Kubernetes", "AWS (EC2, S3)", "CI/CD", "NATS", "BullMQ", "Nx monorepo"],
  },
];
