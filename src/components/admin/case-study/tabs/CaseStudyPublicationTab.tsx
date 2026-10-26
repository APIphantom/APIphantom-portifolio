import type { Project, ProjectStatus } from '@/lib/projects-store';

interface CaseStudyPublicationTabProps {
  formData: Omit<Project, 'id'>;
  onUpdate: (updates: Partial<Omit<Project, 'caseStudy'>>) => void;
}

export function CaseStudyPublicationTab({ formData, onUpdate }: CaseStudyPublicationTabProps) {
  const publication = formData.publication || { status: 'draft', visibility: 'public' };

  const updatePublication = (updates: Partial<typeof publication>) => {
    onUpdate({ publication: { ...publication, ...updates } });
  };

  const status = (publication.status || 'draft') as ProjectStatus;
  const visibility = publication.visibility || 'public';

  const statusOptions: Array<{ value: ProjectStatus; label: string; description: string }> = [
    {
      value: 'draft',
      label: 'Rascunho',
      description: 'Somente você consegue ver. Não é indexado.',
    },
    {
      value: 'in_review',
      label: 'Em Revisão',
      description: 'Projeto em fase de revisão antes de publicar.',
    },
    {
      value: 'published',
      label: 'Publicado',
      description: 'Visível no portfólio e indexado nos motores de busca.',
    },
    {
      value: 'archived',
      label: 'Arquivado',
      description: 'Projeto não é mais exibido, mas os dados são preservados.',
    },
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Público' },
    { value: 'private', label: 'Privado' },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Publicação</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Controle a visibilidade e o status de publicação do projeto.
        </p>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="font-semibold">Status do Projeto</h3>

        <div className="space-y-2">
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={status === option.value}
                onChange={(e) => updatePublication({ status: e.target.value as ProjectStatus })}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{option.label}</div>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div className="border-t border-border pt-8 space-y-4">
        <h3 className="font-semibold">Visibilidade</h3>

        <div className="space-y-2">
          {visibilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={visibility === option.value}
                onChange={(e) =>
                  updatePublication({ visibility: e.target.value as 'public' | 'private' })
                }
              />
              <span className="text-sm font-semibold">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="border-t border-border pt-8">
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer">
          <input
            type="checkbox"
            checked={publication.featured ?? false}
            onChange={(e) => updatePublication({ featured: e.target.checked })}
            className="rounded"
          />
          <div>
            <span className="text-sm font-semibold block">Projeto em Destaque</span>
            <span className="text-xs text-muted-foreground">
              Exibe este projeto em destaque na página inicial
            </span>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="border-t border-border pt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="text-sm space-y-2">
          <p>
            <span className="font-semibold">Publicado em:</span>{' '}
            {publication.publishedAt
              ? new Date(publication.publishedAt).toLocaleDateString('pt-BR')
              : 'Não publicado'}
          </p>
          <p>
            <span className="font-semibold">Status atual:</span>{' '}
            {statusOptions.find((o) => o.value === status)?.label}
          </p>
        </div>
      </div>
    </div>
  );
}
