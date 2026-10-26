import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Lightbulb, Shield, Target, Trophy, type LucideIcon } from 'lucide-react';
import type { LegacyCaseStudy, Project } from '@/lib/projects-store';

type Props = {
  project: Project;
  legacy?: LegacyCaseStudy;
};

const cleanItems = (items?: string[]) => items?.map((item) => item.trim()).filter(Boolean) ?? [];

function ProcessCard({
  title,
  text,
  icon: Icon,
  index,
}: {
  title: string;
  text: string;
  icon: LucideIcon;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduceMotion ? 0 : 0.3, delay: index * 0.04 }}
      className="case-study-card h-full min-w-0 rounded-xl border p-4 sm:p-5"
    >
      <div className="case-study-card-icon mb-4 size-12 rounded-xl border border-primary/70 bg-primary/5 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-zinc-400 sm:text-sm">
        {text}
      </p>
    </motion.article>
  );
}

function TimelineBlock({ items }: { items: string[] }) {
  const reduceMotion = useReducedMotion();
  const entries = items.map((text, index) => {
    const match = text.match(/^(semana|week|sprint)\s*([\w-]+)\s*(?:->|—|–|-|:)\s*(.+)$/i);
    const periodType = match?.[1].toLocaleLowerCase('pt-BR') === 'week' ? 'Semana' : match?.[1];
    return {
      id: `${index}-${text}`,
      period: match ? `${periodType} ${match[2]}` : `Etapa ${String(index + 1).padStart(2, '0')}`,
      description: match ? match[3].trim() : text,
    };
  });
  const gridColumns =
    entries.length === 2
      ? 'xl:grid-cols-2'
      : entries.length === 3
        ? 'xl:grid-cols-3'
        : entries.length === 1
          ? 'xl:grid-cols-1'
          : 'xl:grid-cols-4';
  const railInset = `${50 / entries.length}%`;

  if (!entries.length) return null;

  return (
    <div className="case-study-timeline mt-8 rounded-xl border p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary">
            // Cronograma
          </p>
          <h3 className="mt-2 text-xl font-bold sm:text-2xl">Linha do tempo do projeto</h3>
        </div>
        <CalendarDays className="size-6 text-primary" aria-hidden="true" />
      </div>

      {entries.length > 1 && entries.length <= 4 ? (
        <div className="case-study-timeline-horizontal relative mt-9 hidden xl:block">
          <span
            aria-hidden="true"
            className="case-study-timeline-track"
            style={{ left: railInset, right: railInset }}
          />
          <motion.span
            aria-hidden="true"
            className="case-study-timeline-progress"
            style={{ left: railInset, right: railInset }}
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: 'easeOut' }}
          />
          <div className={`relative grid gap-6 ${gridColumns}`}>
            {entries.map((entry, index) => (
              <motion.article
                key={entry.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: index * 0.12 }}
                className="min-w-0 text-center"
              >
                <motion.span
                  aria-hidden="true"
                  initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, delay: index * 0.12 }}
                  className="case-study-timeline-node relative z-10 mx-auto grid size-10 place-items-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary"
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.span>
                <div className="mx-auto mt-4 max-w-[17rem]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {entry.period}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {entry.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      ) : null}

      <div className={`relative mt-8 ${entries.length > 4 ? '' : 'xl:hidden'}`}>
        <span
          aria-hidden="true"
          className="case-study-timeline-vertical-track absolute bottom-2 left-[19px] top-2 w-px"
        />
        <motion.span
          aria-hidden="true"
          className="case-study-timeline-vertical-progress absolute bottom-2 left-[18px] top-2 w-[3px] origin-top rounded-full"
          initial={reduceMotion ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: 'easeOut' }}
        />
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={reduceMotion ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: reduceMotion ? 0 : 0.35, delay: index * 0.08 }}
              className="relative flex min-w-0 gap-4"
            >
              <motion.span
                aria-hidden="true"
                initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.3, delay: index * 0.08 }}
                className="case-study-timeline-node relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary"
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>
              <div className="min-w-0 pb-1 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                  {entry.period}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {entry.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectProcess({ project, legacy }: Props) {
  const solution = project.solution?.trim();
  const result = project.result?.trim();
  const developmentSteps = cleanItems(legacy?.developmentProcess);
  const timeline = cleanItems(legacy?.timeline);
  const timelineItems = timeline.length ? timeline : developmentSteps;
  const cards = [
    { id: 'objective', title: 'Objetivo', text: project.objective?.trim(), icon: Target },
    {
      id: 'problem',
      title: 'Problema',
      text: (project.problem || legacy?.problemStatement)?.trim(),
      icon: Shield,
    },
    { id: 'solution', title: 'Solução implementada', text: solution, icon: Lightbulb },
    { id: 'result', title: 'Resultado registrado', text: result, icon: Trophy },
  ].filter((card): card is typeof card & { text: string } => Boolean(card.text));

  if (
    !project.objective?.trim() &&
    !(project.problem || legacy?.problemStatement)?.trim() &&
    cards.length === 0 &&
    !timelineItems.length
  ) {
    return null;
  }

  return (
    <section id="process" className="scroll-mt-28 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-stretch gap-3 sm:grid-cols-2 md:grid-cols-4">
          {cards.map((card, index) => (
            <ProcessCard
              key={card.id}
              title={card.title}
              text={card.text}
              icon={card.icon}
              index={index}
            />
          ))}
        </div>

        {timelineItems.length ? <TimelineBlock items={timelineItems} /> : null}
      </div>
    </section>
  );
}
