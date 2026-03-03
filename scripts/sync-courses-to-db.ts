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

function parseCSV(content: string): Record<string, string>[] {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        currentLine += char;
      }
    } else if (char === "\n" && !inQuotes) {
      lines.push(currentLine);
      currentLine = "";
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);

  if (lines.length < 2) return [];

  const headers = ["title", "url", "course_num", "subjects", "grade_levels", "length", "type", "uccsu", "prereq", "enroll_criteria", "fulfillment", "description"];
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values: string[] = [];
    let current = "";
    inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ""));

    if (values.length >= 12) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
      data.push(row);
    }
  }
  return data;
}

async function sync() {
  const csvPath = join(process.cwd(), "public", "courses_data.csv");
  const content = readFileSync(csvPath, "utf-8");
  const items = parseCSV(content);

  for (const item of items) {
    await sql.query(
      `INSERT INTO courses (title, url, course_num, subjects, grade_levels, length, type, uccsu, prereq, enroll_criteria, fulfillment, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (url) DO UPDATE SET
         title = EXCLUDED.title,
         course_num = EXCLUDED.course_num,
         subjects = EXCLUDED.subjects,
         grade_levels = EXCLUDED.grade_levels,
         length = EXCLUDED.length,
         type = EXCLUDED.type,
         uccsu = EXCLUDED.uccsu,
         prereq = EXCLUDED.prereq,
         enroll_criteria = EXCLUDED.enroll_criteria,
         fulfillment = EXCLUDED.fulfillment,
         description = EXCLUDED.description`,
      [item.title, item.url, item.course_num, item.subjects, item.grade_levels, item.length, item.type, item.uccsu, item.prereq, item.enroll_criteria, item.fulfillment, item.description]
    );
  }
  console.log(`Synced ${items.length} courses to database`);
}

sync().catch((e) => {
  console.error(e);
  process.exit(1);
});
