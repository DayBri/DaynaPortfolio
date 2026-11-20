import * as THREE from 'three';
import { createScene, PLANET_RADIUS as R } from './scene.js';
import { createPlanet } from './planet.js';
import { createBuildings } from './buildings.js';
import { createCharacter } from './character.js';
import { createTour } from './tour.js';

/**
 * Framework-agnostic three.js world. The Vue layer drives it through the
 * returned API and listens via the callbacks.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {object} opts
 * @param {Array<{title:string, buildingType?:string, color?:string, model?:string}>} opts.stops
 * @param {string|null} [opts.characterModel]
 * @param {boolean} [opts.reducedMotion]
 * @param {number} [opts.startAt]
 * @param {(i:number) => void} [opts.onDepart]
 * @param {(i:number) => void} [opts.onArrive]
 * @param {(hover: {title:string, x:number, y:number} | null) => void} [opts.onHover]
 */
export function createWorld(canvas, opts) {
  const { stops, characterModel = null, reducedMotion = false, startAt = 0 } = opts;
  const stopAngles = stops.map((_, i) => (i / stops.length) * Math.PI * 2);

  const view = createScene(canvas);
  const { renderer, scene, camera, controls } = view;

  const planet = createPlanet(R, stopAngles);
  scene.add(planet.world);
  const buildings = createBuildings(planet.pivot, R, stops, stopAngles);
  const character = createCharacter(R, characterModel);
  planet.world.add(character.object);

  const tour = createTour({
    pivot: planet.pivot,
    stopAngles,
    character,
    reducedMotion,
    onDepart: opts.onDepart,
    onArrive: opts.onArrive,
  });
  tour.jumpTo(startAt);

  let cardOpen = false;

  // ── Picking (hover + click on buildings, ignoring orbit drags) ──
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downAt = null;

  function pick(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    // Intersect the whole pivot so trees/ground occlude buildings behind them.
    let o = raycaster.intersectObject(planet.pivot, true)[0]?.object;
    while (o && o.userData.stopIndex === undefined) o = o.parent;
    return o ?? null;
  }

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const b = pick(e);
    buildings.setHovered(b);
    canvas.style.cursor = b ? 'pointer' : '';
    opts.onHover?.(b ? { title: stops[b.userData.stopIndex].title, x: e.clientX, y: e.clientY } : null);
  };
  const onLeave = () => {
    buildings.setHovered(null);
    opts.onHover?.(null);
  };
  const onDown = (e) => (downAt = { x: e.clientX, y: e.clientY });
  const onUp = (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;
    const b = pick(e);
    if (b) tour.goTo(b.userData.stopIndex);
  };

  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);

  // ── Loop ──
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    tour.update(dt);
    character.update(dt);
    buildings.update(dt);
    planet.update(clock.elapsedTime, dt, reducedMotion);
    view.updateShift(cardOpen, dt);
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    goTo: tour.goTo,
    next: tour.next,
    prev: tour.prev,
    setCardOpen(open) {
      cardOpen = open;
    },
    dispose() {
      renderer.setAnimationLoop(null);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      view.dispose();
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          [].concat(o.material).forEach((m) => m.dispose());
        }
      });
    },
  };
}
