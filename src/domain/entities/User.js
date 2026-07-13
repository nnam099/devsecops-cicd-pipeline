/**
 * User domain entity. Pure business object — no framework, no DB,
 * no HTTP concerns. This is what SAST tools should find "clean":
 * no raw SQL, no request objects, no I/O.
 */
class User {
  constructor({
    id, email, passwordHash, createdAt,
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  /** Never expose passwordHash outside the domain/application layers. */
  toPublicJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}

module.exports = { User };
