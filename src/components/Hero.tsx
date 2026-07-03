import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { useSettings } from "@/lib/projects-store";

const TITLE_TOP = "ADRIANO".split("");
const TITLE_BOT = "DEV".split("");

export function Hero() {
  const { settings } = useSettings();
  const displayName = settings.name || "Adriano Oliveira";
  const role = settings.role || "Desenvolvedor Front-End Júnior";
  const cvHref = settings.cvUrl || "/cv-adriano-oliveira.pdf";
  const isExternalCv = /^https?:\/\//i.test(cvHref);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden flex items-center pt-24 pb-24"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 scanlines opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--glow-color),0.15),transparent_55%)]" />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 top-1/3 w-[700px] h-[700px] rounded-full border border-primary/20"
        >
          <div className="absolute inset-10 rounded-full border border-primary/10" />
          <div className="absolute inset-24 rounded-full border border-primary/5" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 bottom-10 w-[420px] h-[420px] rounded-full bg-primary/20 blur-[130px]"
        />
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="size-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Disponível para oportunidades — 2026
            </span>
          </motion.div>

          <h1
            id="hero-title"
            className="display text-[clamp(3.5rem,12vw,11rem)] leading-[0.82] overflow-hidden"
          >
            <span className="block">
              {TITLE_TOP.map((l, i) => (
                <motion.span
                  key={`t-${i}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.65, 0, 0.35, 1] }}
                  className="inline-block"
                >
                  {l}
                </motion.span>
              ))}
            </span>
            <span className="block text-primary text-glow">
              {TITLE_BOT.map((l, i) => (
                <motion.span
                  key={`b-${i}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.45 + i * 0.05, ease: [0.65, 0, 0.35, 1] }}
                  className="inline-block"
                >
                  {l}
                </motion.span>
              ))}
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.75 }}
                className="inline-block"
              >
                .
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            <span className="text-foreground font-medium">
              Sou {displayName}, {role}.
            </span>{" "}
            {settings.bio ||
              "Transformo ideias em interfaces modernas, responsivas e acessíveis com React, Next.js, TypeScript e Tailwind — focado em performance e boas práticas."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <MagneticButton
              onClick={() =>
                document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-xs hover:glow-neon transition-all min-h-11"
            >
              Ver Projetos
              <ArrowDown
                className="size-4 group-hover:translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            </MagneticButton>
            <a
              href={cvHref}
              download={isExternalCv ? undefined : true}
              target={isExternalCv ? "_blank" : undefined}
              rel={isExternalCv ? "noreferrer" : undefined}
              data-cursor="hover"
              className="inline-flex items-center gap-2 px-6 py-4 border border-border rounded-full font-bold uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-colors min-h-11"
            >
              <Download className="size-4" aria-hidden="true" /> Download CV
            </a>
            <a
              href="#contato"
              data-cursor="hover"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground transition-colors min-h-11"
            >
              <Mail className="size-4" aria-hidden="true" /> Contato
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="lg:col-span-4 space-y-4 text-xs uppercase tracking-widest"
        >
          <div className="border-l-2 border-primary pl-4">
            <div className="text-muted-foreground">Portfólio / V.2026</div>
            <div className="text-foreground font-bold mt-1">{role}</div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { k: "React", v: "Stack principal" },
              { k: "TS", v: "Tipagem forte" },
              { k: "10+", v: "Projetos pessoais" },
              { k: "24/7", v: "Aprendendo" },
            ].map((s) => (
              <div key={s.v} className="bg-card p-4">
                <div className="text-3xl font-black text-primary">{s.k}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-y border-border bg-background/40 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["REACT", "TAILWIND", "TYPESCRIPT", "NEXT.JS", "VITE", "FIGMA", "GIT", "REST API"].map(
              (t, i) => (
                <span
                  key={`${k}-${i}`}
                  className="mx-8 text-sm font-black tracking-widest text-muted-foreground"
                >
                  {t} <span className="text-primary">★</span>
                </span>
              ),
            ),
          )}
        </div>
      </div>
    </section>
  );
}
