<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Features - Powerful Retrospective Tools',
  description: 'Real-time collaboration, anonymous feedback, smart voting, and action tracking. Everything you need for effective team retrospectives.',
  keywords: 'retrospective features, retro tools, agile features, team collaboration tools',
})

const features = [
  {
    icon: '⚡',
    title: 'Real-time Sync',
    description: 'Every change appears instantly for all participants. No refresh needed, no delays. True real-time collaboration powered by Convex.',
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    icon: '🎭',
    title: 'Anonymous Mode',
    description: 'Create psychological safety with optional anonymous feedback. Team members can share honest insights without fear.',
    gradient: 'from-rose-400 to-pink-400',
  },
  {
    icon: '✅',
    title: 'Smart Voting',
    description: 'Prioritize discussions with built-in voting. Quickly identify what matters most to your team.',
    gradient: 'from-emerald-400 to-green-400',
  },
  {
    icon: '📋',
    title: 'Action Items',
    description: 'Convert insights into action. Track commitments and ensure follow-through from retrospective to retrospective.',
    gradient: 'from-sky-400 to-blue-400',
  },
  {
    icon: '🎨',
    title: 'Custom Templates',
    description: 'Choose from Start-Stop-Continue, Mad-Sad-Glad, or create your own columns. Adapt to your team\'s needs.',
    gradient: 'from-purple-400 to-indigo-400',
  },
  {
    icon: '📤',
    title: 'Export Functionality',
    description: 'Export retrospective results as Word documents. Share insights and action items with stakeholders.',
    gradient: 'from-teal-400 to-cyan-400',
  },
]

const comparisons = [
  { feature: 'Real-time Collaboration', us: true, miro: true, mural: true },
  { feature: 'Anonymous Feedback', us: true, miro: false, mural: false },
  { feature: 'Setup Time', us: '< 30 seconds', miro: '5+ minutes', mural: '5+ minutes' },
  { feature: 'Built for Retros', us: true, miro: false, mural: false },
  { feature: 'Price (Team of 10)', us: 'Free', miro: '$96/mo', mural: '$119/mo' },
  { feature: 'No Learning Curve', us: true, miro: false, mural: false },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-20">
        <h1 class="text-6xl font-bold mb-6">
          <span class="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
            Powerful Features
          </span>
        </h1>
        <p class="text-2xl text-gray-600 max-w-3xl mx-auto">
          Everything you need for effective retrospectives, nothing you don't
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
        >
          <div :class="`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-lg`">
            {{ feature.icon }}
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">{{ feature.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Comparison Section -->
      <div class="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
        <h2 class="text-4xl font-bold text-center mb-4">
          <span class="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Why RetroPlatform?
          </span>
        </h2>
        <p class="text-xl text-gray-600 text-center mb-12">
          Built specifically for retrospectives, not adapted from general-purpose tools
        </p>

        <!-- Comparison Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-4 px-6 text-gray-700 font-semibold">Feature</th>
                <th class="text-center py-4 px-6 text-sky-600 font-bold">RetroPlatform</th>
                <th class="text-center py-4 px-6 text-gray-500 font-semibold">Miro</th>
                <th class="text-center py-4 px-6 text-gray-500 font-semibold">Mural</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in comparisons"
                :key="index"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="py-4 px-6 font-medium text-gray-700">{{ row.feature }}</td>
                <td class="py-4 px-6 text-center">
                  <span v-if="typeof row.us === 'boolean'">
                    <span v-if="row.us" class="text-2xl text-emerald-500">✓</span>
                    <span v-else class="text-2xl text-gray-300">×</span>
                  </span>
                  <span v-else class="font-semibold text-sky-600">{{ row.us }}</span>
                </td>
                <td class="py-4 px-6 text-center text-gray-500">
                  <span v-if="typeof row.miro === 'boolean'">
                    <span v-if="row.miro" class="text-2xl">✓</span>
                    <span v-else class="text-2xl text-gray-300">×</span>
                  </span>
                  <span v-else>{{ row.miro }}</span>
                </td>
                <td class="py-4 px-6 text-center text-gray-500">
                  <span v-if="typeof row.mural === 'boolean'">
                    <span v-if="row.mural" class="text-2xl">✓</span>
                    <span v-else class="text-2xl text-gray-300">×</span>
                  </span>
                  <span v-else>{{ row.mural }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center mt-20">
        <h2 class="text-4xl font-bold text-gray-800 mb-6">Ready to get started?</h2>
        <p class="text-xl text-gray-600 mb-8">Create your first retrospective in under 30 seconds</p>
        <router-link
          to="/app/create"
          class="inline-block px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started Free
        </router-link>
      </div>
    </div>
  </div>
</template>
