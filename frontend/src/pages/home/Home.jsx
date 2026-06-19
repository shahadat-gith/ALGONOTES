import React from "react";

import HomeAnalyticsPanel from "../../components/home/HomeAnalyticsPanel";
import HomeCta from "../../components/home/HomeCta";
import HomeHero from "../../components/home/HomeHero";
import HomeHighlights from "../../components/home/HomeHighlights";
import HomeWorkflow from "../../components/home/HomeWorkflow";


const Home = () => {
  return (
    <div className="w-full min-h-screen text-text-main relative overflow-hidden pb-16 sm:pb-20">
      <div className="absolute top-[-15%] left-[-18%] w-[70vw] h-[70vw] max-w-[900px] bg-success-soft rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] max-w-[820px] bg-primary/10 rounded-full blur-[170px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] left-[12%] w-[55vw] h-[55vw] max-w-[780px] bg-warning-soft rounded-full blur-[170px] pointer-events-none z-0" />

      <main className="w-full relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-14 sm:space-y-18">
        <HomeHero />
        <HomeAnalyticsPanel />
        <HomeWorkflow />
        <HomeHighlights />
        <HomeCta />
      </main>
    </div>
  );
};


export default Home;