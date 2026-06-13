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
  <div className="bg-white border border-[var(--border-default)]/60 rounded-2xl p-5 shadow-sm space-y-4">
    <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">Connect Network</h3>
    {/* Grid arrangement allowing full horizontal cards to split naturally on responsive screens */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {socialLinks.map((link, idx) => {
        const IconComponent = iconMap[link.icon] || Code2;
        return (
          <a
            key={idx}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-default)]/40 hover:bg-[var(--bg-soft)] transition-colors group bg-[var(--bg-surface)]"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-lg bg-[var(--bg-soft)] text-[var(--text-muted)] border border-[var(--border-default)]/20 group-hover:bg-[var(--primary-soft)]/20 group-hover:text-[var(--primary)] transition-colors shrink-0">
                <IconComponent size={14} />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-[var(--text-main)] truncate">{link.label}</h4>
                <p className="text-[9px] text-[var(--text-light)] truncate">{link.subtitle}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-light)] group-hover:text-[var(--primary)] transition-colors shrink-0 flex items-center gap-0.5 font-mono pl-2">
              {link.actionText} <ExternalLink size={8} />
            </span>
          </a>
        );
      })}
    </div>
  </div>
);

export default DevSocials;