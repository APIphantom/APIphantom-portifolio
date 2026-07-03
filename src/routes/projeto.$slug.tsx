import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  motion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  ImageIcon,
  Target,
  Gauge,
  Layers,
  Search,
  PenTool,
  Cpu,
  Trophy,
  BookOpen,
  Rocket,
  Sparkles,
} from "lucide-react";
import { type Project, CATEGORIES } from "@/lib/projects-store";
import { getProjectBySlug } from "@/lib/portfolio.functions";
import {
  ArchitectureSection,
  DesignShowcase,
  DevelopmentSection,
  FinalCTA,
  GallerySection,
  HeroSection,
  LessonsSection,
  OverviewSection,
  PerformanceSection,
  ProjectSectionTriple,
  ResultsSection,
  ScrollProgress,
  SidebarNavigation,
} from "@/components/project-details";

type DetailBlock = {
  id: string;
  kind: string;
  title: string;
  description: string;
};

export const Route = createFileRoute("/projeto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Case Study // STVX` },
      {
        name: "description",
        content: `Case study do projeto ${params.slug} — objetivo, problema, solução, processo e resultado.`,
      },
      { property: "og:title", content: `${params.slug} — Case Study` },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projeto/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projeto/${params.slug}` }],
  }),
  component: ProjectPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-destructive p-6 text-center">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Projeto não encontrado.
    </div>
  ),
});

/* ---------- defaults derived from project ---------- */

function getMeta(project: Project) {
  const cat = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;
  return {
    status:
      project.publication?.status === "published"
        ? "Publicado"
        : project.publication?.status === "archived"
          ? "Arquivado"
          : "Rascunho",
    duration: project.duration || "-",
    role: project.role || "-",
    type: cat,
    client: project.client || "-",
    year: project.year || "-",
  };
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasKeyword(value: string, keywords: string[]) {
  const normalized = normalizeText(value);
  return keywords.some((k) => normalized.includes(normalizeText(k)));
}

function splitLineItem(text: string, fallbackTitle: string) {
  const raw = text.trim();
  if (!raw) return { title: fallbackTitle, description: "" };
  const arrow = raw.includes("->")
    ? raw.split("->")
    : raw.includes("=>")
      ? raw.split("=>")
      : raw.includes(":")
        ? raw.split(":")
        : [];
  if (arrow.length >= 2) {
    const title = arrow[0].trim();
    const description = arrow.slice(1).join("-").trim();
    return { title: title || fallbackTitle, description: description || raw };
  }
  return { title: fallbackTitle, description: raw };
}

/* ---------- page ---------- */

function ProjectPage() {
  const { slug } = Route.useParams();
  const fetchProject = useServerFn(getProjectBySlug);
  const { data, isPending } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProject({ data: { slug } }),
    staleTime: 0,
    refetchOnMount: "always",
  });
  const project = data as Project | null | undefined;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          // 404 / drop não encontrado
        </div>
        <h1 className="display text-6xl mb-6">Projeto inexistente.</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </div>
    );
  }

  const meta = getMeta(project);
  const cat = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;

  const gallery = (project.gallery && project.gallery.length ? project.gallery : []).slice(0, 4);
  const galleryImages = [project.image || "", project.heroImage || "", ...gallery].filter(Boolean);
  const galleryLabelDefaults = [
    "Cover",
    "Hero",
    "Homepage",
    "Best Sellers",
    "Product Page",
    "Checkout",
  ];
  const galleryLabels = galleryImages.map(
    (_, i) => project.galleryLabels?.[i]?.trim() || galleryLabelDefaults[i] || `Galeria ${i + 1}`,
  );

  const kindLabel: Record<string, string> = {
    objective: "Objetivo",
    problem: "Problema",
    solution: "Solução",
    process: "Processo",
    result: "Resultado",
    custom: "Bloco",
  };

  const contentBlocks = (project.contentBlocks ?? [])
    .filter((b) => (b.description ?? "").trim().length > 0)
    .map((b, i) => ({
      id: b.id ?? `legacy-${i}`,
      kind: b.kind,
      n: String(i + 1).padStart(2, "0"),
      k: b.title?.trim() || kindLabel[b.kind] || "Bloco",
      v: b.description,
    }));

  const contentDetails: DetailBlock[] = contentBlocks.map((b) => ({
    id: b.id,
    kind: b.kind,
    title: b.k,
    description: b.v,
  }));
  const caseStudy = project.caseStudy ?? {};

  const usedBlockIds = new Set<string>();
  const pickBlocks = (keywords: string[], kind?: string, pickFirst = false) => {
    const matched = contentDetails.filter((b) => {
      if (usedBlockIds.has(b.id)) return false;
      if (kind && b.kind === kind) return true;
      return hasKeyword(`${b.title} ${b.description}`, keywords);
    });
    const selected = pickFirst ? matched.slice(0, 1) : matched;
    selected.forEach((b) => usedBlockIds.add(b.id));
    return selected;
  };

  const problemBlocks = pickBlocks(["problema", "dor", "desafio", "contexto"], "problem", true);
  const objectiveBlocks = pickBlocks(["objetivo", "objetivos", "meta", "goals"], "objective");
  const researchBlocks = pickBlocks(["pesquisa", "benchmark", "discovery", "insight", "usuario"]);
  const architectureBlocks = caseStudy.architecture?.trim()
    ? [
        {
          id: "case-architecture",
          kind: "custom",
          title: "Arquitetura",
          description: caseStudy.architecture,
        },
      ]
    : pickBlocks(["arquitetura", "architecture", "diagrama", "infra"]);

  const flowBlocks = caseStudy.systemFlow?.trim()
    ? [
        {
          id: "case-flow",
          kind: "custom",
          title: "Fluxo do sistema",
          description: caseStudy.systemFlow,
        },
      ]
    : pickBlocks(["fluxo", "flow", "pipeline", "jornada"]);

  const challengesBlocks = (caseStudy.technicalChallenges ?? []).length
    ? (caseStudy.technicalChallenges ?? []).map((challenge, i) => ({
        id: `case-challenge-${i}`,
        kind: "custom",
        title: `Desafio ${String(i + 1).padStart(2, "0")}`,
        description: challenge,
      }))
    : pickBlocks(["desafio", "challenge", "obstaculo", "dificuldade"]);

  const decisionsBlocks = (caseStudy.technicalDecisions ?? []).length
    ? (caseStudy.technicalDecisions ?? []).map((decision, i) => ({
        id: `case-decision-${i}`,
        kind: "custom",
        title: `Decisão ${String(i + 1).padStart(2, "0")}`,
        description: decision,
      }))
    : pickBlocks(["decisao", "trade", "justificativa", "escolha tecnica"]);

  const timelineBlocks = (caseStudy.timeline ?? []).length
    ? (caseStudy.timeline ?? []).map((timeline, i) => {
        const parsed = splitLineItem(timeline, `Timeline ${String(i + 1).padStart(2, "0")}`);
        return {
        id: `case-timeline-${i}`,
        kind: "custom",
        title: parsed.title,
        description: parsed.description,
        };
      })
    : pickBlocks(["timeline", "cronograma", "semana", "sprint"]);

  const processBlocks = (caseStudy.developmentProcess ?? []).length
    ? (caseStudy.developmentProcess ?? []).map((step, i) => {
        const parsed = splitLineItem(step, `Etapa ${String(i + 1).padStart(2, "0")}`);
        return {
        id: `case-process-${i}`,
        kind: "custom",
        title: parsed.title,
        description: parsed.description,
        };
      })
    : pickBlocks(["processo", "workflow", "figma", "wireframe", "deploy"]);

  const learningsBlocks = (caseStudy.learnings ?? []).length
    ? (caseStudy.learnings ?? []).map((learning, i) => ({
        id: `case-learning-${i}`,
        kind: "custom",
        title: `Aprendizado ${String(i + 1).padStart(2, "0")}`,
        description: learning,
      }))
    : pickBlocks(["aprendizado", "licao", "learning", "retrospectiva"]);

  const roadmapBlocks = [
    ...(caseStudy.roadmapDone ?? []).map((item, i) => ({
      id: `case-roadmap-done-${i}`,
      kind: "custom",
      title: "Concluido",
      description: item,
      section: "Roadmap",
    })),
    ...(caseStudy.roadmapInProgress ?? []).map((item, i) => ({
      id: `case-roadmap-progress-${i}`,
      kind: "custom",
      title: "Em andamento",
      description: item,
      section: "Roadmap",
    })),
    ...(caseStudy.roadmapPlanned ?? []).map((item, i) => ({
      id: `case-roadmap-planned-${i}`,
      kind: "custom",
      title: "Futuro",
      description: item,
      section: "Roadmap",
    })),
  ];

  const fallbackProblem =
    caseStudy.problemStatement?.trim() ||
    problemBlocks[0]?.description ||
    contentDetails.find((b) => b.kind === "problem")?.description ||
    project.problem ||
    project.objective ||
    "";

  const fallbackObjective =
    objectiveBlocks[0]?.description || project.objective || contentDetails[0]?.description || "";

  const objectiveFromFeatures = (caseStudy.features ?? [])
    .slice(0, 4)
    .map((item) => `- ${item}`)
    .join("\n");

  const overviewFeatures =
    (caseStudy.features ?? []).filter((item) => item.trim().length > 0).length > 0
      ? (caseStudy.features ?? []).filter((item) => item.trim().length > 0).slice(0, 5).map((item, i) => {
          const parsed = splitLineItem(item, `Feature ${String(i + 1).padStart(2, "0")}`);
          return {
            title: parsed.title,
            subtitle: parsed.description,
          };
        })
      : [
          { title: "Categoria", subtitle: meta.type },
          { title: "Produtos", subtitle: "Catalogo estruturado" },
          { title: "Checkout", subtitle: "Fluxo seguro" },
          { title: "Design", subtitle: "Sistema consistente" },
          { title: "Responsivo", subtitle: "Desktop, tablet e mobile" },
        ];

  const mapMetric = (m: {
    title: string;
    value: string;
    prefix?: string;
    suffix?: string;
    description?: string;
  }) => {
    const parsed = Number(String(m.value ?? "").replace(/[^0-9.-]/g, ""));
    return {
      label: m.title,
      raw: m.value,
      value: Number.isFinite(parsed) ? parsed : null,
      prefix: m.prefix ?? "",
      suffix: m.suffix ?? "",
      description: m.description ?? "",
    };
  };

  const results = (project.metrics ?? []).map(mapMetric).filter((m) => m.label);

  const performanceResults =
    (caseStudy.performance ?? []).length > 0
      ? (caseStudy.performance ?? []).map(mapMetric).filter((m) => m.label)
      : results.filter((r) =>
          hasKeyword(r.label, ["lighthouse", "lcp", "cls", "fcp", "seo", "performance"]),
        );

  const codeNumberResults =
    (caseStudy.codeNumbers ?? []).length > 0
      ? (caseStudy.codeNumbers ?? []).map(mapMetric).filter((m) => m.label)
      : [];

  const resultsItems = codeNumberResults.length > 0 ? codeNumberResults : results;

  const leftovers = contentDetails.filter((b) => !usedBlockIds.has(b.id));

  const sectionNav = [
    { id: "overview", label: "Overview", Icon: Layers },
    { id: "problem", label: "Problema", Icon: Search },
    { id: "objectives", label: "Objetivos", Icon: Target },
    { id: "research", label: "Pesquisa", Icon: BookOpen },
    { id: "architecture", label: "Arquitetura", Icon: Cpu },
    { id: "design", label: "Design", Icon: PenTool },
    { id: "development", label: "Desenvolvimento", Icon: Rocket },
    { id: "performance", label: "Performance", Icon: Gauge },
    { id: "results", label: "Resultados", Icon: Trophy },
    { id: "gallery", label: "Galeria", Icon: ImageIcon },
    { id: "learnings", label: "Aprendizados", Icon: Sparkles },
    { id: "cta", label: "CTA", Icon: ArrowRight },
  ];

  const timelineSteps = (timelineBlocks.length > 0 ? timelineBlocks : processBlocks).slice(0, 6);
  const timelineVisibleSteps = timelineSteps.slice(0, 5);
  const developmentCards = [
    ...challengesBlocks.map((b) => ({ ...b, section: "Desafio" })),
    ...decisionsBlocks.map((b) => ({ ...b, section: "Decisao" })),
    ...processBlocks.slice(0, 4).map((b) => ({ ...b, section: "Processo" })),
    ...roadmapBlocks.slice(0, 3),
  ];

  const architectureDescription = [
    architectureBlocks[0]?.description,
    flowBlocks[0]?.description,
    caseStudy.databaseStructure?.trim() ? `Banco:\n${caseStudy.databaseStructure}` : "",
  ]
    .filter((item) => item && item.trim().length > 0)
    .join("\n\n");

  const researchSummary =
    researchBlocks[0]?.description ||
    ((caseStudy.roles ?? []).length > 0
      ? `Papéis envolvidos: ${(caseStudy.roles ?? []).join(", ")}. Alinhamento entre produto, design e engenharia para decisões orientadas por dados.`
      : "");

  const navItems = sectionNav.map((s, i) => ({ id: s.id, n: String(i + 1).padStart(2, "0"), label: s.label, icon: s.Icon }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-24 overflow-x-hidden bg-[#050505]"
    >
      <ScrollProgress />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-30 grid-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,212,0,0.1),transparent_45%),radial-gradient(circle_at_85%_72%,rgba(255,212,0,0.07),transparent_42%)]" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[image:var(--grain)] bg-repeat" />
      </div>

      <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            data-cursor="open"
          >
            <ArrowLeft className="size-4" /> Voltar para projetos
          </Link>
          <div className="flex gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest hover:glow-neon transition-all"
              >
                <ExternalLink className="size-3" /> Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
              >
                <Github className="size-3" /> GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      <SidebarNavigation items={navItems} />

      <HeroSection
        category={cat}
        slug={project.slug}
        title={project.title}
        description={project.longDescription || project.description}
        image={project.heroImage || project.image}
        status={meta.status}
        tech={project.tech}
        meta={[
          { label: "Cliente", value: meta.client },
          { label: "Ano", value: meta.year },
          { label: "Tempo", value: meta.duration },
          { label: "Status", value: meta.status },
        ]}
        demo={project.demo}
        github={project.github}
      />

      <OverviewSection
        summary={project.longDescription || fallbackProblem || project.description}
        features={overviewFeatures}
      />

      <ProjectSectionTriple
        problem={fallbackProblem || "Sem descricao de problema cadastrada."}
        objectives={fallbackObjective || objectiveFromFeatures || "Sem objetivos cadastrados."}
        research={researchSummary || "Sem dados de pesquisa cadastrados."}
      />

      <ArchitectureSection
        description={
          architectureDescription ||
          "Arquitetura escalavel com separacao clara entre cliente, frontend, api e servicos de dados."
        }
        technologies={project.tech.slice(0, 6)}
      />

      <DesignShowcase
        images={[
          project.desktopMockup || "",
          project.tabletMockup || "",
          project.mobileMockup || "",
          project.heroImage || "",
          project.image || "",
          ...gallery,
        ]}
      />

      <DevelopmentSection timeline={timelineVisibleSteps} cards={developmentCards} />
      <PerformanceSection items={performanceResults} />
      <ResultsSection items={resultsItems} />
      <GallerySection images={galleryImages} labels={galleryLabels} />
      <LessonsSection items={learningsBlocks.length ? learningsBlocks : leftovers.slice(0, 3)} />
      <FinalCTA projectTitle={project.title} />
    </motion.div>
  );
}
