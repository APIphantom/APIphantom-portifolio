export type MediaKind = "image" | "gif" | "video";

export type VideoMediaOptions = {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
  objectFit?: "cover" | "contain";
};

export const DEFAULT_VIDEO_MEDIA_OPTIONS: Required<VideoMediaOptions> = {
  autoplay: false,
  controls: true,
  muted: false,
  loop: false,
  playsInline: true,
  poster: "",
  preload: "metadata",
  objectFit: "cover",
};

export function detectMediaKind(input: {
  src?: string | null;
  mediaType?: string | null;
  mimeType?: string | null;
}): MediaKind {
  const mediaType = String(input.mediaType ?? "").toLowerCase();

  if (mediaType === "video") return "video";
  if (mediaType === "gif") return "gif";
  if (mediaType === "image") return "image";

  const mimeType = String(input.mimeType ?? "").toLowerCase();

  if (mimeType === "image/gif") return "gif";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";

  const src = String(input.src ?? "").toLowerCase();

  if (src.startsWith("data:video/")) return "video";
  if (src.startsWith("data:image/gif")) return "gif";

  const ext = src.split(".").pop()?.split("?")[0]?.split("#")[0] ?? "";

  if ([
    "mp4",
    "webm",
    "ogg",
    "ogv",
    "mov",
    "m4v",
    "avi",
    "mkv",
  ].includes(ext)) {
    return "video";
  }

  if (ext === "gif") {
    return "gif";
  }

  return "image";
}

export function resolveVideoOptions(
  options?: VideoMediaOptions
): Required<VideoMediaOptions> {
  return {
    ...DEFAULT_VIDEO_MEDIA_OPTIONS,
    ...options,
  };
}