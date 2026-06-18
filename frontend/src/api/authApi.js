import api from "./axios";

/**
 * Registers a new user account profile instance workspace.
 * @param {Object} payload - Contains { name, email, username, password }
 * @returns {Promise<Object>} Server response: { success: true, message: "..." }
 */
export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

/**
 * Authenticates user credentials and provisions a bearer access token.
 * @param {Object} payload - Contains { email, password }
 * @returns {Promise<Object>} Server response: { success: true, token: "...", user: {...} }
 */
export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

/**
 * Handles account verification phases (OTP dispatch and OTP submission validation).
 * @param {Object} payload - Contains { email, step: "send-otp" | "otp-verification", otp?: "..." }
 * @returns {Promise<Object>} Server response payload metrics
 */
export const verifyUser = async (payload) => {
  const { data } = await api.post("/auth/verify", payload);
  return data;
};

/**
 * Executes multi-step password reset state overrides.
 * @param {Object} payload - Contains { email, step: "send-otp" | "verify-otp" | "reset-password", otp?: "...", newPassword?: "..." }
 * @returns {Promise<Object>} Server verification confirmation payload mapping
 */
export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};