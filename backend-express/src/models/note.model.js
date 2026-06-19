import mongoose from 'mongoose';

const codeImplementationSchema = new mongoose.Schema(
  {
    language: { type: String, default: "C++" },
    code: { type: String, required: true }
  },
  { _id: false }
);

const complexitySchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    space: { type: String, default: "" }
  },
  { _id: false }
);

const approachSchema = new mongoose.Schema(
  {
    complexity: { type: complexitySchema, default: () => ({}) },
    description: { type: String, default: "" },
    codeBlock: { type: codeImplementationSchema, default: null },
    algorithmSteps: { type: [String], default: [] }
  },
  { _id: false }
);

const problemDetailSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    problemLink: { type: String, default: "" },
    platform: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    description: { type: String, default: "" },
    constraints: { type: [String], default: [] },
    testCases: { type: [mongoose.Schema.Types.Mixed], default: [] },
    expectedTimeComplexity: { type: String, default: "" },
    expectedSpaceComplexity: { type: String, default: "" },
    topics: { type: [String], default: [] }
  },
  { _id: false }
);

const noteContentSchema = new mongoose.Schema(
  {
    intuition: { type: String, default: "" },
    edgeCases: { type: [String], default: [] },
    mistakesToAvoid: { type: [String], default: [] },
    dryRun: { type: [mongoose.Schema.Types.Mixed], default: [] },
    bruteForce: { type: approachSchema, default: null },
    better: { type: approachSchema, default: null },
    optimalApproach: { type: approachSchema, default: null }
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["processing", "draft", "final", "failed"],
      default: "processing",
      index: true
    },
    problem: { type: problemDetailSchema, default: () => ({}) },
    note: { type: noteContentSchema, default: () => ({}) },
    language: { type: String, default: "C++" },
    userCode: { type: String, default: "" },
    userNotes: { type: String, default: "" },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema, 'notes');

export default Note;