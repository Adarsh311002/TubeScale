import { Worker } from "bullmq";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const videoWorker = new Worker('upload-tasks', async(job) => {
    const {userId, avatarLocalPath, coverLocalPath} = job.data;
    const updateData = {};

    try {
        if(avatarLocalPath){
            const avatarResult = await uploadOnCloudinary(avatarLocalPath);
            if(avatarResult?.url) updateData.avatar = avatarResult.url;
        }

        if(coverLocalPath){
            const coverResult =  await uploadOnCloudinary(coverLocalPath);
            if(coverResult?.url) updateData.coverImage = coverResult.url;
        }

        if(Object.keys(updateData).length > 0){
            await User.findByIdAndUpdate(userId, {$set : updateData});
            console.log(`Assets processed for user ${userId}`);
        }
    } catch (error) {
        console.error(`Worker error for user ${userId}:` , error);
        throw error;//bullmqretry        
    }

},{
    connection: {host: 'redis', port: 6379}
});