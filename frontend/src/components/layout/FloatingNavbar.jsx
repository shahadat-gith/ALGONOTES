// components/layout/FloatingNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "./Dropdown";
import SearchModal from "../modals/SearchModal"; 
import { Search, Loader2 } from "lucide-react";
import Button from "../common/Button";
import MinimalistLogo from "../logo/MinimalistLogo";

const FloatingNavbar = () => {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Safely show the floating capsule only after scrolling past the main header footprint
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Isolated fixed container block hanging 16px below viewport ceiling */}
      <div 
        className={`fixed top-4 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out pointer-events-none ${
          isVisible 
            ? "translate-y-0 opacity-100 visible" 
            : "-translate-y-4 opacity-0 invisible"
        }`}
      >
        <header className="mx-auto max-w-[1400px] w-full h-14 flex items-center justify-between gap-4 px-5 bg-bg-surface/85 backdrop-blur-md border border-border-default rounded-full shadow-lg pointer-events-auto select-none">
          
          {/* LEFT SECTION: Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <MinimalistLogo className="h-5.5 w-5.5 text-primary transition-transform duration-300 group-hover:rotate-6" />
              <span className="hidden sm:inline text-xs font-bold tracking-widest font-mono text-text-main">
                ALGO<span className="text-primary font-black">NOTES</span>
              </span>
            </Link>
          </div>

          {/* RIGHT SECTION: Quick Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="group flex h-8 items-center gap-2.5 rounded-sm px-3 text-text-light hover:text-primary bg-bg-soft/40 hover:bg-primary-soft border border-border-default/60 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <Search size={13} className="stroke-[2]" />
              <span className="hidden md:inline text-[11px] font-semibold text-text-light/80">
                Search...
              </span>
            </button>

            <div className="h-3.5 w-[1px] bg-border-default/60" />

            {loading ? (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-bg-soft border border-border-default/60">
                <Loader2 size={14} className="animate-spin text-primary stroke-[2]" />
              </div>
            ) : user ? (
              <Dropdown user={user} onLogout={handleLogout} />
            ) : (
              <Button onClick={() => navigate("/login")} size="sm" variant="primary" className="h-8 text-xs font-semibold px-4 rounded-sm cursor-pointer">
                Login
              </Button>
            )}
          </div>
        </header>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default FloatingNavbar;