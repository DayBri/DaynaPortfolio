import * as THREE from 'three';
import { mat, mesh, seededRandom, placeOnSurface } from './util.js';

/**
 * Builds the floating world.
 *  - world   : bobs gently up and down (contains everything)
 *  - pivot   : the planet; rotates to bring each stop to the top
 * The walking path is the great circle in the pivot's local XY plane (z = 0).
 */
export function createPlanet(R, stopAngles) {
  const world = new THREE.Group();
  const pivot = new THREE.Group();
  world.add(pivot);

  const rand = seededRandom(42);

  // Ground
  const ground = mesh(new THREE.IcosahedronGeometry(R, 4), mat('#4c8d4e'), { cast: false });
  jitter(ground.geometry, 0.08, rand);
  pivot.add(ground);

  // Walking path ring
  const path = mesh(new THREE.TorusGeometry(R - 0.24, 0.32, 6, 96), mat('#beb69d'), { cast: false });
  pivot.add(path);

  // Path stones marking each stop
  for (const theta of stopAngles) {
    const pad = mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.12, 8), mat('#f6efd6'), { cast: false });
    placeOnSurface(pad, new THREE.Vector3(Math.sin(theta), Math.cos(theta), 0), R + 0.06);
    pivot.add(pad);
  }

  // Trees & rocks: keep clear of the path and of building plots.
  const plots = stopAngles.map((t) => new THREE.Vector3(Math.sin(t), Math.cos(t), -0.3).normalize());
  const dir = new THREE.Vector3();
  let placed = 0;
  for (let i = 0; i < 400 && placed < 70; i++) {
    dir.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
    const z = dir.z * R;
    if (z > -1.3 && z < 3.2) continue; // path band + area right in front of the camera
    if (plots.some((p) => p.distanceTo(dir) < 0.42)) continue;
    const obj = rand() < 0.8 ? makeTree(rand) : makeRock(rand);
    placeOnSurface(obj, dir, R - 0.05);
    obj.rotateY(rand() * Math.PI * 2);
    pivot.add(obj);
    placed++;
  }

  // Flowers sprinkled near the path for colour.
  const flowerColors = ['#66a3ff', '#ef476f', '#ffffff', '#c77dff'];
  for (let i = 0; i < 160; i++) {
    const theta = rand() * Math.PI * 2;
    const side = rand() < 0.5 ? -1 : 1;
    const zo = side * (0.55 + rand() * 0.9);
    dir.set(Math.sin(theta), Math.cos(theta), zo / R).normalize();
    if (plots.some((p) => p.distanceTo(dir) < 0.3)) continue;
    const f = mesh(new THREE.IcosahedronGeometry(0.07, 0), mat(flowerColors[i % 4]), { cast: false });
    placeOnSurface(f, dir, R + 0.04);
    pivot.add(f);
  }

  // Underside: a few hanging rock spikes so it reads as a floating island.
  const rockMat = mat('#756b60');
  for (let i = 0; i < 9; i++) {
    const h = 2 + rand() * 3;
    const cone = mesh(new THREE.ConeGeometry(0.9 + rand() * 0.8, h, 6), rockMat);
    const a = rand() * Math.PI * 2;
    const r = rand() * 2.8;
    cone.position.set(Math.cos(a) * r, -R - h / 2 + 1.2, Math.sin(a) * r);
    cone.rotation.x = Math.PI;
    world.add(cone);
  }

  // Clouds and little floating rocks drift around the world (not attached to the pivot).
  const drifters = new THREE.Group();
  world.add(drifters);
  for (let i = 0; i < 7; i++) {
    const cloud = makeCloud(rand);
    const a = (i / 7) * Math.PI * 2;
    const r = R + 3 + rand() * 3;
    cloud.position.set(Math.cos(a) * r, -1 + rand() * 6, Math.sin(a) * r);
    cloud.userData.bob = rand() * Math.PI * 2;
    drifters.add(cloud);
  }
  for (let i = 0; i < 5; i++) {
    const rock = makeFloatingRock(rand);
    const a = rand() * Math.PI * 2;
    const r = R + 2 + rand() * 4;
    rock.position.set(Math.cos(a) * r, -4 + rand() * 5, Math.sin(a) * r);
    rock.userData.bob = rand() * Math.PI * 2;
    drifters.add(rock);
  }

  function update(t, dt, reducedMotion) {
    if (reducedMotion) return;
    world.position.y = Math.sin(t * 0.6) * 0.15;
    drifters.rotation.y += dt * 0.03;
    for (const d of drifters.children) {
      d.position.y += Math.sin(t * 0.8 + d.userData.bob) * dt * 0.15;
    }
  }

  return { world, pivot, update };
}

function jitter(geometry, amount, rand) {
  // Displace shared vertices consistently so the surface stays closed.
  const pos = geometry.attributes.position;
  const cache = new Map();
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    if (!cache.has(key)) cache.set(key, 1 + (rand() - 0.5) * amount * 0.2);
    v.multiplyScalar(cache.get(key));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
}

const treeGreens = ['#3f9b5b', '#4caf6a', '#2f8551', '#5bbf75'];

function makeTree(rand) {
  const g = new THREE.Group();
  const h = 0.6 + rand() * 0.6;
  const trunk = mesh(new THREE.CylinderGeometry(0.08, 0.12, h, 5), mat('#8b5a3c'));
  trunk.position.y = h / 2;
  g.add(trunk);
  const leafMat = mat(treeGreens[Math.floor(rand() * treeGreens.length)]);
  if (rand() < 0.5) {
    const cone = mesh(new THREE.ConeGeometry(0.5, 1.3, 6), leafMat);
    cone.position.y = h + 0.5;
    g.add(cone);
  } else {
    const ball = mesh(new THREE.IcosahedronGeometry(0.55, 0), leafMat);
    ball.position.y = h + 0.35;
    g.add(ball);
  }
  g.scale.setScalar(0.8 + rand() * 0.5);
  return g;
}

function makeRock(rand) {
  const r = mesh(new THREE.DodecahedronGeometry(0.25 + rand() * 0.25, 0), mat('#a39b8b'));
  r.position.y = 0.1;
  const g = new THREE.Group();
  g.add(r);
  return g;
}

function makeCloud(rand) {
  const g = new THREE.Group();
  const m = mat('#ffffff', { roughness: 1, transparent: true, opacity: 0.92 });
  const puffs = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < puffs; i++) {
    const p = mesh(new THREE.IcosahedronGeometry(0.5 + rand() * 0.5, 0), m, { cast: false, receive: false });
    p.position.set(i * 0.7 - puffs * 0.35, rand() * 0.3, rand() * 0.4);
    p.scale.y = 0.7;
    g.add(p);
  }
  return g;
}

function makeFloatingRock(rand) {
  const g = new THREE.Group();
  const top = mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.15, 6), mat('#7cc47f'));
  const bottom = mesh(new THREE.ConeGeometry(0.6, 1.1, 6), mat('#8d7b68'));
  bottom.rotation.x = Math.PI;
  bottom.position.y = -0.62;
  g.add(top, bottom);
  g.scale.setScalar(0.5 + rand() * 0.7);
  return g;
}
