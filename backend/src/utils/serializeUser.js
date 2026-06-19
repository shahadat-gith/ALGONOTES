
export const serializeUser = (user) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    avatar: {
      url: user.avatar?.url || "",
      public_id: user.avatar?.public_id || "",
    },
    verificationOptions: {
      status: user.verificationOptions?.status || "pending",
    },
  };
};