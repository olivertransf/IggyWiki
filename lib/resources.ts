import { sql } from "@/lib/db";

export interface ResourceSection {
  title: string;
  links: { label: string; href: string }[];
}

export async function getResources(): Promise<ResourceSection[]> {
  const sections = await sql`
    SELECT id, title FROM resource_sections ORDER BY sort_order, id
  `;
  const result: ResourceSection[] = [];

  for (const section of sections as { id: number; title: string }[]) {
    const links = await sql`
      SELECT label, href FROM resource_links
      WHERE section_id = ${section.id}
      ORDER BY sort_order, id
    `;
    result.push({
      title: section.title,
      links: (links as { label: string; href: string }[]).map((l) => ({
        label: l.label,
        href: l.href,
      })),
    });
  }
  return result;
}
