<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@clerk/vue'
import JoinModal from '@/components/shared/JoinModal.vue'
import { useQuery, useMutation } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import { useNotification } from '@/composables/useNotification'
import { useSeo } from '@/composables/useSeo'

// SEO
useSeo({
  title: 'AI-Powered Retrospective Platform - Turn Feedback into Action',
  description: 'The only retrospective platform with AI-powered action items. Automatically generate actionable insights from team feedback, export to Word, and drive real change.',
  keywords: 'AI retrospective, AI action items, retro platform, agile, scrum, team collaboration, sprint retrospective, AI-powered',
})

const router = useRouter()
const notification = useNotification()
const { isSignedIn } = useUser()

const joinLink = ref<string>('')
const showJoinModal = ref(false)
const pendingSessionLink = ref<string>('')
const isJoining = ref(false)

const createUser = useMutation(api.users.createUser)
const sessionQuery = useQuery(
  api.sessions.getSessionByLink,
  () => pendingSessionLink.value ? { shareLink: pendingSessionLink.value } : 'skip'
)

const handleJoinSession = async () => {
  if (!joinLink.value.trim()) return

  pendingSessionLink.value = joinLink.value
  showJoinModal.value = true
}

const handleJoinFromModal = async (userData: { name: string; isAnonymous: boolean }) => {
  isJoining.value = true

  try {
    const session = sessionQuery.value
    if (!session) {
      notification.error('Session not found. Please check the link.')
      isJoining.value = false
      return
    }

    // Create user
    const userResult = await createUser({
      name: userData.name,
      isAnonymous: userData.isAnonymous,
    })

    // Store userId and session
    localStorage.setItem(`userId_${session._id}`, userResult.userId)
    localStorage.setItem(`lastSession`, pendingSessionLink.value)

    // Navigate to board
    router.push({
      name: 'board',
      params: { sessionId: session._id }
    })

    showJoinModal.value = false
  } catch (error) {
    console.error('Failed to join session:', error)
    notification.error('Failed to join session. Please try again.')
  } finally {
    isJoining.value = false
  }
}

const handleCloseModal = () => {
  showJoinModal.value = false
  pendingSessionLink.value = ''
  joinLink.value = ''
}
</script>

<template>
  <div>
    <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style="animation-delay: 4s;"></div>
      </div>

      <div class="text-center max-w-6xl relative z-10 animate-fade-in">
        <!-- Hero Section -->
        <div class="mb-16">
          <div class="inline-block mb-6">
            <span class="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full text-sm font-bold shadow-lg animate-pulse">
              ⚡ AI-POWERED RETROSPECTIVES
            </span>
          </div>
          <h1 class="text-7xl md:text-8xl font-extrabold text-gray-800 mb-6 leading-tight tracking-tight">
            Turn Feedback into
            <span class="block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-[120px]">
              Actionable Insights
            </span>
          </h1>
          <p class="text-2xl md:text-3xl text-gray-600 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
            The first retrospective platform with <span class="font-semibold text-teal-600">AI-generated action items</span>
          </p>
          <p class="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Let AI analyze your team's feedback and automatically create prioritized action items. Export everything to Word with one click.
          </p>

          <!-- Key Features Pills -->
          <div class="flex flex-wrap justify-center gap-3 mb-10">
            <div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-teal-200 shadow-sm">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">AI Action Items</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-cyan-200 shadow-sm">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Word Export</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-teal-200 shadow-sm">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Real-time Sync</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-cyan-200 shadow-sm">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Anonymous Feedback</span>
            </div>
          </div>

          <!-- Primary CTA -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link
              :to="isSignedIn ? '/app/create' : '/pricing'"
              class="group px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-lg font-bold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
            >
              <span>{{ isSignedIn ? 'Create Session' : 'Get Started' }}</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
            <router-link
              to="/features"
              class="px-8 py-4 bg-white/80 backdrop-blur-md text-gray-700 text-lg font-semibold rounded-xl hover:bg-white transition-all border-2 border-gray-200 hover:border-teal-300"
            >
              See How It Works
            </router-link>
          </div>
        </div>

        <!-- Action Cards -->
        <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16 animate-slide-up">
          <!-- Create Session Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div class="relative flex flex-col justify-between h-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-teal-100">
              <div>
                <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-3">Create Session</h2>
                <p class="text-gray-600 mb-6 leading-relaxed">Start a new AI-powered retrospective and invite your team to collaborate in real-time</p>
              </div>
              <router-link
                :to="isSignedIn ? '/app/create' : '/pricing'"
                class="block w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                {{ isSignedIn ? 'Create New Retro' : 'Get Started' }}
              </router-link>
            </div>
          </div>

          <!-- Join Session Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-cyan-100">
              <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-3">Join Session</h2>
              <p class="text-gray-600 mb-6 leading-relaxed">Enter the session link to participate and contribute your insights</p>
              <input
                v-model="joinLink"
                type="text"
                placeholder="retro-abc123"
                class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all outline-none bg-white"
                @keydown.enter="handleJoinSession"
              />
              <button
                @click="handleJoinSession"
                class="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Join Retro
              </button>
            </div>
          </div>
        </div>

        <!-- AI Features Showcase -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Powered by <span class="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Artificial Intelligence</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Let AI do the heavy lifting. Focus on what matters - improving your team.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <!-- AI Action Items -->
            <div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border-2 border-teal-200 hover:border-teal-400 transition-all hover:shadow-2xl group">
              <div class="flex items-start gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">AI-Generated Action Items</h3>
                  <p class="text-gray-600 leading-relaxed">
                    Our AI analyzes your team's top-voted feedback and automatically generates
                    <span class="font-semibold text-teal-700">prioritized, actionable recommendations</span>.
                    No more manual brainstorming - get smart insights in seconds.
                  </p>
                </div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-teal-200">
                <div class="flex items-start gap-3 mb-3">
                  <div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Implement 15-minute timeboxed standups</p>
                    <p class="text-xs text-gray-600 mt-1">High Priority • Process Improvement</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 mb-3">
                  <div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Create automated deployment pipeline</p>
                    <p class="text-xs text-gray-600 mt-1">High Priority • Tooling</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Schedule weekly team sync meetings</p>
                    <p class="text-xs text-gray-600 mt-1">Medium Priority • Communication</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Word Export -->
            <div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border-2 border-cyan-200 hover:border-cyan-400 transition-all hover:shadow-2xl group">
              <div class="flex items-start gap-4 mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">Professional Word Export</h3>
                  <p class="text-gray-600 leading-relaxed">
                    Export your entire retrospective - including all feedback, votes, and AI-generated action items -
                    to a <span class="font-semibold text-cyan-700">beautifully formatted Word document</span>.
                    Perfect for sharing with stakeholders or archiving.
                  </p>
                </div>
              </div>
              <div class="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-cyan-200">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-800">Sprint_23_Retro.docx</p>
                      <p class="text-xs text-gray-500">Generated just now</p>
                    </div>
                  </div>
                  <div class="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Ready
                  </div>
                </div>
                <div class="space-y-2 text-xs text-gray-600">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>All feedback cards included</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>Voting results & rankings</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>AI action items with priorities</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span>Professional formatting</span>
                  </div>
                </div>
                <button class="mt-4 w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Real-time Sync</h3>
            <p class="text-sm text-gray-600">Instant updates for all participants</p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Anonymous Mode</h3>
            <p class="text-sm text-gray-600">Safe space for honest feedback</p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Smart Voting</h3>
            <p class="text-sm text-gray-600">Prioritize what matters most</p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Action Items</h3>
            <p class="text-sm text-gray-600">Convert ideas to outcomes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Modal -->
    <JoinModal
      :show="showJoinModal"
      :session-title="sessionQuery?.title"
      :is-loading="false"
      @join="handleJoinFromModal"
      @close="handleCloseModal"
    />
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 1s ease-out 0.2s both;
}
</style>
