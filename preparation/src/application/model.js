import mongoose from "mongoose";

const { Schema } = mongoose;

/* ---------- Resume ---------- */

const EducationSchema = new Schema(
  {
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number,
  },
  { _id: false },
);

const ExperienceSchema = new Schema(
  {
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    highlights: [String],
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    name: String,
    description: String,
    technologies: [String],
  },
  { _id: false },
);

const ResumeSchema = new Schema(
  {
    skills: [String],
    education: [EducationSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    achievements: [String],
  },
  { _id: false },
);

/* ---------- Job Description ---------- */

const JDSchema = new Schema(
  {
    responsibilities: [String],
    requiredSkills: [String],
    preferredSkills: [String],
    qualifications: [String],
  },
  { _id: false },
);

/* ---------- Analysis ---------- */

const AnalysisSchema = new Schema(
  {
    summary: String,
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
  },
  { _id: false },
);

/* ---------- Temporary Processing Data ---------- */

const ProcessingDataSchema = new Schema(
  {
    resumeText: {
      type: String,
      required: true,
    },
    jobDescriptionText: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

/* ---------- Application ---------- */

const ApplicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    processingData: {
      type: ProcessingDataSchema,
    },

    resume: ResumeSchema,

    jd: JDSchema,

    analysis: AnalysisSchema,

    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },

    failureReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

ApplicationSchema.index({
  user: 1,
  createdAt: -1,
});

ApplicationSchema.index({
  status: 1,
});

export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
