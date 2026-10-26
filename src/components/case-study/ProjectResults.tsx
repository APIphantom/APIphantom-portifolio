import { TrendingUp } from 'lucide-react';
import { CaseIcon } from '@/lib/case-study-icons';
import { visibleSorted, type PerformanceIndicator, type ProjectMetricItem } from '@/lib/case-study';

export function ProjectMetrics({
  items,
  summary,
  title,
}: {
  items: ProjectMetricItem[];
  summary?: string;
  title?: string;
}) {
  const metrics = visibleSorted(items).filter(
    (metric) => metric.title.trim() && metric.value.trim(),
  );
  if (!metrics.length) return null;
  const featured = metrics.find((m) => m.featured) ?? metrics[0];
  const rest = metrics.filter((m) => m.id !== featured.id);
  const sectionTitle = title?.trim() || 'Resultados e impacto.';
  const [titleLead, ...titleRest] = sectionTitle.split(/\s+/);

  return (
    <section id="results" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-12">
      <div className="case-study-surface mx-auto max-w-6xl rounded-xl border p-5 sm:p-7 lg:p-9">
        <div className="grid gap-6 md:grid-cols-12 md:items-stretch md:gap-7">
          <div className="md:col-span-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
              // 04 — Resultados
            </p>
            <h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">
              <span className="font-bold text-primary">{titleLead}</span>
              {titleRest.length ? (
                <span className="font-semibold text-foreground"> {titleRest.join(' ')}</span>
              ) : null}
            </h2>

            <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2">
              <article
                className={`case-study-card case-study-surface-strong flex items-center gap-4 rounded-xl border border-primary/50 p-4 sm:p-5 ${summary?.trim() ? '' : 'sm:col-span-2'}`}
              >
                <div className="case-study-card-icon size-12 shrink-0 rounded-lg border border-primary/70 bg-primary/5 text-primary">
                  {featured.icon?.trim() ? (
                    <CaseIcon name={featured.icon} className="size-5" />
                  ) : (
                    <TrendingUp className="size-5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="case-study-featured-value text-3xl font-bold text-foreground sm:text-4xl">
                    {featured.value}
                    {featured.unit ? (
                      <span className="ml-1 text-base font-medium text-zinc-400">
                        {featured.unit}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:text-[10px]">
                    {featured.title}
                  </p>
                  {featured.description ? (
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                      {featured.description}
                    </p>
                  ) : null}
                </div>
              </article>

              {summary?.trim() ? (
                <div className="flex items-center">
                  <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">{summary}</p>
                </div>
              ) : null}
            </div>
          </div>

          {rest.length > 0 ? (
            <div className="flex flex-col gap-2 md:col-span-4 md:h-full md:justify-between md:border-l md:border-border md:pl-5">
              {rest.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center gap-3 py-1 md:min-h-[72px] md:flex-1 md:py-3"
                >
                  <div className="case-study-card-icon size-10 shrink-0 rounded-lg border border-primary/70 bg-primary/5 text-primary">
                    {item.icon?.trim() ? (
                      <CaseIcon name={item.icon} className="size-5" />
                    ) : (
                      <TrendingUp className="size-5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-primary">
                      {item.value}
                      {item.unit ? ` ${item.unit}` : ''}
                    </div>
                    <div className="mt-0.5 text-[10px] leading-relaxed text-zinc-400 sm:text-xs">
                      {item.title}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function ProjectPerformance({
  items,
  title,
}: {
  items: PerformanceIndicator[];
  title?: string;
}) {
  const list = visibleSorted(items).filter((item) => item.name.trim() && item.value.trim());
  if (!list.length) return null;
  const sectionTitle = title?.trim() || 'Performance';

  return (
    <section
      id="performance"
      className="scroll-mt-28 border-y border-border bg-card/20 px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-6xl">
        {sectionTitle ? (
          <h2 className="text-3xl font-bold tracking-normal text-white">{sectionTitle}</h2>
        ) : null}
        <div
          className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${sectionTitle ? 'mt-8 lg:mt-10' : ''}`}
        >
          {list.map((item) => (
            <article key={item.id} className="case-study-card rounded-xl border p-5 sm:p-6">
              {item.icon?.trim() ? (
                <CaseIcon name={item.icon} className="mb-4 size-5 text-primary" />
              ) : null}
              <div className="case-study-featured-value text-3xl font-bold text-white">
                {item.value}
                {item.max ? <span className="text-lg text-zinc-500">/{item.max}</span> : null}
                {item.unit ? (
                  <span className="ml-1 text-base text-zinc-500">{item.unit}</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-zinc-400">{item.name}</p>
              {item.description ? (
                <p className="mt-2 text-xs text-zinc-500">{item.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
