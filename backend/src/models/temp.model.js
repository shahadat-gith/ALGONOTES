import mongoose from 'mongoose';

const tempPromptJobSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["processing", "draft", "final", "failed"],
      default: "processing",
      index: true
    },
    topic: {
      type: String,
      required: true
    },
    optimized_instructions: {
      type: String,
      default: null
    },
    error_message: {
      type: String,
      default: null
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

const TempPromptJob = mongoose.models.TempPromptJob || mongoose.model('TempPromptJob', tempPromptJobSchema, 'temp_prompt_jobs');

export default TempPromptJob;