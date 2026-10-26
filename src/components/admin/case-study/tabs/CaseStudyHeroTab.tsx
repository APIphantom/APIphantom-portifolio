import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { CaseStudyV2, HeroConfig, ProjectMetaItem, CtaButton } from '@/lib/case-study';
import { uid, emptyCta } from '@/lib/case-study';

interface CaseStudyHeroTabProps {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

export function CaseStudyHeroTab({ caseStudy, onUpdate }: CaseStudyHeroTabProps) {
  const hero = caseStudy.hero;

  const updateHero = (updates: Partial<HeroConfig>) => {
    onUpdate({ hero: { ...hero, ...updates } });
  };

  const updateMeta = (index: number, updates: Partial<ProjectMetaItem>) => {
    const newMeta = [...hero.meta];
    newMeta[index] = { ...newMeta[index], ...updates };
    updateHero({ meta: newMeta });
  };

  const addMeta = () => {
    updateHero({
      meta: [
        ...hero.meta,
        {
          id: uid(),
          label: '',
          value: '',
          sortOrder: hero.meta.length,
          isVisible: true,
        },
      ],
    });
  };

  const removeMeta = (index: number) => {
    updateHero({ meta: hero.meta.filter((_, i) => i !== index) });
  };

  const updateCta = (type: 'primaryCta' | 'secondaryCta', updates: Partial<CtaButton>) => {
    updateHero({ [type]: { ...hero[type], ...updates } });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Hero do Projeto</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Configure a seção principal de apresentação do projeto.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título do Hero</label>
        <input
          type="text"
          value={hero.title}
          onChange={(e) => updateHero({ title: e.target.value })}
          placeholder="ex: SEMOP"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Title Highlight */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título Destacado</label>
        <input
          type="text"
          value={hero.titleHighlight || ''}
          onChange={(e) => updateHero({ titleHighlight: e.target.value })}
          placeholder="ex: Volta Redonda (parte em amarelo)"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
        <p className="text-xs text-muted-foreground">Esta parte será exibida em amarelo neon</p>
      </div>

      {/* Badge */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Badge</label>
        <input
          type="text"
          value={hero.badge || ''}
          onChange={(e) => updateHero({ badge: e.target.value })}
          placeholder="ex: WEB APP"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Descrição</label>
        <textarea
          value={hero.description || ''}
          onChange={(e) => updateHero({ description: e.target.value })}
          placeholder="Descrição detalhada do projeto"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
        />
      </div>

      {/* Media URLs */}
      <div className="border-t border-border pt-8">
        <h3 className="font-semibold mb-4">Mídia do Hero</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Imagem Principal (URL)</label>
            <input
              type="url"
              value={hero.heroMediaUrl || ''}
              onChange={(e) => updateHero({ heroMediaUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Vídeo (URL)</label>
            <input
              type="url"
              value={hero.heroVideoUrl || ''}
              onChange={(e) => updateHero({ heroVideoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Desktop (URL)</label>
            <input
              type="url"
              value={hero.desktopMediaUrl || ''}
              onChange={(e) => updateHero({ desktopMediaUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Mobile (URL)</label>
            <input
              type="url"
              value={hero.mobileMediaUrl || ''}
              onChange={(e) => updateHero({ mobileMediaUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Informações Resumidas</h3>
          <button
            onClick={addMeta}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:glow-neon text-xs font-semibold uppercase transition-all"
          >
            <Plus className="size-4" /> Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {hero.meta.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
            >
              <GripVertical className="size-5 text-muted-foreground mt-2 flex-shrink-0" />

              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateMeta(idx, { label: e.target.value })}
                  placeholder="Rótulo (ex: Ano)"
                  className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateMeta(idx, { value: e.target.value })}
                  placeholder="Valor (ex: 2024)"
                  className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                />
              </div>

              <button
                onClick={() => removeMeta(idx)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="border-t border-border pt-8">
        <h3 className="font-semibold mb-4">Botões de Ação</h3>

        <div className="space-y-6">
          {/* Primary Button */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Botão Primário</h4>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hero.primaryCta.enabled}
                  onChange={(e) => updateCta('primaryCta', { enabled: e.target.checked })}
                  className="rounded"
                />
                Ativo
              </label>
            </div>

            {hero.primaryCta.enabled && (
              <>
                <input
                  type="text"
                  value={hero.primaryCta.label}
                  onChange={(e) => updateCta('primaryCta', { label: e.target.value })}
                  placeholder="ex: Ver projeto ao vivo"
                  className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                />
                <input
                  type="url"
                  value={hero.primaryCta.url}
                  onChange={(e) => updateCta('primaryCta', { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hero.primaryCta.newTab}
                    onChange={(e) => updateCta('primaryCta', { newTab: e.target.checked })}
                    className="rounded"
                  />
                  Abrir em nova aba
                </label>
              </>
            )}
          </div>

          {/* Secondary Button */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Botão Secundário</h4>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hero.secondaryCta.enabled}
                  onChange={(e) => updateCta('secondaryCta', { enabled: e.target.checked })}
                  className="rounded"
                />
                Ativo
              </label>
            </div>

            {hero.secondaryCta.enabled && (
              <>
                <input
                  type="text"
                  value={hero.secondaryCta.label}
                  onChange={(e) => updateCta('secondaryCta', { label: e.target.value })}
                  placeholder="ex: Ver no GitHub"
                  className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                />
                <input
                  type="url"
                  value={hero.secondaryCta.url}
                  onChange={(e) => updateCta('secondaryCta', { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hero.secondaryCta.newTab}
                    onChange={(e) => updateCta('secondaryCta', { newTab: e.target.checked })}
                    className="rounded"
                  />
                  Abrir em nova aba
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
