import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from './Footer'; // Client component for footer with dynamic year
import { Analytics } from '@vercel/analytics/next';

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
    <html lang="en">
      <body
        className={`bg-gray-50 text-gray-900 font-sans bg-gradient-to-tr from-indigo-50 via-white to-pink-50 min-h-screen`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <img
                src="/templates/logo.png"
                alt="SylChina Express Logo"
                className="h-12 w-auto md:h-20 scale-130"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-green-950 whitespace-nowrap">
                Photo Card
                <span className="text-blue-800/100 dark:text-sky-800/100 ml-2">
                  Studio
                </span>
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
