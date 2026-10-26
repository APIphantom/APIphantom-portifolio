import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { CaseStudyV2, PerformanceIndicator } from '@/lib/case-study';
import { moveItem, uid } from '@/lib/case-study';

interface CaseStudyPerformanceTabProps {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

export function CaseStudyPerformanceTab({ caseStudy, onUpdate }: CaseStudyPerformanceTabProps) {
  const performance = [...caseStudy.performance].sort((a, b) => a.sortOrder - b.sortOrder);

  const updateIndicator = (index: number, updates: Partial<PerformanceIndicator>) => {
    const newPerformance = [...performance];
    newPerformance[index] = { ...newPerformance[index], ...updates };
    onUpdate({ performance: newPerformance });
  };

  const addIndicator = () => {
    onUpdate({
      performance: [
        ...performance,
        {
          id: uid(),
          name: '',
          value: '',
          unit: '',
          description: '',
          featured: false,
          sortOrder: performance.length,
          isVisible: true,
        },
      ],
    });
  };

  const removeIndicator = (index: number) => {
    onUpdate({
      performance: performance
        .filter((_, i) => i !== index)
        .map((indicator, sortOrder) => ({ ...indicator, sortOrder })),
    });
  };

  const moveIndicator = (index: number, offset: number) => {
    const reordered = moveItem(performance, index, index + offset);
    onUpdate({
      performance: reordered.map((indicator, sortOrder) => ({ ...indicator, sortOrder })),
    });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Performance e Indicadores</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Adicione dados de performance, Lighthouse, Core Web Vitals, etc.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título público da seção</label>
        <input
          type="text"
          value={caseStudy.performanceTitle ?? ''}
          onChange={(event) => onUpdate({ performanceTitle: event.target.value })}
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={addIndicator}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:glow-neon text-xs font-bold uppercase tracking-widest transition-all"
        >
          <Plus className="size-4" /> Adicionar Indicador
        </button>
      </div>

      <div className="space-y-4">
        {performance.map((indicator, idx) => (
          <div
            key={indicator.id}
            className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <input
                type="text"
                value={indicator.name}
                onChange={(e) => updateIndicator(idx, { name: e.target.value })}
                placeholder="Nome do indicador"
                className="flex-1 px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <div className="flex shrink-0">
                <button
                  type="button"
                  aria-label="Mover indicador para cima"
                  disabled={idx === 0}
                  onClick={() => moveIndicator(idx, -1)}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Mover indicador para baixo"
                  disabled={idx === performance.length - 1}
                  onClick={() => moveIndicator(idx, 1)}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeIndicator(idx)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                value={indicator.value}
                onChange={(e) => updateIndicator(idx, { value: e.target.value })}
                placeholder="Valor"
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <input
                type="text"
                value={indicator.max || ''}
                onChange={(e) => updateIndicator(idx, { max: e.target.value })}
                placeholder="Máximo"
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <input
                type="text"
                value={indicator.unit || ''}
                onChange={(e) => updateIndicator(idx, { unit: e.target.value })}
                placeholder="Unidade"
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
            </div>

            <input
              type="text"
              value={indicator.icon || ''}
              onChange={(e) => updateIndicator(idx, { icon: e.target.value })}
              placeholder="Ícone"
              className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
            />

            <textarea
              value={indicator.description || ''}
              onChange={(e) => updateIndicator(idx, { description: e.target.value })}
              placeholder="Descrição (opcional)"
              rows={2}
              className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors resize-none"
            />

            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={indicator.featured ?? false}
                  onChange={(e) => updateIndicator(idx, { featured: e.target.checked })}
                  className="rounded"
                />
                Destaque
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={indicator.isVisible}
                  onChange={(e) => updateIndicator(idx, { isVisible: e.target.checked })}
                  className="rounded"
                />
                Visível
              </label>
            </div>
          </div>
        ))}

        {performance.length === 0 && (
          <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            Nenhum indicador adicionado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
