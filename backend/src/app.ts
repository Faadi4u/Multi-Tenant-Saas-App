import type  {Request , Response} from "express";
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import {authRouter} from "../src/routes/auth.routes.ts"
import { projectRouter } from "./routes/project.routes.ts";
import { taskRouter } from "./routes/task.routes.ts";

export const app = express();

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

app.use(errorMiddleware);
