<script setup lang="ts">
import { useRoute } from 'vue-router'
import LogoIcon from '@/components/shared/LogoIcon.vue'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3 group">
            <LogoIcon size="md" class="group-hover:scale-110 transition-transform" />
            <span class="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              RetroPlatform
            </span>
          </router-link>

          <div class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-gray-700 hover:text-sky-600 font-medium transition-colors">
              Home
            </router-link>
            <router-link to="/features" class="text-gray-700 hover:text-sky-600 font-medium transition-colors">
              Features
            </router-link>
            <router-link to="/pricing" class="text-gray-700 hover:text-sky-600 font-medium transition-colors">
              Pricing
            </router-link>

            <!-- CTA Buttons -->
            <router-link
              to="/app/create"
              class="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Page Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <LogoIcon size="md" />
              <h3 class="text-xl font-bold">RetroPlatform</h3>
            </div>
            <p class="text-gray-400">AI-powered retrospectives for modern teams.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Product</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/features" class="hover:text-white">Features</router-link></li>
              <li><router-link to="/pricing" class="hover:text-white">Pricing</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Get Started</h4>
            <router-link
              to="/app/create"
              class="inline-block px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
            >
              Create Session
            </router-link>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 RetroPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
