import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users as UsersIcon, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import { useTheme } from "../context/ThemeContext";
import { PageWrapper } from "../components/PageWrapper";
import clsx from "clsx";

export default function AdminUsersPage({ user }) {
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load users";
      toast.error(errorMsg);
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const res = await API.put(`/users/${userId}`, { role: newRole });
      setUsers(users.map(u => (u._id === userId ? res.data.user : u)));
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update user role";
      toast.error(errorMsg);
      console.error(err);
      // Reload users on failure to ensure consistency
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={clsx(
        "min-h-screen py-12 px-4",
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      )}>
        <div className="text-center">
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className={clsx(
        "space-y-6",
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      )}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className={clsx("text-3xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
            <UsersIcon size={32} />
            User Management
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Manage and monitor user accounts
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={clsx(
            "rounded-lg p-6 border",
            isDark
              ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
              Total Users
            </p>
            <p className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              {users.length}
            </p>
          </div>
          <div>
            <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
              Admin Accounts
            </p>
            <p className={clsx("text-3xl font-bold text-blue-600", isDark ? "text-blue-400" : "text-blue-600")}>
              {users.filter(u => u.role === "admin").length}
            </p>
          </div>
          <div>
            <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
              Student Accounts
            </p>
            <p className={clsx("text-3xl font-bold text-green-600", isDark ? "text-green-400" : "text-green-600")}>
              {users.filter(u => u.role === "student").length}
            </p>
          </div>
        </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={clsx(
            "rounded-lg p-6 border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          )}>
          <div className="relative">
            <Search className={clsx("absolute left-3 top-3", isDark ? "text-slate-500" : "text-slate-400")} size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={clsx(
                "w-full px-4 py-2.5 pl-10 rounded-lg border-2 transition-all",
                isDark
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
              )}
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={clsx(
            "rounded-lg overflow-hidden border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          )}>
        <table className="w-full">
          <thead className={clsx(
            isDark ? "bg-slate-700" : "bg-slate-100"
          )}>
            <tr>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Name
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Email
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Role
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Joined
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={clsx("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
            {filteredUsers.map((u, idx) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ backgroundColor: isDark ? "rgba(71, 85, 105, 0.5)" : "rgba(100, 200, 220, 0.1)" }}
                className={isDark ? "hover:bg-slate-700" : "hover:bg-slate-50"}
              >
                <td className={clsx("px-6 py-4 font-medium", isDark ? "text-white" : "text-slate-900")}>
                  {u.name}
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {u.email}
                </td>
                <td className="px-6 py-4">
                  {u.email === "admin@gmail.com" ? (
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-sm font-semibold",
                      isDark
                        ? "bg-red-900 text-red-200"
                        : "bg-red-100 text-red-900"
                    )}>
                      🔒 ADMIN (LOCKED)
                    </span>
                  ) : u._id === currentUser?._id ? (
                    <span className={clsx(
                      "px-3 py-1 rounded-lg text-sm font-semibold capitalize",
                      u.role === "staff"
                        ? isDark
                          ? "bg-orange-900 text-orange-200"
                          : "bg-orange-100 text-orange-900"
                        : isDark
                        ? "bg-green-900 text-green-200"
                        : "bg-green-100 text-green-900"
                    )}>
                      {u.role} <span className="text-xs">(you)</span>
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className={clsx(
                        "px-3 py-1 rounded-lg text-sm font-semibold border-2 cursor-pointer transition-all",
                        u.role === "staff"
                          ? isDark
                            ? "bg-orange-900 border-orange-700 text-orange-200"
                            : "bg-orange-100 border-orange-300 text-orange-900"
                          : isDark
                          ? "bg-green-900 border-green-700 text-green-200"
                          : "bg-green-100 border-green-300 text-green-900"
                      )}
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                  )}
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {u.email !== "admin@gmail.com" && u.role !== "superadmin" && u._id !== currentUser?._id && (
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteUser(u._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className={clsx(
            "text-center py-12",
            isDark ? "bg-slate-700" : "bg-slate-50"
          )}>
            <p className={isDark ? "text-slate-300" : "text-slate-600"}>No users found</p>
          </div>
        )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
