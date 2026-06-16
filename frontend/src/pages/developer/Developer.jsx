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

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-fade-in pb-20">
      
      {/* Card Row 1: Hero Banner Component (Full-Width Within Core Limits) */}
      <div className="relative z-10">
        <DevHero personalInfo={profile.personalInfo} />
      </div>

      {/* Card Row 2: Social Channels Array Grid */}
      <div className="relative z-10">
        <DevSocials socialLinks={profile.socialLinks} />
      </div>

      {/* Card Row 3: Technical Skills Matrix Block */}
      <div className="relative z-10">
        <DevSkills skills={profile.skills} />
      </div>

      {/* Card Row 4: Chronological Education Path */}
      <div className="relative z-10">
        <DevEducation education={profile.education} />
      </div>

      {/* Meta Build Metrics Timestamp Footer */}
      <div className="text-center pt-6 flex items-center justify-center gap-1.5 text-[10px] font-mono font-medium text-text-light select-none">
        <span>Last updated on:</span>
        <span className="text-text-muted font-semibold">{profile.meta.lastUpdated}</span>
      </div>

    </div>
  );
};

export default Developer;