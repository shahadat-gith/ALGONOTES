
import React from "react";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";

const DevHero = ({ personalInfo }) => (
  <div className="bg-white border border-[var(--border-default)]/60 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary-soft)]/10 rounded-full blur-3xl pointer-events-none" />
    
    <img 
      src={personalInfo.image} 
      alt={personalInfo.name}
      className="w-24 h-24 rounded-full border border-[var(--border-default)]/80 object-cover bg-[var(--bg-soft)] shadow-sm shrink-0"
    />

    <div className="space-y-1.5 flex-1">
      <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{personalInfo.name}</h1>
      <p className="text-xs font-bold text-[var(--primary)] flex items-center justify-center sm:justify-start gap-1.5">
        <Briefcase size={13} /> {personalInfo.title}
      </p>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-[var(--text-muted)] font-medium pt-0.5">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-[var(--text-light)]" /> {personalInfo.currentLocation}
        </span>
        <span>•</span>
        <a 
          href={`https://${personalInfo.portfolio}`} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-0.5 hover:text-[var(--primary)] transition-colors font-semibold"
        >
          {personalInfo.portfolio} <ExternalLink size={10} />
        </a>
      </div>
    </div>
  </div>
);

export default DevHero;