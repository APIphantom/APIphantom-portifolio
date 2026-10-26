import type { NeighborProject } from '@/lib/case-study';
import { categoryLabel, normalizeCaseStudy, visibleSorted } from '@/lib/case-study';
import type { Project, Settings, Technology } from '@/lib/projects-store';
import { CaseStudyHeader } from './CaseStudyHeader';
import { CaseStudySidebar } from './CaseStudySidebar';
import { ProjectArchitecture } from './ProjectArchitecture';
import { ProjectCTA, ProjectNavigation } from './ProjectCTA';
import { ProjectHero } from './ProjectHero';
import { ProjectMediaGallery } from './ProjectMediaGallery';
import { ProjectFeatures, ProjectOverview } from './ProjectOverview';
import { ProjectMetrics, ProjectPerformance } from './ProjectResults';
import { Github, Linkedin, Instagram } from 'lucide-react';
import { detectMediaKind } from '@/lib/project-media';
import { ProjectDemoVideo } from './ProjectDemoVideo';

type Props = {
  project: Project;
  technologies?: Technology[];
  settings?: Settings;
  neighbors?: { prev: NeighborProject | null; next: NeighborProject | null };
  preview?: boolean;
};

export function CaseStudyPage({ project, technologies = [], settings, neighbors, preview }: Props) {
  const data = normalizeCaseStudy(project);
  const mediaItems = visibleSorted(data.media.items).filter((item) => item.url);
  const demoVideo = mediaItems.find(
    (item) => item.featured && detectMediaKind({ src: item.url, mediaType: item.kind }) === 'video',
  );
  const galleryItems = mediaItems.filter((item) => item.id !== demoVideo?.id);
  const nav: { id: string; n: string; label: string }[] = [];
  const addNavItem = (id: string, label: string) => {
    nav.push({ id, n: String(nav.length + 1).padStart(2, '0'), label });
  };
  if (data.overview.description || visibleSorted(data.overview.pillars).length) {
    addNavItem('overview', 'Visão geral');
  }
  if (data.architecture.description || visibleSorted(data.architecture.groups).length) {
    addNavItem('architecture', 'Arquitetura');
  }
  if (demoVideo) addNavItem('demo-video', 'Demonstração');
  if (galleryItems.length) addNavItem('media', 'Mídia');
  if (visibleSorted(data.performance).length) addNavItem('performance', 'Performance');
  if (visibleSorted(data.metrics).length) addNavItem('results', 'Resultados');
  addNavItem('cta', 'Contato');

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      {preview ? (
        <div className="sticky top-0 z-[60] bg-[#FFD600] px-4 py-2 text-center text-xs font-semibold text-black">
          Preview — este projeto ainda não está publicado
        </div>
      ) : null}
      <CaseStudyHeader />
      <CaseStudySidebar items={nav} />
      <ProjectHero data={data.hero} categoryFallback={categoryLabel(project.category)} />
      <ProjectOverview data={data.overview} />
      <ProjectFeatures items={data.features} />
      <ProjectArchitecture data={data.architecture} technologies={technologies} />
      {demoVideo ? <ProjectDemoVideo item={demoVideo} /> : null}
      <ProjectMediaGallery data={{ ...data.media, items: galleryItems }} />
      <ProjectPerformance items={data.performance} />
      <ProjectMetrics
        items={data.metrics}
        summary={data.metricsSummary?.trim() || project.description}
        title={data.metricsTitle}
      />
      <ProjectCTA data={data.cta} />
      <ProjectNavigation prev={neighbors?.prev ?? null} next={neighbors?.next ?? null} />
      <footer className="border-t border-zinc-800 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-black text-[#FFD600]">
              {(settings?.name || 'Adriano Oliveira')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join('') || 'AO'}
            </div>
            <p className="text-xs text-zinc-500">
              {settings?.role || 'Desenvolvedor Web'} | Portfólio
            </p>
          </div>
          <div className="flex gap-3 text-zinc-400">
            {settings?.github ? (
              <a href={settings.github} aria-label="GitHub" target="_blank" rel="noreferrer">
                <Github className="size-4" />
              </a>
            ) : null}
            {settings?.linkedin ? (
              <a href={settings.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <Linkedin className="size-4" />
              </a>
            ) : null}
            {settings?.instagram ? (
              <a href={settings.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                <Instagram className="size-4" />
              </a>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
