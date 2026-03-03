import { getFaculty } from "@/lib/faculty";
import FacultyClient from "./FacultyClient";

export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  const teachers = await getFaculty();
  return <FacultyClient teachers={teachers} />;
}
