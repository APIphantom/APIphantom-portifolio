import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Plus, Trash2, Search, Pencil, X, Check } from 'lucide-react';
import { useTechnologies, type Technology } from '@/lib/projects-store';
import { BRAND_OPTIONS, TechnologyBrandIcon } from '@/components/admin/TechnologyBrandIcon';
import { TECHNOLOGY_CATALOG, type CatalogTechnology } from '@/lib/technology-catalog';

export const Route = createFileRoute('/admin/tecnologias')({
  component: TechPage,
});

function TechPage() {
  const { items, add, update, remove } = useTechnologies();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Technology | null>(null);
  const [creating, setCreating] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCatalogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-primary/50 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors"
          >
            <Search className="size-4" /> Explorar catálogo
          </button>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
          >
            <Plus className="size-4" /> Nova
          </button>
        </div>
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
            <TechnologyBrandIcon name={t.name} icon={t.icon} className="size-8 shrink-0" />
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
      {catalogOpen && (
        <TechnologyCatalogModal
          technologies={items}
          onClose={() => setCatalogOpen(false)}
          onAdd={(technology) => add(technology)}
        />
      )}
    </div>
  );
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function TechnologyCatalogModal({
  technologies,
  onClose,
  onAdd,
}: {
  technologies: Technology[];
  onClose: () => void;
  onAdd: (technology: Omit<Technology, 'id'>) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [addedSlugs, setAddedSlugs] = useState<string[]>([]);
  const categories = useMemo(
    () => ['Todas', ...new Set(TECHNOLOGY_CATALOG.map((technology) => technology.category))],
    [],
  );
  const existingSlugs = useMemo(
    () =>
      new Set(
        technologies.flatMap((technology) => [
          normalize(technology.name),
          normalize(technology.icon ?? ''),
        ]),
      ),
    [technologies],
  );
  const filteredCatalog = TECHNOLOGY_CATALOG.filter((technology) => {
    const matchesCategory = category === 'Todas' || technology.category === category;
    const searchTerm = normalize(search);
    const matchesSearch =
      !searchTerm ||
      normalize(technology.label).includes(searchTerm) ||
      normalize(technology.category).includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const addTechnology = (technology: CatalogTechnology) => {
    onAdd({
      name: technology.label,
      category: technology.category,
      icon: technology.slug,
      color: '#FFD400',
    });
    setAddedSlugs((current) => [...current, technology.slug]);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-background/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="technology-catalog-title"
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose();
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-border">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
              // Catálogo oficial
            </div>
            <h2 id="technology-catalog-title" className="text-xl sm:text-2xl font-black">
              Adicione tecnologias à sua Stack
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {TECHNOLOGY_CATALOG.length} opções com logotipos oficiais. Você pode adicionar novas
              aos poucos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar catálogo"
            className="size-9 shrink-0 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="grid gap-3 p-4 sm:p-5 sm:grid-cols-[minmax(0,1fr)_13rem] border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              autoFocus
              aria-label="Buscar no catálogo de tecnologias"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tecnologia ou categoria..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:border-primary outline-none"
            />
          </div>
          <select
            aria-label="Filtrar por categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-primary outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((technology) => {
              const alreadyAdded =
                existingSlugs.has(normalize(technology.label)) ||
                existingSlugs.has(normalize(technology.slug)) ||
                addedSlugs.includes(technology.slug);
              return (
                <div
                  key={technology.slug}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background/50 p-3"
                >
                  <TechnologyBrandIcon
                    name={technology.label}
                    icon={technology.slug}
                    className="size-7 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{technology.label}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {technology.category}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => addTechnology(technology)}
                    aria-label={
                      alreadyAdded
                        ? `${technology.label} já adicionada`
                        : `Adicionar ${technology.label}`
                    }
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-primary hover:border-primary hover:bg-primary/10 disabled:cursor-default disabled:text-muted-foreground disabled:hover:border-border disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {alreadyAdded ? <Check className="size-4" /> : <Plus className="size-4" />}
                  </button>
                </div>
              );
            })}
          </div>
          {filteredCatalog.length === 0 && (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Nenhuma opção encontrada. Use “Nova” para cadastrar uma tecnologia personalizada.
            </p>
          )}
        </div>

        <footer className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {addedSlugs.length
              ? `${addedSlugs.length} ${addedSlugs.length === 1 ? 'tecnologia adicionada' : 'tecnologias adicionadas'} nesta sessão.`
              : 'Os itens selecionados aparecem na sua Stack.'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
          >
            Concluir
          </button>
        </footer>
      </section>
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
  onSave: (t: Omit<Technology, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<Technology, 'id'>>(
    tech
      ? {
          name: tech.name,
          category: tech.category,
          url: tech.url,
          color: tech.color,
          icon: tech.icon,
        }
      : { name: '', category: 'Frontend', color: '#FFD400' },
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
          // {tech ? 'Editar' : 'Nova'} tecnologia
        </div>
        <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Input
          label="Categoria"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
        />
        <Input label="URL" value={form.url ?? ''} onChange={(v) => setForm({ ...form, url: v })} />
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Logotipo da tecnologia
          </label>
          <select
            value={form.icon ?? ''}
            onChange={(event) => setForm({ ...form, icon: event.target.value || undefined })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-primary outline-none"
          >
            <option value="">Detectar pelo nome</option>
            {BRAND_OPTIONS.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.label}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <TechnologyBrandIcon name={form.name} icon={form.icon} className="size-5" />
            <span>O logotipo acompanha automaticamente o nome quando houver correspondência.</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Cor
          </label>
          <input
            type="color"
            value={form.color ?? '#FFD400'}
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
