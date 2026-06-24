// components/layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "./Dropdown";
import { Loader2 } from "lucide-react";
import Button from "../common/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full border-b border-white/10 bg-[#07090fcc] backdrop-blur-xl z-40 select-none">
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="ALGONOTES logo"
              className="h-9 w-9 rounded-full border border-white/15 transition-transform group-hover:scale-105"
            />

            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight text-white">
                ALGO<span className="text-primary">NOTES</span>
              </span>
              <span className="text-[11px] text-text-muted">
                Smarter notes for coding and theory
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {loading ? (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft border border-border-default">
              <Loader2
                size={16}
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
              className="h-10 px-4 text-sm font-semibold shadow-[0_0_22px_rgba(138,121,255,0.34)]"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
