import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

const ChatSchema = new Schema(
  {
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      unique: true,
      index: true,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
