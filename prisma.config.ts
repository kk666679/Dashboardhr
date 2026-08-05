import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (process.env.ORM_PRISMA_URL ?? process.env.DATABASE_URL ?? 'postgresql://localhost/dev') as string,
  },
});