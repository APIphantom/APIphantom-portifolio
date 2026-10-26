import { memo, useCallback, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, ExternalLink, ImageIcon, ArrowUpRight } from 'lucide-react';
import { CATEGORIES, type Project } from '@/lib/projects-store';
import { ProjectMedia } from './ProjectMedia';
import { detectMediaKind } from '@/lib/project-media';
import { safeHref } from '@/lib/utils';

type Props = { project: Project; index: number };

function ProjectCardBase({ project: p, index: i }: Props) {
  const categoryLabel = CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category;
  const demoHref = safeHref(p.demo);
  const githubHref = safeHref(p.github);
  const imageUrl = p.heroImage || p.image;
  const prefetched = useRef(false);
  const reduceMotion = useReducedMotion();

  // Hover-prefetch the case-study hero image so it's already in cache
  // by the time TanStack Router preloads the route chunk.
  const prefetchHero = useCallback(() => {
    if (prefetched.current) return;
    if (!imageUrl || detectMediaKind({ src: imageUrl }) === 'video') return;
    prefetched.current = true;
    const img = new Image();
    img.decoding = 'async';
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: reduceMotion ? 0 : 0.35, delay: (i % 3) * 0.06 }}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/45 transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_18px_55px_-32px_color-mix(in_oklch,var(--primary)_35%,transparent)]">
        <Link
          to="/projetos/$slug"
          params={{ slug: p.slug }}
          onMouseEnter={prefetchHero}
          onFocus={prefetchHero}
          className="relative block overflow-hidden bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
          aria-label={`Abrir estudo de caso: ${p.title}`}
        >
          <div className="aspect-[16/10] overflow-hidden">
            {imageUrl ? (
              <ProjectMedia
                src={imageUrl}
                alt={`Imagem de apresentação do projeto ${p.title}`}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                imageProps={{ loading: 'lazy' }}
                videoOptions={{ muted: true, loop: true, playsInline: true, preload: 'metadata' }}
              />
            ) : (
              <div className="relative flex size-full items-center justify-center bg-gradient-to-br from-card via-background to-primary/10">
                <span className="display text-8xl text-primary/20">{p.title.charAt(0)}</span>
                <ImageIcon
                  className="absolute size-6 text-muted-foreground/40"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/15" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-primary/35 bg-background/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
              {categoryLabel}
            </span>
            {p.year ? (
              <span className="rounded-full border border-border bg-background/75 px-3 py-1.5 font-mono text-[10px] text-foreground/80 backdrop-blur-sm">
                {p.year}
              </span>
            ) : null}
          </div>
          <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {p.role ? (
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {p.role}
                </p>
              ) : null}
              <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                <Link
                  to="/projetos/$slug"
                  params={{ slug: p.slug }}
                  className="rounded-sm outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {p.title}
                </Link>
              </h3>
            </div>
            <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-primary/75">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {p.description}
          </p>

          {p.tech.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`Tecnologias de ${p.title}`}>
              {p.tech.slice(0, 4).map((technology) => (
                <li
                  key={technology}
                  className="rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
                >
                  {technology}
                </li>
              ))}
              {p.tech.length > 4 ? (
                <li className="rounded-md border border-border px-2.5 py-1.5 font-mono text-[9px] text-muted-foreground">
                  +{p.tech.length - 4}
                </li>
              ) : null}
            </ul>
          ) : null}

          <div className="mt-auto flex items-center gap-2 pt-6">
            <Link
              to="/projetos/$slug"
              params={{ slug: p.slug }}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver projeto <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            {demoHref ? (
              <a
                href={demoHref}
                target={demoHref.startsWith('http') ? '_blank' : undefined}
                rel={demoHref.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={`Abrir demonstração de ${p.title}`}
                title="Abrir demonstração"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            {githubHref ? (
              <a
                href={githubHref}
                target={githubHref.startsWith('http') ? '_blank' : undefined}
                rel={githubHref.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={`Abrir repositório GitHub de ${p.title}`}
                title="Abrir repositório"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Github className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export const ProjectCard = memo(
  ProjectCardBase,
  (a, b) => a.project === b.project && a.index === b.index,
);
