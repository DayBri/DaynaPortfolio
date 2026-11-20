import * as THREE from 'three';
import { mat, mesh } from './util.js';
import { loadModel } from './assets.js';

/**
 * A low-poly person standing at the top of the planet. They never actually move;
 * the planet rotates under their feet while they play a walk cycle.
 * Facing: rotation.y = 0 faces the camera (+Z).
 */
export function createCharacter(R, modelFile) {
  const root = new THREE.Group();
  root.position.y = R + 0.08;

  const body = new THREE.Group(); // gets the walk bob
  root.add(body);

  const skin = mat('#f1c27d');
  const shirt = mat('#bb55be');
  const pants = mat('#151817');

  const torso = mesh(new THREE.CapsuleGeometry(0.22, 0.4, 4, 8), shirt);
  torso.position.y = 0.95;
  const head = mesh(new THREE.IcosahedronGeometry(0.22, 1), skin);
  head.position.y = 1.5;
  const hair = mesh(new THREE.SphereGeometry(0.23, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat('#41220d'));
  hair.position.y = 1.53;
  hair.rotation.x = -0.25;
  body.add(torso, head, hair);
  for (const x of [-0.08, 0.08]) {
    const eye = mesh(new THREE.SphereGeometry(0.03, 6, 4), mat('#1b1b1b'), { cast: false });
    eye.position.set(x, 1.52, 0.2);
    body.add(eye);
  }

  const limb = (geo, material, x, y) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    const m = mesh(geo, material);
    m.position.y = -geo.parameters.length / 2 - geo.parameters.radius;
    pivot.add(m);
    body.add(pivot);
    return pivot;
  };
  const legL = limb(new THREE.CapsuleGeometry(0.09, 0.4, 3, 6), pants, -0.11, 0.62);
  const legR = limb(new THREE.CapsuleGeometry(0.09, 0.4, 3, 6), pants, 0.11, 0.62);
  const armL = limb(new THREE.CapsuleGeometry(0.07, 0.38, 3, 6), shirt, -0.32, 1.2);
  const armR = limb(new THREE.CapsuleGeometry(0.07, 0.38, 3, 6), shirt, 0.32, 1.2);

  // Simple blob shadow helps "plant" the character visually.
  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false }),
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.01;
  root.add(blob);

  let walking = false;
  let phase = 0;
  let swing = 0;
  let targetYaw = 0;

  // Optional GLB replacement
  let mixer = null;
  let actions = {};
  if (modelFile) {
    loadModel(modelFile, 1.7).then((model) => {
      if (!model) return;
      body.visible = false;
      root.add(model);
      const clips = model.userData.animations ?? [];
      if (clips.length) {
        mixer = new THREE.AnimationMixer(model);
        const find = (re) => clips.find((c) => re.test(c.name));
        const walk = find(/walk|run/i);
        const idle = find(/idle|stand/i) ?? clips[0];
        if (walk) actions.walk = mixer.clipAction(walk);
        if (idle) actions.idle = mixer.clipAction(idle);
        actions.idle?.play();
      }
    });
  }

  function playClip(name) {
    if (!mixer) return;
    const next = actions[name];
    const prev = actions[name === 'walk' ? 'idle' : 'walk'];
    if (!next) return;
    next.reset().fadeIn(0.25).play();
    prev?.fadeOut(0.25);
  }

  return {
    object: root,
    /** dir: +1 walks toward +X, -1 toward -X, 0 stops */
    setWalking(dir) {
      const was = walking;
      walking = dir !== 0;
      if (walking) targetYaw = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      if (was !== walking) playClip(walking ? 'walk' : 'idle');
    },
    /** Turn to look at the building behind (-Z) or the camera (+Z). */
    face(where) {
      targetYaw = where === 'building' ? Math.PI : 0;
    },
    update(dt) {
      mixer?.update(dt);

      // Smoothly rotate toward target yaw (shortest way).
      let d = targetYaw - root.rotation.y;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      root.rotation.y += d * Math.min(1, dt * 8);

      swing = THREE.MathUtils.damp(swing, walking ? 1 : 0, 8, dt);
      phase += dt * 9 * swing;
      const s = Math.sin(phase) * 0.7 * swing;
      legL.rotation.x = s;
      legR.rotation.x = -s;
      armL.rotation.x = -s * 0.8;
      armR.rotation.x = s * 0.8;
      body.position.y = Math.abs(Math.cos(phase)) * 0.06 * swing;
    },
  };
}
