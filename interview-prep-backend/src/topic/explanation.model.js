import mongoose from "mongoose";

const { Schema } = mongoose;

const TableOfContentsSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true }
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" }
  },
  { _id: false }
);

const ExplanationSchema = new Schema(
  {
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      unique: true // Strict 1:1 relationship layout context
    },
    
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing"
    },
    
    failureReason: {
      type: String,
      default: ""
    },

    tableOfContents: {
      type: [TableOfContentsSchema],
      default: []
    },
    
    sections: {
      type: [SectionSchema],
      default: []
    },
    
  },
  {
    timestamps: true,
    strict: true
  }
);


export const Explanation = mongoose.models.Explanation || mongoose.model("Explanation", ExplanationSchema);