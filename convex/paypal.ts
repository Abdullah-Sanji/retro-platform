import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

// PayPal API base URL (Sandbox vs Production)
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

/**
 * Get PayPal OAuth access token for API authentication
 */
async function getPayPalAccessToken(): Promise<string> {
  const auth = btoa(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  );

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal auth failed:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      apiBase: PAYPAL_API_BASE,
    });
    throw new Error(`Failed to get PayPal access token: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Verify PayPal webhook signature for security
 */
async function verifyWebhookSignature(
  webhookId: string,
  headers: any,
  body: string
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken();

  const verifyResponse = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transmission_id: headers["paypal-transmission-id"],
        transmission_time: headers["paypal-transmission-time"],
        cert_url: headers["paypal-cert-url"],
        auth_algo: headers["paypal-auth-algo"],
        transmission_sig: headers["paypal-transmission-sig"],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  const verification = await verifyResponse.json();
  return verification.verification_status === "SUCCESS";
}

/**
 * Create PayPal subscription (replaces createCheckoutSession)
 *
 * Flow:
 * 1. Fetches user data
 * 2. Creates PayPal subscription with selected plan
 * 3. Returns approval URL for user redirect
 */
export const createSubscription = action({
  args: {
    userId: v.id("users"),
    planId: v.string(),
    tier: v.literal("pro"),
  },
  handler: async (ctx, args) => {
    // Get user data
    const user = await ctx.runQuery(api.users.getUserById, {
      userId: args.userId,
    });

    if (!user || !user.email) {
      throw new Error("User not found or no email");
    }

    const accessToken = await getPayPalAccessToken();

    // Create PayPal subscription
    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        plan_id: args.planId,
        subscriber: {
          email_address: user.email,
          name: {
            given_name: user.name?.split(" ")[0] || user.name || "User",
            surname: user.name?.split(" ").slice(1).join(" ") || "",
          },
        },
        application_context: {
          brand_name: "RetroPlatform",
          locale: "en-US",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          return_url: `${process.env.SITE_URL || "http://localhost:5173"}/dashboard?success=true`,
          cancel_url: `${process.env.SITE_URL || "http://localhost:5173"}/pricing?canceled=true`,
        },
        custom_id: args.userId, // Store user ID for webhook processing
      }),
    });

    const subscription = await response.json();

    if (!response.ok) {
      console.error("PayPal API error:", subscription);
      throw new Error(`PayPal API error: ${subscription.message || "Unknown error"}`);
    }

    // Get approval URL for redirect
    const approvalUrl = subscription.links?.find(
      (link: any) => link.rel === "approve"
    )?.href;

    if (!approvalUrl) {
      throw new Error("No approval URL returned from PayPal");
    }

    return {
      url: approvalUrl,
      subscriptionId: subscription.id
    };
  },
});

/**
 * Cancel PayPal subscription and immediately downgrade user to free
 */
export const cancelSubscription = action({
  args: {
    subscriptionId: v.string(),
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${args.subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reason: args.reason || "Customer requested cancellation",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to cancel subscription: ${error.message || "Unknown error"}`);
    }

    // Immediately downgrade user in DB (don't wait for webhook)
    await ctx.runMutation(api.users.updateSubscriptionStatus, {
      userId: args.userId,
      subscriptionStatus: "free",
    });

    return { success: true };
  },
});

/**
 * Get subscription details from PayPal
 */
export const getSubscriptionDetails = action({
  args: {
    subscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${args.subscriptionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subscription details");
    }

    const subscription = await response.json();
    return subscription;
  },
});

/**
 * Activate subscription after PayPal approval redirect
 *
 * Called from the frontend when user returns from PayPal with ?subscription_id=
 * Verifies the subscription is active via PayPal API then upgrades the user.
 */
export const activateSubscription = action({
  args: {
    subscriptionId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${args.subscriptionId}`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subscription from PayPal");
    }

    const subscription = await response.json();
    console.log(`Activating subscription ${args.subscriptionId} with status: ${subscription.status}`);

    if (subscription.status === "ACTIVE" || subscription.status === "APPROVED") {
      await ctx.runMutation(api.users.updateSubscriptionStatus, {
        userId: args.userId,
        subscriptionStatus: "pro",
        subscriptionId: args.subscriptionId,
        customerId: subscription.subscriber?.payer_id || args.subscriptionId,
      });
      console.log(`User ${args.userId} upgraded to Pro via return redirect`);
      return { success: true };
    }

    throw new Error(`Subscription not yet active (status: ${subscription.status})`);
  },
});

/**
 * Handle PayPal webhook events
 *
 * Processes subscription lifecycle events:
 * - ACTIVATED: User completes subscription → Upgrade to Pro
 * - CANCELLED/SUSPENDED/EXPIRED: Subscription ends → Downgrade to Free
 * - UPDATED: Plan changes (logged for future use)
 */
export const handleWebhook = action({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify webhook signature
    const isValid = await verifyWebhookSignature(
      process.env.PAYPAL_WEBHOOK_ID!,
      args.headers,
      args.payload
    );

    if (!isValid) {
      console.error("Webhook signature verification failed");
      throw new Error("Webhook signature verification failed");
    }

    const event = JSON.parse(args.payload);
    const eventType = event.event_type;

    console.log(`Processing PayPal webhook: ${eventType}`);

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscription = event.resource;
        const userId = subscription.custom_id;

        if (userId) {
          await ctx.runMutation(api.users.updateSubscriptionStatus, {
            userId: userId as any,
            subscriptionStatus: "pro",
            subscriptionId: subscription.id,
            customerId: subscription.subscriber?.payer_id || subscription.id,
          });
          console.log(`User ${userId} upgraded to Pro via webhook (subscription ${subscription.id})`);
        }
        break;
      }

      case "BILLING.SUBSCRIPTION.UPDATED": {
        const subscription = event.resource;
        console.log(`Subscription ${subscription.id} updated`);
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscription = event.resource;
        const userId = subscription.custom_id;

        if (userId) {
          await ctx.runMutation(api.users.updateSubscriptionStatus, {
            userId: userId as any,
            subscriptionStatus: "free",
          });
          console.log(`User ${userId} downgraded to Free via webhook (${eventType})`);
        }
        break;
      }

      case "PAYMENT.SALE.COMPLETED": {
        const sale = event.resource;
        console.log(`Payment completed for subscription: ${sale.billing_agreement_id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return { received: true };
  },
});
