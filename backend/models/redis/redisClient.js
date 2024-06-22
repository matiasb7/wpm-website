import redis from "redis";

export const redisClient = redis.createClient();
redisClient.connect().catch(console.error);
