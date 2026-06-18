import React, { useState, useEffect } from "react";
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
  Heart,
} from "lucide-react";

import { quicklinks } from "../../constants/quicklinks";

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentVersion, setCurrentVersion] = useState("v.1.0.1");

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
              An advanced note making app for different kind of topics like dsa
              problems and other core cs subjects like DBMS, OS, CN using AI.
            </p>
          </div>

          {/* COLUMN B: COMPANY / LEGAL DOCUMENTATION INDEX */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-light select-none">
              Disclaimers
            </h4>
            <ul className="space-y-3 text-xs font-medium text-text-muted">
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-text-main flex items-center gap-2.5 transition-colors group"
                >
                  <ShieldCheck
                    size={14}
                    className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]"
                  />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-text-main flex items-center gap-2.5 transition-colors group"
                >
                  <FileText
                    size={14}
                    className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]"
                  />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/data-privacy"
                  className="hover:text-text-main flex items-center gap-2.5 transition-colors group"
                >
                  <Database
                    size={14}
                    className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]"
                  />
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
              <div className="space-y-1 px-1">
                {quicklinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
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
            </ul>
          </div>
        </div>

        {/* 2. BASELINE SUMMARY ROW FOOTER BAR */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-border-default pt-8 text-xs text-text-muted font-medium">
          {/* Copyright Declaration */}
          <p className="tracking-wide order-2 lg:order-1 text-center lg:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-text-main tracking-wider">
              ALGO<span className="text-primary font-black">NOTES</span>
            </span>
            . All rights reserved.
          </p>

          {/* Automated Build Sync Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] font-mono order-1 lg:order-2">
            <span className="flex items-center gap-1 bg-bg-soft/40 px-2.5 py-1 rounded-md border border-border-default text-text-muted">
              build:{" "}
              <span className="text-text-main font-semibold">
                {currentVersion}
              </span>
            </span>
            <span className="flex items-center gap-1 text-text-light">
              Last updated:{" "}
              <span className="text-text-muted font-medium">{lastUpdated}</span>
            </span>
          </div>

          {/* Core Sign-off Attribution */}
          <div className="flex items-center gap-1.5 shrink-0 order-3 text-text-light">
            <span>Developed with</span>
            <Heart
              size={12}
              className="text-rose-500 fill-rose-500 animate-pulse"
            />
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
