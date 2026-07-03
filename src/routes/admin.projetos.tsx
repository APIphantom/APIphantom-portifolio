import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Eye,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useProjects, CATEGORIES, type Project, type ProjectStatus } from "@/lib/projects-store";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projetos")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s.new ? 1 : undefined }),
  component: ProjetosPage,
});

function ProjetosPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { projects, addProject, updateProject, removeProject, duplicateProject, loaded } =
    useProjects();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | ProjectStatus>("all");
  const [category, setCategory] = useState<"all" | string>("all");
  const [sort, setSort] = useState<"updated" | "title">("updated");
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  useEffect(() => {
    if (search.new) {
      setCreating(true);
      navigate({ search: {} as never, replace: true });
    }
  }, [search.new, navigate]);

  const filtered = useMemo(() => {
    let list = projects;
    if (q)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.tech.join(" ").toLowerCase().includes(q.toLowerCase()),
      );
    if (status !== "all") list = list.filter((p) => (p.publication?.status ?? "draft") === status);
    if (category !== "all") list = list.filter((p) => p.category === category);
    list = [...list].sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
    );
    return list;
  }, [projects, q, status, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            // Projetos
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Gerenciar projetos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} projetos no portfólio.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          data-cursor="hover"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
        >
          <Plus className="size-4" /> Novo Projeto
        </button>
      </header>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar projeto ou stack..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card/40 border border-border text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
        <Select
          value={status}
          onChange={(v) => setStatus(v as never)}
          options={[
            { value: "all", label: "Todos status" },
            { value: "published", label: "Publicado" },
            { value: "draft", label: "Rascunho" },
            { value: "archived", label: "Arquivado" },
          ]}
        />
        <Select
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "Todas categorias" },
            ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
          ]}
        />
        <Select
          value={sort}
          onChange={(v) => setSort(v as never)}
          options={[
            { value: "updated", label: "Atualizado" },
            { value: "title", label: "Título" },
          ]}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl overflow-visible">
        <div className="hidden md:grid grid-cols-[60px_1fr_120px_1.5fr_140px_60px] gap-3 px-4 py-3 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
          <div></div>
          <div>Projeto</div>
          <div>Status</div>
          <div>Stack</div>
          <div>Atualizado</div>
          <div></div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[60px_1fr_60px] md:grid-cols-[60px_1fr_120px_1.5fr_140px_60px] gap-3 px-4 py-3 items-center hover:bg-muted/10 transition-colors group"
            >
              <div className="size-12 rounded-md overflow-hidden bg-muted">
                {p.image ? (
                  <img src={p.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/40 font-black text-sm">
                    {p.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <button
                  onClick={() => setEditing(p)}
                  className="font-bold truncate hover:text-primary text-left block w-full"
                >
                  {p.title}
                </button>
                <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
              </div>
              <div className="hidden md:block">
                <StatusPill status={p.publication?.status ?? "draft"} />
              </div>
              <div className="hidden md:flex flex-wrap gap-1 min-w-0">
                {p.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full bg-muted/40 border border-border text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
                {p.tech.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{p.tech.length - 3}</span>
                )}
              </div>
              <div className="hidden md:block text-xs text-muted-foreground">
                {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("pt-BR") : "—"}
              </div>
              <div className="relative">
                <button
                  onClick={() => setMenuFor(menuFor === p.id ? null : p.id)}
                  className="size-8 rounded-md border border-border hover:border-primary flex items-center justify-center"
                >
                  <MoreHorizontal className="size-4" />
                </button>
                <AnimatePresence>
                  {menuFor === p.id && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setMenuFor(null)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl p-1"
                      >
                        <MenuItem
                          icon={Pencil}
                          label="Editar"
                          onClick={() => {
                            setEditing(p);
                            setMenuFor(null);
                          }}
                        />
                        <MenuItem
                          icon={Eye}
                          label="Visualizar"
                          onClick={() => {
                            window.open(`/projeto/${p.slug}`, "_blank");
                            setMenuFor(null);
                          }}
                        />
                        <MenuItem
                          icon={Copy}
                          label="Duplicar"
                          onClick={() => {
                            duplicateProject(p.id);
                            setMenuFor(null);
                          }}
                        />
                        <MenuItem
                          icon={Archive}
                          label="Arquivar"
                          onClick={() => {
                            updateProject(p.id, {
                              publication: {
                                ...(p.publication ?? { visibility: "public" as const }),
                                status: "archived",
                              },
                            });
                            setMenuFor(null);
                          }}
                        />
                        <div className="h-px bg-border my-1" />
                        <MenuItem
                          icon={Trash2}
                          label="Excluir"
                          destructive
                          onClick={() => {
                            if (confirm("Excluir definitivamente?")) removeProject(p.id);
                            setMenuFor(null);
                          }}
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
          {!loaded && (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr] md:grid-cols-[2fr_120px_2fr_120px_40px] gap-4 items-center"
                >
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="hidden md:block h-5 w-20" />
                  <Skeleton className="hidden md:block h-5 w-2/3" />
                  <Skeleton className="hidden md:block h-4 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          )}
          {loaded && filtered.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Nenhum projeto encontrado.
            </div>
          )}
        </div>
      </div>

      <ProjectEditor
        open={!!editing || creating}
        project={editing}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        onSave={async (data) => {
          try {
            if (editing) await updateProject(editing.id, data);
            else await addProject(data);

            toast.success("Projeto salvo com sucesso.");
            setEditing(null);
            setCreating(false);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Falha ao salvar projeto.";
            toast.error(message);
          }
        }}
      />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
        destructive ? "text-destructive hover:bg-destructive/10" : "hover:bg-muted/50"
      }`}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-card/40 border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
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
      className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest inline-block ${map[status] ?? map.draft}`}
    >
      {label[status] ?? status}
    </span>
  );
}
