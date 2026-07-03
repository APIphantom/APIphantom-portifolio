import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  FolderKanban,
  Image as ImageIcon,
  Cpu,
  Github,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Milestone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const items = [
  { to: "/admin", label: "Início", icon: LayoutGrid, exact: true },
  { to: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/admin/storyline", label: "Storyline", icon: Milestone },
  { to: "/admin/midias", label: "Mídias", icon: ImageIcon },
  { to: "/admin/curriculos", label: "Currículos", icon: FileText },
  { to: "/admin/tecnologias", label: "Tecnologias", icon: Cpu },
  { to: "/admin/github", label: "GitHub Import", icon: Github },
];

const footerItems = [{ to: "/admin/configuracoes", label: "Configurações", icon: SettingsIcon }];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const handleLogout = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl sticky top-0 h-screen">
      <div className="px-5 py-6 border-b border-border/60">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-black text-sm group-hover:glow-neon transition-shadow">
            S
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black tracking-tight text-sm">ADRIANO DEV</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              Workspace
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              data-cursor="hover"
              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-primary"
                  transition={{ type: "spring", damping: 24, stiffness: 320 }}
                />
              )}
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-border/60 space-y-0.5">
        {footerItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              data-cursor="hover"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          to="/"
          data-cursor="hover"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all"
        >
          <ExternalLink className="size-4" />
          <span>Ver site</span>
        </Link>
        <button
          onClick={handleLogout}
          data-cursor="hover"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export function AdminMobileBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const all = [...items, ...footerItems];
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border/60">
      <div className="flex items-center justify-around px-2 py-2">
        {all.slice(0, 5).map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-[10px] ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="size-4" />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
