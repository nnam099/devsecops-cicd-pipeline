const bcrypt = require('bcrypt');
const { PasswordHasher } = require('../../application/ports/PasswordHasher');

/**
 * bcrypt-based password hasher.
 *
 * Cost factor 12 is OWASP's current baseline recommendation for
 * bcrypt (as of the OWASP Password Storage Cheat Sheet) — a balance
 * between brute-force resistance and acceptable login latency.
 * This is a good, measurable knob for the thesis performance
 * experiments (hash time vs. cost factor vs. login endpoint latency).
 */
const SALT_ROUNDS = 12;

class BcryptPasswordHasher extends PasswordHasher {
  async hash(plainText) {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }
}

module.exports = { BcryptPasswordHasher };
