<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RetroBoard from '@/components/retro/RetroBoard.vue'
import JoinModal from '@/components/shared/JoinModal.vue'
import { useQuery, useMutation } from '@/composables/useConvex'
import { api } from '../../../convex/_generated/api'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const notification = useNotification()

const userId = ref<string>('')
const showJoinModal = ref(false)
const isJoining = ref(false)

const createUser = useMutation(api.users.createUser)

// Get shareLink from query param (for join flow)
const shareLink = computed(() => {
  const query = route.query.session as string
  return query || ''
})

// Query session by shareLink
const sessionQuery = useQuery(
  api.sessions.getSessionByLink,
  () => shareLink.value ? { shareLink: shareLink.value } : 'skip'
)

// Get sessionId from params OR from sessionQuery
const sessionId = computed(() => {
  // If sessionId in params, use that (direct navigation)
  if (route.params.sessionId) {
    return route.params.sessionId as string
  }
  // Otherwise, get from session query (join flow)
  return sessionQuery.value?._id || ''
})

// Check for existing userId on mount and when session loads
onMounted(() => {
  checkUserAndShowModal()
})

watch(sessionQuery, () => {
  if (sessionQuery.value && !userId.value) {
    checkUserAndShowModal()
  }
})

const checkUserAndShowModal = () => {
  if (!sessionId.value) return

  // Check if user already has a userId for this session
  const storedUserId = localStorage.getItem(`userId_${sessionId.value}`)

  if (storedUserId) {
    // User already joined this session
    userId.value = storedUserId
  } else if (shareLink.value || sessionQuery.value) {
    // New user with share link, show join modal
    showJoinModal.value = true
  } else {
    // No stored user and no session data, redirect to home
    notification.error('Session not found. Please check the link.')
    router.push('/')
  }
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

    userId.value = userResult.userId

    // Store userId and session
    localStorage.setItem(`userId_${session._id}`, userResult.userId)
    if (shareLink.value) {
      localStorage.setItem(`lastSession`, shareLink.value)
    }

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
  // If user cancels join, redirect to home
  router.push('/')
}
</script>

<template>
  <div>
    <RetroBoard
      v-if="sessionId && userId"
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
  </div>
</template>
