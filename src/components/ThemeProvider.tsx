'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemePreference = 'light' | 'dark' | 'black' | 'system';
export type ResolvedTheme = 'light' | 'dark' | 'black';

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'photo-card-theme';

const getSystemTheme = (): Exclude<ResolvedTheme, 'black'> =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  const applyTheme = useCallback(
    (next: ThemePreference, persist = true) => {
      const root = document.documentElement;
      const system = getSystemTheme();
      const actual =
        next === 'system' ? (system as ResolvedTheme) : (next as ResolvedTheme);

      root.classList.remove('light', 'dark', 'black');
      root.classList.add(actual);
      if (actual === 'dark' || actual === 'black') {
        root.classList.add('dark');
      }

      if (actual === 'black') {
        root.classList.add('black');
      }

      root.dataset.theme = actual;
      setResolvedTheme(actual);

      if (persist) {
        if (next === 'system') {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, next);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    const initial = stored ?? 'system';
    setThemeState(initial);
    applyTheme(initial, false);
  }, [applyTheme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (theme === 'system') {
        applyTheme('system', false);
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [applyTheme, theme]);

  const handleSetTheme = useCallback(
    (next: ThemePreference) => {
      setThemeState(next);
      applyTheme(next);
    },
    [applyTheme],
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: handleSetTheme,
    }),
    [handleSetTheme, resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
