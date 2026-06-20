import React from "react";

const PRESETS = {
  hero: "top-[-20%] left-1/2 -translate-x-1/2 h-[50rem] w-[50rem] bg-primary/18 blur-[180px]",
  heroSecondary: "top-[28%] left-[6%] h-[24rem] w-[24rem] bg-primary/12 blur-[130px]",
  heroTertiary: "top-[35%] right-[4%] h-[22rem] w-[22rem] bg-[#6f7cff]/14 blur-[120px]",
  layoutTop: "top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-primary/10 blur-[140px]",
  layoutRight: "top-[55%] right-[-10%] w-[380px] h-[380px] bg-primary/6 blur-[120px]",
  auth: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-primary/5 blur-[120px]",
  dashboardHero: "top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[100px]",
  error: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] h-[450px] bg-danger/5 blur-[100px]",
  subtle: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-primary/4 blur-[140px]",
  topRight: "top-[-8%] right-[-6%] w-[400px] h-[400px] bg-primary/8 blur-[130px]",
  bottomLeft: "bottom-[-10%] left-[-6%] w-[350px] h-[350px] bg-primary/6 blur-[110px]",
  topCenter: "top-[5%] left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[300px] bg-primary/10 blur-[150px]",
};

const Glow = ({ preset, className = "" }) => {
  const presetClass = PRESETS[preset] || "";

  return (
    <div
      className={`absolute rounded-full pointer-events-none z-0 ${presetClass} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Glow;
