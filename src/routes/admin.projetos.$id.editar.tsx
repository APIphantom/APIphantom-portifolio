import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft } from 'lucide-react';

import { getProjectById } from '@/lib/portfolio.functions';
import { CaseStudyEditor } from '@/components/admin/case-study/CaseStudyEditor';

export const Route = createFileRoute('/admin/projetos/$id/editar')({
  component: ProjectEditorPage,

  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-destructive p-6">
      <div className="text-center">
        <div className="font-bold mb-2">Erro ao carregar projeto</div>

        <div className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'}
        </div>
      </div>
    </div>
  ),

  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Projeto não encontrado.
    </div>
  ),
});

function ProjectEditorPage() {
  const { id } = useParams({
    from: '/admin/projetos/$id/editar',
  });

  const navigate = useNavigate();

  const fetchProject = useServerFn(getProjectById);

  const {
    data: project,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      return await fetchProject({ data: { id } });
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="size-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />

          <span>Carregando projeto…</span>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6 bg-background">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            // ERRO
          </div>

          <h1 className="text-2xl font-bold mb-2">Projeto não encontrado</h1>

          <p className="text-sm text-muted-foreground max-w-md">
            Não conseguimos carregar o projeto solicitado. Ele pode ter sido removido ou o
            identificador informado pode ser inválido.
          </p>

          {error instanceof Error && (
            <p className="mt-3 text-xs text-destructive/80 max-w-lg">{error.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            navigate({
              to: '/admin/projetos',
              search: {} as never,
            })
          }
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2.5
            rounded-full
            bg-primary
            text-primary-foreground
            text-xs
            font-bold
            uppercase
            tracking-widest
            transition-all
            hover:opacity-90
            hover:shadow-lg
          "
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>
      </div>
    );
  }

  return <CaseStudyEditor key={project.id} project={project} />;
}
