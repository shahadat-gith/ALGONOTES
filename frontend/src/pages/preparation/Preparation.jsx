import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, Clock3, ExternalLink, FileText, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { getApplications, deleteApplication } from "../../api/preparationApi";
import NoteHeader from "../../components/common/NoteHeader";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import DeleteConfirm from "../../components/common/DeleteConfirm";
import Glow from "../../components/common/Glow";

const statusConfig = {
  processing: { label: "Processing", variant: "warning" },
  ready: { label: "Ready", variant: "success" },
  failed: { label: "Failed", variant: "danger" },
};

const Preparation = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getApplications();
      if (res?.success) {
        setApplications(res.data || []);
      }
    } catch (err) {
      toast.error("Could not load your preparations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await deleteApplication(deleteTargetId);
      if (res?.success) {
        setApplications((prev) => prev.filter((app) => app._id !== deleteTargetId));
        toast.success("Preparation deleted.");
      }
    } catch (err) {
      toast.error("Failed to delete.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <NoteHeader
        title="Interview Preparation"
        description="Upload your resume and job description to get a personalized prep roadmap."
        btnText="New Preparation"
        onBtnClick={() => navigate("/preparation/new")}
      />

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-full bg-bg-surface border border-border-default rounded-xl p-5 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 bg-bg-soft rounded-xs w-48" />
                <div className="h-6 bg-bg-soft rounded-sm w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-bg-soft/70 rounded-xs w-3/4" />
                <div className="h-3 bg-bg-soft/70 rounded-xs w-1/2" />
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-border-default/60">
                <div className="h-3 bg-bg-soft rounded-xs w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No preparations yet"
          description="Create your first interview preparation by uploading your resume and a job description."
          actionText="New Preparation"
          onAction={() => navigate("/preparation/new")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const statusInfo = statusConfig[app.status] || statusConfig.processing;
            return (
              <div
                key={app._id}
                className="group w-full bg-bg-surface border border-border-default rounded-xl p-5 shadow-card hover:shadow-hover transition-all duration-200 hover:border-primary/20 cursor-pointer"
                onClick={() => navigate(`/preparation/${app._id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-primary stroke-[2]" />
                        <span className="text-base font-semibold text-text-main tracking-tight">
                          {app.company}
                        </span>
                      </div>
                      <span className="text-text-light/30 select-none">•</span>
                      <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Briefcase size={14} className="stroke-[1.75]" />
                        <span>{app.role}</span>
                      </div>
                    </div>

                    {app.analysis && (
                      <p className="text-sm leading-6 text-text-light line-clamp-2">
                        {app.analysis.summary || "No analysis summary available."}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Clock3 size={13} className="stroke-[1.75]" />
                        <span>{formatDate(app.createdAt)}</span>
                      </div>
                      
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={statusInfo.variant}
                      className="text-[11px] px-2.5 py-0.5"
                    >
                      <div className="flex items-center gap-1.5">
                        {app.status === "processing" && (
                          <Loader2 size={10} className="animate-spin" />
                        )}
                        <span>{statusInfo.label}</span>
                      </div>
                    </Badge>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteModal(app._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} className="stroke-[2]" />
                    </button>

                    <ExternalLink
                      size={16}
                      className="text-text-light stroke-[1.75] group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirm
        isOpen={isModalOpen}
        title="Delete Preparation"
        message="Are you sure you want to delete this preparation and all its topics? This action cannot be undone."
        confirmText="Yes, Delete"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsModalOpen(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
};

export default Preparation;
