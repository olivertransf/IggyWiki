"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types";
import { getTypeLabel, type LearningResource } from "@/lib/learning-resources-shared";

interface CoursesClientProps {
  courses: Course[];
}

function CourseResources({ courseTitle }: { courseTitle: string }) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/course-resources?course=${encodeURIComponent(courseTitle)}`)
      .then((r) => r.json())
      .then((data) => setResources(data.resources || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [courseTitle]);
  if (loading) return <p className="text-sm text-neutral-500 dark:text-neutral-400 py-2">Loading resources...</p>;
  if (resources.length === 0) return <p className="text-sm text-neutral-500 dark:text-neutral-400 py-2">No resources found.</p>;
  return (
    <ul className="space-y-0">
      {resources.map((r, i) => (
        <li key={i} className="border-b border-neutral-200 dark:border-neutral-700 last:border-0">
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-[#A71930] dark:hover:text-sky-400 transition-colors"
          >
            <span className="group-hover:underline">{r.label}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 shrink-0">
              {getTypeLabel(r.type)}
            </span>
            <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

function CourseRow({ course }: { course: Course }) {
  const [expanded, setExpanded] = useState(false);
  const isAP = course.title?.startsWith("AP ");
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {course.title}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {course.course_num && <span>{course.course_num}</span>}
            {course.subjects && <span>{course.subjects}</span>}
            {course.grade_levels && <span>{course.grade_levels}</span>}
            {course.type && <span>{course.type}</span>}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {isAP && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              className="text-sm font-medium text-[#A71930] dark:text-sky-400 hover:underline"
            >
              Resources
            </button>
          )}
          <svg
            className={`w-5 h-5 text-neutral-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-neutral-200 dark:border-neutral-700">
          <div className="pt-4 space-y-2 text-base">
            {course.url && (
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Syllabus: </span>
                <Link
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A71930] dark:text-sky-400 hover:underline"
                >
                  View course page
                </Link>
              </div>
            )}
            {course.length && (
              <div><span className="text-neutral-500 dark:text-neutral-400">Length: </span><span className="text-neutral-700 dark:text-neutral-300">{course.length}</span></div>
            )}
            {course.uccsu && (
              <div><span className="text-neutral-500 dark:text-neutral-400">UCCSU: </span><span className="text-neutral-700 dark:text-neutral-300">{course.uccsu}</span></div>
            )}
            {course.fulfillment && (
              <div><span className="text-neutral-500 dark:text-neutral-400">Fulfillment: </span><span className="text-neutral-700 dark:text-neutral-300">{course.fulfillment}</span></div>
            )}
            {course.prereq && (
              <div><span className="text-neutral-500 dark:text-neutral-400">Prereq: </span><span className="text-neutral-700 dark:text-neutral-300">{course.prereq}</span></div>
            )}
            {course.enroll_criteria && (
              <div><span className="text-neutral-500 dark:text-neutral-400">Enroll: </span><span className="text-neutral-700 dark:text-neutral-300">{course.enroll_criteria}</span></div>
            )}
            {course.description && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">{course.description}</p>
              </div>
            )}
            {isAP && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Textbooks, videos & practice</h3>
                <CourseResources courseTitle={course.title} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesClient({ courses: initialCourses }: CoursesClientProps) {
  const [titleFilter, setTitleFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [courseNumFilter, setCourseNumFilter] = useState("");

  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    initialCourses.forEach((course) => {
      if (course.subjects) {
        course.subjects.split(",").forEach((subject) => {
          subjects.add(subject.trim());
        });
      }
    });
    return Array.from(subjects).sort();
  }, [initialCourses]);

  const uniqueGradeLevels = useMemo(() => {
    const gradeLevels = new Set<string>();
    initialCourses.forEach((course) => {
      if (course.grade_levels) {
        course.grade_levels.split(",").forEach((level) => {
          gradeLevels.add(level.trim());
        });
      }
    });
    return Array.from(gradeLevels).sort();
  }, [initialCourses]);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    initialCourses.forEach((course) => {
      if (course.type) {
        course.type.split(",").forEach((type) => {
          types.add(type.trim());
        });
      }
    });
    return Array.from(types).sort();
  }, [initialCourses]);

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const matchesTitle =
        !titleFilter ||
        course.title.toLowerCase().includes(titleFilter.toLowerCase());
      const matchesSubject =
        !subjectFilter ||
        course.subjects.toLowerCase().includes(subjectFilter.toLowerCase());
      const matchesGradeLevel =
        !gradeLevelFilter ||
        course.grade_levels.toLowerCase().includes(gradeLevelFilter.toLowerCase());
      const matchesType =
        !typeFilter ||
        course.type.toLowerCase().includes(typeFilter.toLowerCase());
      const matchesCourseNum =
        !courseNumFilter ||
        course.course_num.toLowerCase().includes(courseNumFilter.toLowerCase());

      return (
        matchesTitle &&
        matchesSubject &&
        matchesGradeLevel &&
        matchesType &&
        matchesCourseNum
      );
    });
  }, [
    initialCourses,
    titleFilter,
    subjectFilter,
    gradeLevelFilter,
    typeFilter,
    courseNumFilter,
  ]);

  return (
    <div className="page-main">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">Courses</h1>

      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="title-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Title</label>
            <input
              id="title-filter"
              type="text"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Search..."
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="subject-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Subject</label>
            <select
              id="subject-filter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="input-base"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="grade-level-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Grade</label>
            <select
              id="grade-level-filter"
              value={gradeLevelFilter}
              onChange={(e) => setGradeLevelFilter(e.target.value)}
              className="input-base"
            >
              <option value="">All Grade Levels</option>
              {uniqueGradeLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Type</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-base"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="course-num-filter" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Course #</label>
            <input
              id="course-num-filter"
              type="text"
              value={courseNumFilter}
              onChange={(e) => setCourseNumFilter(e.target.value)}
              placeholder="Search..."
              className="input-base"
            />
          </div>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {filteredCourses.length} of {initialCourses.length} courses
        </div>
      </div>

      <div className="space-y-3">
        {filteredCourses.map((course, index) => (
          <CourseRow key={index} course={course} />
        ))}
      </div>
    </div>
  );
}
