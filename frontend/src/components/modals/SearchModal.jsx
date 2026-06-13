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
    
    // If query is shorter than 2 characters, don't hit the API backend database
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

  // 2. Extract Problems from server results array (or fallback to an empty slate)
  const filteredProblems = cleanQuery.length >= 2 
    ? databaseResults.filter(item => item.type === "problem")
    : [];

  // 3. Extract Notes from server results array (or fallback to an empty slate)
  const filteredNotes = cleanQuery.length >= 2 
    ? databaseResults.filter(item => item.type === "note")
    : [];

  // Check if anything matched across any of our 3 category tiers
  const totalResultsCount = filteredPages.length + filteredProblems.length + filteredNotes.length;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl w-full bg-white rounded-2xl relative overflow-hidden shadow-2xl border border-[var(--border-default)]"
    >
      <div className="flex flex-col max-h-[80vh]">
        
        {/* Header Input Interface Bar */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border-default)]/60 relative group">
          {loading ? (
            <Loader2 size={18} className="text-[var(--primary)] animate-spin shrink-0" />
          ) : (
            <Search size={18} className="text-[var(--text-light)] shrink-0 stroke-[2.2]" />
          )}
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search problems, notes, navigation commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none font-medium pr-8"
          />

          <div className="absolute inset-y-0 right-4 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-[var(--text-light)] hover:text-[var(--text-main)] transition-colors rounded-lg hover:bg-[var(--bg-soft)]"
                title="Clear input"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[var(--text-light)] hover:text-[var(--text-main)] transition-colors rounded-lg hover:bg-[var(--bg-soft)] border border-[var(--border-default)]/40 bg-[var(--bg-base)]/30 shadow-sm"
            >
              <X size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Multi-Section Results Area Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-[300px]">
          {totalResultsCount > 0 ? (
            <>
              
              {/* SECTION A: SYSTEM PAGES (Always visible, dynamically filtered) */}
              {filteredPages.length > 0 && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider px-2.5 py-1 select-none flex items-center gap-1.5">
                    <Layers size={10} className="text-[var(--text-light)]" /> Application Pages
                  </p>
                  {filteredPages.map((page, idx) => {
                    const Icon = page.icon;
                    return (
                      <div
                        key={`page-${idx}`}
                        onClick={() => handleRedirection(page.path)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-soft)] cursor-pointer group transition-colors select-none"
                      >
                        <div className="p-2 rounded-lg shrink-0 bg-[var(--bg-soft)] text-[var(--text-muted)] border border-[var(--border-default)]/30">
                          <Icon size={15} />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors truncate">{page.name}</p>
                          <p className="text-[10px] text-[var(--text-light)] truncate">{page.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SECTION B: REPOSITORY PROBLEMS (Visible if matches exist) */}
              {filteredProblems.length > 0 && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider px-2.5 py-1 select-none flex items-center gap-1.5">
                    <Code2 size={10} /> Tracked Problems ({filteredProblems.length})
                  </p>
                  {filteredProblems.map((problem, idx) => (
                    <div
                      key={`prob-${idx}`}
                      onClick={() => handleRedirection(problem.path)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-soft)] cursor-pointer group transition-colors select-none"
                    >
                      <div className="p-2 rounded-lg shrink-0 bg-indigo-50 text-indigo-600 border border-indigo-100/40">
                        <Code2 size={15} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors truncate">{problem.name}</p>
                        <p className="text-[10px] text-[var(--text-light)] truncate">{problem.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION C: AI NOTES COMPILATION (Visible if matches exist) */}
              {filteredNotes.length > 0 && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider px-2.5 py-1 select-none flex items-center gap-1.5">
                    <StickyNote size={10} /> Study Block Notes ({filteredNotes.length})
                  </p>
                  {filteredNotes.map((note, idx) => (
                    <div
                      key={`note-${idx}`}
                      onClick={() => handleRedirection(note.path)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-soft)] cursor-pointer group transition-colors select-none"
                    >
                      <div className="p-2 rounded-lg shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-100/40">
                        <StickyNote size={15} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors truncate">{note.name}</p>
                        <p className="text-[10px] text-[var(--text-light)] truncate">{note.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Guidance hint if text is typed but data models aren't fetching query items yet */}
              {cleanQuery.length === 1 && (
                <p className="text-[10px] text-center text-[var(--text-light)] bg-[var(--bg-base)] py-1.5 rounded-lg select-none">
                  Keep typing to pull matching problems and notes results...
                </p>
              )}
            </>
          ) : (
            /* Empty State View fallback */
            !loading && (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 select-none animate-fade-in">
                <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-default)]/60 rounded-2xl text-[var(--text-light)] mb-3">
                  <Search size={20} className="stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-bold text-[var(--text-muted)]">No match indices found</h3>
                <p className="text-[11px] text-[var(--text-light)] max-w-[240px] mt-1 leading-relaxed">
                  We scanned your workspace completely but couldn't find matching coordinates for <span className="font-semibold font-mono text-[var(--text-main)]">"{query}"</span>.
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