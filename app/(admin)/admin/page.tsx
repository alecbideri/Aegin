import { getCurrentUser } from "@/lib/actions/role.actions";
import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";

export default async function AdminDashboard() {
  const currentUser = await getCurrentUser();
  const users = await getAllUsersForNewsEmail();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, <span className="text-emerald-400">{currentUser?.name}</span>
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white mt-2">{users?.length || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Premium Users</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">0</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Articles Published</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Active Alerts</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/users"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            Manage Users
          </a>
          <a
            href="/admin/content"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Manage Content
          </a>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Trigger Daily Digest
          </button>
        </div>
      </section>

      {/* Recent Users */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Users</h2>
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-sm text-gray-300">Role</th>
                <th className="px-6 py-3 text-left text-sm text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users?.slice(0, 5).map((user, index) => (
                <tr key={index} className="hover:bg-gray-750">
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                      user
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/admin/users?id=${user.id}`}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
