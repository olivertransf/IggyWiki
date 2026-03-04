import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IGGY WIKI",
  description: "A resource for St. Ignatius College Preparatory information",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const themeScript = `
(function() {
  var theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen touch-manipulation font-sans text-base antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header />
        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
        <footer className="shrink-0 w-full border-t border-neutral-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] py-6">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <a
              href="mailto:iggywikiapp@gmail.com"
              className="text-neutral-500 dark:text-neutral-400 hover:text-[#A71930] dark:hover:text-sky-400 text-sm transition-colors"
            >
              iggywikiapp@gmail.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
