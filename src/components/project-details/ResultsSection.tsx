import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import type { MetricItem } from "./types";

type Props = {
  items: MetricItem[];
};

export function ResultsSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="results" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="grid items-center gap-3 mb-8">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4">// 09 - Resultados</span>
          <p className="flex-1 display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl mb-6"><span className="text-primary text-glow">Resultados</span> e <span className="text-primary text-glow">impacto</span> do projeto.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 3).map((item, i) => (
            <motion.article
              key={`${item.label}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-primary/35 bg-primary/[0.06] p-5 hover:border-primary/60 hover:shadow-[0_20px_55px_rgba(255,212,0,0.15)] transition-all"
            >
              <div className="display text-5xl text-primary">
                {item.value !== null ? (
                  <AnimatedCounter to={item.value} prefix={item.prefix} suffix={item.suffix} />
                ) : (
                  `${item.prefix}${item.raw}${item.suffix}`
                )}
              </div>
              <div className="text-sm uppercase tracking-[0.2em] mt-2">{item.label}</div>
              {item.description && <p className="text-sm text-muted-foreground mt-2">{item.description}</p>}
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
