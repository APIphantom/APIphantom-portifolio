import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { CaseStudyV2, ProjectFeature } from '@/lib/case-study';
import { moveItem, uid } from '@/lib/case-study';

interface CaseStudyFeaturesTabProps {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

export function CaseStudyFeaturesTab({ caseStudy, onUpdate }: CaseStudyFeaturesTabProps) {
  const features = caseStudy.features;

  const updateFeature = (index: number, updates: Partial<ProjectFeature>) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    onUpdate({ features: newFeatures });
  };

  const addFeature = () => {
    onUpdate({
      features: [
        ...features,
        {
          id: uid(),
          title: '',
          description: '',
          image: undefined,
          link: undefined,
          sortOrder: features.length,
          isVisible: true,
        },
      ],
    });
  };

  const removeFeature = (index: number) => {
    onUpdate({ features: features.filter((_, i) => i !== index) });
  };

  const moveFeature = (index: number, offset: number) => {
    const reordered = moveItem(features, index, index + offset);
    onUpdate({ features: reordered.map((feature, sortOrder) => ({ ...feature, sortOrder })) });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Funcionalidades</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Adicione as principais funcionalidades ou características do projeto.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título público da seção</label>
        <input
          type="text"
          value={caseStudy.featuresTitle ?? ''}
          onChange={(event) => onUpdate({ featuresTitle: event.target.value })}
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={addFeature}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:glow-neon text-xs font-bold uppercase tracking-widest transition-all"
        >
          <Plus className="size-4" /> Adicionar Funcionalidade
        </button>
      </div>

      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div
            key={feature.id}
            className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <input
                type="text"
                value={feature.title}
                onChange={(e) => updateFeature(idx, { title: e.target.value })}
                placeholder="Título da funcionalidade"
                className="flex-1 px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <div className="flex shrink-0">
                <button
                  type="button"
                  aria-label="Mover funcionalidade para cima"
                  disabled={idx === 0}
                  onClick={() => moveFeature(idx, -1)}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Mover funcionalidade para baixo"
                  disabled={idx === features.length - 1}
                  onClick={() => moveFeature(idx, 1)}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <textarea
              value={feature.description}
              onChange={(e) => updateFeature(idx, { description: e.target.value })}
              placeholder="Descrição da funcionalidade"
              rows={2}
              className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={feature.icon || ''}
                onChange={(e) => updateFeature(idx, { icon: e.target.value })}
                placeholder="Ícone"
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <input
                type="url"
                value={feature.link || ''}
                onChange={(e) => updateFeature(idx, { link: e.target.value })}
                placeholder="Link (opcional)"
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
            </div>

            <input
              type="url"
              value={feature.image || ''}
              onChange={(e) => updateFeature(idx, { image: e.target.value })}
              placeholder="Imagem (URL opcional)"
              className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={feature.isVisible}
                onChange={(e) => updateFeature(idx, { isVisible: e.target.checked })}
                className="rounded"
              />
              Visível
            </label>
          </div>
        ))}

        {features.length === 0 && (
          <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            Nenhuma funcionalidade adicionada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
