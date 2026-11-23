import { useEffect, useState } from 'react';

export type ThemeKey = 'neo-yellow' | 'acid-lime' | 'tokyo-night' | 'monochrome';

const KEY = 'stvx.theme';
const THEME_CHANGE_EVENT = 'stvx:theme-change';

export const THEMES: { key: ThemeKey; label: string; swatch: string }[] = [
  { key: 'neo-yellow', label: 'Neo Yellow', swatch: '#FFD400' },
  { key: 'acid-lime', label: 'Acid Lime', swatch: '#CCFF00' },
  { key: 'tokyo-night', label: 'Tokyo Night', swatch: '#FF4ECD' },
  { key: 'monochrome', label: 'Monochrome', swatch: '#FFFFFF' },
];

function apply(t: ThemeKey) {
  const root = document.documentElement;
  if (t === 'neo-yellow') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t);
}

function isThemeKey(value: string | null): value is ThemeKey {
  return THEMES.some((theme) => theme.key === value);
}

function readTheme(): ThemeKey {
  try {
    const saved = localStorage.getItem(KEY);
    return isThemeKey(saved) ? saved : 'neo-yellow';
  } catch {
    return 'neo-yellow';
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeKey>('neo-yellow');

  useEffect(() => {
    const syncTheme = () => {
      const t = readTheme();
      setTheme(t);
      apply(t);
    };

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.addEventListener('storage', syncTheme);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  const set = (t: ThemeKey) => {
    setTheme(t);
    apply(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return { theme, setTheme: set };
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 backdrop-blur px-1.5 py-1">
      {THEMES.map((t) => (
        <button
          key={t.key}
          onClick={() => setTheme(t.key)}
          aria-label={t.label}
          title={t.label}
          data-cursor="hover"
          aria-pressed={theme === t.key}
          className={`size-5 rounded-full border transition-all ${
            theme === t.key ? 'border-foreground scale-110' : 'border-border hover:scale-110'
          }`}
          style={{ background: t.swatch }}
        />
      ))}
    </div>
  );
}
