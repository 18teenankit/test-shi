import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgres://postgres:Ankit@8511@localhost:5432/my_shivi_db"
  }
} satisfies Config;
