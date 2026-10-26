import {
  Accessibility,
  Briefcase,
  Calendar,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  Hexagon,
  Layers,
  Layout,
  Lightbulb,
  Lock,
  Monitor,
  Palette,
  Rocket,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Accessibility,
  Briefcase,
  Calendar,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  HardDrive,
  Hexagon,
  Layers,
  Layout,
  Lightbulb,
  Lock,
  Monitor,
  Palette,
  Rocket,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wallet,
};

export function iconByName(name?: string): LucideIcon {
  if (!name) return Hexagon;
  return ICONS[name] ?? Hexagon;
}

export function CaseIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = iconByName(name);
  return <Icon className={className} aria-hidden="true" />;
}
