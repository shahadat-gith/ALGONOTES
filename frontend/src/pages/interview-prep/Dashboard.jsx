import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import {
  getApplications,
  deleteApplication,
} from "../../api/interviewPrepApi.js";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import DeleteConfirm from "../../components/common/DeleteConfirm";
import Glow from "../../components/common/Glow";

import InterviewDashboardSkeleton from "../../components/skeletons/InterviewDashboardSkeleton.jsx";

import ApplicationCard from "../../components/interview-prep/ApplicationCard.jsx";

const Dashboard = () => {
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
      console.log("Error in interview prep dashboard :", err)
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
        setApplications((prev) =>
          prev.filter((app) => app._id !== deleteTargetId),
        );
      }
    } catch (err) {
      toast.error("Failed to delete.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return <InterviewDashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5 w-full">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-text-main">
            Interview Preparation
          </h1>
          <p className="text-sm text-text-light">
            Upload your resume and job description to get a personalized prep
            roadmap.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/interview-prep/analyse")}
          className="h-10 px-4 text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-2 shadow-sm"
        >
          <Sparkles size={14} className="stroke-[2.2]" />
          <span>New Application</span>
        </Button>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No apllication yet"
          description="Create your first interview preparation by uploading your resume and a job description."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onDelete={handleOpenDeleteModal}
            />
          ))}
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

export default Dashboard;
