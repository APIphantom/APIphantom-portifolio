import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

/**
 * Anexa automaticamente o Bearer token a cada chamada de server function
 * vinda do browser. Sem isso, requireSupabaseAuth rejeita com 401.
 */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        return next({ headers: { Authorization: `Bearer ${token}` } });
      }
    } catch {
      /* sem sessão — segue sem header */
    }
    return next();
  },
);
