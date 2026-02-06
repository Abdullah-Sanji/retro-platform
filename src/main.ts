import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { ConvexClient } from 'convex/browser'
import { ConvexClientKey } from './composables/useConvex'
import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import { routes } from './router'
import './style.css'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, isClient }) => {
    // Setup Pinia
    const pinia = createPinia()
    app.use(pinia)

    // Setup Clerk (client-side only)
    if (isClient) {
      const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
      if (clerkPubKey) {
        app.use(clerkPlugin, {
          publishableKey: clerkPubKey,
        })
      }
    }

    // Setup Convex
    if (isClient) {
      // Real client for browser
      const convexUrl = import.meta.env.VITE_CONVEX_URL
      if (convexUrl) {
        const convexClient = new ConvexClient(convexUrl)
        app.provide(ConvexClientKey, convexClient)
      }
    } else {
      // Mock client for SSR - prevents errors during prerendering
      const mockClient = {} as any
      app.provide(ConvexClientKey, mockClient)
    }
  }
)