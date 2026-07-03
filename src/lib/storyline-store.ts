import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  GraduationCap,
  Rocket,
  Atom,
  FileCode2,
  Triangle,
  Layers,
  Target,
  Code2,
  Cpu,
  Globe,
  Trophy,
  Zap,
  Star,
  type LucideIcon,
} from "lucide-react";
import { listStoryline, upsertStoryline, deleteStoryline } from "./portfolio.functions";

export interface StorylineItem {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  badge?: string;
  order: number;
  active: boolean;
}

export const STORYLINE_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  graduation: GraduationCap,
  rocket: Rocket,
  atom: Atom,
  filecode: FileCode2,
  triangle: Triangle,
  layers: Layers,
  target: Target,
  code: Code2,
  cpu: Cpu,
  globe: Globe,
  trophy: Trophy,
  zap: Zap,
  star: Star,
};

export const STORYLINE_ICON_KEYS = Object.keys(STORYLINE_ICONS);

export function useStoryline() {
  const qc = useQueryClient();
  const list = useServerFn(listStoryline);
  const ups = useServerFn(upsertStoryline);
  const del = useServerFn(deleteStoryline);

  const q = useQuery({ queryKey: ["storyline"], queryFn: () => list(), staleTime: 30_000 });
  const items = (q.data ?? []) as StorylineItem[];
  const invalidate = () => qc.invalidateQueries({ queryKey: ["storyline"] });

  const mUp = useMutation({ mutationFn: (s: any) => ups({ data: s }), onSuccess: invalidate });
  const mDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: invalidate,
  });

  const add = useCallback(
    (patch: Partial<StorylineItem>) => {
      const nextOrder = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
      mUp.mutate({
        year: patch.year ?? new Date().getFullYear().toString(),
        title: patch.title ?? "Novo marco",
        subtitle: patch.subtitle ?? "",
        description: patch.description ?? "",
        icon: patch.icon ?? "sparkles",
        badge: patch.badge ?? "",
        order: patch.order ?? nextOrder,
        active: patch.active ?? true,
      });
    },
    [mUp, items],
  );

  const update = useCallback(
    (id: string, patch: Partial<StorylineItem>) => {
      const cur = items.find((i) => i.id === id);
      if (!cur) return;
      mUp.mutate({ ...cur, ...patch, id });
    },
    [mUp, items],
  );

  const remove = useCallback((id: string) => mDel.mutate(id), [mDel]);

  const move = useCallback(
    (id: string, direction: -1 | 1) => {
      const sorted = [...items].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((i) => i.id === id);
      const targetIdx = idx + direction;
      if (idx < 0 || targetIdx < 0 || targetIdx >= sorted.length) return;
      const a = sorted[idx],
        b = sorted[targetIdx];
      mUp.mutate({ ...a, order: b.order });
      mUp.mutate({ ...b, order: a.order });
    },
    [mUp, items],
  );

  const reset = useCallback(() => {
    /* noop — seed via SQL */
  }, []);

  return { items, loaded: !q.isPending, add, update, remove, move, reset };
}
