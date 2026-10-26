import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { CaseStudyV2, OverviewConfig, ProjectPillar } from '@/lib/case-study';
import { ICON_OPTIONS, moveItem, uid } from '@/lib/case-study';

interface CaseStudyOverviewTabProps {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

export function CaseStudyOverviewTab({ caseStudy, onUpdate }: CaseStudyOverviewTabProps) {
  const overview = caseStudy.overview;

  const updateOverview = (updates: Partial<OverviewConfig>) => {
    onUpdate({ overview: { ...overview, ...updates } });
  };

  const updatePillar = (index: number, updates: Partial<ProjectPillar>) => {
    const newPillars = [...overview.pillars];
    newPillars[index] = { ...newPillars[index], ...updates };
    updateOverview({ pillars: newPillars });
  };

  const addPillar = () => {
    updateOverview({
      pillars: [
        ...overview.pillars,
        {
          id: uid(),
          title: '',
          description: '',
          icon: ['Lock', 'Wallet', 'Accessibility'][overview.pillars.length % 3],
          sortOrder: overview.pillars.length,
          isVisible: true,
        },
      ],
    });
  };

  const removePillar = (index: number) => {
    updateOverview({ pillars: overview.pillars.filter((_, i) => i !== index) });
  };

  const movePillar = (index: number, offset: number) => {
    const reordered = moveItem(overview.pillars, index, index + offset);
    updateOverview({ pillars: reordered.map((pillar, sortOrder) => ({ ...pillar, sortOrder })) });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Visão Geral do Projeto</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Configure a seção de overview com pilares/diferenciais do projeto.
        </p>
      </div>

      {/* Eyebrow */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Eyebrow (Rótulo)</label>
        <input
          type="text"
          value={overview.eyebrow || ''}
          onChange={(e) => updateOverview({ eyebrow: e.target.value })}
          placeholder="ex: 01 — VISÃO GERAL"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título</label>
        <input
          type="text"
          value={overview.title || ''}
          onChange={(e) => updateOverview({ title: e.target.value })}
          placeholder="ex: Visão geral do projeto."
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Descrição</label>
        <textarea
          value={overview.description || ''}
          onChange={(e) => updateOverview({ description: e.target.value })}
          placeholder="Descrição da visão geral do projeto"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
        />
      </div>

      {/* Pillars */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pilares/Diferenciais</h3>
          <button
            onClick={addPillar}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:glow-neon text-xs font-semibold uppercase transition-all"
          >
            <Plus className="size-4" /> Adicionar
          </button>
        </div>

        <div className="space-y-4">
          {overview.pillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <label className="min-w-0 flex-1 space-y-1.5">
                  <span className="block text-xs font-medium text-muted-foreground">Rótulo</span>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => updatePillar(idx, { title: e.target.value })}
                    placeholder="Ex.: Transparência"
                    className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                  />
                </label>
                <div className="flex shrink-0">
                  <button
                    type="button"
                    aria-label="Mover pilar para cima"
                    disabled={idx === 0}
                    onClick={() => movePillar(idx, -1)}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Mover pilar para baixo"
                    disabled={idx === overview.pillars.length - 1}
                    onClick={() => movePillar(idx, 1)}
                    className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removePillar(idx)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Texto do destaque</span>
                <textarea
                  value={pillar.description}
                  onChange={(e) => updatePillar(idx, { description: e.target.value })}
                  placeholder="Descreva esse diferencial do projeto"
                  rows={2}
                  spellCheck
                  className="w-full resize-y rounded border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">Ícone</span>
                <select
                  value={pillar.icon || ''}
                  onChange={(e) => updatePillar(idx, { icon: e.target.value || undefined })}
                  className="w-full rounded border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                >
                  <option value="">Ícone automático</option>
                  {pillar.icon &&
                  !ICON_OPTIONS.includes(pillar.icon as (typeof ICON_OPTIONS)[number]) ? (
                    <option value={pillar.icon}>{pillar.icon} (atual)</option>
                  ) : null}
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pillar.isVisible}
                  onChange={(e) => updatePillar(idx, { isVisible: e.target.checked })}
                  className="rounded"
                />
                Visível
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
