import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.on('error', (err) => console.log("Redis client error", err));

const connectRedis = async () => {
    await redisClient.connect();
    console.log("Redis connected Successfully");
}

export {redisClient,connectRedis};