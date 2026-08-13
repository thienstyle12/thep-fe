<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}>();
</script>

<template>
  <div class="inline-flex items-center gap-2 select-none">
    <!-- SVG Vector Logo Matching Official Image 100% -->
    <svg 
      viewBox="0 0 280 180" 
      :class="[
        'w-auto transition-transform duration-300 group-hover:scale-105',
        size === 'sm' ? 'h-9' : size === 'lg' ? 'h-14' : 'h-11'
      ]" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Top Navy Swoosh Arc -->
      <path d="M 100 25 Q 170 -2 225 22" stroke="#16253b" stroke-width="3" stroke-linecap="round"/>

      <!-- Letter V (Navy Blue) -->
      <path 
        d="M 68 28 L 108 108 L 144 28" 
        stroke="#16253b" 
        stroke-width="26" 
        stroke-linecap="square" 
        stroke-linejoin="miter"
      />

      <!-- Letter T (Dark Red) -->
      <path 
        d="M 122 28 L 225 28 M 172 28 L 172 108" 
        stroke="#c9252b" 
        stroke-width="26" 
        stroke-linecap="square"
      />

      <!-- Lower Grey Swoosh Curve -->
      <path d="M 52 58 Q 95 130 205 110" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Lower Red Swoosh Line -->
      <path d="M 85 92 Q 135 142 195 118" stroke="#c9252b" stroke-width="2.2" stroke-linecap="round"/>

      <!-- Brand Name: THÉP VIỆT TÍN -->
      <text 
        x="140" 
        y="150" 
        text-anchor="middle" 
        fill="#16253b" 
        font-family="Arial, 'Helvetica Neue', sans-serif" 
        font-weight="900" 
        font-size="24" 
        letter-spacing="0.8"
      >THÉP VIỆT TÍN</text>

      <!-- Subtitle & Red Lines: — CHẤT LƯỢNG TẠO NIỀM TIN — -->
      <g v-if="!hideText">
        <line x1="22" y1="167" x2="52" y2="167" stroke="#c9252b" stroke-width="1.5" />
        <text 
          x="140" 
          y="171" 
          text-anchor="middle" 
          fill="#16253b" 
          font-family="Arial, 'Helvetica Neue', sans-serif" 
          font-weight="800" 
          font-size="9.5" 
          letter-spacing="1.2"
        >CHẤT LƯỢNG TẠO NIỀM TIN</text>
        <line x1="228" y1="167" x2="258" y2="167" stroke="#c9252b" stroke-width="1.5" />
      </g>
    </svg>
  </div>
</template>
