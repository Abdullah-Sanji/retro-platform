<script setup lang="ts">
import { useRouter } from 'vue-router'
import SessionSetup from '@/components/retro/SessionSetup.vue'

const router = useRouter()

const handleSessionCreated = (data: { sessionId: string; shareLink: string; userId: string }) => {
  // Store as last session
  localStorage.setItem(`lastSession`, data.shareLink)

  // Navigate to board using router
  router.push({
    name: 'board',
    params: { sessionId: data.sessionId }
  })
}
</script>

<template>
  <SessionSetup @session-created="handleSessionCreated" />
</template>
