import { Queue } from "bullmq";


export const uploadQueue = new Queue("upload-tasks", {
  connection: {
    host: "redis", 
    port: 6379,
  },
});