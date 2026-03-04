import { sql } from "@/lib/db";
import type { LearningResource } from "./learning-resources-shared";

function toResourceType(s: string): LearningResource["type"] {
  if (["textbook", "video", "practice", "reference", "other"].includes(s)) return s as LearningResource["type"];
  return "other";
}

export async function findResourcesForCourse(courseTitle: string): Promise<LearningResource[]> {
  if (!courseTitle || !courseTitle.trim()) return [];
  const title = courseTitle.trim();
  const rows = await sql`
    SELECT label, href, resource_type
    FROM course_learning_resources
    WHERE course_title = ${title}
    ORDER BY sort_order, id
  `;
  return (rows as { label: string; href: string; resource_type: string }[]).map((r) => ({
    label: r.label,
    href: r.href,
    type: toResourceType(r.resource_type),
  }));
}

export { sortResourcesByType } from "./learning-resources-shared";
