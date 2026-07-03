import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC } from "./client";

/**
 * Middleware de server function que exige usuário autenticado.
 * Injeta { supabase, userId, claims } no context. RLS aplica-se como o usuário.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const authHeader = getRequestHeader("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Response("Unauthorized: No authorization header provided", { status: 401 });
    }
    const token = authHeader.slice("Bearer ".length);

    const supabase = createClient(SUPABASE_PUBLIC.url, SUPABASE_PUBLIC.key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new Response("Unauthorized", { status: 401 });
    }

    return next({ context: { supabase, userId: data.user.id, user: data.user } });
  },
);

/**
 * Exige que o usuário autenticado tenha role 'admin' na tabela user_roles.
 */
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || data !== true) {
      throw new Response("Forbidden", { status: 403 });
    }
    return next();
  });
