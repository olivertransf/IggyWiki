"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/faculty", label: "Faculty" },
  { href: "/courses", label: "Courses" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="shrink-0 w-full bg-white dark:bg-zinc-900 border-b border-neutral-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-neutral-900 dark:text-neutral-50 hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px] flex items-center"
          onClick={() => setOpen(false)}
        >
          <h1 className="text-lg font-semibold tracking-tight">IGGY WIKI</h1>
        </Link>
        <div className="flex items-center gap-2">
        <nav className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 rounded-md hover:bg-neutral-100 dark:hover:bg-zinc-800 active:bg-neutral-200 dark:active:bg-zinc-700"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Menu</span>
            <svg
              className="w-6 h-6 text-neutral-600 dark:text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <ul
            id="nav-menu"
            className={`md:flex md:gap-6 md:items-center md:static md:flex-row md:py-0 md:opacity-100 md:translate-y-0 fixed top-[53px] right-0 left-0 bg-white dark:bg-zinc-900 md:bg-transparent border-b border-neutral-200 dark:border-zinc-800 md:border-0 z-50 flex flex-col transition-all duration-200 ${
              open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 pointer-events-none -translate-y-2 md:visible md:opacity-100 md:pointer-events-auto md:translate-y-0"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3.5 px-5 md:py-0 md:px-0 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 md:inline transition-colors min-h-[44px] md:min-h-0 flex items-center active:bg-neutral-100 dark:active:bg-zinc-800 md:active:bg-transparent"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 top-[53px] bg-black/20 dark:bg-black/40 z-40 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
