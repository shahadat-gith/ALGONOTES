import React from "react";
import { ExternalLink, Code2 } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";

const iconMap = {
  linkedin: FaLinkedin,
  github: FaGithub,
  whatsapp: FaWhatsapp,
  envelope: FaEnvelope,
  instagram: FaInstagram,
  facebook: FaFacebook
};

const DevSocials = ({ socialLinks }) => (
  <div className="bg-bg-surface border border-border-default rounded-md p-5 shadow-card space-y-4 select-none">
    
    {/* Section Group Title Header */}
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-light font-mono">
      Connect Network
    </h3>
    
    {/* Dynamic Social Channel Array Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {socialLinks.map((link, idx) => {
        const IconComponent = iconMap[link.icon] || Code2;
        return (
          <a
            key={idx}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-sm border border-border-default bg-bg-soft/20 hover:bg-bg-soft hover:border-border-strong transition-all duration-200 group"
          >
            {/* Visual Icon and Content Node Group */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-sm bg-bg-base text-text-muted border border-border-default group-hover:text-primary group-hover:border-primary/20 group-hover:bg-primary-soft/10 transition-colors shrink-0">
                <IconComponent size={14} />
              </div>
              
              <div className="overflow-hidden flex flex-col gap-0.5">
                <h4 className="text-xs font-semibold text-text-main truncate tracking-wide">
                  {link.label}
                </h4>
                <p className="text-[10px] text-text-light truncate font-mono tracking-tight">
                  {link.subtitle}
                </p>
              </div>
            </div>
            
            {/* Action Directives Link Label Trigger */}
            <span className="text-[10px] font-medium text-text-light group-hover:text-primary transition-colors shrink-0 flex items-center gap-1 font-mono pl-2">
              <span>{link.actionText}</span> 
              <ExternalLink size={10} className="text-text-light group-hover:text-primary transition-colors stroke-[1.75]" />
            </span>
          </a>
        );
      })}
    </div>
  </div>
);

export default DevSocials;