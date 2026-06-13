import axiosInstance from "./axiosInstance";

export const saveNote = async (payload) => {
  const { data } = await axiosInstance.post("/notes/save", payload);
  return data;
};

export const getNoteByProblem = async (problemId) => {
  const { data } = await axiosInstance.get(`/notes/${problemId}`);
  return data;
};

export const getNoteById = async (noteId) => {
  const { data } = await axiosInstance.get(`/notes/id/${noteId}`);
  return data;
};

export const getAllNotesByUser = async () => {
  const { data } = await axiosInstance.get("/notes/user");
  return data;
};