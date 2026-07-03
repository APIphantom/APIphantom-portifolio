import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar, AdminMobileBar } from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Adriano // Workspace" }, { name: "robots", content: "noindex" }],
  }),
  beforeLoad: async ({ location }) => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleErr || isAdmin !== true) {
      throw redirect({ to: "/auth", search: { redirect: location.href, reason: "forbidden" } });
    }
    return { user: userData.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <AdminMobileBar />
    </div>
  );
}
