import mongoose, { Schema, Document } from "mongoose";

export interface IInvitation extends Document {
    email: string;
    role: "MANAGER" | "MEMBER";
    tenantId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    status: "PENDING" | "ACCEPTED" | "EXPIRED";
}

const invitationSchema = new Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["MANAGER", "MEMBER"], default: "MEMBER" },
    tenantId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "EXPIRED"], default: "PENDING" }
}, { timestamps: true });

// Auto-expire documents from MongoDB after they pass expiresAt
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation = mongoose.model<IInvitation>("Invitation", invitationSchema);