import Stripe from "stripe";
import { configDotenv } from "dotenv";
configDotenv(); 

import { Organization } from "../models/organization.model.ts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeWebhook = async (req: any, res: any) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
        
        // 🔒 CRITICAL: Verify the event came from Stripe
        event = stripe.webhooks.constructEvent(
            req.body,
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            const tenantId = session.metadata?.tenantId;
            
            await Organization.findByIdAndUpdate(tenantId, {
                subscriptionStatus: "active",
                plan: "PRO",
                subscriptionId: session.subscription as string
            });
            break;

        case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            await Organization.findOneAndUpdate(
                { subscriptionId: subscription.id },
                { subscriptionStatus: "canceled", plan: "FREE" }
            );
            break;
            
        // Add more cases like 'invoice.payment_failed' if needed
    }

    res.json({ received: true });
};