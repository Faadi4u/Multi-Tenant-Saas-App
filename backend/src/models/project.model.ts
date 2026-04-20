import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    description: string;
    tenantId: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
}

const projectSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const Project = mongoose.model<IProject>("Project", projectSchema);