import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useStoryline, STORYLINE_ICONS, type StorylineItem } from "@/lib/storyline-store";

interface Props {
  items?: StorylineItem[];
}

export function Storyline({ items: itemsProp }: Props) {
  const { items: stored } = useStoryline();
  const items = itemsProp ?? stored;

  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sorted = useMemo(
    () => [...items].filter((i) => i.active).sort((a, b) => a.order - b.order),
    [items],
  );

  const { scrollYProgress } = useScroll(
    mounted
      ? {
          target: containerRef,
          offset: ["start start", "end end"],
        }
      : undefined,
  );

  const xRaw = useTransform(scrollYProgress, [0, 1], ["2%", "-82%"]);
  const x = useSpring(xRaw, { stiffness: 80, damping: 22, mass: 0.4 });

  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const progressPct = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (sorted.length === 0) return;
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.round(v * (sorted.length - 1))));
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  return (
    <section
      id="storyline"
      ref={containerRef}
      className="relative bg-background"
      style={{ height: `${Math.max(120, sorted.length * 60)}vh` }}
      aria-label="Storyline — Minha evolução através do código"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="px-6 lg:px-10 pt-20 pb-8 mx-auto max-w-7xl w-full">
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-[0.5em] text-primary mb-4">
                // 05 — Storyline
              </div>
              <h2 className="display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-3xl">
                Minha evolução
                <br />
                através do <span className="text-primary text-glow">código.</span>
              </h2>
              <p className="mt-6 max-w-xl text-muted-foreground">
                Cada projeto, tecnologia e aprendizado construiu a forma como desenvolvo interfaces
                hoje.
              </p>
            </div>

            <div className="flex items-center gap-4 min-w-[220px]">
              <motion.span className="font-mono text-sm text-primary tabular-nums">
                {progressPct}
              </motion.span>
              <div className="relative h-[2px] flex-1 bg-border overflow-hidden rounded-full">
                <motion.div
                  style={{ scaleX: progressScale, transformOrigin: "left" }}
                  className="absolute inset-0 bg-primary glow-neon"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 hidden md:flex items-center gap-2">
            {sorted.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2 flex-1 last:flex-none">
                <motion.span
                  animate={{
                    scale: i === activeIdx ? 1.4 : 1,
                    backgroundColor: i <= activeIdx ? "var(--primary)" : "var(--border)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="size-2 rounded-full"
                />
                {i < sorted.length - 1 && (
                  <div className="flex-1 h-px bg-border relative overflow-hidden">
                    <motion.div
                      animate={{ scaleX: i < activeIdx ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: "left" }}
                      className="absolute inset-0 bg-primary/60"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 relative flex items-center">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-8 px-6 lg:px-10 will-change-transform"
          >
            {sorted.map((item, i) => {
              const Icon = STORYLINE_ICONS[item.icon] ?? Sparkles;
              const isActive = i === activeIdx;
              return (
                <motion.article
                  key={item.id}
                  animate={{
                    scale: isActive ? 1.01 : 0.94,
                    opacity: isActive ? 1 : 0.45,
                    filter: isActive ? "blur(0px)" : "blur(2px)",
                  }}
                  whileHover={{ scale: isActive ? 1.02 : 0.97 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative shrink-0 w-[84vw] sm:w-[60vw] md:w-[44vw] lg:w-[30vw] xl:w-[26vw] 2xl:w-[22vw] h-[360px] sm:h-[390px] md:h-[420px] rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col overflow-hidden group"
                  style={{
                    boxShadow: isActive
                      ? "0 0 0 1px var(--primary), 0 0 60px rgba(var(--glow-color), 0.18)"
                      : undefined,
                  }}
                  data-cursor="hover"
                >
                  <motion.div
                    aria-hidden
                    animate={{ opacity: isActive ? 1 : 0 }}
                    className="absolute -top-20 -right-20 size-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"
                  />

                  <div className="relative flex items-start justify-between shrink-0">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                        // {String(item.order).padStart(2, "0")}
                      </div>
                      <div className="display text-4xl md:text-5xl mt-2 text-primary">
                        {item.year}
                      </div>
                    </div>
                    <div className="size-12 rounded-xl border border-border flex items-center justify-center bg-background/50 group-hover:border-primary transition-colors">
                      <Icon className="size-5 text-primary" />
                    </div>
                  </div>

                  <div className="relative mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
                    {item.badge && (
                      <span className="inline-block text-[10px] uppercase tracking-[0.3em] px-2 py-1 border border-primary/40 text-primary rounded-full mb-4">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="display text-2xl md:text-3xl leading-tight">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-primary/80 mt-1">{item.subtitle}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <motion.div
                    aria-hidden
                    animate={{ scaleX: isActive ? 1 : 0.2 }}
                    style={{ transformOrigin: "left" }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                  />
                </motion.article>
              );
            })}
            {sorted.length === 0 && (
              <div className="w-full rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
                Nenhum marco da timeline cadastrado.
              </div>
            )}
          </motion.div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        <div className="px-6 lg:px-10 pb-6 mx-auto max-w-7xl w-full flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span>Scroll ↓ para avançar</span>
          <span className="font-mono">
            {String(Math.min(activeIdx + 1, Math.max(sorted.length, 1))).padStart(2, "0")} /{" "}
            {String(Math.max(sorted.length, 1)).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
