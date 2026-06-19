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
} from "lucide-react";

import { quicklinks } from "../../constants/quicklinks";

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentVersion] = useState("v1.0.1");

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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.9fr_1fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles size={12} className="stroke-[2.2]" />
                <span>Study smarter</span>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="text-primary transition-transform duration-300 group-hover:rotate-6">
                  <img src="/logo.png" alt="ALGONOTES logo" className="h-11 w-11 rounded-full" />
                </div>
                <div className="leading-tight">
                  <p className="text-lg font-semibold tracking-tight text-text-main">
                    ALGO<span className="text-primary font-black">NOTES</span>
                  </p>
                  <p className="text-sm text-text-light">
                    AI-assisted revision notes for coding and theory topics.
                  </p>
                </div>
              </div>

              <p className="max-w-md text-sm leading-7 text-text-muted">
                Create polished coding notes, organize theory concepts, and keep your revision material easy to revisit whenever you study.
              </p>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-base/70 px-4 py-2 text-sm font-semibold text-text-main transition-all hover:border-primary/30 hover:text-primary"
              >
                <span>Go to dashboard</span>
                <ArrowRight size={14} className="stroke-[2]" />
              </Link>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-light select-none">
                Important pages
              </h4>
              <div className="space-y-2">
                {quicklinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm text-text-muted transition-all hover:border-border-default hover:bg-bg-base/45 hover:text-text-main group"
                    >
                      <div className="mt-0.5 rounded-xl bg-bg-soft p-2 text-text-light transition-colors group-hover:text-primary">
                        <IconComponent size={14} className={`stroke-[1.9] ${link.activeColor}`} />
                      </div>
                      <div>
                        <p className="font-semibold tracking-tight text-text-main group-hover:text-primary">
                          {link.label}
                        </p>
                       
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-light select-none">
                Policies and info
              </h4>
              <div className="space-y-2 text-sm font-medium text-text-muted">
                <Link
                  to="/privacy"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border-default/60 bg-bg-base/40 px-4 py-3 transition-all hover:border-border-default hover:text-text-main group"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck
                      size={14}
                      className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]"
                    />
                    <span>Privacy Policy</span>
                  </span>
                  <ArrowRight size={14} className="stroke-[2] text-text-light group-hover:text-primary" />
                </Link>
                <Link
                  to="/terms"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border-default/60 bg-bg-base/40 px-4 py-3 transition-all hover:border-border-default hover:text-text-main group"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText
                      size={14}
                      className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]"
                    />
                    <span>Terms and Conditions</span>
                  </span>
                  <ArrowRight size={14} className="stroke-[2] text-text-light group-hover:text-primary" />
                </Link>
                <Link
                  to="/data-privacy"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border-default/60 bg-bg-base/40 px-4 py-3 transition-all hover:border-border-default hover:text-text-main group"
                >
                  <span className="flex items-center gap-2.5">
                    <Database
                      size={14}
                      className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]"
                    />
                    <span>Data Privacy</span>
                  </span>
                  <ArrowRight size={14} className="stroke-[2] text-text-light group-hover:text-primary" />
                </Link>
              </div>

              <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  <Clock3 size={13} className="stroke-[2]" />
                  <span>Build details</span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-text-light">
                  <p>
                    Version: <span className="font-semibold text-text-main">{currentVersion}</span>
                  </p>
                  <p>
                    Last updated: <span className="font-medium text-text-main">{lastUpdated || "Unavailable"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 border-t border-border-default pt-8 text-sm text-text-muted">
          <p className="tracking-wide text-center lg:text-left">
            © {new Date().getFullYear()} <span className="font-semibold text-text-main">ALGONOTES</span>. Built to help you study with clearer notes and less friction.
          </p>

          <div className="flex items-center gap-1.5 shrink-0 text-text-light">
            <span>Made with</span>
            <Heart
              size={12}
              className="text-rose-500 fill-rose-500 animate-pulse"
            />
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
