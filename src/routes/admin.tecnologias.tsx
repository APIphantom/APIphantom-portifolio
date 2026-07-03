import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Search, Pencil } from "lucide-react";
import { useTechnologies, type Technology } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/tecnologias")({
  component: TechPage,
});

function TechPage() {
  const { items, add, update, remove } = useTechnologies();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Technology | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = items.filter(
    (t) =>
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.category.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            // Tecnologias
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Stack</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} tecnologias reutilizáveis
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
        >
          <Plus className="size-4" /> Nova
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar tecnologia..."
          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card/40 border border-border text-sm focus:border-primary outline-none"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl divide-y divide-border">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-4 p-4 hover:bg-muted/10 transition-colors"
          >
            <div
              className="size-10 rounded-md flex items-center justify-center font-bold text-sm border border-border"
              style={{ background: t.color ? `${t.color}20` : undefined, color: t.color }}
            >
              {t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold">{t.name}</div>
              <div className="text-xs text-muted-foreground">
                {t.category}
                {t.url && ` · ${t.url}`}
              </div>
            </div>
            <button
              onClick={() => setEditing(t)}
              className="size-8 rounded-md border border-border hover:border-primary flex items-center justify-center"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={() => remove(t.id)}
              className="size-8 rounded-md border border-border hover:border-destructive hover:text-destructive flex items-center justify-center"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">Nenhuma tecnologia.</div>
        )}
      </div>

      {(editing || creating) && (
        <TechModal
          tech={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(data) => {
            if (editing) update(editing.id, data);
            else add(data);
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function TechModal({
  tech,
  onClose,
  onSave,
}: {
  tech: Technology | null;
  onClose: () => void;
  onSave: (t: Omit<Technology, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Technology, "id">>(
    tech
      ? {
          name: tech.name,
          category: tech.category,
          url: tech.url,
          color: tech.color,
          icon: tech.icon,
        }
      : { name: "", category: "Frontend", color: "#FFD400" },
  );
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
          // {tech ? "Editar" : "Nova"} tecnologia
        </div>
        <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Input
          label="Categoria"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
        />
        <Input label="URL" value={form.url ?? ""} onChange={(v) => setForm({ ...form, url: v })} />
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Cor
          </label>
          <input
            type="color"
            value={form.color ?? "#FFD400"}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-border text-xs uppercase tracking-widest"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
      />
    </div>
  );
}
