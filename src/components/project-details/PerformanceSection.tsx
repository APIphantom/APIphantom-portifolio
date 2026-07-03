import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import type { MetricItem } from "./types";

type Props = {
  items: MetricItem[];
};

function Circle({ value }: { value: number }) {
  const size = 86;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeOpacity="0.2" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
      />
    </svg>
  );
}

export function PerformanceSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="performance" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="grid gap-3 mb-8">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4"> // 08 - Performance</span>
          <p className="flex-1 display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl mb-6"><span className="text-primary text-glow">Monitoramento</span> e análise de <span className="text-primary text-glow">performance</span>.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 4).map((item, i) => (
            <motion.article
              key={`${item.label}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-primary/35 bg-primary/[0.06] p-4 text-center"
            >
              <div className="text-primary flex justify-center mb-2"><Circle value={item.value ?? 0} /></div>
              <div className="display text-3xl text-primary">
                {item.value !== null ? (
                  <AnimatedCounter to={item.value} prefix={item.prefix} suffix={item.suffix} />
                ) : (
                  `${item.prefix}${item.raw}${item.suffix}`
                )}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2 inline-flex items-center gap-1">
                <Gauge className="size-3" /> {item.label}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
