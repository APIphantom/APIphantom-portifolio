import { Play } from 'lucide-react';
import { ProjectMedia } from '@/components/ProjectMedia';
import { detectMediaKind } from '@/lib/project-media';
import type { GalleryMediaItem } from '@/lib/case-study';

export function ProjectDemoVideo({ item }: { item: GalleryMediaItem }) {
  if (detectMediaKind({ src: item.url, mediaType: item.kind }) !== 'video') return null;

  const title = item.title?.trim() || 'Veja o projeto em funcionamento';
  const description = item.description?.trim() || item.caption?.trim();

  return (
    <section id="demo-video" className="scroll-mt-28 px-4 py-6 sm:px-6 sm:py-8">
      <div className="case-study-surface case-study-demo-video mx-auto max-w-6xl rounded-xl border p-5 sm:p-7 lg:p-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-xs">
              // Demonstração
            </p>
            <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">
              <span className="font-bold text-primary">{title}</span>
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            <Play className="size-3.5 fill-current" aria-hidden="true" />
            Vídeo do projeto
          </span>
        </div>
        <div className="case-study-demo-player overflow-hidden rounded-xl border">
          <ProjectMedia
            src={item.url}
            mediaType={item.kind}
            alt={item.alt || title}
            className="aspect-video w-full bg-black object-contain"
            fit="contain"
            videoOptions={{ controls: true, playsInline: true, preload: 'metadata' }}
            videoProps={{ 'aria-label': title }}
          />
        </div>
      </div>
    </section>
  );
}
