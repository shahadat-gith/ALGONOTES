import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  Upload,
  Sparkles,
  CircleHelp,
  Loader2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createApplication,
  checkApplicationStatusForPolling,
} from "../../api/preparationApi";
import { useBackoffPolling } from "../../hooks/useBackoffPolling";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Glow from "../../components/common/Glow";
import ProcessingModal from "../../components/preparation/common/ProcessingModal";
import ErrorModal from "../../components/preparation/common/ErrorModal";

const NewPreparation = () => {
  const navigate = useNavigate();
  const { startPolling, stopPolling } = useBackoffPolling();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10 MB.");
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!company.trim()) {
      toast.error("Please enter the company name.");
      return;
    }
    if (!role.trim()) {
      toast.error("Please enter the job role.");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.error("Job description must be at least 50 characters.");
      return;
    }
    if (!resumeFile) {
      toast.error("Please upload your resume (PDF).");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company", company.trim());
      formData.append("role", role.trim());
      formData.append("jobDescription", jobDescription.trim());
      formData.append("resume", resumeFile);

      const initResponse = await createApplication(formData);

      if (!initResponse?.success || !initResponse?.applicationId) {
        throw new Error("Queue rejected.");
      }

      startPolling({
        resourceId: initResponse.applicationId,
        checkStatusFn: checkApplicationStatusForPolling,
        onSuccess: () => {
          navigate(`/preparation/${initResponse.applicationId}`, {
            replace: true,
          });
        },
        onFailure: (errMsg) => {
          setLoading(false);
          setError(errMsg || "Processing failed.");
        },
      });
    } catch (err) {
      stopPolling();
      setLoading(false);
      setError(err.message || "Could not start preparation. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in relative flex flex-col gap-6 select-none">
      <Glow preset="subtle" />
      <Glow preset="topRight" />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        {/* LEFT COLUMN - Job Details */}
        <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card relative">
          <div className="space-y-1 border-b border-border-default pb-4">
            <h2 className="text-base font-semibold tracking-tight text-text-main">
              Job details
            </h2>
            <p className="text-sm leading-6 text-text-light">
              Tell us about the position you're preparing for.
            </p>
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4 space-y-4">
            <Input
              label="Company"
              type="text"
              name="company"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={loading}
              placeholder="e.g., Google, Stripe, Atlassian"
              className="text-sm h-11 bg-bg-base border-border-default rounded-md pl-4 w-full text-text-main placeholder-text-light focus:border-primary/40 focus:outline-hidden"
            />

            <Input
              label="Role / Position"
              type="text"
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              placeholder="e.g., Senior Software Engineer"
              className="text-sm h-11 bg-bg-base border-border-default rounded-md pl-4 w-full text-text-main placeholder-text-light focus:border-primary/40 focus:outline-hidden"
            />
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              <FileText size={13} className="stroke-[2.1]" />
              <span>Job Description</span>
            </div>

            <textarea
              name="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
              placeholder="Paste the full job description here... (minimum 50 characters)"
              style={{ fieldSizing: "content" }}
              className="w-full min-h-[200px] resize-none rounded-xl border bg-bg-base px-4 py-3 font-mono text-[14px] leading-7 text-text-main transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80"
            />
            <p className="mt-2 text-xs text-text-light">
              {jobDescription.length} / 50 min characters
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN - Resume Upload + Control Actions */}
        <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card">
          <div className="flex justify-between items-start border-b border-border-default pb-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-text-main">
                Resume upload
              </h2>
              <p className="text-sm leading-6 text-text-light">
                Upload your resume in PDF format.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleSubmit}
              className="h-11 shrink-0 px-5 text-sm font-semibold shadow-xs cursor-pointer"
              disabled={
                loading ||
                !company.trim() ||
                !role.trim() ||
                !jobDescription.trim() ||
                !resumeFile
              }
            >
              <Sparkles size={15} className="stroke-[2.1]" />
              <span>Start Analysis</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
            <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              <Upload size={13} className="stroke-[2]" />
              <span>Resume PDF</span>
            </label>

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-default rounded-xl p-8 bg-bg-base/50 transition-all hover:border-primary/30">
              {resumeFileName ? (
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                    <Upload size={12} className="stroke-[2.5]" />
                    <span>Uploaded</span>
                  </div>
                  <p className="text-sm font-medium text-text-main">
                    {resumeFileName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeFile(null);
                      setResumeFileName("");
                    }}
                    disabled={loading}
                    className="text-xs text-text-muted hover:text-danger transition-colors cursor-pointer"
                  >
                    Remove and re-upload
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <Upload size={22} className="stroke-[2]" />
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                      <span>Click to upload</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-text-light mt-1">
                      PDF only, up to 10 MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0 mt-0.5">
                <CircleHelp size={14} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">
                  What happens next?
                </p>
                <p className="text-xs leading-6 text-text-light mt-1">
                  1. We extract and structure your resume data.
                  <br />
                  2. We analyze the job description against your profile.
                  <br />
                  3. A personalized topic roadmap is generated.
                  <br />
                  4. Each topic has an AI discussion you can read and chat with.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Processing / Loading Modal Overlay */}
      {loading && (
        <ProcessingModal
          title="Analyzing your resume"
          subtitle="We are extracting your resume, comparing it with the job
            description, and building your personalized study roadmap."
        />
      )}

      {/* Error Modal Overlay */}
      {error && <ErrorModal />}
    </div>
  );
};

export default NewPreparation;
