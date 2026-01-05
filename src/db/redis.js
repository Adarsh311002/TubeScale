import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

redisClient.on('error', (err) => console.log("Redis client error", err));
redisClient.on("connect", () => console.log(" Redis Client Connected"));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis Connection Established");
    } catch (error) {
        console.error("Redis Connection Failed:", error);
        process.exit(1); 
    }
};


export {redisClient,connectRedis};