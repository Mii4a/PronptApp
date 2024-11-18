import { createClient } from "@redis/client";

const testRedis = async () => {
    const redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      legacyMode: true,
    });
  
    try {
      await redisClient.connect();
  
      const testData = {
        id: "1",
        name: "sample1",
        role: "USER",
      };
  
      console.log("Saving test data to Redis...");
      await redisClient.set("test-key", JSON.stringify(testData));
  
      const result = await redisClient.get("test-key");
      console.log("Retrieved data from Redis:", JSON.parse(result || "{}"));
  
    } catch (error) {
      console.error("Redis test error:", error);
    } finally {
      try {
        await redisClient.quit(); // 接続を確実に終了
        console.log("Redis connection closed.");
      } catch (err) {
        console.error("Error while closing Redis connection:", err);
      }
    }
  };
  
  testRedis();