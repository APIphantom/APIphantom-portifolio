import { z } from 'zod';
import type {
  LegacyCaseStudy,
  Project,
  ProjectMediaSettings,
  ProjectStatus,
} from './projects-store';

export function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

export type CtaButton = {
  label: string;
  url: string;
  newTab: boolean;
  enabled: boolean;
};

export type ProjectMetaItem = {
  id: string;
  label: string;
  value: string;
  icon?: string;
  sortOrder: number;
  isVisible: boolean;
};

export type ProjectPillar = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  sortOrder: number;
  isVisible: boolean;
};

export type ProjectFeature = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  link?: string;
  sortOrder: number;
  isVisible: boolean;
};

export type ArchitectureItem = {
  id: string;
  technologyId?: string;
  technologyName: string;
  description?: string;
  icon?: string;
  sortOrder: number;
};

export type ArchitectureGroup = {
  id: string;
  category: string;
  icon?: string;
  sortOrder: number;
  isVisible: boolean;
  items: ArchitectureItem[];
};

export type MediaLayout =
  'landscape' | 'portrait' | 'square' | 'wide' | 'full-width' | 'featured' | 'mobile' | 'desktop';

export type GalleryMediaItem = {
  id: string;
  mediaId?: string;
  url: string;
  kind?: string;
  title?: string;
  description?: string;
  caption?: string;
  alt?: string;
  layout: MediaLayout;
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
};

export type ProjectMetricItem = {
  id: string;
  value: string;
  unit?: string;
  title: string;
  description?: string;
  icon?: string;
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
};

export type PerformanceIndicator = {
  id: string;
  name: string;
  value: string;
  max?: string;
  unit?: string;
  description?: string;
  icon?: string;
  featured?: boolean;
  sortOrder: number;
  isVisible: boolean;
};

export type HeroConfig = {
  title: string;
  titleHighlight?: string;
  description?: string;
  badge?: string;
  heroMediaId?: string;
  heroMediaUrl?: string;
  heroVideoUrl?: string;
  desktopMediaId?: string;
  desktopMediaUrl?: string;
  mobileMediaId?: string;
  mobileMediaUrl?: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
  meta: ProjectMetaItem[];
};

export type OverviewConfig = {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  pillars: ProjectPillar[];
};

export type ArchitectureConfig = {
  eyebrow?: string;
  title?: string;
  description?: string;
  diagramUrl?: string;
  highlightText?: string;
  stackDetails?: Partial<Record<ArchitectureStackKey, string>>;
  groups: ArchitectureGroup[];
  technologyIds: string[];
};

export type ArchitectureStackKey = 'frontend' | 'styling' | 'stateManagement' | 'routing';

export const ARCHITECTURE_STACK_FIELDS: {
  key: ArchitectureStackKey;
  label: string;
  aliases: string[];
}[] = [
  { key: 'frontend', label: 'Frontend', aliases: ['frontend', 'front-end'] },
  { key: 'styling', label: 'Estilização', aliases: ['estilizacao', 'styling', 'especializacao'] },
  {
    key: 'stateManagement',
    label: 'Gerenciamento de estado',
    aliases: ['gerenciamento de estado', 'state management'],
  },
  { key: 'routing', label: 'Roteamento', aliases: ['roteamento', 'routing'] },
];

export function getArchitectureStackSummaries(groups: ArchitectureGroup[]) {
  const normalize = (value: string) =>
    value
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  return Object.fromEntries(
    ARCHITECTURE_STACK_FIELDS.map(({ key, aliases }) => {
      const matchingGroups = groups.filter((group) => aliases.includes(normalize(group.category)));
      const summary = matchingGroups
        .flatMap((group) => group.items)
        .map((item) => {
          const name = item.technologyName.trim();
          const detail = item.description?.trim();
          return name && detail ? `${name}: ${detail}` : name || detail;
        })
        .filter((value): value is string => Boolean(value))
        .join(' · ');

      return [key, summary];
    }),
  ) as Record<ArchitectureStackKey, string>;
}

export type MediaSectionConfig = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: GalleryMediaItem[];
};

export type CtaConfig = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  primary: CtaButton;
  secondary: CtaButton;
  backgroundImage?: string;
  enabled: boolean;
};

export type CaseStudyV2 = {
  version: 2;
  legacy?: LegacyCaseStudy;
  hero: HeroConfig;
  overview: OverviewConfig;
  featuresTitle?: string;
  features: ProjectFeature[];
  architecture: ArchitectureConfig;
  media: MediaSectionConfig;
  metricsTitle?: string;
  metricsSummary?: string;
  metrics: ProjectMetricItem[];
  performanceTitle?: string;
  performance: PerformanceIndicator[];
  cta: CtaConfig;
};

const ctaSchema = z.object({
  label: z.string().max(80).default(''),
  url: z.string().max(500).default(''),
  newTab: z.boolean().default(true),
  enabled: z.boolean().default(false),
});

const removedLegacyCaseStudyKeys = [
  'process',
  'technicalChallenges',
  'technicalDecisions',
  'roadmapDone',
  'roadmapInProgress',
  'roadmapPlanned',
  'learnings',
];

function stripObjectKeys(value: unknown, keys: string[]) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const result = { ...(value as Record<string, unknown>) };
  for (const key of keys) delete result[key];
  return result;
}

export function stripRemovedCaseStudyData(value: unknown) {
  const result = stripObjectKeys(value, [...removedLegacyCaseStudyKeys, 'learningsTitle']);
  if (!result || typeof result !== 'object' || Array.isArray(result)) return result;

  const caseStudy = result as Record<string, unknown>;
  if (caseStudy.legacy) {
    caseStudy.legacy = stripObjectKeys(caseStudy.legacy, removedLegacyCaseStudyKeys);
  }
  return caseStudy;
}

export function stripRemovedProjectData(project: Project): Project {
  const result = { ...project } as Project & { process?: string };
  delete result.process;
  if (project.caseStudy) {
    result.caseStudy = stripRemovedCaseStudyData(project.caseStudy) as Project['caseStudy'];
  }
  return result;
}

const optionalTextSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined);
const optionalBooleanSchema = z
  .boolean()
  .nullish()
  .transform((value) => value ?? undefined);
const optionalStringArraySchema = z
  .array(z.string())
  .nullish()
  .transform((value) => value ?? undefined);

const videoMediaOptionsSchema = z
  .object({
    autoplay: optionalBooleanSchema,
    loop: optionalBooleanSchema,
    muted: optionalBooleanSchema,
    controls: optionalBooleanSchema,
    playsInline: optionalBooleanSchema,
    poster: optionalTextSchema,
    preload: z
      .enum(['none', 'metadata', 'auto'])
      .nullish()
      .transform((value) => value ?? undefined),
    objectFit: z
      .enum(['cover', 'contain'])
      .nullish()
      .transform((value) => value ?? undefined),
  })
  .passthrough();

const projectMediaSettingsSchema: z.ZodType<ProjectMediaSettings, z.ZodTypeDef, unknown> = z
  .object({
    thumbnail: videoMediaOptionsSchema.optional(),
    hero: videoMediaOptionsSchema.optional(),
    heroVideo: videoMediaOptionsSchema.optional(),
    desktopMockup: videoMediaOptionsSchema.optional(),
    tabletMockup: videoMediaOptionsSchema.optional(),
    mobileMockup: videoMediaOptionsSchema.optional(),
    preview: videoMediaOptionsSchema.optional(),
    gallery: z.record(z.coerce.number(), videoMediaOptionsSchema).optional(),
    seoOg: videoMediaOptionsSchema.optional(),
    seoTwitter: videoMediaOptionsSchema.optional(),
  })
  .passthrough();

const legacyMetricSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    value: z.string(),
    prefix: optionalTextSchema,
    suffix: optionalTextSchema,
    description: optionalTextSchema,
  })
  .passthrough();

const legacyCaseStudySchema = z
  .object({
    problemStatement: optionalTextSchema,
    roles: optionalStringArraySchema,
    architecture: optionalTextSchema,
    systemFlow: optionalTextSchema,
    features: optionalStringArraySchema,
    databaseStructure: optionalTextSchema,
    timeline: optionalStringArraySchema,
    developmentProcess: optionalStringArraySchema,
    performance: z
      .array(legacyMetricSchema)
      .nullish()
      .transform((value) => value ?? undefined),
    codeNumbers: z
      .array(legacyMetricSchema)
      .nullish()
      .transform((value) => value ?? undefined),
    mediaSettings: projectMediaSettingsSchema.nullish().transform((value) => value ?? undefined),
  })
  .passthrough();

const caseStudyV2FormSchema: z.ZodType<CaseStudyV2, z.ZodTypeDef, unknown> = z
  .object({
    version: z.literal(2),
    legacy: z.preprocess(
      (value) => (value === null ? undefined : value),
      legacyCaseStudySchema.optional(),
    ),
    hero: z
      .object({
        title: z.string(),
        titleHighlight: optionalTextSchema,
        description: optionalTextSchema,
        badge: optionalTextSchema,
        heroMediaId: optionalTextSchema,
        heroMediaUrl: optionalTextSchema,
        heroVideoUrl: optionalTextSchema,
        desktopMediaId: optionalTextSchema,
        desktopMediaUrl: optionalTextSchema,
        mobileMediaId: optionalTextSchema,
        mobileMediaUrl: optionalTextSchema,
        primaryCta: ctaSchema.passthrough(),
        secondaryCta: ctaSchema.passthrough(),
        meta: z.array(
          z
            .object({
              id: z.string(),
              label: z.string(),
              value: z.string(),
              icon: optionalTextSchema,
              sortOrder: z.number(),
              isVisible: z.boolean(),
            })
            .passthrough(),
        ),
      })
      .passthrough(),
    overview: z
      .object({
        eyebrow: optionalTextSchema,
        title: optionalTextSchema,
        description: optionalTextSchema,
        image: optionalTextSchema,
        pillars: z.array(
          z
            .object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              icon: optionalTextSchema,
              sortOrder: z.number(),
              isVisible: z.boolean(),
            })
            .passthrough(),
        ),
      })
      .passthrough(),
    featuresTitle: optionalTextSchema,
    features: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          icon: optionalTextSchema,
          image: optionalTextSchema,
          link: optionalTextSchema,
          sortOrder: z.number(),
          isVisible: z.boolean(),
        })
        .passthrough(),
    ),
    architecture: z
      .object({
        eyebrow: optionalTextSchema,
        title: optionalTextSchema,
        description: optionalTextSchema,
        diagramUrl: optionalTextSchema,
        highlightText: optionalTextSchema,
        stackDetails: z
          .object({
            frontend: optionalTextSchema,
            styling: optionalTextSchema,
            stateManagement: optionalTextSchema,
            routing: optionalTextSchema,
          })
          .nullish()
          .transform((value) => value ?? undefined),
        technologyIds: z.array(z.string()),
        groups: z.array(
          z
            .object({
              id: z.string(),
              category: z.string(),
              icon: optionalTextSchema,
              sortOrder: z.number(),
              isVisible: z.boolean(),
              items: z.array(
                z
                  .object({
                    id: z.string(),
                    technologyId: optionalTextSchema,
                    technologyName: z.string(),
                    description: optionalTextSchema,
                    icon: optionalTextSchema,
                    sortOrder: z.number(),
                  })
                  .passthrough(),
              ),
            })
            .passthrough(),
        ),
      })
      .passthrough(),
    media: z
      .object({
        eyebrow: optionalTextSchema,
        title: optionalTextSchema,
        description: optionalTextSchema,
        items: z.array(
          z
            .object({
              id: z.string(),
              mediaId: optionalTextSchema,
              url: z.string(),
              kind: optionalTextSchema,
              title: optionalTextSchema,
              description: optionalTextSchema,
              caption: optionalTextSchema,
              alt: optionalTextSchema,
              layout: z.enum([
                'landscape',
                'portrait',
                'square',
                'wide',
                'full-width',
                'featured',
                'mobile',
                'desktop',
              ]),
              featured: z.boolean(),
              sortOrder: z.number(),
              isVisible: z.boolean(),
            })
            .passthrough(),
        ),
      })
      .passthrough(),
    metricsTitle: optionalTextSchema,
    metricsSummary: optionalTextSchema,
    metrics: z.array(
      z
        .object({
          id: z.string(),
          value: z.string(),
          unit: optionalTextSchema,
          title: z.string(),
          description: optionalTextSchema,
          icon: optionalTextSchema,
          featured: z.boolean(),
          sortOrder: z.number(),
          isVisible: z.boolean(),
        })
        .passthrough(),
    ),
    performanceTitle: optionalTextSchema,
    performance: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          value: z.string(),
          max: optionalTextSchema,
          unit: optionalTextSchema,
          description: optionalTextSchema,
          icon: optionalTextSchema,
          featured: optionalBooleanSchema,
          sortOrder: z.number(),
          isVisible: z.boolean(),
        })
        .passthrough(),
    ),
    cta: z
      .object({
        eyebrow: optionalTextSchema,
        title: optionalTextSchema,
        subtitle: optionalTextSchema,
        text: optionalTextSchema,
        primary: ctaSchema.passthrough(),
        secondary: ctaSchema.passthrough(),
        backgroundImage: optionalTextSchema,
        enabled: z.boolean(),
      })
      .passthrough(),
  })
  .passthrough();

export function validateCaseStudyV2(value: unknown) {
  return caseStudyV2FormSchema.safeParse(stripRemovedCaseStudyData(value));
}

export function mergeCaseStudyUpdates(
  current: CaseStudyV2,
  updates: Partial<CaseStudyV2>,
): CaseStudyV2 {
  return {
    ...current,
    ...updates,
    hero: updates.hero
      ? {
          ...current.hero,
          ...updates.hero,
          primaryCta: { ...current.hero.primaryCta, ...updates.hero.primaryCta },
          secondaryCta: { ...current.hero.secondaryCta, ...updates.hero.secondaryCta },
          meta: updates.hero.meta ?? current.hero.meta,
        }
      : current.hero,
    overview: updates.overview
      ? {
          ...current.overview,
          ...updates.overview,
          pillars: updates.overview.pillars ?? current.overview.pillars,
        }
      : current.overview,
    features: updates.features ?? current.features,
    architecture: updates.architecture
      ? {
          ...current.architecture,
          ...updates.architecture,
          groups: updates.architecture.groups ?? current.architecture.groups,
          technologyIds: updates.architecture.technologyIds ?? current.architecture.technologyIds,
        }
      : current.architecture,
    media: updates.media
      ? {
          ...current.media,
          ...updates.media,
          items: updates.media.items ?? current.media.items,
        }
      : current.media,
    metrics: updates.metrics ?? current.metrics,
    metricsSummary: updates.metricsSummary ?? current.metricsSummary,
    performance: updates.performance ?? current.performance,
    cta: updates.cta
      ? {
          ...current.cta,
          ...updates.cta,
          primary: { ...current.cta.primary, ...updates.cta.primary },
          secondary: { ...current.cta.secondary, ...updates.cta.secondary },
        }
      : current.cta,
    legacy: updates.legacy ?? current.legacy,
  };
}

export type NeighborProject = {
  slug: string;
  title: string;
};

export const MEDIA_LAYOUTS: { value: MediaLayout; label: string }[] = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'square', label: 'Quadrado' },
  { value: 'wide', label: 'Wide' },
  { value: 'full-width', label: 'Full width' },
  { value: 'featured', label: 'Destaque' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
];

export const ARCHITECTURE_PRESETS = [
  'Frontend',
  'Estilização',
  'Gerenciamento de estado',
  'Roteamento',
  'Backend',
  'Banco de dados',
  'Storage',
  'Deploy',
  'APIs',
  'Autenticação',
];

export const ICON_OPTIONS = [
  'Calendar',
  'Monitor',
  'Clock',
  'Briefcase',
  'Users',
  'Globe',
  'Layers',
  'Cpu',
  'Database',
  'Server',
  'HardDrive',
  'Shield',
  'Sparkles',
  'Target',
  'Trophy',
  'Gauge',
  'Hexagon',
  'Code2',
  'Smartphone',
  'Layout',
  'Lightbulb',
  'Rocket',
  'Search',
  'FileText',
  'Wallet',
  'Lock',
  'Cloud',
  'GitBranch',
  'Palette',
  'Accessibility',
] as const;

export const publishProjectSchema = z.object({
  title: z.string().trim().min(2, 'Título obrigatório'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug obrigatório')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  description: z.string().trim().min(8, 'Descrição curta obrigatória'),
  category: z.string().min(1, 'Categoria obrigatória'),
});

export function emptyCta(partial?: Partial<CtaButton>): CtaButton {
  return {
    label: '',
    url: '',
    newTab: true,
    enabled: false,
    ...partial,
  };
}

function splitLineItem(text: string, fallbackTitle: string) {
  const raw = text.trim();
  if (!raw) return { title: fallbackTitle, description: '' };
  const parts = raw.includes('->')
    ? raw.split('->')
    : raw.includes('=>')
      ? raw.split('=>')
      : raw.includes(':')
        ? raw.split(':')
        : [];
  if (parts.length >= 2) {
    return {
      title: parts[0].trim() || fallbackTitle,
      description: parts.slice(1).join(':').trim(),
    };
  }
  return { title: fallbackTitle, description: raw };
}

export function emptyCaseStudy(): CaseStudyV2 {
  return {
    version: 2,
    hero: {
      title: '',
      titleHighlight: '',
      description: '',
      badge: '',
      primaryCta: emptyCta(),
      secondaryCta: emptyCta(),
      meta: [],
    },
    overview: {
      eyebrow: '',
      title: '',
      description: '',
      pillars: [],
    },
    featuresTitle: '',
    features: [],
    architecture: {
      eyebrow: '',
      title: '',
      description: '',
      highlightText: '',
      groups: [],
      technologyIds: [],
    },
    media: {
      eyebrow: '',
      title: '',
      description: '',
      items: [],
    },
    metricsTitle: '',
    metricsSummary: '',
    metrics: [],
    performanceTitle: '',
    performance: [],
    cta: {
      eyebrow: '',
      title: '',
      subtitle: '',
      text: '',
      primary: emptyCta(),
      secondary: emptyCta(),
      enabled: false,
    },
  };
}

function isV2(value: LegacyCaseStudy | CaseStudyV2 | undefined): value is CaseStudyV2 {
  return Boolean(
    value && 'version' in value && value.version === 2 && 'hero' in value && value.hero,
  );
}

export function isPublishedProject(project: Pick<Project, 'publication'>) {
  const status = project.publication?.status ?? 'draft';
  const visibility = project.publication?.visibility ?? 'public';
  return status === 'published' && visibility === 'public';
}

export function categoryLabel(category: Project['category']) {
  const labels: Record<string, string> = {
    web: 'Web App',
    ui: 'UI/Design',
    ecommerce: 'E-commerce',
    experiment: 'Experimento',
    mobile: 'Mobile',
  };
  return labels[category] ?? category;
}

export function normalizeCaseStudy(input: Project): CaseStudyV2 {
  const project = stripRemovedProjectData(input);
  const raw = project.caseStudy;
  if (isV2(raw)) {
    const base = emptyCaseStudy();
    const legacyFeatures = raw.legacy?.features?.filter((feature) => feature.trim()) ?? [];
    const features = (raw.features ?? []).map((feature, index) => {
      const fallbackTitle = `Funcionalidade ${String(index + 1).padStart(2, '0')}`;
      const legacyFeature = legacyFeatures[index];
      if (!legacyFeature || feature.title !== fallbackTitle) return feature;

      const parsed = splitLineItem(legacyFeature, fallbackTitle);
      return parsed.title === fallbackTitle && parsed.description === feature.description
        ? { ...feature, title: '', icon: undefined }
        : feature;
    });
    const legacyTechnologyNames = project.tech?.slice(0, 6) ?? [];
    const architectureGroups = (raw.architecture?.groups ?? []).filter((group) => {
      if (!raw.legacy || group.category !== 'Frontend' || group.icon !== 'Monitor') return true;
      return !(
        group.sortOrder === 0 &&
        group.items.length === legacyTechnologyNames.length &&
        group.items.every(
          (item, index) =>
            item.sortOrder === index && item.technologyName === legacyTechnologyNames[index],
        )
      );
    });
    return {
      ...base,
      ...raw,
      hero: {
        ...base.hero,
        ...raw.hero,
        primaryCta: { ...base.hero.primaryCta, ...raw.hero?.primaryCta },
        secondaryCta: { ...base.hero.secondaryCta, ...raw.hero?.secondaryCta },
        meta: raw.hero?.meta ?? base.hero.meta,
      },
      overview: { ...base.overview, ...raw.overview, pillars: raw.overview?.pillars ?? [] },
      features,
      architecture: {
        ...base.architecture,
        ...raw.architecture,
        groups: architectureGroups,
        technologyIds: raw.architecture?.technologyIds ?? [],
      },
      media: { ...base.media, ...raw.media, items: raw.media?.items ?? [] },
      metrics: raw.metrics ?? [],
      performance: raw.performance ?? [],
      cta: {
        ...base.cta,
        ...raw.cta,
        primary: { ...base.cta.primary, ...raw.cta?.primary },
        secondary: { ...base.cta.secondary, ...raw.cta?.secondary },
      },
    };
  }

  const next = emptyCaseStudy();
  if (raw) next.legacy = raw;
  const cat = categoryLabel(project.category);
  const titleParts = (project.title ?? '').split(/\s+[—–-]\s+/);
  next.hero.title = titleParts[0] || project.title || '';
  next.hero.titleHighlight = titleParts.slice(1).join(' — ');
  next.hero.description = project.longDescription || project.description || '';
  next.hero.badge = cat;
  next.hero.heroMediaUrl = project.heroImage || project.image;
  next.hero.heroVideoUrl = project.heroVideo;
  next.hero.desktopMediaUrl = project.desktopMockup;
  next.hero.mobileMediaUrl = project.mobileMockup;
  next.hero.primaryCta = emptyCta({
    label: 'Ver projeto ao vivo',
    url: project.demo ?? '',
    newTab: true,
    enabled: Boolean(project.demo),
  });
  next.hero.secondaryCta = emptyCta({
    label: 'Ver no GitHub',
    url: project.github ?? '',
    newTab: true,
    enabled: Boolean(project.github),
  });

  const meta: ProjectMetaItem[] = [];
  if (project.year)
    meta.push({
      id: uid(),
      label: 'Ano',
      value: project.year,
      icon: 'Calendar',
      sortOrder: 0,
      isVisible: true,
    });
  if (project.tech?.length)
    meta.push({
      id: uid(),
      label: 'Tecnologias',
      value: project.tech.slice(0, 2).join(' + '),
      icon: 'Monitor',
      sortOrder: 1,
      isVisible: true,
    });
  if (project.duration)
    meta.push({
      id: uid(),
      label: 'Duração',
      value: project.duration,
      icon: 'Clock',
      sortOrder: 2,
      isVisible: true,
    });
  if (project.client)
    meta.push({
      id: uid(),
      label: 'Cliente',
      value: project.client,
      icon: 'Briefcase',
      sortOrder: 3,
      isVisible: true,
    });
  if (project.role)
    meta.push({
      id: uid(),
      label: 'Papel',
      value: project.role,
      icon: 'Users',
      sortOrder: 4,
      isVisible: true,
    });
  next.hero.meta = meta;

  const overviewText =
    project.longDescription ||
    raw?.problemStatement ||
    project.problem ||
    project.objective ||
    project.description ||
    '';
  next.overview.description = overviewText;

  const featureSource = (raw?.features ?? []).filter((item) => item.trim());
  next.features = featureSource.map((item, i) => {
    const parsed = splitLineItem(item, '');
    return {
      id: uid(),
      title: parsed.title,
      description: parsed.description,
      sortOrder: i,
      isVisible: true,
    };
  });

  if (!next.features.length && (project.contentBlocks ?? []).length) {
    next.features = (project.contentBlocks ?? [])
      .filter((b) => b.description?.trim())
      .slice(0, 8)
      .map((b, i) => ({
        id: b.id || uid(),
        title: b.title,
        description: b.description,
        sortOrder: i,
        isVisible: true,
      }));
  }

  next.architecture.description = [raw?.architecture, raw?.systemFlow, raw?.databaseStructure]
    .filter((item) => item && item.trim())
    .join('\n\n');

  const urls = [
    ...(project.gallery ?? []),
    project.previewGif,
    project.heroImage,
    project.image,
    project.desktopMockup,
    project.mobileMockup,
  ].filter((u, i, arr): u is string => Boolean(u) && arr.indexOf(u) === i);

  next.media.items = urls.map((url, i) => ({
    id: uid(),
    url,
    title: project.galleryLabels?.[i] || '',
    alt: project.galleryLabels?.[i] || project.title,
    layout: i === 0 ? 'featured' : 'landscape',
    featured: i === 0,
    sortOrder: i,
    isVisible: true,
  }));

  next.metrics = (project.metrics ?? []).map((m, i) => ({
    id: m.id || uid(),
    value: `${m.prefix ?? ''}${m.value}`,
    unit: m.suffix,
    title: m.title,
    description: m.description,
    featured: i === 0,
    sortOrder: i,
    isVisible: true,
  }));

  next.performance = (raw?.performance ?? []).map((m, i) => ({
    id: m.id || uid(),
    name: m.title,
    value: m.value,
    unit: m.suffix,
    description: m.description,
    sortOrder: i,
    isVisible: true,
  }));

  return next;
}

export function visibleSorted<T extends { sortOrder: number; isVisible?: boolean }>(items: T[]) {
  return [...items]
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function publicMediaTitle(item: Pick<GalleryMediaItem, 'title'>) {
  return publicMediaCopy(item.title);
}

export function publicMediaCopy(value?: string | null) {
  const text = value?.trim() ?? '';
  if (!text || isLikelyMediaFilename(text)) return '';
  return text;
}

function isLikelyMediaFilename(value: string) {
  const text = value.trim();
  if (!text) return true;
  if (/\.(avif|bmp|gif|jpe?g|png|svg|webp|mp4|webm|mov|m4v|avi|mkv|pdf)(?:\s|$)/i.test(text)) {
    return true;
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(text)) {
    return true;
  }
  if (/^(?:img|dsc|dscn|screenshot|image|foto|photo|whatsapp|video)[-_\s]?\d*/i.test(text)) {
    return true;
  }
  return false;
}

export function seoFallback(project: Project, siteName: string) {
  const title = project.seo?.metaTitle || `${project.title} — ${siteName}`;
  const description =
    project.seo?.metaDescription || project.description || `Case study de ${project.title}`;
  const ogTitle = project.seo?.ogTitle || title;
  const ogDescription = project.seo?.ogDescription || description;
  const ogImage = project.seo?.ogImage || project.heroImage || project.image;
  const canonical = project.seo?.canonicalUrl || `/projetos/${project.slug}`;
  const indexable = project.seo?.robotsIndex !== false && isPublishedProject(project);
  const follow = project.seo?.robotsFollow !== false;
  return { title, description, ogTitle, ogDescription, ogImage, canonical, indexable, follow };
}

export function validateForPublish(project: Project) {
  const parsed = publishProjectSchema.safeParse({
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
  });
  const errors: string[] = parsed.success ? [] : parsed.error.issues.map((issue) => issue.message);
  const cs = normalizeCaseStudy(project);
  if (!cs.hero.title.trim() && !project.title.trim()) errors.push('Hero sem título');
  if (!cs.hero.description?.trim() && !project.description.trim())
    errors.push('Hero sem descrição');
  const hasMedia =
    Boolean(cs.hero.heroMediaUrl || cs.hero.heroVideoUrl || project.image) ||
    cs.media.items.some((item) => item.url);
  if (!hasMedia) errors.push('É necessária uma mídia principal');
  return errors;
}

export function parseCta(value: unknown): CtaButton {
  const result = ctaSchema.safeParse(value ?? {});
  return result.success ? result.data : emptyCta();
}

export function statusLabel(status: ProjectStatus | string | undefined) {
  switch (status) {
    case 'published':
      return 'Publicado';
    case 'archived':
      return 'Arquivado';
    case 'in_review':
      return 'Em revisão';
    default:
      return 'Rascunho';
  }
}

export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
