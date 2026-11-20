<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { createWorld } from '@/world/engine.js';
import { CHARACTER_MODEL } from '@/content.js';
import { useTour } from '@/composables/useTour.js';

const canvas = ref(null);
const tour = useTour();
let world = null;
let openTimer = null;

onMounted(() => {
  world = createWorld(canvas.value, {
    stops: tour.stops,
    characterModel: CHARACTER_MODEL,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    startAt: tour.startAt,
    onDepart: tour.handleDepart,
    onArrive: tour.handleArrive,
    onHover: (h) => (tour.hover.value = h),
  });
  tour.attachWorld(world);
  openTimer = setTimeout(() => (tour.cardOpen.value = true), 600);
});

// Let the camera slide the world out from under the card.
watch(tour.cardOpen, (open) => world?.setCardOpen(open));

onBeforeUnmount(() => {
  clearTimeout(openTimer);
  tour.attachWorld(null);
  world?.dispose();
});
</script>

<template>
  <canvas ref="canvas" class="world-canvas" />
</template>

<style scoped>
.world-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}
</style>
