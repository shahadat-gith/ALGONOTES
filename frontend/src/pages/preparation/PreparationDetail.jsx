import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getApplication, getTopicsByApplication } from "../../api/preparationApi";
import { useBackoffPolling } from "../../hooks/useBackoffPolling";

import Button from "../../components/common/Button";
import Glow from "../../components/common/Glow";
import Loader from "../../components/common/Loader";
import ErrorModal from "../../components/modals/ErrorModal";

// Sub-components
import PreparationHeader from "../../components/preparation/PreparationDetail/PreparationHeader";
import ApplicationHero from "../../components/preparation/PreparationDetail/ApplicationHero";
import AnalysisPanel from "../../components/preparation/PreparationDetail/AnalysisPanel";
import Topics from "../../components/preparation/PreparationDetail/Topics";

const PreparationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stopPolling } = useBackoffPolling();

  const [application, setApplication] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const fetchData = useCallback(async () => {
    try {
      const [appRes, topicsRes] = await Promise.all([
        getApplication(id),
        getTopicsByApplication(id),
      ]);

      if (!appRes?.success) throw new Error("Application not found");
      setApplication(appRes.data);
      if (topicsRes?.success) setTopics(topicsRes.data || []);
    } catch (err) {
      toast.error("Failed to load preparation.");
      setError("Could not load preparation data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <Loader text="Loading preparation..." />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <ShieldAlert size={40} className="text-text-muted stroke-[1.5]" />
          <p className="text-text-muted text-sm">{error || "Preparation not found."}</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/preparation")}>
            <ArrowLeft size={14} className="stroke-[2]" />
            <span>Back to Preparations</span>
          </Button>
        </div>
      </div>
    );
  }

  const { company, role, analysis, status } = application;
  const isProcessing = status === "processing";
  const completedCount = topics.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <PreparationHeader isProcessing={isProcessing} />

      <ApplicationHero company={company} role={role} matchScore={analysis?.matchScore} />

      {!isProcessing && <AnalysisPanel analysis={analysis} />}

      {/* Topics Layout Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-text-main">
              Preparation Topics
            </h2>
            <p className="text-xs text-text-light mt-0.5">
              {topics.length} topics • {completedCount} completed
            </p>
          </div>
        </div>

        {isProcessing ? (
          <div className="rounded-2xl border border-border-default bg-bg-surface p-8 text-center space-y-3 shadow-card">
            <Loader2 size={24} className="animate-spin text-primary mx-auto stroke-[2]" />
            <p className="text-sm text-text-muted">
              Your preparation is being analyzed. Topics will appear here once ready.
            </p>
          </div>
        ) : topics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-center shadow-card">
            <p className="text-sm text-text-muted">No topics generated yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Topics topics={topics}/>
          </div>
        )}
      </div>

      <ErrorModal
        isOpen={!!error && !loading}
        title="Error"
        message={error}
        onClose={() => setError("")}
      />
    </div>
  );
};

export default PreparationDetail;