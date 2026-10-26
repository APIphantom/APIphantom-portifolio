import type { CtaButton, CtaConfig } from '@/lib/case-study';
import type { CaseStudyV2 } from '@/lib/case-study';

export function CaseStudyCtaTab({
  caseStudy,
  onUpdate,
}: {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}) {
  const cta = caseStudy.cta;
  const updateCta = (updates: Partial<CtaConfig>) => onUpdate({ cta: { ...cta, ...updates } });
  const updateButton = (key: 'primary' | 'secondary', updates: Partial<CtaButton>) => {
    updateCta({ [key]: { ...cta[key], ...updates } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h2 className="text-2xl font-bold">Banner final</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Edite os textos e destinos dos botões exibidos no fim da apresentação.
        </p>
      </header>

      <section className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Rótulo pequeno</span>
          <input
            value={cta.eyebrow ?? ''}
            onChange={(event) => updateCta({ eyebrow: event.target.value })}
            placeholder="// Próximo projeto"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Título</span>
          <input
            value={cta.title ?? ''}
            onChange={(event) => updateCta({ title: event.target.value })}
            placeholder="Gostou deste projeto?"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Subtítulo</span>
          <input
            value={cta.subtitle ?? ''}
            onChange={(event) => updateCta({ subtitle: event.target.value })}
            placeholder="Vamos criar algo incrível juntos."
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Texto complementar (opcional)</span>
          <textarea
            value={cta.text ?? ''}
            onChange={(event) => updateCta({ text: event.target.value })}
            rows={3}
            className="w-full resize-y rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </section>

      {(['primary', 'secondary'] as const).map((key) => {
        const button = cta[key];
        const isPrimary = key === 'primary';
        const title = isPrimary ? 'Botão de contato' : 'Botão de projetos';
        const defaultLabel = isPrimary ? 'Entrar em contato' : 'Ver mais projetos';
        const defaultUrl = isPrimary ? '/#contato' : '/#projetos';
        return (
          <section key={key} className="case-study-surface space-y-4 rounded-xl border p-4 sm:p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{title}</h3>
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Texto do botão</span>
              <input
                value={button.label || defaultLabel}
                onChange={(event) =>
                  updateButton(key, {
                    label: event.target.value,
                    url: button.url || defaultUrl,
                    enabled: true,
                  })
                }
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Link</span>
              <input
                type="url"
                value={button.url || defaultUrl}
                onChange={(event) =>
                  updateButton(key, {
                    url: event.target.value,
                    enabled: Boolean(event.target.value),
                  })
                }
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={button.newTab}
                onChange={(event) =>
                  updateButton(key, {
                    newTab: event.target.checked,
                    url: button.url || defaultUrl,
                    enabled: true,
                  })
                }
                className="rounded"
              />
              Abrir em nova aba
            </label>
          </section>
        );
      })}
    </div>
  );
}
