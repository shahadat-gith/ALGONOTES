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

import { quicklinks } from "../../constants/quicklinks";

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
      
      {/* 1. Main Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-md px-2.5 py-1.5 transition-all hover:bg-bg-soft/60 focus:outline-hidden group select-none cursor-pointer"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary-soft text-xs font-bold text-primary group-hover:scale-105 transition-transform duration-200 overflow-hidden bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/20">
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

        <div className="hidden sm:flex flex-col items-start text-left max-w-[120px]">
          <span className="text-xs font-semibold text-text-main truncate w-full transition-colors group-hover:text-primary tracking-wide">
            {user?.name || "Developer"}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-text-light transition-transform duration-200 group-hover:text-text-muted ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* 2. Interactive Menu Dropdown Shell */}
      <AnimatedDropdown
        isOpen={isOpen}
        className="absolute right-0 z-50 mt-3 w-72 origin-top-right rounded-md border border-border-default bg-bg-surface p-2 shadow-card animate-fade-in space-y-2"
      >
        {/* User Card Profile Frame */}
        <div className="px-3.5 py-3 bg-bg-soft/40 border border-border-default/60 rounded-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-base text-xs font-bold text-text-main overflow-hidden select-none shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Card avatar thumbnail" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "A"
              )}
            </div>
            <div className="overflow-hidden flex flex-col gap-0.5">
              <p className="truncate text-xs font-semibold text-text-main tracking-wide">
                {user?.name || "AlgoNotes User"}
              </p>
              {user?.username && (
                <p className="truncate text-[10px] text-text-muted font-mono tracking-tight">
                  @{user.username}
                </p>
              )}
              <p className="truncate text-[10px] text-text-light font-mono tracking-tight">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsEditModalOpen(true);
            }}
            className="p-2 bg-bg-base border border-border-default hover:border-border-strong hover:text-primary rounded-sm text-text-muted transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
            title="Edit Profile Details"
          >
            <Edit3 size={13} className="stroke-[1.75]" />
          </button>
        </div>

        {/* Verification Warning Alert Banner */}
        {!isVerified && (
          <div className="px-1">
            <Link
              to={`/verify?email=${encodeURIComponent(user?.email || "")}`}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 bg-warning-soft border border-warning/10 hover:border-warning/30 rounded-sm flex items-center justify-between gap-2 text-warning transition-all group/alert duration-150"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <ShieldAlert size={14} className="text-warning shrink-0 stroke-[2]" />
                <span className="text-[10px] font-medium tracking-wide truncate">Action Required: Verify Email</span>
              </div>
              <ArrowRight size={12} className="text-warning opacity-60 shrink-0 transition-transform group-hover/alert:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Navigation Action Links list */}
        <div className="space-y-1 px-1">
          {quicklinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs font-medium text-text-muted transition-all hover:bg-bg-soft hover:text-text-main group"
              >
                <IconComponent 
                  size={14} 
                  className={`text-text-light group-hover:text-primary transition-colors stroke-[1.75] ${link.activeColor}`} 
                />
                <span className="tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Subtle Horizontal Divider Line */}
        <div className="h-px bg-border-default !my-2 mx-1" />

        {/* Destructive Sign out Action Node */}
        <div className="px-1 pb-0.5">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-xs font-semibold text-danger/90 hover:text-danger transition-colors hover:bg-danger-soft active:scale-[0.99] cursor-pointer"
          >
            <LogOut size={14} className="stroke-[2]" />
            <span className="tracking-wide">Sign Out Account</span>
          </button>
        </div>

      </AnimatedDropdown>

      {/* 3. External Trigger Portals */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
    </div>
  );
};

export default Dropdown;