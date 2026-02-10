<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation } from '../../composables/useConvex';
import { useNotification } from '../../composables/useNotification';
import { api } from '../../../convex/_generated/api';

const props = defineProps<{
  sessionId: string;
  userId: string;
  currentPhase: string;
  sessionData?: any;
}>();

const emit = defineEmits<{
  sessionEnded: [];
}>();

const updatePhase = useMutation(api.sessions.updatePhase);
const endSession = useMutation(api.sessions.endSession);
const notification = useNotification();

const showPhaseConfirm = ref(false);
const showEndConfirm = ref(false);
const pendingPhase = ref('');

const phases = [
  { value: 'collecting', label: 'Collecting', color: 'from-blue-500 to-cyan-500' },
  { value: 'grouping', label: 'Grouping', color: 'from-teal-500 to-pink-500' },
  { value: 'voting', label: 'Voting', color: 'from-emerald-500 to-green-500' },
  { value: 'discussion', label: 'Discussion', color: 'from-orange-500 to-amber-500' },
];

const isSessionActive = computed(() => {
  return props.sessionData?.session?.isActive !== false && props.currentPhase !== 'completed';
});

const handlePhaseChange = (newPhase: string) => {
  if (newPhase === props.currentPhase) return;
  if (!isSessionActive.value) return;
  pendingPhase.value = newPhase;
  showPhaseConfirm.value = true;
};

const confirmPhaseChange = async () => {
  showPhaseConfirm.value = false;

  try {
    await updatePhase({
      sessionId: props.sessionId,
      userId: props.userId,
      phase: pendingPhase.value as any,
    });
    notification.success(`Moved to ${phases.find(p => p.value === pendingPhase.value)?.label} phase`);
  } catch (error) {
    console.error('Failed to update phase:', error);
    notification.error('Failed to update phase');
  }
};

const handleEndSession = () => {
  showEndConfirm.value = true;
};

const confirmEndSession = async () => {
  showEndConfirm.value = false;

  try {
    await endSession({
      sessionId: props.sessionId,
      userId: props.userId,
    });
    notification.success('Session ended successfully');
    emit('sessionEnded');
  } catch (error) {
    console.error('Failed to end session:', error);
    notification.error('Failed to end session');
  }
};
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Phase Badges -->
    <div class="flex gap-2">
      <button
        v-for="phase in phases"
        :key="phase.value"
        @click="handlePhaseChange(phase.value)"
        :disabled="!isSessionActive"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md',
          !isSessionActive
            ? 'opacity-50 cursor-not-allowed'
            : 'transform hover:scale-105',
          currentPhase === phase.value
            ? `bg-gradient-to-r ${phase.color} text-white shadow-lg`
            : 'glass text-gray-700 hover:shadow-lg'
        ]"
      >
        {{ phase.label }}
      </button>
    </div>

    <!-- Divider -->
    <div class="h-10 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

    <!-- End Session -->
    <button
      v-if="isSessionActive"
      @click="handleEndSession"
      class="px-5 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      End Session
    </button>
    <div
      v-else
      class="px-5 py-2 bg-gray-400 text-white rounded-xl text-sm font-semibold shadow-lg"
    >
      Session Ended
    </div>

    <!-- Facilitator Badge -->
    <div class="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      Facilitator
    </div>

    <!-- Phase Change Confirmation Modal -->
    <div
      v-if="showPhaseConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm h-screen"
      @click.self="showPhaseConfirm = false"
    >
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        <div class="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3 text-center">Change Phase?</h3>
        <p class="text-gray-600 mb-8 text-center text-lg">
          Move to <strong class="text-gray-800">{{ phases.find(p => p.value === pendingPhase)?.label }}</strong> phase?
        </p>
        <div class="flex gap-3">
          <button
            @click="showPhaseConfirm = false"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            @click="confirmPhaseChange"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all shadow-xl"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- End Session Confirmation Modal -->
    <div
      v-if="showEndConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm h-screen"
      @click.self="showEndConfirm = false"
    >
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
        <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3 text-center">End Session?</h3>
        <p class="text-gray-600 mb-8 text-center leading-relaxed">
          Are you sure you want to end this retrospective? This will mark the session as completed and you'll be able to download the action items report.
        </p>
        <div class="flex gap-3">
          <button
            @click="showEndConfirm = false"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            @click="confirmEndSession"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-xl"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>