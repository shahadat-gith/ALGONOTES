import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-main)]">
      
      {/* 1. Top Header Navbar (Visible on Desktop) */}
      <Navbar />

      {/* 2. Main Content Viewport */}
      <main className="flex-1">
         <Outlet />
      </main>

      {/* 3. Footer (Visible on Desktop, hidden on Mobile) */}
      <Footer />
      
    </div>
  );
};

export default Layout;