// Utility functions for the Convex backend

/**
 * Check if full permission mode is enabled
 * When enabled, all premium features are available for free
 */
export function isFullPermissionMode(): boolean {
  return process.env.FULL_PERMISSION === "true";
}

/**
 * Get effective subscription status considering full permission mode
 */
export function getEffectiveSubscription(subscriptionStatus?: string): string {
  if (isFullPermissionMode()) {
    return "pro";
  }
  return subscriptionStatus || "free";
}
