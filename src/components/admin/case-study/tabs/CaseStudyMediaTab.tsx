import { useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectMedia } from '@/components/ProjectMedia';
import { useMedia, useProjectMedia } from '@/lib/projects-store';
import type {
  CaseStudyV2,
  MediaSectionConfig,
  GalleryMediaItem,
  MediaLayout,
} from '@/lib/case-study';
import { moveItem, uid, MEDIA_LAYOUTS } from '@/lib/case-study';
import { detectMediaKind } from '@/lib/project-media';

interface CaseStudyMediaTabProps {
  caseStudy: CaseStudyV2;
  projectId: string;
  onUpdate: (updates: Partial<CaseStudyV2>) => void;
}

function isMediaLayout(value: string): value is MediaLayout {
  return MEDIA_LAYOUTS.some((layout) => layout.value === value);
}

export function CaseStudyMediaTab({ caseStudy, projectId, onUpdate }: CaseStudyMediaTabProps) {
  const media = caseStudy.media;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { items: projectMedia, loading } = useProjectMedia(projectId);
  const { addAsync, uploading } = useMedia({ includeLibrary: false });

  const updateMedia = (updates: Partial<MediaSectionConfig>) => {
    onUpdate({ media: { ...media, ...updates } });
  };

  const updateItem = (index: number, updates: Partial<GalleryMediaItem>) => {
    const newItems = [...media.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateMedia({ items: newItems });
  };

  const addItem = () => {
    updateMedia({
      items: [
        ...media.items,
        {
          id: uid(),
          url: '',
          title: '',
          description: '',
          caption: '',
          alt: '',
          layout: 'landscape',
          featured: false,
          sortOrder: media.items.length,
          isVisible: true,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    updateMedia({
      items: media.items
        .filter((_, i) => i !== index)
        .map((item, sortOrder) => ({ ...item, sortOrder })),
    });
  };

  const moveMediaItem = (index: number, offset: number) => {
    const reordered = moveItem(media.items, index, index + offset);
    updateMedia({ items: reordered.map((item, sortOrder) => ({ ...item, sortOrder })) });
  };

  const attachMedia = (asset: (typeof projectMedia)[number]) => {
    if (media.items.some((item) => item.mediaId === asset.id)) return;

    updateMedia({
      items: [
        ...media.items,
        {
          id: uid(),
          mediaId: asset.id,
          url: asset.url,
          kind: asset.type,
          title: '',
          description: '',
          caption: asset.caption ?? '',
          alt: asset.alt ?? '',
          layout: 'landscape',
          featured: false,
          sortOrder: media.items.length,
          isVisible: true,
        },
      ],
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const nextItems = [...media.items];
    let uploadedCount = 0;
    for (const file of files) {
      try {
        const asset = await addAsync({
          name: file.name,
          type: file.type,
          size: file.size,
          file,
          projectId,
          category: 'gallery',
          sortOrder: projectMedia.length + uploadedCount,
        });
        nextItems.push({
          id: uid(),
          mediaId: asset.id,
          url: asset.url,
          kind: asset.type,
          title: '',
          description: '',
          caption: asset.caption ?? '',
          alt: asset.alt ?? '',
          layout: 'landscape',
          featured: false,
          sortOrder: nextItems.length,
          isVisible: true,
        });
        uploadedCount += 1;
        toast.success(`Arquivo ${file.name} enviado.`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Falha ao enviar ${file.name}.`);
      }
    }

    if (uploadedCount) updateMedia({ items: nextItems });
    event.target.value = '';
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold mb-6">Galeria de Mídias</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Organize as imagens, vídeos e screenshots do projeto.
        </p>
        <p className="-mt-4 mb-6 max-w-2xl rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Para mostrar o projeto funcionando, envie o vídeo ou adicione uma URL de vídeo e marque
          <span className="font-semibold text-primary"> “Vídeo de demonstração”</span>. Ele será
          apresentado em um player próprio, antes da galeria.
        </p>
      </div>

      {/* Section Title */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Eyebrow</label>
          <input
            type="text"
            value={media.eyebrow || ''}
            onChange={(e) => updateMedia({ eyebrow: e.target.value })}
            placeholder="ex: 03 — MÍDIA"
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Título da Seção</label>
          <input
            type="text"
            value={media.title || ''}
            onChange={(e) => updateMedia({ title: e.target.value })}
            placeholder="ex: Galeria de mídias."
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Contexto da galeria</label>
          <textarea
            value={media.description || ''}
            onChange={(event) => updateMedia({ description: event.target.value })}
            placeholder="Apresente as telas e materiais que serão mostrados na galeria."
            rows={2}
            spellCheck
            className="w-full resize-y rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            A primeira mídia aparece como desktop e a segunda como mobile. Título e legenda da
            terceira em diante podem aparecer sobre as imagens.
          </p>
        </div>
      </div>

      {/* Media Items */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Mídias</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:glow-neon text-xs font-semibold uppercase transition-all disabled:opacity-50"
            >
              <UploadCloud className="size-4" /> {uploading ? 'Enviando…' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-primary text-xs font-semibold uppercase transition-all"
            >
              <Plus className="size-4" /> URL externa
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-border p-4">
          <h4 className="mb-3 text-sm font-semibold">Arquivos vinculados ao projeto</h4>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando mídias…</p>
          ) : projectMedia.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum arquivo vinculado encontrado.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {projectMedia.map((asset) => {
                const attached = media.items.some((item) => item.mediaId === asset.id);
                return (
                  <div
                    key={asset.id}
                    className="flex min-w-0 items-center gap-3 rounded border border-border p-2"
                  >
                    <ProjectMedia
                      src={asset.url}
                      alt={asset.alt ?? asset.name}
                      mediaType={asset.type}
                      mimeType={asset.mimeType}
                      className="size-12 shrink-0 rounded object-cover"
                      videoOptions={{ muted: true, controls: false, preload: 'metadata' }}
                    />
                    <span className="min-w-0 flex-1 truncate text-xs">{asset.name}</span>
                    <button
                      type="button"
                      disabled={attached}
                      onClick={() => attachMedia(asset)}
                      className="shrink-0 rounded border border-border px-2 py-1 text-xs hover:border-primary disabled:opacity-50"
                    >
                      {attached ? 'Adicionada' : 'Adicionar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {media.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 flex-col pt-1">
                  <button
                    type="button"
                    aria-label="Mover mídia para cima"
                    disabled={idx === 0}
                    onClick={() => moveMediaItem(idx, -1)}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Mover mídia para baixo"
                    disabled={idx === media.items.length - 1}
                    onClick={() => moveMediaItem(idx, 1)}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => updateItem(idx, { url: e.target.value, mediaId: undefined })}
                    placeholder="URL da mídia"
                    className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors mb-2"
                  />

                  {item.url && (
                    <div className="relative mb-2 h-40 overflow-hidden rounded-lg border border-border">
                      <ProjectMedia
                        src={item.url}
                        alt={item.alt || item.title || 'Mídia do projeto'}
                        mediaType={item.kind}
                        className="h-full w-full object-cover"
                        fit="cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateItem(idx, { title: e.target.value })}
                      placeholder={idx >= 2 ? 'Título sobre a imagem' : 'Título da mídia'}
                      className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                    />

                    <textarea
                      value={item.description || ''}
                      onChange={(e) => updateItem(idx, { description: e.target.value })}
                      placeholder="Descrição"
                      rows={2}
                      className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors resize-none"
                    />

                    <input
                      type="text"
                      value={item.alt || ''}
                      onChange={(e) => updateItem(idx, { alt: e.target.value })}
                      placeholder="Texto alternativo (acessibilidade)"
                      className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                    />

                    <input
                      type="text"
                      value={item.caption || ''}
                      onChange={(e) => updateItem(idx, { caption: e.target.value })}
                      placeholder={idx >= 2 ? 'Complemento sobre a imagem (opcional)' : 'Legenda'}
                      className="w-full px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors"
                    />

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <select
                        value={idx === 0 ? 'desktop' : idx === 1 ? 'mobile' : item.layout}
                        disabled={idx < 2}
                        aria-label={`Formato da mídia ${idx + 1}`}
                        onChange={(e) => {
                          if (isMediaLayout(e.target.value)) {
                            updateItem(idx, { layout: e.target.value });
                          }
                        }}
                        className="px-3 py-2 rounded bg-card border border-border text-sm focus:border-primary outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {MEDIA_LAYOUTS.map((layout) => (
                          <option key={layout.value} value={layout.value}>
                            {layout.label}
                          </option>
                        ))}
                      </select>

                      <label className="flex items-center gap-2 text-sm bg-card rounded border border-border px-3 py-2">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={(e) => {
                            const isVideo =
                              detectMediaKind({ src: item.url, mediaType: item.kind }) === 'video';
                            if (isVideo && e.target.checked) {
                              updateMedia({
                                items: media.items.map((candidate, candidateIndex) => {
                                  const candidateIsVideo =
                                    detectMediaKind({
                                      src: candidate.url,
                                      mediaType: candidate.kind,
                                    }) === 'video';
                                  return candidateIsVideo
                                    ? { ...candidate, featured: candidateIndex === idx }
                                    : candidate;
                                }),
                              });
                              return;
                            }
                            updateItem(idx, { featured: e.target.checked });
                          }}
                          className="rounded"
                        />
                        {detectMediaKind({ src: item.url, mediaType: item.kind }) === 'video'
                          ? 'Vídeo de demonstração'
                          : 'Destaque'}
                      </label>
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.isVisible}
                        onChange={(e) => updateItem(idx, { isVisible: e.target.checked })}
                        className="rounded"
                      />
                      Visível
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}

          {media.items.length === 0 && (
            <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
              Nenhuma mídia adicionada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
