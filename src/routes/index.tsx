import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Storyline } from "@/components/Storyline";
import { Skills } from "@/components/Skills";
import { Manifesto } from "@/components/Manifesto";
import { Projects } from "@/components/Projects";
import { Vision } from "@/components/Vision";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adriano Oliveira — Desenvolvedor Front-End Júnior" },
      {
        name: "description",
        content:
          "Portfólio de Adriano Oliveira, Desenvolvedor Front-End Júnior. React, Next.js, TypeScript e Tailwind. Interfaces modernas, responsivas e acessíveis.",
      },
      {
        name: "keywords",
        content:
          "front-end júnior, desenvolvedor react, next.js, typescript, tailwind, portfólio dev, Adriano Oliveira",
      },
      { property: "og:title", content: "Adriano Oliveira — Front-End Júnior" },
      {
        property: "og:description",
        content:
          "Transformo ideias em interfaces modernas, responsivas e acessíveis. Em busca da minha primeira oportunidade em Front-End.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Adriano Oliveira — Front-End Júnior" },
      {
        name: "twitter:description",
        content:
          "React · Next.js · TypeScript · Tailwind — Front-End Júnior em busca de oportunidade.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Adriano Oliveira",
          jobTitle: "Desenvolvedor Front-End Júnior",
          url: "/",
          knowsAbout: [
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript",
            "HTML",
            "CSS",
          ],
          sameAs: ["https://github.com", "https://linkedin.com"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { projects } = useProjects();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Storyline />
        <Skills />
        <Manifesto />
        <Projects projects={projects} />
        <Vision />
        <Contact />
      </main>
      <Footer />
      <Link
        to="/admin"
        data-cursor="hover"
        aria-label="Abrir CMS"
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-primary-foreground glow-neon flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Settings className="size-6 animate-[spin_8s_linear_infinite]" />
      </Link>
    </div>
  );
}
