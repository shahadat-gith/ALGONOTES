import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "./Dropdown";
import SearchModal from "../modals/SearchModal"; 
import logo from "/logo.png";
import { Search } from "lucide-react";
import Button from "../common/Button";

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
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-default)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* LEFT SECTION: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 transition active:scale-98 shrink-0"
            >
              <img
                src={logo}
                alt="AlgoNotes Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="hidden sm:inline text-xl font-extrabold tracking-tight text-[var(--text-main)]">
                ALGO<span className="text-[var(--primary)]">NOTES</span>
              </span>
            </Link>
          </div>

          {/* RIGHT SECTION: Controls & Dropdown / Login Action */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Global Search Action Trigger (Always visible across all device viewports) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-soft)] border border-[var(--border-default)]/40 rounded-full transition-all active:scale-95 shadow-sm hover:shadow-sm"
              title="Open Search Console"
            >
              <Search size={18} className="stroke-[2.2]" />
            </button>

            {/* 🌟 CONDITIONAL PROFILE HUB / LOGIN REDIRECT */}
            {user ? (
              <Dropdown user={user} onLogout={handleLogout} />
            ) : (
              <Button
               onClick = {()=> navigate("/login")}
               loading={loading}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* GLOBAL ISOLATED SEARCH OVERLAY PORTAL */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;