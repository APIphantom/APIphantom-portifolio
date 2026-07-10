import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LightboxGallery } from "./LightboxGallery";
import { ProjectMedia } from "@/components/ProjectMedia";
import type { VideoMediaOptions } from "@/lib/project-media";

type Props = {
  images: string[];
  labels?: string[];
  mediaSettings?: Record<number, VideoMediaOptions>;
};

export function GallerySection({ images, labels = [], mediaSettings = {} }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const valid = useMemo(() => images.filter(Boolean), [images]);

  if (valid.length === 0) return null;

  return (
    <section id="gallery" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="grid items-center gap-3">
            <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4">// 10 - Galeria</span>
            <p className="flex-1 display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl mb-6"><span className="text-primary text-glow">Galeria</span> do projeto.</p>
          </div>
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors"
          >
            Ver galeria completa
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {valid.slice(0, 8).map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setLightboxIndex(i)}
              className="group relative overflow-hidden rounded-xl border border-border/70 bg-background/40"
              data-cursor="view"
            >
              <ProjectMedia
                src={src}
                alt={labels[i]?.trim() || `Galeria ${i + 1}`}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
                videoOptions={mediaSettings[i]}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/65 to-transparent opacity-70" />
              {(labels[i]?.trim() || "").length > 0 && (
                <span className="absolute left-2.5 bottom-2.5 rounded-full border border-primary/35 bg-background/65 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                  {labels[i]}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      <LightboxGallery
        images={valid}
        mediaSettings={mediaSettings}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </section>
  );
}
