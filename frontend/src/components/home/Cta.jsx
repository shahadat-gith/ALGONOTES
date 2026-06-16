import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "../common/Button";

const Cta = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <div className="bg-gradient-to-br from-bg-surface via-bg-soft/50 to-bg-surface text-text-main rounded-md p-8 sm:p-12 border border-border-default shadow-card relative overflow-hidden text-center space-y-6 select-none">
        
        {/* CodeHelp Neon Ambient Spot Shading Effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 max-w-xl mx-auto relative z-10">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-text-main">
            Ready to master your next DSA interview?
          </h2>
          <p className="text-xs text-text-muted leading-relaxed font-normal tracking-wide">
            Join thousands of developers structuring optimization patterns, complex traces, and dynamic dry-runs across a unified space.
          </p>
        </div>

        <div className="pt-2 relative z-10">
          {/* Premium High-Contrast Golden Button Integration */}
          <Button
            variant="primary"
            onClick={() => navigate("/register")}
            className="text-xs h-11 px-6 font-semibold mx-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-bg-base border-none shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all inline-flex items-center gap-1.5 group cursor-pointer"
          >
            <Plus
              size={15}
              className="group-hover:rotate-90 transition-transform duration-300 stroke-[2.2]"
            />
            <span>Create Your Free Account</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;