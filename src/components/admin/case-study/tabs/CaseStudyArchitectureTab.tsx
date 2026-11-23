import { useMemo, useState } from 'react';
import type { CaseStudyV2, ArchitectureConfig } from '@/lib/case-study';
import { ARCHITECTURE_STACK_FIELDS, getArchitectureStackSummaries } from '@/lib/case-study';
import { useTechnologies } from '@/lib/projects-store';

interface CaseStudyArchitectureTabProps {
  caseStudy: CaseStudyV2;
  projectTechnologies?: string[];
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

export function CaseStudyArchitectureTab({
  caseStudy,
  projectTechnologies = [],
  onUpdate,
}: CaseStudyArchitectureTabProps) {
  const arch = caseStudy.architecture;
  const { items: catalog } = useTechnologies();
  const [technologySearch, setTechnologySearch] = useState('');

  const updateArchitecture = (updates: Partial<ArchitectureConfig>) => {
    onUpdate({ architecture: { ...arch, ...updates } });
  };
  const legacySummaries = getArchitectureStackSummaries(arch.groups);
  const legacyNames = new Set(projectTechnologies.map((name) => name.trim().toLocaleLowerCase()));
  const selectedTechnologyIds = arch.technologySelectionSet
    ? arch.technologyIds
    : arch.technologyIds.length > 0
      ? arch.technologyIds
      : catalog
          .filter((item) => legacyNames.has(item.name.trim().toLocaleLowerCase()))
          .map((item) => item.id);
  const filteredTechnologies = useMemo(() => {
    const query = technologySearch.trim().toLocaleLowerCase();
    return query
      ? catalog.filter(
          (item) =>
            item.name.toLocaleLowerCase().includes(query) ||
            item.category.toLocaleLowerCase().includes(query),
        )
      : catalog;
  }, [catalog, technologySearch]);

  const toggleTechnology = (technologyId: string, checked: boolean) => {
    const next = new Set(selectedTechnologyIds);
    if (checked) next.add(technologyId);
    else next.delete(technologyId);
    updateArchitecture({
      technologyIds: Array.from(next),
      technologySelectionSet: true,
    });
  };

  return (
    <div className="space-y-8 max-w-3xl" lang="pt-BR" spellCheck>
      <div>
        <h2 className="text-2xl font-bold mb-6">Arquitetura do Projeto</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Organize as tecnologias e componentes de arquitetura em grupos.
        </p>
      </div>

      {/* Eyebrow and Title */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Eyebrow</label>
          <input
            type="text"
            value={arch.eyebrow || ''}
            onChange={(e) => updateArchitecture({ eyebrow: e.target.value })}
            placeholder="ex: 02 — ARQUITETURA"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Título</label>
          <input
            type="text"
            value={arch.title || ''}
            onChange={(e) => updateArchitecture({ title: e.target.value })}
            placeholder="ex: Arquitetura do projeto."
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Descrição</label>
          <textarea
            value={arch.description || ''}
            onChange={(e) => updateArchitecture({ description: e.target.value })}
            placeholder="Descrição geral da arquitetura"
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Destaque visual</label>
          <textarea
            value={arch.highlightText || ''}
            onChange={(e) => updateArchitecture({ highlightText: e.target.value })}
            placeholder="Uma frase curta que resuma a abordagem técnica deste projeto"
            rows={2}
            spellCheck
            className="w-full resize-y rounded-lg border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <p className="text-xs text-muted-foreground">
            Este texto aparece no painel destacado à direita da arquitetura.
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-8">
        <div>
          <h3 className="font-semibold">Resumo por camada</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Os nomes e ícones das quatro camadas são fixos. Edite abaixo o conteúdo exibido em
            branco sob cada uma.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ARCHITECTURE_STACK_FIELDS.map(({ key, label }) => (
            <label key={key} className="space-y-2">
              <span className="block text-sm font-semibold">{label}</span>
              <textarea
                value={arch.stackDetails?.[key] ?? legacySummaries[key]}
                onChange={(event) =>
                  updateArchitecture({
                    stackDetails: {
                      ...arch.stackDetails,
                      [key]: event.target.value,
                    },
                  })
                }
                placeholder={`Descreva as tecnologias ou decisões de ${label.toLocaleLowerCase('pt-BR')}`}
                rows={2}
                spellCheck
                className="w-full resize-y rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-8">
        <div>
          <h3 className="font-semibold">Tecnologias utilizadas neste projeto</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione no catálogo as tecnologias que foram usadas aqui. Somente as selecionadas
            aparecerão na arquitetura deste projeto.
          </p>
        </div>
        <input
          type="search"
          value={technologySearch}
          onChange={(event) => setTechnologySearch(event.target.value)}
          placeholder="Buscar tecnologia..."
          aria-label="Buscar tecnologia no catálogo"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        {filteredTechnologies.length > 0 ? (
          <div className="grid max-h-80 gap-2 overflow-y-auto rounded-lg border border-border p-3 sm:grid-cols-2">
            {filteredTechnologies.map((technology) => (
              <label
                key={technology.id}
                className="flex min-w-0 cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <input
                  type="checkbox"
                  checked={selectedTechnologyIds.includes(technology.id)}
                  onChange={(event) => toggleTechnology(technology.id, event.target.checked)}
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="min-w-0 flex-1 truncate text-sm">{technology.name}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {technology.category}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
            {catalog.length === 0
              ? 'Nenhuma tecnologia cadastrada. Adicione tecnologias no catálogo para selecioná-las neste projeto.'
              : 'Nenhuma tecnologia corresponde à busca.'}
          </p>
        )}
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {selectedTechnologyIds.length} tecnologia
          {selectedTechnologyIds.length === 1 ? '' : 's'} selecionada
          {selectedTechnologyIds.length === 1 ? '' : 's'}.
        </p>
      </div>
    </div>
  );
}
