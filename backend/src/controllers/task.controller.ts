import { Task } from "../models/task.model.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import mongoose from "mongoose";

export const createTask = asyncHandler(async (req: AuthRequest, res) => {
    const taskData = {
        ...req.body,
        tenantId: req.user?.tenantId // Forced isolation
    };

    const task = await Task.create(taskData);
    return res.status(201).json(new ApiResponse(201, task, "Task created"));
});

export const getTasksByProject = asyncHandler(async (req: AuthRequest, res) => {
  const { projectId } = req.params;

  if (!projectId || Array.isArray(projectId)) {
    throw new ApiError(400, "Invalid projectId");
  }

  if (!req.user?.tenantId) {
    throw new ApiError(401, "Unauthorized");
  }

  const tasks = await Task.find({
    projectId: new mongoose.Types.ObjectId(projectId),
    tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
  }).populate("assignedTo", "name email");

  return res.status(200).json(new ApiResponse(200, tasks));
});

export const updateTask = asyncHandler(async (req: AuthRequest, res) => {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
        throw new ApiError(400, "Invalid taskId");
    }

    if (!req.user?._id || !req.user?.tenantId) {
        throw new ApiError(401, "Unauthorized");
    }

    const task = await Task.findOne({
        _id: new mongoose.Types.ObjectId(taskId),
        tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
    });

    if (!task) throw new ApiError(404, "Task not found");

    // Members can only update their own tasks
    if (
        req.user.role === "MEMBER" &&
        task.assignedTo?.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "You can only update tasks assigned to you");
    }

    Object.assign(task, req.body);
    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated"));
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res) => {
    const { taskId } = req.params;

    if (!taskId || Array.isArray(taskId)) {
        throw new ApiError(400, "Invalid taskId");
    }

    if (!req.user?.tenantId) {
        throw new ApiError(401, "Unauthorized");
    }

    const task = await Task.findOne({
        _id: new mongoose.Types.ObjectId(taskId),
        tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
    });

    if (!task) throw new ApiError(404, "Task not found");

    await task.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted"));
});