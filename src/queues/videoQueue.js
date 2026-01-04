import { Queue } from "bullmq";
import { redisClient } from "../db/redis";

export const uploadQueue = new Queue('upload-tasks',{
    connection: redisClient
})