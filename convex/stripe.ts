import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";

// Lazy initialize Stripe to avoid errors during module loading
function getStripe() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  return new Stripe(stripeKey, {
    apiVersion: "2024-12-18.acacia",
  });
}

// Price IDs (you'll need to create these in Stripe Dashboard)
const PRICE_IDS = {
  monthly: "price_pro_monthly", // Replace with actual Stripe Price ID for $15/month
  yearly: "price_pro_yearly",   // Replace with actual Stripe Price ID for $144/year ($12/month)
};

// Create Stripe checkout session
export const createCheckoutSession = action({
  args: {
    userId: v.id("users"),
    priceId: v.string(),
    tier: v.literal("pro"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(async (ctx) => {
      return await ctx.db.get(args.userId);
    });

    if (!user || !user.email) {
      throw new Error("User not found or no email");
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: args.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.SITE_URL || "http://localhost:5173"}/dashboard?success=true`,
      cancel_url: `${process.env.SITE_URL || "http://localhost:5173"}/pricing?canceled=true`,
      metadata: {
        userId: args.userId,
        tier: args.tier,
      },
    });

    return { url: session.url };
  },
});

// Create Stripe customer portal session
export const createPortalSession = action({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: args.customerId,
      return_url: `${process.env.SITE_URL || "http://localhost:5173"}/dashboard`,
    });

    return { url: session.url };
  },
});

// Handle Stripe webhook events
export const handleWebhook = action({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    let event: Stripe.Event;

    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (userId && tier) {
          await ctx.runMutation(async (ctx) => {
            await ctx.db.patch(userId as any, {
              subscriptionStatus: tier as any,
              subscriptionId: session.subscription as string,
              customerId: session.customer as string,
            });
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        // Update subscription status
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Revert to free tier
        break;
      }
    }

    return { received: true };
  },
});
