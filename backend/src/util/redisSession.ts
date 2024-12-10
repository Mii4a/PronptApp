import redisClient from '@/src/util/redisClient'

export const saveSessionToRedis = async (sessionId: number, data:any): Promise<any> => {
  try {
      await redisClient.set(`user-session:${sessionId}`, JSON.stringify(data), {EX: 86400});
      console.log('Session saved to Redis', sessionId)
  } catch (err) {
      console.error('Error saving session to Redis:', err)
  }
};

export const getSessionFromRedis = async (sessionId: number): Promise<any> => {
  try {
    const data = await redisClient.get(`user-session:${sessionId}`);
    return data ? JSON.parse(data) : null
  } catch (err) {
    console.error('Error fetching session from Redis:', err)
    return null;
  }
}
