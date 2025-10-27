import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from './Footer'; // Client component for footer with dynamic year
import { Analytics } from '@vercel/analytics/next';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider } from '../components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Photo Card Generator',
  description: 'Create photo cards with AI-generated post content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-transparent text-base transition-colors duration-300">
        <ThemeProvider>
          <header
            className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-slate-900/60"
            style={{
              backgroundColor: 'var(--surface)',
              borderBottom: `1px solid var(--border)`,
            }}>
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <img
                  src="/templates/logo.png"
                  alt="SylChina Express Logo"
                  className="h-12 w-auto md:h-16"
                />
                <h1 className="text-xl font-bold text-green-950 dark:text-emerald-200 sm:text-2xl">
                  Photo Card
                  <span className="ml-2 text-blue-800 dark:text-sky-300">
                    Studio
                  </span>
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl px-4 py-8">
            {children}
          </main>
          <Analytics />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
