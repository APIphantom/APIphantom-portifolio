import { Target } from "lucide-react";

type Props = {
  title: string;
  text: string;
};

export function ObjectivesSection({ title, text }: Props) {
  return (
    <article className="group rounded-2xl border border-border/70 bg-background/50 p-5 hover:border-primary/55 hover:-translate-y-0.5 hover:scale-[1.02] transition-all">
      <div className="flex items-center gap-2 text-primary mb-3">
        <Target className="size-4" />
        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{text}</p>
      <button className="mt-4 text-xs uppercase tracking-[0.2em] text-primary hover:text-primary/80">Saiba mais</button>
    </article>
  );
}
