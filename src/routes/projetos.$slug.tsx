import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, LoaderCircle, RotateCcw } from 'lucide-react';
import type { Project } from '@/lib/projects-store';
import { CATEGORIES } from '@/lib/projects-store';
import { getProjectBySlug, getProjectNeighbors, listTechnologies } from '@/lib/portfolio.functions';
import { normalizeCaseStudy, visibleSorted } from '@/lib/case-study';
import { ProjectHero } from '@/components/case-study/ProjectHero';
import { ProjectOverview, ProjectFeatures } from '@/components/case-study/ProjectOverview';
import { ProjectArchitecture } from '@/components/case-study/ProjectArchitecture';
import { ProjectMediaGallery } from '@/components/case-study/ProjectMediaGallery';
import { ProjectMetrics, ProjectPerformance } from '@/components/case-study/ProjectResults';
import { ProjectCTA } from '@/components/case-study/ProjectCTA';
import { Navbar } from '@/components/Navbar';
import { CaseStudySidebar } from '@/components/case-study/CaseStudySidebar';
import { ProjectNavigation } from '@/components/case-study/ProjectCTA';
import { ProjectProcess } from '@/components/case-study/ProjectProcess';
import { ProjectDemoVideo } from '@/components/case-study/ProjectDemoVideo';
import { detectMediaKind } from '@/lib/project-media';

export const Route = createFileRoute('/projetos/$slug')({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Case Study` },
      {
        name: 'description',
        content: `Case study do projeto ${params.slug}`,
      },
      { property: 'og:title', content: `${params.slug} — Case Study` },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `/projetos/${params.slug}` },
    ],
    links: [{ rel: 'canonical', href: `/projetos/${params.slug}` }],
  }),
  component: ProjectPage,
  errorComponent: () => (
    <div className="case-study-theme min-h-screen flex items-center justify-center text-destructive p-6 text-center">
      Não foi possível carregar este projeto agora. Tente novamente em instantes.
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Projeto não encontrado.
    </div>
  ),
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const fetchProject = useServerFn(getProjectBySlug);
  const fetchNeighbors = useServerFn(getProjectNeighbors);
  const fetchTechnologies = useServerFn(listTechnologies);

  const {
    data: project,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProject({ data: { slug } }),
    staleTime: 0,
    refetchOnMount: 'always',
  });
  const { data: technologies = [] } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => fetchTechnologies(),
    staleTime: 5 * 60_000,
  });
  const { data: neighbors } = useQuery({
    queryKey: ['project-neighbors', slug],
    queryFn: () => fetchNeighbors({ data: { slug } }),
    staleTime: 5 * 60_000,
  });

  if (isPending) {
    return (
      <div className="case-study-theme min-h-screen flex items-center justify-center text-muted-foreground bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <LoaderCircle className="size-7 animate-spin text-primary" aria-hidden="true" />
          <div>
            <div className="text-lg font-semibold">Carregando projeto…</div>
            <p className="mt-2 text-sm text-muted-foreground">Preparando o estudo de caso.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="case-study-theme min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Projeto indisponível
          </p>
          <h1 className="text-3xl font-bold mb-3">Não foi possível carregar agora</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Tente novamente. Se o problema continuar, volte à lista de projetos.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground"
          >
            <RotateCcw className="size-4" /> Tentar novamente
          </button>
          <Link
            to="/"
            hash="projetos"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="size-4" /> Voltar aos projetos
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="case-study-theme min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background gap-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            // 404 não encontrado
          </div>
          <h1 className="text-4xl font-bold mb-3">Projeto não existe</h1>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            Não conseguimos encontrar o projeto que você está procurando.
          </p>
        </div>
        <Link
          to="/"
          hash="projetos"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-all"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>
      </div>
    );
  }

  // Normalize case study data
  const caseStudy = normalizeCaseStudy(project);
  const category = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;
  const normalizedOverviewDescription = removeMatchingLeadHeading(
    caseStudy.overview.description ?? '',
    project.title,
  );
  const overview = {
    ...caseStudy.overview,
    description:
      normalizedOverviewDescription ||
      project.longDescription ||
      caseStudy.legacy?.problemStatement ||
      project.problem ||
      project.objective ||
      '',
  };
  const heroDescription =
    caseStudy.hero.description?.trim() &&
    caseStudy.hero.description.trim() === caseStudy.overview.description?.trim() &&
    project.description.trim()
      ? project.description
      : caseStudy.hero.description?.trim() || project.description;
  const hero = {
    ...caseStudy.hero,
    title: caseStudy.hero.title.trim() || project.title.trim(),
    description: heroDescription,
    heroMediaUrl: caseStudy.hero.heroMediaUrl?.trim() || project.heroImage || project.image,
    heroVideoUrl: caseStudy.hero.heroVideoUrl?.trim() || project.heroVideo,
    desktopMediaUrl: caseStudy.hero.desktopMediaUrl?.trim() || project.desktopMockup,
    mobileMediaUrl: caseStudy.hero.mobileMediaUrl?.trim() || project.mobileMockup,
  };
  const legacyRoles = caseStudy.legacy?.roles?.map((role) => role.trim()).filter(Boolean) ?? [];
  if (
    legacyRoles.length &&
    !hero.meta.some((item) => item.label.trim().toLocaleLowerCase('pt-BR') === 'papel')
  ) {
    hero.meta = [
      ...hero.meta,
      {
        id: 'legacy-roles',
        label: 'Papel',
        value: legacyRoles.join(', '),
        sortOrder: hero.meta.length,
        isVisible: true,
      },
    ];
  }
  const features = visibleSorted(caseStudy.features).filter(
    (item) => item.title.trim() || item.description.trim(),
  );
  const allMediaItems = {
    ...caseStudy.media,
    items: visibleSorted(caseStudy.media.items).filter((item) => item.url.trim()),
  };
  const demoVideo = allMediaItems.items.find(
    (item) => item.featured && detectMediaKind({ src: item.url, mediaType: item.kind }) === 'video',
  );
  const media = {
    ...allMediaItems,
    items: allMediaItems.items.filter((item) => item.id !== demoVideo?.id),
  };
  const metrics = visibleSorted(caseStudy.metrics).filter(
    (item) => item.title.trim() && item.value.trim(),
  );
  const performance = visibleSorted(caseStudy.performance).filter(
    (item) => item.name.trim() && item.value.trim(),
  );
  const fallbackTechnologyNames = project.tech;
  const hasHeroContent = Boolean(
    hero.title ||
    hero.description?.trim() ||
    hero.heroMediaUrl?.trim() ||
    hero.heroVideoUrl?.trim() ||
    hero.desktopMediaUrl?.trim() ||
    hero.mobileMediaUrl?.trim() ||
    hero.meta.some((item) => item.isVisible && item.label.trim() && item.value.trim()),
  );
  const visibleArchitectureGroups = visibleSorted(caseStudy.architecture.groups).filter((group) =>
    group.items.some((item) => item.technologyName.trim()),
  );
  const hasArchitecture = Boolean(
    caseStudy.architecture.title?.trim() ||
    caseStudy.architecture.description?.trim() ||
    caseStudy.architecture.highlightText?.trim() ||
    Object.values(caseStudy.architecture.stackDetails ?? {}).some((value) => value?.trim()) ||
    visibleArchitectureGroups.length ||
    caseStudy.architecture.technologyIds.length ||
    fallbackTechnologyNames.length,
  );
  const hasProcess = Boolean(
    project.objective?.trim() ||
    project.problem?.trim() ||
    project.solution?.trim() ||
    project.result?.trim() ||
    caseStudy.legacy?.problemStatement?.trim() ||
    caseStudy.legacy?.developmentProcess?.some((item) => item.trim()) ||
    caseStudy.legacy?.timeline?.some((item) => item.trim()),
  );
  const navigationItems = [
    ...(overview.title?.trim() || overview.description?.trim() || overview.pillars.length
      ? [{ id: 'overview', n: '01', label: 'Visão geral' }]
      : []),
    ...(features.length ? [{ id: 'features', n: '03', label: 'Funcionalidades' }] : []),
    ...(hasArchitecture ? [{ id: 'architecture', n: '03', label: 'Arquitetura' }] : []),
    ...(hasProcess ? [{ id: 'process', n: '04', label: 'Processo' }] : []),
    ...(demoVideo ? [{ id: 'demo-video', n: '05', label: 'Demonstração' }] : []),
    ...(media.items.length ? [{ id: 'media', n: '06', label: 'Galeria' }] : []),
    ...(metrics.length ? [{ id: 'results', n: '05', label: 'Resultados' }] : []),
    ...(performance.length ? [{ id: 'performance', n: '07', label: 'Performance' }] : []),
    { id: 'cta', n: '08', label: 'Contato' },
  ].map((item, index) => ({ ...item, n: String(index + 1).padStart(2, '0') }));

  return (
    <div className="case-study-theme min-h-screen bg-background pt-16 text-foreground">
      {/* Sticky Header */}
      <Navbar caseStudy />
      <CaseStudySidebar items={navigationItems} />

      {/* Main Content */}
      <main className="space-y-0">
        {/* Hero Section */}
        {hasHeroContent ? <ProjectHero data={hero} categoryFallback={category} /> : null}

        {/* Overview Section */}
        <ProjectOverview data={overview} />

        {/* Features Section */}
        {features.length > 0 ? (
          <ProjectFeatures items={features} title={caseStudy.featuresTitle} />
        ) : null}

        {/* Architecture Section */}
        <ProjectArchitecture
          data={caseStudy.architecture}
          technologies={technologies}
          fallbackTechnologyNames={fallbackTechnologyNames}
        />

        {/* Process and timeline */}
        {hasProcess ? <ProjectProcess project={project} legacy={caseStudy.legacy} /> : null}

        {/* Project demonstration */}
        {demoVideo ? <ProjectDemoVideo item={demoVideo} /> : null}

        {/* Media Gallery Section */}
        {media.items.length > 0 ? <ProjectMediaGallery data={media} /> : null}

        {/* Results Section */}
        {metrics.length > 0 ? (
          <ProjectMetrics
            items={metrics}
            summary={caseStudy.metricsSummary?.trim() || project.description}
            title={caseStudy.metricsTitle}
          />
        ) : null}

        {/* Performance Section */}
        {performance.length > 0 ? (
          <ProjectPerformance items={performance} title={caseStudy.performanceTitle} />
        ) : null}

        {/* Final CTA Section */}
        <ProjectCTA data={caseStudy.cta} />
        <ProjectNavigation prev={neighbors?.prev ?? null} next={neighbors?.next ?? null} />
      </main>

      {/* Footer / Navigation */}
      <footer className="mt-16 border-t border-border bg-background/50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{project.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">Case Study</p>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Portfólio</p>
        </div>
      </footer>
    </div>
  );
}

function removeMatchingLeadHeading(description: string, title: string) {
  const [firstLine, ...remainingLines] = description.split(/\r?\n/);
  const heading = firstLine?.replace(/^#{1,6}\s+/, '').trim();
  if (!heading || heading !== title.trim()) return description;
  return remainingLines.join('\n').trim();
}
