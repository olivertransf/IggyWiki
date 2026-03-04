import { getFaq } from "@/lib/faq";
import HandbookClient from "./HandbookClient";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const topics = await getFaq();

  return (
    <main className="page-main">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">FAQ</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Common questions about academics, attendance, campus life, and more.
        </p>
      </div>

      <HandbookClient topics={topics} />
    </main>
  );
}
