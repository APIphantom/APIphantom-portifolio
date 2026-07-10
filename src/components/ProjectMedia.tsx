import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, VideoHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { detectMediaKind, resolveVideoOptions, type VideoMediaOptions } from "@/lib/project-media";

type Props = {
  src?: string | null;
  alt?: string;
  className?: string;
  mediaType?: string | null;
  mimeType?: string | null;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className">;
  videoProps?: Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "className">;
  videoOptions?: VideoMediaOptions;
  containerProps?: Omit<HTMLAttributes<HTMLDivElement>, "className">;
  fit?: "cover" | "contain";
  poster?: string;
};

export function ProjectMedia({
  src,
  alt = "",
  className,
  mediaType,
  mimeType,
  imageProps,
  videoProps,
  videoOptions,
  containerProps,
  fit,
  poster,
}: Props) {
  if (!src) return null;

  const kind = detectMediaKind({ src, mediaType, mimeType });
  const resolvedVideo = resolveVideoOptions(videoOptions);
  const objectFit = fit ?? resolvedVideo.objectFit ?? "cover";
  const style: CSSProperties = { objectFit };

  if (kind === "video") {
    return (
      <div {...containerProps}>
        <video
          src={src}
          className={cn(className)}
          controls={resolvedVideo.controls}
          autoPlay={resolvedVideo.autoplay}
          muted={resolvedVideo.muted}
          loop={resolvedVideo.loop}
          playsInline={resolvedVideo.playsInline}
          preload={resolvedVideo.preload}
          poster={resolvedVideo.poster ?? poster}
          style={style}
          {...videoProps}
        />
      </div>
    );
  }

  return (
    <div {...containerProps}>
      <img
        src={src}
        alt={alt}
        className={cn(className)}
        loading={imageProps?.loading ?? "lazy"}
        style={style}
        {...imageProps}
      />
    </div>
  );
}
