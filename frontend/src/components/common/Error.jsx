import React from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Home, ArrowLeft, RefreshCw } from "lucide-react";
import Button from "./Button"; 

const Error = ({ title, message, statusCode = "404" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Ambient Signature Blur Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[200px] h-[200px] bg-danger/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Structural Layout Wrapper */}
      <div className="w-full max-w-lg bg-bg-surface border border-border-default rounded-lg p-6 sm:p-8 space-y-8 shadow-card text-center relative z-10 animate-fade-in">
        
        {/* Visual Error Code Banner Block */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-md bg-danger-soft border border-danger/20 text-danger mb-2">
            <Terminal size={24} className="stroke-[1.75]" />
          </div>
          <h1 className="text-6xl sm:text-7xl font-mono font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-text-main to-text-light">
            {statusCode}
          </h1>
          <h2 className="text-xl font-bold tracking-wide text-text-main">
            {title || "Route Segment Out of Bounds"}
          </h2>
          <p className="text-[14px] leading-6 text-text-muted font-normal max-w-sm mx-auto">
            {message || "The module, execution trace, or link context you are trying to render does not exist or was stripped from memory pools."}
          </p>
        </div>

        {/* Technical Pseudo Log Trace Line */}
        <div className="rounded-sm bg-bg-soft border border-border-default/60 p-3.5 text-left font-mono text-[11px] text-text-muted leading-5">
          <div className="flex items-center gap-1.5 text-[10px] text-text-light font-bold uppercase tracking-wider mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
            <span>Execution Runtime Exception Traces:</span>
          </div>
          <p className="text-danger/90 font-medium">STATUS_CODE: {statusCode}_NOT_FOUND</p>
          <p className="text-text-light">LOCATION: {window.location.pathname}</p>
        </div>

        {/* Action Controls Navigation Cluster */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex-1 font-semibold text-xs tracking-widest uppercase h-11 border border-border-strong text-text-main hover:bg-bg-soft cursor-pointer"
          >
            <ArrowLeft size={13} className="stroke-[2.5]" />
            <span>Go Back</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/dashboard", { replace: true })}
            className="flex-1 font-semibold text-xs tracking-widest uppercase h-11 bg-primary hover:bg-primary-hover shadow-xs cursor-pointer text-white"
          >
            <Home size={13} className="stroke-[2]" />
            <span>Dashboard</span>
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default Error;