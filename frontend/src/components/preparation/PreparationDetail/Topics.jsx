import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, CheckCircle2, Target, FlaskConical, Lightbulb } from "lucide-react";
import Badge from "../../common/Badge";
import Button from "../../common/Button";

const priorityConfig = {
  High: { color: "text-danger bg-danger/10 border-danger/20", icon: Target },
  Medium: { color: "text-warning bg-warning/10 border-warning/20", icon: FlaskConical },
  Low: { color: "text-text-muted bg-bg-soft border-border-default", icon: Lightbulb },
};

const Topics = ({ topics = [] }) => {
  const { id: applicationId } = useParams();
  const navigate = useNavigate();

  if (topics.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-center shadow-card">
        <p className="text-sm text-text-muted">No topics generated yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border-default bg-bg-surface overflow-hidden shadow-card">
      {/* Header Row - Hidden on Mobile */}
      <div className="hidden md:grid grid-cols-2 border-b border-border-default bg-bg-soft/40 text-[11px] font-semibold uppercase tracking-wider text-text-light">
        <div className="py-3.5 px-5">Topic Details (Col 1)</div>
        <div className="py-3.5 px-5 border-l border-border-default/60">Topic Details (Col 2)</div>
      </div>

      {/* Responsive Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-border-default">
        {topics.map((topic, index) => {
          const prio = priorityConfig[topic.priority] || priorityConfig.Medium;
          const PrioIcon = prio.icon;

          // Determine desktop-only borders to maintain the clean tabular layout grid
          const isEven = index % 2 === 0;
          const isLastPair = index >= topics.length - (topics.length % 2 === 0 ? 2 : 1);

          return (
            <div
              key={topic._id}
              className={`py-4 px-5 flex items-start justify-between gap-4 group transition-colors duration-150 hover:bg-bg-soft/10 ${
                topic.completed ? "opacity-60" : ""
              } ${
                !isEven ? "md:border-l md:border-border-default/60" : ""
              } ${
                !isLastPair ? "md:border-b md:border-border-default" : ""
              }`}
            >
              {/* Topic Info block */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors truncate">
                    {topic.title}
                  </span>
                  {topic.completed && (
                    <Badge variant="success" className="text-[10px] px-1.5 py-0 shrink-0">
                      <CheckCircle2 size={10} className="stroke-[2.5]" />
                      <span className="ml-1">Done</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${prio.color}`}>
                    <PrioIcon size={9} className="stroke-[2.5]" />
                    <span>{topic.priority}</span>
                  </span>
                  {topic.reason && (
                    <span className="text-xs text-text-light truncate" title={topic.reason}>
                      • {topic.reason}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Button */}
              <div className="shrink-0 self-center">
                <Button
                  variant="primary"
                  size="sm"
                  className="h-7 text-[11px] px-3 font-semibold shadow-sm"
                  onClick={() => navigate(`/preparation/${applicationId}/topics/${topic._id}`)}
                >
                  <FileText size={11} className="stroke-[2.2]" />
                  <span>Learn</span>
                </Button>
              </div>
            </div>
          );
        })}

        {/* Desktop grid balancing block for odd array counts */}
        {topics.length % 2 !== 0 && (
          <div className="hidden md:block py-4 px-5 border-l border-border-default/60 bg-bg-soft/5" />
        )}
      </div>
    </div>
  );
};

export default Topics;