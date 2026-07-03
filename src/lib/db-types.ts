// Tipos compartilhados de DTO (camelCase) — usados pelos serverFns e hooks.
// Mantém a mesma forma dos tipos antigos do localStorage para não quebrar consumidores.
export type {
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectVisibility,
  ContentBlock,
  Metric,
  SEO,
  Publication,
  MediaItem,
  Technology,
  Settings,
} from "./projects-store";
export type { StorylineItem } from "./storyline-store";
export type { ProjectMedia as Media, ProjectMedia, MediaCategory, MediaType, MediaUpload, MediaResponse } from "./media-types";
