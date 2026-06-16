import React from "react";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";

const DevHero = ({ personalInfo }) => (
  <div className="bg-bg-surface border border-border-default rounded-md p-6 shadow-card relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left select-none">
    {/* CodeHelp Premium Neon Ambient Spot Shading Overlay */}
    <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
    
    {/* Profile Avatar Disk Container */}
    <div className="w-24 h-24 rounded-full border-2 border-border-strong bg-bg-base shadow-inner shrink-0 overflow-hidden relative group">
      <img 
        src={personalInfo.image} 
        alt={personalInfo.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    {/* Identity Metadata Block */}
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      <h1 className="text-xl font-bold text-text-main tracking-wide truncate">
        {personalInfo.name}
      </h1>
      
      <p className="text-xs font-semibold text-primary flex items-center justify-center sm:justify-start gap-1.5 tracking-wide">
        <Briefcase size={14} className="stroke-[1.75]" /> 
        <span>{personalInfo.title}</span>
      </p>
      
      {/* Location & Navigation Links Directory */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-[11px] text-text-muted font-normal pt-1.5 border-t border-border-default/40 mt-1">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} className="text-text-light stroke-[1.75]" /> 
          <span className="tracking-wide">{personalInfo.currentLocation}</span>
        </span>
        
        <span className="text-text-light hidden sm:inline select-none">•</span>
        
        <a 
          href={`https://${personalInfo.portfolio}`} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors font-medium group/link tracking-wide"
        >
          <span>{personalInfo.portfolio}</span> 
          <ExternalLink size={11} className="text-text-light group-hover/link:text-primary transition-colors stroke-[1.75]" />
        </a>
      </div>
    </div>
  </div>
);

export default DevHero;