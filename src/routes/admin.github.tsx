import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Github,
  Search,
  Download,
  Star,
  GitFork,
  Loader2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useSettings, useProjects, slugify } from "@/lib/projects-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/github")({
  component: GitHubImportPage,
});

type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  private: boolean;
  default_branch: string;
};

function GitHubImportPage() {
  const { settings, update } = useSettings();
  const { addProject } = useProjects();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Repo | null>(null);
  const [readme, setReadme] = useState<string>("");

  const headers = (): HeadersInit =>
    settings.githubToken
      ? { Authorization: `Bearer ${settings.githubToken}`, Accept: "application/vnd.github+json" }
      : { Accept: "application/vnd.github+json" };

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const url = settings.githubToken
        ? "https://api.github.com/user/repos?sort=updated&per_page=100"
        : `https://api.github.com/users/${settings.githubUsername}/repos?sort=updated&per_page=100`;
      const r = await fetch(url, { headers: headers() });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setRepos(data);
      toast.success(`${data.length} repositórios carregados`);
    } catch (e) {
      toast.error("Falha ao buscar repositórios. Verifique token/usuário.");
    } finally {
      setLoading(false);
    }
  };

  const loadReadme = async (repo: Repo) => {
    setSelected(repo);
    setReadme("");
    try {
      const r = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
        headers: headers(),
      });
      if (r.ok) {
        const j = await r.json();
        setReadme(atob(j.content.replace(/\n/g, "")));
      }
    } catch {}
  };

  const importRepo = async (repo: Repo) => {
    let topics = repo.topics ?? [];
    if (topics.length === 0 && repo.language) topics = [repo.language];
    addProject({
      title: repo.name.replace(/-/g, " ").toUpperCase(),
      slug: slugify(repo.name),
      description: repo.description ?? "",
      longDescription: readme.slice(0, 800),
      image: "",
      tech: topics.length ? topics : repo.language ? [repo.language] : [],
      category: "web",
      github: repo.html_url,
      demo: repo.homepage ?? "",
      publication: { status: "draft", visibility: "public" },
    });
    toast.success(`"${repo.name}" importado como rascunho`);
    setSelected(null);
  };

  const filtered = repos.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header>
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
          // GitHub Import
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Importar projetos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Conecte o GitHub e transforme repositórios em drafts automaticamente.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl p-5 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="GitHub Username"
            value={settings.githubUsername ?? ""}
            onChange={(v) => update({ githubUsername: v })}
            placeholder="adriano"
          />
          <Input
            label="Personal Access Token (opcional p/ privados)"
            value={settings.githubToken ?? ""}
            onChange={(v) => update({ githubToken: v })}
            placeholder="ghp_..."
            type="password"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRepos}
            disabled={loading || (!settings.githubUsername && !settings.githubToken)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow disabled:opacity-40"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Github className="size-4" />}{" "}
            Buscar repositórios
          </button>
          {!settings.githubToken && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <AlertCircle className="size-3" /> Sem token, apenas repos públicos
            </div>
          )}
        </div>
      </div>

      {repos.length > 0 && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar repositório..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card/40 border border-border text-sm focus:border-primary outline-none"
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
            <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl divide-y divide-border max-h-[600px] overflow-y-auto">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => loadReadme(r)}
                  className={`w-full text-left p-4 hover:bg-muted/10 transition-colors ${selected?.id === r.id ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold truncate">{r.name}</div>
                    {r.private && (
                      <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-border">
                        privado
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {r.description ?? "Sem descrição."}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    {r.language && <span>● {r.language}</span>}
                    <span className="flex items-center gap-1">
                      <Star className="size-3" /> {r.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="size-3" /> {r.forks_count}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl p-5 space-y-3 max-h-[600px] overflow-y-auto">
              {selected ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-xl">{selected.name}</div>
                      <a
                        href={selected.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary inline-flex items-center gap-1 mt-1"
                      >
                        {selected.full_name} <ExternalLink className="size-3" />
                      </a>
                    </div>
                    <button
                      onClick={() => importRepo(selected)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon"
                    >
                      <Download className="size-3" /> Importar
                    </button>
                  </div>
                  {selected.description && (
                    <p className="text-sm text-muted-foreground">{selected.description}</p>
                  )}
                  {selected.topics && selected.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selected.topics.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-3 border-t border-border">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      README
                    </div>
                    <pre className="text-xs whitespace-pre-wrap text-muted-foreground font-mono leading-relaxed max-h-80 overflow-y-auto">
                      {readme || "Sem README disponível."}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-20">
                  Selecione um repositório à esquerda
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
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
