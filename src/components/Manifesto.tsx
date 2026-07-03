import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll(
    mounted ? { target: ref, offset: ["start end", "end start"] } : undefined,
  );
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yFast = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={ref} className="relative py-40 overflow-hidden" aria-labelledby="manifesto-title">
      <motion.div
        style={{ y: yFast }}
        className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <span className="display text-[28vw] text-primary/5 leading-none whitespace-nowrap">
          CODE / CRAFT
        </span>
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-8">// Manifesto</div>
        <motion.h2
          id="manifesto-title"
          style={{ y }}
          className="display text-[clamp(3rem,14vw,16rem)] leading-[0.82]"
        >
          Código
          <br />
          com
          <br />
          <span className="text-primary text-glow">propósito.</span>
        </motion.h2>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl">
          <p className="text-muted-foreground">
            Acredito que cada linha de código é uma escolha. Escolho clareza, semântica e
            acessibilidade — porque interface boa começa pelo código por trás dela.
          </p>
          <p className="text-muted-foreground md:mt-12">
            Estudo todo dia. Leio docs, replico projetos, contribuo no GitHub. Ser júnior não é
            limitação — é o ponto de partida da minha curva de crescimento.
          </p>
          <p className="text-muted-foreground md:mt-24">
            Quero entrar em um time, aprender com gente experiente e entregar valor real. Sem
            atalhos, sem hype — só trabalho consistente e bem feito.
          </p>
        </div>
      </div>
    </section>
  );
}
