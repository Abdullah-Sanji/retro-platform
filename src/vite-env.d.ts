/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_PAYPAL_PLAN_ID_MONTHLY: string
  readonly VITE_PAYPAL_PLAN_ID_YEARLY: string
  readonly VITE_AI_API_URL: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
