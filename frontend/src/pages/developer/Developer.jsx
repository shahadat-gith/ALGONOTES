import React, { useState, useEffect } from "react";
import { MapPin, Briefcase, ExternalLink, Terminal, GraduationCap } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope, FaInstagram } from "react-icons/fa";
import Glow from "../../components/common/Glow";

const iconMap = {
  linkedin: FaLinkedin,
  github: FaGithub,
  whatsapp: FaWhatsapp,
  envelope: FaEnvelope,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

const DeveloperSkeleton = () => (
  <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse select-none">
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-bg-surface border border-border-default rounded-xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-bg-soft shrink-0" />
        <div className="flex-1 w-full space-y-3">
          <div className="h-5 bg-bg-soft rounded w-1/3 mx-auto sm:mx-0" />
          <div className="h-3 bg-bg-soft rounded w-1/4 mx-auto sm:mx-0" />
          <div className="h-3 bg-bg-soft rounded w-1/2 mx-auto sm:mx-0" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-bg-surface border border-border-default rounded-xl p-5 space-y-3">
            <div className="h-3 bg-bg-soft rounded w-16" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-6 bg-bg-soft rounded-md w-14" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Developer = () => {
  const GIST_RAW_URL = "https://gist.githubusercontent.com/shahadat-gith/712d93d6d4be21791ff4c6aacc75eb35/raw/shahadat.json";
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(GIST_RAW_URL);
        const json = await response.json();
        setProfile(json);
      } catch (err) {
        console.error("Failed to parse remote identity configuration payload:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <DeveloperSkeleton />;
  
  if (!profile) {
    return (
      <div className="text-center py-24 text-xs font-semibold text-text-muted select-none">
        Could not find developer information. Please check back later.
      </div>
    );
  }

  const { personalInfo, socialLinks, skills, education } = profile;

  return (
    <div className="w-full min-h-screen text-text-main relative overflow-hidden pb-20">
      <Glow preset="hero" />
      <Glow preset="heroTertiary" />
      <Glow preset="bottomLeft" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-12 space-y-8">
        <div className="bg-gradient-to-br from-bg-surface via-bg-surface to-primary/5 border border-border-default rounded-xl p-6 sm:p-8 shadow-card relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-border-strong bg-bg-base shrink-0 overflow-hidden">
              <img src={personalInfo.image} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-xl font-bold text-text-main tracking-tight">{personalInfo.name}</h1>
              <p className="text-xs font-semibold text-primary mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                <Briefcase size={13} className="stroke-[1.75]" />
                <span>{personalInfo.title}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-[11px] text-text-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-text-light" />
                  {personalInfo.currentLocation}
                </span>
                <span className="text-text-light hidden sm:inline">•</span>
                <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:text-primary-hover transition-colors font-medium">
                  {personalInfo.portfolio}
                  <ExternalLink size={10} className="stroke-[2]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="bg-bg-surface border border-border-default rounded-xl p-5 shadow-card">
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link, idx) => {
                const IconComponent = iconMap[link.icon];
                if (!IconComponent) return null;
                return (
                  <a key={idx} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-default bg-bg-base/50 hover:bg-bg-soft hover:border-primary/30 hover:text-primary transition-all duration-200 text-xs font-medium text-text-muted">
                    <IconComponent size={14} />
                    <span className="hidden sm:inline">{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {skills && Object.keys(skills).length > 0 && (
          <div className="bg-bg-surface border border-border-default rounded-xl p-5 sm:p-6 shadow-card">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-main mb-4 flex items-center gap-2">
              <Terminal size={13} className="text-primary stroke-[2]" />
              <span>Skills & Technologies</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(skills).map(([category, list]) => (
                <div key={category} className="p-3.5 rounded-lg bg-bg-base/40 border border-border-default/60">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2 font-mono">{category}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((skill) => (
                      <span key={skill} className="text-[11px] font-mono font-medium px-2.5 py-1 bg-bg-surface text-text-muted border border-border-default rounded-md transition-all duration-150 hover:text-text-main hover:border-primary/40">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="bg-bg-surface border border-border-default rounded-xl p-5 sm:p-6 shadow-card">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-main mb-4 flex items-center gap-2">
              <GraduationCap size={13} className="text-primary stroke-[2]" />
              <span>Education</span>
            </h2>
            <div className="space-y-6">
              {education.map((edu, idx) => (                    <div key={idx} className="relative pl-5 border-l-2 border-border-default last:border-l-0 last:pl-0">
                  <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-bg-surface last:hidden" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <h3 className="text-sm font-semibold text-text-main">{edu.institution}</h3>
                      <p className="text-[11px] text-text-muted mt-0.5">{edu.degree}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-medium text-text-light">{edu.timeline}</span>
                      <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 bg-primary-soft border border-primary/10 rounded-md text-primary">{edu.metric}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.meta && (
          <div className="text-center pt-4 text-[10px] font-mono font-medium text-text-light select-none">
            Last updated: <span className="text-text-muted">{profile.meta.lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Developer;