import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../../api/endpoints.js";
import { formatDate } from "../../utils/helpers.js";
import Loader from "../../components/ui/Loader.jsx";
import toast from "react-hot-toast";

const AdminCustomers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef(null);

  // Debounce search input — only query after user stops typing for 300ms
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch],
    queryFn: () =>
      userAPI
        .getAll({ page, search: debouncedSearch, limit: 20 })
        .then((r) => r.data),
  });
  const users = data?.data || [];
  const pagination = data?.pagination || {};

  const toggleBlock = async (id, isBlocked) => {
    try {
      isBlocked ? await userAPI.unblock(id) : await userAPI.block(id);
      toast.success(isBlocked ? "Unblocked" : "Blocked");
    } catch (_) {
      toast.error("Failed");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await userAPI.delete(id);
      toast.success("Deleted");
    } catch (_) {
      toast.error("Failed");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage your customers
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input sm:w-72"
        />
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="truncate">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">
                    <span className="text-sm">{u.email}</span>
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">
                    {u.phone || (
                      <span className="text-gray-400 dark:text-gray-600">
                        —
                      </span>
                    )}
                  </td>
                  <td className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {formatDate(u.createdAt)}
                  </td>
                  <td>
                    <span
                      className={
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium " +
                        (u.isBlocked
                          ? "admin-badge-danger"
                          : "admin-badge-success")
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.isBlocked ? "bg-red-500" : "bg-green-500"
                        }`}
                      />
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleBlock(u._id, u.isBlocked)}
                        className={
                          "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all " +
                          (u.isBlocked
                            ? "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400")
                        }
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty-state">
                      <div className="admin-empty-state-icon">
                        <Users size={28} className="text-gray-400" />
                      </div>
                      <p className="admin-empty-state-text">
                        No customers found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.pages > 1 && (
        <div className="admin-pagination">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={
                page === i + 1
                  ? "admin-pagination-active"
                  : "admin-pagination-btn"
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
