import mongoose from 'mongoose';

const theorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["processing", "draft", "final", "failed"],
      default: "processing",
      index: true
    },
    topic: {
      type: String,
      required: true,
      index: true
    },
    content: {
      type: String,
      default: ""
    },
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

const Theory = mongoose.models.Theory || mongoose.model('Theory', theorySchema, 'theories');
export default Theory;