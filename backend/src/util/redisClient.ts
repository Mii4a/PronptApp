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

const connectWithRetry = async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected successfully');
    } catch (err) {
        console.error('Failed to connect to Redis. Retrying in 5 seconds...', err);
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Redisにエラーリスナーを設定
redisClient.on('error', (err) => console.error('Redis Client Error:', err));


export default redisClient