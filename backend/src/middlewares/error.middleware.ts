import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.ts"

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;

    if (!(err instanceof ApiError)) {
        statusCode = 500;
        message = "Internal Server Error";
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};