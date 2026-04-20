import type  {Request , Response} from "express";
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import {authRouter} from "../src/routes/auth.routes.ts"
import { projectRouter } from "./routes/project.routes.ts";
import { taskRouter } from "./routes/task.routes.ts";
import { inviteRouter } from "./routes/invite.routes.ts";
import { handleStripeWebhook } from "./controllers/webhook.controller.ts";

export const app = express();

app.post(
    "/api/v1/webhooks/stripe", 
    express.raw({ type: "application/json" }), 
    handleStripeWebhook
);

app.use(express.json({limit: "16kb"}));

app.use(express.urlencoded({extended: true , limit: "16kb"}));

app.use(cors({origin: process.env.CORS_ORIGIN}));

app.use(cookieParser());

app.get("/app" , (req: Request , res: Response)  => {
    res.json({
        message: "Hello world",
        success: true
    })
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/invites", inviteRouter);

app.use(errorMiddleware);
