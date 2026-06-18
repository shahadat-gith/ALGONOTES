import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Layers, 
  Code2, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

// Premium High Contrast Dummy Data mapping to your theme structures
const DUMMY_STATS = [
  { id: 1, label: "Total DSA Notes", count: 42, icon: Code2, trend: "+5 this week", color: "text-primary", bg: "bg-primary-soft" },
  { id: 2, label: "Theory Guides", count: 18, icon: FileText, trend: "+2 this week", color: "text-success", bg: "bg-success-soft" },
  { id: 3, label: "Pending Drafts", count: 7, icon: Clock, trend: "Requires review", color: "text-warning", bg: "bg-warning-soft" },
];

const DUMMY_RECENT_NOTES = [
  { _id: "n1", title: "Optimizing 3-Address Code Generation", type: "Theory", platform: "Compiler Design", info: "6th Sem Labs", date: "2 hours ago", status: "draft" },
  { _id: "n2", title: "Median of Two Sorted Arrays (Hard)", type: "DSA", platform: "LeetCode", info: "C++ • Arrays", date: "1 day ago", status: "final" },
  { _id: "n3", title: "N-Gram Language Models & Smoothing", type: "Theory", platform: "NLP Coursework", info: "Handwritten Reference", date: "3 days ago", status: "final" },
  { _id: "n4", title: "LR(1) Parser Transition Graph Construction", type: "Theory", platform: "Compiler Design", info: "Lab Assignment", date: "4 days ago", status: "draft" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8 text-text-main font-sans select-none animate-fade-in relative z-10">
      
      {/* 1. Welcoming Hero Banner Component Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-bg-surface to-bg-soft border border-border-default rounded-xl p-6 md:p-8 shadow-card relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">
            Welcome back, Shahadat
          </h1>
          <p className="text-xs md:text-sm text-text-muted max-w-xl leading-relaxed">
            Your platform workspace is synced. Continue analyzing architectural pipelines, natural language models, or mapping computational complexity graphs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => navigate("/notes/generate")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-xs font-bold uppercase tracking-wider bg-bg-soft border border-border-strong text-text-main hover:bg-border-default transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <PlusCircle size={14} className="text-text-muted" />
            <span>DSA Note</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/theory/generate")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-xs font-bold uppercase tracking-wider bg-primary text-white hover:bg-primary-hover shadow-xs transition-all duration-200 cursor-pointer active:scale-[0.98] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            <PlusCircle size={14} />
            <span>Theory Note</span>
          </button>
        </div>
      </div>

      {/* 2. Key Platform Statistics Node Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DUMMY_STATS.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.id}
              className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:border-border-strong/60 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-mono block">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors duration-300">
                    {stat.count}
                  </span>
                  <span className="text-[11px] font-medium text-text-light flex items-center gap-1">
                    <TrendingUp size={11} className="text-text-muted" />
                    {stat.trend}
                  </span>
                </div>
              </div>

              <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-xl border border-border-default transition-transform duration-300 group-hover:scale-105`}>
                <IconComponent size={20} className="stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Core Workspace Activity & Analytics Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column Section: Recent Material History Feed (Spans 2 blocks wide) */}
        <div className="lg:col-span-2 bg-bg-surface border border-border-default rounded-xl shadow-card flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border-default flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-text-muted" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-main font-mono">
                Recent Workspace Activity
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/notes")}
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={12} className="transform transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="divide-y divide-border-default/60">
            {DUMMY_RECENT_NOTES.map((note) => (
              <div 
                key={note._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-bg-soft/30 transition-colors duration-200"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-muted">
                    <span className="text-text-light font-sans font-semibold tracking-normal text-xs">
                      {note.platform}
                    </span>
                    <span className="text-text-light/40 select-none">•</span>
                    <span className={`px-1.5 py-0.5 rounded-sm border ${
                      note.type === "DSA" 
                        ? "bg-primary-soft text-primary border-primary/20" 
                        : "bg-bg-soft text-text-muted border-border-default"
                    }`}>
                      {note.type}
                    </span>
                  </div>
                  
                  <h3 
                    onClick={() => navigate(note.type === "DSA" ? `/notes/${note._id}` : `/theory/${note._id}`)}
                    className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors cursor-pointer truncate max-w-xl"
                  >
                    {note.title}
                  </h3>

                  <p className="text-[11px] text-text-light font-medium truncate max-w-lg">
                    {note.info}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-text-light tracking-wide order-2 sm:order-1">
                    {note.date}
                  </span>
                  
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider order-1 sm:order-2 ${
                    note.status === "final" 
                      ? "bg-success/10 text-success border border-success/20" 
                      : "bg-warning/10 text-warning border border-warning/20"
                  }`}>
                    {note.status === "final" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    <span>{note.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Section: System Health Profile Info Cards */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-border-default pb-3">
            <Layers size={14} className="text-text-muted" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-main font-mono">
              Coursework Checklist
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { t: "Compiler Design Handouts", s: "Completed", c: "text-success bg-success/10 border-success/20" },
              { t: "Machine Translation Pipeline", s: "In Progress", c: "text-primary bg-primary-soft border-primary/20" },
              { t: "Lexical Analyzer Transition Table", s: "Pending Review", c: "text-warning bg-warning/10 border-warning/20" }
            ].map((item, idx) => (
              <div key={idx} className="bg-bg-soft/40 border border-border-default/60 rounded-md p-3 flex flex-col gap-1">
                <span className="text-xs font-semibold text-text-main tracking-wide">
                  {item.t}
                </span>
                <span className={`text-[9px] font-bold font-mono uppercase tracking-widest w-fit px-1.5 py-0.5 rounded-sm border ${item.c}`}>
                  {item.s}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;