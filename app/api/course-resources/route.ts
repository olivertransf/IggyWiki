import { NextRequest } from "next/server";
import { findResourcesForCourse, sortResourcesByType } from "@/lib/learning-resources";

export async function GET(request: NextRequest) {
  const course = request.nextUrl.searchParams.get("course");
  if (!course) {
    return Response.json({ resources: [] });
  }
  const resources = await findResourcesForCourse(course);
  return Response.json({ resources: sortResourcesByType(resources) });
}
