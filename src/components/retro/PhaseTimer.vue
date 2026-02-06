<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  endsAt?: number; // Timestamp when timer ends
  duration?: number; // Timer duration in minutes
}>();

const emit = defineEmits<{
  timeUp: [];
}>();

const now = ref(Date.now());
const intervalId = ref<number | null>(null);

const isRunning = computed(() => {
  return props.endsAt && props.endsAt > now.value;
});

const timeRemaining = computed(() => {
  if (isRunning.value && props.endsAt) {
    // Timer is running - show countdown
    const remaining = Math.max(0, props.endsAt - now.value);
    return remaining;
  } else if (props.duration) {
    // Timer not started - show initial duration
    return props.duration * 60 * 1000;
  }
  return null;
});

const minutes = computed(() => {
  if (timeRemaining.value === null) return 0;
  return Math.floor(timeRemaining.value / 1000 / 60);
});

const seconds = computed(() => {
  if (timeRemaining.value === null) return 0;
  return Math.floor((timeRemaining.value / 1000) % 60);
});

const formattedTime = computed(() => {
  return `${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}`;
});

const percentage = computed(() => {
  if (!isRunning.value) return 100; // Show full circle when not running
  if (!props.endsAt || !props.duration) return 100;

  const totalDuration = props.duration * 60 * 1000;
  const elapsed = Date.now() - (props.endsAt - totalDuration);
  const remaining = props.endsAt - Date.now();
  return Math.max(0, Math.min(100, (remaining / totalDuration) * 100));
});

const colorClass = computed(() => {
  if (!isRunning.value) return 'text-blue-600'; // Blue when not started
  if (minutes.value > 5) return 'text-green-600';
  if (minutes.value > 2) return 'text-yellow-600';
  return 'text-red-600';
});

const ringColor = computed(() => {
  if (!isRunning.value) return 'stroke-blue-500'; // Blue when not started
  if (minutes.value > 5) return 'stroke-green-500';
  if (minutes.value > 2) return 'stroke-yellow-500';
  return 'stroke-red-500';
});

onMounted(() => {
  intervalId.value = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
  }
});

watch(timeRemaining, (remaining) => {
  if (remaining !== null && remaining === 0) {
    emit('timeUp');
  }
});
</script>

<template>
  <div v-if="duration && timeRemaining !== null" class="flex items-center gap-3 bg-white rounded-lg shadow-md px-4 py-2">
    <div class="relative w-12 h-12">
      <svg class="w-full h-full transform -rotate-90">
        <!-- Background circle -->
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke-width="4"
          fill="none"
          class="stroke-gray-200"
        />
        <!-- Progress circle -->
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke-width="4"
          fill="none"
          :class="ringColor"
          :stroke-dasharray="`${2 * Math.PI * 20}`"
          :stroke-dashoffset="`${2 * Math.PI * 20 * (1 - percentage / 100)}`"
          class="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center text-xs font-bold" :class="colorClass">
        ⏱️
      </div>
    </div>
    <div>
      <div class="text-2xl font-bold font-mono" :class="colorClass">
        {{ formattedTime }}
      </div>
      <div class="text-xs text-gray-500">Time Remaining</div>
    </div>
  </div>
</template>
