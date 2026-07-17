const mockRedisClient = {
  on: jest.fn(),
  connect: jest.fn(),
  sendCommand: jest.fn(),
  close: jest.fn(),
  isOpen: true,
};
const mockCreateClient = jest.fn(() => mockRedisClient);
const mockRedisStore = jest.fn().mockImplementation((options) => ({ options }));

jest.mock('redis', () => ({
  createClient: mockCreateClient,
}));

jest.mock('rate-limit-redis', () => ({
  RedisStore: mockRedisStore,
}));

const {
  connectRateLimitRedis,
} = require('../../../../src/infrastructure/cache/RedisRateLimitStore');

describe('RedisRateLimitStore', () => {
  const logger = { error: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisClient.isOpen = true;
    mockRedisClient.connect.mockResolvedValue(undefined);
    mockRedisClient.sendCommand.mockResolvedValue(1);
    mockRedisClient.close.mockResolvedValue(undefined);
  });

  test('uses the in-process fallback when no Redis URL is configured', async () => {
    const connection = await connectRateLimitRedis({ url: '', logger });

    expect(connection.storeFactory).toBeUndefined();
    expect(mockCreateClient).not.toHaveBeenCalled();
    await expect(connection.close()).resolves.toBeUndefined();
  });

  test('connects Redis and creates isolated stores for each limiter', async () => {
    const connection = await connectRateLimitRedis({
      url: 'redis://localhost:6379',
      logger,
    });

    expect(mockCreateClient).toHaveBeenCalledWith({
      url: 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: expect.any(Function),
      },
    });
    expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);

    const store = connection.storeFactory('auth');
    expect(store.options.prefix).toBe('taskapi:rate-limit:auth:');

    await store.options.sendCommand('INCR', 'client-key');
    expect(mockRedisClient.sendCommand).toHaveBeenCalledWith(['INCR', 'client-key']);
  });

  test('logs Redis errors and closes an open client during shutdown', async () => {
    const connection = await connectRateLimitRedis({
      url: 'redis://localhost:6379',
      logger,
    });
    const errorHandler = mockRedisClient.on.mock.calls.find(([event]) => event === 'error')[1];
    const redisError = new Error('connection lost');

    errorHandler(redisError);
    expect(logger.error).toHaveBeenCalledWith(
      { err: redisError },
      'Redis rate-limit store error',
    );

    await connection.close();
    expect(mockRedisClient.close).toHaveBeenCalledTimes(1);
  });
});
