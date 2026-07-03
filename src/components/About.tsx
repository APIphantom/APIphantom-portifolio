import { motion } from "framer-motion";
import { Code2, Palette, Smartphone, Zap } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { useSettings } from "@/lib/projects-store";

const cards = [
  {
    icon: Code2,
    title: "Clean Code",
    text: "React, TypeScript e arquitetura componentizada com foco em manutenibilidade.",
  },
  {
    icon: Palette,
    title: "UI Cuidada",
    text: "Interfaces com hierarquia clara, atenção ao detalhe e fidelidade ao design.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    text: "Experiências fluidas em qualquer dispositivo, do mobile ao desktop.",
  },
  {
    icon: Zap,
    title: "Performance",
    text: "Carregamento rápido, lazy loading e animações suaves sem sacrificar UX.",
  },
];

export function About() {
  const { settings } = useSettings();
  const displayName = settings.name || "Adriano Oliveira";

  return (
    <section id="sobre" className="relative py-32 px-6 lg:px-10" aria-labelledby="sobre-title">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
              // 01 — Sobre mim
            </div>
            <h2 id="sobre-title" className="display text-5xl md:text-7xl">
              Front-End
              <br />
              Júnior em
              <br />
              <span className="text-primary">evolução</span>
              <br />
              constante.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 relative w-56 h-56 rounded-2xl overflow-hidden border border-border bg-card"
          >
            <LazyImage
              src="/profile-photo.jpg"
              alt={`Foto de ${displayName}`}
              aspect="aspect-square"
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-primary/10" />
            <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest">
              <div className="text-muted-foreground">Avatar</div>
              <div className="text-foreground font-bold">Adriano // 26</div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <motion.p
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
          >
            Sou <span className="text-foreground font-medium">{displayName}</span>, apaixonado por
            transformar ideias em experiências digitais modernas.
            {settings.bio ? (
              <span> {settings.bio}</span>
            ) : (
              <span>
                {" "}
                Atualmente estudo{" "}
                <span className="text-foreground">React, Next.js e TypeScript</span> a fundo,
                construo projetos pessoais para fixar o aprendizado e busco minha primeira
                oportunidade no mercado.
              </span>
            )}
          </motion.p>

          <motion.p
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-muted-foreground leading-relaxed"
          >
            Acredito que ser júnior é uma vantagem: trago energia, curiosidade e vontade real de
            crescer junto com um time. Cada projeto novo é uma chance de aplicar boas práticas,
            entender padrões do mercado e entregar algo melhor do que ontem.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 1, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors relative overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-2xl transition-all"
                  aria-hidden="true"
                />
                <c.icon className="size-6 text-primary mb-4" aria-hidden="true" />
                <div className="font-bold text-lg">{c.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
