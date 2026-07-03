import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ImageIcon } from "lucide-react";

type Props = {
  title: string;
  image?: string;
  status: string;
};

export function FloatingMockup({ title, image, status }: Props) {
  const reducedMotion = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rsx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.25 });
  const rsy = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.25 });

  return (
    <motion.div className="relative" style={{ willChange: "transform" }}>
      <motion.div
        className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-primary/35 bg-gradient-to-br from-graphite to-background"
        style={{ rotateX: rsx, rotateY: rsy, transformPerspective: 1200, transformStyle: "preserve-3d" }}
        onMouseMove={(event) => {
          if (reducedMotion) return;
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
          const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          ry.set(dx * 3);
          rx.set(-dy * 2.2);
        }}
        onMouseLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        data-cursor="details"
      >
        <div className="absolute -inset-6 -z-10 bg-[radial-gradient(circle,rgba(255,212,0,0.32),transparent_58%)] blur-3xl" />
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="display text-[9rem] text-primary/10">{title.charAt(0)}</span>
            <ImageIcon className="absolute size-10 text-muted-foreground/35" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </motion.div>

      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={reducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-5 left-5 rounded-xl border border-primary/35 bg-card/75 backdrop-blur px-4 py-3"
      >
        <div className="text-[9px] uppercase tracking-[0.28em] text-primary mb-1">Status</div>
        <div className="text-sm font-semibold">{status}</div>
      </motion.div>
    </motion.div>
  );
}
