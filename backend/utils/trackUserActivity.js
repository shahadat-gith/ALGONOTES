import Activity from "../models/activity.model.js";



/**
 * @param {String} userId - The authenticated user's ID
 * @param {'problem' | 'note'} actionType - The workspace module action updated
 */
export const trackUserActivity = async (userId, actionType) => {
  try {
    // Generate an instant timezone-safe numeric tracking key: 20260612
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayNumericKey = parseInt(`${year}${month}${day}`, 10);

    const updateFields = { $inc: { totalCount: 1 } };
    
    if (actionType === "problem") updateFields.$inc.problemsAdded = 1;
    if (actionType === "note") updateFields.$inc.notesGenerated = 1;

    await Activity.findOneAndUpdate(
      { user: userId, dayKey: todayNumericKey },
      updateFields,
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Activity mapping error:", error.message);
  }
};