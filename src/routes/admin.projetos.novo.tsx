import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CaseStudyEditor } from '@/components/admin/case-study/CaseStudyEditor';
import { emptyCaseStudy } from '@/lib/case-study';
import type { Project } from '@/lib/projects-store';

export const Route = createFileRoute('/admin/projetos/novo')({
  component: NewProjectPage,
});

function NewProjectPage() {
  const [draft] = useState<Project>(() => ({
    id: 'new-project-draft',
    slug: '',
    title: '',
    description: '',
    longDescription: '',
    image: '',
    tech: [],
    category: 'web',
    publication: { status: 'draft', visibility: 'private' },
    seo: { robotsIndex: false },
    caseStudy: emptyCaseStudy(),
  }));

  return <CaseStudyEditor key={draft.id} project={draft} isNew />;
}
