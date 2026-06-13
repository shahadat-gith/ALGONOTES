import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Terminal, 
  Code2, 
  ShieldCheck, 
  FileText, 
  Database,
  LayoutDashboard,
  Code,
  BookOpen,
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Dynamic build timestamp to be auto-injected via GitHub CI pipeline actions later
  const [lastUpdated, setLastUpdated] = useState("2026-06-12")
  const [currentVersion, setCurrentVersion] = useState("v.1.0.0")

  return (
    <footer className="w-full border-t border-[var(--border-default)]/60 bg-white pt-12 pb-6 mt-16 select-none font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. MAIN GRID LINK DESK SYSTEM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-2">
          
          {/* COLUMN A: BRAND LOGO & SYSTEM SYNOPSIS */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 text-white font-mono font-black text-xs">
                <img src="/logo.png" alt="logo" style={{ width: "30px" }} />
              </div>
              <span className="text-sm font-black tracking-tight text-[var(--text-main)]">
                ALGO<span className="text-[var(--primary)]">NOTES</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
              An advanced full-stack workspace engineering solution to trace runtime data flows, visualize dry-runs, and capture structural code metrics seamlessly with integrated AI tools.
            </p>
          </div>

          {/* COLUMN B: COMPANY / LEGAL DOCUMENTATION INDEX */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-light)]">
              Disclaimers
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[var(--text-muted)]">
              <li>
                <Link to="/privacy" className="hover:text-[var(--primary)] flex items-center gap-2 transition-colors group">
                  <ShieldCheck size={13} className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[var(--primary)] flex items-center gap-2 transition-colors group">
                  <FileText size={13} className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/data-privacy" className="hover:text-[var(--primary)] flex items-center gap-2 transition-colors group">
                  <Database size={13} className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors" />
                  Data Privacy Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN C: APPLICATION QUICK LINKS DIRECTORY */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-light)]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[var(--text-muted)]">
              <li>
                <Link to="/dashboard" className="hover:text-[var(--primary)] flex items-center gap-2 transition-colors group">
                  <LayoutDashboard size={13} className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors" />
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-[var(--primary)] flex items-center gap-2 transition-colors group">
                  <Code size={13} className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors" />
                  Problem Repository
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-[var(--primary)] flex items-center gap-2 transition-colors group">
                  <BookOpen size={13} className="text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors" />
                  Study Notes Deck
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 2. BASELINE SUMMARY ROW FOOTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-default)]/40 pt-6 text-xs text-[var(--text-muted)] font-semibold">
          
          {/* Copyright Declaration */}
          <p className="tracking-wide">
            © {currentYear} <span className="font-black text-[var(--text-main)] tracking-tight">ALGO<span className="text-[var(--primary)]">NOTES</span></span>. All rights reserved.
          </p>

          {/* Automated Build Sync Indicators */}
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-medium text-[var(--text-light)] font-mono">
            <span className="flex items-center gap-1 bg-[var(--bg-soft)] px-2 py-0.5 rounded-md border border-[var(--border-default)]/30">
              Build Version: {currentVersion}
            </span>
            <span className="flex items-center gap-1 text-[var(--text-muted)]">
              Last updated on: <span className="font-bold text-[var(--text-main)]">{lastUpdated}</span>
            </span>
          </div>

          {/* Core Sign-off Attribution */}
          <div className="flex items-center gap-1 shrink-0">
            <span>Developed with</span>
            <Heart size={11} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <Link 
              to="/developer" 
              className="font-bold text-[var(--text-main)] hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1 bg-[var(--bg-soft)]/60 px-2 py-0.5 rounded-md border border-[var(--border-default)]/30 shadow-sm"
            >
              <Code2 size={12} className="text-[var(--primary)]" /> Shahadat Ali
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;