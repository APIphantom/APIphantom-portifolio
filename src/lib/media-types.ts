export type MediaType = "image" | "video" | "gif";

export type MediaCategory =
  | "thumbnail"
  | "banner"
  | "gallery"
  | "cover"
  | "demo"
  | "mobile"
  | "desktop"
  | "logo"
  | "before_after"
  | "hero_video"
  | "tablet"
  | "misc"
  | "document";

export type ProjectMedia = {
  id: string;
  projectId: string | null;
  type: MediaType;
  category: MediaCategory;
  name: string;
  url: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  alt: string | null;
  caption: string | null;
  sortOrder: number;
  folder: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaUpload = {
  name: string;
  type: string;
  size: number;
  file?: File;
  url?: string;
  folder?: string;
  projectId?: string;
  category?: MediaCategory;
  alt?: string;
  caption?: string;
  sortOrder?: number;
  width?: number;
  height?: number;
  duration?: number;
};

export type MediaResponse = {
  item: ProjectMedia;
};
