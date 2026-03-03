import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(url);

const MIGRATION = `
CREATE TABLE IF NOT EXISTS menu (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  date TEXT NOT NULL,
  menu TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day, date)
);
`;

async function run() {
  await sql.query(MIGRATION);
  console.log("Migration complete: menu table ready");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
