import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { trackPageVisit } from "../../api/analyticsApi";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  useEffect(() => {
    const visitKey = "algonotes-page-visit-tracked";

    if (sessionStorage.getItem(visitKey) === "true") {
      return;
    }

    trackPageVisit()
      .then(() => {
        sessionStorage.setItem(visitKey, "true");
      })
      .catch(() => {
        // Visit tracking should never block the UI.
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-main antialiased selection:bg-primary/20 selection:text-white relative overflow-hidden">
      
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[55%] right-[-10%] w-[380px] h-[380px] rounded-full bg-primary/6 blur-[120px] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 w-full relative z-10 focus:outline-hidden pt-16">
        <Outlet />
      </main>

      <div className="w-full relative z-10 mt-auto">
        <Footer />
      </div>
      
    </div>
  );
};

export default Layout;