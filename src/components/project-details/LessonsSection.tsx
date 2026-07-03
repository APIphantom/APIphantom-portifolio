import { motion } from "framer-motion";
import { Lightbulb, Rocket, Sparkles } from "lucide-react";
import type { DetailItem } from "./types";

type Props = {
  items: DetailItem[];
};

const icons = [Lightbulb, Sparkles, Rocket];

export function LessonsSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="learnings" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="grid items-center gap-3 mb-8">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4">// 11 - Aprendizados</span>
          <p className="display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl mb-6"><span className="text-primary text-glow">Aprendizados</span> do projeto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.slice(0, 3).map((item, i) => {
            const Icon = icons[i] ?? Sparkles;
            return (
              <article
                key={item.id}
                className="group rounded-2xl border border-border/70 bg-background/45 p-4 hover:border-primary/60 hover:shadow-[0_18px_44px_rgba(255,212,0,0.12)] transition-all"
              >
                <div className="inline-flex items-center gap-2 text-primary mb-3">
                  <Icon className="size-4" />
                  <span className="text-[10px] uppercase tracking-[0.25em]">Insight</span>
                </div>
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
