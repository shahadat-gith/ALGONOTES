import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, Clock3, Trash2, XCircle } from "lucide-react";

const ApplicationCard = ({ application, onDelete, onFailedClick }) => {
  const navigate = useNavigate();

  const isFailed = application.status === "failed";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleClick = () => {
    if (isFailed) {
      onFailedClick?.(application);
    } else {
      navigate(`/interview-prep/application/${application._id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer rounded-2xl border p-5 shadow-card transition-all ${
        isFailed
          ? "border-danger/30 bg-danger/[0.03] hover:border-danger/50 hover:shadow-hover"
          : "border-border-default bg-bg-surface hover:border-primary/20 hover:shadow-hover"
      }`}
    >
      <div className="flex justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                <h3 className="text-base font-semibold text-text-main">
                  {application.company}
                </h3>
              </div>
              <span className="text-text-light/30">•</span>
              <div className="flex items-center gap-1.5 text-sm text-text-muted">
                <Briefcase size={14} />
                <span>{application.role}</span>
              </div>

              {isFailed && (
                <span className="inline-flex items-center gap-1 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-[11px] font-semibold text-danger">
                  <XCircle size={11} />
                  Failed
                </span>
              )}
            </div>

            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(application._id);
                }}
                className="rounded-lg p-2 text-text-muted transition hover:bg-danger/10 hover:text-danger cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-text-light">
            {application.analysis?.summary}
          </p>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock3 size={13} />
            <span>{formatDate(application.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
