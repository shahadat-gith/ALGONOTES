import mongoose from "mongoose";

const { Schema } = mongoose;

const TableOfContentsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const MetadataSchema = new Schema(
  {
    language: String,

    caption: String,

    headers: [String],
    rows: [[Schema.Types.Mixed]],

    highlightLines: [Number],
  },
  {
    _id: false,
    strict: false,
  },
);

const BlockSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "diagram", "code", "table", "tip", "warning", "note"],
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    metadata: {
      type: MetadataSchema,
      default: () => ({}),
    },
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    blocks: {
      type: [BlockSchema],
      default: [],
    },
  },
  { _id: false },
);

const ExplanationSchema = new Schema(
  {
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    failureReason: {
      type: String,
      default: "",
    },

    tableOfContents: {
      type: [TableOfContentsSchema],
      default: [],
    },

    sections: {
      type: [SectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

export const Explanation =
  mongoose.models.Explanation ||
  mongoose.model("Explanation", ExplanationSchema);
