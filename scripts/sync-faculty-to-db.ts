import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(url);

function parseCSV(content: string): { name: string; titles: string; departments: string; email: string; phone: string; image_url: string }[] {
  const lines = content.trim().split("\n");
  const data: { name: string; titles: string; departments: string; email: string; phone: string; image_url: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= 6) {
      data.push({
        name: values[0] || "",
        titles: values[1] || "",
        departments: values[2] || "",
        email: values[3] || "",
        phone: values[4] || "",
        image_url: values[5] || "",
      });
    }
  }
  return data;
}

async function sync() {
  const csvPath = join(process.cwd(), "public", "faculty_directory_complete.csv");
  const content = readFileSync(csvPath, "utf-8");
  const items = parseCSV(content);

  for (const item of items) {
    await sql.query(
      `INSERT INTO faculty (name, titles, departments, email, phone, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name, email) DO UPDATE SET
         titles = EXCLUDED.titles,
         departments = EXCLUDED.departments,
         phone = EXCLUDED.phone,
         image_url = EXCLUDED.image_url`,
      [item.name, item.titles, item.departments, item.email, item.phone, item.image_url]
    );
  }
  console.log(`Synced ${items.length} faculty to database`);
}

sync().catch((e) => {
  console.error(e);
  process.exit(1);
});
