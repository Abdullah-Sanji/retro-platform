import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw, RouterHistory } from 'vue-router'
import MarketingLayout from '@/layouts/MarketingLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

export const routes: RouteRecordRaw[] = [
  // Marketing Routes (will be prerendered for SEO)
  {
    path: '/',
    component: MarketingLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/marketing/HomePage.vue'),
        meta: {
          title: 'Retrospective Platform - Real-time Team Collaboration',
          description: 'Empower your team with engaging, structured retrospectives that drive real change.',
          keywords: 'retrospective, retro platform, agile, scrum, team collaboration',
        },
        // Redirect if ?session query param is present
        beforeEnter: (to, from, next) => {
          if (to.query.session) {
            next({ path: '/app/join', query: { session: to.query.session } })
          } else {
            next()
          }
        }
      },
      {
        path: 'features',
        name: 'features',
        component: () => import('@/pages/marketing/FeaturesPage.vue'),
        meta: {
          title: 'Features - Powerful Retrospective Tools',
          description: 'Real-time collaboration, anonymous feedback, smart voting, and action tracking.',
        }
      },
      {
        path: 'pricing',
        name: 'pricing',
        component: () => import('@/pages/marketing/PricingPage.vue'),
        meta: {
          title: 'Pricing - Simple, Transparent Plans',
          description: 'Start free, upgrade as you grow. Plans for teams of all sizes.',
        }
      },
    ]
  },

  // App Routes (SPA only, NOT prerendered)
  {
    path: '/app',
    component: AppLayout,
    children: [
      {
        path: 'create',
        name: 'create-session',
        component: () => import('@/pages/app/SessionSetupPage.vue'),
      },
      {
        path: 'board/:sessionId',
        name: 'board',
        component: () => import('@/pages/app/RetroBoardPage.vue'),
        props: true,
      },
      // Join route - handles ?session=xxx
      {
        path: 'join',
        name: 'join',
        component: () => import('@/pages/app/RetroBoardPage.vue'),
      },
    ]
  },

  // Dashboard (requires auth)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/app/DashboardPage.vue'),
  },
]

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    history: history || (import.meta.env.SSR ? createMemoryHistory() : createWebHistory()),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    }
  })
}
