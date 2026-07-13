/**
 * Port for password hashing. Kept abstract so the hashing algorithm
 * (currently bcrypt, see infrastructure/auth/BcryptPasswordHasher.js)
 * can be upgraded (e.g., to argon2) without touching use-cases.
 */
class PasswordHasher {
  // eslint-disable-next-line no-unused-vars
  async hash(plainText) {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line no-unused-vars
  async compare(plainText, hash) {
    throw new Error('Not implemented');
  }
}

module.exports = { PasswordHasher };
