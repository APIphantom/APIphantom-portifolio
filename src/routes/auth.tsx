import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
  reason: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Acesso restrito — Adriano" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootCheck, setBootCheck] = useState(true);

  // Se já estiver logado E for admin, manda direto para o admin
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: data.user.id,
          _role: "admin",
        });
        if (isAdmin === true) {
          navigate({ to: search.redirect || "/admin", replace: true });
          return;
        }
      }
      setBootCheck(false);
    })();
  }, [navigate, search.redirect]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      toast.error(error?.message || "Não foi possível entrar.");
      setLoading(false);
      return;
    }
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (isAdmin !== true) {
      await supabase.auth.signOut();
      toast.error("Esta conta não tem acesso administrativo.");
      setLoading(false);
      return;
    }
    toast.success("Bem-vindo de volta, Adriano.");
    navigate({ to: search.redirect || "/admin", replace: true });
  };

  if (bootCheck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_50%)] pointer-events-none" />

      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Voltar ao site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/40 backdrop-blur text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
            <Lock className="size-3" /> Acesso restrito
          </div>
          <h1 className="text-3xl font-black tracking-tight">Workspace</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Apenas Adriano tem acesso ao painel administrativo.
          </p>
        </div>

        {search.reason === "forbidden" && (
          <div className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-xs flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>Sua conta foi reconhecida, mas não possui permissão de administrador.</span>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="space-y-4 p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
        >
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs hover:glow-neon transition-shadow disabled:opacity-50"
          >
            {loading ? (
              <div className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              <>
                <LogIn className="size-4" /> Entrar
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center mt-6">
          Sem cadastro público · Acesso somente para o proprietário
        </p>
      </motion.div>
    </div>
  );
}
