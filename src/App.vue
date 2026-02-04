<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useQuery, useMutation } from './composables/useConvex';
import { api } from '../convex/_generated/api';
import SessionSetup from './components/SessionSetup.vue';
import RetroBoard from './components/RetroBoard.vue';
import JoinModal from './components/JoinModal.vue';
import NotificationToast from './components/NotificationToast.vue';
import { provideNotification, type NotificationAPI } from './composables/useNotification';

const notificationRef = ref<InstanceType<typeof NotificationToast>>();

// Provide notification API
onMounted(() => {
  if (notificationRef.value) {
    const notificationAPI: NotificationAPI = {
      success: (msg, duration) => notificationRef.value?.show(msg, 'success', duration),
      error: (msg, duration) => notificationRef.value?.show(msg, 'error', duration),
      warning: (msg, duration) => notificationRef.value?.show(msg, 'warning', duration),
      info: (msg, duration) => notificationRef.value?.show(msg, 'info', duration),
    };
    provideNotification(notificationAPI);
  }
});

// Router state
const currentView = ref<'home' | 'setup' | 'board'>('home');
const sessionId = ref<string>('');
const userId = ref<string>('');
const shareLink = ref<string>('');
const joinLink = ref<string>('');
const showJoinModal = ref(false);
const pendingSessionLink = ref<string>('');
const isJoining = ref(false);

const createUser = useMutation(api.users.createUser);
const sessionQuery = useQuery(
  api.sessions.getSessionByLink,
  computed(() => pendingSessionLink.value ? { shareLink: pendingSessionLink.value } : 'skip')
);

const isSessionLoading = computed(() => {
  return pendingSessionLink.value && !sessionQuery.value;
});

// Check URL for share link on mount
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const link = urlParams.get('session');

  if (link) {
    pendingSessionLink.value = link;

    // Wait for session data to load first
    const unwatch = watch(sessionQuery, (session) => {
      if (session) {
        sessionId.value = session._id;

        // Check if user already has a userId for THIS specific session
        const storedUserId = localStorage.getItem(`userId_${session._id}`);

        if (storedUserId) {
          // User already joined this session, go directly to board
          shareLink.value = link;
          userId.value = storedUserId;
          currentView.value = 'board';
        } else {
          // New user, show join modal
          showJoinModal.value = true;
        }

        unwatch();
      }
    }, { immediate: true });
  }
});

const handleCreateSession = (data: { sessionId: string; shareLink: string; userId: string }) => {
  sessionId.value = data.sessionId;
  shareLink.value = data.shareLink;
  userId.value = data.userId;

  // Store as last session
  localStorage.setItem(`lastSession`, data.shareLink);

  // Update URL
  window.history.pushState({}, '', `?session=${data.shareLink}`);

  currentView.value = 'board';
};

const handleJoinFromModal = async (userData: { name: string; isAnonymous: boolean }) => {
  isJoining.value = true;

  try {
    const session = sessionQuery.value;
    if (!session) {
      notificationRef.value?.show('Session not found. Please check the link.', 'error');
      isJoining.value = false;
      return;
    }

    // Create user
    const userResult = await createUser({
      name: userData.name,
      isAnonymous: userData.isAnonymous,
    });

    userId.value = userResult.userId;
    sessionId.value = session._id;
    shareLink.value = pendingSessionLink.value;

    // Store userId and session
    localStorage.setItem(`userId_${session._id}`, userResult.userId);
    localStorage.setItem(`lastSession`, pendingSessionLink.value);

    // Update URL
    window.history.pushState({}, '', `?session=${pendingSessionLink.value}`);

    showJoinModal.value = false;
    currentView.value = 'board';
  } catch (error) {
    console.error('Failed to join session:', error);
    notificationRef.value?.show('Failed to join session. Please try again.', 'error');
  } finally {
    isJoining.value = false;
  }
};

const handleJoinSession = async () => {
  if (!joinLink.value.trim()) return;

  pendingSessionLink.value = joinLink.value;
  showJoinModal.value = true;
};

const handleCloseModal = () => {
  showJoinModal.value = false;
  pendingSessionLink.value = '';

  // Clear URL if user cancels joining
  if (!userId.value) {
    window.history.pushState({}, '', '/');
  }
};

const copyShareLink = () => {
  const fullLink = `${window.location.origin}?session=${shareLink.value}`;
  navigator.clipboard.writeText(fullLink);
  notificationRef.value?.show('Link copied to clipboard!', 'success');
};

const goToSetup = () => {
  currentView.value = 'setup';
};
</script>

<template>
  <div>
    <!-- Home Screen -->
    <div v-if="currentView === 'home'" class="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" style="animation-delay: 4s;"></div>
      </div>

      <div class="text-center max-w-5xl relative z-10 animate-fade-in">
        <!-- Hero Section -->
        <div class="mb-12">
          <div class="inline-block mb-6">
            <span class="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sky-700 text-sm font-semibold border border-sky-200 shadow-sm">
              🚀 Real-time Collaboration Platform
            </span>
          </div>
          <h1 class="text-7xl font-extrabold text-gray-800 mb-6 leading-tight tracking-tight">
            Retrospectives
            <span class="block bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          <p class="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-light">
            Empower your team with engaging, structured retrospectives that drive real change
          </p>
        </div>

        <!-- Action Cards -->
        <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16 animate-slide-up">
          <!-- Create Session Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-sky-300 to-blue-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div class="relative flex flex-col justify-between h-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-sky-100">
              <div>
                <div class="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-3">Create Session</h2>
                <p class="text-gray-600 mb-6 leading-relaxed">Start a new retrospective and invite your team to collaborate in real-time</p>
              </div>
              <button
                @click="goToSetup"
                class="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Create New Retro
              </button>
            </div>
          </div>

          <!-- Join Session Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-300 to-green-300 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-100">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
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
                class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all outline-none bg-white"
                @keydown.enter="handleJoinSession"
              />
              <button
                @click="handleJoinSession"
                class="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Join Retro
              </button>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Real-time Sync</h3>
            <p class="text-sm text-gray-600">Instant updates for all participants</p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Anonymous Mode</h3>
            <p class="text-sm text-gray-600">Safe space for honest feedback</p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-gray-800 mb-2">Smart Voting</h3>
            <p class="text-sm text-gray-600">Prioritize what matters most</p>
          </div>
          <div class="flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-md border border-gray-100">
            <div class="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
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

    <!-- Setup Screen -->
    <SessionSetup
      v-else-if="currentView === 'setup'"
      @session-created="handleCreateSession"
    />

    <!-- Board Screen -->
    <RetroBoard
      v-else-if="currentView === 'board' && sessionId && userId"
      :session-id="sessionId"
      :user-id="userId"
    />

    <!-- Join Modal -->
    <JoinModal
      :show="showJoinModal"
      :session-title="sessionQuery?.title"
      :is-loading="false"
      @join="handleJoinFromModal"
      @close="handleCloseModal"
    />

    <!-- Notification Toast -->
    <NotificationToast ref="notificationRef" />
  </div>
</template>