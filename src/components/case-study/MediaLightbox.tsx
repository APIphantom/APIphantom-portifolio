import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ProjectMedia } from '@/components/ProjectMedia';
import { publicMediaTitle, type GalleryMediaItem } from '@/lib/case-study';

type Props = {
  items: GalleryMediaItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function MediaLightbox({ items, index, onClose, onIndexChange }: Props) {
  const current = index !== null ? items[index] : null;
  const title = current ? publicMediaTitle(current) : '';
  const publicTitle =
    current?.title?.trim() &&
    !/\.(avif|bmp|gif|jpe?g|png|svg|webp|mp4|webm|mov|m4v|avi|mkv)$/i.test(current.title.trim())
      ? current.title.trim()
      : '';

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % items.length);
      if (event.key === 'ArrowLeft') onIndexChange(index === 0 ? items.length - 1 : index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onClose, onIndexChange]);

  if (!current || index === null) return null;

  const isPortrait = ['portrait', 'mobile'].includes(current.layout);
  const isSquare = current.layout === 'square';
  const mediaFrameClass = isPortrait
    ? 'aspect-[9/16] w-[min(72vw,48vh)]'
    : isSquare
      ? 'aspect-square w-[min(88vw,78vh)]'
      : 'aspect-video w-[min(92vw,150vh)]';

  return (
    <div
      className="case-study-lightbox fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || current.caption || title || 'Visualização de mídia'}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full border border-zinc-700 px-3 py-2 text-sm"
        onClick={onClose}
        aria-label="Fechar"
      >
        <X className="size-4" />
      </button>
      <button
        type="button"
        className="absolute left-4 size-10 rounded-full border border-zinc-700"
        aria-label="Anterior"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange(index === 0 ? items.length - 1 : index - 1);
        }}
      >
        <ChevronLeft className="mx-auto size-5" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 size-10 -translate-y-1/2 rounded-full border border-zinc-700"
        aria-label="Próxima"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index + 1) % items.length);
        }}
      >
        <ChevronRight className="mx-auto size-5" />
      </button>

      <div
        className="case-study-lightbox-content mx-auto flex max-h-[90vh] max-w-full flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`shrink-0 overflow-hidden rounded-lg border border-border bg-background ${mediaFrameClass}`}
        >
          <ProjectMedia
            src={current.url}
            alt={current.alt || title}
            mediaType={current.kind}
            className="h-full w-full object-contain"
            fit="contain"
          />
        </div>
        {current.caption?.trim() || current.description?.trim() ? (
          <div className="max-h-[12vh] overflow-y-auto scrollbar-none pt-3">
            {current.caption?.trim() ? (
              <p className="text-sm text-zinc-300">{current.caption}</p>
            ) : null}
            {current.description?.trim() ? (
              <p className="mt-1 text-xs text-zinc-500">{current.description}</p>
            ) : null}
          </div>
        ) : null}
        <div className="mt-2 text-xs text-zinc-500">
          {index + 1}/{items.length}
        </div>
      </div>
    </div>
  );
}
