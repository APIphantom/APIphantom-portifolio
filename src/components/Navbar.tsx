import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

const links = [
  { href: "#home", label: "Home" },
  { href: "#sobre", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#projetos", label: "Projetos" },
  { href: "#visao", label: "Visão" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl bg-background/60 border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-cursor="hover"
            aria-label="Início — Adriano Oliveira"
          >
            <span
              className="inline-block w-2.5 h-2.5 bg-primary rounded-sm group-hover:rotate-45 transition-transform"
              aria-hidden="true"
            />
            <span className="font-black tracking-[-0.05em] text-lg">
              ADRIANO<span className="text-primary">/</span>DEV
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="px-4 py-2 text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {l.label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>
            <a
              href="#contato"
              data-cursor="hover"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-bold bg-primary text-primary-foreground rounded-full hover:glow-neon transition-shadow"
            >
              Let's Talk
            </a>
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 rounded-md border border-border"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 95% 5%)" }}
            animate={{ clipPath: "circle(150% at 95% 5%)" }}
            exit={{ clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
            className="fixed inset-0 z-[60] bg-background md:hidden flex flex-col"
          >
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="relative flex items-center justify-between p-6 border-b border-border">
              <span className="font-black tracking-tight">
                ADRIANO<span className="text-primary">/</span>DEV
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-md border border-border"
                aria-label="Fechar menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="relative flex flex-col flex-1 px-6 py-10 gap-1 overflow-y-auto">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + 0.07 * i, ease: [0.65, 0, 0.35, 1] }}
                  className="group flex items-baseline justify-between py-4 border-b border-border"
                >
                  <span className="display text-5xl group-hover:text-primary transition-colors">
                    {l.label.toUpperCase()}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground tabular-nums">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="relative p-6 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tema
                </span>
                <ThemeSwitcher />
              </div>
              <a
                href="#contato"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center items-center px-6 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest text-sm hover:glow-neon"
              >
                Let's Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
