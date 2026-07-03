import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/lib/projects-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update } = useSettings();

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
          <Input label="Nome" value={settings.name} onChange={(v) => update({ name: v })} />
          <Input label="Cargo" value={settings.role} onChange={(v) => update({ role: v })} />
        </Grid>
        <TextArea label="Bio" value={settings.bio} onChange={(v) => update({ bio: v })} />
      </Section>

      <Section title="Contato">
        <Grid>
          <Input label="Email" value={settings.email} onChange={(v) => update({ email: v })} />
          <Input
            label="Localização"
            value={settings.location}
            onChange={(v) => update({ location: v })}
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
            value={settings.github}
            onChange={(v) => update({ github: v })}
            placeholder="https://github.com/..."
          />
          <Input
            label="LinkedIn"
            value={settings.linkedin}
            onChange={(v) => update({ linkedin: v })}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="Twitter / X"
            value={settings.twitter}
            onChange={(v) => update({ twitter: v })}
          />
          <Input
            label="Instagram"
            value={settings.instagram}
            onChange={(v) => update({ instagram: v })}
          />
        </Grid>
      </Section>

      <Section title="Integração GitHub">
        <Grid>
          <Input
            label="Username"
            value={settings.githubUsername ?? ""}
            onChange={(v) => update({ githubUsername: v })}
          />
          <Input
            label="Personal Access Token"
            type="password"
            value={settings.githubToken ?? ""}
            onChange={(v) => update({ githubToken: v })}
            placeholder="ghp_..."
          />
        </Grid>
        <p className="text-xs text-muted-foreground">
          O token é armazenado localmente neste navegador.
        </p>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={() => toast.success("Configurações salvas")}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold hover:glow-neon"
        >
          Salvar
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
  type = "text",
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
