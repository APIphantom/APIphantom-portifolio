import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectMedia } from '@/components/ProjectMedia';
import {
  publicMediaTitle,
  visibleSorted,
  type GalleryMediaItem,
  type MediaSectionConfig,
} from '@/lib/case-study';
import { MediaLightbox } from './MediaLightbox';

function mediaWidthClass(layout: GalleryMediaItem['layout']) {
  switch (layout) {
    case 'portrait':
    case 'mobile':
      return 'basis-[30vw] sm:basis-[14%]';
    case 'full-width':
    case 'featured':
    case 'wide':
    case 'desktop':
      return 'basis-[70vw] sm:basis-[42%]';
    case 'square':
      return 'basis-[42vw] sm:basis-[15%]';
    default:
      return 'basis-[42vw] sm:basis-[15%]';
  }
}

function mediaFit(layout: GalleryMediaItem['layout']) {
  return ['desktop', 'landscape', 'wide', 'featured', 'full-width', 'portrait', 'mobile'].includes(
    layout,
  )
    ? 'contain'
    : 'cover';
}

export function ProjectMediaGallery({ data }: { data: MediaSectionConfig }) {
  const items = visibleSorted(data.items ?? []).filter((item) => item.url);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(index);
  const slides = useMemo(
    () =>
      items.map((item, itemIndex) => ({
        ...item,
        layout:
          itemIndex === 0
            ? ('desktop' as const)
            : itemIndex === 1
              ? ('mobile' as const)
              : item.layout,
      })),
    [items],
  );
  const presentationTitle = data.title?.trim() || 'Galeria de mídias.';
  const [titleLead, ...titleRest] = presentationTitle.split(/\s+/);

  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    const selected = galleryRef.current?.querySelector<HTMLElement>(
      `[data-gallery-index="${index}"]`,
    );
    selected?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [index]);

  if (!slides.length) return null;

  return (
    <section id="media" className="scroll-mt-28 px-6 py-12 sm:py-14">
      <div className="case-study-surface mx-auto max-w-6xl rounded-xl border p-5 sm:p-7 lg:p-9">
        <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
              {data.eyebrow?.trim() || '// 03 — Mídia'}
            </p>
            <h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">
              <span className="font-bold text-primary">{titleLead}</span>
              {titleRest.length ? (
                <span className="font-semibold text-foreground"> {titleRest.join(' ')}</span>
              ) : null}
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm md:col-span-5 md:col-start-8 md:pb-1">
            {data.description?.trim() ||
              'Confira as telas e os materiais do projeto em diferentes dispositivos e contextos.'}
          </p>
        </div>

        <div
          ref={galleryRef}
          role="list"
          aria-label="Galeria de mídias do projeto"
          className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-none sm:mt-6"
        >
          {slides.map((item, i) => {
            const title = publicMediaTitle(item);
            const overlayTitle = title || item.caption?.trim();
            const overlayText = title ? item.caption?.trim() || item.description?.trim() : '';
            const fit = i >= 2 ? 'cover' : mediaFit(item.layout);

            return (
              <article
                key={item.id}
                data-gallery-index={i}
                role="listitem"
                className={`case-study-surface case-study-gallery-card group relative h-40 shrink-0 snap-start overflow-hidden rounded-lg border sm:h-44 ${mediaWidthClass(item.layout)}`}
                style={{ '--case-study-delay': `${Math.min(i, 8) * 65}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  aria-label={title || item.alt?.trim() || `Abrir mídia ${i + 1}`}
                  aria-current={index === i ? 'true' : undefined}
                  onClick={() => {
                    setIndex(i);
                    setOpen(true);
                  }}
                  className="absolute inset-0 block h-full w-full overflow-hidden bg-background/70 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ProjectMedia
                    src={item.url}
                    alt={item.alt || item.title || ''}
                    mediaType={item.kind}
                    fit={fit}
                    className={`h-full w-full transition-transform duration-500 ${fit === 'cover' ? 'object-cover group-hover:scale-[1.03]' : 'object-contain'}`}
                    imageProps={{ loading: 'lazy' }}
                  />
                  {item.featured ? (
                    <span className="absolute left-2 top-2 rounded-full border border-primary/50 bg-background/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur">
                      Destaque
                    </span>
                  ) : null}
                  {i >= 2 && (overlayTitle || overlayText) ? (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-2.5 pt-8">
                      {overlayTitle ? (
                        <span className="block line-clamp-1 text-[10px] font-semibold text-white sm:text-xs">
                          {overlayTitle}
                        </span>
                      ) : null}
                      {overlayText ? (
                        <span className="mt-0.5 block line-clamp-1 text-[9px] leading-relaxed text-zinc-300 sm:text-[10px]">
                          {overlayText}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </button>
              </article>
            );
          })}
        </div>

        {slides.length > 1 ? (
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              className="size-9 rounded-full border border-border bg-card/70 transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Mídia anterior"
              onClick={() => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))}
            >
              <ChevronLeft className="mx-auto size-5" />
            </button>
            <span className="min-w-10 text-center text-xs text-zinc-400" aria-live="polite">
              {index + 1}/{slides.length}
            </span>
            <button
              type="button"
              className="size-9 rounded-full border border-border bg-card/70 transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Próxima mídia"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
            >
              <ChevronRight className="mx-auto size-5" />
            </button>
          </div>
        ) : null}
      </div>

      <MediaLightbox
        items={slides}
        index={open ? index : null}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
