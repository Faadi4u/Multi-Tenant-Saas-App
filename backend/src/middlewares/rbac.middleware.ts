import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.ts";
import { ApiError } from "../utils/ApiError.ts";

type Role = "ADMIN" | "MANAGER" | "MEMBER";

/**
 * 🔒 RBAC Middleware: Restricts access based on user role
 * Usage: authorize("ADMIN", "MANAGER")
 */
export const authorize = (...allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized: No user found");
        }

        if (!allowedRoles.includes(req.user.role as Role)) {
            throw new ApiError(
                403,
                `Access denied. Required roles: ${allowedRoles.join(", ")}`
            );
        }

        next();
    };
};