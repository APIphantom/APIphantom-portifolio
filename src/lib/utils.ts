import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeHref(value?: string | null) {
  const href = value?.trim();
  if (!href || href.includes('\\')) return undefined;
  for (const character of href) {
    const code = character.charCodeAt(0);
    if (code < 32 || code === 127) return undefined;
  }
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^(?:\/[^/]|\/|#|\.\.?\/)/.test(href)) return href;
  return undefined;
}
