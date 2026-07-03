import type { LucideIcon } from "lucide-react";

export type SectionId =
  | "overview"
  | "problem"
  | "objectives"
  | "research"
  | "architecture"
  | "design"
  | "development"
  | "performance"
  | "results"
  | "gallery"
  | "learnings"
  | "cta";

export type SectionNavItem = {
  id: SectionId;
  n: string;
  label: string;
  icon: LucideIcon;
};

export type DetailItem = {
  id: string;
  title: string;
  description: string;
};

export type MetricItem = {
  label: string;
  raw: string;
  value: number | null;
  prefix: string;
  suffix: string;
  description?: string;
};

export type MetaPill = {
  label: string;
  value: string;
};
