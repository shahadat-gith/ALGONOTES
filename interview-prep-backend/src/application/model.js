import mongoose from "mongoose";

const { Schema } = mongoose;

/* ---------- Analysis ---------- */

const AnalysisSchema = new Schema(
  {
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      technical: {
        type: [String],
        default: [],
      },

      tools: {
        type: [String],
        default: [],
      },

      concepts: {
        type: [String],
        default: [],
      },

      softSkills: {
        type: [String],
        default: [],
      },
    },

    recommendations: {
      type: [String],
      default: [],
    },

    interviewFocus: {
      type: [String],
      default: [],
    },
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
      index: true,
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

    processingData: ProcessingDataSchema,

    analysis: AnalysisSchema,

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
      index: true,
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

ApplicationSchema.index({ user: 1, createdAt: -1 });

export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
