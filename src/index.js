import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { connectRedis } from "./db/redis.js"; 

import "./workers/videoWorker.js";

dotenv.config({
  path: "./.env",
});


const PORT = process.env.PORT || 8000;


const startServer = async () => {
  try {
 
    await connectDB();
    console.log("MongoDB Connected");

    await connectRedis();
    console.log(" Redis Connected");

    app.listen(PORT, () => {
      console.log(`\n  Server is running at port : ${PORT}`);
      console.log(
        `Health Check: http://localhost:${PORT}/api/v1/healthcheck`
      );
      console.log(
        `Queue Dashboard: http://localhost:${PORT}/admin/queues\n`
      );
    });
  } catch (err) {
    console.error(" Server initialization failed:", err);
    process.exit(1); 
  }
};

startServer();
