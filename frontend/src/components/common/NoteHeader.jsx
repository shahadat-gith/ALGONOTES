import React from 'react';
import { Plus } from "lucide-react";
import Input from './Input';

const NoteHeader = ({ 
  title = "Study Notes", 
  description = "Manage your personal collection of notes.", 
  btnText = "Create New", 
  onBtnClick, 
  search, 
  setSearch,
  placeholder = "Search notes..."
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-5 w-full">
      
      {/* Left Side: Dynamic Titles */}
      <div className="flex flex-col gap-1 md:w-1/4">
        <h2 className="text-xl font-bold tracking-tight text-text-main">{title}</h2>
        <p className="text-xs text-text-light">{description}</p>
      </div>

      {/* Center Side: Unified Backend Search Bar Component */}
      <div className="w-full md:max-w-md flex-1 mx-auto">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-xs font-sans placeholder:text-text-light"
        />
      </div>

      {/* Right Side: Primary Navigation Action Trigger */}
      <div className="flex flex-col items-end gap-2 md:w-1/4 min-w-[200px]">
        <button
          type="button"
          onClick={onBtnClick}
          className="inline-flex items-center justify-center gap-1.5 px-3 h-8 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold rounded-md uppercase tracking-wide cursor-pointer transition-all duration-200 select-none active:scale-[0.98] shadow-xs"
        >
          <Plus size={13} />
          <span>{btnText}</span>
        </button>
      </div>
    </div>
  );
};

export default NoteHeader;