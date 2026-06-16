import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedModal from "../common/AnimatedModal";
import { searchWorkspace } from "../../api/userApi";
import { 
  Search, 
  X, 
  Code2, 
  StickyNote, 
  LayoutDashboard, 
  Settings, 
  Loader2,
  Layers
} from "lucide-react";

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [databaseResults, setDatabaseResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Static Application Navigation Pages
  const coreAppPages = [
    { name: "Dashboard Workspace", path: "/dashboard", desc: "Main analytical control deck", icon: LayoutDashboard },
    { name: "Problem Workspace Repository", path: "/problems", desc: "LeetCode & DSA tracker modules", icon: Code2 },
    { name: "Your Generated AI Notes", path: "/notes", desc: "Deep-dives and dry-run execution logs", icon: StickyNote },
    { name: "Account Configurations", path: "/settings", desc: "Security and credentials panel", icon: Settings },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setDatabaseResults([]);
      setLoading(false);
    }
  }, [isOpen]);

  // Debounced API layout pipeline
  useEffect(() => {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length < 2) {
      setDatabaseResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await searchWorkspace(trimmedQuery);
        if (response.success) {
          setDatabaseResults(response.results || []);
        }
      } catch (err) {
        console.error("Workspace index search failure:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleRedirection = (destinationPath) => {
    onClose();
    navigate(destinationPath);
  };

  const cleanQuery = query.trim().toLowerCase();

  // 1. Compute Client-Side Categorized System Pages Matches
  const filteredPages = cleanQuery
    ? coreAppPages.filter(page => 
        page.name.toLowerCase().includes(cleanQuery) || 
        page.desc.toLowerCase().includes(cleanQuery)
      )
    : coreAppPages;

  // 2. Extract Problems from server results array
  const filteredProblems = cleanQuery.length >= 2 
    ? databaseResults.filter(item => item.type === "problem")
    : [];

  // 3. Extract Notes from server results array
  const filteredNotes = cleanQuery.length >= 2 
    ? databaseResults.filter(item => item.type === "note")
    : [];

  // Check if anything matched across any of our 3 category tiers
  const totalResultsCount = filteredPages.length + filteredProblems.length + filteredNotes.length;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl w-full bg-bg-surface rounded-md relative overflow-hidden shadow-card border border-border-default"
    >
      <div className="flex flex-col max-h-[80vh]">
        
        {/* Header Input Interface Bar */}
        <div className="flex items-center gap-3 px-4.5 py-4 border-b border-border-default relative group">
          {loading ? (
            <Loader2 size={16} className="text-primary animate-spin shrink-0 stroke-[2.2]" />
          ) : (
            <Search size={16} className="text-text-light shrink-0 stroke-[2.2]" />
          )}
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search problems, notes, navigation commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-text-main placeholder-text-light focus:outline-hidden font-medium pr-16"
          />

          <div className="absolute inset-y-0 right-4 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1.5 text-text-light hover:text-text-main transition-colors rounded-sm hover:bg-bg-soft cursor-pointer"
                title="Clear input"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 p-3 flex justify-center items-center text-[10px] font-mono text-text-light hover:text-text-main transition-all rounded-full border border-border-default bg-bg-base shadow-xs hover:border-border-strong cursor-pointer"
            >
              X
            </button>
          </div>
        </div>

        {/* Multi-Section Results Area Container */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4 min-h-[320px] no-scrollbar">
          {totalResultsCount > 0 ? (
            <>
              {/* SECTION A: SYSTEM PAGES */}
              {filteredPages.length > 0 && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-text-light uppercase tracking-widest px-3 py-1.5 select-none flex items-center gap-2">
                    <Layers size={11} className="text-text-light" />
                    <span>Application Pages</span>
                  </p>
                  {filteredPages.map((page, idx) => {
                    const Icon = page.icon;
                    return (
                      <div
                        key={`page-${idx}`}
                        onClick={() => handleRedirection(page.path)}
                        className="flex items-center gap-3.5 px-3 py-2.5 rounded-sm hover:bg-bg-soft/70 cursor-pointer group transition-all select-none border border-transparent hover:border-border-default"
                      >
                        <div className="p-2 rounded-sm shrink-0 bg-bg-soft text-text-muted border border-border-default group-hover:text-primary group-hover:border-primary/20 transition-colors">
                          <Icon size={14} className="stroke-[1.75]" />
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-0.5">
                          <p className="text-xs font-semibold text-text-main transition-colors truncate">{page.name}</p>
                          <p className="text-[10px] text-text-muted truncate tracking-wide">{page.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION B: REPOSITORY PROBLEMS */}
              {filteredProblems.length > 0 && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1.5 select-none flex items-center gap-2">
                    <Code2 size={11} className="stroke-[2.2]" />
                    <span>Tracked Problems ({filteredProblems.length})</span>
                  </p>
                  {filteredProblems.map((problem, idx) => (
                    <div
                      key={`prob-${idx}`}
                      onClick={() => handleRedirection(problem.path)}
                      className="flex items-center gap-3.5 px-3 py-2.5 rounded-sm hover:bg-bg-soft/70 cursor-pointer group transition-all select-none border border-transparent hover:border-border-default"
                    >
                      <div className="p-2 rounded-sm shrink-0 bg-primary-soft text-primary border border-primary/10">
                        <Code2 size={14} className="stroke-[2]" />
                      </div>
                      <div className="overflow-hidden flex-1 flex flex-col gap-0.5">
                        <p className="text-xs font-semibold text-text-main transition-colors truncate">{problem.name}</p>
                        <p className="text-[10px] text-text-muted truncate tracking-wide">{problem.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION C: AI NOTES COMPILATION */}
              {filteredNotes.length > 0 && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-success uppercase tracking-widest px-3 py-1.5 select-none flex items-center gap-2">
                    <StickyNote size={11} />
                    <span>Study Block Notes ({filteredNotes.length})</span>
                  </p>
                  {filteredNotes.map((note, idx) => (
                    <div
                      key={`note-${idx}`}
                      onClick={() => handleRedirection(note.path)}
                      className="flex items-center gap-3.5 px-3 py-2.5 rounded-sm hover:bg-bg-soft/70 cursor-pointer group transition-all select-none border border-transparent hover:border-border-default"
                    >
                      <div className="p-2 rounded-sm shrink-0 bg-success-soft text-success border border-success/10">
                        <StickyNote size={14} className="stroke-[1.75]" />
                      </div>
                      <div className="overflow-hidden flex-1 flex flex-col gap-0.5">
                        <p className="text-xs font-semibold text-text-main transition-colors truncate">{note.name}</p>
                        <p className="text-[10px] text-text-muted truncate tracking-wide">{note.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Guidance hint string */}
              {cleanQuery.length === 1 && (
                <div className="px-1 pt-2">
                  <p className="text-[10px] text-center text-text-light bg-bg-soft/40 py-2 rounded-sm select-none font-medium tracking-wide border border-border-default/40">
                    Keep typing to pull matching problems and notes results...
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Empty State View fallback */
            !loading && (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 select-none animate-fade-in">
                <div className="p-3 bg-bg-soft border border-border-default rounded-sm text-text-light mb-3.5 shadow-xs">
                  <Search size={18} className="stroke-[1.75]" />
                </div>
                <h3 className="text-xs font-semibold text-text-muted tracking-wide">No match indices found</h3>
                <p className="text-[11px] text-text-light max-w-[260px] mt-1.5 leading-relaxed">
                  We scanned your workspace completely but couldn't find coordinates for <span className="font-medium font-mono text-primary bg-primary-soft px-1 rounded-sm border border-primary/10">"{query}"</span>.
                </p>
              </div>
            )
          )}
        </div>

      </div>
    </AnimatedModal>
  );
};

export default SearchModal;