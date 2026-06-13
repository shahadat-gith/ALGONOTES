import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedDropdown from "../common/AnimatedDropdown";
import EditProfileModal from "../modals/EditProfileModal";
import { 
  ChevronDown, 
  LogOut, 
  Edit3,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

import { dropdownItems } from "../../constants/dropdown";

const Dropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);


  // Safely grab user schema sub-parameters
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
      
      {/* 1. Main Navbar Trigger Disk Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[var(--bg-soft)] focus:outline-none group select-none"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary-soft)] text-xs font-bold text-[var(--primary)] group-hover:scale-95 transition-transform duration-200 shadow-sm overflow-hidden bg-cover bg-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar disk" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = user?.name?.charAt(0).toUpperCase() || "A";
              }}
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "A"
          )}
        </div>

        <div className="hidden sm:flex flex-col items-start text-left max-w-[100px]">
          <span className="text-xs font-bold text-[var(--text-main)] truncate w-full">
            {user?.name || "Developer"}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-[var(--text-light)] transition-transform duration-200 group-hover:text-[var(--text-muted)] ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 2. Interactive Menu Shell */}
      <AnimatedDropdown
        isOpen={isOpen}
        className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-[var(--border-default)] bg-white p-2 shadow-xl animate-fade-in space-y-1.5"
      >
        {/* User Card with Inline Modal Action Trigger */}
        <div className="p-3 bg-[var(--bg-soft)]/50 border border-[var(--border-default)]/40 rounded-xl relative overflow-hidden flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--primary)]/10 bg-white text-sm font-black text-[var(--primary)] shadow-sm overflow-hidden select-none">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Card avatar thumbnail" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "A"
              )}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold text-[var(--text-main)] leading-tight">
                {user?.name || "AlgoNotes User"}
              </p>
              {user?.username && (
                <p className="truncate text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                  @{user.username}
                </p>
              )}
              <p className="truncate text-[10px] text-[var(--text-light)] font-mono mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);       // Folds away the dropdown
              setIsEditModalOpen(true); // Pops open the profile edit modal overlay instantly
            }}
            className="p-1.5 bg-white border border-[var(--border-default)] hover:border-[var(--text-light)]/40 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-sm shrink-0 active:scale-95"
            title="Edit Profile Details"
          >
            <Edit3 size={13} />
          </button>
        </div>

        {/* Dynamic Verification Notice Banner */}
        {!isVerified && (
          <Link
            to={`/verify?email=${encodeURIComponent(user?.email || "")}`}
            onClick={() => setIsOpen(false)}
            className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between gap-2 text-amber-800 hover:bg-amber-100/60 transition-colors group/alert animate-pulse"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <ShieldAlert size={14} className="text-amber-600 shrink-0 stroke-[2.2]" />
              <span className="text-[11px] font-bold tracking-tight truncate">Verify account email</span>
            </div>
            <ArrowRight size={12} className="text-amber-500 shrink-0 transition-transform group-hover/alert:translate-x-0.5" />
          </Link>
        )}

        {/* Dynamic Array Link Navigation List */}
        <div className="space-y-0.5 pt-0.5">
          {dropdownItems.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-soft)] hover:text-[var(--text-main)] group"
              >
                <IconComponent 
                  size={16} 
                  className={`text-[var(--text-light)] transition-colors ${link.activeColor}`} 
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Separator Divider Line */}
        <div className="h-px bg-[var(--border-default)]/60 !my-1.5 mx-1" />

        {/* Destructive Action Trigger */}
        <button
          onClick={() => {
            setIsOpen(false);
            onLogout();
          }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)] active:scale-[0.99]"
        >
          <LogOut size={16} className="stroke-[2.2]" />
          <span>Logout</span>
        </button>

      </AnimatedDropdown>

      {/* 3. Global Portal Context Overlay Render Node */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
    </div>
  );
};

export default Dropdown;