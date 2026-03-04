"use client";

import { useState } from "react";
import { FaqTopic } from "@/lib/faq";

interface HandbookClientProps {
  topics: FaqTopic[];
}

const TABS = [
  { id: "handbook", label: "Handbook" },
  { id: "student-life", label: "Student Life" },
] as const;

export default function HandbookClient({ topics }: HandbookClientProps) {
  const [activeTab, setActiveTab] = useState<"handbook" | "student-life">("handbook");

  return (
    <div>
      <div className="mb-6 border-b border-neutral-200 dark:border-zinc-700">
        <nav className="flex gap-1" aria-label="FAQ sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium -mb-px border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#A71930] dark:border-sky-500 text-[#A71930] dark:text-sky-400"
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "handbook" && (
        <div className="space-y-10">
          {topics.map((topic) => (
            <section key={topic.title} className="card p-6 sm:p-8">
              <h2 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-6 pb-2 border-b border-neutral-200 dark:border-zinc-600">
                {topic.title}
              </h2>
              <div className="space-y-6">
                {topic.items.map((item) => (
                  <div key={item.question}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-start gap-3 py-2 text-base font-medium text-neutral-900 dark:text-neutral-100 hover:text-[#A71930] dark:hover:text-sky-400 transition-colors">
                        <span className="flex-1 min-w-0">{item.question}</span>
                        <span className="shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <div className="mt-3 pl-4 py-3 border-l-2 border-neutral-200 dark:border-zinc-600">
                        <p className="text-base text-neutral-700 dark:text-neutral-300 leading-[1.7]">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === "student-life" && (
        <div className="card p-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">Coming soon.</p>
        </div>
      )}
    </div>
  );
}
