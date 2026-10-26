import { Layers, Monitor, Palette, Route, Code2 } from 'lucide-react';
import {
  ARCHITECTURE_STACK_FIELDS,
  getArchitectureStackSummaries,
  visibleSorted,
  type ArchitectureConfig,
  type ArchitectureStackKey,
} from '@/lib/case-study';
import type { Technology } from '@/lib/projects-store';

const architectureIcons: Record<ArchitectureStackKey, typeof Monitor> = {
  frontend: Monitor,
  styling: Palette,
  stateManagement: Layers,
  routing: Route,
};

export function ProjectArchitecture({
  data,
  technologies = [],
  fallbackTechnologyNames = [],
}: {
  data: ArchitectureConfig;
  technologies?: Technology[];
  fallbackTechnologyNames?: string[];
}) {
  const groups = visibleSorted(data.groups ?? [])
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.technologyName.trim()),
    }))
    .filter((group) => group.items.length > 0);
  const legacyStackSummaries = getArchitectureStackSummaries(groups);
  const stackSummaries = Object.fromEntries(
    ARCHITECTURE_STACK_FIELDS.map(({ key }) => [
      key,
      data.stackDetails?.[key] ?? legacyStackSummaries[key],
    ]),
  ) as Record<ArchitectureStackKey, string>;
  const techById = new Map((technologies || []).map((t) => [t.id, t]));
  const namedTechs = (data.technologyIds ?? [])
    .map((id) => techById.get(id))
    .filter((t): t is Technology => Boolean(t));
  const badges = namedTechs.length
    ? namedTechs.map((technology) => technology.name)
    : [...new Set(fallbackTechnologyNames.filter((name) => name.trim()))];
  const description = data.description?.trim();
  const title = data.title?.trim();
  const highlightText = data.highlightText?.trim();
  const hasStackContent = Object.values(stackSummaries).some((summary) => summary.trim());
  const hasHighlight = Boolean(highlightText || hasStackContent || badges.length);
  const sectionTitle = title || 'Arquitetura do projeto.';
  const [titleLead, ...titleRest] = sectionTitle.split(/\s+/);

  if (!description && !title && !hasStackContent && badges.length === 0 && !highlightText) {
    return null;
  }
  return (
    <section id="architecture" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-12">
      <div className="case-study-surface case-study-architecture mx-auto max-w-6xl rounded-xl border p-5 sm:p-7 lg:p-9">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
          {data.eyebrow?.trim() || '// Arquitetura'}
        </p>
        <h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">
          <span className="font-bold">{titleLead}</span>
          {titleRest.length ? (
            <span className="font-normal text-foreground"> {titleRest.join(' ')}</span>
          ) : null}
        </h2>

        <div className="mt-7 grid gap-6 md:mt-8 md:grid-cols-12 md:items-stretch md:gap-7">
          <div className="space-y-4 md:col-start-1 md:col-span-4 md:border-r md:border-border md:pr-6">
            {ARCHITECTURE_STACK_FIELDS.map(({ key, label }) => {
              const Icon = architectureIcons[key];
              return (
                <div key={key} className="flex min-w-0 items-center gap-3 py-1">
                  <div className="case-study-card-icon size-10 rounded-lg">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {label}
                    </div>
                    {stackSummaries[key].trim() ? (
                      <div className="mt-1 text-sm leading-relaxed text-zinc-300">
                        {stackSummaries[key]}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {description || badges.length > 0 ? (
            <div className="case-study-architecture-details min-w-0 md:col-start-5 md:col-span-5 md:border-r md:border-border md:pr-6">
              {description ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
                  {description}
                </p>
              ) : null}
              {badges.length > 0 ? (
                <div className={description ? 'mt-6' : ''}>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Tecnologias utilizadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((name) => (
                      <span
                        key={name}
                        className="case-study-tech-chip rounded-full border px-3 py-1.5 text-xs text-foreground/90"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {hasHighlight ? (
            <div className="min-w-0 md:col-start-10 md:col-span-3">
              <div className="case-study-architecture-highlight relative flex h-full min-h-40 flex-col items-center justify-center overflow-hidden rounded-xl border p-6 text-center sm:p-7">
                <Code2
                  className="relative z-10 mb-4 size-14 text-primary sm:size-16"
                  aria-hidden="true"
                />
                <p className="relative z-10 max-w-[18rem] text-sm leading-relaxed text-zinc-200">
                  {highlightText ||
                    (hasStackContent
                      ? `${Object.values(stackSummaries).filter((summary) => summary.trim()).length} áreas técnicas descritas neste projeto.`
                      : `${badges.length} tecnologias registradas neste projeto.`)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
