import React from "react";
import { FileText } from "lucide-react";

import Input from "../common/Input";

const JobDetailsForm = ({
  company,
  role,
  jobDescription,
  loading,
  onCompanyChange,
  onRoleChange,
  onJobDescriptionChange,
}) => {
  return (
    <section className="w-full rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6 space-y-5 shadow-card relative">
      <div className="space-y-1 border-b border-border-default pb-4">
        <h2 className="text-base font-semibold tracking-tight text-text-main">
          Job details
        </h2>

        <p className="text-sm text-text-light">
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
          onChange={(e) => onCompanyChange(e.target.value)}
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
          onChange={(e) => onRoleChange(e.target.value)}
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
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          disabled={loading}
          placeholder="Paste the complete job description here..."
          className="w-full min-h-[220px] resize-none rounded-xl border bg-bg-base px-4 py-3 font-mono text-[14px] leading-7 text-text-main transition-all outline-hidden border-border-default focus:border-primary/40 focus:bg-bg-base/80"
        />
      </div>
    </section>
  );
};

export default JobDetailsForm;
