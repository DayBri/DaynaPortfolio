<script setup>
import { useTour } from '@/composables/useTour.js';

const { hover } = useTour();
</script>

<template>
  <div
    v-if="hover"
    class="hover-tooltip text-caption bg-primary"
    :style="{ transform: `translate(${hover.x + 14}px, ${hover.y + 14}px)` }"
  >
    {{ hover.title }}
  </div>
</template>

<style scoped>
.hover-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  padding: 6px 10px;
  border-radius: 8px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
}
</style>
