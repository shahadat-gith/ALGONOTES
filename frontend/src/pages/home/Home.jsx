import React from "react";

// Clean modular subsystem imports
import HomeHero from "../../components/home/HomeHero";
import HomeStats from "../../components/home/HomeStats";
import HomeFeatures from "../../components/home/HomeFeatures";
import HomeCta from "../../components/home/HomeCta";

const Home = () => {
  return (
    // Outer shell completely unrestricted to allow the hero section to hit absolute 100% width canvas limits
    <div className="w-full min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] relative overflow-hidden selection:bg-[var(--primary-soft)] selection:text-[var(--primary)] pb-16">
      
      {/* Ambient Background Mesh Orbs — Now spreading smoothly across the entire window view */}
      <div className="absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-[var(--primary-soft)]/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="w-full relative z-10 space-y-20 sm:space-y-28">
        
        {/* Section 1: Hero takes full width naturally */}
        <div className="w-full bg-white/40 border-b border-[var(--border-default)]/40">
          <HomeHero />
        </div>

        {/* Section 2, 3 & 4: Contained in standard max-width layouts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
          <HomeStats />
          <HomeFeatures />
          <HomeCta />
        </div>

      </main>
    </div>
  );
};

export default Home;