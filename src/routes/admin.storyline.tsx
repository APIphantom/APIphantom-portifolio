import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  X,
  Sparkles,
  RotateCcw,
  Pencil,
} from "lucide-react";
import {
  useStoryline,
  STORYLINE_ICONS,
  STORYLINE_ICON_KEYS,
  type StorylineItem,
} from "@/lib/storyline-store";

export const Route = createFileRoute("/admin/storyline")({
  head: () => ({
    meta: [{ title: "Storyline // Workspace" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminStoryline,
});

type Draft = Omit<StorylineItem, "id" | "order">;

const EMPTY_DRAFT: Draft = {
  year: "",
  title: "",
  subtitle: "",
  description: "",
  icon: "sparkles",
  badge: "",
  active: true,
};

function AdminStoryline() {
  const { items, add, update, remove, move, reset } = useStoryline();
  const sorted = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  const openCreate = () => {
    setDraft(EMPTY_DRAFT);
    setCreating(true);
    setEditingId(null);
  };

  const openEdit = (item: StorylineItem) => {
    setDraft({
      year: item.year,
      title: item.title,
      subtitle: item.subtitle ?? "",
      description: item.description,
      icon: item.icon,
      badge: item.badge ?? "",
      active: item.active,
    });
    setEditingId(item.id);
    setCreating(false);
  };

  const close = () => {
    setEditingId(null);
    setCreating(false);
  };

  const save = () => {
    if (!draft.title.trim() || !draft.year.trim() || !draft.description.trim()) {
      toast.error("Preencha ano, título e descrição.");
      return;
    }
    if (editingId) {
      update(editingId, draft);
      toast.success("Marco atualizado.");
    } else {
      add(draft);
      toast.success("Marco criado.");
    }
    close();
  };

  const handleRemove = (item: StorylineItem) => {
    if (!confirm(`Remover "${item.title}"?`)) return;
    remove(item.id);
    toast.success("Marco removido.");
  };

  const handleReset = () => {
    if (!confirm("Restaurar Storyline padrão? Suas alterações serão perdidas.")) return;
    reset();
    toast.success("Storyline restaurada.");
  };

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      <header className="flex items-end justify-between gap-6 mb-10 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            // Storyline
          </div>
          <h1 className="display text-4xl lg:text-5xl">Linha do tempo</h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Edite, reordene e publique os marcos da sua trajetória. As alterações refletem
            imediatamente na home.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
          <button
            onClick={openCreate}
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold hover:glow-neon transition-shadow"
          >
            <Plus className="size-4" /> Novo marco
          </button>
        </div>
      </header>

      <div className="space-y-2">
        {sorted.map((item, i) => {
          const Icon = STORYLINE_ICONS[item.icon] ?? Sparkles;
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                item.active
                  ? "border-border bg-card/40 hover:border-primary/40"
                  : "border-dashed border-border/60 bg-card/20 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(item.id, -1)}
                  disabled={i === 0}
                  data-cursor="hover"
                  className="size-6 rounded-md border border-border flex items-center justify-center disabled:opacity-30 hover:border-primary hover:text-primary transition-colors"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  onClick={() => move(item.id, 1)}
                  disabled={i === sorted.length - 1}
                  data-cursor="hover"
                  className="size-6 rounded-md border border-border flex items-center justify-center disabled:opacity-30 hover:border-primary hover:text-primary transition-colors"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="size-3" />
                </button>
              </div>

              <div className="size-12 rounded-xl border border-border flex items-center justify-center bg-background/50 shrink-0">
                <Icon className="size-5 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-primary">{item.year}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-[0.3em] px-2 py-0.5 border border-primary/40 text-primary rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    #{item.order}
                  </span>
                </div>
                <div className="font-bold truncate mt-1">{item.title}</div>
                {item.subtitle && (
                  <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                )}
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => update(item.id, { active: !item.active })}
                  data-cursor="hover"
                  aria-label={item.active ? "Desativar" : "Ativar"}
                  className="size-8 rounded-md border border-border hover:border-primary hover:text-primary flex items-center justify-center"
                >
                  {item.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  data-cursor="hover"
                  aria-label="Editar"
                  className="size-8 rounded-md border border-border hover:border-primary hover:text-primary flex items-center justify-center"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  data-cursor="hover"
                  aria-label="Remover"
                  className="size-8 rounded-md border border-border hover:border-destructive hover:text-destructive flex items-center justify-center"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground text-sm">Nenhum marco. Adicione o primeiro.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(creating || editingId) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={close} />
            <motion.div
              initial={{ scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 16, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card/90 backdrop-blur-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border bg-card/95 backdrop-blur">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
                    {editingId ? "Editar marco" : "Novo marco"}
                  </div>
                  <div className="font-black text-xl tracking-tight mt-0.5">Storyline</div>
                </div>
                <button
                  onClick={close}
                  className="size-9 rounded-full border border-border flex items-center justify-center hover:border-primary"
                  aria-label="Fechar"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Ano" required>
                    <input
                      value={draft.year}
                      onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                      placeholder="2024"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
                    />
                  </Field>
                  <Field label="Badge">
                    <input
                      value={draft.badge ?? ""}
                      onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                      placeholder="Framework"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
                    />
                  </Field>
                </div>

                <Field label="Título" required>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="React"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
                  />
                </Field>

                <Field label="Subtítulo">
                  <input
                    value={draft.subtitle ?? ""}
                    onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                    placeholder="Componentização"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
                  />
                </Field>

                <Field label="Descrição" required>
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={3}
                    placeholder="O que esse marco representa..."
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none resize-none"
                  />
                </Field>

                <Field label="Ícone">
                  <div className="grid grid-cols-7 sm:grid-cols-8 gap-2">
                    {STORYLINE_ICON_KEYS.map((key) => {
                      const I = STORYLINE_ICONS[key];
                      const selected = draft.icon === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDraft({ ...draft, icon: key })}
                          aria-label={key}
                          className={`aspect-square rounded-lg border flex items-center justify-center transition-all ${
                            selected
                              ? "border-primary text-primary bg-primary/10 glow-neon"
                              : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                          }`}
                        >
                          <I className="size-4" />
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                    className="size-4 accent-primary"
                  />
                  <span className="text-sm">Ativo (visível na home)</span>
                </label>
              </div>

              <div className="sticky bottom-0 flex gap-2 p-5 border-t border-border bg-card/95 backdrop-blur">
                <button
                  onClick={close}
                  className="px-4 py-2.5 rounded-lg border border-border text-xs uppercase tracking-widest hover:border-primary"
                >
                  Cancelar
                </button>
                <button
                  onClick={save}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs hover:glow-neon transition-shadow"
                >
                  <Save className="size-3.5" /> {editingId ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}
