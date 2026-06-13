import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["LeetCode", "Codeforces", "GFG", "CodingNinjas", "Other"],
      default: "LeetCode",
    },

    problemLink: String,

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },

    language: {
      type: String,
      enum: ["C++", "Java", "Python", "JavaScript", "TypeScript", "C"],
      required: true,
    },
    topics: {
      type: [String],
      default: [],
    },

    userCode: {
      type: String,
      required: true,
    },

    isBookmarked: {
      type: Boolean,
      default: false,
    },

    needsRevision: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", problemSchema);

export default Problem;
