export type SkillGroup = { name: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { name: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "Python", "C#"] },
  {
    name: "Backend & Distributed Systems",
    items: ["Node.js", "NestJS", "Express.js", "REST", "GraphQL", "NATS", "BullMQ", "Socket.IO", "Microservices"],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Redux", "Tailwind CSS", "Material UI", "Flutter"],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "SQL Server", "MySQL", "Firebase"],
  },
  {
    name: "Data Access",
    items: ["Prisma", "TypeORM", "Sequelize", "Mongoose"],
  },
  {
    name: "Cloud & DevOps",
    items: ["Docker", "Kubernetes", "AWS (EC2, S3)", "CI/CD", "Nx monorepo"],
  },
];
