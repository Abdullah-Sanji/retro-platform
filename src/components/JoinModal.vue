<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  sessionTitle?: string;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  join: [{ name: string; isAnonymous: boolean }];
  close: [];
}>();

const userName = ref('');
const isAnonymous = ref(false);

const handleSubmit = () => {
  if (props.isLoading) return;
  const name = userName.value.trim() || 'Anonymous User';
  emit('join', { name, isAnonymous: isAnonymous.value || !userName.value.trim() });
  userName.value = '';
  isAnonymous.value = false;
};

const handleClose = () => {
  if (props.isLoading) return;
  emit('close');
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm h-screen"
      @click.self="handleClose"
    >
      <div
        class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full p-10 transform transition-all border border-gray-100"
        @click.stop
      >
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
          </div>
          <h2 class="text-4xl font-extrabold text-gray-800 mb-3">Join Retrospective</h2>
          <div v-if="isLoading" class="flex items-center justify-center gap-2 text-gray-600">
            <div class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
            <span class="font-medium">Loading session...</span>
          </div>
          <p v-else-if="sessionTitle" class="text-xl text-gray-600 font-medium">{{ sessionTitle }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100">
            <label class="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Your Name
            </label>
            <input
              v-model="userName"
              type="text"
              placeholder="Enter your name (optional)"
              class="w-full px-5 py-4 border-2 border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-white outline-none text-gray-900 font-medium"
              autofocus
            />
            <p class="text-xs text-gray-600 mt-3 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Leave blank to join anonymously
            </p>
          </div>

          <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 flex items-start gap-3 border border-emerald-100">
            <input
              v-model="isAnonymous"
              type="checkbox"
              id="anonymous-checkbox"
              class="w-5 h-5 mt-0.5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 bg-white"
            />
            <label for="anonymous-checkbox" class="text-sm text-gray-700 font-medium leading-relaxed">
              Join as anonymous (your name won't be shown on cards)
            </label>
          </div>

          <div class="flex gap-4 pt-2">
            <button
              type="button"
              @click="handleClose"
              :disabled="isLoading"
              class="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Joining...
              </span>
              <span v-else>Join Session</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
