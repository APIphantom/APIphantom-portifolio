export type MediaType = 'image' | 'video' | 'gif';

export type MediaCategory =
  | 'thumbnail'
  | 'banner'
  | 'gallery'
  | 'cover'
  | 'demo'
  | 'mobile'
  | 'desktop'
  | 'logo'
  | 'before_after'
  | 'hero_video'
  | 'tablet'
  | 'misc'
  | 'document';

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
  onProgress?: (progress: number) => void;
};

export type MediaResponse = {
  item: ProjectMedia;
};

const MEDIA_MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  pdf: 'application/pdf',
};

export function getMediaMimeType(file: Pick<File, 'name' | 'type'>) {
  const extension = file.name.toLowerCase().split('.').pop() ?? '';
  const inferredType = MEDIA_MIME_BY_EXTENSION[extension];
  const browserType = file.type.trim().toLowerCase();
  return !browserType || browserType === 'application/octet-stream'
    ? inferredType ?? browserType
    : browserType;
}
