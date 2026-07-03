import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll(
    mounted ? { target: ref, offset: ["start end", "end start"] } : undefined,
  );
  const x = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      id="visao"
      ref={ref}
      className="relative py-32 px-6 lg:px-10 overflow-hidden border-y border-border"
      aria-labelledby="visao-title"
    >
      <div className="absolute inset-0 -z-10 scanlines opacity-40" aria-hidden="true" />
      <motion.div style={{ x }} className="text-xs uppercase tracking-[0.5em] text-primary mb-8">
        // 04 — Minha visão como dev
      </motion.div>

      <div className="mx-auto max-w-6xl">
        <h2 id="visao-title" className="display text-[clamp(2.5rem,9vw,8rem)]">
          Interfaces
          <br />
          que <span className="text-muted-foreground">resolvem</span>{" "}
          <span className="text-primary text-glow">problemas.</span>
        </h2>
        <p className="mt-12 max-w-2xl text-lg md:text-2xl text-muted-foreground leading-relaxed">
          Penso o front-end como ponte entre{" "}
          <span className="text-foreground font-bold">design</span>,{" "}
          <span className="text-foreground">código</span> e{" "}
          <span className="text-foreground">pessoas</span>. O usuário não enxerga a stack — enxerga
          a experiência. É nela que coloco minha energia.
        </p>

        <div className="mt-16 grid sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {[
            { k: "Design", v: "Fidelidade ao layout, hierarquia e consistência visual" },
            { k: "Código", v: "Componentizado, tipado, com boas práticas e testes" },
            { k: "UX", v: "Acessível, responsivo e performático em qualquer device" },
          ].map((b) => (
            <div key={b.k} className="bg-card p-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-primary">// {b.k}</div>
              <p className="mt-3 text-sm text-muted-foreground">{b.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
