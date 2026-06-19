import Analytics from '../models/analytics.model.js';
import { buildAnalyticsStats, GLOBAL_ANALYTICS_KEY } from '../services/analytics.js';


export const registerPageVisit = async (req, res, next) => {
  try {
    await Analytics.updateOne(
      { key: GLOBAL_ANALYTICS_KEY },
      {
        $inc: { totalPageVisits: 1 },
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          key: GLOBAL_ANALYTICS_KEY,
          totalApiRequests: 0,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const stats = await buildAnalyticsStats();

    res.status(200).json({
      success: true,
      message: 'Page visit recorded successfully.',
      stats,
    });
  } catch (error) {
    next(error);
  }
};


export const getAnalyticsStats = async (req, res, next) => {
  try {
    const stats = await buildAnalyticsStats();

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};