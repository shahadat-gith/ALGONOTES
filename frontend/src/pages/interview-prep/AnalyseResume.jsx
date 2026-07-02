import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


import { createApplication, getApplicationStatus } from "../../api/interviewPrepApi.js";

import useInterviewPrepPolling from "../../hooks/useInterviewPrepPolling";

import Glow from "../../components/common/Glow";

import JobDetailsForm from "../../components/interview-prep/JobDetailsForm";
import ResumeUploadCard from "../../components/interview-prep/ResumeUploadCard";

import ProcessingModal from "../../components/interview-prep/ProcessingModal";

import ErrorModal from "../../components/interview-prep/ErrorModal";

import toast from "react-hot-toast";

const AnalyseResume = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const applicationIdRef = useRef(null);

  const STORAGE_KEY = "interview-prep-form";

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      setCompany(data.company || "");
      setRole(data.role || "");
      setJobDescription(data.jobDescription || "");
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        company,
        role,
        jobDescription,
      }),
    );
  }, [company, role, jobDescription]);

  const { startPolling, stopPolling } = useInterviewPrepPolling({
    enabled: false,

    checkStatus: () => getApplicationStatus(applicationIdRef.current),

    onCompleted: () => {
      setLoading(false);
      navigate(`/interview-prep/application/${applicationIdRef.current}`, {
        replace: true,
      });
    },

    onFailed: (data) => {
      setLoading(false);
      setError(data.failureReason || "Processing failed.");
    },
  });



  const handleSubmit = async () => {
    if (loading) return;

    if (!company.trim()) {
      return toast.error("Please enter the company name.");
    }

    if (!role.trim()) {
      return toast.error("Please enter the job role.");
    }

    if (jobDescription.trim().length < 50) {
      return toast.error(
        "Job description must contain at least 50 characters.",
      );
    }

    if (!resumeFile) {
      return toast.error("Please upload your resume.");
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("company", company.trim());
      formData.append("role", role.trim());
      formData.append("jobDescription", jobDescription.trim());
      formData.append("resume", resumeFile);

      const res = await createApplication(formData);

      if (!res?.success || !res?.applicationId) {
        throw new Error(
          res?.message || "Failed to start interview preparation.",
        );
      }

      applicationIdRef.current = res.applicationId;
      setApplicationId(res.applicationId);

      startPolling();
    } catch (err) {
      stopPolling();

      setLoading(false);

      setError(err.message || "Could not start interview preparation.");
    }
  };

  

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-6 animate-fade-in select-none sm:px-6 lg:px-8">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <JobDetailsForm
          company={company}
          role={role}
          jobDescription={jobDescription}
          loading={loading}
          onCompanyChange={setCompany}
          onRoleChange={setRole}
          onJobDescriptionChange={setJobDescription}
        />

        <ResumeUploadCard
          loading={loading}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          onSubmit={handleSubmit}
          disabled={
            loading ||
            !company.trim() ||
            !role.trim() ||
            !jobDescription.trim() ||
            !resumeFile
          }
        />
      </div>

      {loading && (
        <ProcessingModal
          title="Analyzing your resume"
          subtitle="We're extracting your resume, comparing it with the job description, and generating your personalized interview roadmap."
        />
      )}

      {error && (
        <ErrorModal
          type="application"
          resourceId={applicationId}
          title="Analysis Failed"
          error={error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
};

export default AnalyseResume;
