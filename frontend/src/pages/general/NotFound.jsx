import React from "react";
import { ArrowLeft, Home, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center px-4 py-12 text-center relative overflow-hidden select-none animate-fade-in">
      {/* Structural Ambient Glow Backdrop Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] h-[450px] bg-danger/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Visual Header Token Container */}
      <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-danger-soft border border-danger/10 text-danger shadow-xs z-10 animate-pulse">
        <HelpCircle size={22} className="stroke-[1.75]" />
        <span className="absolute -right-3.5 -top-2.5 flex h-5 px-1.5 items-center justify-center rounded-full bg-danger text-[9px] font-mono font-bold text-bg-base border border-bg-surface shadow-xs">
          404
        </span>
      </div>

      {/* Main Structural Information Typography */}
      <div className="space-y-2 max-w-md mx-auto relative z-10">
        <h1 className="text-xl font-bold tracking-wide text-text-main sm:text-2xl">
          Page Not Found
        </h1>
        
        {/* Developer-themed subtitling focusing on routing context */}
        <p className="text-xs text-text-muted leading-relaxed font-normal tracking-wide">
          The route you are trying to access does not exist in our system route map. It may have been compiled out, migrated, or completely deleted.
        </p>
      </div>

      {/* Dual Interactivity Actions Segment */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm justify-center relative z-10">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto h-10 border-border-default hover:bg-bg-soft hover:border-border-strong text-text-main font-semibold text-xs"
        >
          <ArrowLeft size={14} className="stroke-[2]" />
          <span>Go Back</span>
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate("/")}
          className="w-full sm:w-auto h-10 font-semibold text-xs"
        >
          <Home size={14} className="stroke-[2]" />
          <span>Return Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;