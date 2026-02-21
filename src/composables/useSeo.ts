import { useHead, useSeoMeta } from '@unhead/vue'
import { computed } from 'vue'

interface SeoOptions {
  title: string
  description: string
  keywords?: string
  ogImage?: string
}

export function useSeo(options: SeoOptions) {
  // Use placeholder domain (update when domain is ready)
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://retro-live.netlify.app'
  const siteName = 'Retrospective Platform'

  const fullTitle = computed(() => `${options.title} | ${siteName}`)
  const ogImageUrl = computed(() =>
    options.ogImage?.startsWith('http')
      ? options.ogImage
      : `${siteUrl}${options.ogImage || '/og-default.svg'}`
  )

  useHead({
    title: fullTitle.value,
    meta: [
      { name: 'description', content: options.description },
      { name: 'keywords', content: options.keywords || '' },
      { name: 'google-site-verification', content: 'yfpZOep63Hntv4hj1cf0_WxT7d3B5a_tI0-zwohR9Nc' },
    ],
  })

  useSeoMeta({
    title: fullTitle.value,
    description: options.description,
    ogTitle: fullTitle.value,
    ogDescription: options.description,
    ogImage: ogImageUrl.value,
    ogType: 'website',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle.value,
    twitterDescription: options.description,
    twitterImage: ogImageUrl.value,
  })
}
