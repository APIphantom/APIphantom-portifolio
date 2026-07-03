import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Props = {
  projectTitle: string;
};

export function FinalCTA({ projectTitle }: Props) {
  return (
    <section id="cta" className="px-6 lg:px-10 mt-14 scroll-mt-24 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16"
      >
        <div className="absolute -right-16 -bottom-24 display text-[18rem] text-primary/5 leading-none select-none pointer-events-none">
          {projectTitle.charAt(0)}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(255,212,0,0.16),transparent_48%)]" />

        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">12 / Contato</div>
            <h3 className="display text-4xl md:text-6xl">Gostou deste projeto?</h3>
            <p className="mt-3 text-2xl md:text-3xl text-primary font-bold">Vamos criar algo incrivel juntos.</p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              to="/"
              hash="contato"
              data-cursor="open"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:scale-[1.02] hover:glow-neon transition-all"
            >
              Solicitar Projeto
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/"
              hash="contato"
              data-cursor="open"
              className="group inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
            >
              Conversar
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
