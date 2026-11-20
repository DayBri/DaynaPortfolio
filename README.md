# Floating World Portfolio

A portfolio built with Vue 3, Vuetify 3 and three.js. A character walks around a small floating planet, and each building is a project.

## Run
```
npm install
npm run dev       # local dev server
npm run build     # static site in dist/ (deploy to GitHub Pages, Netlify, Vercel…)
```

## Make it yours
- **Content:** edit `src/content.js` for your name, tagline, socials, the about card and the projects.
- **Icons:** socials use `@mdi/js` SVG icons. Import the ones you want at the top of `content.js`.
- **Theme:** colours are in `src/plugins/vuetify.js`.
- **Models:** see `public/models/README.md` to swap placeholders for your own GLBs.
- **Deep links:** `/#2` opens directly at project 2.

## Architecture
The 3D world is plain three.js with no Vue inside it. Vue drives it through a small API and receives callbacks; the two sides share state through one composable.

| File | Purpose |
|---|---|
| `src/App.vue` | Composes the page |
| `src/composables/useTour.js` | Shared state (active stop, card open, hover) + nav actions |
| `src/components/WorldCanvas.vue` | Mounts/disposes the three.js engine |
| `src/components/AppHeader.vue`, `SocialLinks.vue` | Name, tagline, social buttons |
| `src/components/InfoCard.vue` | Project / about card (side panel on desktop, bottom sheet on mobile) |
| `src/components/TourNav.vue` | Prev/next, progress dots, keyboard shortcuts |
| `src/components/HoverTooltip.vue` | Building name under the cursor |
| `src/world/engine.js` | Builds the world, handles picking, runs the render loop |
| `src/world/tour.js` | Stop-to-stop travel: rotates the planet, triggers walk/arrive |
| `src/world/scene.js` | Renderer, camera, lights, constrained orbit, view shift for the card |
| `src/world/planet.js`, `buildings.js`, `character.js` | The low-poly world, buildings and person |
| `src/world/assets.js` | GLB loader with placeholder fallback |
