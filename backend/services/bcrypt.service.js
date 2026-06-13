import bcrypt from "bcryptjs";

/**
 * Service to handle data encryption and comparison tasks
 */
const bcryptService = {
  /**
   * Hashes a plain text password string.
   * @param {string} password - The plain text password to hash
   * @param {number} [saltRounds=10] - Number of salt rounds to apply (default: 10)
   * @returns {Promise<string>} The hashed password string
   */
  hashPassword: async (password, saltRounds = 10) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  },

  /**
   * Compares a plain text string with an existing database hash.
   * @param {string} password - The plain text password input
   * @param {string} hashedPassword - The stored database hash to compare against
   * @returns {Promise<boolean>} True if match, otherwise false
   */
  comparePassword: async (password, hashedPassword) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  },
};

export default bcryptService;


