import { motion, useReducedMotion } from "framer-motion";
import type { DetailItem } from "./types";

type Props = {
  timeline: DetailItem[];
  cards: Array<DetailItem & { section: string }>;
};

export function DevelopmentSection({ timeline, cards }: Props) {
  const reducedMotion = useReducedMotion();
  const visibleTimeline = timeline.slice(0, 5);
  const timelineProgress = visibleTimeline.length
    ? Math.min(100, Math.max(20, Math.round((visibleTimeline.length / 5) * 100)))
    : 20;

  return (
    <section id="development" className="px-6 lg:px-10 mt-12 scroll-mt-24 ">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="relative overflow-hidden mx-auto max-w-7xl rounded-3xl border border-bg backdrop-blur-xl p-6 md:p-8"
      >
        <div className="relative flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4">// 07 — Desenvolvimento</span>
        </div>
          <h2 className="flex-1 display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl mb-6">
            <span className="text-primary text-glow">Execução</span> e <span className="text-primary text-glow">arquitetura</span>.
          </h2>

        <div className="relative mb-8 rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.08] to-background/55 p-4 md:p-5">
          <div className="md:hidden space-y-3">
            {visibleTimeline.map((step, i) => (
              <motion.div
                key={`mobile-${step.id}`}
                initial={{ opacity: 0, x: -14, filter: "blur(2px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: reducedMotion ? 0.01 : 0.4, delay: i * 0.06 }}
                className="relative pl-6 pr-3 py-3 rounded-xl border border-primary/35 bg-background/70"
              >
                <span className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-primary70 via-primary/40 to-transparent" />
                <span className="absolute left-[5px] top-4 size-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(255,212,0,0.13)]" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">Etapa {String(i + 1).padStart(2, "0")}</div>
                <div className="text-sm font-semibold mb-1.5">{step.title}a</div>
                <p className="text-xs text-foreground/70 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className=" hidden md:block relative w-full overflow-y-hidden">
            <div className="min-w-[820px] md:min-w-0 grid grid-cols-4 gap-3 md:gap-4">
            {visibleTimeline.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18, filter: "blur(3px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: reducedMotion ? 0.01 : 0.45, delay: i * 0.08 }}
                className="relative min-w-0 rounded-xl border border-primary/45 bg-background/65 p-3.5 md:p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-primary">Etapa {String(i + 1).padStart(2, "0")}</div>
                  <span className="text-[10px] text-primary/70">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="text-sm font-semibold mb-2 line-clamp-2">{step.title}</div>
                <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">{step.description}</p>
                <span className="hidden md:block absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(255,212,0,0.13)]" />
                {i < visibleTimeline.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 h-px w-4 bg-primary/55" />
                )}
              </motion.div>
            ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reducedMotion ? 0.01 : 0.42, delay: i * 0.05 }}
              className="group relative min-w-0 overflow-hidden rounded-2xl border border-primary/35 bg-gradient-to-b from-primary/[0.08] via-[#0b0b08]/90 to-[#070706]/95 p-4 md:p-5 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-primary/70 hover:shadow-[0_20px_55px_rgba(255,212,0,0.16)] transition-all"
              data-cursor="details"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_bottom,transparent_0%,rgba(255,212,0,0.11)_40%,transparent_100%)]" />

              <div className="relative flex items-center justify-between mb-3 gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/35 bg-primary/[0.1] text-[10px] uppercase tracking-[0.22em] text-primary">
                  <span className="size-1.5 rounded-full bg-primary" /> {card.section}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/75">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="text-base md:text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line break-words">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
