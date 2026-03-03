import { sql } from "@/lib/db";
import type { Teacher } from "@/types";

export async function getFaculty(): Promise<Teacher[]> {
  const rows = await sql`
    SELECT name, titles, departments, email, phone, image_url as "imageUrl"
    FROM faculty
    ORDER BY name
  `;
  return rows as Teacher[];
}
