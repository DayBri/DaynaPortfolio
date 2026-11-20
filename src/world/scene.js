import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const PLANET_RADIUS = 7;

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200);
  const target = new THREE.Vector3(0, PLANET_RADIUS + 0.3, -0.8);
  camera.position.set(0, PLANET_RADIUS + 7.5, 13);

  // Gentle, constrained orbit for parallax only.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minAzimuthAngle = -0.45;
  controls.maxAzimuthAngle = 0.45;
  controls.minPolarAngle = 0.8;
  controls.maxPolarAngle = 1.25;
  controls.update();

  // Lighting: soft sky fill + warm sun with shadows.
  scene.add(new THREE.HemisphereLight(0xdfefff, 0x5a4a6a, 1.4));
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.4);
  sun.position.set(8, 18, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = PLANET_RADIUS + 4;
  Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 50 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);

  // View shift (0..1) so the world slides out from under the info card:
  // left on wide screens (card on the right), up on narrow screens (bottom sheet).
  let shift = 0;
  function applyView() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const wide = w > 720;
    camera.setViewOffset(w, h, wide ? shift * 190 : 0, wide ? 0 : shift * h * 0.22, w, h);
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // Widen the view on narrow (portrait) screens so the world fits.
    const portrait = w / h < 1;
    camera.fov = portrait ? 62 : 40;
    applyView();
  }
  window.addEventListener('resize', resize);
  resize();

  /** Ease the view toward shifted (cardOpen = true) or centred. */
  function updateShift(cardOpen, dt) {
    const next = THREE.MathUtils.damp(shift, cardOpen ? 1 : 0, 5, dt);
    if (Math.abs(next - shift) > 0.0005) {
      shift = next;
      applyView();
    }
  }

  function dispose() {
    window.removeEventListener('resize', resize);
    controls.dispose();
    renderer.dispose();
  }

  return { renderer, scene, camera, controls, updateShift, dispose };
}
