const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');

async function connectRateLimitRedis({ url, logger }) {
  if (!url) {
    return {
      storeFactory: undefined,
      close: async () => {},
    };
  }

  const client = createClient({
    url,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
  });

  client.on('error', (err) => {
    logger.error({ err }, 'Redis rate-limit store error');
  });

  await client.connect();

  return {
    storeFactory: (name) => new RedisStore({
      prefix: `taskapi:rate-limit:${name}:`,
      sendCommand: (...args) => client.sendCommand(args),
    }),
    close: async () => {
      if (client.isOpen) {
        await client.close();
      }
    },
  };
}

module.exports = { connectRateLimitRedis };
