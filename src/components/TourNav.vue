<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useTour } from '@/composables/useTour.js';

const { stops, activeIndex, hasNavigated, cardOpen, next, prev, goTo } = useTour();

function onKey(e) {
  if (e.target.closest?.('input, textarea')) return;
  if (e.key === 'ArrowRight' || e.key === 'd') next();
  else if (e.key === 'ArrowLeft' || e.key === 'a') prev();
  else if (e.key === 'Escape') cardOpen.value = false;
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <v-fade-transition>
    <p v-if="!hasNavigated" class="hint text-body-2 text-medium-emphasis d-none d-md-block">
      Use ← → or click a building to explore
    </p>
  </v-fade-transition>

  <v-sheet class="tour-nav glass d-flex align-center ga-3 pa-2" rounded="pill" elevation="4" role="toolbar" aria-label="Tour navigation">
    <v-btn :icon="mdiArrowLeft" color="primary" aria-label="Previous stop" @click="prev" />

    <div class="d-flex ga-2">
      <button
        v-for="(s, i) in stops"
        :key="i"
        class="dot"
        :class="{ active: i === activeIndex }"
        :aria-label="`Go to ${s.title}`"
        :title="s.title"
        @click="goTo(i)"
      />
    </div>

    <v-btn :icon="mdiArrowRight" color="primary" aria-label="Next stop" @click="next" />
  </v-sheet>
</template>

<style scoped>
.tour-nav {
  position: fixed;
  left: 50%;
  bottom: var(--gutter);
  transform: translateX(-50%);
}
.hint {
  position: fixed;
  left: 50%;
  bottom: calc(var(--gutter) + 76px);
  transform: translateX(-50%);
  margin: 0;
  white-space: nowrap;
}
.dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(29, 36, 51, 0.25);
  cursor: pointer;
  transition: width 0.25s, background 0.25s;
}
.dot.active {
  width: 26px;
  background: rgb(var(--v-theme-primary));
}
</style>
