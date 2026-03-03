import { sql } from "@/lib/db";

export interface Announcement {
  id: number;
  title: string;
  content: string | null;
  created_at: Date;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const rows = await sql`
    SELECT id, title, content, created_at
    FROM announcements
    ORDER BY created_at DESC
  `;
  return rows as Announcement[];
}
