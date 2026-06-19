
export const serializeTheory = (theory) => ({
  id: theory._id.toString(),
  user_id: theory.user_id.toString(),
  status: theory.status,
  topic: theory.topic || '',
  content: theory.content || '',
  createdAt: theory.createdAt,
  updatedAt: theory.updatedAt
});