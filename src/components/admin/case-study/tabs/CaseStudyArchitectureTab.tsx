import type { CaseStudyV2, ArchitectureConfig } from '@/lib/case-study';
import { ARCHITECTURE_STACK_FIELDS, getArchitectureStackSummaries } from '@/lib/case-study';

interface CaseStudyArchitectureTabProps {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

export function CaseStudyArchitectureTab({ caseStudy, onUpdate }: CaseStudyArchitectureTabProps) {
  const arch = caseStudy.architecture;

  const updateArchitecture = (updates: Partial<ArchitectureConfig>) => {
    onUpdate({ architecture: { ...arch, ...updates } });
  };
  const legacySummaries = getArchitectureStackSummaries(arch.groups);

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
    </div>
  );
}
