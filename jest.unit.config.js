/**
 * Fast unit-test config: no coverage threshold gate here.
 * WHY separate from jest.config.js: unit tests intentionally only
 * exercise domain/application (pure logic, no I/O) — infrastructure
 * and interfaces/http are covered by integration tests against a real
 * Postgres instance (see jest.config.js + tests/integration). Applying
 * the full-project coverage threshold to unit-only runs would be a
 * meaningless gate that always fails by construction.
 */
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/tests/integration/'],
};
