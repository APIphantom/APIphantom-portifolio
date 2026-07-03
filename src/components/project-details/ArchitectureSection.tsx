import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, HardDrive, Monitor, Server, Wallet, User } from "lucide-react";

type Props = {
  description: string;
  technologies: string[];
};

const flow = [
  { label: "Cliente", icon: User },
  { label: "Frontend", icon: Monitor },
  { label: "API", icon: Server },
  { label: "Banco", icon: Database },
  { label: "Storage", icon: HardDrive },
  { label: "Pagamento", icon: Wallet },
];

export function ArchitectureSection({ description, technologies }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ciclo de ativação para o efeito de glow nos itens
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % flow.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="architecture" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-background/45 backdrop-blur-xl p-6 md:p-10 flex flex-col h-full"
      >
        <div className="grid items-center gap-3 mb-10">
          <span className="text-xs uppercase tracking-[0.5em] text-primary">// 05 — Arquitetura</span>
          <p className="display text-[clamp(2rem,6vw,5rem)] leading-[0.95] max-w-4xl">
            <span className="text-primary text-glow">Arquitetura</span> do projeto.
          </p>
        </div>

        <div className="flex-grow grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col h-full gap-6">

            {/* Grade de Arquitetura com Glow Dinâmico */}
            <div className="grid md:grid-cols-1 gap-3">
              {flow.map((item, i) => (
                <motion.div
                  key={item.label}
                  animate={{
                    borderColor: activeIndex === i ? "rgba(250, 204, 21, 0.8)" : "rgba(255, 255, 255, 0.1)",
                    boxShadow: activeIndex === i ? "0 0 15px rgba(250, 204, 21, 0.3)" : "none"
                  }}
                  className="relative rounded-xl border bg-background/55 p-3 transition-colors"
                >
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <item.icon className="size-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fluxo de Dados Animado Corrigido */}
            <motion.div className="flex-grow flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-background/45 p-8">
              <div className="relative h-12 w-full flex items-center justify-center">
                {/* O 'overflow-hidden' aqui é essencial para a animação da barra */}
                <div className="h-0.5 w-full bg-border/50 rounded-full relative overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute top-0 left-0 w-20 h-full bg-primary shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                  />
                </div>
              </div>
              <p className="text-xs text-primary/70 font-bold tracking-widest uppercase mt-4">
                Processando: {flow[activeIndex].label}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">Tecnologias</div>
              <ul className="space-y-2">
                {technologies.map((item) => (
                  <li key={item} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 hover:border-primary/45 transition-colors">
                    <span className="text-sm">{item}</span>
                    <span className="text-xs text-muted-foreground">Stack</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}