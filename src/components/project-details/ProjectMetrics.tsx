import type { MetaPill } from "./types";

type Props = {
  metrics: MetaPill[];
};

export function ProjectMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
      {metrics.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border/70 bg-background/40 px-3 py-2 hover:border-primary/45 transition-colors"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
          <div className="text-sm font-semibold mt-1 truncate">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
