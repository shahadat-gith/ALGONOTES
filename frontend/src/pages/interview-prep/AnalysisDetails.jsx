import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import { getApplication } from "../../api/interviewPrepApi.js";

import Button from "../../components/common/Button";
import Glow from "../../components/common/Glow";

import AnalysisContainer from "../../components/interview-prep/AnalysisContainer.jsx";

import TopicsContainer from "../../components/interview-prep/TopicsContainer.jsx";

import AnalysisDetailsSkeleton from "../../components/skeletons/AnalysisDetailsSkeleton";

const PreparationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const appRes = await getApplication(id);

      if (!appRes?.success) throw new Error("Application not found");
      
      // Backend returns { data: { application, topics } }
      setApplication(appRes.data?.application || appRes.data);
      setTopics(appRes.data?.topics || []);
    } catch (err) {
      setError("Could not load preparation data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <AnalysisDetailsSkeleton />;
  }

  if (error || !application) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <ShieldAlert size={40} className="text-text-muted stroke-[1.5]" />
          <p className="text-text-muted text-sm">{error || "Preparation not found."}</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/interview-prep/dashboard")}>
            <ArrowLeft size={14} className="stroke-[2]" />
            <span>Back to Preparations Workspace</span>
          </Button>
        </div>
      </div>
    );
  }

  const { company, role, analysis } = application;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-6 select-none animate-fade-in relative overflow-hidden">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <AnalysisContainer analysis={analysis} company={company} role={role} />

      {/* Topics Layout Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <h2 className="text-base font-semibold tracking-tight text-text-main">
              Topics you should study
            </h2>
        </div>

        {topics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-default bg-bg-surface p-8 text-center shadow-card">
            <p className="text-sm text-text-muted">No topics generated yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <TopicsContainer topics={topics} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreparationDetail;