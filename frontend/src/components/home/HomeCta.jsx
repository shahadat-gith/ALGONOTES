import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Button from "../common/Button";

const HomeCta = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-5xl mx-auto px-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 max-w-xl mx-auto relative z-10">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Ready to map out your algorithmic repository sheets?
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-medium">
            Join thousands of student software engineers structuring
            optimization sheets across unified interview preparation paths.
          </p>
        </div>

        <div className="pt-2 relative z-10">
          {/* Fulfills design preference request: 'thoda golden call-to-action for the brands' */}
          <Button
            variant="primary"
            onClick={() => navigate("/register")}
            className="text-xs h-11 px-6 font-extrabold mx-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 border-none shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all inline-flex items-center gap-1 group"
          >
            <Plus
              size={14}
              className="group-hover:rotate-90 transition-transform stroke-[2.5]"
            />
            Initialize Your Account Grid Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;
