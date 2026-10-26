import { useSettings } from '@/lib/projects-store';

export function Footer() {
  const { settings } = useSettings();
  const displayName = (settings.name || 'Adriano').toUpperCase();

  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="#home"
          className="group inline-flex w-fit flex-col rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Voltar ao início"
        >
          <span className="display text-3xl tracking-tight sm:text-4xl">
            ADRIANO<span className="text-primary">/</span>DEV
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors group-hover:text-primary">
            {settings.role || 'Desenvolvedor Front-End Júnior'}
          </span>
        </a>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          aria-label="Navegação do rodapé"
        >
          <a href="#skills" className="transition-colors hover:text-primary">
            Habilidades
          </a>
          <a href="#projetos" className="transition-colors hover:text-primary">
            Projetos
          </a>
          <a href="#contato" className="transition-colors hover:text-primary">
            Contato
          </a>
        </nav>

        <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-right">
          © {new Date().getFullYear()} {settings.name || 'Adriano Oliveira'}
        </div>
      </div>
    </footer>
  );
}
