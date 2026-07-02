import React, { useRef, useState } from "react";
import { CircleHelp, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../common/Button";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ResumeUploadCard = (props) => {

  const { loading, resumeFile, setResumeFile, onSubmit, disabled } = props;

  const inputRef = useRef(null);

  const handleRemove = () => {
    setResumeFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card">
      <div className="flex justify-between items-start border-b border-border-default pb-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-text-main">
            Resume Upload
          </h2>

          <p className="text-sm text-text-light">
            Upload your resume in PDF format.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          loading={loading}
          disabled={disabled}
          onClick={onSubmit}
          className="h-11 shrink-0 px-5 text-sm font-semibold shadow-xs cursor-pointer"
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

        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-default bg-bg-base/50 p-8 transition-all hover:border-primary/30">
          {resumeFile ? (
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                <Upload size={12} className="stroke-[2.5]" />
                <span>Uploaded</span>
              </div>

              <p className="text-sm font-medium text-text-main">
                {resumeFile.name}
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleRemove}
                className="cursor-pointer text-xs text-text-muted transition-colors hover:text-danger"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Upload size={22} className="stroke-[2]" />
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
                  <span>Click to upload</span>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={loading}
                    onChange={(e) => setResumeFile(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>

                <p className="mt-1 text-xs text-text-light">
                  PDF only, up to 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-bg-base/40 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
            <CircleHelp size={14} className="stroke-[2]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-text-main">
              What happens next?
            </p>

            <p className="mt-1 text-xs leading-6 text-text-light">
              1. We extract and structure your resume data.
              <br />
              2. We analyze the job description against your profile.
              <br />
              3. A personalized interview roadmap is generated.
              <br />
              4. Each topic includes an AI-powered explanation to help you
              prepare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeUploadCard;
