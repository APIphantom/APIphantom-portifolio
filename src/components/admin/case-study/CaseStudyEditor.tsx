import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { motion, AnimatePresence } from 'framer-motion';
import { upsertProject } from '@/lib/portfolio.functions';
import type { Project } from '@/lib/projects-store';
import type { CaseStudyV2 } from '@/lib/case-study';
import { mergeCaseStudyUpdates, normalizeCaseStudy, validateCaseStudyV2 } from '@/lib/case-study';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Loader2, AlertCircle } from 'lucide-react';
import { CaseStudyGeneralTab } from './tabs/CaseStudyGeneralTab';
import { CaseStudyHeroTab } from './tabs/CaseStudyHeroTab';
import { CaseStudyOverviewTab } from './tabs/CaseStudyOverviewTab';
import { CaseStudyFeaturesTab } from './tabs/CaseStudyFeaturesTab';
import { CaseStudyArchitectureTab } from './tabs/CaseStudyArchitectureTab';
import { CaseStudyMediaTab } from './tabs/CaseStudyMediaTab';
import { CaseStudyResultsTab } from './tabs/CaseStudyResultsTab';
import { CaseStudyPerformanceTab } from './tabs/CaseStudyPerformanceTab';
import { CaseStudyCtaTab } from './tabs/CaseStudyCtaTab';
import { CaseStudySEOTab } from './tabs/CaseStudySEOTab';
import { CaseStudyPublicationTab } from './tabs/CaseStudyPublicationTab';
import { CaseStudyProcessTab } from './tabs/CaseStudyProcessTab';

type TabId =
  | 'geral'
  | 'hero'
  | 'visao-geral'
  | 'funcionalidades'
  | 'arquitetura'
  | 'processo'
  | 'midia'
  | 'resultados'
  | 'performance'
  | 'cta'
  | 'seo'
  | 'publicacao';

const TABS: Array<{ id: TabId; label: string; icon?: string }> = [
  { id: 'geral', label: 'Geral' },
  { id: 'hero', label: 'Hero' },
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'funcionalidades', label: 'Funcionalidades' },
  { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'processo', label: 'Processo' },
  { id: 'midia', label: 'Mídia' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'performance', label: 'Performance' },
  { id: 'cta', label: 'Banner final' },
  { id: 'seo', label: 'SEO' },
  { id: 'publicacao', label: 'Publicação' },
];

interface EditorState extends Omit<Project, 'caseStudy'> {
  caseStudy: CaseStudyV2;
  _isNew?: boolean;
  _hasChanges?: boolean;
  _errors?: string[];
}

type Props = {
  project: Project;
  isNew?: boolean;
};

export function CaseStudyEditor({ project, isNew = false }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState<TabId>('geral');
  const [formData, setFormData] = useState<EditorState>(() =>
    normalizeToEditorState(project, isNew),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const formDataRef = useRef(formData);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveInProgressRef = useRef(false);
  const saveRequestedRef = useRef(false);

  const upsert = useServerFn(upsertProject);
  const mutation = useMutation({
    mutationFn: (data: EditorState) => {
      const { _hasChanges, _errors, _isNew, ...cleanData } = data;
      if (_isNew) {
        const { id: _draftId, ...newProject } = cleanData;
        return upsert({ data: newProject });
      }
      return upsert({ data: cleanData });
    },
    onSuccess: async (savedProject) => {
      queryClient.setQueryData(['project', savedProject.id], savedProject);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', savedProject.id] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ]);
      setLastSaved(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      toast.success('Projeto salvo com sucesso!');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro ao salvar projeto';
      toast.error(message);
      const next = { ...formDataRef.current, _errors: [message] };
      formDataRef.current = next;
      setFormData(next);
    },
  });
  const { mutateAsync: saveProject } = mutation;

  const handleSave = useCallback(async () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }

    if (saveInProgressRef.current) {
      saveRequestedRef.current = true;
      return;
    }

    saveInProgressRef.current = true;
    setIsSaving(true);
    let createdProjectId: string | null = null;
    try {
      do {
        saveRequestedRef.current = false;
        const snapshot = formDataRef.current;
        if (!snapshot._hasChanges) break;

        if (!snapshot.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(snapshot.slug.trim())) {
          const next = {
            ...snapshot,
            _errors: [
              'Revise o título e o endereço: use um slug sem espaços, acentos ou hífen no final.',
            ],
          };
          formDataRef.current = next;
          setFormData(next);
          break;
        }

        const validation = validateCaseStudyV2(snapshot.caseStudy);
        if (!validation.success) {
          const issue = validation.error.issues[0];
          const field = issue.path.join('.') || 'caseStudy';
          const next = {
            ...snapshot,
            _errors: [`Dados inválidos em ${field}: ${issue.message}`],
          };
          formDataRef.current = next;
          setFormData(next);
          toast.error(next._errors[0]);
          break;
        }

        const savedProject = await saveProject(snapshot);
        if (snapshot._isNew) createdProjectId = savedProject.id;

        if (formDataRef.current === snapshot) {
          const saved = {
            ...normalizeToEditorState(savedProject),
            _hasChanges: false,
            _errors: undefined,
          };
          formDataRef.current = saved;
          setFormData(saved);
        } else {
          const current = formDataRef.current;
          const next = { ...current, id: savedProject.id, _isNew: false };
          formDataRef.current = next;
          setFormData(next);
          if (current._hasChanges) saveRequestedRef.current = true;
        }
      } while (saveRequestedRef.current);
    } catch {
      saveRequestedRef.current = false;
    } finally {
      saveInProgressRef.current = false;
      setIsSaving(false);
      if (createdProjectId) {
        navigate({
          to: '/admin/projetos/$id/editar',
          params: { id: createdProjectId },
          search: {} as never,
          replace: true,
        });
      }
    }
  }, [navigate, saveProject]);

  const triggerAutosave = useCallback(() => {
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(() => {
      void handleSave();
    }, 3000);
  }, [handleSave]);

  useEffect(
    () => () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    },
    [],
  );

  const updateForm = useCallback(
    (updates: Partial<Omit<Project, 'caseStudy'>>) => {
      const next = {
        ...formDataRef.current,
        ...updates,
        _hasChanges: true,
        _errors: undefined,
      };
      formDataRef.current = next;
      setFormData(next);
      triggerAutosave();
    },
    [triggerAutosave],
  );

  const updateCaseStudy = useCallback(
    (updates: Partial<CaseStudyV2>) => {
      const current = formDataRef.current;
      const next = {
        ...current,
        caseStudy: mergeCaseStudyUpdates(current.caseStudy, updates),
        _hasChanges: true,
        _errors: undefined,
      };
      formDataRef.current = next;
      setFormData(next);
      triggerAutosave();
    },
    [triggerAutosave],
  );

  const handleBack = () => {
    if (saveInProgressRef.current) {
      toast.info('Aguarde o salvamento do projeto antes de sair.');
      return;
    }
    if (formData._hasChanges) {
      if (!confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')) {
        return;
      }
    }
    navigate({ to: '/admin/projetos', search: {} as never });
  };

  const handlePreview = () => {
    const slug = formData.slug;
    if (!slug) {
      toast.error('Configure o slug do projeto antes de visualizar');
      return;
    }
    window.open(`/projetos/${slug}`, '_blank');
  };

  const caseStudy = formData.caseStudy;

  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="shrink-0 rounded-lg border border-border p-2 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Voltar"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.24em] text-primary sm:text-xs sm:tracking-[0.3em]">
                // {formData._isNew ? 'Novo projeto' : 'Editar projeto'}
              </div>
              <h1 className="truncate text-base font-bold sm:text-lg">
                {formData.title || 'Sem título'}
              </h1>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {lastSaved ? (
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Salvo às {lastSaved}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handlePreview}
              disabled={!formData.slug}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              title="Visualizar página pública"
            >
              <Eye className="size-4" />
              <span className="hidden sm:inline">Visualizar</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!formData._hasChanges || mutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground transition-all hover:glow-neon disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
              title="Salvar alterações"
            >
              {mutation.isPending || isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              <span className="hidden sm:inline">Salvar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1" lang="pt-BR" spellCheck>
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 sm:py-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8">
          <aside className="min-w-0 lg:sticky lg:top-[104px] lg:self-start">
            <p className="mb-3 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground lg:block">
              Seções do projeto
            </p>
            <nav
              aria-label="Seções do editor"
              className="flex gap-2 overflow-x-auto scrollbar-none pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {TABS.map((tab, index) => {
                const active = currentTab === tab.id;
                const disabled = tab.id === 'midia' && formData._isNew;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCurrentTab(tab.id)}
                    disabled={disabled}
                    title={disabled ? 'Salve o projeto antes de adicionar mídias.' : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:w-full ${
                      active
                        ? 'border-primary/60 bg-primary/10 text-primary'
                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground'
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    <span className="font-mono text-[10px] opacity-65">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0 rounded-xl border border-border bg-card/20 p-4 sm:p-6 lg:p-8">
            {formData._errors?.length ? (
              <div
                role="alert"
                className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{formData._errors[0]}</span>
              </div>
            ) : null}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentTab === 'geral' && (
                  <CaseStudyGeneralTab
                    formData={formData}
                    isNew={formData._isNew}
                    onUpdate={updateForm}
                  />
                )}
                {currentTab === 'hero' && (
                  <CaseStudyHeroTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'visao-geral' && (
                  <CaseStudyOverviewTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'processo' && (
                  <CaseStudyProcessTab
                    formData={formData}
                    caseStudy={caseStudy}
                    onUpdateProject={updateForm}
                    onUpdateCaseStudy={updateCaseStudy}
                  />
                )}
                {currentTab === 'funcionalidades' && (
                  <CaseStudyFeaturesTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'arquitetura' && (
                  <CaseStudyArchitectureTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'midia' && (
                  <CaseStudyMediaTab
                    caseStudy={caseStudy}
                    projectId={formData.id}
                    onUpdate={updateCaseStudy}
                  />
                )}
                {currentTab === 'resultados' && (
                  <CaseStudyResultsTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'performance' && (
                  <CaseStudyPerformanceTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'cta' && (
                  <CaseStudyCtaTab caseStudy={caseStudy} onUpdate={updateCaseStudy} />
                )}
                {currentTab === 'seo' && (
                  <CaseStudySEOTab formData={formData} onUpdate={updateForm} />
                )}
                {currentTab === 'publicacao' && (
                  <CaseStudyPublicationTab formData={formData} onUpdate={updateForm} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function normalizeToEditorState(project: Project, isNew = false): EditorState {
  return {
    ...project,
    caseStudy: normalizeCaseStudy(project),
    _isNew: isNew,
    _hasChanges: false,
  };
}
