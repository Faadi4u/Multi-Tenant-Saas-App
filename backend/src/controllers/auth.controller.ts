import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { User } from "../models/user.model.ts";
import { Organization } from "../models/organization.model.ts";
import jwt from "jsonwebtoken";

const generateToken = (user: any) => {
    return jwt.sign(
        { _id: user._id, tenantId: user.tenantId, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );
};

export const registerOrganization = asyncHandler(async (req, res) => {
    const { name, email, password, companyName } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) throw new ApiError(409, "User with email already exists");

    const org = await Organization.create({ name: companyName });
    const user = await User.create({ name, email, password, role: "ADMIN", tenantId: org._id });

    const createdUser = await User.findById(user._id); // password removed via toJSON

    return res.status(201).json(new ApiResponse(201, createdUser, "Registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user AND explicitly ask for the hidden password
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(404, "User does not exist");

    // 2. Check password using our Model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    // 3. Generate JWT
    const token = generateToken(user);

    // 4. Send token in HttpOnly Cookie for security
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, { user, token }, "Logged in successfully"));
});