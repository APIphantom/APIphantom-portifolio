import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, Search, Trash2, Copy, X } from "lucide-react";
import { useMedia } from "@/lib/projects-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/midias")({
  component: MidiasPage,
});

function MidiasPage() {
  const { items, addAsync, remove, uploading } = useMedia();
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<
    Array<{
      id: string;
      name: string;
      size: number;
      file: File;
      progress: number;
      status: "queued" | "uploading" | "done" | "error" | "canceled";
      error?: string;
    }>
  >([]);

  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
  ]);
  const maxFileSize = 120 * 1024 * 1024;

  useEffect(() => {
    const next = tasks.find((t) => t.status === "queued");
    const running = tasks.some((t) => t.status === "uploading");
    if (!next || running) return;

    let progressTimer: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      setTasks((prev) =>
        prev.map((t) => (t.id === next.id ? { ...t, status: "uploading", progress: 5 } : t)),
      );

      progressTimer = setInterval(() => {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== next.id || t.status !== "uploading") return t;
            return { ...t, progress: Math.min(90, t.progress + 7) };
          }),
        );
      }, 200);

      try {
        await addAsync({
          name: next.file.name,
          url: "",
          type: next.file.type,
          size: next.file.size,
          file: next.file,
          category: "misc",
        });

        setTasks((prev) =>
          prev.map((t) => (t.id === next.id ? { ...t, status: "done", progress: 100 } : t)),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha no upload";
        setTasks((prev) =>
          prev.map((t) =>
            t.id === next.id
              ? {
                  ...t,
                  status: "error",
                  error: message,
                  progress: 0,
                }
              : t,
          ),
        );
        toast.error(`Falha ao enviar ${next.name}`);
      } finally {
        if (progressTimer) clearInterval(progressTimer);
      }
    };

    void run();
  }, [addAsync, tasks]);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((f) => {
      if (!allowed.has(f.type)) {
        toast.error(`Formato nao suportado: ${f.name}`);
        return;
      }
      if (f.size > maxFileSize) {
        toast.error(`Arquivo acima de 120MB: ${f.name}`);
        return;
      }

      const taskId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setTasks((prev) => [
        ...prev,
        {
          id: taskId,
          name: f.name,
          size: f.size,
          file: f,
          progress: 0,
          status: "queued",
        },
      ]);
    });
  };

  const filtered = items.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">// Mídias</div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Biblioteca de mídias</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} arquivos · Supabase Storage{uploading ? " · enviando…" : ""}
          </p>
        </div>
        <button
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:glow-neon transition-shadow"
        >
          <UploadCloud className="size-4" /> Upload
        </button>
        <input
          ref={ref}
          type="file"
          multiple
          accept="image/*,video/*"
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar mídia..."
          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-card/40 border border-border text-sm focus:border-primary outline-none"
        />
      </div>

      {tasks.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/30 p-4 space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Uploads em andamento
          </div>
          <div className="space-y-2">
            {tasks.slice(-8).map((t) => (
              <div key={t.id} className="rounded-lg border border-border p-2.5 bg-background/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {(t.size / 1024 / 1024).toFixed(2)} MB · {t.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.status === "queued" && (
                      <button
                        type="button"
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((x) =>
                              x.id === t.id ? { ...x, status: "canceled", progress: 0 } : x,
                            ),
                          )
                        }
                        className="text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-border hover:text-destructive hover:border-destructive"
                      >
                        Cancelar
                      </button>
                    )}
                    {t.status === "error" && (
                      <button
                        type="button"
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((x) =>
                              x.id === t.id
                                ? { ...x, status: "queued", error: undefined, progress: 0 }
                                : x,
                            ),
                          )
                        }
                        className="text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-border hover:text-primary hover:border-primary"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all ${t.status === "error" ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
                {t.error && <div className="mt-1 text-[10px] text-destructive">{t.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        {filtered.map((m) => (
          <div
            key={m.id}
            className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-card/30"
          >
            {m.type === "image" || m.type === "gif" ? (
              <img
                src={m.url}
                className="w-full h-full object-cover"
                onClick={() => setPreview(m.url)}
              />
            ) : (
              <video src={m.url} className="w-full h-full object-cover" muted controls />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
              <div className="text-[10px] font-bold truncate">{m.name}</div>
              <div className="text-[9px] text-muted-foreground">
                {(m.fileSize / 1024).toFixed(1)} KB · {m.type.toUpperCase()}
              </div>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(m.url);
                    toast.success("URL copiada");
                  }}
                  className="size-6 rounded bg-background/80 flex items-center justify-center hover:text-primary"
                >
                  <Copy className="size-3" />
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="size-6 rounded bg-background/80 flex items-center justify-center hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 border border-dashed border-border rounded-2xl text-sm text-muted-foreground">
            Arraste arquivos aqui ou clique em Upload.
          </div>
        )}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl"
          onClick={() => setPreview(null)}
        >
          <img src={preview} className="max-w-full max-h-full rounded-xl border border-border" />
          <button className="absolute top-4 right-4 size-10 rounded-full border border-border flex items-center justify-center">
            <X />
          </button>
        </div>
      )}
    </div>
  );
}
