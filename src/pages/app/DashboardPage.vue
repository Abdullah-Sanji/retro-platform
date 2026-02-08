<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@clerk/vue'
import { useQuery, useMutation } from '@/composables/useConvex'
import { useNotification } from '@/composables/useNotification'
import { useStripe } from '@/composables/useStripe'
import LogoIcon from '@/components/shared/LogoIcon.vue'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

const router = useRouter()
const { user, isSignedIn } = useUser()
const notification = useNotification()
const { checkout, manageBilling } = useStripe()

// Redirect if not signed in
onMounted(() => {
  if (!isSignedIn.value) {
    notification.warning('Please sign in to view dashboard')
    router.push('/')
  }
})

// Sync user and get their Convex ID
const syncClerkUser = useMutation(api.users.syncClerkUser)
const convexUserId = computed<Id<"users"> | null>(() => {
  // This will be set after sync
  return null as any // Placeholder - will be computed from query
})

// Get user's Convex data
const userData = useQuery(
  api.users.getCurrentUser,
  computed(() => user.value?.id ? { clerkId: user.value.id } : 'skip')
)

// Get usage stats
const usageStats = useQuery(
  api.sessions.getUserUsage,
  computed(() => userData.value ? { userId: userData.value._id } : 'skip')
)

// Get user's sessions
const userSessions = useQuery(
  api.sessions.getUserSessions,
  computed(() => userData.value ? { userId: userData.value._id } : 'skip')
)

const subscriptionStatus = computed(() => userData.value?.subscriptionStatus || 'free')
const isFreeTier = computed(() => subscriptionStatus.value === 'free')
const usagePercentage = computed(() => {
  if (!usageStats.value || usageStats.value.limit === Infinity) return 0
  return (usageStats.value.used / usageStats.value.limit) * 100
})

const handleUpgrade = async () => {
  if (!userData.value) return

  try {
    // Default to yearly for 20% discount
    await checkout(userData.value._id, 'pro', 'yearly')
  } catch (error) {
    notification.error('Failed to start checkout')
  }
}

const handleManageBilling = async () => {
  if (!userData.value?.customerId) {
    notification.error('No billing information found')
    return
  }

  try {
    await manageBilling(userData.value.customerId)
  } catch (error) {
    notification.error('Failed to open billing portal')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3 group">
            <LogoIcon size="md" class="group-hover:scale-110 transition-transform" />
            <span class="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              RetroPlatform
            </span>
          </router-link>
          <router-link
            to="/app/create"
            class="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
          >
            Create Session
          </router-link>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {{ user?.firstName || 'there' }}!
        </h1>
        <p class="text-gray-600">Manage your retrospectives and subscription</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Usage Stats Card -->
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Usage This Month</h2>

            <div v-if="usageStats" class="space-y-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600">Sessions Used</span>
                <span class="text-2xl font-bold text-sky-600">
                  {{ usageStats.used }} / {{ usageStats.limit === Infinity ? '∞' : usageStats.limit }}
                </span>
              </div>

              <!-- Progress Bar -->
              <div v-if="usageStats.limit !== Infinity" class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  class="h-full transition-all duration-500"
                  :class="usagePercentage >= 80 ? 'bg-red-500' : usagePercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'"
                  :style="{ width: `${Math.min(usagePercentage, 100)}%` }"
                />
              </div>

              <!-- Warning if approaching limit -->
              <div v-if="isFreeTier && usageStats.used >= 4" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p class="text-yellow-800 font-medium flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  You're approaching your monthly limit. Upgrade for unlimited sessions!
                </p>
              </div>

              <!-- Plan Details -->
              <div class="mt-6 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Current Plan</p>
                    <p class="text-xl font-bold text-sky-600 capitalize">{{ subscriptionStatus }}</p>
                  </div>
                  <button
                    v-if="isFreeTier"
                    @click="handleUpgrade"
                    class="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
                  >
                    Upgrade Now
                  </button>
                  <button
                    v-else
                    @click="handleManageBilling"
                    class="px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Manage Billing
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Session History -->
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Recent Sessions</h2>

            <div v-if="userSessions && userSessions.length > 0" class="space-y-4">
              <div
                v-for="session in userSessions.slice(0, 10)"
                :key="session._id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800">{{ session.title }}</h3>
                  <p class="text-sm text-gray-600">{{ session.teamName }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ new Date(session.createdAt).toLocaleDateString() }}
                  </p>
                </div>
                <router-link
                  :to="`/app/board/${session._id}`"
                  class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium"
                >
                  View
                </router-link>
              </div>
            </div>

            <div v-else class="text-center py-12">
              <p class="text-gray-500 mb-4">No sessions yet</p>
              <router-link
                to="/app/create"
                class="inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
              >
                Create Your First Session
              </router-link>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <router-link
                to="/app/create"
                class="block w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all text-center"
              >
                Create Session
              </router-link>
              <router-link
                to="/pricing"
                class="block w-full px-4 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all text-center"
              >
                View Plans
              </router-link>
            </div>
          </div>

          <!-- Upgrade CTA (if free tier) -->
          <div v-if="isFreeTier" class="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 class="text-xl font-bold mb-2">Upgrade to Pro</h3>
            <p class="text-sky-100 mb-4 text-sm">
              Get unlimited sessions, export to Word, and priority support for just $15/month.
            </p>
            <button
              @click="handleUpgrade"
              class="w-full px-4 py-3 bg-white text-sky-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
