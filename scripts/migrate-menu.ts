import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!url) {
  console.log("Skipping - DATABASE_URL not configured");
  process.exit(0);
}

const pool = new Pool({ connectionString: url });

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    day TEXT NOT NULL,
    date TEXT NOT NULL,
    menu TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day, date)
  )`,
  `CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    titles TEXT,
    departments TEXT,
    email TEXT,
    phone TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, email)
  )`,
  `CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title TEXT,
    url TEXT UNIQUE,
    course_num TEXT,
    subjects TEXT,
    grade_levels TEXT,
    length TEXT,
    type TEXT,
    uccsu TEXT,
    prereq TEXT,
    enroll_criteria TEXT,
    fulfillment TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS resource_sections (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    sort_order INT DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS resource_links (
    id SERIAL PRIMARY KEY,
    section_id INT NOT NULL REFERENCES resource_sections(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INT DEFAULT 0
  )`,
];

async function run() {
  const client = await pool.connect();
  try {
    for (const m of MIGRATIONS) {
      await client.query(m);
    }
    console.log("Migrations complete: menu, faculty, courses, announcements, resources");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
