import { ref, computed, readonly } from 'vue';
import { ABOUT, PROJECTS } from '@/content.js';

/**
 * Shared tour state between the 3D world and the Vue UI.
 * Module-scoped refs = one instance for the whole app (small app, no Pinia needed).
 */
const stops = [ABOUT, ...PROJECTS];

const hashStop = Number.parseInt(window.location.hash.slice(1), 10);
const startAt = hashStop > 0 && hashStop < stops.length ? hashStop : 0;

const activeIndex = ref(startAt);
const cardOpen = ref(false);
const walking = ref(false);
const hasNavigated = ref(false);
const hover = ref(null); // { title, x, y } | null

let world = null; // engine API, registered by WorldCanvas

export function useTour() {
  const activeStop = computed(() => stops[activeIndex.value]);

  function attachWorld(api) {
    world = api;
  }

  // Called by the engine (departures only ever come from user input)
  function handleDepart(i) {
    hasNavigated.value = true;
    activeIndex.value = i;
    walking.value = true;
    cardOpen.value = false;
  }
  function handleArrive(i) {
    activeIndex.value = i;
    walking.value = false;
    cardOpen.value = true;
    history.replaceState(null, '', i === 0 ? location.pathname : `#${i}`);
  }

  return {
    stops,
    startAt,
    activeIndex: readonly(activeIndex),
    activeStop,
    cardOpen,
    walking: readonly(walking),
    hasNavigated: readonly(hasNavigated),
    hover,
    attachWorld,
    handleDepart,
    handleArrive,
    next: () => world?.next(),
    prev: () => world?.prev(),
    goTo: (i) => world?.goTo(i),
  };
}
