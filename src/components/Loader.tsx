import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setPct(100);
        setTimeout(() => setDone(true), 450);
      } else {
        setPct(Math.floor(p));
      }
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-[10001] bg-background flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div
            className="absolute inset-x-0 top-0 h-px bg-primary"
            style={{ transform: `scaleX(${pct / 100})`, transformOrigin: "left" }}
          />

          <div className="relative text-center px-6">
            <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
              Loading drop // V.2026
            </div>
            <motion.h1
              className="display text-[clamp(3rem,12vw,9rem)] text-glow"
              animate={{ x: [0, -2, 2, 0], opacity: [1, 0.85, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.2 }}
            >
              ADRIANO<span className="text-primary">/</span>DEV
            </motion.h1>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs tabular-nums tracking-widest text-muted-foreground">
              <span className="size-1.5 bg-primary animate-blink" />
              <span>{String(pct).padStart(3, "0")}%</span>
              <span>—</span>
              <span>booting interface</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
