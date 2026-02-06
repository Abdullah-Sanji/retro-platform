<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Pricing - Simple, Transparent Plans',
  description: 'Simple, transparent pricing for teams of all sizes. Start free, upgrade as you grow.',
  keywords: 'retrospective pricing, retro tool cost, agile tool pricing',
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-20">
    <div class="max-w-7xl mx-auto px-6">
      <h1 class="text-6xl font-bold text-center mb-4">
        <span class="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
          Simple Pricing
        </span>
      </h1>
      <p class="text-xl text-gray-600 text-center mb-16">
        Start free, upgrade as you grow
      </p>

      <!-- Pricing Tiers -->
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <h4 class="text-2xl font-bold text-gray-800 mb-2">Free</h4>
              <p class="text-5xl font-bold text-sky-600 mb-2">$0</p>
              <p class="text-sm text-gray-500 mb-6">5 sessions/month</p>
              <ul class="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 5 sessions per month</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Real-time collaboration</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Anonymous mode</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Smart voting</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Action items</li>
              </ul>
              <router-link
                to="/app/create"
                class="block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Get Started
              </router-link>
            </div>
            <div class="text-center p-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-400 shadow-xl hover:shadow-2xl transition-all relative transform scale-105">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <h4 class="text-2xl font-bold text-gray-800 mb-2">Pro</h4>
              <p class="text-5xl font-bold text-sky-600 mb-2">$15</p>
              <p class="text-sm text-gray-500 mb-6">per month</p>
              <ul class="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited sessions</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Everything in Free</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Export to Word</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Custom templates</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Priority support</li>
              </ul>
              <button
                class="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
                disabled
              >
                Coming Soon
              </button>
            </div>
            <div class="text-center p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <h4 class="text-2xl font-bold text-gray-800 mb-2">Team</h4>
              <p class="text-5xl font-bold text-sky-600 mb-2">$49</p>
              <p class="text-sm text-gray-500 mb-6">per month</p>
              <ul class="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited sessions</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Everything in Pro</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Team management</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Advanced analytics</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> SSO (coming soon)</li>
              </ul>
              <button
                class="block w-full px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
