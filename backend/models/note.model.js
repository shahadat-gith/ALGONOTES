import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paragraph", "heading", "bullet", "step", "code", "table"],
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    items: {
      type: [String],
      default: [],
    },

    code: {
      type: String,
      default: "",
    },
  },{ _id: false });

const algorithmStepSchema = new mongoose.Schema(
  {
    stepNo: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },
  },{ _id: false });

const dryRunStepSchema = new mongoose.Schema(
  {
    stepNo: {
      type: Number,
      required: true,
    },

    inputState: {
      type: String,
      trim: true,
      default: "",
    },

    action: {
      type: String,
      trim: true,
      required: true,
    },

    outputState: {
      type: String,
      trim: true,
      default: "",
    },

    explanation: {
      type: String,
      trim: true,
      required: true,
    },
  },{ _id: false });

const edgeCaseSchema = new mongoose.Schema(
  {
    case: {
      type: String,
      trim: true,
      required: true,
    },

    explanation: {
      type: String,
      trim: true,
      required: true,
    },
  },{ _id: false });

const notesSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bruteForce: {
      type: [contentBlockSchema],
      default: [],
    },

    optimalApproach: {
      type: [contentBlockSchema],
      default: [],
    },

    algorithm: {
      type: [algorithmStepSchema],
      default: [],
    },

    dryRun: {
      type: [dryRunStepSchema],
      default: [],
    },

    edgeCases: {
      type: [edgeCaseSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
      index: true,
    },

    lastEditedAt: {
      type: Date,
      default: null,
    },
  },{ timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", notesSchema);

export default Note;