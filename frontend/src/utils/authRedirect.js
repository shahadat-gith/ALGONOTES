export const getSafeNextPath = (rawNext, fallback = "/") => {
  if (!rawNext || typeof rawNext !== "string") {
    return fallback;
  }

  const trimmed = rawNext.trim();

  // Only allow in-app absolute paths to prevent open redirects.
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject paths with a scheme-like pattern such as /http://...
  if (/^\/\w+:\/\//.test(trimmed)) {
    return fallback;
  }

  return trimmed;
};

export const toLoginWithNext = (nextPath) => {
  const safeNext = getSafeNextPath(nextPath, "/");
  return `/login?next=${encodeURIComponent(safeNext)}`;
};
