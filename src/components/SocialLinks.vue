<script setup>
import { SOCIALS } from '@/content.js';

defineProps({
  size: { type: String, default: 'default' },
});

const isExternal = (url) => !url.startsWith('mailto:');
</script>

<template>
  <div class="d-flex ga-2">
    <v-tooltip v-for="s in SOCIALS" :key="s.url" :text="s.label" location="bottom">
      <template #activator="{ props: tip }">
        <v-btn
          v-bind="tip"
          :href="s.url"
          :target="isExternal(s.url) ? '_blank' : undefined"
          :rel="isExternal(s.url) ? 'noopener noreferrer' : undefined"
          :aria-label="s.label"
          :icon="s.icon"
          :size="size"
          class="glass"
          elevation="2"
        />
      </template>
    </v-tooltip>
  </div>
</template>
