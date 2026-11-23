import { useCallback, useMemo, useRef } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueryClient as useQc,
} from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  listProjects,
  listPublishedProjects,
  upsertProject,
  deleteProject,
  duplicateProjectFn,
  getProjectById,
  listTechnologies,
  upsertTechnology,
  deleteTechnology,
  listMedia,
  listProjectMedia,
  createMediaUpload,
  registerUploadedMedia,
  deleteMedia,
  getSettings,
  getAdminSettings,
  updateSettings,
} from './portfolio.functions';
import type { MediaUpload, ProjectMedia } from './media-types';
import type { VideoMediaOptions } from './project-media';
import { SUPABASE_PUBLIC } from '@/integrations/supabase/client';

/* ============ TIPOS (mantidos da versão antiga) ============ */
export type ProjectCategory = 'web' | 'ui' | 'ecommerce' | 'experiment' | 'mobile';
export type ProjectStatus = 'published' | 'draft' | 'archived' | 'in_review';
export type ProjectVisibility = 'public' | 'private';

export type ContentBlock = {
  id: string;
  kind: 'objective' | 'problem' | 'solution' | 'process' | 'result' | 'custom';
  title: string;
  description: string;
  icon?: string;
};

export type Metric = {
  id: string;
  title: string;
  value: string;
  prefix?: string;
  suffix?: string;
  description?: string;
};

export type SEO = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterImage?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  structuredData?: string;
};

export type Publication = {
  status: ProjectStatus;
  publishedAt?: string;
  scheduledFor?: string;
  visibility: ProjectVisibility;
  featured?: boolean;
};

import type { CaseStudyV2 } from './case-study';

export type LegacyCaseStudy = {
  problemStatement?: string;
  roles?: string[];
  architecture?: string;
  systemFlow?: string;
  features?: string[];
  databaseStructure?: string;
  timeline?: string[];
  developmentProcess?: string[];
  performance?: Metric[];
  codeNumbers?: Metric[];
  mediaSettings?: ProjectMediaSettings;
};

export type CaseStudy = LegacyCaseStudy | CaseStudyV2;

export type ProjectMediaSettings = {
  thumbnail?: VideoMediaOptions;
  hero?: VideoMediaOptions;
  heroVideo?: VideoMediaOptions;
  desktopMockup?: VideoMediaOptions;
  tabletMockup?: VideoMediaOptions;
  mobileMockup?: VideoMediaOptions;
  preview?: VideoMediaOptions;
  gallery?: Record<number, VideoMediaOptions>;
  seoOg?: VideoMediaOptions;
  seoTwitter?: VideoMediaOptions;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  heroImage?: string;
  heroVideo?: string;
  gallery?: string[];
  galleryLabels?: string[];
  desktopMockup?: string;
  tabletMockup?: string;
  mobileMockup?: string;
  previewGif?: string;
  tech: string[];
  category: ProjectCategory;
  github?: string;
  demo?: string;
  objective?: string;
  problem?: string;
  solution?: string;
  result?: string;
  contentBlocks?: ContentBlock[];
  metrics?: Metric[];
  seo?: SEO;
  publication?: Publication;
  caseStudy?: CaseStudy;
  client?: string;
  year?: string;
  duration?: string;
  role?: string;
  displayOrder?: number;
  updatedAt?: string;
};

export const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'web', label: 'Web App' },
  { value: 'ui', label: 'UI/Design' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'experiment', label: 'Experimento' },
  { value: 'mobile', label: 'Mobile' },
];

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

/* ============ HOOKS ============ */
export function useProjects(opts?: { publishedOnly?: boolean }) {
  const qc = useQueryClient();
  const list = useServerFn(listProjects);
  const listPublished = useServerFn(listPublishedProjects);
  const upsert = useServerFn(upsertProject);
  const del = useServerFn(deleteProject);
  const dup = useServerFn(duplicateProjectFn);

  const q = useQuery({
    queryKey: ['projects', opts?.publishedOnly ? 'published' : 'all'],
    queryFn: () => (opts?.publishedOnly ? listPublished() : list()),
    staleTime: 30_000,
  });
  const projects = useMemo(() => (q.data ?? []) as Project[], [q.data]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['projects'] });

  const fetchById = useServerFn(getProjectById);

  const mUpsert = useMutation({
    mutationFn: (p: Omit<Project, 'id'> & { id?: string }) => upsert({ data: p }),
    onSuccess: invalidate,
  });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: invalidate,
  });
  const mDup = useMutation({
    mutationFn: (id: string) => dup({ data: { id } }),
    onSuccess: invalidate,
  });

  const addProject = useCallback(
    async (p: Omit<Project, 'id' | 'slug'> & { slug?: string }) => {
      const slug = p.slug || slugify(p.title) || uid().slice(0, 8);
      await mUpsert.mutateAsync({ ...p, slug });
    },
    [mUpsert],
  );

  const updateProject = useCallback(
    async (id: string, patch: Partial<Project>) => {
      const current = projects.find((x) => x.id === id);
      if (!current) throw new Error('Projeto não encontrado para atualização');
      await mUpsert.mutateAsync({ ...current, ...patch, id });
    },
    [mUpsert, projects],
  );

  const removeProject = useCallback((id: string) => mDel.mutate(id), [mDel]);
  const duplicateProject = useCallback((id: string) => mDup.mutate(id), [mDup]);

  return {
    projects,
    addProject,
    updateProject,
    removeProject,
    duplicateProject,
    getById: (id: string) => fetchById({ data: { id } }),
    loaded: !q.isPending,
    saving: mUpsert.isPending,
  };
}

/* ============ MEDIA ============ */
export type MediaItem = ProjectMedia;

const MEDIA_UPLOAD_CHUNK_SIZE = 6 * 1024 * 1024;
const MEDIA_UPLOAD_RETRY_DELAYS = [0, 1500, 3000, 6000];

function encodeUploadMetadata(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function tusError(response: Response) {
  return response.text().then((body) => {
    const detail = body.trim().slice(0, 600);
    return new Error(detail || `Upload do Supabase falhou (HTTP ${response.status}).`);
  });
}

async function uploadWithTus(
  file: File,
  storagePath: string,
  token: string,
  contentType: string,
  onProgress?: (progress: number) => void,
) {
  const projectHost = new URL(SUPABASE_PUBLIC.url).hostname.split('.')[0];
  const endpoint = `https://${projectHost}.storage.supabase.co/storage/v1/upload/resumable`;
  const metadata = [
    ['bucketName', 'media'],
    ['objectName', storagePath],
    ['contentType', contentType],
    ['cacheControl', '3600'],
  ]
    .map(([key, value]) => `${key} ${encodeUploadMetadata(value)}`)
    .join(',');

  const createResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLIC.key,
      'x-signature': token,
      'Tus-Resumable': '1.0.0',
      'Upload-Length': String(file.size),
      'Upload-Metadata': metadata,
    },
  });
  if (!createResponse.ok) throw await tusError(createResponse);

  const location = createResponse.headers.get('Location');
  if (!location) throw new Error('O Supabase não retornou o endereço para continuar o upload.');
  const uploadUrl = new URL(location, endpoint).toString();
  let offset = Number(createResponse.headers.get('Upload-Offset') ?? 0);
  onProgress?.(file.size === 0 ? 100 : Math.round((offset / file.size) * 100));

  while (offset < file.size) {
    const chunk = file.slice(offset, Math.min(offset + MEDIA_UPLOAD_CHUNK_SIZE, file.size));
    let response: Response | undefined;

    for (let attempt = 0; attempt < MEDIA_UPLOAD_RETRY_DELAYS.length; attempt += 1) {
      const delay = MEDIA_UPLOAD_RETRY_DELAYS[attempt];
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));

      try {
        response = await fetch(uploadUrl, {
          method: 'PATCH',
          headers: {
            apikey: SUPABASE_PUBLIC.key,
            'x-signature': token,
            'Tus-Resumable': '1.0.0',
            'Upload-Offset': String(offset),
            'Content-Type': 'application/offset+octet-stream',
          },
          body: chunk,
        });
      } catch (error) {
        if (attempt === MEDIA_UPLOAD_RETRY_DELAYS.length - 1) throw error;
        continue;
      }

      if (response.status === 409) {
        const serverOffset = Number(response.headers.get('Upload-Offset'));
        if (Number.isInteger(serverOffset) && serverOffset > offset && serverOffset <= file.size) {
          offset = serverOffset;
          response = undefined;
          break;
        }
      }

      if (response.ok) break;
      if (response.status < 500 && response.status !== 429) throw await tusError(response);
      if (attempt === MEDIA_UPLOAD_RETRY_DELAYS.length - 1) throw await tusError(response);
    }

    if (!response) continue;
    if (!response.ok) throw await tusError(response);

    const nextOffset = Number(response.headers.get('Upload-Offset'));
    if (!Number.isInteger(nextOffset) || nextOffset <= offset || nextOffset > file.size) {
      throw new Error('O Supabase retornou uma posição inválida para o upload.');
    }
    offset = nextOffset;
    onProgress?.(Math.round((offset / file.size) * 100));
  }
}

async function resolveMediaFile(media: MediaUpload) {
  if (media.file) return media.file;
  if (!media.url?.startsWith('data:')) throw new Error('Upload precisa de arquivo ou data URI.');
  const response = await fetch(media.url);
  const blob = await response.blob();
  return new File([blob], media.name, { type: media.type || blob.type });
}

export function useMedia(options?: { includeLibrary?: boolean; projectId?: string }) {
  const qc = useQc();
  const list = useServerFn(listMedia);
  const createUpload = useServerFn(createMediaUpload);
  const registerUpload = useServerFn(registerUploadedMedia);
  const del = useServerFn(deleteMedia);

  const q = useQuery({
    queryKey: ['media', options?.projectId ?? 'all'],
    queryFn: () => list({ data: { projectId: options?.projectId } }),
    staleTime: 30_000,
    enabled: options?.includeLibrary !== false,
  });
  const items = (q.data ?? []) as MediaItem[];

  const invalidate = () => qc.invalidateQueries({ queryKey: ['media'] });

  const mUp = useMutation({
    mutationFn: async (m: MediaUpload) => {
      const file = await resolveMediaFile(m);
      const type = m.type || file.type || 'application/octet-stream';
      const metadata = {
        name: m.name,
        type,
        size: file.size,
        folder: m.folder ?? '',
        projectId: m.projectId,
        category: m.category,
        alt: m.alt,
        caption: m.caption,
        sortOrder: m.sortOrder,
        width: m.width,
        height: m.height,
        duration: m.duration,
      };
      const { path, token } = await createUpload({ data: metadata });
      await uploadWithTus(file, path, token, type, m.onProgress);
      return registerUpload({ data: { ...metadata, storagePath: path } });
    },
    onSuccess: invalidate,
    retry: 2,
  });

  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: invalidate,
  });

  const add = useCallback((m: MediaUpload) => mUp.mutate(m), [mUp]);
  const addAsync = useCallback((m: MediaUpload) => mUp.mutateAsync(m), [mUp]);
  const remove = useCallback((id: string) => mDel.mutate(id), [mDel]);

  return { items, add, addAsync, remove, uploading: mUp.isPending, uploadError: mUp.error };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function useProjectMedia(projectId?: string, category?: string) {
  const list = useServerFn(listProjectMedia);
  const enabled = Boolean(projectId && UUID_RE.test(projectId));
  const q = useQuery({
    queryKey: ['media', 'project', projectId, category ?? 'all'],
    queryFn: () => list({ data: { projectId: projectId as string, category } }),
    staleTime: 30_000,
    enabled,
  });

  return { items: (q.data ?? []) as MediaItem[], loading: q.isLoading };
}

/* ============ TECHNOLOGIES ============ */
export type Technology = {
  id: string;
  name: string;
  category: string;
  url?: string;
  color?: string;
  icon?: string;
};

export function useTechnologies() {
  const qc = useQc();
  const list = useServerFn(listTechnologies);
  const ups = useServerFn(upsertTechnology);
  const del = useServerFn(deleteTechnology);

  const q = useQuery({ queryKey: ['technologies'], queryFn: () => list(), staleTime: 30_000 });
  const items = useMemo(() => (q.data ?? []) as Technology[], [q.data]);
  const invalidate = () => qc.invalidateQueries({ queryKey: ['technologies'] });

  const mUp = useMutation({
    mutationFn: (t: Omit<Technology, 'id'> & { id?: string }) => ups({ data: t }),
    onSuccess: invalidate,
  });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: invalidate,
  });

  const add = useCallback((t: Omit<Technology, 'id'>) => mUp.mutate(t), [mUp]);
  const update = useCallback(
    (id: string, patch: Partial<Technology>) => {
      const cur = items.find((x) => x.id === id);
      if (!cur) return;
      mUp.mutate({ ...cur, ...patch, id });
    },
    [mUp, items],
  );
  const remove = useCallback((id: string) => mDel.mutate(id), [mDel]);

  return { items, add, update, remove };
}

/* ============ SETTINGS ============ */
export type Settings = {
  name: string;
  role: string;
  bio: string;
  email: string;
  location: string;
  cvUrl: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  githubToken?: string;
  githubUsername?: string;
  theme?: string;
};

const settingsDefaults: Settings = {
  name: 'Adriano Oliveira',
  role: 'Desenvolvedor Front-End Júnior',
  bio: '',
  email: '',
  location: 'Brasil',
  cvUrl: '/cv-adriano-oliveira.pdf',
  github: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  githubUsername: '',
  githubToken: '',
};

export function useSettings(options?: { includeSecrets?: boolean }) {
  const qc = useQc();
  const getPublic = useServerFn(getSettings);
  const getAdmin = useServerFn(getAdminSettings);
  const queryKey = ['settings', options?.includeSecrets ? 'admin' : 'public'];
  const upd = useServerFn(updateSettings);
  const updateQueue = useRef(Promise.resolve());

  const q = useQuery({
    queryKey,
    queryFn: () => (options?.includeSecrets ? getAdmin() : getPublic()),
    staleTime: 60_000,
  });
  const settings = (q.data ?? settingsDefaults) as Settings;

  const mUpd = useMutation({
    mutationFn: (patch: Partial<Settings>) => upd({ data: patch }),
    onSuccess: (data) => {
      qc.setQueryData(queryKey, data);
    },
  });

  const update = useCallback(
    (patch: Partial<Settings>) => {
      const pending = updateQueue.current.then(() => mUpd.mutateAsync(patch));
      updateQueue.current = pending.then(
        () => undefined,
        () => undefined,
      );
      return pending;
    },
    [mUpd],
  );

  return { settings, update, loaded: !q.isPending, saving: mUpd.isPending };
}
