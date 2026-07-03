import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTechnologies } from "@/lib/projects-store";

export function Skills() {
  const { items } = useTechnologies();

  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const tech of items) {
      const category = (tech.category?.trim() || "Outras").toUpperCase();
      const list = map.get(category) ?? [];
      list.push(tech);
      map.set(category, list);
    }
    return Array.from(map.entries())
      .map(([title, technologies]) => ({
        title,
        technologies: [...technologies].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [items]);

  return (
    <section
      id="skills"
      className="relative py-32 px-6 lg:px-10 border-y border-border bg-gradient-to-b from-background via-card/30 to-background"
      aria-labelledby="skills-title"
    >
      <div className="absolute inset-0 -z-10 scanlines opacity-30" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              // 02 — Stack
            </div>
            <h2 id="skills-title" className="display text-5xl md:text-7xl">
              Meu <span className="text-primary">arsenal</span>
              <br />
              técnico.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Tecnologias carregadas diretamente do painel admin no Supabase, agrupadas por categoria.
          </p>
        </div>

        <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border text-xs font-mono">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-destructive/70" />
            <span className="size-2 rounded-full bg-primary/70" />
            <span className="size-2 rounded-full bg-primary" />
          </span>
          <span className="text-muted-foreground">~ adriano@portfolio — bash —</span>
          <span className="text-primary">stack --list</span>
          <span className="inline-block w-1.5 h-3 bg-primary animate-blink" aria-hidden="true" />
        </div>

        <div className="space-y-12">
          {groups.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                  {cat.title}
                  <span className="text-primary">.</span>
                </h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {cat.technologies.length} tecnologias
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {cat.technologies.map((s, i) => {
                  return (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-6 rounded-2xl border border-border bg-card relative overflow-hidden hover:border-primary/60 hover:glow-neon transition-all"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                      <div className="relative flex items-baseline justify-between mb-3 gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground tabular-nums font-mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xl font-bold tracking-tight">{s.name}</span>
                        </div>
                        {s.color && (
                          <span
                            className="size-3 rounded-full border border-border"
                            style={{ backgroundColor: s.color }}
                            aria-label={`Cor ${s.color}`}
                          />
                        )}
                      </div>
                      <div className="relative flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {cat.title}
                        </span>
                        {s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] uppercase tracking-widest text-primary hover:underline"
                          >
                            Referencia
                          </a>
                        )}
                      </div>
                      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.1 + i * 0.04, ease: "easeOut" }}
                          className="h-full bg-primary group-hover:shadow-[0_0_20px_rgba(var(--glow-color),0.7)] transition-shadow"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
              Nenhuma tecnologia cadastrada no painel admin.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
