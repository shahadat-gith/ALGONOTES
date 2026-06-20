import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, BookOpen, Compass, Loader2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { globalSearch } from "../../api/searchApi";

const DIFFICULTY_COLORS = {
  Easy: "text-emerald-400 bg-emerald-500/10",
  Medium: "text-amber-400 bg-amber-500/10",
  Hard: "text-rose-400 bg-rose-500/10",
};

const STATIC_PAGES = [
  { title: "Home", path: "/", description: "Welcome to ALGONOTES", keywords: ["home", "landing", "welcome"] },
  { title: "About", path: "/about", description: "Learn about ALGONOTES and our mission", keywords: ["about", "mission", "story", "team"] },
  { title: "FAQ", path: "/faq", description: "Frequently asked questions", keywords: ["faq", "questions", "help", "support"] },
  { title: "Contact", path: "/contact", description: "Get in touch with us", keywords: ["contact", "support", "reach", "email"] },
  { title: "Developer", path: "/developer", description: "About the developer", keywords: ["developer", "about", "creator", "author"] },
  { title: "Privacy Policy", path: "/privacy", description: "How we handle your data", keywords: ["privacy", "data", "policy"] },
  { title: "Terms of Service", path: "/terms", description: "Terms and conditions", keywords: ["terms", "conditions", "service"] },
  { title: "Data Privacy", path: "/data-privacy", description: "Your data privacy rights", keywords: ["data privacy", "gdpr", "rights"] },
  { title: "How Note Generation Works", path: "/how-it-works/notes", description: "Learn about the DSA note generation process", keywords: ["how it works", "note generation", "ai generation"] },
  { title: "How Theory Generation Works", path: "/how-it-works/theory", description: "Learn about the theory note generation process", keywords: ["how it works", "theory generation", "ai generation"] },
  { title: "Dashboard", path: "/dashboard", description: "Your personal analytics and activity overview", keywords: ["dashboard", "home", "analytics", "stats"] },
  { title: "DSA Notes", path: "/notes", description: "All your generated DSA coding notes", keywords: ["notes", "dsa", "coding", "algorithms", "data structures"] },
  { title: "Generate DSA Note", path: "/notes/generate", description: "Generate a new AI-powered DSA note", keywords: ["generate note", "new note", "create note", "ai note"] },
  { title: "Theory Notes", path: "/theory", description: "All your generated theory study notes", keywords: ["theory", "study notes", "theory notes"] },
  { title: "Generate Theory Note", path: "/theory/generate", description: "Generate a new AI-powered theory note", keywords: ["generate theory", "new theory", "create theory"] },
];

const searchPagesLocally = (query) => {
  const q = query.toLowerCase();
  return STATIC_PAGES.filter(
    (page) =>
      page.title.toLowerCase().includes(q) ||
      page.keywords.some((kw) => kw.includes(q))
  ).slice(0, 5);
};

const getFlatItems = (results) => {
  const items = [];
  if (results.notes.length > 0) {
    items.push({ type: "header", label: "DSA Notes" });
    results.notes.forEach((n) => items.push({ ...n, section: "notes" }));
  }
  if (results.theories.length > 0) {
    items.push({ type: "header", label: "Theory Notes" });
    results.theories.forEach((t) => items.push({ ...t, section: "theories" }));
  }
  if (results.pages.length > 0) {
    items.push({ type: "header", label: "Pages" });
    results.pages.forEach((p) => items.push({ ...p, section: "pages" }));
  }
  return items;
};

const GlobalSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ notes: [], theories: [], pages: [] });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const totalResults = results.notes.length + results.theories.length + results.pages.length;

  // Perform search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults({ notes: [], theories: [], pages: [] });
      setLoading(false);
      return;
    }

    // Always search pages locally first
    const localPages = searchPagesLocally(query);

    if (!isLoggedIn) {
      // Unauthenticated: pages only, no API call
      setResults({ notes: [], theories: [], pages: localPages });
      setIsOpen(true);
      setSelectedIndex(-1);
      return;
    }

    // Authenticated: call API for notes + theories, merge with local pages
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await globalSearch(query);
        if (data?.success) {
          setResults({
            notes: data.results.notes || [],
            theories: data.results.theories || [],
            pages: localPages,
          });
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch {
        // Fall back to just pages on API error
        setResults({ notes: [], theories: [], pages: localPages });
        setIsOpen(true);
        setSelectedIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isLoggedIn]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        setMobileOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile search on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileOpen && window.innerWidth < 640) {
        setMobileOpen(false);
        setQuery("");
        setResults({ notes: [], theories: [], pages: [] });
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  const handleSelect = (item) => {
    setIsOpen(false);
    setMobileOpen(false);
    setQuery("");

    if (item.section === "notes") {
      navigate(`/notes/${item._id}`);
    } else if (item.section === "theories") {
      navigate(`/theory/${item._id}`);
    } else if (item.section === "pages") {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e) => {
    const items = getFlatItems(results).filter((i) => i.type !== "header");
    const lastIdx = items.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < lastIdx ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : lastIdx));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(items[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults({ notes: [], theories: [], pages: [] });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const renderDropdown = () => (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border-default bg-bg-surface shadow-2xl shadow-black/30 overflow-hidden z-50 animate-fade-in"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-text-light">
          <Loader2 size={18} className="animate-spin text-primary" />
          <span className="text-xs font-medium">Searching...</span>
        </div>
      ) : totalResults === 0 ? (
        <div className="flex flex-col items-center gap-1 py-8 text-text-light">
          <Search size={24} className="opacity-40" />
          <p className="text-xs font-medium">No results found</p>
          <p className="text-[11px] opacity-60">Try different keywords</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
          {results.notes.length > 0 && (
            <div>
              <div className="sticky top-0 bg-bg-surface/95 backdrop-blur-sm px-3 py-2 border-b border-border-default">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                  <FileText size={11} />
                  DSA Notes
                </span>
              </div>
              {results.notes.map((note, i) => (
                <button
                  key={`note-${note._id}`}
                  onClick={() => handleSelect({ ...note, section: "notes" })}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer border-b border-border-default/50 last:border-b-0 hover:bg-bg-soft ${
                    selectedIndex === i ? "bg-primary/10 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 shrink-0 mt-0.5">
                    <FileText size={13} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-main truncate">
                        {note.title || "Untitled Note"}
                      </span>
                      {note.difficulty && DIFFICULTY_COLORS[note.difficulty] && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLORS[note.difficulty]}`}>
                          {note.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {note.platform && (
                        <span className="text-[11px] text-text-muted">{note.platform}</span>
                      )}
                      {note.language && (
                        <span className="text-[10px] font-mono text-text-light bg-bg-soft px-1.5 py-0.5 rounded">
                          {note.language}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.theories.length > 0 && (
            <div>
              <div className="sticky top-0 bg-bg-surface/95 backdrop-blur-sm px-3 py-2 border-b border-border-default">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                  <BookOpen size={11} />
                  Theory Notes
                </span>
              </div>
              {results.theories.map((theory, i) => (
                <button
                  key={`theory-${theory._id}`}
                  onClick={() => handleSelect({ ...theory, section: "theories" })}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer border-b border-border-default/50 last:border-b-0 hover:bg-bg-soft ${
                    selectedIndex === results.notes.length + i ? "bg-primary/10 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-500/10 shrink-0 mt-0.5">
                    <BookOpen size={13} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-text-main truncate block">
                      {theory.title}
                    </span>
                    <span className="text-[11px] text-text-muted mt-0.5 block">
                      Theory Note
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.pages.length > 0 && (
            <div>
              <div className="sticky top-0 bg-bg-surface/95 backdrop-blur-sm px-3 py-2 border-b border-border-default">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                  <Compass size={11} />
                  Pages
                </span>
              </div>
              {results.pages.map((page, i) => (
                <button
                  key={`page-${page.path}`}
                  onClick={() => handleSelect({ ...page, section: "pages" })}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer border-b border-border-default/50 last:border-b-0 hover:bg-bg-soft ${
                    selectedIndex === results.notes.length + results.theories.length + i
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sky-500/10 shrink-0 mt-0.5">
                    <Compass size={13} className="text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-text-main truncate block">
                      {page.title}
                    </span>
                    <span className="text-[11px] text-text-muted mt-0.5 block truncate">
                      {page.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden sm:block relative flex-1 max-w-lg mx-auto">
        {/* Search Input */}
        <div
          className={`flex items-center gap-2 rounded-lg border bg-bg-surface transition-all duration-200 ${
            isOpen && query.trim().length >= 2
              ? "border-primary ring-1 ring-primary/30 shadow-lg shadow-primary/5"
              : "border-border-default hover:border-border-strong"
          }`}
        >
          <div className="flex items-center justify-center pl-3 shrink-0">
            {loading ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <Search size={16} className="text-text-light" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2 && totalResults > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isLoggedIn ? "Search notes, theory, pages..." : "Search pages..."}
            className="flex-1 bg-transparent py-2.5 pr-2 text-sm text-text-main placeholder:text-text-light outline-none"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="flex items-center justify-center pr-3 text-text-light hover:text-text-main transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

          {/* Cmd+K hint */}
          {!query && (
            <div className="hidden md:flex items-center gap-1 pr-3 shrink-0">
              <kbd className="px-1.5 py-0.5 rounded border border-border-default bg-bg-soft/50 text-[10px] font-mono font-medium text-text-light leading-none">
                {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-border-default bg-bg-soft/50 text-[10px] font-mono font-medium text-text-light leading-none">
                K
              </kbd>
            </div>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && query.trim().length >= 2 && renderDropdown()}
      </div>

      {/* Mobile Search Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border-default bg-bg-surface text-text-light hover:text-text-main hover:border-border-strong transition-all cursor-pointer"
        aria-label="Open search"
      >
        <Search size={18} />
      </button>

      {/* Mobile Full-Screen Search Overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-bg-base/98 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col h-full max-w-[1400px] mx-auto px-4 pt-4 pb-6">
            {/* Mobile search header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`flex-1 flex items-center gap-2 rounded-xl border bg-bg-surface transition-all duration-200 ${
                  query.trim().length >= 2
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border-default"
                }`}
              >
                <div className="flex items-center justify-center pl-3 shrink-0">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin text-primary" />
                  ) : (
                    <Search size={18} className="text-text-light" />
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isLoggedIn ? "Search notes, theory, pages..." : "Search pages..."}
                  className="flex-1 bg-transparent py-3 pr-2 text-base text-text-main placeholder:text-text-light outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="flex items-center justify-center pr-3 text-text-light hover:text-text-main transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setQuery("");
                  setResults({ notes: [], theories: [], pages: [] });
                  setIsOpen(false);
                }}
                className="shrink-0 px-3 py-3 text-sm font-semibold text-text-light hover:text-text-main transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Mobile results */}
            <div className="flex-1 overflow-y-auto overscroll-contain -mx-4 px-4">
              {query.trim().length >= 2 && (
                <>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-text-light">
                      <Loader2 size={20} className="animate-spin text-primary" />
                      <span className="text-sm font-medium">Searching...</span>
                    </div>
                  ) : totalResults === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-text-light">
                      <Search size={32} className="opacity-40" />
                      <p className="text-sm font-medium">No results found</p>
                      <p className="text-xs opacity-60">Try different keywords</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {results.notes.length > 0 && (
                        <div>
                          <div className="sticky top-0 bg-bg-base/95 backdrop-blur-sm py-2 border-b border-border-default mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                              <FileText size={11} />
                              DSA Notes
                            </span>
                          </div>
                          {results.notes.map((note) => (
                            <button
                              key={`m-note-${note._id}`}
                              onClick={() => handleSelect({ ...note, section: "notes" })}
                              className="w-full flex items-start gap-3 px-3 py-3 text-left transition-colors rounded-lg hover:bg-bg-soft cursor-pointer"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                                <FileText size={14} className="text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-text-main truncate">{note.title}</span>
                                  {note.difficulty && DIFFICULTY_COLORS[note.difficulty] && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLORS[note.difficulty]}`}>
                                      {note.difficulty}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {note.platform && <span className="text-xs text-text-muted">{note.platform}</span>}
                                  {note.language && (
                                    <span className="text-[10px] font-mono text-text-light bg-bg-soft px-1.5 py-0.5 rounded">{note.language}</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {results.theories.length > 0 && (
                        <div>
                          <div className="sticky top-0 bg-bg-base/95 backdrop-blur-sm py-2 border-b border-border-default mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                              <BookOpen size={11} />
                              Theory Notes
                            </span>
                          </div>
                          {results.theories.map((theory) => (
                            <button
                              key={`m-theory-${theory._id}`}
                              onClick={() => handleSelect({ ...theory, section: "theories" })}
                              className="w-full flex items-start gap-3 px-3 py-3 text-left transition-colors rounded-lg hover:bg-bg-soft cursor-pointer"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 shrink-0">
                                <BookOpen size={14} className="text-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-text-main truncate block">{theory.title}</span>
                                <span className="text-xs text-text-muted mt-0.5 block">Theory Note</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {results.pages.length > 0 && (
                        <div>
                          <div className="sticky top-0 bg-bg-base/95 backdrop-blur-sm py-2 border-b border-border-default mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                              <Compass size={11} />
                              Pages
                            </span>
                          </div>
                          {results.pages.map((page) => (
                            <button
                              key={`m-page-${page.path}`}
                              onClick={() => handleSelect({ ...page, section: "pages" })}
                              className="w-full flex items-start gap-3 px-3 py-3 text-left transition-colors rounded-lg hover:bg-bg-soft cursor-pointer"
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/10 shrink-0">
                                <Compass size={14} className="text-sky-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-text-main truncate block">{page.title}</span>
                                <span className="text-xs text-text-muted mt-0.5 block truncate">{page.description}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {query.trim().length < 2 && (
                <div className="flex flex-col items-center gap-4 py-16 text-text-light">
                  <Search size={40} className="opacity-20" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Search across all content</p>
                    <p className="text-xs mt-1 opacity-60">Type at least 2 characters to start searching</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded border border-border-default bg-bg-soft/50 text-[10px] font-mono">Esc</span>
                      <span>to close</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
