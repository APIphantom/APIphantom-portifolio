import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useRouterState } from "@tanstack/react-router";

/**
 * Wraps <Outlet /> in a crossfade keyed by pathname.
 * - mode="wait" prevents two routes overlapping
 * - tiny opacity-only transform avoids layout shift / scroll glitches
 * - SSR-safe: initial frame is opacity 1 to keep first paint instant
 */
export function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
