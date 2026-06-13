import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Stored as an integer lookup key (e.g., 20260612) to lock the calendar square natively
    dayKey: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    problemsAdded: {
      type: Number,
      default: 0,
    },
    notesGenerated: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true } // Keeps createdAt and updatedAt natively active
);

// Lock index so a user only gets exactly one tracking record per calendar block
activitySchema.index({ user: 1, dayKey: 1 }, { unique: true });

const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
export default Activity;