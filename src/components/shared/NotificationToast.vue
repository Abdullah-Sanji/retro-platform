<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const notifications = ref<Notification[]>([]);

const show = (message: string, type: Notification['type'] = 'info', duration = 5000) => {
  const id = Math.random().toString(36).substr(2, 9);
  const notification: Notification = { id, type, message, duration };

  notifications.value.push(notification);

  if (duration > 0) {
    setTimeout(() => {
      remove(id);
    }, duration);
  }
};

const remove = (id: string) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

// Expose methods for external use
defineExpose({ show, remove });

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    case 'info': return 'ℹ';
  }
};

const getColorClasses = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
    case 'error': return 'bg-gradient-to-r from-rose-500 to-red-500 text-white';
    case 'warning': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
    case 'info': return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
  }
};
</script>

<template>
  <div class="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'pointer-events-auto rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 min-w-96 max-w-md backdrop-blur-xl border border-white/30',
          getColorClasses(notification.type)
        ]"
      >
        <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <div class="text-2xl font-bold">{{ getIcon(notification.type) }}</div>
        </div>
        <div class="flex-1 font-medium">{{ notification.message }}</div>
        <button
          @click="remove(notification.id)"
          class="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white font-bold flex-shrink-0"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.2s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
