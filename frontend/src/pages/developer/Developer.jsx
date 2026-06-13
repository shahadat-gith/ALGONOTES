import React, { useState, useEffect } from "react";
import DeveloperSkeleton from "../../components/skeletons/DeveloperSkeleton";

// Clean, modular component sub-systems imports
import DevHero from "../../components/developer/DevHero";
import DevSocials from "../../components/developer/DevSocials";
import DevSkills from "../../components/developer/DevSkills";
import DevEducation from "../../components/developer/DevEducation";

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
      }finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <DeveloperSkeleton />;
  if (!profile) return <div className="text-center py-20 text-xs font-bold text-[var(--text-muted)]">could not find developer information. please check back later.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12 mt-10">
      
      {/* Card Row 1: Hero Banner Component (Full-Width) */}
      <DevHero personalInfo={profile.personalInfo} />

      {/* Card Row 2: Social Channels Array Grid (Full-Width card layer) */}
      <DevSocials socialLinks={profile.socialLinks} />

      {/* Card Row 3: Technical Skills Matrix Block (Full-Width) */}
      <DevSkills skills={profile.skills} />

      {/* Card Row 4: Chronological Education Path (Full-Width) */}
      <DevEducation education={profile.education} />

      {/* last updates */}
      <div className="text-center pt-4 flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--text-light)] font-mono select-none">
        <span>Last updated on {profile.meta.lastUpdated}</span>
      </div>

    </div>
  );
};

export default Developer;