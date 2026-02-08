import { useAction } from './useConvex'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export function useStripe() {
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession)
  const createPortalSession = useAction(api.stripe.createPortalSession)

  const checkout = async (userId: Id<"users">, tier: 'pro', billingCycle: 'monthly' | 'yearly' = 'yearly') => {
    try {
      // Price IDs - these should match what you create in Stripe Dashboard
      // Monthly: $15/month
      // Yearly: $144/year ($12/month equivalent with 20% discount)
      const priceIds = {
        monthly: 'price_pro_monthly',
        yearly: 'price_pro_yearly',
      }

      const priceId = priceIds[billingCycle]

      const result = await createCheckoutSession({
        userId,
        priceId,
        tier,
      })

      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      throw error
    }
  }

  const manageBilling = async (customerId: string) => {
    try {
      const result = await createPortalSession({ customerId })

      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Portal error:', error)
      throw error
    }
  }

  return {
    checkout,
    manageBilling,
  }
}
