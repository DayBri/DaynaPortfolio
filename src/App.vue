<script setup>
import WorldCanvas from './components/WorldCanvas.vue';
import AppHeader from './components/AppHeader.vue';
import InfoCard from './components/InfoCard.vue';
import TourNav from './components/TourNav.vue';
import HoverTooltip from './components/HoverTooltip.vue';
</script>

<template>
  <v-app class="portfolio-app">
    <WorldCanvas />
    <AppHeader />
    <InfoCard />
    <TourNav />
    <HoverTooltip />
  </v-app>
</template>
