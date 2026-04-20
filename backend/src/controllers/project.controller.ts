import mongoose from "mongoose";
import { Project } from "../models/project.model.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

export const createProject = asyncHandler(async (req: AuthRequest, res) => {
  const { name, description } = req.body;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const project = await Project.create({
    name,
    description,
    ownerId: new mongoose.Types.ObjectId(req.user._id),
    tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created"));
});

export const getTenantProjects = asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const projects = await Project.find({
    tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, projects));
});