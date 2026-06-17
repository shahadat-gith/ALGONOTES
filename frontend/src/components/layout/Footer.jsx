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
  const [lastUpdated, setLastUpdated] = useState("2026-06-12");
  const [currentVersion, setCurrentVersion] = useState("v.1.0.0");

  return (
    <footer className="w-full border-t border-border-default/60 bg-bg-base pt-16 pb-8 mt-24 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. MAIN GRID LINK DESK SYSTEM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-4">
          
          {/* COLUMN A: BRAND LOGO & SYSTEM SYNOPSIS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 group">
              <div className="text-primary transition-transform duration-300 group-hover:rotate-6">
                <img src="/logo.png" className="h-10 w-10 rounded-full" />
              </div>
              <span className="text-base font-bold tracking-wider text-text-main">
                ALGO<span className="text-primary font-black">NOTES</span>
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm font-normal">
              An advanced full-stack workspace engineering solution to trace runtime data flows, visualize dry-runs, and capture structural code metrics seamlessly with integrated AI tools.
            </p>
          </div>

          {/* COLUMN B: COMPANY / LEGAL DOCUMENTATION INDEX */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light select-none">
              Disclaimers
            </h4>
            <ul className="space-y-3 text-xs font-medium text-text-muted">
              <li>
                <Link to="/privacy" className="hover:text-text-main flex items-center gap-2.5 transition-colors group">
                  <ShieldCheck size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-text-main flex items-center gap-2.5 transition-colors group">
                  <FileText size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/data-privacy" className="hover:text-text-main flex items-center gap-2.5 transition-colors group">
                  <Database size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                  <span>Data Privacy Engine</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN C: APPLICATION QUICK LINKS DIRECTORY */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light select-none">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs font-medium text-text-muted">
              <li>
                <Link to="/" className="hover:text-text-main flex items-center gap-2.5 transition-colors group capitalize">
                  <LayoutDashboard size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/notes/generate" className="hover:text-text-main flex items-center gap-2.5 transition-colors group capitalize">
                  <Code size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                  <span>Generate Notes</span>
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-text-main flex items-center gap-2.5 transition-colors group capitalize">
                  <BookOpen size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                  <span>Your Notes</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 2. BASELINE SUMMARY ROW FOOTER BAR */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-border-default pt-8 text-xs text-text-muted font-medium">
          
          {/* Copyright Declaration */}
          <p className="tracking-wide order-2 lg:order-1 text-center lg:text-left">
            © {currentYear} <span className="font-bold text-text-main tracking-wider">ALGO<span className="text-primary font-black">NOTES</span></span>. All rights reserved.
          </p>

          {/* Automated Build Sync Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] font-mono order-1 lg:order-2">
            <span className="flex items-center gap-1 bg-bg-soft/40 px-2.5 py-1 rounded-md border border-border-default text-text-muted">
              build: <span className="text-text-main font-semibold">{currentVersion}</span>
            </span>
            <span className="flex items-center gap-1 text-text-light">
              Last updated: <span className="text-text-muted font-medium">{lastUpdated}</span>
            </span>
          </div>

          {/* Core Sign-off Attribution */}
          <div className="flex items-center gap-1.5 shrink-0 order-3 text-text-light">
            <span>Developed with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <Link 
              to="/developer" 
              className="font-semibold text-text-muted hover:text-text-main transition-colors inline-flex items-center gap-1.5 bg-bg-soft/60 px-2.5 py-1 rounded-md border border-border-default/80 shadow-xs"
            >
              <Code2 size={13} className="text-primary" /> 
              <span>Shahadat Ali</span>
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;