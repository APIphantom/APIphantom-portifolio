import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Tailwind aspect class, e.g. "aspect-[4/5]" */
  aspect?: string;
  /** Eager-load the LCP image. Defaults to lazy. */
  priority?: boolean;
  /** Solid color shown before the image decodes. */
  placeholderColor?: string;
};

/**
 * Performance-friendly <img>:
 *  - loading=lazy + decoding=async by default
 *  - fetchpriority=high for above-the-fold (priority)
 *  - blur-up + fade-in when bytes land
 *  - reserves space via aspect ratio (no CLS)
 */
export function LazyImage({
  src,
  alt,
  className,
  aspect = "aspect-[4/5]",
  priority = false,
  placeholderColor = "var(--muted)",
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={cn("relative overflow-hidden", aspect)}
      style={{ backgroundColor: placeholderColor }}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 via-muted to-background transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100 animate-pulse",
        )}
      />
      {src ? (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-[opacity,transform,filter] duration-700",
            loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
            className,
          )}
          {...rest}
        />
      ) : null}
    </div>
  );
}
