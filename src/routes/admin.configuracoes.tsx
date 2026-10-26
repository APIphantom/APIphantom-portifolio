import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSettings, type Settings } from '@/lib/projects-store';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/configuracoes')({
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update, saving, loaded } = useSettings({ includeSecrets: true });
  const [form, setForm] = useState<Settings>(settings);

  useEffect(() => setForm(settings), [settings]);

  const change = (patch: Partial<Settings>) => setForm((current) => ({ ...current, ...patch }));
  const save = async () => {
    try {
      await update(form);
      toast.success('Configurações salvas.');
    } catch {
      toast.error('Não foi possível salvar as configurações.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header>
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
          // Configurações
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Workspace</h1>
        <p className="text-muted-foreground text-sm mt-1">Personalize informações do portfólio.</p>
      </header>

      <Section title="Portfolio">
        <Grid>
          <Input label="Nome" value={form.name} onChange={(v) => change({ name: v })} />
          <Input label="Cargo" value={form.role} onChange={(v) => change({ role: v })} />
        </Grid>
        <TextArea label="Bio" value={form.bio} onChange={(v) => change({ bio: v })} />
      </Section>

      <Section title="Contato">
        <Grid>
          <Input label="Email" value={form.email} onChange={(v) => change({ email: v })} />
          <Input
            label="Localização"
            value={form.location}
            onChange={(v) => change({ location: v })}
          />
        </Grid>
        <p className="text-xs text-muted-foreground">
          O currículo ativo agora é gerenciado na aba "Currículos", onde você pode enviar PDFs,
          manter versões antigas e escolher qual fica no botão "Download CV".
        </p>
      </Section>

      <Section title="Redes sociais">
        <Grid>
          <Input
            label="GitHub"
            value={form.github}
            onChange={(v) => change({ github: v })}
            placeholder="https://github.com/..."
          />
          <Input
            label="LinkedIn"
            value={form.linkedin}
            onChange={(v) => change({ linkedin: v })}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="Twitter / X"
            value={form.twitter}
            onChange={(v) => change({ twitter: v })}
          />
          <Input
            label="Instagram"
            value={form.instagram}
            onChange={(v) => change({ instagram: v })}
          />
        </Grid>
      </Section>

      <Section title="Integração GitHub">
        <Grid>
          <Input
            label="Username"
            value={form.githubUsername ?? ''}
            onChange={(v) => change({ githubUsername: v })}
          />
          <Input
            label="Personal Access Token"
            type="password"
            value={form.githubToken ?? ''}
            onChange={(v) => change({ githubToken: v })}
            placeholder="ghp_..."
          />
        </Grid>
        <p className="text-xs text-muted-foreground">
          O token é armazenado nas configurações protegidas do servidor e só pode ser lido por
          administradores.
        </p>
      </Section>

      <div className="flex items-center justify-end gap-4" aria-live="polite">
        {saving ? <span className="text-xs text-muted-foreground">Salvando…</span> : null}
        <button
          type="button"
          onClick={save}
          disabled={saving || !loaded}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold hover:glow-neon disabled:cursor-not-allowed disabled:opacity-50"
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl p-6 space-y-4">
      <h2 className="text-sm uppercase tracking-widest text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none"
      />
    </div>
  );
}
function TextArea({
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none resize-none"
      />
    </div>
  );
}
