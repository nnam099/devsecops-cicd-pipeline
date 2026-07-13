/**
 * Full-suite config (unit + integration). Used by `npm test` in CI,
 * where a real PostgreSQL service container is available (see
 * .github/workflows). Coverage threshold here is the CI quality gate
 * for the whole codebase, including infrastructure and HTTP layers.
 */
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/infrastructure/database/migrate.js',
  ],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 65,
      lines: 65,
      statements: 65,
    },
  },
  testPathIgnorePatterns: ['/node_modules/'],
};
