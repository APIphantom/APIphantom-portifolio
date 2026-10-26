import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, Github } from 'lucide-react';
import { useSettings } from '@/lib/projects-store';
import { safeHref } from '@/lib/utils';

export function Vision() {
  const { settings } = useSettings();
  const reduceMotion = useReducedMotion();
  const githubHref = safeHref(settings.github);

  return (
    <section
      id="visao"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="visao-title"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-primary/35 bg-card/55 p-6 sm:p-9 lg:p-12"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
                // 05 — Próximo passo
              </p>
              <h2
                id="visao-title"
                className="display text-4xl leading-[0.98] sm:text-5xl lg:text-6xl"
              >
                Quero construir o próximo <span className="text-primary">capítulo.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Estou aberto a conversar sobre oportunidades como{' '}
                <span className="font-semibold text-foreground">
                  {settings.role || 'Desenvolvedor Front-End Júnior'}
                </span>
                , projetos colaborativos e desafios de interface.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
              <a
                href="#contato"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-bold uppercase tracking-[0.13em] text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Conversar <ArrowDownRight className="size-4" aria-hidden="true" />
              </a>
              {githubHref ? (
                <a
                  href={githubHref}
                  target={githubHref.startsWith('http') ? '_blank' : undefined}
                  rel={githubHref.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-xs font-semibold uppercase tracking-[0.13em] text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Github className="size-4" aria-hidden="true" /> GitHub
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
