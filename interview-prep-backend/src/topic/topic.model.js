import mongoose from "mongoose";

const { Schema } = mongoose;

const TopicSchema = new Schema(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    order: {
      type: Number,
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

    reason: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

TopicSchema.index({
  application: 1,
  order: 1,
});

export const Topic =
  mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
