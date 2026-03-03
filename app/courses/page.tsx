import { getCourses } from "@/lib/courses";
import CoursesClient from "./CoursesClient";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CoursesClient courses={courses} />;
}
