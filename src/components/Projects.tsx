import { useMemo, useState, useCallback } from "react";
import { CATEGORIES, type Project, type ProjectCategory } from "@/lib/projects-store";
import { ProjectCard } from "./ProjectCard";

type Filter = "all" | ProjectCategory;

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const onFilter = useCallback((v: Filter) => setFilter(v), []);

  return (
    <section id="projetos" className="relative py-32 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              // 03 — Drops
            </div>
            <h2 className="display text-5xl md:text-7xl">
              Projetos <br />
              <span className="text-primary">selecionados.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Edições limitadas. Cada projeto é um experimento entre código, marca e cultura.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {[{ value: "all" as const, label: "Todos" }, ...CATEGORIES].map((c) => (
            <button
              key={c.value}
              onClick={() => onFilter(c.value as Filter)}
              data-cursor="hover"
              className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                filter === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">Nenhum drop nessa categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
