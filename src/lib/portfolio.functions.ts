/**
 * Server functions para todo o portfólio (Supabase).
 * Reads públicos: usam supabaseAdmin com projeção/filtros seguros.
 * Writes: requerem usuário autenticado COM role 'admin'.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import type { MediaCategory, MediaType, ProjectMedia } from "@/lib/media-types";

/* ---------- helpers ---------- */
async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || data !== true) throw new Response("Forbidden", { status: 403 });
}

/* ---------- row mappers ---------- */
function rowToProject(r: any) {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    longDescription: r.long_description ?? undefined,
    image: r.image ?? "",
    heroImage: r.hero_image ?? undefined,
    heroVideo: r.hero_video ?? undefined,
    gallery: r.gallery ?? [],
    galleryLabels: r.gallery_labels ?? [],
    desktopMockup: r.desktop_mockup ?? undefined,
    tabletMockup: r.tablet_mockup ?? undefined,
    mobileMockup: r.mobile_mockup ?? undefined,
    previewGif: r.preview_gif ?? undefined,
    tech: r.tech ?? [],
    category: r.category,
    github: r.github ?? undefined,
    demo: r.demo ?? undefined,
    objective: r.objective ?? undefined,
    problem: r.problem ?? undefined,
    solution: r.solution ?? undefined,
    process: r.process ?? undefined,
    result: r.result ?? undefined,
    contentBlocks: r.content_blocks ?? undefined,
    metrics: r.metrics ?? undefined,
    seo: r.seo ?? undefined,
    publication: r.publication ?? { status: "draft", visibility: "private" },
    caseStudy: r.case_study ?? undefined,
    client: r.client ?? undefined,
    year: r.year ?? undefined,
    duration: r.duration ?? undefined,
    role: r.role ?? undefined,
    displayOrder: r.display_order ?? undefined,
    updatedAt: r.updated_at ?? undefined,
  };
}

function projectToRow(p: any) {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    long_description: p.longDescription ?? null,
    image: p.image ?? "",
    hero_image: p.heroImage ?? null,
    hero_video: p.heroVideo ?? null,
    gallery: p.gallery ?? [],
    gallery_labels: p.galleryLabels ?? [],
    desktop_mockup: p.desktopMockup ?? null,
    tablet_mockup: p.tabletMockup ?? null,
    mobile_mockup: p.mobileMockup ?? null,
    preview_gif: p.previewGif ?? null,
    tech: p.tech ?? [],
    category: p.category ?? "web",
    github: p.github ?? null,
    demo: p.demo ?? null,
    objective: p.objective ?? null,
    problem: p.problem ?? null,
    solution: p.solution ?? null,
    process: p.process ?? null,
    result: p.result ?? null,
    content_blocks: p.contentBlocks ?? [],
    metrics: p.metrics ?? [],
    seo: p.seo ?? null,
    publication: p.publication ?? { status: "draft", visibility: "private" },
    case_study: p.caseStudy ?? {},
    client: p.client ?? null,
    year: p.year ?? null,
    duration: p.duration ?? null,
    role: p.role ?? null,
    display_order: p.displayOrder ?? 0,
    updated_at: new Date().toISOString(),
  };
}

function rowToStoryline(r: any) {
  return {
    id: r.id,
    year: r.year,
    title: r.title,
    subtitle: r.subtitle ?? "",
    description: r.description ?? "",
    icon: r.icon,
    badge: r.badge ?? "",
    order: r.sort_order ?? 0,
    active: r.active ?? true,
  };
}

function rowToTech(r: any) {
  return {
    id: r.id,
    name: r.name,
    category: r.category ?? "",
    color: r.color ?? undefined,
    icon: r.icon ?? undefined,
    url: r.url ?? undefined,
  };
}

function detectMediaType(mimeType: string): MediaType {
  const mt = mimeType.toLowerCase();
  if (mt === "image/gif") return "gif";
  if (mt.startsWith("video/")) return "video";
  return "image";
}

function sanitizePathPart(input: string) {
  return input.replace(/[^a-zA-Z0-9/_-]+/g, "").replace(/^\/+|\/+$/g, "");
}

function extFromMimeOrName(mimeType: string, fileName: string) {
  const byMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    "video/x-matroska": "mkv",
  };

  const extByMime = byMime[mimeType.toLowerCase()];
  if (extByMime) return extByMime;

  const m = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m?.[1] ?? "bin";
}

function rowToMedia(r: Record<string, unknown>): ProjectMedia {
  const mimeType = String(r.mime_type ?? r.type ?? "application/octet-stream");
  const mediaType = String(r.media_type ?? "") || detectMediaType(mimeType);
  const folder = String(r.folder ?? "");
  const category = String(r.category ?? folder ?? "misc") as MediaCategory;

  return {
    id: String(r.id ?? ""),
    projectId: (r.project_id as string | null) ?? null,
    type: mediaType as MediaType,
    category,
    name: String(r.name ?? ""),
    url: String(r.url ?? ""),
    storagePath: String(r.storage_path ?? ""),
    mimeType,
    fileSize: Number(r.file_size ?? r.size ?? 0),
    width: (r.width as number | null) ?? null,
    height: (r.height as number | null) ?? null,
    duration: (r.duration as number | null) ?? null,
    alt: (r.alt as string | null) ?? null,
    caption: (r.caption as string | null) ?? null,
    sortOrder: Number(r.sort_order ?? 0),
    folder,
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? r.created_at ?? ""),
  };
}

function rowToSettings(r: any) {
  return {
    name: r?.name ?? "",
    role: r?.role ?? "",
    bio: r?.bio ?? "",
    email: r?.email ?? "",
    location: r?.location ?? "",
    cvUrl: r?.cv_url ?? "/cv-adriano-oliveira.pdf",
    github: r?.github ?? "",
    linkedin: r?.linkedin ?? "",
    twitter: r?.twitter ?? "",
    instagram: r?.instagram ?? "",
    githubToken: r?.github_token ?? "",
    githubUsername: r?.github_username ?? "",
    theme: r?.theme ?? undefined,
  };
}

/* ===================== PROJECTS ===================== */
export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProject);
});

export const getProjectBySlug = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: row, error } = await sb
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToProject(row) : null;
  });

const projectInputSchema = z.object({ id: z.string().uuid().optional() }).passthrough();

export const upsertProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: any) => projectInputSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const row = projectToRow(data);
    if (data.id) {
      const { data: out, error } = await sb
        .from("projects")
        .update(row)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return rowToProject(out);
    } else {
      const { data: out, error } = await sb.from("projects").insert(row).select("*").single();
      if (error) throw new Error(error.message);
      return rowToProject(out);
    }
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const { error } = await sb.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateProjectFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const { data: orig, error } = await sb.from("projects").select("*").eq("id", data.id).single();
    if (error || !orig) throw new Error(error?.message ?? "not found");
    const { id, created_at, ...rest } = orig;
    const copy = {
      ...rest,
      slug: `${orig.slug}-copy-${Date.now().toString(36)}`,
      title: `${orig.title} (cópia)`,
      updated_at: new Date().toISOString(),
    };
    const { data: out, error: e2 } = await sb.from("projects").insert(copy).select("*").single();
    if (e2) throw new Error(e2.message);
    return rowToProject(out);
  });

/* ===================== STORYLINE ===================== */
export const listStoryline = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data, error } = await sb
    .from("storyline_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToStoryline);
});

const storylineInput = z.object({
  id: z.string().uuid().optional(),
  year: z.string().min(1).max(20),
  title: z.string().min(1).max(120),
  subtitle: z.string().max(200).optional().default(""),
  description: z.string().max(2000).default(""),
  icon: z.string().max(40).default("sparkles"),
  badge: z.string().max(40).optional().default(""),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const upsertStoryline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: any) => storylineInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const row = {
      year: data.year,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      icon: data.icon,
      badge: data.badge,
      sort_order: data.order,
      active: data.active,
    };
    if (data.id) {
      const { data: out, error } = await sb
        .from("storyline_items")
        .update(row)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return rowToStoryline(out);
    }
    const { data: out, error } = await sb.from("storyline_items").insert(row).select("*").single();
    if (error) throw new Error(error.message);
    return rowToStoryline(out);
  });

export const deleteStoryline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const { error } = await sb.from("storyline_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ===================== TECHNOLOGIES ===================== */
export const listTechnologies = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data, error } = await sb
    .from("technologies")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToTech);
});

const techInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(80),
  category: z.string().max(40).default(""),
  color: z.string().max(20).optional(),
  icon: z.string().max(120).optional(),
  url: z.string().url().max(500).optional().or(z.literal("")),
});

export const upsertTechnology = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: any) => techInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const row = {
      name: data.name,
      category: data.category,
      color: data.color ?? null,
      icon: data.icon ?? null,
      url: data.url || null,
    };
    if (data.id) {
      const { data: out, error } = await sb
        .from("technologies")
        .update(row)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return rowToTech(out);
    }
    const { data: out, error } = await sb.from("technologies").insert(row).select("*").single();
    if (error) throw new Error(error.message);
    return rowToTech(out);
  });

export const deleteTechnology = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const { error } = await sb.from("technologies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ===================== MEDIA ===================== */
export const listMedia = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data, error } = await sb
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToMedia);
});

const listProjectMediaInput = z.object({
  projectId: z.string().uuid(),
  category: z.string().max(40).optional(),
});

export const listProjectMedia = createServerFn({ method: "GET" })
  .validator((d: unknown) => listProjectMediaInput.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    let q = sb
      .from("media")
      .select("*")
      .eq("project_id", data.projectId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.category) q = q.eq("category", data.category);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map(rowToMedia);
  });

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "application/pdf",
] as const;

const uploadInput = z.object({
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(120),
  size: z
    .number()
    .int()
    .nonnegative()
    .max(120 * 1024 * 1024), // 120MB
  dataBase64: z.string().min(1), // sem prefixo data:
  folder: z.string().max(80).optional().default(""),
  projectId: z.string().uuid().optional(),
  category: z.string().max(40).optional(),
  alt: z.string().max(300).optional(),
  caption: z.string().max(600).optional(),
  sortOrder: z.number().int().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  duration: z.number().nonnegative().optional(),
});

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: any) => uploadInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();

    const mimeType = data.type.toLowerCase();
    if (!allowedMimeTypes.includes(mimeType as (typeof allowedMimeTypes)[number])) {
      throw new Error("Formato de arquivo nao suportado.");
    }

    const mediaType = detectMediaType(mimeType);
    const safeCategory = sanitizePathPart(data.category || data.folder || "misc") || "misc";
    const projectFolder = sanitizePathPart(data.projectId || "global") || "global";
    const ext = extFromMimeOrName(mimeType, data.name);
    const uniqueName = `${crypto.randomUUID()}-${Date.now()}.${ext}`;
    const path = `${projectFolder}/${safeCategory}/${uniqueName}`;

    const bin = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    const { error: upErr } = await sb.storage.from("media").upload(path, bin, {
      contentType: mimeType,
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);
    const { data: pub } = sb.storage.from("media").getPublicUrl(path);

    const row = {
      name: data.name,
      url: pub.publicUrl,
      storage_path: path,
      type: mimeType,
      size: data.size,
      mime_type: mimeType,
      media_type: mediaType,
      project_id: data.projectId ?? null,
      category: safeCategory,
      folder: data.folder ?? safeCategory,
      file_size: data.size,
      width: data.width ?? null,
      height: data.height ?? null,
      duration: data.duration ?? null,
      alt: data.alt ?? null,
      caption: data.caption ?? null,
      sort_order: data.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    };
    const { data: out, error } = await sb.from("media").insert(row).select("*").single();
    if (error) throw new Error(error.message);
    return rowToMedia(out);
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const { data: row } = await sb
      .from("media")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.storage_path) await sb.storage.from("media").remove([row.storage_path]);
    const { error } = await sb.from("media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ===================== SETTINGS ===================== */
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const { data, error } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return rowToSettings(data);
});

const settingsInput = z.object({
  name: z.string().max(120).optional(),
  role: z.string().max(120).optional(),
  bio: z.string().max(2000).optional(),
  email: z.string().max(200).optional(),
  location: z.string().max(120).optional(),
  cvUrl: z.string().max(500).optional(),
  github: z.string().max(300).optional(),
  linkedin: z.string().max(300).optional(),
  twitter: z.string().max(300).optional(),
  instagram: z.string().max(300).optional(),
  githubToken: z.string().max(300).optional(),
  githubUsername: z.string().max(120).optional(),
  theme: z.string().max(40).optional(),
});

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: any) => settingsInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const row: any = { id: 1, updated_at: new Date().toISOString() };
    if (data.name !== undefined) row.name = data.name;
    if (data.role !== undefined) row.role = data.role;
    if (data.bio !== undefined) row.bio = data.bio;
    if (data.email !== undefined) row.email = data.email;
    if (data.location !== undefined) row.location = data.location;
    if (data.cvUrl !== undefined) row.cv_url = data.cvUrl;
    if (data.github !== undefined) row.github = data.github;
    if (data.linkedin !== undefined) row.linkedin = data.linkedin;
    if (data.twitter !== undefined) row.twitter = data.twitter;
    if (data.instagram !== undefined) row.instagram = data.instagram;
    if (data.githubToken !== undefined) row.github_token = data.githubToken;
    if (data.githubUsername !== undefined) row.github_username = data.githubUsername;
    if (data.theme !== undefined) row.theme = data.theme;
    const { data: out, error } = await sb.from("site_settings").upsert(row).select("*").single();
    if (error) throw new Error(error.message);
    return rowToSettings(out);
  });

/* ===================== CONTACT ===================== */
const contactInput = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(1500),
});

export const submitContact = createServerFn({ method: "POST" })
  .validator((d: any) => contactInput.parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    let ip: string | null = null;
    let ua: string | null = null;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
    } catch {}
    try {
      ua = getRequestHeader("user-agent") ?? null;
    } catch {}
    const { error } = await sb.from("contact_leads").insert({
      name: data.name,
      email: data.email,
      message: data.message,
      ip,
      user_agent: ua,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listContactLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const sb = await admin();
    const { data, error } = await sb
      .from("contact_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
