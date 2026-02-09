import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    include: ['convex/browser'],
  },

  // SSG Configuration for vite-ssg
  ssgOptions: {
    // Disable SSG completely due to Clerk authentication throughout the app
    includedRoutes() {
      return []
    },
    formatting: 'minify',
    criticalCSS: false,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'marketing': [
            './src/pages/marketing/HomePage.vue',
            './src/pages/marketing/FeaturesPage.vue',
            './src/pages/marketing/PricingPage.vue',
          ],
          'app': [
            './src/pages/app/SessionSetupPage.vue',
            './src/pages/app/RetroBoardPage.vue',
          ],
          'retro': [
            './src/components/retro/RetroBoard.vue',
            './src/components/retro/RetroColumn.vue',
          ],
        }
      }
    }
  }
});