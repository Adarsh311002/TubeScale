import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

import {createBullBoard} from "@bull-board/api";
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter.js"
import { ExpressAdapter } from "@bull-board/express";
import { uploadQueue } from "./queues/videoQueue.js";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true ,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(uploadQueue)],
    serverAdapter: serverAdapter,
});

app.use('/admin/queues',serverAdapter.getRouter());

import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js"

app.use("/api/v1/healthcheck", healthcheckRouter);

app.use("/api/v1/users",userRouter);


export {app}