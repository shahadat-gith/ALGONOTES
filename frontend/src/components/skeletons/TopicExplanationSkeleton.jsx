import React from "react";

const TocItem = ({ width = "w-full" }) => (
  <div className={`h-9 rounded-lg bg-bg-soft ${width}`} />
);

const Paragraph = ({ width = "w-full" }) => (
  <div className={`h-4 rounded bg-bg-soft ${width}`} />
);

const TopicExplanationSkeleton = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base animate-pulse">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col border-r border-border-default bg-bg-surface/40">
        <div className="border-b border-border-default px-5 py-4">
          <div className="h-4 w-36 rounded bg-bg-soft" />
        </div>

        <div className="flex-1 space-y-3 overflow-hidden p-4">
          <TocItem />
          <TocItem width="w-11/12" />
          <TocItem width="w-4/5" />
          <TocItem />
          <TocItem width="w-5/6" />
          <TocItem width="w-2/3" />
          <TocItem width="w-4/5" />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="rounded-2xl border border-border-default bg-bg-surface p-8 shadow-card">
            {/* Topic Header */}
            <div className="border-b border-border-default pb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-bg-soft" />

                <div className="space-y-2 flex-1">
                  <div className="h-3 w-28 rounded bg-bg-soft" />
                  <div className="h-8 w-72 rounded bg-bg-soft" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Paragraph />
                <Paragraph width="w-5/6" />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12 pt-8">
              {[1, 2, 3].map((section) => (
                <div
                  key={section}
                  className="border-b border-border-default pb-10 last:border-0"
                >
                  <div className="mb-6 h-6 w-52 rounded bg-bg-soft" />

                  <div className="space-y-3">
                    <Paragraph />
                    <Paragraph />
                    <Paragraph width="w-5/6" />
                    <Paragraph width="w-4/5" />
                  </div>

                  {section === 2 && (
                    <div className="mt-8 rounded-xl border border-border-default bg-bg-base p-5">
                      <div className="space-y-3">
                        <Paragraph width="w-1/3" />
                        <Paragraph />
                        <Paragraph width="w-5/6" />
                        <Paragraph width="w-2/3" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicExplanationSkeleton;