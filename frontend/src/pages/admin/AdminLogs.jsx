import { useCallback, useEffect, useState } from "react";
import { Filter, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import adminApi from "../../api/adminApi";
import Pagination from "../../components/common/Pagination";
import Glow from "../../components/common/Glow";
import { format } from "date-fns";

const HTTP_METHODS = ["", "GET", "POST", "PUT", "PATCH", "DELETE"];

const STATUS_CODES = ["", 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500];

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [method, setMethod] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const pageSize = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getLogs(page, pageSize, method, statusCode);
      if (data?.success) {
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired.");
        return;
      }
      toast.error("Failed to load logs.");
    } finally {
      setLoading(false);
    }
  }, [page, method, statusCode]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(1);
  }, [method, statusCode]);

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-success/10 text-success border-success/20",
      POST: "bg-primary/10 text-primary border-primary/20",
      PUT: "bg-warning/10 text-warning border-warning/20",
      PATCH: "bg-primary/10 text-primary border-primary/20",
      DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[method] || "bg-bg-soft text-text-muted border-border-default";
  };

  const getStatusColor = (code) => {
    if (code < 300) return "text-success";
    if (code < 400) return "text-warning";
    return "text-red-400";
  };

  const clearFilters = () => {
    setMethod("");
    setStatusCode("");
    setPage(1);
  };

  return (
    <div className="space-y-6 relative">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Request Logs</h1>
          <p className="text-sm text-text-muted mt-1">
            Monitor incoming API requests — <span className="font-semibold text-text-main">{total}</span> total logged.
          </p>
        </div>

        {(method || statusCode) && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-main hover:bg-bg-soft/50 border border-border-default transition-all cursor-pointer"
          >
            <X size={12} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-text-light" />
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Filters:</span>
        </div>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="text-xs bg-bg-base border border-border-default rounded-lg px-3 py-1.5 text-text-main outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="">All Methods</option>
          {HTTP_METHODS.filter(Boolean).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={statusCode}
          onChange={(e) => setStatusCode(e.target.value)}
          className="text-xs bg-bg-base border border-border-default rounded-lg px-3 py-1.5 text-text-main outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="">All Status Codes</option>
          {STATUS_CODES.filter((s) => s !== "").map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-bg-surface/80 backdrop-blur-sm border border-border-default rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-soft/50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Path</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Duration</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/60 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={20} />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted text-xs">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getMethodColor(log.method)}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-text-main truncate max-w-[400px]" title={log.path}>
                      {log.path}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-xs font-bold ${getStatusColor(log.status_code)}`}>
                        {log.status_code}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-text-light">
                      {log.duration_ms > 1000
                        ? `${(log.duration_ms / 1000).toFixed(2)}s`
                        : `${Math.round(log.duration_ms)}ms`}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[10px] text-text-light whitespace-nowrap">
                      {(() => {
                        try {
                          return format(new Date(log.createdAt), "MMM dd HH:mm:ss");
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

export default AdminLogs;
