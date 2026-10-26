import { CaseIcon } from '@/lib/case-study-icons';
import { visibleSorted, type OverviewConfig, type ProjectFeature } from '@/lib/case-study';
import { safeHref } from '@/lib/utils';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const defaultPillarIcons = ['Lock', 'Wallet', 'Accessibility'];

export function ProjectOverview({ data }: { data: OverviewConfig }) {
  const pillars = visibleSorted(data.pillars ?? []).filter(
    (pillar) => pillar.title.trim() || pillar.description.trim(),
  );
  const description = data.description?.trim();
  if (!data.title?.trim() && !description && pillars.length === 0) return null;
  const title = data.title?.trim() || 'Visão geral';
  const titleWords = title.split(/\s+/);
  const titleAccent = titleWords.slice(0, Math.min(2, titleWords.length)).join(' ');
  const titleRest = titleWords.slice(2).join(' ');

  return (
    <section id="overview" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-12">
      <div className="case-study-surface mx-auto max-w-6xl rounded-xl border p-5 sm:p-8 lg:p-9">
        <div className="grid gap-7 md:grid-cols-12 md:gap-7">
          <div className={pillars.length ? 'md:col-span-7' : 'md:col-span-12'}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
              {data.eyebrow?.trim() || '// 01 — Visão geral'}
            </p>
            {title ? (
              <h2 className="mt-3 max-w-3xl text-3xl tracking-tight sm:text-4xl">
                <span className="font-bold text-primary">{titleAccent}</span>
                {titleRest ? (
                  <span className="font-semibold text-foreground"> {titleRest}</span>
                ) : null}
              </h2>
            ) : null}
            {description ? (
              <div className="mt-7 space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
                {description
                  .split('\n\n')
                  .filter((paragraph) => paragraph.trim())
                  .map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                  ))}
              </div>
            ) : null}
          </div>
          {pillars.length > 0 && (
            <div className="flex flex-col gap-4 md:col-span-5 md:h-full md:justify-between md:border-l md:border-border md:pl-7">
              {pillars.map((pillar, index) => (
                <article
                  key={pillar.id}
                  className="group flex gap-3 rounded-lg py-1 transition-transform duration-200 hover:translate-x-1 motion-reduce:transform-none md:min-h-[72px] md:flex-1 md:items-center md:py-3"
                >
                  <div className="case-study-card-icon size-11 shrink-0 rounded-lg border border-primary/70 bg-primary/5 text-primary">
                    <CaseIcon
                      name={
                        pillar.icon?.trim() || defaultPillarIcons[index % defaultPillarIcons.length]
                      }
                      className="size-5"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    {pillar.title.trim() ? (
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
                        {pillar.title}
                      </h3>
                    ) : null}
                    {pillar.description.trim() ? (
                      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-300 sm:text-sm">
                        {pillar.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ProjectFeatures({ items, title }: { items: ProjectFeature[]; title?: string }) {
  const features = visibleSorted(items).filter(
    (item) => item.title.trim() || item.description.trim(),
  );
  if (!features.length) return null;
  const sectionTitle = title?.trim() || 'Funcionalidades principais';

  return (
    <section id="features" className="scroll-mt-28 px-4 pb-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
              // Recursos do projeto
            </p>
            {sectionTitle ? (
              <h2 className="mt-2 max-w-3xl text-3xl tracking-tight sm:text-4xl">
                <span className="font-bold text-primary">{sectionTitle}</span>
              </h2>
            ) : null}
          </div>
          <span className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            {String(features.length).padStart(2, '0')} recursos
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const href = safeHref(item.link);
            const inner = (
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="case-study-card-icon case-study-feature-icon size-12 rounded-xl">
                    {item.icon?.trim() ? (
                      <CaseIcon name={item.icon} className="size-6 text-primary" />
                    ) : (
                      <Sparkles className="size-6 text-primary" aria-hidden="true" />
                    )}
                  </div>
                  <span className="font-mono text-xs tracking-[0.18em] text-primary/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                {item.image?.trim() ? (
                  <div className="case-study-feature-image mb-5 aspect-[16/9] overflow-hidden rounded-lg border">
                    <img
                      src={item.image}
                      alt={item.title || ''}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : null}
                {item.title.trim() ? (
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {item.title}
                  </h3>
                ) : null}
                {item.description.trim() ? (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                ) : null}
                <div className="case-study-feature-footer mt-5 flex items-center justify-between border-t pt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                  <span>{href ? 'Explorar recurso' : 'Recurso do projeto'}</span>
                  {href ? <ArrowUpRight className="size-4" aria-hidden="true" /> : null}
                </div>
              </div>
            );
            const className =
              'case-study-card case-study-feature-card group min-h-52 rounded-xl border p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
            return href ? (
              <a key={item.id} href={href} className={className}>
                {inner}
              </a>
            ) : (
              <article key={item.id} className={className}>
                {inner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
