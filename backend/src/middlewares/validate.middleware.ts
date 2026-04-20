import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.ts";

export const validate = (schema: ZodObject) => 
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((err:any) => err.message);
            throw new ApiError(400, "Validation Error", errorMessages);
        }
        next(error);
    }
};