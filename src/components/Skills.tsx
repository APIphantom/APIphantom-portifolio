import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { ArrowUpRight, Boxes } from 'lucide-react';
import { TechnologyBrandIcon } from '@/components/admin/TechnologyBrandIcon';
import { useTechnologies } from '@/lib/projects-store';
import { safeHref } from '@/lib/utils';

export function Skills() {
  const { items } = useTechnologies();
  const reduceMotion = useReducedMotion();

  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const technology of items) {
      const category = (technology.category?.trim() || 'Outras').toLocaleUpperCase('pt-BR');
      const list = map.get(category) ?? [];
      list.push(technology);
      map.set(category, list);
    }
    return Array.from(map.entries())
      .map(([title, technologies]) => ({
        title,
        technologies: [...technologies].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
      }))
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }, [items]);

  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden border-y border-border bg-card/10 px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="skills-title"
    >
      <div
        className="pointer-events-none absolute -right-40 top-12 size-[28rem] rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <header className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
              // 02 — Ferramentas de trabalho
            </p>
            <h2
              id="skills-title"
              className="display max-w-3xl text-4xl leading-[0.98] sm:text-5xl lg:text-7xl"
            >
              Tecnologia com <span className="text-primary">propósito.</span>
            </h2>
          </div>
          <div className="border-l border-primary/40 pl-5 text-sm leading-relaxed text-muted-foreground lg:mb-1">
            Minha stack, organizada por área para mostrar com clareza as ferramentas que aparecem
            nos meus projetos.
          </div>
        </header>

        <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:mt-12">
          <span className="inline-flex size-9 items-center justify-center rounded-lg border border-primary/35 bg-primary/5 text-primary">
            <Boxes className="size-4" aria-hidden="true" />
          </span>
          <span>
            <strong className="font-semibold text-foreground">{items.length}</strong>{' '}
            {items.length === 1 ? 'tecnologia cadastrada' : 'tecnologias cadastradas'}
          </span>
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span>
            {groups.length} {groups.length === 1 ? 'categoria' : 'categorias'}
          </span>
        </div>

        {groups.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group, groupIndex) => (
              <motion.article
                key={group.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: groupIndex * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/50 sm:p-6"
              >
                <div
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-primary/70">
                      {String(groupIndex + 1).padStart(2, '0')} / STACK
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {group.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                    {String(group.technologies.length).padStart(2, '0')}
                  </span>
                </div>

                <ul className="flex flex-wrap gap-2" aria-label={`Tecnologias de ${group.title}`}>
                  {group.technologies.map((technology) => {
                    const href = safeHref(technology.url);
                    const item = (
                      <>
                        <TechnologyBrandIcon
                          name={technology.name}
                          icon={technology.icon}
                          className="size-5 shrink-0"
                        />
                        <span>{technology.name}</span>
                        {href ? (
                          <ArrowUpRight
                            className="size-3 text-muted-foreground"
                            aria-hidden="true"
                          />
                        ) : null}
                      </>
                    );

                    return (
                      <li key={technology.id}>
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noreferrer' : undefined}
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-xs text-foreground/90 transition-colors hover:border-primary/55 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            {item}
                          </a>
                        ) : (
                          <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-xs text-foreground/90">
                            {item}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/30 p-8 text-sm text-muted-foreground">
            As tecnologias cadastradas aparecerão aqui organizadas por categoria.
          </div>
        )}
      </div>
    </section>
  );
}
