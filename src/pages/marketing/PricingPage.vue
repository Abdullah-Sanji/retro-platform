<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUser, SignUpButton } from '@clerk/vue'
import { useStripe } from '@/composables/useStripe'
import { useNotification } from '@/composables/useNotification'
import { useQuery, useMutation } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import { useSeo } from '@/composables/useSeo'
import { useFullPermission } from '@/composables/useFullPermission'

useSeo({
  title: 'Pricing - Simple, Transparent Plans',
  description: 'Simple, transparent pricing for teams of all sizes. Start free, upgrade as you grow.',
  keywords: 'retrospective pricing, retro tool cost, agile tool pricing',
})

const router = useRouter()
const { user, isSignedIn } = useUser()
const { checkout } = useStripe()
const notification = useNotification()
const syncClerkUser = useMutation(api.users.syncClerkUser)
const { isFullPermissionMode } = useFullPermission()

// Redirect to create session page if full permission mode is enabled
if (isFullPermissionMode) {
  router.replace('/app/create')
}

// Billing cycle toggle (yearly by default for 20% discount)
const isYearly = ref(true)

// Pricing calculations
const proMonthlyPrice = 15
const proYearlyPrice = computed(() => {
  const yearlyTotal = proMonthlyPrice * 12
  const discountedTotal = yearlyTotal * 0.8 // 20% discount
  return Math.round(discountedTotal)
})
const proMonthlyEquivalent = computed(() => {
  return Math.round(proYearlyPrice.value / 12)
})

// Get user's Convex data
const userData = useQuery(
  api.users.getCurrentUser,
  computed(() => user.value?.id ? { clerkId: user.value.id } : 'skip')
)

// Auto-sync Clerk user to Convex when signed in
watch(
  () => [isSignedIn.value, user.value, userData.value],
  async ([signedIn, currentUser, currentUserData]) => {
    if (signedIn && currentUser && !currentUserData) {
      // User is signed in with Clerk but doesn't exist in Convex yet
      try {
        await syncClerkUser({
          clerkId: currentUser.id,
          name: currentUser.fullName || currentUser.firstName || 'User',
          email: currentUser.primaryEmailAddress?.emailAddress || '',
        })
      } catch (error) {
        console.error('Failed to sync user:', error)
      }
    }
  },
  { immediate: true }
)

const handleFreePlan = () => {
  router.push('/app/create')
}

const handleUpgradeToPro = async () => {
  if (!isSignedIn.value) {
    notification.error('Please sign in first')
    return
  }

  if (!userData.value) {
    notification.info('Setting up your account... Please wait.')

    // Wait up to 3 seconds for userData to sync
    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (userData.value) break
    }

    if (!userData.value) {
      notification.error('Unable to load account data. Please refresh the page and try again.')
      return
    }
  }

  try {
    notification.info('Redirecting to checkout...')
    // Pass billing cycle to checkout
    await checkout(userData.value._id, 'pro', isYearly.value ? 'yearly' : 'monthly')
  } catch (error: any) {
    console.error('Checkout error:', error)
    notification.error(error?.message || 'Failed to start checkout. Please try again.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-20">
    <div class="max-w-7xl mx-auto px-6">
      <h1 class="text-6xl font-bold text-center mb-4">
        <span class="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
          Simple Pricing
        </span>
      </h1>
      <p class="text-xl text-gray-600 text-center mb-8">
        Start free, upgrade as you grow
      </p>

      <!-- Billing Cycle Toggle -->
      <div class="flex items-center justify-center gap-4 mb-16">
        <span :class="['text-lg font-semibold transition-colors', !isYearly ? 'text-gray-900' : 'text-gray-500']">
          Monthly
        </span>
        <button
          @click="isYearly = !isYearly"
          :class="[
            'relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
            isYearly ? 'bg-sky-600' : 'bg-gray-300'
          ]"
        >
          <span
            :class="[
              'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
              isYearly ? 'translate-x-9' : 'translate-x-1'
            ]"
          />
        </button>
        <span :class="['text-lg font-semibold transition-colors', isYearly ? 'text-gray-900' : 'text-gray-500']">
          Yearly
        </span>
        <span v-if="isYearly" class="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
          Save 20%
        </span>
      </div>

      <!-- Pricing Tiers -->
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="text-center p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <h4 class="text-2xl font-bold text-gray-800 mb-2">Free</h4>
              <p class="text-5xl font-bold text-sky-600 mb-2">$0</p>
              <p class="text-sm text-gray-500 mb-6">Perfect for trying out</p>
              <ul class="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 1 session per month</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Mad, Sad & Glad template</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Up to 5 participants</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 3 votes per user</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Export to Word</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Real-time collaboration</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Anonymous mode</li>
                <li class="flex items-center"><span class="text-gray-400 mr-2">✗</span> <span class="text-gray-400">AI action items</span></li>
              </ul>
              <SignUpButton
                v-if="!isSignedIn"
                mode="modal"
                afterSignUpUrl="/pricing"
                afterSignInUrl="/pricing"
              >
                <button class="block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all">
                  Choose Free Plan
                </button>
              </SignUpButton>
              <button
                v-else
                @click="handleFreePlan"
                class="block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Choose Free Plan
              </button>
            </div>
            <div class="text-center p-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-400 shadow-xl hover:shadow-2xl transition-all relative transform scale-105">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <h4 class="text-2xl font-bold text-gray-800 mb-2">Pro</h4>
              <div v-if="isYearly">
                <div class="flex items-center justify-center gap-3 mb-1">
                  <p class="text-3xl font-bold text-gray-400 line-through">${{ proMonthlyPrice }}</p>
                  <p class="text-5xl font-bold text-sky-600">${{ proMonthlyEquivalent }}</p>
                </div>
                <p class="text-sm text-gray-500 mb-1">per month</p>
                <p class="text-xs text-gray-400 mb-6">Billed ${{ proYearlyPrice }} yearly</p>
              </div>
              <div v-else>
                <p class="text-5xl font-bold text-sky-600 mb-2">${{ proMonthlyPrice }}</p>
                <p class="text-sm text-gray-500 mb-6">per month</p>
              </div>
              <ul class="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited sessions</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> All templates + custom</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited participants</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited votes</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> AI-generated action items</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Everything in Free</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Priority support</li>
              </ul>
              <SignUpButton
                v-if="!isSignedIn"
                mode="modal"
                afterSignUpUrl="/pricing"
                afterSignInUrl="/pricing"
              >
                <button class="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all">
                  Choose Pro Plan
                </button>
              </SignUpButton>
              <button
                v-else
                @click="handleUpgradeToPro"
                class="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
              >
                Choose Pro Plan
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
