import type { Project } from '@/lib/projects-store';

interface CaseStudySEOTabProps {
  formData: Omit<Project, 'id'>;
  onUpdate: (updates: Partial<Omit<Project, 'caseStudy'>>) => void;
}

export function CaseStudySEOTab({ formData, onUpdate }: CaseStudySEOTabProps) {
  const seo = formData.seo || {};

  const updateSEO = (updates: Partial<typeof seo>) => {
    onUpdate({ seo: { ...seo, ...updates } });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">SEO e Metadados</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Configure informações de SEO para melhor indexação e compartilhamento.
        </p>
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Meta Title</label>
        <input
          type="text"
          value={seo.metaTitle || ''}
          onChange={(e) => updateSEO({ metaTitle: e.target.value })}
          placeholder="ex: SEMOP — Volta Redonda | Portfólio"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
        <p className="text-xs text-muted-foreground">Recomendado: 30-60 caracteres</p>
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Meta Description</label>
        <textarea
          value={seo.metaDescription || ''}
          onChange={(e) => updateSEO({ metaDescription: e.target.value })}
          placeholder="Descrição breve para os resultados de busca"
          rows={2}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground">Recomendado: 120-160 caracteres</p>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Keywords</label>
        <input
          type="text"
          value={seo.keywords || ''}
          onChange={(e) => updateSEO({ keywords: e.target.value })}
          placeholder="ex: SEMOP, Volta Redonda, web app, portal"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
        <p className="text-xs text-muted-foreground">Separadas por vírgula</p>
      </div>

      {/* Canonical URL */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Canonical URL</label>
        <input
          type="url"
          value={seo.canonicalUrl || ''}
          onChange={(e) => updateSEO({ canonicalUrl: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Open Graph */}
      <div className="border-t border-border pt-8">
        <h3 className="font-semibold mb-4">Open Graph (Compartilhamento)</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold">OG Title</label>
            <input
              type="text"
              value={seo.ogTitle || ''}
              onChange={(e) => updateSEO({ ogTitle: e.target.value })}
              placeholder="Título para redes sociais"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">OG Description</label>
            <textarea
              value={seo.ogDescription || ''}
              onChange={(e) => updateSEO({ ogDescription: e.target.value })}
              placeholder="Descrição para redes sociais"
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">OG Image (URL)</label>
            <input
              type="url"
              value={seo.ogImage || ''}
              onChange={(e) => updateSEO({ ogImage: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
            />
            {seo.ogImage && (
              <div className="mt-3 rounded-lg overflow-hidden border border-border h-32">
                <img src={seo.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Robots */}
      <div className="border-t border-border pt-8">
        <h3 className="font-semibold mb-4">Robots Meta</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer">
            <input
              type="checkbox"
              checked={seo.robotsIndex !== false}
              onChange={(e) => updateSEO({ robotsIndex: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-semibold">Indexar página (index)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer">
            <input
              type="checkbox"
              checked={seo.robotsFollow !== false}
              onChange={(e) => updateSEO({ robotsFollow: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-semibold">Seguir links (follow)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
