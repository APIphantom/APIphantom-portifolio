import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LightboxGallery } from "./LightboxGallery";

type Props = {
  images: string[];
};

export function DesignShowcase({ images }: Props) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const valid = useMemo(() => images.filter(Boolean), [images]);

  if (valid.length === 0) return null;

  const prev = () => setIdx((v) => (v - 1 + valid.length) % valid.length);
  const next = () => setIdx((v) => (v + 1) % valid.length);

  return (
    <section id="design" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-8"
      >
        <div className="grid items-center gap-3 mb-8">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4">// 06 - Design</span>
          <p className="display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl mb-6"><span className="text-primary text-glow">Visual</span> do projeto.</p>
        </div>

        <div className="relative rounded-2xl border border-border/70 bg-background/40 p-3 md:p-4">
          <img
            src={valid[idx]}
            alt="Showcase"
            className="w-full aspect-[16/8] object-cover rounded-xl cursor-zoom-in"
            onClick={() => setLightbox(idx)}
          />

          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full border border-primary/45 bg-background/70 text-primary hover:bg-primary/10 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="size-5 mx-auto" />
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full border border-primary/45 bg-background/70 text-primary hover:bg-primary/10 transition-colors"
            aria-label="Proximo"
          >
            <ChevronRight className="size-5 mx-auto" />
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
          {valid.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setIdx(i)}
              className={`rounded-lg overflow-hidden border ${
                i === idx ? "border-primary/60" : "border-border/70"
              }`}
            >
              <img src={src} alt={`thumb-${i}`} className="w-full aspect-[4/3] object-cover" />
            </button>
          ))}
        </div>
      </motion.div>

      <LightboxGallery images={valid} index={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
