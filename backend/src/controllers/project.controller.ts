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

export const updateProject = asyncHandler(async (req: AuthRequest, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    // ✅ Validate params
    if (!projectId || Array.isArray(projectId)) {
        throw new ApiError(400, "Invalid projectId");
    }

    if (!req.user?._id || !req.user?.tenantId) {
        throw new ApiError(401, "Unauthorized");
    }

    const project = await Project.findOne({
        _id: new mongoose.Types.ObjectId(projectId),
        tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Only owner or ADMIN can update
    if (
        project.ownerId.toString() !== req.user._id.toString() &&
        req.user.role !== "ADMIN"
    ) {
        throw new ApiError(403, "You don't have permission to update this project");
    }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project updated"));
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res) => {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
        throw new ApiError(400, "Invalid projectId");
    }

    if (!req.user?.tenantId) {
        throw new ApiError(401, "Unauthorized");
    }

    const project = await Project.findOne({
        _id: new mongoose.Types.ObjectId(projectId),
        tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    await project.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project deleted"));
});