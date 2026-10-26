import { useMemo, useState } from 'react';
import { CATEGORIES, type Project, type ProjectCategory } from '@/lib/projects-store';
import { ProjectCard } from './ProjectCard';

type Filter = 'all' | ProjectCategory;

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <section
      id="projetos"
      className="relative scroll-mt-24 border-y border-border bg-card/10 px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
              // 04 — Projetos em destaque
            </p>
            <h2 className="display max-w-3xl text-4xl leading-[0.98] sm:text-5xl lg:text-7xl">
              Trabalho em <span className="text-primary">contexto.</span>
            </h2>
          </div>
          <p className="max-w-md border-l border-primary/40 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
            Explore os projetos, as tecnologias usadas e o estudo de caso de cada trabalho para
            conhecer as decisões por trás da interface.
          </p>
        </header>

        <div className="mt-9 flex flex-col gap-5 border-y border-border py-5 sm:mt-11 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar projetos por categoria"
          >
            {[{ value: 'all' as const, label: 'Todos' }, ...CATEGORIES].map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value as Filter)}
                type="button"
                aria-pressed={filter === category.value}
                aria-controls="project-results"
                className={`min-h-10 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  filter === category.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/60 hover:text-foreground'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            <span className="font-mono text-primary">
              {String(filtered.length).padStart(2, '0')}
            </span>{' '}
            {filtered.length === 1 ? 'projeto nesta seleção' : 'projetos nesta seleção'}
          </p>
        </div>

        <div
          id="project-results"
          className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5"
        >
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">Nenhum projeto nesta categoria ainda.</p>
          </div>
        )}
      </div>
    </section>
  );
}
