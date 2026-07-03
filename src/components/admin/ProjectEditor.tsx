import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Plus, Trash2, GripVertical, Save } from "lucide-react";
import {
  CATEGORIES,
  slugify,
  uid,
  useMedia,
  type Project,
  type CaseStudy,
  type ContentBlock,
  type Metric,
  type ProjectCategory,
  type ProjectStatus,
  type ProjectVisibility,
} from "@/lib/projects-store";
import { toast } from "sonner";
import type { MediaCategory } from "@/lib/media-types";

type Props = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (data: Omit<Project, "id">) => void;
};

const TABS = [
  { id: "geral", label: "Geral" },
  { id: "conteudo", label: "Conteúdo" },
  { id: "stack", label: "Stack" },
  { id: "midia", label: "Mídia" },
  { id: "metricas", label: "Métricas" },
  { id: "seo", label: "SEO" },
  { id: "publicacao", label: "Publicação" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const emptyProject: Omit<Project, "id"> = {
  slug: "",
  title: "",
  description: "",
  longDescription: "",
  image: "",
  tech: [],
  category: "web",
  github: "",
  demo: "",
  gallery: [],
  galleryLabels: ["Homepage", "Best Sellers", "Product Page", "Checkout"],
  contentBlocks: [],
  metrics: [],
  seo: { robotsIndex: true },
  publication: { status: "draft", visibility: "public" },
  caseStudy: {
    problemStatement: "",
    roles: [],
    architecture: "",
    systemFlow: "",
    features: [],
    technicalChallenges: [],
    technicalDecisions: [],
    databaseStructure: "",
    timeline: [],
    developmentProcess: [],
    roadmapDone: [],
    roadmapInProgress: [],
    roadmapPlanned: [],
    learnings: [],
    performance: [],
    codeNumbers: [],
  },
  client: "",
  year: String(new Date().getFullYear()),
  duration: "",
  role: "",
};

export function ProjectEditor({ open, project, onClose, onSave }: Props) {
  const [tab, setTab] = useState<TabId>("geral");
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [techInput, setTechInput] = useState("");
  const { items: mediaItems, addAsync, remove } = useMedia();

  useEffect(() => {
    if (open) {
      setTab("geral");
      if (project) {
        const { id: _id, ...rest } = project;
        setForm({ ...emptyProject, ...rest });
        setTechInput(project.tech.join(", "));
      } else {
        setForm(emptyProject);
        setTechInput("");
      }
    }
  }, [open, project]);

  const patch = (p: Partial<Omit<Project, "id">>) => setForm((f) => ({ ...f, ...p }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const problemStatement =
      form.caseStudy?.problemStatement?.trim() || form.problem?.trim() || form.objective?.trim();
    if (!problemStatement) {
      toast.error("Preencha o campo 'Problema que o projeto resolve'.");
      setTab("conteudo");
      return;
    }
    const tech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({
      ...form,
      tech: tech.length ? tech : form.tech,
      slug: form.slug || slugify(form.title),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-stretch justify-end"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-3xl h-full bg-card border-l border-border flex flex-col"
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                  // {project ? "Editar" : "Novo"} drop
                </div>
                <div className="font-black text-xl tracking-tight">
                  {form.title || "Sem título"}
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-9 rounded-full border border-border flex items-center justify-center hover:border-primary"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative px-3 py-1.5 rounded-md text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                    tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.id === tab && (
                    <motion.div
                      layoutId="tab-active"
                      className="absolute inset-0 bg-primary/10 rounded-md"
                      transition={{ type: "spring", damping: 24, stiffness: 320 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {tab === "geral" && <GeralTab form={form} patch={patch} />}
                {tab === "conteudo" && <ConteudoTab form={form} patch={patch} />}
                {tab === "stack" && <StackTab techInput={techInput} setTechInput={setTechInput} />}
                {tab === "midia" && (
                  <MidiaTab
                    form={form}
                    patch={patch}
                    projectId={project?.id ?? null}
                    mediaItems={mediaItems}
                    addAsync={addAsync}
                    remove={remove}
                  />
                )}
                {tab === "metricas" && <MetricasTab form={form} patch={patch} />}
                {tab === "seo" && <SeoTab form={form} patch={patch} />}
                {tab === "publicacao" && <PublicacaoTab form={form} patch={patch} />}
              </div>

              <footer className="flex items-center justify-between gap-2 px-6 py-4 border-t border-border bg-card/95 backdrop-blur">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {form.publication?.status === "published"
                    ? "● Publicado"
                    : form.publication?.status === "archived"
                      ? "● Arquivado"
                      : "● Rascunho"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-full border border-border text-xs uppercase tracking-widest hover:border-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
                  >
                    <Save className="size-3.5" /> Salvar
                  </button>
                </div>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- TABS ---------- */
type FormT = Omit<Project, "id">;
type PatchFn = (p: Partial<FormT>) => void;

function GeralTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  return (
    <div className="space-y-4">
      <Row>
        <Field
          label="Título"
          value={form.title}
          onChange={(v) => patch({ title: v, slug: form.slug || slugify(v) })}
          required
        />
        <Field
          label="Slug"
          value={form.slug}
          onChange={(v) => patch({ slug: slugify(v) })}
          prefix="/projeto/"
        />
      </Row>
      <Row>
        <SelectField
          label="Categoria"
          value={form.category}
          onChange={(v) => patch({ category: v as ProjectCategory })}
          options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        />
        <Field label="Cliente" value={form.client ?? ""} onChange={(v) => patch({ client: v })} />
      </Row>
      <Row>
        <Field label="Ano" value={form.year ?? ""} onChange={(v) => patch({ year: v })} />
        <Field
          label="Duração"
          value={form.duration ?? ""}
          onChange={(v) => patch({ duration: v })}
          placeholder="6 semanas"
        />
        <Field
          label="Papel"
          value={form.role ?? ""}
          onChange={(v) => patch({ role: v })}
          placeholder="Front-End Dev"
        />
      </Row>
      <TextArea
        label="Descrição curta"
        value={form.description}
        onChange={(v) => patch({ description: v })}
        required
      />
      <TextArea
        label="Descrição completa"
        value={form.longDescription ?? ""}
        onChange={(v) => patch({ longDescription: v })}
        rows={5}
      />
      <Row>
        <Field
          label="URL do projeto"
          value={form.demo ?? ""}
          onChange={(v) => patch({ demo: v })}
          placeholder="https://..."
        />
        <Field
          label="Repositório"
          value={form.github ?? ""}
          onChange={(v) => patch({ github: v })}
          placeholder="https://github.com/..."
        />
      </Row>
      <Row>
        <Field
          label="Ordem de exibição"
          value={String(form.displayOrder ?? "")}
          onChange={(v) => patch({ displayOrder: Number(v) || 0 })}
          type="number"
        />
        <label className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={form.publication?.featured ?? false}
            onChange={(e) =>
              patch({
                publication: {
                  ...(form.publication ?? {
                    status: "draft" as ProjectStatus,
                    visibility: "public" as ProjectVisibility,
                  }),
                  featured: e.target.checked,
                },
              })
            }
            className="size-4 accent-primary"
          />
          <span className="text-sm">Projeto em destaque</span>
        </label>
      </Row>
    </div>
  );
}

function ConteudoTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const blocks = form.contentBlocks ?? [];
  const caseStudy = form.caseStudy ?? {};
  const setCaseStudy = (next: Partial<CaseStudy>) =>
    patch({ caseStudy: { ...caseStudy, ...next } });
  const setBlocks = (b: ContentBlock[]) => patch({ contentBlocks: b });
  const addBlock = (kind: ContentBlock["kind"]) =>
    setBlocks([...blocks, { id: uid(), kind, title: defaultTitle(kind), description: "" }]);

  const fillCaseStudyExample = (preset: "portfolio" | "corporate" | "startup") => {
    const projectName = form.title?.trim() || "o projeto";
    if (preset === "corporate") {
      setCaseStudy({
        problemStatement: `No contexto de ${projectName}, o desafio era padronizar governança de conteúdo e performance da aplicação, reduzindo retrabalho entre áreas e acelerando entregas com previsibilidade.`,
        roles: ["Tech Lead", "Frontend", "Backend", "Arquitetura", "DevOps"],
        architecture:
          "Web App -> API Layer -> Supabase Postgres -> Storage -> Observabilidade (logs e métricas).",
        systemFlow:
          "Time de operação alimenta dados no admin -> validação e persistência -> consumo por páginas públicas -> monitoramento de métricas e correções contínuas.",
        features: [
          "Controle de acesso por perfil",
          "Fluxo de publicação com status e visibilidade",
          "Biblioteca de mídia com categorias",
          "Rastreamento de métricas estratégicas",
          "Estrutura de case study padronizada",
        ],
        technicalChallenges: [
          "Unificar modelos legados com novos campos sem interromper operação.",
          "Manter consistência entre painel administrativo e detalhe público.",
          "Garantir escalabilidade de conteúdo multimídia por projeto.",
        ],
        technicalDecisions: [
          "Schema aditivo no banco para evitar quebra de versões anteriores.",
          "Server functions para regras de negócio centralizadas.",
          "TanStack Query para invalidação de cache previsível e leitura eficiente.",
        ],
        databaseStructure:
          "projects: metadados, publicação e case_study.\nmedia: ativos com metadados e ordenação.\ntechnologies: catálogo técnico.\nsettings/metrics: configuração global e indicadores.",
        timeline: [
          "Sprint 1 -> levantamento e arquitetura",
          "Sprint 2 -> implementação backend",
          "Sprint 3 -> implementação frontend",
          "Sprint 4 -> QA, segurança e rollout",
        ],
        developmentProcess: [
          "Discovery com stakeholders",
          "Planejamento técnico por sprints",
          "Implementação incremental",
          "Revisão técnica e QA",
          "Deploy controlado e monitoramento",
        ],
        roadmapDone: ["MVP validado", "Padronização de seções técnicas concluída"],
        roadmapInProgress: ["Dashboards executivos por projeto", "Alertas de qualidade de mídia"],
        roadmapPlanned: ["Versionamento de conteúdo", "Workflow de aprovação por etapas"],
        learnings: [
          "Governança de dados reduz incidentes em produção",
          "Padronização visual melhora manutenção e escalabilidade",
          "Observabilidade desde o início acelera debugging",
        ],
        performance: [
          { id: uid(), title: "Lighthouse", value: "94", suffix: "/100" },
          { id: uid(), title: "LCP", value: "2.1", suffix: "s" },
          { id: uid(), title: "CLS", value: "0.04" },
          { id: uid(), title: "TTFB", value: "180", suffix: "ms" },
        ],
        codeNumbers: [
          { id: uid(), title: "Componentes", value: "58" },
          { id: uid(), title: "Páginas", value: "26" },
          { id: uid(), title: "Integrações", value: "9" },
          { id: uid(), title: "Commits", value: "212" },
        ],
      });
      toast.success("Preset corporativo aplicado.");
      return;
    }

    if (preset === "startup") {
      setCaseStudy({
        problemStatement: `${projectName} precisava provar tração rapidamente com ciclos curtos de experimento, sem sacrificar qualidade técnica e estabilidade da plataforma.`,
        roles: ["Product Engineer", "Frontend", "Backend", "UX", "Growth"],
        architecture:
          "Client App -> Server Functions -> Supabase -> Feature Flags/Analytics -> Deploy contínuo.",
        systemFlow:
          "Hipótese -> implementação rápida -> publicação -> coleta de métricas -> iteração semanal.",
        features: [
          "Landing e funil com CTA",
          "Admin para atualização rápida de conteúdo",
          "Métricas de conversão por seção",
          "Galeria multimídia para validação de narrativa",
          "SEO técnico para aquisição orgânica",
        ],
        technicalChallenges: [
          "Entregar velocidade sem acumular dívida técnica crítica.",
          "Balancear experimentos de UX com performance web vital.",
          "Garantir rollback simples em deploys frequentes.",
        ],
        technicalDecisions: [
          "Arquitetura modular com componentes reutilizáveis para acelerar iteração.",
          "Supabase para reduzir overhead operacional no início.",
          "Métricas como critério de priorização de backlog.",
        ],
        databaseStructure:
          "projects para conteúdo principal, media para ativos de campanha, metrics para KPIs por release e case_study para narrativa técnica.",
        timeline: [
          "Semana 1 -> MVP navegável",
          "Semana 2 -> admin e mídia",
          "Semana 3 -> métricas e otimizações",
          "Semana 4 -> expansão e testes de hipótese",
        ],
        developmentProcess: [
          "Definição da hipótese",
          "Protótipo rápido",
          "Implementação incremental",
          "Medição de resultado",
          "Refino baseado em dados",
        ],
        roadmapDone: ["MVP com fluxo completo", "Primeiras métricas de conversão"],
        roadmapInProgress: ["Personalização por segmento", "Melhoria de retenção"],
        roadmapPlanned: ["Automação de experimentos", "Recomendações inteligentes"],
        learnings: [
          "Decisões orientadas por dados evitam retrabalho",
          "Pequenas melhorias em UX elevam conversão",
          "Arquitetura simples e bem definida escala melhor",
        ],
        performance: [
          { id: uid(), title: "Lighthouse", value: "97", suffix: "/100" },
          { id: uid(), title: "LCP", value: "1.6", suffix: "s" },
          { id: uid(), title: "CLS", value: "0.02" },
          { id: uid(), title: "SEO", value: "99", suffix: "/100" },
        ],
        codeNumbers: [
          { id: uid(), title: "Componentes", value: "36" },
          { id: uid(), title: "Páginas", value: "14" },
          { id: uid(), title: "Hooks", value: "19" },
          { id: uid(), title: "Commits", value: "121" },
        ],
      });
      toast.success("Preset startup aplicado.");
      return;
    }

    setCaseStudy({
      problemStatement: `O principal problema de ${projectName} era a falta de uma experiência de compra fluida entre descoberta, decisão e checkout, o que gerava abandono de carrinho e baixa conversão em mobile.`,
      roles: ["Frontend", "Backend", "UX/UI", "Arquitetura", "Deploy"],
      architecture:
        "Cliente (React + TanStack Router) -> Server Functions -> Supabase (Postgres + Storage) -> Integrações externas (pagamento e analytics).",
      systemFlow:
        "Admin cria/edita conteúdo -> dados persistem no Supabase -> página pública consome via query server-side -> usuário navega no case study com mídia otimizada.",
      features: [
        "Autenticação e autorização de admin",
        "Upload de mídia por categoria (imagem, GIF e vídeo)",
        "Editor de conteúdo técnico com blocos",
        "SEO configurável por projeto",
        "Página de case study com seções modulares",
      ],
      technicalChallenges: [
        "Evitar inconsistência entre dados legados e novos campos estruturados sem quebrar retrocompatibilidade.",
        "Garantir renderização estável de mídia com fallback quando vídeo falha no carregamento.",
        "Padronizar labels e ordem das seções mesmo com conteúdo parcialmente preenchido.",
      ],
      technicalDecisions: [
        "TanStack Query para cache e revalidação previsível dos dados do projeto.",
        "Supabase como backend unificado (auth, banco e storage) para reduzir complexidade operacional.",
        "Modelagem aditiva (JSON case_study + campos existentes) para migração segura sem downtime.",
      ],
      databaseStructure:
        "projects: dados principais e case_study JSON.\nmedia: assets com categoria, tipo, tamanho e ordenação.\ntechnologies: catálogo técnico.\nmetrics: indicadores por projeto.",
      timeline: [
        "Semana 1 -> descoberta, benchmark e wireframe",
        "Semana 2 -> modelagem de dados e backend",
        "Semana 3 -> implementação frontend e integrações",
        "Semana 4 -> QA, performance e deploy",
      ],
      developmentProcess: [
        "Figma -> fluxos e wireframes",
        "Design System -> tokens e componentes",
        "Desenvolvimento -> features por prioridade",
        "Testes -> regressão visual e funcional",
        "Deploy -> monitoramento e ajustes",
      ],
      roadmapDone: [
        "Estrutura base do case study finalizada",
        "Painel admin com edição de mídia e conteúdo técnico",
      ],
      roadmapInProgress: [
        "Automação de validação de mídia por dimensão",
        "Aprimoramento de analytics por seção",
      ],
      roadmapPlanned: [
        "A/B test de variações de narrativa técnica",
        "Exportação de case study em PDF",
      ],
      learnings: [
        "Arquitetura aditiva reduz risco de migração",
        "Fallbacks explícitos melhoram resiliência de UX",
        "Consistência visual aumenta percepção de senioridade",
      ],
      performance: [
        { id: uid(), title: "Lighthouse", value: "96", suffix: "/100" },
        { id: uid(), title: "LCP", value: "1.8", suffix: "s" },
        { id: uid(), title: "CLS", value: "0.03" },
        { id: uid(), title: "SEO", value: "100", suffix: "/100" },
      ],
      codeNumbers: [
        { id: uid(), title: "Componentes", value: "42" },
        { id: uid(), title: "Páginas", value: "18" },
        { id: uid(), title: "Hooks", value: "27" },
        { id: uid(), title: "Commits", value: "138" },
      ],
    });

    toast.success("Preset de portfólio aplicado.");
  };

  const setCaseMetric = (
    key: "performance" | "codeNumbers",
    updater: (items: Metric[]) => Metric[],
  ) => {
    const current = caseStudy[key] ?? [];
    setCaseStudy({ [key]: updater(current) });
  };

  // Migrate legacy fields if present
  useEffect(() => {
    if (
      blocks.length === 0 &&
      (form.objective || form.problem || form.solution || form.process || form.result)
    ) {
      const migrated: ContentBlock[] = [];
      const push = (k: ContentBlock["kind"], v?: string) =>
        v && migrated.push({ id: uid(), kind: k, title: defaultTitle(k), description: v });
      push("objective", form.objective);
      push("problem", form.problem);
      push("solution", form.solution);
      push("process", form.process);
      push("result", form.result);
      if (migrated.length) setBlocks(migrated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background/30 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] uppercase tracking-widest text-primary">Case Study Estruturado</div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => fillCaseStudyExample("portfolio")}
              className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
            >
              Preset Portfolio
            </button>
            <button
              type="button"
              onClick={() => fillCaseStudyExample("corporate")}
              className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
            >
              Preset Corporativo
            </button>
            <button
              type="button"
              onClick={() => fillCaseStudyExample("startup")}
              className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
            >
              Preset Startup
            </button>
          </div>
        </div>
        <TextArea
          label="Problema que o projeto resolve (obrigatório)"
          value={caseStudy.problemStatement ?? ""}
          onChange={(v) => setCaseStudy({ problemStatement: v })}
          rows={4}
          required
        />
        <Field
          label="Meu papel no projeto (separe por vírgula)"
          value={(caseStudy.roles ?? []).join(", ")}
          onChange={(v) =>
            setCaseStudy({
              roles: v
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          placeholder="Frontend, Backend, UX/UI, Deploy"
        />
        <TextArea
          label="Arquitetura (diagrama textual)"
          value={caseStudy.architecture ?? ""}
          onChange={(v) => setCaseStudy({ architecture: v })}
          rows={3}
        />
        <TextArea
          label="Fluxo do sistema"
          value={caseStudy.systemFlow ?? ""}
          onChange={(v) => setCaseStudy({ systemFlow: v })}
          rows={3}
        />
        <ListEditor
          label="Funcionalidades implementadas"
          items={caseStudy.features ?? []}
          onChange={(items) => setCaseStudy({ features: items })}
          placeholder="Ex: Autenticação com Supabase"
        />
        <ListEditor
          label="Desafios técnicos"
          items={caseStudy.technicalChallenges ?? []}
          onChange={(items) => setCaseStudy({ technicalChallenges: items })}
          placeholder="Problema e solução aplicada"
        />
        <ListEditor
          label="Decisões técnicas"
          items={caseStudy.technicalDecisions ?? []}
          onChange={(items) => setCaseStudy({ technicalDecisions: items })}
          placeholder="Tecnologia -> justificativa"
        />
        <TextArea
          label="Estrutura do banco"
          value={caseStudy.databaseStructure ?? ""}
          onChange={(v) => setCaseStudy({ databaseStructure: v })}
          rows={4}
        />
        <ListEditor
          label="Timeline"
          items={caseStudy.timeline ?? []}
          onChange={(items) => setCaseStudy({ timeline: items })}
          placeholder="Semana 1 -> Design"
        />
        <ListEditor
          label="Processo de desenvolvimento"
          items={caseStudy.developmentProcess ?? []}
          onChange={(items) => setCaseStudy({ developmentProcess: items })}
          placeholder="Figma -> Wireframe -> Design System"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ListEditor
            label="Roadmap - Concluído"
            items={caseStudy.roadmapDone ?? []}
            onChange={(items) => setCaseStudy({ roadmapDone: items })}
            placeholder="Entrega finalizada"
          />
          <ListEditor
            label="Roadmap - Em andamento"
            items={caseStudy.roadmapInProgress ?? []}
            onChange={(items) => setCaseStudy({ roadmapInProgress: items })}
            placeholder="Entrega em progresso"
          />
          <ListEditor
            label="Roadmap - Futuro"
            items={caseStudy.roadmapPlanned ?? []}
            onChange={(items) => setCaseStudy({ roadmapPlanned: items })}
            placeholder="Entrega planejada"
          />
        </div>
        <ListEditor
          label="Aprendizados"
          items={caseStudy.learnings ?? []}
          onChange={(items) => setCaseStudy({ learnings: items })}
          placeholder="Arquitetura, performance, backend, UX/UI, deploy"
        />
        <MetricEditor
          label="Performance"
          items={caseStudy.performance ?? []}
          onChange={(updater) => setCaseMetric("performance", updater)}
        />
        <MetricEditor
          label="Código em números"
          items={caseStudy.codeNumbers ?? []}
          onChange={(updater) => setCaseMetric("codeNumbers", updater)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["objective", "problem", "solution", "process", "result", "custom"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => addBlock(k)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="size-3" /> {defaultTitle(k)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {blocks.map((b, i) => (
          <div
            key={b.id}
            className="rounded-xl border border-border bg-background/40 p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="size-4 text-muted-foreground" />
              <input
                value={b.title}
                onChange={(e) =>
                  setBlocks(
                    blocks.map((x) => (x.id === b.id ? { ...x, title: e.target.value } : x)),
                  )
                }
                className="flex-1 bg-transparent font-bold focus:outline-none"
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    const c = [...blocks];
                    [c[i - 1], c[i]] = [c[i], c[i - 1]];
                    setBlocks(c);
                  }}
                  className="size-7 rounded border border-border text-xs disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === blocks.length - 1}
                  onClick={() => {
                    const c = [...blocks];
                    [c[i + 1], c[i]] = [c[i], c[i + 1]];
                    setBlocks(c);
                  }}
                  className="size-7 rounded border border-border text-xs disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setBlocks(blocks.filter((x) => x.id !== b.id))}
                  className="size-7 rounded border border-border hover:border-destructive hover:text-destructive flex items-center justify-center"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
            <textarea
              value={b.description}
              onChange={(e) =>
                setBlocks(
                  blocks.map((x) => (x.id === b.id ? { ...x, description: e.target.value } : x)),
                )
              }
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none resize-none"
              placeholder="Descreva..."
            />
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-10 border border-dashed border-border rounded-xl">
            Adicione blocos de case study acima.
          </div>
        )}
      </div>
    </div>
  );
}

function defaultTitle(k: ContentBlock["kind"]) {
  return (
    {
      objective: "Objetivo",
      problem: "Problema",
      solution: "Solução",
      process: "Processo",
      result: "Resultado",
      custom: "Bloco",
    } as const
  )[k];
}

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            const value = draft.trim();
            if (!value) return;
            onChange([...items, value]);
            setDraft("");
          }}
          className="px-3 py-2 rounded-lg border border-border text-xs uppercase tracking-widest hover:border-primary hover:text-primary"
        >
          Adicionar
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={`${label}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
            <span className="text-sm text-muted-foreground">{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-xs text-destructive hover:underline"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Metric[];
  onChange: (updater: (items: Metric[]) => Metric[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
        <button
          type="button"
          onClick={() => onChange((curr) => [...curr, { id: uid(), title: "", value: "" }])}
          className="text-xs text-primary hover:underline"
        >
          + Adicionar métrica
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Field
                label="Título"
                value={item.title}
                onChange={(v) =>
                  onChange((curr) => curr.map((m) => (m.id === item.id ? { ...m, title: v } : m)))
                }
              />
              <Field
                label="Valor"
                value={item.value}
                onChange={(v) =>
                  onChange((curr) => curr.map((m) => (m.id === item.id ? { ...m, value: v } : m)))
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Field
                label="Prefixo"
                value={item.prefix ?? ""}
                onChange={(v) =>
                  onChange((curr) => curr.map((m) => (m.id === item.id ? { ...m, prefix: v } : m)))
                }
              />
              <Field
                label="Sufixo"
                value={item.suffix ?? ""}
                onChange={(v) =>
                  onChange((curr) => curr.map((m) => (m.id === item.id ? { ...m, suffix: v } : m)))
                }
              />
            </div>
            <button
              type="button"
              onClick={() => onChange((curr) => curr.filter((m) => m.id !== item.id))}
              className="text-xs text-destructive hover:underline"
            >
              Remover métrica
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackTab({
  techInput,
  setTechInput,
}: {
  techInput: string;
  setTechInput: (v: string) => void;
}) {
  const tags = techInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4">
      <Field
        label="Tecnologias (separe por vírgula)"
        value={techInput}
        onChange={setTechInput}
        placeholder="React, TypeScript, Tailwind..."
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

type MidiaTabProps = {
  form: FormT;
  patch: PatchFn;
  projectId: string | null;
  mediaItems: Array<{
    id: string;
    projectId: string | null;
    category: MediaCategory;
    url: string;
    sortOrder: number;
  }>;
  addAsync: (m: {
    name: string;
    type: string;
    size: number;
    file?: File;
    projectId?: string;
    category?: MediaCategory;
    sortOrder?: number;
  }) => Promise<{ url: string }>;
  remove: (id: string) => void;
};

function MidiaTab({ form, patch, projectId, mediaItems, addAsync, remove }: MidiaTabProps) {
  const uploadField = async (
    file: File,
    category: MediaCategory,
    currentUrl: string,
    sortOrder?: number,
  ) => {
    if (!projectId) {
      const r = new FileReader();
      r.onload = () => patchByCategory(category, r.result as string, sortOrder);
      r.readAsDataURL(file);
      toast.info("Projeto novo: midia mantida em preview local ate salvar o projeto.");
      return;
    }

    const previous = mediaItems.find(
      (m) => m.projectId === projectId && m.category === category && m.url === currentUrl,
    );

    const uploaded = await addAsync({
      name: file.name,
      type: file.type,
      size: file.size,
      file,
      projectId,
      category,
      sortOrder,
    });

    patchByCategory(category, uploaded.url, sortOrder);

    if (previous?.id && previous.url !== uploaded.url) {
      remove(previous.id);
    }
  };

  const patchByCategory = (category: MediaCategory, url: string, sortOrder?: number) => {
    if (category === "thumbnail") {
      patch({ image: url });
      return;
    }
    if (category === "banner") {
      patch({ heroImage: url });
      return;
    }
    if (category === "hero_video") {
      patch({ heroVideo: url });
      return;
    }
    if (category === "desktop") {
      patch({ desktopMockup: url });
      return;
    }
    if (category === "tablet") {
      patch({ tabletMockup: url });
      return;
    }
    if (category === "mobile") {
      patch({ mobileMockup: url });
      return;
    }
    if (category === "demo") {
      patch({ previewGif: url });
      return;
    }
    if (category === "gallery") {
      const next = [...(form.gallery ?? [])];
      if (typeof sortOrder === "number" && sortOrder >= 0 && sortOrder < next.length) {
        next[sortOrder] = url;
      } else {
        next.push(url);
      }
      patch({ gallery: next });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card/30 p-3 space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-primary">
          Especificacoes de exibicao das midias
        </div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Thumbnail / Cover:</span> usado no
            card e fallback geral. Recomendado <span className="font-semibold text-foreground">1200x1500 px (4:5)</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">Banner / Hero Image:</span> usado no
            hero da pagina de projeto. Recomendado <span className="font-semibold text-foreground">1600x1200 px (4:3)</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">Hero Video:</span> secao
            "Project Walkthrough" em <span className="font-semibold text-foreground">16:9</span>.
            Ideal <span className="font-semibold text-foreground">1920x1080 px</span>, minimo
            <span className="font-semibold text-foreground"> 1280x720 px</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">Galeria (Homepage, Best Sellers, Product Page, Checkout):</span>
            cards em <span className="font-semibold text-foreground">4:3</span>. Recomendado
            <span className="font-semibold text-foreground"> 1600x1200 px</span> por item.
          </li>
          <li>
            <span className="font-semibold text-foreground">Preview GIF:</span> bloco dedicado em
            <span className="font-semibold text-foreground"> 16:9</span>. Recomendado
            <span className="font-semibold text-foreground"> 1280x720 px</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">Desktop Mockup:</span> exibido em
            <span className="font-semibold text-foreground"> 16:10</span>. Recomendado
            <span className="font-semibold text-foreground"> 1600x1000 px</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">Tablet Mockup:</span> exibido em
            <span className="font-semibold text-foreground"> 3:4</span>. Recomendado
            <span className="font-semibold text-foreground"> 1200x1600 px</span>.
          </li>
          <li>
            <span className="font-semibold text-foreground">Mobile Mockup:</span> exibido em
            <span className="font-semibold text-foreground"> 9:16</span>. Recomendado
            <span className="font-semibold text-foreground"> 1080x1920 px</span>.
          </li>
        </ul>
      </div>

      <ImageDrop
        label="Thumbnail / Cover"
        value={form.image}
        onChange={(v) => patch({ image: v })}
        onUpload={(file) => uploadField(file, "thumbnail", form.image)}
      />
      <Row>
        <ImageDrop
          label="Banner / Hero Image"
          value={form.heroImage ?? ""}
          onChange={(v) => patch({ heroImage: v })}
          onUpload={(file) => uploadField(file, "banner", form.heroImage ?? "")}
        />
        <ImageDrop
          label="Hero Video"
          value={form.heroVideo ?? ""}
          onChange={(v) => patch({ heroVideo: v })}
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
          mode="video"
          onUpload={(file) => uploadField(file, "hero_video", form.heroVideo ?? "")}
        />
      </Row>

      <Row>
        <ImageDrop
          label="Desktop Mockup"
          value={form.desktopMockup ?? ""}
          onChange={(v) => patch({ desktopMockup: v })}
          onUpload={(file) => uploadField(file, "desktop", form.desktopMockup ?? "")}
        />
        <ImageDrop
          label="Tablet Mockup"
          value={form.tabletMockup ?? ""}
          onChange={(v) => patch({ tabletMockup: v })}
          onUpload={(file) => uploadField(file, "tablet", form.tabletMockup ?? "")}
        />
        <ImageDrop
          label="Mobile Mockup"
          value={form.mobileMockup ?? ""}
          onChange={(v) => patch({ mobileMockup: v })}
          onUpload={(file) => uploadField(file, "mobile", form.mobileMockup ?? "")}
        />
      </Row>
      <ImageDrop
        label="Preview GIF"
        value={form.previewGif ?? ""}
        onChange={(v) => patch({ previewGif: v })}
        accept="image/gif"
        onUpload={(file) => uploadField(file, "demo", form.previewGif ?? "")}
      />
      <GalleryEditor
        value={form.gallery ?? []}
        labels={form.galleryLabels ?? ["Homepage", "Best Sellers", "Product Page", "Checkout"]}
        onChangeLabels={(labels) => patch({ galleryLabels: labels })}
        onChange={(g) => patch({ gallery: g })}
        onUpload={async (file, index) => {
          await uploadField(file, "gallery", form.gallery?.[index] ?? "", index);
        }}
      />
    </div>
  );
}

function GalleryEditor({
  value,
  labels,
  onChangeLabels,
  onChange,
  onUpload,
}: {
  value: string[];
  labels: string[];
  onChangeLabels: (v: string[]) => void;
  onChange: (v: string[]) => void;
  onUpload?: (file: File, index: number) => Promise<void>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const slotRefs = useRef<Array<HTMLInputElement | null>>([]);
  const slotLabels = ["Homepage", "Best Sellers", "Product Page", "Checkout"].map(
    (fallback, i) => labels[i] || fallback,
  );

  const readDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });

  const setSlot = async (index: number, file: File) => {
    const dataUrl = await readDataUrl(file);
    const next = [...value];
    while (next.length <= index) next.push("");
    next[index] = dataUrl;
    onChange(next);

    if (onUpload) await onUpload(file, index);
  };

  const clearSlot = (index: number) => {
    const next = [...value];
    if (index < next.length) next[index] = "";
    onChange(next);
  };

  const handleFiles = async (files: FileList) => {
    const selected = Array.from(files);
    const readers = selected.map(
      (f) =>
        new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.onerror = () => reject(r.error);
          r.readAsDataURL(f);
        }),
    );

    try {
      const loaded = await Promise.all(readers);
      const next = [...value, ...loaded];
      onChange(next);

      if (onUpload) {
        await Promise.all(selected.map((file, idx) => onUpload(file, value.length + idx)));
      }
    } catch {
      // Ignore failed file reads and keep current gallery untouched.
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
          Galeria
        </label>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="text-xs text-primary hover:underline"
        >
          + Adicionar imagens
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slotLabels.map((slot, i) => {
          const src = value[i] ?? "";
          return (
            <div key={slot} className="space-y-1.5">
              <input
                value={slot}
                onChange={(e) => {
                  const next = [...labels];
                  while (next.length <= i) next.push("");
                  next[i] = e.target.value;
                  onChangeLabels(next);
                }}
                className="w-full text-[10px] uppercase tracking-widest text-muted-foreground bg-transparent border border-border rounded px-2 py-1 focus:border-primary outline-none"
                placeholder={`Rótulo ${i + 1}`}
              />
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group bg-card/20">
                {src ? (
                  <img src={src} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    Selecione a imagem da seção
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/45 backdrop-blur-[1px] flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => slotRefs.current[i]?.click()}
                    className="text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-border bg-background/80 hover:border-primary hover:text-primary"
                  >
                    Selecionar
                  </button>
                  {src && (
                    <button
                      type="button"
                      onClick={() => clearSlot(i)}
                      className="text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-border bg-background/80 hover:border-destructive hover:text-destructive"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <input
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await setSlot(i, file);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {value.length > slotLabels.length && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Imagens extras da galeria
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {value.slice(slotLabels.length).map((src, localIdx) => {
              const i = slotLabels.length + localIdx;
              return (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                >
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, ii) => ii !== i))}
                    className="absolute top-1 right-1 size-6 rounded-full bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 flex items-center justify-center hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {value.length === 0 && (
        <div className="col-span-full text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">
          Sem imagens na galeria
        </div>
      )}
    </div>
  );
}

function MetricasTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const metrics = form.metrics ?? [];
  const setMetrics = (m: Metric[]) => patch({ metrics: m });
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setMetrics([...metrics, { id: uid(), title: "", value: "" }])}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:text-primary"
      >
        <Plus className="size-3" /> Adicionar métrica
      </button>
      {metrics.map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-background/40 p-4 md:p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Título"
              value={m.title}
              onChange={(v) =>
                setMetrics(metrics.map((x) => (x.id === m.id ? { ...x, title: v } : x)))
              }
            />
            <Field
              label="Valor"
              value={m.value}
              onChange={(v) =>
                setMetrics(metrics.map((x) => (x.id === m.id ? { ...x, value: v } : x)))
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Prefixo"
              value={m.prefix ?? ""}
              onChange={(v) =>
                setMetrics(metrics.map((x) => (x.id === m.id ? { ...x, prefix: v } : x)))
              }
            />
            <Field
              label="Sufixo"
              value={m.suffix ?? ""}
              onChange={(v) =>
                setMetrics(metrics.map((x) => (x.id === m.id ? { ...x, suffix: v } : x)))
              }
            />
          </div>
          <TextArea
            label="Descrição"
            value={m.description ?? ""}
            onChange={(v) =>
              setMetrics(metrics.map((x) => (x.id === m.id ? { ...x, description: v } : x)))
            }
            rows={2}
          />
          <button
            type="button"
            onClick={() => setMetrics(metrics.filter((x) => x.id !== m.id))}
            className="inline-flex items-center text-xs text-destructive hover:underline pt-1"
          >
            Remover
          </button>
        </div>
      ))}

      {metrics.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-10 border border-dashed border-border rounded-xl">
          Nenhuma métrica adicionada.
        </div>
      )}
    </div>
  );
}

function SeoTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const seo = form.seo ?? {};
  const setSeo = (s: Partial<NonNullable<FormT["seo"]>>) => patch({ seo: { ...seo, ...s } });
  return (
    <div className="space-y-4">
      <Field
        label="Meta título"
        value={seo.metaTitle ?? ""}
        onChange={(v) => setSeo({ metaTitle: v })}
      />
      <TextArea
        label="Meta descrição"
        value={seo.metaDescription ?? ""}
        onChange={(v) => setSeo({ metaDescription: v })}
      />
      <Field
        label="Keywords"
        value={seo.keywords ?? ""}
        onChange={(v) => setSeo({ keywords: v })}
        placeholder="react, portfolio, streetwear"
      />
      <Field
        label="URL canônica"
        value={seo.canonicalUrl ?? ""}
        onChange={(v) => setSeo({ canonicalUrl: v })}
      />
      <Row>
        <ImageDrop
          label="Open Graph Image"
          value={seo.ogImage ?? ""}
          onChange={(v) => setSeo({ ogImage: v })}
        />
        <ImageDrop
          label="Twitter Image"
          value={seo.twitterImage ?? ""}
          onChange={(v) => setSeo({ twitterImage: v })}
        />
      </Row>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={seo.robotsIndex ?? true}
          onChange={(e) => setSeo({ robotsIndex: e.target.checked })}
          className="size-4 accent-primary"
        />
        <span className="text-sm">Permitir indexação (robots: index)</span>
      </label>
      <TextArea
        label="Structured Data (JSON-LD)"
        value={seo.structuredData ?? ""}
        onChange={(v) => setSeo({ structuredData: v })}
        rows={5}
      />
    </div>
  );
}

function PublicacaoTab({ form, patch }: { form: FormT; patch: PatchFn }) {
  const pub = form.publication ?? {
    status: "draft" as ProjectStatus,
    visibility: "public" as ProjectVisibility,
  };
  const setPub = (p: Partial<NonNullable<FormT["publication"]>>) =>
    patch({ publication: { ...pub, ...p } });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["draft", "published", "archived"] as ProjectStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setPub({ status: s })}
              className={`px-3 py-2.5 rounded-lg border text-xs uppercase tracking-widest transition-all ${pub.status === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground"}`}
            >
              {s === "draft" ? "Rascunho" : s === "published" ? "Publicado" : "Arquivado"}
            </button>
          ))}
        </div>
      </div>
      <Field
        label="Agendar publicação"
        type="datetime-local"
        value={pub.scheduledFor ?? ""}
        onChange={(v) => setPub({ scheduledFor: v })}
      />
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Visibilidade
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["public", "private"] as ProjectVisibility[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setPub({ visibility: v })}
              className={`px-3 py-2.5 rounded-lg border text-xs uppercase tracking-widest transition-all ${pub.visibility === v ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground"}`}
            >
              {v === "public" ? "Público" : "Privado"}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={pub.featured ?? false}
          onChange={(e) => setPub({ featured: e.target.checked })}
          className="size-4 accent-primary"
        />
        <span className="text-sm">Destaque na home</span>
      </label>
    </div>
  );
}

/* ---------- BASE FIELDS ---------- */
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 [&:has(>*:nth-child(2):last-child)]:lg:grid-cols-2">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div className="min-w-0">
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="flex items-stretch rounded-lg border border-border bg-background overflow-hidden focus-within:border-primary transition-colors">
        {prefix && (
          <span className="px-2.5 flex items-center text-xs text-muted-foreground bg-muted/40 border-r border-border">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageDrop({
  label,
  value,
  onChange,
  accept = "image/*",
  mode = "image",
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  mode?: "image" | "video";
  onUpload?: (file: File) => Promise<void>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const isVideo =
    mode === "video" ||
    /^data:video\//i.test(value) ||
    /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(value);

  const handleFile = async (f: File) => {
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(f);

    if (onUpload) {
      setBusy(true);
      try {
        await onUpload(f);
        toast.success(`${label}: upload concluido.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro no upload";
        toast.error(`${label}: ${message}`);
      } finally {
        setBusy(false);
      }
    }
  };
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        onClick={() => ref.current?.click()}
        className={`relative aspect-video rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
      >
        {value ? (
          <>
            {isVideo ? (
              <video src={value} className="absolute inset-0 w-full h-full object-cover" controls />
            ) : (
              <img src={value} className="absolute inset-0 w-full h-full object-cover" />
            )}
            {busy && (
              <div className="absolute inset-0 bg-background/65 backdrop-blur-sm flex items-center justify-center text-xs uppercase tracking-widest text-primary">
                Enviando...
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:text-destructive"
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <UploadCloud className="size-6" />
            <span className="text-[10px] uppercase tracking-widest">Drop ou clique</span>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
