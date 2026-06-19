import Analytics from '../models/analytics.model.js';
import Note from '../models/note.model.js';
import Theory from '../models/theory.model.js';
import User from '../models/user.model.js';


export const GLOBAL_ANALYTICS_KEY = 'global';


export const ensureAnalyticsDocument = async () => {
  let analytics = await Analytics.findOne({
    key: GLOBAL_ANALYTICS_KEY,
  });

  if (analytics) {
    return analytics;
  }

  analytics = await Analytics.create({
    key: GLOBAL_ANALYTICS_KEY,
  });

  return analytics;
};


export const buildAnalyticsStats = async () => {
  const analytics = await ensureAnalyticsDocument();

  const [
    totalRegisteredUsers,
    totalCodingNotes,
    totalTheoryNotes,
  ] = await Promise.all([
    User.countDocuments({}),
    Note.countDocuments({}),
    Theory.countDocuments({}),
  ]);

  return {
    totalPageVisits: analytics.totalPageVisits,
    totalApiRequestsServed: analytics.totalApiRequests,
    totalRegisteredUsers,
    totalCodingNotes,
    totalTheoryNotes,
    totalNotesCreated: totalCodingNotes + totalTheoryNotes,
  };
};