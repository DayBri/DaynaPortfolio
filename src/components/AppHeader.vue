<script setup>
import { NAME, TAGLINE } from '@/content.js';
import SocialLinks from './SocialLinks.vue';

document.title = `${NAME} · Portfolio`;
</script>

<template>
  <header class="app-header">
    <div class="interactive">
      <h1 class="text-h4 font-weight-bold">{{ NAME }}</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">{{ TAGLINE }}</p>
    </div>
    <SocialLinks class="interactive" />
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  inset: 0 0 auto 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: var(--gutter);
  pointer-events: none;
}

h1 {
  letter-spacing: -0.02em !important;
  line-height: 1.1;
}

@media (max-width: 720px) {
  .app-header {
    flex-direction: column;
  }

  h1 {
    font-size: 1.6rem !important;
  }
}
</style>
