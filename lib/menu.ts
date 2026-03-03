import { sql } from "@/lib/db";

export interface MenuItem {
  day: string;
  date: string;
  menu: string;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const rows = await sql`
    SELECT day, date, menu
    FROM menu
    ORDER BY updated_at DESC
    LIMIT 5
  `;
  return rows as MenuItem[];
}
