import { motion, useReducedMotion } from 'framer-motion';
import { Blocks, Eye, ListChecks } from 'lucide-react';

const principles = [
  {
    number: '01',
    title: 'Entender',
    description:
      'Começar pelo objetivo, por quem vai usar a interface e pelo conteúdo que precisa ficar claro.',
    icon: Eye,
  },
  {
    number: '02',
    title: 'Estruturar',
    description:
      'Organizar páginas e componentes para manter a experiência coerente e o código fácil de evoluir.',
    icon: Blocks,
  },
  {
    number: '03',
    title: 'Refinar',
    description:
      'Revisar hierarquia, adaptação a diferentes telas e acessibilidade antes de considerar a interface pronta.',
    icon: ListChecks,
  },
];

export function Manifesto() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="processo"
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      aria-labelledby="manifesto-title"
    >
      <div
        className="pointer-events-none absolute -left-48 top-20 size-[30rem] rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
              // 03 — Forma de trabalhar
            </p>
            <h2
              id="manifesto-title"
              className="display max-w-2xl text-4xl leading-[0.98] sm:text-5xl lg:text-6xl"
            >
              Da ideia à interface, <span className="text-primary">com clareza.</span>
            </h2>
          </div>
          <p className="max-w-xl border-l border-primary/40 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
            Um processo simples ajuda a tomar decisões melhores em cada etapa: entender o que
            precisa ser resolvido, construir uma base organizada e revisar a experiência com
            atenção.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3 lg:mt-14">
          {principles.map(({ number, title, description, icon: Icon }, index) => (
            <motion.article
              key={number}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: reduceMotion ? 0 : 0.35, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/45 sm:p-7"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.2em] text-primary">{number}</span>
                <Icon
                  className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <div
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
