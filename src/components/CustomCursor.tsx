import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  // Removemos o estado 'hover' do React, pois ele causa re-render desnecessário

  useEffect(() => {
    if (typeof window === "undefined") return;
    const can = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!can) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Atualização direta no DOM para evitar renderização do React
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      }

      // Verificação de elementos interativos usando manipulação direta de classes
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        'a, button, [data-cursor], input, textarea, select, label',
      );
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;
      const cursorKind = cursorTarget?.dataset.cursor || (isInteractive ? "open" : "");

      if (ring.current) {
        ring.current.classList.toggle("is-hovering", isInteractive);
      }

      if (label.current) {
        const text =
          cursorKind === "view"
            ? "VIEW"
            : cursorKind === "details"
              ? "DETAILS"
              : cursorKind === "open" || cursorKind === "hover"
                ? "OPEN"
                : "";
        label.current.textContent = text;
        label.current.style.opacity = text ? "1" : "0";
      }
    };

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[10000] size-2 rounded-full bg-primary mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        aria-hidden
        // Adicionei .is-hovering no CSS para substituir o estado do React
        className="pointer-events-none fixed top-0 left-0 z-[10000] size-9 rounded-full border border-primary transition-[width,height,border-color,opacity] duration-200 [.is-hovering_&]:scale-150 [.is-hovering_&]:bg-primary/10"
        style={{ willChange: "transform" }}
      >
        <span
          ref={label}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold tracking-[0.2em] text-primary opacity-0 transition-opacity duration-150"
        />
      </div>
    </>
  );
}
