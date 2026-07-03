import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Github, ArrowUpRight, FolderKanban, Image as ImageIcon, Cpu } from "lucide-react";
import { useProjects, useMedia, useTechnologies, useSettings } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { projects } = useProjects();
  const { items: media } = useMedia();
  const { items: tech } = useTechnologies();
  const { settings } = useSettings();

  const cards = [
    { label: "Projetos", value: projects.length, to: "/admin/projetos", icon: FolderKanban },
    { label: "Tecnologias", value: tech.length, to: "/admin/tecnologias", icon: Cpu },
    { label: "Mídias", value: media.length, to: "/admin/midias", icon: ImageIcon },
  ];

  const recent = [...projects]
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-12">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            // Workspace
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Olá, {settings.name} <span className="inline-block">👋</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Gerencie seus projetos e mantenha seu portfólio atualizado.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/projetos"
            search={{ new: 1 } as never}
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
          >
            <Plus className="size-4" /> Novo Projeto
          </Link>
          <Link
            to="/admin/github"
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
          >
            <Github className="size-4" /> Importar GitHub
          </Link>
        </div>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link
              to={c.to}
              data-cursor="hover"
              className="block p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-xl hover:border-primary/40 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                    {c.label}
                  </div>
                  <div className="text-5xl font-black tracking-tight">{c.value}</div>
                </div>
                <c.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <ArrowUpRight className="absolute bottom-4 right-4 size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
            </Link>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            Projetos recentes
          </h2>
          <Link to="/admin/projetos" className="text-xs text-primary hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl divide-y divide-border">
          {recent.map((p) => (
            <Link
              key={p.id}
              to="/admin/projetos"
              className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors group"
            >
              <div className="size-10 rounded-md overflow-hidden bg-muted shrink-0">
                {p.image ? (
                  <img src={p.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/40 font-black text-sm">
                    {p.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {p.tech.slice(0, 4).join(" · ")}
                </div>
              </div>
              <StatusPill status={p.publication?.status ?? "draft"} />
            </Link>
          ))}
          {recent.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Nenhum projeto ainda. Crie o primeiro drop.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    archived: "bg-muted text-muted-foreground border-border",
  };
  const label: Record<string, string> = {
    published: "Publicado",
    draft: "Rascunho",
    archived: "Arquivado",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest ${map[status] ?? map.draft}`}
    >
      {label[status] ?? status}
    </span>
  );
}
