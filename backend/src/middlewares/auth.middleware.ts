import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        tenantId: string;
        role: string;
    };
}

export const verifyJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});