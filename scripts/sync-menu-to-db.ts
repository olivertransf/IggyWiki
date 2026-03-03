import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!url) {
  console.log("Skipping - DATABASE_URL not configured");
  process.exit(0);
}

const sql = neon(url);

interface MenuItem {
  day: string;
  date: string;
  menu: string;
}

async function sync() {
  const jsonPath = join(process.cwd(), "public", "lunch_menu.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const items: MenuItem[] = JSON.parse(raw);

  for (const item of items) {
    await sql.query(
      `INSERT INTO menu (day, date, menu)
       VALUES ($1, $2, $3)
       ON CONFLICT (day, date) DO UPDATE SET
         menu = EXCLUDED.menu,
         updated_at = NOW()`,
      [item.day, item.date, item.menu]
    );
  }
  console.log(`Synced ${items.length} menu items to database (upsert only, no deletes)`);
}

sync().catch((e) => {
  console.error(e);
  process.exit(1);
});
