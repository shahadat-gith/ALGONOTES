import React from "react";
import Hero from "../../components/home/Hero";
import Stats from "../../components/home/Stats";
import Features from "../../components/home/Features";
import Cta from "../../components/home/Cta";

const Home = () => {
  return (
    <div className="w-full min-h-screen text-text-main relative pb-24">
      <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] max-w-[900px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[15%] right-[-20%] w-[60vw] h-[60vw] max-w-[800px] bg-primary/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] bg-purple-500/4 rounded-full blur-[140px] pointer-events-none z-0" />

      <main className="w-full relative z-10 space-y-24 sm:space-y-36">
        <div className="w-full border-b border-border-default/40 backdrop-blur-xs">
          <Hero />
        </div>

  
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-36 w-full">
          {/* <div className="relative">
            <Stats />
          </div> */}
          
          <div className="relative">
            <Features />
          </div>
          
          {/* <div className="relative">
            <Cta />
          </div> */}
        </div>

      </main>
    </div>
  );
};

export default Home;