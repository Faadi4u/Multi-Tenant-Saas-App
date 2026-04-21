import mongoose from "mongoose";
import { Project } from "../models/project.model.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

export const getProjectById = asyncHandler(async (req: AuthRequest, res) => {
    const { projectId } = req.params;
    const tenantId = req.user?.tenantId;

    // 🔒 Guard: Ensure variables exist and satisfy TypeScript
    if (!projectId || !tenantId) {
        throw new ApiError(400, "Project ID and Tenant ID are required");
    }

    const project = await Project.findOne({
        _id: new mongoose.Types.ObjectId(projectId as string),
        tenantId: new mongoose.Types.ObjectId(tenantId as string)
    }).populate("ownerId", "name email");

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(new ApiResponse(200, project));
});

export const updateProject = asyncHandler(async (req: AuthRequest, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const tenantId = req.user?.tenantId;

    if (!projectId || !tenantId) {
        throw new ApiError(400, "Missing required identifiers");
    }

    const project = await Project.findOne({
        _id: new mongoose.Types.ObjectId(projectId as string),
        tenantId: new mongoose.Types.ObjectId(tenantId as string)
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const isOwner = project.ownerId.toString() === req.user?._id?.toString();
    const isAdmin = req.user?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You do not have permission to update this project");
    }

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    return res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res) => {
    const { projectId } = req.params;
    const tenantId = req.user?.tenantId;

    if (!projectId || !tenantId) {
        throw new ApiError(400, "Missing required identifiers");
    }

    const project = await Project.findOne({
        _id: new mongoose.Types.ObjectId(projectId as string),
        tenantId: new mongoose.Types.ObjectId(tenantId as string)
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const isOwner = project.ownerId.toString() === req.user?._id?.toString();
    const isAdmin = req.user?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You do not have permission to delete this project");
    }

    await project.deleteOne();

    return res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"));
});

// For getTenantProjects, TypeScript is usually fine with just req.user?.tenantId
export const getTenantProjects = asyncHandler(async (req: AuthRequest, res) => {
    const tenantId = req.user?.tenantId;
    
    if (!tenantId) throw new ApiError(401, "Unauthorized");

    const projects = await Project.find({ 
        tenantId: new mongoose.Types.ObjectId(tenantId as string) 
    }).populate("ownerId", "name email");
    
    return res.status(200).json(new ApiResponse(200, projects));
});

export const createProject = asyncHandler(async (req: AuthRequest, res) => {
    const { name, description } = req.body;
    const tenantId = req.user?.tenantId;
    const userId = req.user?._id;

    if (!tenantId || !userId) throw new ApiError(401, "Unauthorized");

    const project = await Project.create({
        name,
        description,
        ownerId: new mongoose.Types.ObjectId(userId as string),
        tenantId: new mongoose.Types.ObjectId(tenantId as string)
    });

    return res.status(201).json(new ApiResponse(201, project, "Project created"));
});