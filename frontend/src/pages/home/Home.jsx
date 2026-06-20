import React from "react";

import HomeAnalyticsPanel from "../../components/home/HomeAnalyticsPanel";
import HomeAbout from "../../components/home/HomeAbout";
import HomeCta from "../../components/home/HomeCta";
import HomeFaq from "../../components/home/HomeFaq";
import HomeHero from "../../components/home/HomeHero";
import HomeHighlights from "../../components/home/HomeHighlights";
import HomeWorkflow from "../../components/home/HomeWorkflow";

const Home = () => {
  return (
    <div className="w-full min-h-screen text-text-main relative overflow-hidden pb-16 sm:pb-20">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[50rem] w-[50rem] rounded-full bg-primary/18 blur-[180px]" />
        <div className="absolute top-[28%] left-[6%] h-[24rem] w-[24rem] rounded-full bg-primary/12 blur-[130px]" />
        <div className="absolute top-[35%] right-[4%] h-[22rem] w-[22rem] rounded-full bg-[#6f7cff]/14 blur-[120px]" />
        <div className="absolute bottom-[-12%] left-1/2 -translate-x-1/2 h-[30rem] w-[56rem] max-w-[94vw] rounded-full border border-white/8" />
        <div className="absolute bottom-[-16%] left-1/2 -translate-x-1/2 h-[36rem] w-[74rem] max-w-[98vw] rounded-full border border-white/6" />
      </div>

      <main className="w-full relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 space-y-14 sm:space-y-18">
        <HomeHero />
        <HomeWorkflow />
        <HomeHighlights />
        <HomeAnalyticsPanel />
        <HomeAbout />
        <HomeFaq />
        <HomeCta />
      </main>
    </div>
  );
};

export default Home;
