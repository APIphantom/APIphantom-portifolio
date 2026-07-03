import { createFileRoute } from "@tanstack/react-router";
import { listProjects } from "@/lib/portfolio.functions";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; changefreq: string; priority: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/#sobre", changefreq: "monthly", priority: "0.8" },
          { path: "/#skills", changefreq: "monthly", priority: "0.8" },
          { path: "/#projetos", changefreq: "weekly", priority: "0.9" },
          { path: "/#contato", changefreq: "monthly", priority: "0.7" },
        ];

        try {
          const projects = await listProjects();
          for (const p of projects) {
            const pub: any = (p as any).publication;
            if (pub?.visibility === "public" || pub?.status === "published") {
              entries.push({ path: `/projeto/${p.slug}`, changefreq: "monthly", priority: "0.7" });
            }
          }
        } catch {
          /* ignore — sitemap não pode quebrar */
        }

        const urls = entries.map(
          (e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
