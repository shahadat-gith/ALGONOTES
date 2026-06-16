import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import FloatingNavbar from "./FloatingNavbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-main antialiased selection:bg-primary/20 selection:text-white relative overflow-hidden">
      
      {/* 1. CodeHelp Signature Backdrop Radial Glow Element */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 2. Flat Core Header Navigation Bar (Absolute Page Ceiling) */}
      <Navbar />

      {/* 3. High-Index Floating Dock Capsule (Descends Smoothly On Scroll) */}
      <FloatingNavbar />

      {/* 4. Main Viewport Container (100% Full-Canvas Architecture Execution) */}
      <main className="flex-1 w-full relative z-10 focus:outline-hidden">
        <Outlet />
      </main>

      {/* 5. Footer Wrapper */}
      <div className="w-full relative z-10 mt-auto border-t border-border-default/40">
        <Footer />
      </div>
      
    </div>
  );
};

export default Layout;