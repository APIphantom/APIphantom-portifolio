import { memo, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github, ExternalLink, ImageIcon, ArrowUpRight } from "lucide-react";
import { CATEGORIES, type Project } from "@/lib/projects-store";
import { TiltCard } from "./TiltCard";
import { LazyImage } from "./LazyImage";

type Props = { project: Project; index: number };

function ProjectCardBase({ project: p, index: i }: Props) {
  const categoryLabel = CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category;
  const prefetched = useRef(false);

  // Hover-prefetch the case-study hero image so it's already in cache
  // by the time TanStack Router preloads the route chunk.
  const prefetchHero = useCallback(() => {
    if (prefetched.current) return;
    const url = p.heroImage || p.image;
    if (!url) return;
    prefetched.current = true;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }, [p.heroImage, p.image]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: (i % 3) * 0.1 }}
    >
      <TiltCard className="h-full">
        <article className="group relative h-full rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 hover:glow-neon transition-all">
          <Link
            to="/projeto/$slug"
            params={{ slug: p.slug }}
            onMouseEnter={prefetchHero}
            onFocus={prefetchHero}
            className="block"
            data-cursor="hover"
          >
            <div className="relative">
              {p.image ? (
                <LazyImage
                  src={p.image}
                  alt={p.title}
                  aspect="aspect-[4/5]"
                  className="transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="aspect-[4/5] relative bg-gradient-to-br from-graphite to-background flex items-center justify-center">
                  <span className="display text-[8rem] text-primary/10">{p.title.charAt(0)}</span>
                  <ImageIcon className="absolute size-8 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                  Drop {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded-full border border-border">
                  {categoryLabel}
                </span>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-black text-2xl tracking-tight leading-none mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              </div>
            </div>
          </Link>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Link
                to="/projeto/$slug"
                params={{ slug: p.slug }}
                data-cursor="hover"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-xs uppercase tracking-widest font-bold hover:border-primary hover:text-primary transition-colors"
              >
                Case Study <ArrowUpRight className="size-3.5" />
              </Link>
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  aria-label={`Demo de ${p.title}`}
                  className="size-9 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:glow-neon transition-shadow"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  aria-label={`GitHub de ${p.title}`}
                  className="size-9 inline-flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  <Github className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}

export const ProjectCard = memo(
  ProjectCardBase,
  (a, b) => a.project === b.project && a.index === b.index,
);
