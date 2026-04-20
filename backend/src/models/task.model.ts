import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    projectId: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
}

const taskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ["TODO", "IN_PROGRESS", "DONE"], default: "TODO" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Task = mongoose.model<ITask>("Task", taskSchema);