
export const serializeNote = (note) => ({
  id: note._id.toString(),
  user_id: note.user_id.toString(),
  status: note.status,
  problem: {
    problemLink: note.problem?.problemLink || "",
    title: note.problem?.title || "",
    platform: note.problem?.platform || "",
    difficulty: note.problem?.difficulty || ""
  },
  note: {
    title: note.note?.title || "",
    overview: note.note?.overview || "",
    approach: note.note?.approach || "",
    complexity: {
      time: note.note?.complexity?.time || "",
      space: note.note?.complexity?.space || ""
    },
    optimalCode: note.note?.optimalCode || ""
  },
  language: note.language || "",
  userCode: note.userCode || "",
  userNotes: note.userNotes || "",
  createdAt: note.createdAt,
  updatedAt: note.updatedAt
});