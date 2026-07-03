import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 120,
    damping: reducedMotion ? 1000 : 24,
    mass: 0.3,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-0.5 w-full origin-left bg-primary shadow-[0_0_22px_rgba(255,212,0,0.55)]"
      style={{ scaleX: smooth }}
    />
  );
}
