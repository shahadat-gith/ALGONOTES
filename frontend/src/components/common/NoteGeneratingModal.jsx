import React from "react";
import { Clock3, Loader2, Sparkles } from "lucide-react";

const NoteGeneratingModal = ({
  isOpen,
  title = "Creating your notes",
  subtitle = "We are organizing the content, refining the explanations, and preparing a clean result for you.",
  footerNote = "This usually takes under two minutes.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/75 backdrop-blur-sm animate-fade-in select-none px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-default bg-bg-surface shadow-2xl animate-scale-up">
        <div className="bg-gradient-to-r from-primary/12 via-primary/5 to-transparent px-6 py-5 border-b border-border-default">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={12} className="stroke-[2.2]" />
            <span>Working on it</span>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="animate-spin stroke-[2]" size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-text-main">
                {title}
              </h3>
              <p className="text-sm leading-6 text-text-light max-w-md">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-border-default bg-bg-base/60 p-4">
            <div className="flex items-center justify-between text-xs font-medium text-text-muted">
              <span>Preparing your result</span>
              <span>In progress</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-soft">
              <div className="h-full w-2/3 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="grid gap-2 text-sm text-text-light sm:grid-cols-2">
              <div className="rounded-xl border border-border-default bg-bg-surface px-3 py-2.5">
                Structuring the response for readability
              </div>
              <div className="rounded-xl border border-border-default bg-bg-surface px-3 py-2.5">
                Checking examples, sections, and flow
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-text-muted">
            <Clock3 size={14} className="stroke-[2]" />
            <span>{footerNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteGeneratingModal;