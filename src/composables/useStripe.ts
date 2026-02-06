import { useAction } from './useConvex'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export function useStripe() {
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession)
  const createPortalSession = useAction(api.stripe.createPortalSession)

  const checkout = async (userId: Id<"users">, tier: 'pro' | 'team') => {
    try {
      // Price IDs - these should match what you create in Stripe Dashboard
      const priceIds = {
        pro: 'price_pro_monthly',
        team: 'price_team_monthly',
      }

      const result = await createCheckoutSession({
        userId,
        priceId: priceIds[tier],
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
