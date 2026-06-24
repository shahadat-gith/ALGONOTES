import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedDropdown from "../common/AnimatedDropdown";
import EditProfileModal from "../modals/EditProfileModal";
import { 
  BookOpen,
  ChevronDown, 
  LogOut, 
  Edit3,
  Sparkles
} from "lucide-react";

import { quicklinks } from "../../constants/quicklinks";

const Dropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-border-default/80 bg-bg-base/40 px-3 py-2.5 transition-all hover:bg-bg-soft hover:border-border-default focus:outline-hidden group select-none cursor-pointer"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary-soft text-xs font-bold text-primary group-hover:scale-105 transition-transform duration-200 overflow-hidden bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/10 shadow-inner">
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

        <ChevronDown
          size={13}
          className={`text-text-light transition-transform duration-200 group-hover:text-text-muted shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      <AnimatedDropdown
        isOpen={isOpen}
        className="absolute right-0 z-50 mt-3 w-[22rem] origin-top-right rounded-2xl border border-border-strong bg-bg-surface p-2 shadow-card animate-fade-in space-y-2"
      >
        <div className="overflow-hidden p-4 border-b border-border-default/80 bg-bg-base/40 rounded-2xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-base text-sm font-bold text-text-main overflow-hidden select-none shadow-card">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Card component display disk" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="overflow-hidden flex flex-col gap-0.5">
                <p className="truncate text-base font-semibold text-text-main tracking-tight leading-snug">
                  {user?.name || "Your account"}
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-base border border-border-default hover:border-border-strong text-text-muted hover:text-primary rounded-xl text-[11px] font-medium transition-all shadow-xs shrink-0 cursor-pointer"
              title="Update profile"
            >
              <Edit3 size={11} className="stroke-[1.75]" />
              <span>Edit profile</span>
            </button>
          </div>

          
        </div>

        <div className="px-2 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Jump to</p>
        </div>

        <div className="space-y-1 px-0.5 max-h-[280px] overflow-y-auto">
          {quicklinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-start rounded-xl px-3 py-3 text-text-muted hover:bg-bg-soft/70 hover:text-text-main group/item transition-all duration-150 border border-transparent hover:border-border-default/40"
              >
                <div className="flex items-center gap-2.5 w-full">
                  <div className={`p-1 rounded-md bg-bg-soft group-hover/item:bg-bg-base text-text-light group-hover/item:text-primary transition-colors ${link.activeColor}`}>
                    <IconComponent size={13} className="stroke-[1.75]" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-text-main/90 group-hover/item:text-primary transition-colors">
                    {link.label}
                  </span>
                </div>
                {link.description && (
                  <p className="text-[11px] text-text-light mt-1.5 pl-6 leading-5 group-hover/item:text-text-muted transition-colors">
                    {link.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-border-default !my-1.5 mx-1" />

        <div className="px-0.5 pb-0.5">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold text-danger/80 hover:text-danger bg-transparent hover:bg-danger-soft transition-all cursor-pointer border border-transparent hover:border-danger/10"
          >
            <LogOut size={13} className="stroke-[2]" />
            <span className="tracking-tight">Sign out</span>
          </button>
        </div>

      </AnimatedDropdown>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
    </div>
  );
};

export default Dropdown;