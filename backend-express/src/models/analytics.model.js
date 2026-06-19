import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalPageVisits: {
      type: Number,
      default: 0,
    },
    totalApiRequests: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema, 'analytics');

export default Analytics;