<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUser } from '@clerk/vue';
import { useMutation } from '../../composables/useConvex';
import { useNotification } from '../../composables/useNotification';
import { api } from '../../../convex/_generated/api';

const emit = defineEmits<{
  sessionCreated: [{ sessionId: string; shareLink: string; userId: string }];
}>();

const { user } = useUser();
const createSession = useMutation(api.sessions.createSession);
const syncClerkUser = useMutation(api.users.syncClerkUser);
const notification = useNotification();

// Pre-fill name from Clerk user
onMounted(() => {
  if (user.value) {
    facilitatorName.value = user.value.fullName || user.value.firstName || '';
  }
});

const title = ref('');
const teamName = ref('');
const facilitatorName = ref('');
const templateType = ref<'start_stop_continue' | 'mad_sad_glad' | 'went_well_to_improve_actions' | 'custom'>('went_well_to_improve_actions');
const customColumns = ref<string[]>(['', '', '']);
const votesPerUser = ref(3);
const timerEnabled = ref(false);
const timerDuration = ref(10);
const isCreating = ref(false);

const templates = [
  { value: 'start_stop_continue', label: 'Start / Stop / Continue', description: 'Identify actions to start, stop, and continue' },
  { value: 'mad_sad_glad', label: 'Mad / Sad / Glad', description: 'Express emotions about the sprint' },
  { value: 'went_well_to_improve_actions', label: 'Went Well / To Improve / Actions', description: 'Classic retrospective format' },
  { value: 'custom', label: 'Custom', description: 'Create your own columns' },
];

const addCustomColumn = () => {
  if (customColumns.value.length < 6) {
    customColumns.value.push('');
  }
};

const removeCustomColumn = (index: number) => {
  if (customColumns.value.length > 2) {
    customColumns.value.splice(index, 1);
  }
};

const handleCreateSession = async () => {
  if (!title.value.trim() || !teamName.value.trim() || !facilitatorName.value.trim()) {
    notification.error('Please fill in all required fields');
    return;
  }

  if (templateType.value === 'custom') {
    const validColumns = customColumns.value.filter(c => c.trim());
    if (validColumns.length < 2) {
      notification.error('Please provide at least 2 custom column names');
      return;
    }
  }

  isCreating.value = true;

  try {
    // Sync Clerk user with Convex
    if (!user.value) {
      notification.error('Please sign in to create a session');
      isCreating.value = false;
      return;
    }

    const userResult = await syncClerkUser({
      clerkId: user.value.id,
      name: facilitatorName.value.trim() || user.value.fullName || user.value.firstName || 'User',
      email: user.value.primaryEmailAddress?.emailAddress || '',
    });

    // Create session
    const sessionResult = await createSession({
      title: title.value.trim(),
      teamName: teamName.value.trim(),
      facilitatorId: userResult.userId,
      templateType: templateType.value,
      customColumns: templateType.value === 'custom'
        ? customColumns.value.filter(c => c.trim())
        : undefined,
      votesPerUser: votesPerUser.value,
      timerDuration: timerEnabled.value ? timerDuration.value : undefined,
    });

    // Store userId in localStorage
    localStorage.setItem(`userId_${sessionResult.sessionId}`, userResult.userId);

    emit('sessionCreated', {
      sessionId: sessionResult.sessionId,
      shareLink: sessionResult.shareLink,
      userId: userResult.userId,
    });

  } catch (error) {
    console.error('Failed to create session:', error);
    notification.error('Failed to create session. Please try again.');
  } finally {
    isCreating.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style="animation-delay: 2s;"></div>
    </div>

    <div class="relative z-10 w-full max-w-3xl">
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div class="text-center mb-10">
          <div class="inline-block mb-4">
            <span class="px-4 py-2 bg-sky-100 rounded-full text-sky-700 text-sm font-semibold border border-sky-200">
              Step 1 of 1
            </span>
          </div>
          <h1 class="text-5xl font-extrabold text-gray-800 mb-3">Create Retrospective</h1>
          <p class="text-xl text-gray-600">Set up your team's retrospective session</p>
        </div>

        <form @submit.prevent="handleCreateSession" class="space-y-6">
        <!-- Session Title -->
        <div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100">
          <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Session Title *
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="e.g., Sprint 42 Retrospective"
            required
            class="w-full px-5 py-4 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-white outline-none text-gray-900 font-medium"
          />
        </div>

        <!-- Team Name -->
        <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
          <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Team Name *
          </label>
          <input
            v-model="teamName"
            type="text"
            placeholder="e.g., Platform Team"
            required
            class="w-full px-5 py-4 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all bg-white outline-none text-gray-900 font-medium"
          />
        </div>

        <!-- Facilitator Name -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Your Name (Facilitator) *
          </label>
          <input
            v-model="facilitatorName"
            type="text"
            placeholder="e.g., Jane Smith"
            required
            class="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white outline-none text-gray-900 font-medium"
          />
        </div>

        <!-- Template Selection -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Template *
          </label>
          <div class="space-y-2">
            <label
              v-for="template in templates"
              :key="template.value"
              class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400"
              :class="templateType === template.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
            >
              <input
                v-model="templateType"
                type="radio"
                :value="template.value"
                class="mt-1 mr-3"
              />
              <div class="flex-1">
                <div class="font-semibold text-gray-900">{{ template.label }}</div>
                <div class="text-sm text-gray-600">{{ template.description }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Custom Columns (if custom template selected) -->
        <div v-if="templateType === 'custom'" class="space-y-3">
          <label class="block text-sm font-semibold text-gray-700">
            Custom Columns
          </label>
          <div
            v-for="(column, index) in customColumns"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="customColumns[index]"
              type="text"
              :placeholder="`Column ${index + 1} name`"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              v-if="customColumns.length > 2"
              type="button"
              @click="removeCustomColumn(index)"
              class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Remove
            </button>
          </div>
          <button
            v-if="customColumns.length < 6"
            type="button"
            @click="addCustomColumn"
            class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600"
          >
            + Add Column
          </button>
        </div>

        <!-- Votes Per User -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Votes Per User
          </label>
          <input
            v-model.number="votesPerUser"
            type="number"
            min="1"
            max="10"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-sm text-gray-500 mt-1">Each participant will have {{ votesPerUser }} votes</p>
        </div>

        <!-- Timer -->
        <div class="border-2 border-gray-200 rounded-lg p-4">
          <div class="flex items-center mb-3">
            <input
              v-model="timerEnabled"
              type="checkbox"
              id="timer-checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="timer-checkbox" class="ml-2 text-sm font-semibold text-gray-700">
              ⏱️ Enable Timer for Collecting Phase
            </label>
          </div>

          <div v-if="timerEnabled" class="space-y-2">
            <label class="block text-sm text-gray-700">
              Duration (minutes)
            </label>
            <input
              v-model.number="timerDuration"
              type="number"
              min="1"
              max="60"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500">
              Timer will countdown during the collecting phase
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isCreating"
          class="relative w-full px-8 py-5 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 text-white font-bold rounded-2xl hover:from-sky-600 hover:via-blue-600 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl text-lg group overflow-hidden"
        >
          <span class="relative z-10 flex items-center justify-center gap-3">
            <svg v-if="!isCreating" class="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span v-if="!isCreating">Create Retrospective</span>
            <span v-else class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Creating...
            </span>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        </button>
      </form>
    </div>
    </div>
  </div>
</template>