import { useEffect, useState } from "react";

export type ThemeKey = "neo-yellow" | "acid-lime" | "tokyo-night" | "monochrome";

const KEY = "stvx.theme";

export const THEMES: { key: ThemeKey; label: string; swatch: string }[] = [
  { key: "neo-yellow", label: "Neo Yellow", swatch: "#FFD400" },
  { key: "acid-lime", label: "Acid Lime", swatch: "#CCFF00" },
  { key: "tokyo-night", label: "Tokyo Night", swatch: "#FF4ECD" },
  { key: "monochrome", label: "Monochrome", swatch: "#FFFFFF" },
];

function apply(t: ThemeKey) {
  const root = document.documentElement;
  if (t === "neo-yellow") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", t);
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeKey>("neo-yellow");

  useEffect(() => {
    try {
      const t = (localStorage.getItem(KEY) as ThemeKey | null) ?? "neo-yellow";
      setTheme(t);
      apply(t);
    } catch {}
  }, []);

  const set = (t: ThemeKey) => {
    setTheme(t);
    apply(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
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
          className={`size-5 rounded-full border transition-all ${
            theme === t.key ? "border-foreground scale-110" : "border-border hover:scale-110"
          }`}
          style={{ background: t.swatch }}
        />
      ))}
    </div>
  );
}
