// components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "./Dropdown";
import SearchModal from "../modals/SearchModal";
import { Search, Loader2 } from "lucide-react";
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
      <header className="w-full bg-bg-surface border-b border-border-default relative z-40 select-none">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo Group */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="ALGONOTES logo"
              className="h-8 w-8 rounded-full transition-transform group-hover:scale-105"
            />

            <span className="text-base font-semibold tracking-tight text-white">
              ALGO<span className="text-primary">NOTES</span>
            </span>
          </Link>

          {/* Action Hub */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="group flex h-9 items-center gap-2.5 rounded-sm px-3.5 text-text-light hover:text-primary bg-bg-soft/50 hover:bg-bg-soft border border-border-default transition-all duration-150 cursor-pointer"
            >
              <Search size={14} className="stroke-[2]" />
              <span className="hidden sm:inline text-xs font-semibold text-text-light/80">
                Search Workspace...
              </span>
            </button>

            <div className="h-4 w-[1px] bg-border-default" />

            {loading ? (
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-bg-soft border border-border-default">
                <Loader2
                  size={15}
                  className="animate-spin text-primary stroke-[2]"
                />
              </div>
            ) : user ? (
              <Dropdown user={user} onLogout={handleLogout} />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                size="md"
                variant="primary"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
