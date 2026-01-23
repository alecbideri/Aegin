import { redirect } from "next/navigation";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/actions/role.actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role check
  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar w-64 bg-gray-900 text-white min-h-screen p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-emerald-400">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Dashboard
          </a>
          <a href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            User Management
          </a>
          <a href="/admin/content" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Content
          </a>
          <a href="/admin/analytics" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Analytics
          </a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Settings
          </a>
        </nav>
      </aside>
      <main className="admin-content flex-1 p-8 bg-gray-950">
        {children}
      </main>
    </div>
  );
}
