import { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import { BRAND_OPTIONS } from '@/lib/technology-catalog';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const SLUG_ALIASES: Record<string, string> = {
  css3: 'css',
  framemotion: 'framer',
  framermotion: 'framer',
  html: 'html5',
  js: 'javascript',
  next: 'nextdotjs',
  nextjs: 'nextdotjs',
  node: 'nodedotjs',
  nodejs: 'nodedotjs',
  reactjs: 'react',
  tailwind: 'tailwindcss',
  ts: 'typescript',
};

function getBrandSlug(icon?: string, name?: string) {
  const knownSlugs = new Set<string>(BRAND_OPTIONS.map(({ slug }) => slug));
  for (const candidate of [icon, name]) {
    if (!candidate?.trim()) continue;
    const normalized = normalize(candidate);
    const slug = SLUG_ALIASES[normalized] ?? normalized;
    if (knownSlugs.has(slug)) return slug;
  }
  return undefined;
}

export function TechnologyBrandIcon({
  name,
  icon,
  className = 'size-6',
}: {
  name: string;
  icon?: string;
  className?: string;
}) {
  const slug = getBrandSlug(icon, name);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [slug]);

  if (!slug || failed) return <Code2 className={className} aria-hidden="true" />;

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}${slug === 'nextdotjs' ? '/FFFFFF' : ''}`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`${className} object-contain`}
      onError={() => setFailed(true)}
    />
  );
}

export { BRAND_OPTIONS };
