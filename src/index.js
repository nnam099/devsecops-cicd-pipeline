const { start } = require('./interfaces/http/server');

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('TaskAPI failed to start', err);
  process.exit(1);
});
