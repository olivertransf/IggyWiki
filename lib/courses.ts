import { sql } from "@/lib/db";
import type { Course } from "@/types";

export async function getCourses(): Promise<Course[]> {
  const rows = await sql`
    SELECT title, url, course_num, subjects, grade_levels, length, type, uccsu,
           prereq, enroll_criteria, fulfillment, description
    FROM courses
    ORDER BY title
  `;
  return rows as Course[];
}
