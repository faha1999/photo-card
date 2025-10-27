'use client';

export default function Footer() {
  return (
    <footer className="py-4 text-center text-gray-600 transition-colors dark:text-gray-400">
      &copy; {new Date().getFullYear()}{' '}
      <a className="font-bold" href="http://github.com/faha1999">
        faha's
      </a>{' '}
      Photo Card Studio. All rights reserved.
    </footer>
  );
}
