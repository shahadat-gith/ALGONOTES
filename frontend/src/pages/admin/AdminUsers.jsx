import { useCallback, useEffect, useState } from "react";
import { Search, Mail, User, Calendar, FileText, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import adminApi from "../../api/adminApi";
import Input from "../../components/common/Input";
import Pagination from "../../components/common/Pagination";
import Glow from "../../components/common/Glow";
import { formatDistanceToNow } from "date-fns";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers(page, pageSize, search);
      if (data?.success) {
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired.");
        return;
      }
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6 relative">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage registered users — <span className="font-semibold text-text-main">{total}</span> total.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light pointer-events-none">
          <Search size={14} />
        </div>
        <Input
          name="search"
          type="text"
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 text-sm h-10 bg-bg-base rounded-lg w-full"
        />
      </div>

      {/* Users Table */}
      <div className="bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-soft/50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Email</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Notes</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Theories</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={20} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted text-xs">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-soft border border-border-default flex items-center justify-center shrink-0 overflow-hidden">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} className="text-text-light" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-text-main text-sm">{u.name}</p>
                          {u.username && (
                            <p className="text-xs text-text-light">@{u.username}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Mail size={12} />
                        <span className="text-xs">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-text-muted">
                        <FileText size={12} />
                        <span className="text-xs font-semibold">{u.total_notes}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-text-muted">
                        <BookOpen size={12} />
                        <span className="text-xs font-semibold">{u.total_theories}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-text-light">
                        <Calendar size={11} />
                        <span className="text-xs">{formatDate(u.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-default bg-bg-soft/30">
            <span className="text-xs text-text-light">
              Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
            </span>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
