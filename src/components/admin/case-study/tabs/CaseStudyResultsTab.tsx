import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { CaseStudyV2, ProjectMetricItem } from '@/lib/case-study';
import { ICON_OPTIONS, moveItem, uid } from '@/lib/case-study';

interface CaseStudyResultsTabProps {
  caseStudy: CaseStudyV2;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : undefined;
}

function parseLighthouseReport(value: unknown): Omit<ProjectMetricItem, 'id' | 'sortOrder'>[] {
  const firstReport = Array.isArray(value) ? value[0] : value;
  const raw = asRecord(firstReport);
  const report = asRecord(raw?.lighthouseResult) ?? raw;
  const categories = asRecord(report?.categories);
  const categoryDefinitions = [
    { key: 'performance', title: 'Performance', icon: 'Gauge' },
    { key: 'accessibility', title: 'Acessibilidade', icon: 'Accessibility' },
    { key: 'best-practices', title: 'Boas práticas', icon: 'Shield' },
    { key: 'seo', title: 'SEO', icon: 'Search' },
  ];
  const parsed: Omit<ProjectMetricItem, 'id' | 'sortOrder'>[] = [];

  for (const category of categoryDefinitions) {
    const data = asRecord(categories?.[category.key]);
    const score = data?.score;
    if (typeof score !== 'number' || !Number.isFinite(score)) continue;

    parsed.push({
      value: String(Math.round(score * 100)),
      unit: '%',
      title: category.title,
      description: '',
      icon: category.icon,
      featured: category.key === 'performance',
      isVisible: true,
    });
  }

  const audits = asRecord(report?.audits);
  const auditDefinitions = [
    { key: 'largest-contentful-paint', fallbackTitle: 'Largest Contentful Paint', icon: 'Gauge' },
    { key: 'first-contentful-paint', fallbackTitle: 'First Contentful Paint', icon: 'Gauge' },
    { key: 'total-blocking-time', fallbackTitle: 'Total Blocking Time', icon: 'Clock' },
    { key: 'cumulative-layout-shift', fallbackTitle: 'Cumulative Layout Shift', icon: 'Monitor' },
    { key: 'speed-index', fallbackTitle: 'Speed Index', icon: 'Rocket' },
    { key: 'interactive', fallbackTitle: 'Time to Interactive', icon: 'Clock' },
  ];

  for (const auditDefinition of auditDefinitions) {
    const audit = asRecord(audits?.[auditDefinition.key]);
    const displayValue = audit?.displayValue;
    if (typeof displayValue !== 'string' || !displayValue.trim()) continue;

    parsed.push({
      value: displayValue.trim(),
      unit: '',
      title:
        typeof audit?.title === 'string' && audit.title.trim()
          ? audit.title.trim()
          : auditDefinition.fallbackTitle,
      description: '',
      icon: auditDefinition.icon,
      featured: false,
      isVisible: true,
    });
  }

  if (parsed.length && !parsed.some((metric) => metric.featured)) {
    parsed[0].featured = true;
  }
  return parsed;
}

export function CaseStudyResultsTab({ caseStudy, onUpdate }: CaseStudyResultsTabProps) {
  const [importMessage, setImportMessage] = useState('');
  const metrics = [...caseStudy.metrics].sort((a, b) => a.sortOrder - b.sortOrder);

  const updateMetric = (index: number, updates: Partial<ProjectMetricItem>) => {
    const newMetrics = metrics.map((metric, metricIndex) => ({
      ...metric,
      ...(updates.featured ? { featured: metricIndex === index } : {}),
    }));
    newMetrics[index] = { ...newMetrics[index], ...updates };
    onUpdate({ metrics: newMetrics });
  };

  const addMetric = () => {
    onUpdate({
      metrics: [
        ...metrics,
        {
          id: uid(),
          value: '',
          unit: '',
          title: '',
          description: '',
          featured: false,
          sortOrder: metrics.length,
          isVisible: true,
        },
      ],
    });
  };

  const removeMetric = (index: number) => {
    onUpdate({
      metrics: metrics
        .filter((_, i) => i !== index)
        .map((metric, sortOrder) => ({ ...metric, sortOrder })),
    });
  };

  const moveMetric = (index: number, offset: number) => {
    const reordered = moveItem(metrics, index, index + offset);
    onUpdate({ metrics: reordered.map((metric, sortOrder) => ({ ...metric, sortOrder })) });
  };

  const importLighthouseReport = async (file?: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setImportMessage('O arquivo excede o limite de 15 MB.');
      return;
    }

    try {
      const imported = parseLighthouseReport(JSON.parse(await file.text()));
      if (!imported.length) {
        setImportMessage(
          'Não encontrei pontuações nem métricas Lighthouse reconhecidas nesse JSON.',
        );
        return;
      }

      const merged = [...metrics];
      for (const item of imported) {
        const existingIndex = merged.findIndex(
          (metric) =>
            metric.title.trim().toLocaleLowerCase('pt-BR') ===
            item.title.trim().toLocaleLowerCase('pt-BR'),
        );
        if (existingIndex >= 0) {
          const existing = merged[existingIndex];
          merged[existingIndex] = {
            ...existing,
            ...item,
            id: existing.id,
            sortOrder: existing.sortOrder,
            isVisible: existing.isVisible,
            description: existing.description,
          };
        } else {
          merged.push({ ...item, id: uid(), sortOrder: merged.length });
        }
      }

      const selectedFeatured =
        metrics.find((metric) => metric.featured)?.id ??
        merged.find((metric) => metric.title === 'Performance')?.id ??
        merged[0]?.id;
      const categoryScores = imported
        .filter((metric) => metric.unit === '%')
        .map((metric) => `${metric.title}: ${metric.value}${metric.unit}`);
      const generatedSummary = categoryScores.length
        ? `Pontuações do relatório Lighthouse: ${categoryScores.join(', ')}.`
        : '';
      const previousSummary = caseStudy.metricsSummary?.trim() ?? '';
      onUpdate({
        metrics: merged.map((metric, sortOrder) => ({
          ...metric,
          sortOrder,
          featured: metric.id === selectedFeatured,
        })),
        ...(generatedSummary &&
        (!previousSummary || previousSummary.startsWith('Pontuações do relatório Lighthouse:'))
          ? { metricsSummary: generatedSummary }
          : {}),
      });
      setImportMessage(
        `${imported.length} indicadores importados. Revise os valores antes de publicar.`,
      );
    } catch {
      setImportMessage('Não foi possível ler esse arquivo. Envie um relatório Lighthouse em JSON.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Resultados e Impacto</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Configure o resumo central e quantos indicadores personalizados precisar para as três
          áreas da apresentação.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold">Título público da seção</label>
        <input
          type="text"
          value={caseStudy.metricsTitle ?? ''}
          onChange={(event) => onUpdate({ metricsTitle: event.target.value })}
          placeholder="Resultados e impacto."
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
        />
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold">Resumo central dos resultados</span>
        <textarea
          value={caseStudy.metricsSummary ?? ''}
          onChange={(event) => onUpdate({ metricsSummary: event.target.value })}
          placeholder="Explique o contexto dos resultados e em quais condições foram medidos."
          rows={3}
          spellCheck
          className="w-full resize-y rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <div className="case-study-surface space-y-3 rounded-xl border p-4">
        <div>
          <h3 className="text-sm font-semibold">Importar relatório Lighthouse</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Selecione um relatório JSON. Pontuações de performance, acessibilidade, boas práticas,
            SEO e métricas de carregamento serão adicionadas ou atualizadas localmente.
          </p>
        </div>
        <input
          type="file"
          accept=".json,application/json"
          aria-label="Selecionar relatório Lighthouse em JSON"
          onChange={(event) => {
            void importLighthouseReport(event.target.files?.[0]);
            event.currentTarget.value = '';
          }}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-border file:bg-card file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:border-primary"
        />
        {importMessage ? (
          <p className="text-xs text-muted-foreground" role="status" aria-live="polite">
            {importMessage}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={addMetric}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:glow-neon text-xs font-bold uppercase tracking-widest transition-all"
        >
          <Plus className="size-4" /> Adicionar Métrica
        </button>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div
            key={metric.id}
            className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <input
                type="text"
                value={metric.value}
                onChange={(e) => updateMetric(idx, { value: e.target.value })}
                placeholder="Valor (ex: 1000)"
                className="flex-1 px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <div className="flex shrink-0">
                <button
                  type="button"
                  aria-label="Mover métrica para cima"
                  disabled={idx === 0}
                  onClick={() => moveMetric(idx, -1)}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Mover métrica para baixo"
                  disabled={idx === metrics.length - 1}
                  onClick={() => moveMetric(idx, 1)}
                  className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeMetric(idx)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={metric.unit || ''}
                onChange={(e) => updateMetric(idx, { unit: e.target.value })}
                placeholder="Unidade (ex: %)"
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              />
              <select
                value={metric.icon || ''}
                onChange={(e) => updateMetric(idx, { icon: e.target.value || undefined })}
                aria-label={`Ícone da métrica ${idx + 1}`}
                className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
              >
                <option value="">Ícone automático</option>
                {metric.icon &&
                !ICON_OPTIONS.includes(metric.icon as (typeof ICON_OPTIONS)[number]) ? (
                  <option value={metric.icon}>{metric.icon} (atual)</option>
                ) : null}
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={metric.title}
              onChange={(e) => updateMetric(idx, { title: e.target.value })}
              placeholder="Título da métrica"
              className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
            />

            <textarea
              value={metric.description || ''}
              onChange={(e) => updateMetric(idx, { description: e.target.value })}
              placeholder="Descrição (opcional)"
              rows={2}
              className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors resize-none"
            />

            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={metric.featured}
                  onChange={(e) => updateMetric(idx, { featured: e.target.checked })}
                  className="rounded"
                />
                Destaque
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={metric.isVisible}
                  onChange={(e) => updateMetric(idx, { isVisible: e.target.checked })}
                  className="rounded"
                />
                Visível
              </label>
            </div>
          </div>
        ))}

        {metrics.length === 0 && (
          <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            Nenhuma métrica adicionada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
