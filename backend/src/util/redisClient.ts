import { createClient } from '@redis/client';

// Redis クライアント作成
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    connectTimeout: 20000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Retry limit exhausted');
      }
      return Math.min(retries * 500, 5000);
    },
  },
});

export default redisClient