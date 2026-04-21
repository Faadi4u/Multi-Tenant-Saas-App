import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        tenantId: string;
        role: string;
        email: string
    };
}

export const verifyJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Change this line:
const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(`SEC_AUDIT: Request from Tenant [${decodedToken.tenantId}] to [${req.method} ${req.url}]`);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});