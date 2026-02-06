<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NotificationToast from './components/shared/NotificationToast.vue'
import { provideNotification, type NotificationAPI } from './composables/useNotification'

const router = useRouter()
const notificationRef = ref<InstanceType<typeof NotificationToast>>()

// Provide notification API
onMounted(() => {
  if (notificationRef.value) {
    const notificationAPI: NotificationAPI = {
      success: (msg, duration) => notificationRef.value?.show(msg, 'success', duration),
      error: (msg, duration) => notificationRef.value?.show(msg, 'error', duration),
      warning: (msg, duration) => notificationRef.value?.show(msg, 'warning', duration),
      info: (msg, duration) => notificationRef.value?.show(msg, 'info', duration),
    }
    provideNotification(notificationAPI)
  }
})
</script>

<template>
  <div>
    <router-view />
    <NotificationToast ref="notificationRef" />
  </div>
</template>