'use client';

export default function Footer() {
  return (
    <footer className="text-center text-gray-600 py-4">
      &copy; {new Date().getFullYear()}{' '}
      <a className="font-bold" href="http://github.com/faha1999">
        faha's
      </a>{' '}
      Photo Card Studio. All rights reserved.
    </footer>
  );
}
