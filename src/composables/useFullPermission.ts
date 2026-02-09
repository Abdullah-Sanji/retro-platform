/**
 * Composable to check if full permission mode is enabled
 * When enabled, all features are available for free
 */
export function useFullPermission() {
  const isFullPermissionMode = import.meta.env.VITE_FULL_PERMISSION === 'true'

  return {
    isFullPermissionMode
  }
}
