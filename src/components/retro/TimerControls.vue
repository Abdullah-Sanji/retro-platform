<script setup lang="ts">
import { computed } from 'vue'
import { useMutation } from '../../composables/useConvex'
import { useNotification } from '../../composables/useNotification'
import { api } from '../../../convex/_generated/api'

const props = defineProps<{
  sessionId: string
  userId: string
  timerDuration?: number // Timer duration in minutes
  timerEndsAt?: number // Timestamp when timer ends
}>()

const notification = useNotification()

const startTimer = useMutation(api.sessions.startTimer)
const stopTimer = useMutation(api.sessions.stopTimer)
const restartTimer = useMutation(api.sessions.restartTimer)

const isRunning = computed(() => {
  return props.timerEndsAt && props.timerEndsAt > Date.now()
})

const handleStart = async () => {
  try {
    await startTimer({
      sessionId: props.sessionId,
      userId: props.userId,
    })
    notification.success('Timer started')
  } catch (error) {
    console.error('Failed to start timer:', error)
    notification.error('Failed to start timer')
  }
}

const handleStop = async () => {
  try {
    await stopTimer({
      sessionId: props.sessionId,
      userId: props.userId,
    })
    notification.success('Timer stopped')
  } catch (error) {
    console.error('Failed to stop timer:', error)
    notification.error('Failed to stop timer')
  }
}

const handleRestart = async () => {
  try {
    await restartTimer({
      sessionId: props.sessionId,
      userId: props.userId,
    })
    notification.success('Timer restarted')
  } catch (error) {
    console.error('Failed to restart timer:', error)
    notification.error('Failed to restart timer')
  }
}
</script>

<template>
  <div v-if="timerDuration" class="flex items-center gap-2">
    <!-- Start Button (only show when timer is not running) -->
    <button
      v-if="!isRunning"
      @click="handleStart"
      class="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md"
      title="Start timer"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>

    <!-- Stop Button (only show when timer is running) -->
    <button
      v-if="isRunning"
      @click="handleStop"
      class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
      title="Stop timer"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 6h12v12H6z"/>
      </svg>
    </button>

    <!-- Restart Button (always show when timer is configured) -->
    <button
      @click="handleRestart"
      class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md"
      title="Restart timer"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
    </button>
  </div>
</template>
