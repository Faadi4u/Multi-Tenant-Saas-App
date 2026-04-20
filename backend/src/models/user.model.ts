import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for TypeScript
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "ADMIN" | "MANAGER" | "MEMBER";
    tenantId: mongoose.Types.ObjectId;
    isActive: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false, // 🔒 Pro-tip: Never return password in queries by default
        },
        role: {
            type: String,
            enum: ["ADMIN", "MANAGER", "MEMBER"],
            default: "MEMBER",
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true, // 🚀 Critical for multi-tenant query performance
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * 🔥 Senior-Level Hook: Automatically hash password before saving
 */
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return ;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
        
    } catch (error: any) {
        console.log(error);
        
    }
});

/**
 * 🔑 Instance Method: Compare entered password with hashed password in DB
 */
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    // Note: Since password has 'select: false', you MUST use .select('+password') 
    // in the controller during login for this to have access to this.password
    return await bcrypt.compare(password, this.password || "");
};

/**
 * 🔒 Security Transform: Ensure sensitive data is never leaked to JSON
 */
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete (ret as any).__v;
        return ret;
    },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);