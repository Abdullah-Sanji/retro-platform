import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * PayPal webhook endpoint
 * Receives webhook events from PayPal and processes them
 */
http.route({
  path: "/paypal-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Get raw request body
      const body = await request.text();

      // Extract PayPal webhook headers for signature verification
      const headers = {
        "paypal-transmission-id": request.headers.get("paypal-transmission-id") || "",
        "paypal-transmission-time": request.headers.get("paypal-transmission-time") || "",
        "paypal-cert-url": request.headers.get("paypal-cert-url") || "",
        "paypal-auth-algo": request.headers.get("paypal-auth-algo") || "",
        "paypal-transmission-sig": request.headers.get("paypal-transmission-sig") || "",
      };

      // Process webhook through PayPal action
      await ctx.runAction(api.paypal.handleWebhook, {
        headers,
        payload: body,
      });

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Webhook processing failed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }),
});

export default http;
