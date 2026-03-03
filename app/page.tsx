import ScheduleIframe from "@/components/ScheduleIframe";
import { getMenuItems } from "@/lib/menu";

export const dynamic = "force-dynamic";

export default async function Home() {
  let menuItems: Awaited<ReturnType<typeof getMenuItems>> = [];
  let menuError: string | null = null;
  try {
    menuItems = await getMenuItems();
  } catch (e) {
    menuError = "Error loading menu from database. Run the scraper and sync first.";
  }

  return (
    <main className="page-main">
      <section className="mb-14">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">IGGY WIKI</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">St. Ignatius College Preparatory</p>
      </section>

      <section id="announcements" className="mb-10">
        <h2 className="section-title">Announcements</h2>
        <div className="card p-5 min-h-[72px]"></div>
      </section>

      <section id="menu" className="mb-10">
        <h2 className="section-title">Lunch Menu</h2>
        {menuError ? (
          <div className="card p-5 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed">{menuError}</p>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              Run: <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs">python scripts/scrape_menu.py && npm run db:sync-menu</code>
            </p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="card p-5">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">No menu items found.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {menuItems.map((item) => (
              <div key={`${item.day}-${item.date}`} className="card p-4">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{item.day}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">{item.date}</span>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">{item.menu}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="schedule" className="flex flex-col min-h-[280px] sm:min-h-[420px]">
        <h2 className="section-title">Bell Schedule</h2>
        <div className="flex-1 min-h-[260px] sm:min-h-[400px] card overflow-hidden">
          <ScheduleIframe />
        </div>
      </section>
    </main>
  );
}
