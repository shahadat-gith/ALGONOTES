import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Activity,
  FileText,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import Glow from "../../components/common/Glow";
import { useAdmin } from "../../context/AdminContext";

const sidebarItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/logs", label: "API Logs", icon: Activity },
  { to: "/admin/notes", label: "DSA Notes", icon: FileText },
  { to: "/admin/theories", label: "Theory Notes", icon: BookOpen },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    adminLogout();
    toast.success("Logged out of admin portal.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-bg-base text-text-main relative">
      {/* Background Glow Effects */}
      <Glow preset="layoutTop" />
      <Glow preset="layoutRight" />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-30 bg-bg-surface/90 backdrop-blur-xl border-r border-border-default transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border-default shrink-0">
          {!collapsed ? (
            <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="ALGONOTES logo"
                className="h-8 w-8 rounded-full border border-white/15 transition-transform group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-text-main">
                  ALGO<span className="text-primary">NOTES</span>
                </span>
                <span className="text-[9px] text-text-muted uppercase tracking-wider">Admin</span>
              </div>
            </Link>
          ) : (
            <Link to="/admin/dashboard">
              <img
                src="/logo.png"
                alt="ALGONOTES"
                className="h-8 w-8 rounded-full mx-auto border border-white/15"
              />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="p-1 rounded-md text-text-light hover:text-text-main hover:bg-bg-soft transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-muted hover:text-text-main hover:bg-bg-soft/50 border border-transparent"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" strokeWidth={1.8} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Back to Main Site & Logout */}
        <div className="p-2 border-t border-border-default space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-soft/50 transition-all border border-transparent"
            title={collapsed ? "Back to Site" : undefined}
          >
            <ArrowLeft size={18} className="shrink-0" strokeWidth={1.8} />
            {!collapsed && <span>Back to Site</span>}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full border border-transparent cursor-pointer"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="shrink-0" strokeWidth={1.8} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 relative z-10 ${
          collapsed ? "ml-16" : "ml-60"
        }`}
      >
        <div className="min-h-screen p-6 max-w-[1400px] mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
