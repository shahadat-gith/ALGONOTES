import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "./Dropdown";
import SearchModal from "../modals/SearchModal"; 
import logo from "/logo.png";
import { Search } from "lucide-react";
import Button from "../common/Button";

import Logo from "../logo/Logo";
import MinimalistLogo from "../logo/MinimalistLogo";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-default)]/60 bg-[var(--bg-surface)]/70 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* LEFT SECTION: Brand Logo & Typography */}
          <div className="flex items-center gap-6">
           <Link to="/dashboard" className="flex items-center gap-2.5 ...">
              <MinimalistLogo className="h-8 w-8 text-[var(--primary)]" />
              <span className="hidden sm:inline text-lg font-black tracking-tight text-[var(--text-main)]">
                ALGO<span className="text-[var(--primary)] font-extrabold">NOTES</span>
              </span>
            </Link>
          </div>

          {/* RIGHT SECTION: Global Actions & Profile Auth Management */}
          <div className="flex items-center gap-3.5 shrink-0">
            
            {/* Search Action Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="group flex h-9 w-9 items-center justify-center text-[var(--text-light)] hover:text-[var(--primary)] bg-[var(--bg-soft)] hover:bg-[var(--primary-soft)] border border-[var(--border-default)] rounded-xl transition-all duration-200 active:scale-95"
              title="Search Workspace (Ctrl+/)"
            >
              <Search size={16} className="stroke-[2.2] transition-transform duration-200 group-hover:scale-105" />
            </button>

            {/* Dynamic Divider */}
            <div className="h-4 w-[1px] bg-[var(--border-default)]" />

            {/* CONDITIONAL AUTH PROFILE SPLIT ENGINE */}
            {loading ? (
              /* Pristine Loading Skeleton Animation */
              <div className="h-9 w-9 animate-pulse rounded-xl bg-[var(--border-default)]" />
            ) : user ? (
              /* Active Session Dropdown menu overlay trigger */
              <Dropdown user={user} onLogout={handleLogout} />
            ) : (
              /* Public Login Outbound Handle Link */
              <button
                onClick={() => navigate("/login")}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-[var(--primary)] px-4 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* GLOBAL OVERLAY MODAL PORTAL */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;