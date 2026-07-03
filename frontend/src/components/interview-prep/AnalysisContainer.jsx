import React from "react";
import {
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Target,
  Trophy,
  Wrench,
  Lightbulb,
  Users,
  BookOpen,
} from "lucide-react";

import Badge from "../common/Badge";

const MISSING_SKILL_CATEGORIES = [
  { key: "technical", label: "Technical Skills", icon: Lightbulb },
  { key: "tools", label: "Tools & Technologies", icon: Wrench },
  { key: "concepts", label: "Core Concepts", icon: BookOpen },
  { key: "softSkills", label: "Soft Skills", icon: Users },
];

const MissingSkillsSection = ({ missingSkills }) => {
  if (!missingSkills) {
    return (
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
            Missing Skills
          </span>
        </div>
        <p className="text-sm text-text-muted">No missing skills identified.</p>
      </div>
    );
  }

  const hasAny = MISSING_SKILL_CATEGORIES.some(
    ({ key }) =>
      Array.isArray(missingSkills[key]) && missingSkills[key].length > 0,
  );

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
            Missing Skills
          </span>
        </div>
        <p className="text-sm text-text-muted">No missing skills identified.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
          Missing Skills
        </span>
      </div>

      <div className="space-y-4">
        {MISSING_SKILL_CATEGORIES.map(({ key, label, icon: Icon }) => {
          const skills = missingSkills[key];

          if (!Array.isArray(skills) || skills.length === 0) return null;

          return (
            <div key={key}>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-text-light">
                <Icon size={13} className="stroke-[2]" />
                <span>{label}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="danger"
                    className="px-2.5 py-1 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AnalysisContainer = ({ analysis, company, role }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {(company || role) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {company && (
            <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 size={18} className="stroke-[2]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Target Company
                </p>

                <h3 className="font-semibold text-text-main">
                  {company}
                </h3>
              </div>
            </div>
          )}

          {role && (
            <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase size={18} className="stroke-[2]" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted">
                  Target Role
                </p>

                <h3 className="font-semibold text-text-main">
                  {role}
                </h3>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border-default bg-bg-surface p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={16} className="text-primary stroke-[2]" />

          <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
            Analysis Summary
          </span>
        </div>

        <p className="whitespace-pre-line leading-8 text-text-light">
          {analysis.summary}
        </p>
      </div>

      {/* Interview Focus Areas */}
      {analysis.interviewFocus?.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary-soft/30 p-5 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Brain size={16} className="text-primary stroke-[2]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
              Interview Focus Areas
            </span>
          </div>

          <ul className="space-y-3">
            {analysis.interviewFocus.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm leading-6 text-text-light"
              >
                <CheckCircle2
                  size={15}
                  className="mt-1 shrink-0 text-primary stroke-[2]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ListSection
          title="Strengths"
          icon={Trophy}
          iconClass="text-success stroke-[2]"
          items={analysis.strengths}
          emptyMessage="No strengths identified."
        />

        <ListSection
          title="Weaknesses"
          icon={ShieldAlert}
          iconClass="text-warning stroke-[2]"
          items={analysis.weaknesses}
          emptyMessage="No weaknesses identified."
        />

        <SkillSection
          title="Matched Skills"
          variant="success"
          items={analysis.matchedSkills}
          emptyMessage="No matching skills found."
        />

        <MissingSkillsSection missingSkills={analysis.missingSkills} />
      </div>

      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Target size={16} className="text-primary stroke-[2]" />

          <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
            Recommendations
          </span>
        </div>

        {analysis.recommendations?.length ? (
          <ol className="space-y-3 text-sm leading-7 text-text-light list-decimal pl-5">
            {analysis.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-text-muted">
            No recommendations available.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalysisContainer;


const ListSection = ({ title, icon: Icon, iconClass, items, emptyMessage }) => (
  <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
    <div className="mb-4 flex items-center gap-2">
      <Icon size={16} className={iconClass} />

      <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
        {title}
      </span>
    </div>

    {items?.length ? (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-sm leading-6 text-text-light"
          >
            <CheckCircle2
              size={15}
              className="mt-1 shrink-0 text-primary stroke-[2]"
            />

            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-text-muted">{emptyMessage}</p>
    )}
  </div>
);


const SkillSection = ({
  title,
  variant = "success",
  items,
  emptyMessage,
}) => (
  <div className="rounded-2xl border border-border-default bg-bg-surface p-5 shadow-card">
    <div className="mb-4 flex items-center gap-2">
      <CheckCircle2
        size={16}
        className="text-success stroke-[2]"
      />

      <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
        {title}
      </span>
    </div>

    {items?.length ? (
      <div className="flex flex-wrap gap-2">
        {items.map((skill, index) => (
          <Badge
            key={index}
            variant={variant}
            className="px-3 py-1 text-xs font-medium"
          >
            {skill}
          </Badge>
        ))}
      </div>
    ) : (
      <p className="text-sm text-text-muted">
        {emptyMessage}
      </p>
    )}
  </div>
);