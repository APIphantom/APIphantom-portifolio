import { useCallback, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueryClient as useQc,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listProjects,
  upsertProject,
  deleteProject,
  duplicateProjectFn,
  listTechnologies,
  upsertTechnology,
  deleteTechnology,
  listMedia,
  listProjectMedia,
  uploadMedia,
  deleteMedia,
  getSettings,
  updateSettings,
} from "./portfolio.functions";
import type { MediaUpload, ProjectMedia } from "./media-types";

/* ============ TIPOS (mantidos da versão antiga) ============ */
export type ProjectCategory = "web" | "ui" | "ecommerce" | "experiment" | "mobile";
export type ProjectStatus = "published" | "draft" | "archived";
export type ProjectVisibility = "public" | "private";

export type ContentBlock = {
  id: string;
  kind: "objective" | "problem" | "solution" | "process" | "result" | "custom";
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
  ogImage?: string;
  twitterImage?: string;
  robotsIndex?: boolean;
  structuredData?: string;
};

export type Publication = {
  status: ProjectStatus;
  publishedAt?: string;
  scheduledFor?: string;
  visibility: ProjectVisibility;
  featured?: boolean;
};

export type CaseStudy = {
  problemStatement?: string;
  roles?: string[];
  architecture?: string;
  systemFlow?: string;
  features?: string[];
  technicalChallenges?: string[];
  technicalDecisions?: string[];
  databaseStructure?: string;
  timeline?: string[];
  developmentProcess?: string[];
  roadmapDone?: string[];
  roadmapInProgress?: string[];
  roadmapPlanned?: string[];
  learnings?: string[];
  performance?: Metric[];
  codeNumbers?: Metric[];
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
  process?: string;
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
  { value: "web", label: "Web App" },
  { value: "ui", label: "UI/Design" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "experiment", label: "Experimento" },
  { value: "mobile", label: "Mobile" },
];

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

/* ============ HOOKS ============ */
export function useProjects() {
  const qc = useQueryClient();
  const list = useServerFn(listProjects);
  const upsert = useServerFn(upsertProject);
  const del = useServerFn(deleteProject);
  const dup = useServerFn(duplicateProjectFn);

  const q = useQuery({ queryKey: ["projects"], queryFn: () => list(), staleTime: 30_000 });
  const projects = useMemo(() => (q.data ?? []) as Project[], [q.data]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["projects"] });

  const mUpsert = useMutation({
    mutationFn: (p: Omit<Project, "id"> & { id?: string }) => upsert({ data: p }),
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
    async (p: Omit<Project, "id" | "slug"> & { slug?: string }) => {
      const slug = p.slug || slugify(p.title) || uid().slice(0, 8);
      await mUpsert.mutateAsync({ ...p, slug });
    },
    [mUpsert],
  );

  const updateProject = useCallback(
    async (id: string, patch: Partial<Project>) => {
      const current = projects.find((x) => x.id === id);
      if (!current) throw new Error("Projeto não encontrado para atualização");
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
    loaded: !q.isPending,
  };
}

/* ============ MEDIA ============ */
export type MediaItem = ProjectMedia;

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function useMedia() {
  const qc = useQc();
  const list = useServerFn(listMedia);
  const up = useServerFn(uploadMedia);
  const del = useServerFn(deleteMedia);

  const q = useQuery({ queryKey: ["media"], queryFn: () => list(), staleTime: 30_000 });
  const items = (q.data ?? []) as MediaItem[];

  const invalidate = () => qc.invalidateQueries({ queryKey: ["media"] });

  const mUp = useMutation({
    mutationFn: async (m: MediaUpload) => {
      // Compat: se vier `file`, envia para Storage. Se vier `url` (data URI), extrai base64.
      let dataBase64 = "";
      if (m.file) dataBase64 = await fileToBase64(m.file);
      else if (m.url?.startsWith("data:")) {
        const idx = m.url.indexOf(",");
        dataBase64 = idx >= 0 ? m.url.slice(idx + 1) : "";
      } else {
        throw new Error("Upload precisa de arquivo ou data URI");
      }
      return up({
        data: {
          name: m.name,
          type: m.type,
          size: m.size,
          dataBase64,
          folder: m.folder ?? "",
          projectId: m.projectId,
          category: m.category,
          alt: m.alt,
          caption: m.caption,
          sortOrder: m.sortOrder,
          width: m.width,
          height: m.height,
          duration: m.duration,
        },
      });
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

export function useProjectMedia(projectId?: string, category?: string) {
  const list = useServerFn(listProjectMedia);
  const enabled = Boolean(projectId);
  const q = useQuery({
    queryKey: ["media", "project", projectId, category ?? "all"],
    queryFn: () => list({ data: { projectId: projectId as string, category } }),
    staleTime: 30_000,
    enabled,
  });

  return { items: (q.data ?? []) as MediaItem[], loading: q.isPending };
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

  const q = useQuery({ queryKey: ["technologies"], queryFn: () => list(), staleTime: 30_000 });
  const items = useMemo(() => (q.data ?? []) as Technology[], [q.data]);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["technologies"] });

  const mUp = useMutation({
    mutationFn: (t: Omit<Technology, "id"> & { id?: string }) => ups({ data: t }),
    onSuccess: invalidate,
  });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: invalidate,
  });

  const add = useCallback((t: Omit<Technology, "id">) => mUp.mutate(t), [mUp]);
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
  name: "Adriano Oliveira",
  role: "Desenvolvedor Front-End Júnior",
  bio: "",
  email: "",
  location: "Brasil",
  cvUrl: "/cv-adriano-oliveira.pdf",
  github: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  githubUsername: "",
  githubToken: "",
};

export function useSettings() {
  const qc = useQc();
  const get = useServerFn(getSettings);
  const upd = useServerFn(updateSettings);

  const q = useQuery({ queryKey: ["settings"], queryFn: () => get(), staleTime: 60_000 });
  const settings = (q.data ?? settingsDefaults) as Settings;

  const mUpd = useMutation({
    mutationFn: (patch: Partial<Settings>) => upd({ data: patch }),
    onSuccess: (data) => {
      qc.setQueryData(["settings"], data);
    },
  });

  const update = useCallback((patch: Partial<Settings>) => mUpd.mutate(patch), [mUpd]);

  return { settings, update, loaded: !q.isPending };
}
