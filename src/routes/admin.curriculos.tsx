import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { UploadCloud, FileText, Copy, CheckCircle2, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useMedia, useSettings } from "@/lib/projects-store";

export const Route = createFileRoute("/admin/curriculos")({
  component: CurriculosPage,
});

function CurriculosPage() {
  const { items, add, remove, uploading } = useMedia();
  const { settings, update } = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busyUrl, setBusyUrl] = useState<string | null>(null);

  const curriculos = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.mimeType === "application/pdf" ||
            item.folder === "curriculos" ||
            item.name.toLowerCase().endsWith(".pdf"),
        )
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")),
    [items],
  );

  const activeCvUrl = settings.cvUrl || "/cv-adriano-oliveira.pdf";

  const handleFiles = (files: FileList) => {
    const pdfs = Array.from(files).filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    );

    if (pdfs.length === 0) {
      toast.error("Selecione ao menos um PDF.");
      return;
    }

    pdfs.forEach((file, index) => {
      add({
        name: file.name,
        url: "",
        type: file.type || "application/pdf",
        size: file.size,
        file,
        folder: "curriculos",
      });

      if (index === 0) {
        toast.success("Currículo enviado. Após o upload, selecione-o como ativo na lista.");
      }
    });
  };

  const setAsActive = (url: string) => {
    setBusyUrl(url);
    update({ cvUrl: url });
    toast.success("Currículo ativo atualizado.");
    setBusyUrl(null);
  };

  const removeCv = (id: string, url: string) => {
    if (url === activeCvUrl) {
      toast.error("Defina outro currículo como ativo antes de excluir este arquivo.");
      return;
    }
    remove(id);
    toast.success("Currículo removido.");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            // Currículos
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
            Gerenciar currículos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Envie novos PDFs, mantenha versões antigas e escolha qual arquivo será usado no botão
            "Download CV".
          </p>
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
        >
          <UploadCloud className="size-4" />
          {uploading ? "Enviando..." : "Enviar PDF"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </header>

      <section className="rounded-2xl border border-border bg-card/30 backdrop-blur-xl p-6 space-y-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Currículo ativo
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="font-bold text-foreground truncate">{activeCvUrl}</div>
            <div className="text-sm text-muted-foreground">
              Este é o arquivo aberto pelo botão "Download CV" no site.
            </div>
          </div>
          <a
            href={activeCvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
          >
            <ExternalLink className="size-3.5" /> Abrir atual
          </a>
        </div>
      </section>

      <div className="grid gap-4">
        {curriculos.map((item) => {
          const isActive = item.url === activeCvUrl;
          const isBusy = busyUrl === item.url;

          return (
            <article
              key={item.id}
              className={`rounded-2xl border p-5 bg-card/30 backdrop-blur-xl transition-colors ${
                isActive ? "border-primary/50" : "border-border"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex items-start gap-4">
                  <div className="size-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold truncate">{item.name}</h2>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                          <CheckCircle2 className="size-3" /> Ativo
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(item.fileSize / 1024).toFixed(1)} KB
                      {item.createdAt ? ` · ${new Date(item.createdAt).toLocaleDateString("pt-BR")}` : ""}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground truncate">{item.url}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isActive || isBusy}
                    onClick={() => setAsActive(item.url)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest disabled:opacity-60"
                  >
                    <CheckCircle2 className="size-3.5" />
                    {isActive ? "Em uso" : isBusy ? "Salvando..." : "Usar este"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      toast.success("URL copiada.");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                  >
                    <Copy className="size-3.5" /> Copiar URL
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCv(item.id, item.url)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold uppercase tracking-widest hover:border-destructive hover:text-destructive transition-colors"
                  >
                    <Trash2 className="size-3.5" /> Excluir
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {curriculos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhum currículo enviado ainda. Use "Enviar PDF" para adicionar a primeira versão.
          </div>
        )}
      </div>
    </div>
  );
}