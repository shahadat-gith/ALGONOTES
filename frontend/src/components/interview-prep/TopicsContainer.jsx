import React from "react";

import TopicCard from "./TopicCard";

const TopicsContainer = ({ topics = [] }) => {
  return (
    <section className="space-y-4">
      {topics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-center shadow-card">
          <p className="text-sm text-text-muted">
            No interview topics were generated.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TopicsContainer;