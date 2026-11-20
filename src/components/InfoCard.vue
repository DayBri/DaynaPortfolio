<script setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { VSlideXReverseTransition, VSlideYReverseTransition } from 'vuetify/components';
import { mdiClose, mdiHardHat, mdiOpenInNew } from '@mdi/js';
import { PROJECTS } from '@/content.js';
import { useTour } from '@/composables/useTour.js';
import SocialLinks from './SocialLinks.vue';

const { activeIndex, activeStop, cardOpen } = useTour();
const { smAndDown } = useDisplay();

const isAbout = computed(() => activeIndex.value === 0);
const accent = computed(() => activeStop.value.color ?? '#2a9d8f');
const kicker = computed(() =>
  isAbout.value ? activeStop.value.kicker : `Project ${activeIndex.value} of ${PROJECTS.length}`,
);
const underConstruction = computed(() => activeStop.value.status === 'construction');
const labels = computed(() =>
  underConstruction.value
    ? { problem: 'The idea', solution: 'Progress so far' }
    : { problem: 'The problem', solution: 'The solution' },
);
const transition = computed(() => (smAndDown.value ? VSlideYReverseTransition : VSlideXReverseTransition));
</script>

<template>
  <!-- The anchor positions; the card inside is free to be animated by the transition. -->
  <div class="card-anchor" :class="{ mobile: smAndDown }">
    <component :is="transition">
      <v-card
        v-if="cardOpen"
        :key="activeIndex"
        class="info-card glass"
        :style="{ '--accent': accent }"
        rounded="xl"
        elevation="8"
        aria-live="polite"
      >
        <v-btn
          :icon="mdiClose"
          variant="text"
          size="small"
          class="close"
          aria-label="Close"
          @click="cardOpen = false"
        />

        <v-card-item>
          <div class="kicker">{{ kicker }}</div>
          <v-card-title class="text-h5 font-weight-bold px-0 text-wrap">{{ activeStop.title }}</v-card-title>
          <v-chip
            v-if="underConstruction"
            :prepend-icon="mdiHardHat"
            color="#b7791f"
            variant="flat"
            class="construction-badge mt-1"
          >
            Under construction
          </v-chip>
        </v-card-item>

        <v-card-text class="text-body-1">
          <template v-if="isAbout">
            <p v-for="(para, i) in activeStop.body" :key="i" class="mb-3">{{ para }}</p>
            <SocialLinks size="small" class="mt-2" />
          </template>

          <template v-else>
            <template v-if="activeStop.problem">
              <h3 class="section">{{ labels.problem }}</h3>
              <p class="mb-3">{{ activeStop.problem }}</p>
            </template>
            <template v-if="activeStop.solution">
              <h3 class="section">{{ labels.solution }}</h3>
              <p class="mb-3">{{ activeStop.solution }}</p>
            </template>

            <div v-if="activeStop.tech?.length" class="d-flex flex-wrap ga-2 mt-4">
              <v-chip v-for="t in activeStop.tech" :key="t" :color="accent">{{ t }}</v-chip>
            </div>
          </template>
        </v-card-text>

        <v-card-actions v-if="!isAbout && activeStop.links?.length" class="px-4 pb-4 flex-wrap ga-2">
          <v-btn
            v-for="l in activeStop.links"
            :key="l.url"
            :href="l.url"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="flat"
            :append-icon="mdiOpenInNew"
            class="ma-0"
          >
            {{ l.label }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </component>
  </div>
</template>

<style scoped>
.card-anchor {
  position: fixed;
  top: 50%;
  right: var(--gutter);
  width: min(380px, calc(100vw - 2 * var(--gutter)));
  transform: translateY(-50%);
  pointer-events: none;
}
.card-anchor.mobile {
  top: auto;
  left: var(--gutter);
  bottom: calc(var(--gutter) + 72px);
  width: auto;
  transform: none;
}
.info-card {
  pointer-events: auto;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  border-top: 5px solid var(--accent) !important;
  padding-top: 8px;
}
.mobile .info-card {
  max-height: 40vh;
}
.close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}
.kicker {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--accent) 75%, black);
}
.section {
  margin: 12px 0 4px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.65;
}
p {
  line-height: 1.55;
}
/* Tonal chips are too faint with light accents; darken the label for contrast. */
.info-card :deep(.v-chip:not(.construction-badge)) {
  color: color-mix(in srgb, var(--accent) 60%, black) !important;
}
</style>
