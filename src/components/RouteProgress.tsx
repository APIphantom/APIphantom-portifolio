import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

/**
 * NProgress-style top bar driven by TanStack Router's load state.
 * Shows only when navigation takes more than 120ms (avoids flicker on
 * preloaded routes — which is the common case thanks to defaultPreload).
 */
export function RouteProgress() {
  const status = useRouterState({ select: (s) => s.status });
  const isLoading = status === "pending";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-0.5 origin-left bg-primary glow-neon"
          initial={{ scaleX: 0, opacity: 0.6 }}
          animate={{ scaleX: 0.7, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.25 } }}
        />
      )}
    </AnimatePresence>
  );
}
