import { useSettings } from "@/lib/projects-store";

export function Footer() {
  const { settings } = useSettings();
  const displayName = (settings.name || "Adriano").toUpperCase();

  return (
    <footer className="border-t border-border py-10 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-6 md:items-end md:justify-between">
        <div>
          <div className="display text-4xl md:text-6xl">
            ADRIANO
            <span className="text-primary">/</span>DEV
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
            {settings.role || "Front-End Júnior"} · Aprendendo, construindo, evoluindo.
          </p>
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} {settings.name || "Adriano Oliveira"} · Feito com React,
          TypeScript e cafe
        </div>
      </div>
    </footer>
  );
}
