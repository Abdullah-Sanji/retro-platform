import { ref } from 'vue'
import { useUser } from '@clerk/vue'

/**
 * SSR-safe wrapper around Clerk's useUser.
 * During SSG pre-rendering Clerk's plugin is not installed,
 * so useUser() throws. This falls back to null values so
 * marketing pages render correctly as "logged-out" state.
 */
export function useSafeUser() {
  try {
    return useUser()
  } catch {
    return {
      user: ref(null),
      isSignedIn: ref(false),
    }
  }
}
