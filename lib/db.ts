import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL or NETLIFY_DATABASE_URL must be set");
}

export const sql = neon(connectionString);
