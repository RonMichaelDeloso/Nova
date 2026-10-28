<template>
  <svg class="app-icon" :class="[`icon-${name}`, { 'icon-inline': inline }]" :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-for="(path, index) in (icons[name] || icons.sparkles)" :key="index" :d="path" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ name?: string; size?: number | string; inline?: boolean }>(), { name: 'sparkles', size: 18, inline: true })
const icons: Record<string, string[]> = {
  home: ['M3 10.5 12 3l9 7.5', 'M5.5 9.5V21h13V9.5', 'M9 21v-7h6v7'],
  car: ['M5 11l1.5-4h11L19 11', 'M3 11h18v7H3z', 'M6 18v2', 'M18 18v2', 'M6 14h.01', 'M18 14h.01'],
  calendar: ['M4 5h16v16H4z', 'M8 3v4', 'M16 3v4', 'M4 10h16'],
  pin: ['M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z', 'M12 10h.01'],
  message: ['M21 11.5a8.5 8.5 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.9-4A8.5 8.5 0 1 1 21 11.5Z'],
  search: ['m20 20-4.5-4.5', 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z'],
  sparkles: ['m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z', 'm19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z'],
  mail: ['M3 5h18v14H3z', 'm3 6 9 7 9-7'],
  user: ['M20 21a8 8 0 0 0-16 0', 'M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  eyeoff: ['M3 3l18 18', 'M10.6 10.6a2 2 0 0 0 2.8 2.8', 'M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.2 4.1', 'M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.4 0 2.6-.3 3.7-.8'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'],
  history: ['M3 12a9 9 0 1 0 2.6-6.4L3 8', 'M3 3v5h5', 'M12 7v5l3 2'],
  bell: ['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9', 'M10 21h4'],
  route: ['M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3'],
  note: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
  check: ['m5 12 4 4L19 6'],
  map: ['M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z', 'M9 3v15', 'M15 6v15'],
  calendarclock: ['M4 5h11v15H4z', 'M8 3v4', 'M12 3v4', 'M4 10h11', 'M18 12v4l3 2'],
  building: ['M4 21V4l8-2v19', 'M12 8h8v13', 'M7 7h1', 'M7 11h1', 'M7 15h1', 'M15 12h1', 'M18 12h1', 'M15 16h1', 'M18 16h1'],
  store: ['M3 10h18', 'M5 10v10h14V10', 'M9 20v-6h6v6', 'M3 10l2-6h14l2 6', 'M4 10a2 2 0 0 0 4 0', 'M8 10a2 2 0 0 0 4 0', 'M12 10a2 2 0 0 0 4 0', 'M16 10a2 2 0 0 0 4 0'],
  phone: ['M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z'],
  tree: ['M12 22v-7', 'm7 15 5-12 5 12z', 'm5 11 7-8 7 8z'],
  landmark: ['M3 21h18', 'M5 21V10h14v11', 'M3 10h18L12 3 3 10Z', 'M9 14v3', 'M15 14v3'],
  ship: ['M3 17 5 10h14l2 7', 'M2 17c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 8 0', 'M12 10V3l5 4h-5'],
  shopping: ['M3 4h2l2 12h11l3-9H6', 'M9 20h.01', 'M18 20h.01'],
  location: ['M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z', 'M12 9h.01'],
}
</script>

<style scoped>
.app-icon { display: inline-block; vertical-align: -0.18em; flex: 0 0 auto; }
</style>
