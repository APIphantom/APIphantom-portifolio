import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CaseIcon } from '@/lib/case-study-icons';
import type { CtaButton, HeroConfig } from '@/lib/case-study';
import { visibleSorted } from '@/lib/case-study';
import { ProjectMedia } from '@/components/ProjectMedia';
import { safeHref } from '@/lib/utils';

function CtaLink({ cta, primary }: { cta: CtaButton; primary?: boolean }) {
  const href = safeHref(cta.url);
  if (!cta.enabled || !cta.label.trim() || !href) return null;
  return (
    <a
      href={href}
      target={cta.newTab ? '_blank' : undefined}
      rel={cta.newTab ? 'noreferrer' : undefined}
      className={
        primary
          ? 'case-study-primary-action inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110'
          : 'inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-foreground hover:border-primary hover:text-primary'
      }
    >
      {cta.label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </a>
  );
}

export function ProjectHero({
  data,
  categoryFallback,
}: {
  data: HeroConfig;
  categoryFallback?: string;
}) {
  const meta = visibleSorted(data.meta ?? []);
  const desktop = data.desktopMediaUrl || data.heroMediaUrl;
  const mobile = data.mobileMediaUrl;
  const video = data.heroVideoUrl;
  const media = video || desktop;
  const hasSeparateMobileMedia = Boolean(media && mobile && mobile !== media);
  const primaryMedia = media || mobile;
  const mobileOnlyMedia = !media && Boolean(mobile);
  const hasMedia = Boolean(primaryMedia);
  const validMeta = meta.filter((item) => item.label.trim() && item.value.trim());
  const titleLines = [data.title.trim(), data.titleHighlight?.trim()].filter(Boolean);
  const composedTitle = titleLines.join(' — ');
  const descriptionLines = (data.description ?? '').trim().split(/\r?\n/);
  const firstDescriptionLine = descriptionLines[0]?.replace(/^#\s+/, '').trim();
  const heroDescription =
    firstDescriptionLine === composedTitle
      ? descriptionLines.slice(1).join('\n').trim()
      : (data.description ?? '').trim();

  return (
    <section className="case-study-hero border-b border-border px-6 pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-6xl">
        <a
          href="/#projetos"
          className="case-study-enter mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Voltar aos projetos
        </a>

        <div
          className={`grid items-center gap-10 lg:gap-14 ${hasMedia ? 'lg:grid-cols-12' : 'lg:grid-cols-8'}`}
        >
          <div className={`case-study-enter ${hasMedia ? 'lg:col-span-6' : 'lg:col-span-8'}`}>
            {data.badge?.trim() || categoryFallback?.trim() ? (
              <span className="mb-6 inline-flex rounded-full border border-primary/50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary">
                {data.badge?.trim() || categoryFallback}
              </span>
            ) : null}
            {data.title.trim() ? (
              <h1 className="text-4xl font-bold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                {data.title}
                {data.titleHighlight?.trim() ? (
                  <>
                    {data.title.trim().endsWith('—') || data.title.trim().endsWith('-')
                      ? ' '
                      : ' — '}
                    <span className="block text-primary">{data.titleHighlight}</span>
                  </>
                ) : null}
              </h1>
            ) : null}
            {heroDescription ? (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400">
                {heroDescription}
              </p>
            ) : null}

            {validMeta.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-6 sm:gap-x-6 xl:grid-cols-3">
                {validMeta.map((item) => (
                  <div key={item.id} className="flex min-w-0 items-start gap-3">
                    {item.icon?.trim() ? (
                      <CaseIcon name={item.icon} className="mt-0.5 size-4 shrink-0 text-primary" />
                    ) : null}
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-sm text-white">{item.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CtaLink cta={data.primaryCta} primary />
              <CtaLink cta={data.secondaryCta} />
            </div>
          </div>

          {hasMedia ? (
            <div className="case-study-enter case-study-enter-delayed relative min-w-0 lg:col-span-6">
              {hasSeparateMobileMedia ? (
                <div className="case-study-hero-frame mb-4 overflow-hidden rounded-lg border lg:hidden">
                  <ProjectMedia
                    src={mobile}
                    alt={`${data.title} mobile`}
                    className="aspect-[4/5] w-full object-cover"
                    fit="contain"
                    imageProps={{ loading: 'eager' }}
                  />
                </div>
              ) : null}
              {primaryMedia ? (
                <div
                  className={`case-study-hero-frame overflow-hidden rounded-lg border shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${hasSeparateMobileMedia ? 'hidden lg:block' : ''}`}
                >
                  <ProjectMedia
                    src={primaryMedia}
                    alt={data.title}
                    className={`${mobileOnlyMedia ? 'aspect-[4/5]' : 'aspect-[16/10]'} w-full object-contain`}
                    fit="contain"
                    imageProps={{ loading: 'eager' }}
                  />
                </div>
              ) : null}
              {hasSeparateMobileMedia ? (
                <div className="case-study-hero-frame absolute -bottom-8 right-6 hidden w-32 overflow-hidden rounded-2xl border shadow-2xl lg:block">
                  <ProjectMedia
                    src={mobile}
                    alt={`${data.title} mobile`}
                    className="aspect-[9/19] w-full object-cover"
                    fit="contain"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
