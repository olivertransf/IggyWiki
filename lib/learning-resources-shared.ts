export interface LearningResource {
  label: string;
  href: string;
  type: "textbook" | "video" | "practice" | "reference" | "other";
}

const typeOrder: LearningResource["type"][] = ["textbook", "video", "practice", "reference", "other"];
const typeLabels: Record<LearningResource["type"], string> = {
  textbook: "Textbook",
  video: "Video",
  practice: "Practice",
  reference: "Reference",
  other: "Other",
};

export function getTypeLabel(type: LearningResource["type"]): string {
  return typeLabels[type];
}

export function sortResourcesByType(resources: LearningResource[]): LearningResource[] {
  return [...resources].sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));
}

export function getCoursesGroupedBySubject(
  courses: { title: string; subjects: string; course_num?: string }[],
  apOnly = false
): { subject: string; courses: { title: string; course_num?: string; subjects: string }[] }[] {
  const filtered = apOnly ? courses.filter((c) => c.title?.startsWith("AP ")) : courses;
  const bySubject = new Map<string, { title: string; course_num?: string; subjects: string }[]>();
  for (const course of filtered) {
    const subjects = (course.subjects || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const subject = subjects[0] || "Other";
    if (!bySubject.has(subject)) bySubject.set(subject, []);
    bySubject.get(subject)!.push({
      title: course.title,
      course_num: course.course_num,
      subjects: course.subjects,
    });
  }
  return Array.from(bySubject.entries())
    .map(([subject, courses]) => ({ subject, courses }))
    .sort((a, b) => a.subject.localeCompare(b.subject));
}
