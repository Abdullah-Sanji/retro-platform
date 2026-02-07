<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <svg
    :class="[
      'inline-block',
      size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
    ]"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Gradient definitions -->
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#4f46e5;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Lightbulb shape -->
    <g>
      <!-- Bulb -->
      <path d="M100 40 C75 40 55 60 55 85 C55 100 62 113 73 122 L73 140 L127 140 L127 122 C138 113 145 100 145 85 C145 60 125 40 100 40 Z"
            fill="url(#logoGradient)"/>

      <!-- Base of bulb -->
      <rect x="80" y="140" width="40" height="8" rx="2" fill="url(#logoGradient)" opacity="0.8"/>
      <rect x="85" y="148" width="30" height="12" rx="3" fill="url(#logoGradient)" opacity="0.6"/>

      <!-- Filament (circuit pattern) -->
      <g opacity="0.9">
        <path d="M90 80 L95 90 L100 80 L105 90 L110 80"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              fill="none"/>
        <circle cx="90" cy="80" r="2" fill="white"/>
        <circle cx="100" cy="80" r="2" fill="white"/>
        <circle cx="110" cy="80" r="2" fill="white"/>
      </g>

      <!-- AI Sparkles around the bulb -->
      <!-- Top sparkle -->
      <g transform="translate(100, 25)">
        <path d="M0,-10 L2,0 L0,10 L-2,0 Z" fill="#fbbf24"/>
        <path d="M-10,0 L0,2 L10,0 L0,-2 Z" fill="#fbbf24"/>
      </g>

      <!-- Top right sparkle -->
      <g transform="translate(140, 50)">
        <path d="M0,-7 L1.5,0 L0,7 L-1.5,0 Z" fill="#fbbf24" opacity="0.8"/>
        <path d="M-7,0 L0,1.5 L7,0 L0,-1.5 Z" fill="#fbbf24" opacity="0.8"/>
      </g>

      <!-- Top left sparkle -->
      <g transform="translate(60, 50)">
        <path d="M0,-7 L1.5,0 L0,7 L-1.5,0 Z" fill="#fbbf24" opacity="0.8"/>
        <path d="M-7,0 L0,1.5 L7,0 L0,-1.5 Z" fill="#fbbf24" opacity="0.8"/>
      </g>

      <!-- Right sparkle -->
      <g transform="translate(155, 90)">
        <path d="M0,-5 L1,0 L0,5 L-1,0 Z" fill="#fbbf24" opacity="0.6"/>
        <path d="M-5,0 L0,1 L5,0 L0,-1 Z" fill="#fbbf24" opacity="0.6"/>
      </g>

      <!-- Left sparkle -->
      <g transform="translate(45, 90)">
        <path d="M0,-5 L1,0 L0,5 L-1,0 Z" fill="#fbbf24" opacity="0.6"/>
        <path d="M-5,0 L0,1 L5,0 L0,-1 Z" fill="#fbbf24" opacity="0.6"/>
      </g>
    </g>
  </svg>
</template>
