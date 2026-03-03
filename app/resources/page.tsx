import Link from "next/link";
import { getResources } from "@/lib/resources";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const sections = await getResources();

  return (
    <main className="page-main">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Resources</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Useful links from St. Ignatius. Most require SI login.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title} className="card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              {section.title}
            </h2>
            <ul className="space-y-0.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-[#A71930] dark:hover:text-sky-400 transition-colors"
                  >
                    <span className="group-hover:underline">{link.label}</span>
                    <svg className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
