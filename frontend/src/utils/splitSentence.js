

/**
 * Splits a prose string into clean sentences without breaking code dot-operators (e.g., mp.count()).
 * @param {string} text - The raw text string to split.
 * @returns {string[]} An array of cleaned, trimmed sentence strings.
 */
export const splitSentence = (text) => {
  if (!text || typeof text !== "string") return [];

  return text
    .split(/\.(?=\s|$)/) // Lookahead: splits on '.' only if followed by space or end of string
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
};