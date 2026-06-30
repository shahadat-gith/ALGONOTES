import { useCallback, useEffect, useState } from "react";
import { FileText, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import adminApi from "../../api/adminApi";
import Pagination from "../../components/common/Pagination";
import Glow from "../../components/common/Glow";
import { format } from "date-fns";

const NOTES_STATUSES = ["", "processing", "draft", "final", "failed"];

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = 20;

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getNotes(page, pageSize, statusFilter);
      if (data?.success) {
        setNotes(data.notes);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired.");
        return;
      }
      toast.error("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-warning/10 text-warning border-warning/20",
      draft: "bg-primary/10 text-primary border-primary/20",
      final: "bg-success/10 text-success border-success/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || "bg-bg-soft text-text-muted border-border-default";
  };

  return (
    <div className="space-y-6 relative">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">DSA Notes</h1>
          <p className="text-sm text-text-muted mt-1">
            All coding notes across the platform — <span className="font-semibold text-text-main">{total}</span> total.
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-bg-base border border-border-default rounded-lg px-3 py-1.5 text-text-main outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="">All Statuses</option>
          {NOTES_STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Notes Table */}
      <div className="bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-soft/50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Language</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={20} />
                  </td>
                </tr>
              ) : notes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-muted text-xs">
                    No notes found.
                  </td>
                </tr>
              ) : (
                notes.map((n) => (
                  <tr key={n.id} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-text-light shrink-0" />
                        <span className="text-xs font-medium text-text-main truncate max-w-[250px]" title={n.title}>
                          {n.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <User size={11} />
                        <span className="text-xs">{n.user_email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-light">{n.platform || "—"}</td>
                    <td className="px-4 py-3 text-xs text-text-light">{n.language || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(n.status)}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[10px] text-text-light whitespace-nowrap">
                      {(() => {
                        try {
                          return format(new Date(n.createdAt), "MMM dd yyyy");
                        } catch {
                          return "N/A";
                        }
                      })()}
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

export default AdminNotes;
