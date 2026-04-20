import { Project } from "../models/project.model.ts";
import { Organization } from "../models/organization.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import type { AuthRequest } from "./auth.middleware.ts";

export const checkPlanLimits = asyncHandler(async (req: AuthRequest, res, next) => {
    const org = await Organization.findById(req.user?.tenantId);
    
    if (org?.plan === "FREE") {
        const projectCount = await Project.countDocuments({ tenantId: org._id });
        if (projectCount >= 5) {
            throw new ApiError(403, "Free plan limit reached (5 projects). Please upgrade to PRO.");
        }
    }
    
    next();
});