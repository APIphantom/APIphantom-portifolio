import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SectionNavItem, SectionId } from "./types";

type Props = {
  items: SectionNavItem[];
};

export function SidebarNavigation({ items }: Props) {
  const [active, setActive] = useState<SectionId>("overview");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target?.id) {
          setActive(top.target.id as SectionId);
        }
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.2, 0.4, 0.6] },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      <aside className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 w-52 rounded-2xl border border-border/70 bg-card/45 backdrop-blur-xl p-3">
        <div className="text-[10px] uppercase tracking-[0.32em] text-primary px-2 pb-1">Navegacao</div>
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-cursor="open"
              className={`relative flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] uppercase tracking-[0.2em] transition-all ${
                isActive
                  ? "border-primary/40 text-primary bg-primary/10"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px]">{item.n}</span>
              <span>{item.label}</span>
              <item.icon className={`ml-auto size-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  transition={{ duration: reducedMotion ? 0.01 : 0.25 }}
                  className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,212,0,0.8)]"
                />
              )}
            </a>
          );
        })}
      </aside>

      <nav className="xl:hidden sticky top-16 z-30 bg-background/85 backdrop-blur border-b border-border overflow-x-auto">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {item.n} {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
