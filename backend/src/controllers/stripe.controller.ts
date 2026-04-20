import Stripe from "stripe";
import { Organization } from "../models/organization.model.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia", // Use latest
});

export const createCheckoutSession = asyncHandler(
  async (req: AuthRequest, res) => {
    const org = await Organization.findById(req.user?.tenantId);
    if (!org) throw new ApiError(404, "Organization not found");

    // 1. Create or retrieve Stripe Customer
    let customerId = org.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user!.email, // We'd need to add email to AuthRequest or fetch from User
        metadata: { tenantId: org._id.toString() },
      });
      customerId = customer.id;
      org.stripeCustomerId = customerId;
      await org.save();
    }

    // 2. Create Checkout Session
    const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;
    if (!STRIPE_PRO_PRICE_ID) {
      throw new ApiError(500, "Stripe price ID missing");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing`,
      metadata: { tenantId: org._id.toString() },
    });

    return res.status(200).json(new ApiResponse(200, { url: session.url }));
  },
);
