import type { Config } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const connectionString = process.env.DATABASE_URL || "postgres://postgres:Ankit@8511@localhost:5432/my_shivi_db";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionString
  }
} satisfies Config;
