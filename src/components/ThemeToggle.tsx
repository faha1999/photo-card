'use client';

import { Monitor } from 'lucide-react';
import { ThemePreference, useTheme } from './ThemeProvider';

const options: Array<{
  value: ThemePreference;
  label: string;
}> = [
  {
    value: 'system',
    label: 'System',
  },
  {
    value: 'light',
    label: 'Light',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'black',
    label: 'Black',
  },
];

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Theme
        </span>
        <span className="text-xs text-muted">
          Active: {resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1)}
        </span>
      </div>

      <label className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold text-muted uppercase sm:hidden">
          <Monitor className="h-3.5 w-3.5" />
          Theme
        </span>
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value as ThemePreference)}
          className="input-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 bg-transparent min-w-[9rem]"
          aria-label="Select theme preference">
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
