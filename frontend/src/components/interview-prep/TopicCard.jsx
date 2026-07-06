import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
  Lightbulb,
  Target,
} from "lucide-react";

import Badge from "../common/Badge";
import Button from "../common/Button";

const priorityConfig = {
  high: {
    variant: "danger",
    icon: Target,
  },
  medium: {
    variant: "warning",
    icon: FlaskConical,
  },
  low: {
    variant: "secondary",
    icon: Lightbulb,
  },
};

const TopicCard = ({ topic }) => {
  const navigate = useNavigate();
  const { id: applicationId } = useParams();

  const priorityKey = (topic.priority || "medium").toLowerCase();
  const config = priorityConfig[priorityKey] || priorityConfig.medium;
  const PriorityIcon = config.icon;

  return (
    <div className="group rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card transition-all duration-200 hover:border-primary/20 hover:shadow-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="text-sm font-bold">
              {String(topic.order).padStart(2, "0")}
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="truncate text-base font-semibold text-text-main transition-colors group-hover:text-primary">
                {topic.title}
              </h3>

              <Badge
                variant={config.variant}
                className="flex items-center gap-1 text-[11px]"
              >
                <PriorityIcon size={11} className="stroke-[2]" />
                <span>{topic.priority}</span>
              </Badge>
            </div>

            <p className="text-sm leading-6 text-text-light">
              {topic.reason}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="shrink-0"
          onClick={() =>
            navigate(
              `/interview-prep/${applicationId}/topics/${topic._id}`
            )
          }
        >
          <span>Learn</span>
          <ArrowRight size={14} className="stroke-[2]" />
        </Button>
      </div>
    </div>
  );
};

export default TopicCard;
