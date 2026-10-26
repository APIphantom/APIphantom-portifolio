import { Plus, Trash2 } from 'lucide-react';
import type { CaseStudyV2 } from '@/lib/case-study';
import type { LegacyCaseStudy, Project } from '@/lib/projects-store';

type ProjectNarrativeKey = 'objective' | 'problem' | 'solution' | 'result';
type LegacyListKey = 'timeline' | 'developmentProcess';

const narrativeFields: Array<{ key: ProjectNarrativeKey; label: string; hint: string }> = [
  { key: 'objective', label: 'Objetivo', hint: 'O que o projeto precisava alcançar?' },
  { key: 'problem', label: 'Problema', hint: 'Qual necessidade motivou o projeto?' },
  { key: 'solution', label: 'Solução', hint: 'Como a necessidade foi atendida?' },
  { key: 'result', label: 'Resultado', hint: 'Quais resultados estão registrados?' },
];

const listFields: Array<{ key: LegacyListKey; label: string; placeholder: string }> = [
  { key: 'timeline', label: 'Linha do tempo', placeholder: 'Semana 1 -> Pesquisa e planejamento' },
  {
    key: 'developmentProcess',
    label: 'Etapas do projeto (usadas quando a linha do tempo estiver vazia)',
    placeholder: 'Ex.: prototipação e validação da interface',
  },
];

type Props = {
  formData: Pick<Project, ProjectNarrativeKey>;
  caseStudy: CaseStudyV2;
  onUpdateProject: (updates: Partial<Omit<Project, 'caseStudy'>>) => void;
  onUpdateCaseStudy: (updates: Partial<CaseStudyV2>) => void;
};

export function CaseStudyProcessTab({
  formData,
  caseStudy,
  onUpdateProject,
  onUpdateCaseStudy,
}: Props) {
  const legacy = caseStudy.legacy ?? {};
  const updateLegacy = (updates: Partial<LegacyCaseStudy>) =>
    onUpdateCaseStudy({ legacy: { ...legacy, ...updates } });

  return (
    <div className="mx-auto max-w-4xl space-y-10" lang="pt-BR" spellCheck>
      <header>
        <h2 className="text-2xl font-bold">Processo e narrativa</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Registre o contexto e as etapas reais do projeto. As semanas aparecem na apresentação
          quando forem informadas aqui.
        </p>
      </header>

      <section className="space-y-5">
        <h3 className="border-b border-border pb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Contexto do projeto
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          {narrativeFields.map(({ key, label, hint }) => (
            <label key={key} className="space-y-2">
              <span className="block text-sm font-semibold">{label}</span>
              <textarea
                value={formData[key] ?? ''}
                onChange={(event) => onUpdateProject({ [key]: event.target.value })}
                placeholder={hint}
                rows={3}
                spellCheck
                className="w-full resize-y rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="border-b border-border pb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Linha do tempo e execução
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Use “Semana 1 → etapa” quando o período estiver confirmado. Não inclua semanas estimadas
            como se fossem datas reais.
          </p>
        </div>
        {listFields.map(({ key, label, placeholder }) => (
          <StringListField
            key={key}
            label={label}
            placeholder={placeholder}
            values={legacy[key] ?? []}
            onChange={(values) => updateLegacy({ [key]: values })}
          />
        ))}
      </section>
    </div>
  );
}

function StringListField({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <fieldset className="case-study-surface space-y-3 rounded-xl border p-4 sm:p-5">
      <legend className="px-2 text-sm font-semibold">{label}</legend>
      {values.map((value, index) => (
        <div key={`${label}-${index}`} className="flex items-start gap-2">
          <textarea
            value={value}
            onChange={(event) =>
              onChange(
                values.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
              )
            }
            placeholder={placeholder}
            rows={2}
            spellCheck
            className="min-w-0 flex-1 resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="button"
            aria-label={`Remover item ${index + 1} de ${label}`}
            onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            className="case-study-card-icon size-10 rounded-lg hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" aria-hidden="true" /> Adicionar item
      </button>
    </fieldset>
  );
}
