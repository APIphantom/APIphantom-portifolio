import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FloatingMockup } from "./FloatingMockup";
import { ProjectMetrics } from "./ProjectMetrics";
import type { MetaPill } from "./types";

type Props = {
  category: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  status: string;
  tech: string[];
  meta: MetaPill[];
  demo?: string;
  github?: string;
};

export function HeroSection({
  category,
  slug,
  title,
  description,
  image,
  status,
  tech,
  meta,
  demo,
  github,
}: Props) {
  const reducedMotion = useReducedMotion();
  const sx = useMotionValue(50);
  const sy = useMotionValue(40);
  const sxs = useSpring(sx, { stiffness: 130, damping: 20, mass: 0.2 });
  const sys = useSpring(sy, { stiffness: 130, damping: 20, mass: 0.2 });
  const spotlight = useTransform(
    [sxs, sys],
    ([x, y]) =>
      `radial-gradient(560px circle at ${x}% ${y}%, rgba(255, 212, 0, 0.14), transparent 55%)`,
  );

  return (
    <header
      id="overview"
      className="relative min-h-[calc(100vh-4rem)] px-6 lg:px-10 pt-12 pb-16 flex items-center"
      onMouseMove={(event) => {
        if (reducedMotion) return;
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        sx.set(((event.clientX - rect.left) / rect.width) * 100);
        sy.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
    >
      <motion.div className="absolute inset-0 -z-10" style={{ background: spotlight }} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_42%,rgba(255,212,0,0.10),transparent_42%)] blur-3xl" />

      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] mb-6">
            <span className="px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary">
              {category}
            </span>
            <span className="text-muted-foreground">/{slug}</span>
          </div>

          <h1 className="display text-[clamp(2.9rem,7vw,6rem)] leading-[0.9] text-glow max-w-[8ch]">
            {title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            {description}
          </p>

          <ProjectMetrics metrics={meta} />

          <div className="mt-7 flex flex-wrap gap-2">
            {tech.slice(0, 6).map((item) => (
              <span
                key={item}
                className="text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border border-border/80 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:scale-[1.02] hover:glow-neon transition-all"
              >
                Visitar Projeto
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
              >
                Ver no GitHub
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <FloatingMockup title={title} image={image} status={status} />
        </div>
      </div>
    </header>
  );
}
