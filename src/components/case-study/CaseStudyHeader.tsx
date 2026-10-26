import { Link } from '@tanstack/react-router';
import { Download, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useSettings } from '@/lib/projects-store';

const links = [
  { href: '/', label: 'Início', hash: false },
  { href: '/#projetos', label: 'Projetos', hash: true, active: true },
  { href: '/#sobre', label: 'Sobre', hash: true },
  { href: '/#contato', label: 'Contato', hash: true },
];

export function CaseStudyHeader() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const initials = (settings.name || 'Adriano Oliveira')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const cvHref = settings.cvUrl || '/cv-adriano-oliveira.pdf';
  const externalCv = /^https?:\/\//i.test(cvHref);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="Início">
          <span className="font-black tracking-tight text-[#FFD600]">{initials || 'AO'}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm transition-colors ${
                link.active
                  ? 'text-white underline decoration-[#FFD600] decoration-2 underline-offset-8'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={cvHref}
            target={externalCv ? '_blank' : undefined}
            rel={externalCv ? 'noreferrer' : undefined}
            className="hidden items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-200 hover:border-[#FFD600] hover:text-white sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Ver currículo
          </a>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-700 md:hidden"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-300"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href={cvHref} className="text-sm text-[#FFD600]">
              Ver currículo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
