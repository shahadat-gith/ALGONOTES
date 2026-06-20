import Note from '../models/note.model.js';
import Theory from '../models/theory.model.js';

export const globalSearch = async (req, res, next) => {
  try {
    const query = req.query.q ? req.query.q.trim() : '';

    if (!query || query.length < 2) {
      return res.status(200).json({
        success: true,
        results: { notes: [], theories: [] }
      });
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = { $regex: escapedQuery, $options: 'i' };

    // Search notes
    const notes = await Note.find({
      user_id: req.user._id,
      status: { $in: ['draft', 'final'] },
      $or: [
        { 'problem.title': regex },
        { language: regex },
        { 'problem.platform': regex },
        { 'problem.difficulty': regex },
        { 'problem.topics': regex },
        { 'problem.description': regex },
      ]
    })
      .select('problem.title problem.difficulty problem.platform language status')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Search theories
    const theories = await Theory.find({
      user_id: req.user._id,
      status: { $in: ['draft', 'final'] },
      $or: [
        { topic: regex },
        { content: regex },
      ]
    })
      .select('topic status')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      results: {
        notes: notes.map(n => ({
          _id: n._id,
          title: n.problem?.title || 'Untitled Note',
          difficulty: n.problem?.difficulty || '',
          platform: n.problem?.platform || '',
          language: n.language || '',
          status: n.status,
          type: 'note'
        })),
        theories: theories.map(t => ({
          _id: t._id,
          title: t.topic || 'Untitled Theory',
          status: t.status,
          type: 'theory'
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
