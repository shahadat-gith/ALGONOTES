import mongoose from "mongoose";

const { Schema } = mongoose;

const DiscussionSchema = new Schema(
  {
    content: {
      type: String,
      default: "",
    },

    generatedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const TopicSchema = new Schema(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },

    discussionStatus: {
      type: String,
      enum: ["pending", "processing", "ready", "failed"],
      default: "pending",
    },

    discussionFailureReason: {
      type: String,
      default: "",
    },

    discussion: {
      type: DiscussionSchema,
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

TopicSchema.index({
  application: 1,
});

TopicSchema.index({
  application: 1,
  completed: 1,
});

export const Topic =
  mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
