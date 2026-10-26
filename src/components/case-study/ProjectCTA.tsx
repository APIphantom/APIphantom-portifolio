import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CtaConfig, NeighborProject } from '@/lib/case-study';
import { Link } from '@tanstack/react-router';
import { safeHref } from '@/lib/utils';

function Action({
  label,
  url,
  newTab,
  primary,
}: {
  label: string;
  url: string;
  newTab: boolean;
  primary?: boolean;
}) {
  const safeUrl = safeHref(url);
  if (!label.trim() || !safeUrl) return null;
  const className = primary
    ? 'case-study-primary-action inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground'
    : 'inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-foreground hover:border-primary hover:text-primary';
  const projectPath = safeUrl.match(/^\/projetos\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
  if (projectPath) {
    const slug = projectPath[1];
    return (
      <Link to="/projetos/$slug" params={{ slug }} className={className}>
        {label}
        <ArrowRight className="size-5" />
      </Link>
    );
  }
  return (
    <a
      href={safeUrl}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      className={className}
    >
      {label}
      <ArrowRight className="size-5" />
    </a>
  );
}

export function ProjectCTA({ data }: { data: CtaConfig }) {
  const primary =
    data.primary.enabled && data.primary.url.trim()
      ? { ...data.primary, label: data.primary.label.trim() || 'Entrar em contato' }
      : { label: 'Entrar em contato', url: '/#contato', newTab: false, enabled: true };
  const secondary =
    data.secondary.enabled && data.secondary.url.trim()
      ? { ...data.secondary, label: data.secondary.label.trim() || 'Ver mais projetos' }
      : { label: 'Ver mais projetos', url: '/#projetos', newTab: false, enabled: true };

  return (
    <section id="cta" className="scroll-mt-28 px-4 py-6 sm:px-6 sm:py-8">
      <div className="case-study-cta-banner relative mx-auto grid max-w-6xl gap-5 overflow-hidden rounded-xl border p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
        <div className="relative z-10 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-primary sm:text-[10px]">
            {data.eyebrow?.trim() || '// Próximo projeto'}
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {data.title?.trim() || 'Gostou deste projeto?'}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-primary sm:text-base">
            {data.subtitle?.trim() || 'Vamos criar algo incrível juntos.'}
          </p>
          {data.text?.trim() ? (
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
              {data.text}
            </p>
          ) : null}
        </div>
        <div className="relative z-10 flex flex-col gap-2 sm:flex-row md:justify-end">
          <Action {...primary} primary />
          <Action {...secondary} />
        </div>
      </div>
    </section>
  );
}

export function ProjectNavigation({
  prev,
  next,
}: {
  prev: NeighborProject | null;
  next: NeighborProject | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav
      className="mx-auto grid max-w-6xl gap-3 px-4 pb-20 sm:px-6 md:grid-cols-2 md:items-stretch"
      aria-label="Navegação entre projetos"
    >
      {prev ? (
        <Link
          to="/projetos/$slug"
          params={{ slug: prev.slug }}
          className="case-study-card group flex min-h-20 items-center justify-between gap-4 rounded-xl border px-5 py-4 text-sm text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft
            className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Projeto anterior
            </span>
            <span className="mt-1 block truncate font-semibold text-foreground">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden md:block" />
      )}
      {next ? (
        <Link
          to="/projetos/$slug"
          params={{ slug: next.slug }}
          aria-label={`Abrir próximo projeto: ${next.title}`}
          className="case-study-primary-action group flex min-h-20 items-center justify-between gap-4 rounded-xl border border-primary/50 px-5 py-4 text-sm shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:col-start-2"
        >
          <span className="min-w-0 flex-1 text-right">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
              Próximo projeto
            </span>
            <span className="mt-1 block truncate font-bold">{next.title}</span>
          </span>
          <ArrowRight
            className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </nav>
  );
}
