import crypto from "crypto";
import { Invitation } from "../models/invitation.model.ts";
import { User } from "../models/user.model.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import { sendEmail } from "../utils/sendEmail.ts";
import mongoose from "mongoose";

export const sendInvite = asyncHandler(async (req: AuthRequest, res) => {
    const { email, role } = req.body;

    // 1. Check if user is already in the system
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "User is already registered in a tenant");

    // 2. Generate a secure random token
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // 3. Save Invitation to DB
    if (!req.user?.tenantId) {
    throw new ApiError(401, "Unauthorized");
}

await Invitation.create({
    email,
    role,
    tenantId: new mongoose.Types.ObjectId(req.user.tenantId),
    token: inviteToken,
    expiresAt
});

    // 4. Create the Invite Link (Pointed to your Frontend)
    const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;
    console.log("🚀 INVITE LINK FOR TESTING:", inviteUrl); 
    // 5. Send Email
    const message = `
        <h1>You've been invited!</h1>
        <p>You have been invited to join an organization on Safe-Tenant SaaS as a <b>${role}</b>.</p>
        <p>Click the link below to accept the invitation and create your account:</p>
        <a href="${inviteUrl}">${inviteUrl}</a>
    `;

    try {
        await sendEmail({ email, subject: "Invitation to join Organization", message });
        return res.status(200).json(new ApiResponse(200, {}, "Invitation sent successfully"));
    } catch (error) {
        throw new ApiError(500, "Email could not be sent");
    }
});

export const acceptInvite = asyncHandler(async (req, res) => {
    const { token, name, password } = req.body;

    // 1. Find valid invitation
    const invitation = await Invitation.findOne({ 
        token, 
        status: "PENDING", 
        expiresAt: { $gt: new Date() } 
    });

    if (!invitation) throw new ApiError(400, "Invalid or expired invitation token");

    // 2. Create the user with the tenantId from the invitation
    const user = await User.create({
        name,
        email: invitation.email,
        password,
        role: invitation.role,
        tenantId: invitation.tenantId
    });

    // 3. Mark invitation as accepted
    invitation.status = "ACCEPTED";
    await invitation.save();

    return res.status(201).json(new ApiResponse(201, user, "Invitation accepted, account created"));
});