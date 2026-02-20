import { useAction } from './useConvex'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

/**
 * Vue 3 composable for PayPal subscription management
 * Replaces useStripe.ts with equivalent PayPal functionality
 */
export function usePayPal() {
  const createSubscription = useAction(api.paypal.createSubscription)
  const cancelSubscription = useAction(api.paypal.cancelSubscription)

  /**
   * Initiate PayPal checkout for subscription
   * Redirects user to PayPal approval page
   */
  const checkout = async (
    userId: Id<"users">,
    tier: 'pro',
    billingCycle: 'monthly' | 'yearly' = 'yearly'
  ) => {
    try {
      // Get plan ID from environment variables
      const planIds = {
        monthly: import.meta.env.VITE_PAYPAL_PLAN_ID_MONTHLY,
        yearly: import.meta.env.VITE_PAYPAL_PLAN_ID_YEARLY,
      }

      const planId = planIds[billingCycle]

      if (!planId) {
        throw new Error(`PayPal plan ID not configured for ${billingCycle} billing`)
      }

      // Create subscription and get approval URL
      const result = await createSubscription({
        userId,
        planId,
        tier,
      })

      if (result.url) {
        // Redirect to PayPal approval page
        window.location.href = result.url
      } else {
        throw new Error('No approval URL returned from PayPal')
      }
    } catch (error) {
      console.error('PayPal checkout error:', error)
      throw error
    }
  }

  /**
   * Open PayPal billing management
   * Note: PayPal doesn't have a hosted portal like Stripe
   * Opens PayPal's account management page
   */
  const manageBilling = async (subscriptionId: string) => {
    try {
      // Open PayPal's subscription management in new tab
      const paypalManageUrl = 'https://www.sandbox.paypal.com/myaccount/autopay/' // Sandbox
      // For production: 'https://www.paypal.com/myaccount/autopay/'
      window.open(paypalManageUrl, '_blank')
    } catch (error) {
      console.error('Billing management error:', error)
      throw error
    }
  }

  /**
   * Cancel user's subscription and immediately downgrade to free
   */
  const cancelUserSubscription = async (userId: Id<"users">, subscriptionId: string, reason?: string) => {
    try {
      await cancelSubscription({ userId, subscriptionId, reason })
      return { success: true }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      throw error
    }
  }

  return {
    checkout,
    manageBilling,
    cancelUserSubscription,
  }
}
