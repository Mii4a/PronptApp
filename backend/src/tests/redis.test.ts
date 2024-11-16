import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  legacyMode: true,
});

redisClient.connect().catch((err) => {
  console.error('Redis connection error:', err);
});

const testRedis = async () => {
  try {
    const testData = {
      id: 1,
      name: "sample1",
      role: "USER",
    };

    console.log('Testing Redis connection...');
    await redisClient.set("test-key", JSON.stringify(testData));
    const result = (await redisClient.get("test-key")) ?? "{}";
    console.log("Saved and retrieved data from Redis:", JSON.parse(result));

    if( result !== null ) {
        console.log("Saved and retrieved data from Redis:", JSON.parse(result!));
    } else {
        console.log("Key not found in redis");
    }
  } catch (err) {
    console.error("Redis test error:", err);
  } finally {
    redisClient.quit(); // 接続を終了
  }
};

testRedis();
