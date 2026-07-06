import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Clock3,
  ShieldCheck,
  FileText,
  Database,
  Heart,
  Sparkles,
  ExternalLink,
  Terminal,
  BookOpen,
  BookmarkCheck,
  ShieldAlert,
} from "lucide-react";

import Glow from "../common/Glow";

// Platform external URLs configuration
const platformLinks = [
  { label: "LeetCode", url: "https://leetcode.com", description: "Problem solving" },
  { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org", description: "CS Fundamentals" },
  { label: "CodeForces", url: "https://codeforces.com", description: "Competitive coding" },
  { label: "CodeChef", url: "https://www.codechef.com", description: "Monthly contests" },
];

// Defined internally to keep the component pure and focused strictly on your notes system
const footerQuicklinks = [
  {
    to: "/notes/generate",
    label: "Generate DSA Notes",
    icon: Sparkles,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/notes",
    label: "Your DSA Notes",
    icon: FileText,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/theory/generate",
    label: "Generate Theory Notes",
    icon: BookOpen,
    activeColor: "group-hover:text-primary",
  },
  {
    to: "/theory",
    label: "Your Theory Notes",
    icon: BookmarkCheck,
    activeColor: "group-hover:text-primary",
  },
];

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentVersion] = useState("v1.0.2");

  useEffect(() => {
    const fetchLastUpdate = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/shahadat-gith/ALGONOTES/commits?per_page=1",
        );

        if (!response.ok) {
          throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();
        const latestCommit = data?.[0];
        const commitDate = latestCommit?.commit?.committer?.date;

        const formattedDate = new Date(commitDate).toLocaleString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        });

        setLastUpdated(formattedDate);
      } catch (error) {
        console.error("Error fetching from GitHub in footer:", error);
        setLastUpdated(null);
      }
    };
    fetchLastUpdate();
  }, []);

  return (
    <footer className="w-full border-t border-border-default/60 bg-bg-base pt-20 pb-8 mt-24 select-none">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="overflow-hidden rounded-3xl border border-border-default bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 p-6 sm:p-8 shadow-card">

        <Glow preset={"topCenter"}/>
          
          {/* Main Footer Grid Layout */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1fr]">
            
            {/* Brand Presentation */}
            <div className="space-y-5 sm:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles size={12} className="stroke-[2.2]" />
                <span>Study smarter</span>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="text-primary transition-transform duration-300 group-hover:rotate-6 shrink-0">
                  <img src="/logo.png" alt="ALGONOTES logo" className="h-11 w-11 rounded-full" />
                </div>
                <div className="leading-tight">
                  <p className="text-lg font-semibold tracking-tight text-text-main">
                    ALGO<span className="text-primary font-black">NOTES</span>
                  </p>
                  <p className="text-xs md:text-sm text-text-light mt-0.5">
                    AI-assisted revision notes for coding and theory.
                  </p>
                </div>
              </div>

              <p className="max-w-md text-sm leading-7 text-text-muted">
                Create polished coding notes, organize theory concepts, and keep your revision material easy to revisit whenever you study.
              </p>

              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-base/70 px-4 py-2 text-sm font-semibold text-text-main transition-all hover:border-primary/30 hover:text-primary hover:bg-bg-base"
              >
                <span>Admin Portal</span>
                <ArrowRight size={14} className="stroke-[2]" />
              </Link>
            </div>

            {/* Quicklinks (Internal Arrays Integration) */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-light select-none">
                Quicklinks
              </h4>
              <div className="space-y-1">
                {footerQuicklinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-sm text-text-muted transition-all hover:bg-bg-soft/50 hover:text-text-main group"
                    >
                      <div className="rounded-lg bg-bg-soft p-1.5 text-text-light transition-colors group-hover:text-primary">
                        <IconComponent size={14} className={`stroke-[1.9] ${link.activeColor}`} />
                      </div>
                      <span className="font-medium tracking-tight group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Platform Resource Links */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-light select-none">
                Platform Links
              </h4>
              <div className="space-y-1">
                {platformLinks.map((platform) => (
                  <a
                    key={platform.label}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-xl border border-transparent px-2.5 py-2 text-sm text-text-muted transition-all hover:bg-bg-soft/50 hover:text-text-main group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-bg-soft p-1.5 text-text-light transition-colors group-hover:text-primary">
                        <Terminal size={14} className="stroke-[1.9]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium tracking-tight">{platform.label}</span>
                        <span className="text-[10px] text-text-light group-hover:text-text-muted transition-colors">{platform.description}</span>
                      </div>
                    </div>
                    <ExternalLink size={12} className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 stroke-[2] text-text-light" />
                  </a>
                ))}
              </div>
            </div>

            {/* Documentation Privacy and Logs */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-light select-none">
                Policies and info
              </h4>
              <div className="space-y-2 text-sm font-medium text-text-muted">
                <Link
                  to="/privacy"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border-default/60 bg-bg-base/40 px-4 py-2.5 transition-all hover:border-border-default hover:text-text-main group"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                    <span>Privacy Policy</span>
                  </span>
                  <ArrowRight size={14} className="stroke-[2] text-text-light group-hover:text-primary" />
                </Link>
                
                <Link
                  to="/terms"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border-default/60 bg-bg-base/40 px-4 py-2.5 transition-all hover:border-border-default hover:text-text-main group"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                    <span>Terms & Conditions</span>
                  </span>
                  <ArrowRight size={14} className="stroke-[2] text-text-light group-hover:text-primary" />
                </Link>

                <Link
                  to="/data-privacy"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border-default/60 bg-bg-base/40 px-4 py-2.5 transition-all hover:border-border-default hover:text-text-main group"
                >
                  <span className="flex items-center gap-2.5">
                   <ShieldAlert size={14} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
                    <span>Data Privacy</span>
                  </span>
                  <ArrowRight size={14} className="stroke-[2] text-text-light group-hover:text-primary" />
                </Link>

                <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4 mt-2 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                    <Clock3 size={13} className="stroke-[2]" />
                    <span>Build details</span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 text-xs text-text-light">
                    <p>
                      Version: <span className="font-semibold text-text-main">{currentVersion}</span>
                    </p>
                    <p className="leading-relaxed">
                      Updated: <span className="font-medium text-text-main">{lastUpdated || "Unavailable"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Base Copyright row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 border-t border-border-default pt-8 text-sm text-text-muted">
          <p className="tracking-wide text-center lg:text-left">
            © {new Date().getFullYear()} <span className="font-semibold text-text-main">ALGONOTES</span>. Built to help you study with clearer notes and less friction.
          </p>

          <div className="flex items-center gap-1.5 shrink-0 text-text-light">
            <span>Made with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <Link
              to="/developer"
              className="font-semibold text-text-muted hover:text-text-main transition-colors inline-flex items-center gap-1.5 bg-bg-soft/60 px-3 py-1.5 rounded-full border border-border-default/80 shadow-xs"
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