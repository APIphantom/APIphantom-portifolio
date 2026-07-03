import { createClient } from "@supabase/supabase-js";

// Valores públicos (anon/publishable) — seguros para o bundle do browser.
// RLS no Supabase é o que protege os dados.
const SUPABASE_URL = "https://dsmufcyqtdnhusosvsfs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9bDCy2kWzC_lOCPazwittg_HXOunewG";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "adriano.auth",
  },
});

export const SUPABASE_PUBLIC = { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
