import { useEffect, useState } from 'react';

type Item = { id: string; n: string; label: string };

export function CaseStudySidebar({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    if (!items.length) return;
    const lastItemId = items[items.length - 1]?.id;
    const syncPageEnd = () => {
      const atPageEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (atPageEnd && lastItemId) setActive(lastItemId);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const atPageEnd =
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        if (atPageEnd && lastItemId) {
          setActive(lastItemId);
          return;
        }
        const top = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target?.id) setActive(top.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0.15, 0.4] },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    window.addEventListener('scroll', syncPageEnd, { passive: true });
    syncPageEnd();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', syncPageEnd);
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <>
      <aside
        className="fixed left-6 top-1/2 z-40 hidden w-40 -translate-y-1/2 2xl:block"
        aria-label="Seções do case"
      >
        <nav className="flex flex-col gap-3">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.n} {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <nav
        className="sticky top-16 z-30 overflow-x-auto border-b border-border bg-background/95 backdrop-blur 2xl:hidden"
        aria-label="Seções do case"
      >
        <div className="flex min-w-max gap-2 px-4 py-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] ${
                active === item.id
                  ? 'border-primary/40 text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {item.n} {item.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
