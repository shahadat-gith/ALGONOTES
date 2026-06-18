import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedDropdown from "../common/AnimatedDropdown";
import EditProfileModal from "../modals/EditProfileModal";
import { 
  ChevronDown, 
  LogOut, 
  Edit3,
  ShieldAlert,
  ArrowRight,
  User,
  Mail
} from "lucide-react";

import { quicklinks } from "../../constants/quicklinks";

const Dropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isVerified = user?.verificationOptions?.status === "verified";
  const avatarUrl = user?.avatar?.url;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* 1. Main Navbar Trigger Button Profile Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all hover:bg-bg-soft bg-transparent focus:outline-hidden group select-none cursor-pointer border border-transparent hover:border-border-default"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary-soft text-xs font-bold text-primary group-hover:scale-105 transition-transform duration-200 overflow-hidden bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/10 shadow-inner">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="User profile disc" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = user?.name?.charAt(0).toUpperCase() || "U";
              }}
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>

        <div className="hidden sm:flex flex-col items-start text-left max-w-[110px]">
          <span className="text-xs font-semibold text-text-main truncate w-full group-hover:text-primary transition-colors tracking-wide leading-none">
            {user?.name || "User Workspace"}
          </span>
        </div>

        <ChevronDown
          size={13}
          className={`text-text-light transition-transform duration-200 group-hover:text-text-muted shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* 2. Unified High Contrast Dropdown Portal Menu */}
      <AnimatedDropdown
        isOpen={isOpen}
        className="absolute right-0 z-50 mt-3 w-80 origin-top-right rounded-xl border border-border-strong bg-bg-surface p-2 shadow-card animate-fade-in space-y-2"
      >
        {/* User Card Header Wrapper */}
        <div className="p-3 border-b border-border-default flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-base text-sm font-bold text-text-main overflow-hidden select-none shadow-card">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Card component display disk" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="overflow-hidden flex flex-col gap-0.5">
                <p className="truncate text-sm font-bold text-text-main tracking-wide leading-snug">
                  {user?.name || "Account Space"}
                </p>
                {user?.username && (
                  <p className="truncate text-[11px] text-text-muted font-mono tracking-tight leading-none">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-default hover:border-border-strong text-text-muted hover:text-primary rounded-md text-[11px] font-medium transition-all shadow-xs shrink-0 cursor-pointer"
              title="Modify Profile Information"
            >
              <Edit3 size={11} className="stroke-[1.75]" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Verification Alert Micro-Banner */}
        {!isVerified && (
          <div className="px-0.5">
            <Link
              to={`/verify?email=${encodeURIComponent(user?.email || "")}`}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 bg-warning-soft border border-warning/10 hover:border-warning/20 rounded-lg flex items-center justify-between gap-2 text-warning transition-all group/alert duration-200"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <ShieldAlert size={14} className="text-warning shrink-0 stroke-[2]" />
                <span className="text-[11px] font-semibold tracking-wide truncate">Verify your email address</span>
              </div>
              <ArrowRight size={12} className="text-warning shrink-0 transition-transform group-hover/alert:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* Action Link Row Navs */}
        <div className="space-y-0.5 px-0.5 max-h-[280px] overflow-y-auto">
          {quicklinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-start rounded-lg px-3 py-2 text-text-muted hover:bg-bg-soft/70 hover:text-text-main group/item transition-all duration-150 border border-transparent hover:border-border-default/40"
              >
                <div className="flex items-center gap-2.5 w-full">
                  <div className={`p-1 rounded-md bg-bg-soft group-hover/item:bg-bg-base text-text-light group-hover/item:text-primary transition-colors ${link.activeColor}`}>
                    <IconComponent size={13} className="stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-text-main/90 group-hover/item:text-primary transition-colors">
                    {link.label}
                  </span>
                </div>
                {/* Layman descriptive micro-copy text block dynamically revealed on wrapper focus */}
                {link.description && (
                  <p className="text-[10px] text-text-light font-medium tracking-wide mt-1 pl-6 leading-normal group-hover/item:text-text-muted transition-colors">
                    {link.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Subtle Section Divider */}
        <div className="h-px bg-border-default !my-1.5 mx-1" />

        {/* Sign Out Trigger Action Button */}
        <div className="px-0.5 pb-0.5">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-danger/80 hover:text-danger bg-transparent hover:bg-danger-soft transition-all cursor-pointer border border-transparent hover:border-danger/10"
          >
            <LogOut size={13} className="stroke-[2]" />
            <span className="tracking-wide">Sign Out</span>
          </button>
        </div>

      </AnimatedDropdown>

      {/* 3. External Target Portal Boundary Modals */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
    </div>
  );
};

export default Dropdown;