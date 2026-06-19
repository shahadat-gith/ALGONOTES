import api from "./axios";

/**
 * Retrieves the profile data of the currently authenticated user from the session token.
 * @returns {Promise<Object>} Server response containing user schema parameters.
 */
export const getCurrentUser = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

/**
 * Modifies profile attributes (such as name, username, or avatar configurations) for the active session.
 * @param {Object} payload - Object tracking changed profile parameters.
 * @returns {Promise<Object>} Server verification confirmation: { success: true, user: {...} }
 */
export const updateProfile = async (payload) => {
  const { data } = await api.put("/users/profile", payload);
  return data;
};

/**
 * Permanently deletes the user profile data record along with all cascading study notes out of MongoDB collections.
 * @returns {Promise<Object>} Server action status response configuration.
 */
export const deleteAccount = async () => {
  const { data } = await api.delete("/users/account");
  return data;
};
