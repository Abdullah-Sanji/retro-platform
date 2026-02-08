<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser, useClerk, SignInButton } from '@clerk/vue'
import LogoIcon from '@/components/shared/LogoIcon.vue'

const route = useRoute()
const router = useRouter()
const { user, isSignedIn } = useUser()
const { signOut } = useClerk()

const showUserMenu = ref(false)

const handleSignOut = async () => {
  try {
    showUserMenu.value = false
    await signOut({ redirectUrl: '/' })
  } catch (error) {
    console.error('Sign out error:', error)
    // Force redirect even if signOut fails
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3 group">
            <LogoIcon size="md" class="group-hover:scale-110 transition-transform" />
            <span class="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
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
            <div v-if="!isSignedIn" class="flex items-center gap-4">
              <SignInButton
                mode="modal"
                afterSignInUrl="/app/create"
              >
                <button class="px-6 py-2 border-2 border-sky-500 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <router-link
                to="/pricing"
                class="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
              >
                Get Started
              </router-link>
            </div>
            <router-link
              v-else
              to="/app/create"
              class="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all"
            >
              Create Session
            </router-link>

            <!-- User Profile Dropdown -->
            <div v-if="isSignedIn" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 hover:border-teal-300 transition-all group"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {{ user?.firstName?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div class="flex flex-col items-start">
                  <span class="text-xs text-teal-600 font-medium">Ready to retro?</span>
                  <span class="text-sm font-bold text-teal-900">{{ user?.firstName || 'User' }}</span>
                </div>
                <svg class="w-4 h-4 text-teal-600 transition-transform" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900">{{ user?.fullName || user?.firstName || 'User' }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user?.primaryEmailAddress?.emailAddress }}</p>
                </div>
                <router-link
                  to="/dashboard"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Dashboard</span>
                </router-link>
                <router-link
                  to="/pricing"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span class="text-sm font-medium text-gray-700">Pricing</span>
                </router-link>
                <hr class="my-2">
                <button
                  @click="handleSignOut"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span class="text-sm font-medium text-red-600">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Backdrop to close dropdown when clicking outside -->
    <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-40"></div>

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
            <div v-if="!isSignedIn" class="space-y-3">
              <router-link
                to="/pricing"
                class="block px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors text-center"
              >
                View Pricing
              </router-link>
              <SignInButton
                mode="modal"
                afterSignInUrl="/app/create"
              >
                <button class="block w-full px-6 py-2 border-2 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg transition-all text-sm font-medium">
                  Already have an account? Sign In
                </button>
              </SignInButton>
            </div>
            <router-link
              v-else
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
