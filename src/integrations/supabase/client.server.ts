import { createClient } from "@supabase/supabase-js";

const url = "https://dsmufcyqtdnhusosvsfs.supabase.co";
const serviceKey = process.env.MY_SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  // Mensagem clara em runtime caso a secret não esteja configurada
  console.warn(
    "[supabase.server] MY_SUPABASE_SERVICE_ROLE_KEY ausente — server functions admin irão falhar.",
  );
}

export const supabaseAdmin = createClient(url, serviceKey ?? "missing-service-role", {
  auth: { persistSession: false, autoRefreshToken: false },
});
