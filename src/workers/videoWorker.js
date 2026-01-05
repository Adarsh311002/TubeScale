import { User } from "../models/user.models.js";
import { Worker } from "bullmq";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";  

const videoWorker = new Worker(
  "upload-tasks",
  async (job) => {
    const { userId, avatarLocalPath, coverLocalPath } = job.data;
    const updateData = {};

    try {
      if (avatarLocalPath) {
        const avatarResult = await uploadOnCloudinary(avatarLocalPath);
        if (avatarResult?.url) updateData.avatar = avatarResult.url;
      }

      if (coverLocalPath) {
        const coverResult = await uploadOnCloudinary(coverLocalPath);
        if (coverResult?.url) updateData.coverImage = coverResult.url;
      }

      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(userId, { $set: updateData });
        console.log(`Assets processed for user ${userId}`);
        console.log(`✅ Assets updated in DB for user ${userId}`);

        if (avatarLocalPath && fs.existsSync(avatarLocalPath)) {
          fs.unlinkSync(avatarLocalPath);
        }
        if (coverLocalPath && fs.existsSync(coverLocalPath)) {
          fs.unlinkSync(coverLocalPath);
        }
        console.log(`🗑️ Local temp files purged for user ${userId}`);
      }
      
        
    } catch (error) {
      console.error(`Worker error for user ${userId}:`, error);
      throw error; //bullmqretry
    }
  },
  {
    connection: {
      host: "redis",
      port: 6379,
    },
  }
);

videoWorker.on("ready", () => {
  console.log("👷 Worker is online and watching for jobs...");
});

videoWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});
