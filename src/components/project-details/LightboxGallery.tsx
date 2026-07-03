import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  images: string[];
  index: number | null;
  onClose: () => void;
};

export function LightboxGallery({ images, index, onClose }: Props) {
  const reducedMotion = useReducedMotion();
  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-black/90 backdrop-blur-md p-4 md:p-10"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors"
            aria-label="Fechar galeria"
          >
            <X className="size-4" /> Fechar
          </button>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.25 }}
            className="h-full w-full flex items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={current}
              alt="Preview"
              className="max-h-[88vh] max-w-[92vw] rounded-2xl border border-border/80 object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
