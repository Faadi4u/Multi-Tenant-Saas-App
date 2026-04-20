import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  plan: "FREE" | "PRO";
  stripeCustomerId?: string;
}

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    plan: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },
    stripeCustomerId: { type: String, unique: true, sparse: true },
    subscriptionId: { type: String },
    subscriptionStatus: {
      type: String,
      enum: ["active", "trialing", "past_due", "canceled", "incomplete"],
      default: "trialing",
    },

  },
  { timestamps: true },
);

export const Organization = mongoose.model<IOrganization>(
  "Organization",
  OrganizationSchema,
);
