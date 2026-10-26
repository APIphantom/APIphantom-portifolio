import { useState } from 'react';
import type { Project } from '@/lib/projects-store';
import { CATEGORIES } from '@/lib/projects-store';
import { slugify } from '@/lib/projects-store';

interface CaseStudyGeneralTabProps {
  formData: Omit<Project, 'id'>;
  isNew?: boolean;
  onUpdate: (updates: Partial<Omit<Project, 'caseStudy'>>) => void;
}

export function CaseStudyGeneralTab({
  formData,
  isNew = false,
  onUpdate,
}: CaseStudyGeneralTabProps) {
  const [slugError, setSlugError] = useState<string | null>(null);

  const handleSlugChange = (value: string) => {
    const clean = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '');

    if (!clean) {
      setSlugError('Slug não pode estar vazio');
    } else if (!/^[a-z0-9]/.test(clean)) {
      setSlugError('Slug deve começar com letra ou número');
    } else if (!/[a-z0-9]$/.test(clean)) {
      setSlugError('Slug deve terminar com letra ou número');
    } else {
      setSlugError(null);
    }

    onUpdate({ slug: clean });
  };

  return (
    <div className="space-y-8 max-w-3xl" lang="pt-BR" spellCheck>
      <div>
        <h2 className="text-2xl font-bold mb-6">Informações Gerais do Projeto</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Configure as informações básicas que aparecem em todo o portfólio.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título do Projeto *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            const title = e.target.value;
            const updates: Partial<Omit<Project, 'caseStudy'>> = { title };
            if (isNew && (!formData.slug || formData.slug === slugify(formData.title))) {
              updates.slug = slugify(title);
            }
            onUpdate(updates);
          }}
          spellCheck
          placeholder="ex: SEMOP — Volta Redonda"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
        <p className="text-xs text-muted-foreground">Este é o nome principal do projeto</p>
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Slug (URL) *</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          spellCheck={false}
          placeholder="ex: semop-volta-redonda"
          className={`w-full px-4 py-3 rounded-lg bg-card border text-foreground placeholder-muted-foreground focus:outline-none transition-colors ${
            slugError ? 'border-destructive' : 'border-border focus:border-primary'
          }`}
        />
        {slugError && <p className="text-xs text-destructive">{slugError}</p>}
        <p className="text-xs text-muted-foreground">
          URL amigável do projeto. Aparecerá em /projetos/[slug]
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Descrição Curta *</label>
        <textarea
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Uma descrição breve do projeto (1-2 linhas)"
          rows={2}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
        />
        <p className="text-xs text-muted-foreground">Aparece na listagem de projetos</p>
      </div>

      {/* Long Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Descrição Completa</label>
        <textarea
          value={formData.longDescription || ''}
          onChange={(e) => onUpdate({ longDescription: e.target.value })}
          placeholder="Descrição detalhada do projeto"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Categoria *</label>
        <select
          value={formData.category}
          onChange={(e) => {
            const category = CATEGORIES.find((item) => item.value === e.target.value)?.value;
            if (category) onUpdate({ category });
          }}
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:border-primary outline-none transition-colors"
        >
          <option value="">Selecionar categoria</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Client */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Cliente</label>
        <input
          type="text"
          value={formData.client || ''}
          onChange={(e) => onUpdate({ client: e.target.value })}
          placeholder="ex: Prefeitura de Volta Redonda"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Year and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Ano</label>
          <input
            type="text"
            value={formData.year || ''}
            onChange={(e) => onUpdate({ year: e.target.value })}
            placeholder="ex: 2024"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Duração</label>
          <input
            type="text"
            value={formData.duration || ''}
            onChange={(e) => onUpdate({ duration: e.target.value })}
            placeholder="ex: 3 meses"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Seu Papel</label>
        <input
          type="text"
          value={formData.role || ''}
          onChange={(e) => onUpdate({ role: e.target.value })}
          placeholder="ex: Full Stack Developer"
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* GitHub */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">GitHub (Link)</label>
        <input
          type="url"
          value={formData.github || ''}
          onChange={(e) => onUpdate({ github: e.target.value })}
          placeholder="https://github.com/..."
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Demo */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Link do Projeto (Demo)</label>
        <input
          type="url"
          value={formData.demo || ''}
          onChange={(e) => onUpdate({ demo: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Main Image */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Imagem Principal (URL)</label>
        <input
          type="url"
          value={formData.image || ''}
          onChange={(e) => onUpdate({ image: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
        />
        <p className="text-xs text-muted-foreground">Imagem que aparece na listagem de projetos</p>
        {formData.image && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border h-32">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
