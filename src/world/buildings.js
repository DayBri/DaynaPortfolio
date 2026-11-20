import * as THREE from 'three';
import { mat, mesh, placeOnSurface } from './util.js';
import { loadModel } from './assets.js';

/** How far behind the path (local -z) buildings sit, as a fraction of the radius. */
const PLOT_OFFSET = -0.3;
const FACE_PATH = new THREE.Vector3(0, 0, 1);

/**
 * Creates one building per stop on the planet pivot.
 * Each building group carries userData.stopIndex for raycasting.
 */
export function createBuildings(pivot, R, stops, stopAngles) {
  const buildings = stops.map((stop, i) => {
    const g = new THREE.Group();
    g.userData.stopIndex = i;

    const body = new THREE.Group();
    const built = (BUILDERS[stop.buildingType] ?? BUILDERS.house)(stop.color);
    body.add(built);
    g.add(body);
    g.userData.body = body;
    g.userData.tick = built.userData.tick; // optional per-frame animation

    const dir = new THREE.Vector3(Math.sin(stopAngles[i]), Math.cos(stopAngles[i]), PLOT_OFFSET);
    placeOnSurface(g, dir, R - 0.05, FACE_PATH);
    pivot.add(g);

    if (stop.model) {
      loadModel(stop.model, 2.6).then((model) => {
        if (!model) return;
        body.clear();
        body.add(model);
        g.userData.tick = null;
      });
    }
    return g;
  });

  // Hover highlight helper
  let hovered = null;
  function setHovered(group) {
    if (hovered === group) return;
    if (hovered) setEmissive(hovered, 0);
    hovered = group;
    if (hovered) setEmissive(hovered, 0.25);
  }

  function update(dt) {
    for (const b of buildings) {
      const target = b === hovered ? 1.08 : 1;
      const s = THREE.MathUtils.damp(b.scale.x, target, 10, dt);
      b.scale.setScalar(s);
      b.userData.tick?.(dt);
    }
  }

  return { buildings, setHovered, update };
}

function setEmissive(group, amount) {
  group.traverse((o) => {
    if (o.isMesh && o.material?.emissive) {
      if (!o.userData.ownMat) {
        o.material = o.material.clone(); // don't tint shared materials elsewhere
        o.userData.ownMat = true;
      }
      o.material.emissive.setRGB(amount, amount, amount * 0.8);
    }
  });
}

// ───────────── Placeholder building builders ─────────────

const wall = '#f5efe3';
const glass = '#9ad1f5';

function roofPrism(w, d, h, color) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, h);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false });
  geo.translate(0, 0, -d / 2);
  return mesh(geo, mat(color));
}

function windows(group, w, h, y0, rows, cols, z) {
  const m = mat(glass, { emissive: '#3a6ea5', emissiveIntensity: 0.15 });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = mesh(new THREE.BoxGeometry(0.22, 0.26, 0.04), m, { cast: false });
      win.position.set(-w / 2 + ((c + 0.5) * w) / cols, y0 + r * h, z);
      group.add(win);
    }
  }
}

const BUILDERS = {
  cottage(color) {
    const g = new THREE.Group();
    const base = mesh(new THREE.BoxGeometry(1.6, 1, 1.3), mat(wall));
    base.position.y = 0.5;
    const roof = roofPrism(1.9, 1.5, 0.8, color);
    roof.position.y = 1;
    const door = mesh(new THREE.BoxGeometry(0.35, 0.55, 0.05), mat('#8b5a3c'));
    door.position.set(0, 0.28, 0.66);
    const chimney = mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), mat('#b5651d'));
    chimney.position.set(0.45, 1.45, 0);
    g.add(base, roof, door, chimney);
    windows(g, 1.6, 0, 0.55, 1, 2, 0.66);
    return g;
  },

  house(color) {
    const g = new THREE.Group();
    const base = mesh(new THREE.BoxGeometry(1.4, 1.8, 1.3), mat(wall));
    base.position.y = 0.9;
    const roof = roofPrism(1.7, 1.5, 0.7, color);
    roof.position.y = 1.8;
    const door = mesh(new THREE.BoxGeometry(0.35, 0.55, 0.05), mat(color));
    door.position.set(0, 0.28, 0.66);
    g.add(base, roof, door);
    windows(g, 1.4, 0.6, 0.95, 2, 2, 0.66);
    return g;
  },

  tower(color) {
    const g = new THREE.Group();
    const base = mesh(new THREE.CylinderGeometry(0.6, 0.7, 3, 8), mat(wall));
    base.position.y = 1.5;
    const ring = mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 8), mat(color));
    ring.position.y = 3.05;
    const roof = mesh(new THREE.ConeGeometry(0.8, 1.1, 8), mat(color));
    roof.position.y = 3.7;
    const flag = mesh(new THREE.BoxGeometry(0.4, 0.25, 0.02), mat('#ffd166'));
    flag.position.set(0.2, 4.45, 0);
    const pole = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4), mat('#555'));
    pole.position.y = 4.3;
    g.add(base, ring, roof, flag, pole);
    for (let i = 0; i < 3; i++) {
      const win = mesh(new THREE.BoxGeometry(0.22, 0.3, 0.05), mat(glass), { cast: false });
      win.position.set(0, 0.8 + i * 0.8, 0.66);
      g.add(win);
    }
    return g;
  },

  factory(color) {
    const g = new THREE.Group();
    const base = mesh(new THREE.BoxGeometry(2, 1.2, 1.4), mat(wall));
    base.position.y = 0.6;
    g.add(base);
    for (let i = 0; i < 3; i++) {
      const saw = roofPrism(0.66, 1.4, 0.45, color);
      saw.position.set(-0.66 + i * 0.66, 1.2, 0);
      g.add(saw);
    }
    const stack = mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.6, 8), mat('#b5651d'));
    stack.position.set(0.7, 2, -0.4);
    const door = mesh(new THREE.BoxGeometry(0.6, 0.7, 0.05), mat(color));
    door.position.set(-0.4, 0.35, 0.71);
    g.add(stack, door);
    windows(g, 0.8, 0, 0.7, 1, 2, 0.71);
    g.children.slice(-2).forEach((w) => (w.position.x += 0.5));
    return g;
  },

  dome(color) {
    const g = new THREE.Group();
    const base = mesh(new THREE.CylinderGeometry(1, 1.05, 0.6, 12), mat(wall));
    base.position.y = 0.3;
    const dome = mesh(
      new THREE.SphereGeometry(0.95, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(color, { metalness: 0.2, roughness: 0.5 }),
    );
    dome.position.y = 0.6;
    const scope = mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.9, 6), mat('#555'));
    scope.position.set(0.25, 1.5, 0);
    scope.rotation.z = -0.6;
    const door = mesh(new THREE.BoxGeometry(0.35, 0.45, 0.05), mat('#8b5a3c'));
    door.position.set(0, 0.23, 1.04);
    g.add(base, dome, scope, door);
    return g;
  },

  /** Half-built steel frame, a slowly turning tower crane, cones and a barrier. */
  construction(color) {
    const g = new THREE.Group();
    const steel = mat(color);
    const yellow = mat('#f2c14e');
    const concrete = mat('#b9b5ab');

    // Ground slab
    const slab = mesh(new THREE.BoxGeometry(2.3, 0.12, 1.7), concrete);
    slab.position.y = 0.06;
    g.add(slab);

    // Steel frame: 2×2 columns (one unfinished), beams, and a part-poured floor.
    const beam = (len, axis) => {
      const size = { x: [len, 0.08, 0.08], y: [0.09, len, 0.09], z: [0.08, 0.08, len] }[axis];
      return mesh(new THREE.BoxGeometry(...size), steel);
    };
    const cols = [
      [-0.95, -0.55, 1.7],
      [-0.15, -0.55, 1.7],
      [-0.95, 0.25, 1.7],
      [-0.15, 0.25, 1.05], // unfinished
    ];
    for (const [x, z, h] of cols) {
      const c = beam(h, 'y');
      c.position.set(x, 0.12 + h / 2, z);
      g.add(c);
    }
    for (const y of [0.95, 1.8]) {
      const back = beam(0.88, 'x');
      back.position.set(-0.55, y, -0.55);
      const left = beam(0.88, 'z');
      left.position.set(-0.95, y, -0.15);
      g.add(back, left);
    }
    const front = beam(0.88, 'x');
    front.position.set(-0.55, 0.95, 0.25);
    const right = beam(0.88, 'z');
    right.position.set(-0.15, 0.95, -0.15);
    const floor = mesh(new THREE.BoxGeometry(0.8, 0.06, 0.5), concrete);
    floor.position.set(-0.55, 0.92, -0.3);
    g.add(front, right, floor);

    // Tower crane: lattice mast (4 poles + rings) with a rotating jib.
    const crane = new THREE.Group();
    crane.position.set(0.7, 0.12, -0.45);
    g.add(crane);
    const mastH = 3.6;
    for (const [x, z] of [[-0.09, -0.09], [0.09, -0.09], [-0.09, 0.09], [0.09, 0.09]]) {
      const pole = mesh(new THREE.BoxGeometry(0.04, mastH, 0.04), yellow);
      pole.position.set(x, mastH / 2, z);
      crane.add(pole);
    }
    for (let y = 0.3; y < mastH; y += 0.35) {
      const ring = mesh(new THREE.BoxGeometry(0.22, 0.03, 0.22), yellow, { cast: false });
      ring.position.y = y;
      crane.add(ring);
    }

    const jib = new THREE.Group();
    jib.position.y = mastH;
    crane.add(jib);
    const arm = mesh(new THREE.BoxGeometry(2.4, 0.1, 0.12), yellow);
    arm.position.x = 0.4;
    const cab = mesh(new THREE.BoxGeometry(0.26, 0.24, 0.26), mat('#f5efe3'));
    cab.position.set(0.12, -0.12, 0.18);
    const counterweight = mesh(new THREE.BoxGeometry(0.3, 0.22, 0.26), concrete);
    counterweight.position.set(-0.65, -0.12, 0);
    const apex = mesh(new THREE.ConeGeometry(0.1, 0.45, 4), yellow);
    apex.position.y = 0.27;
    const cable = mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.2, 4), mat('#333'), { cast: false });
    cable.position.set(1.3, -0.6, 0);
    const load = mesh(new THREE.BoxGeometry(0.5, 0.08, 0.16), steel);
    load.position.set(1.3, -1.22, 0);
    jib.add(arm, cab, counterweight, apex, cable, load);

    // Safety: cones and a striped barrier along the front.
    const orange = mat('#ff7a1a');
    const white = mat('#ffffff');
    for (const x of [-0.9, 0.95]) {
      const cone = mesh(new THREE.ConeGeometry(0.09, 0.28, 8), orange);
      cone.position.set(x, 0.26, 0.7);
      const band = mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.05, 8), white, { cast: false });
      band.position.set(x, 0.28, 0.7);
      g.add(cone, band);
    }
    for (let i = 0; i < 6; i++) {
      const stripe = mesh(new THREE.BoxGeometry(0.18, 0.12, 0.03), i % 2 ? white : mat('#d62828'));
      stripe.position.set(-0.45 + i * 0.18, 0.42, 0.72);
      g.add(stripe);
    }
    for (const x of [-0.5, 0.5]) {
      const post = mesh(new THREE.BoxGeometry(0.04, 0.36, 0.04), mat('#555'));
      post.position.set(x, 0.3, 0.72);
      g.add(post);
    }

    // A small stack of beams waiting to be used.
    for (let i = 0; i < 3; i++) {
      const b = beam(0.7, 'x');
      b.position.set(0.55, 0.16 + Math.floor(i / 2) * 0.08, 0.3 + (i % 2) * 0.1 + (i === 2 ? 0.05 : 0));
      g.add(b);
    }

    g.userData.tick = (dt) => {
      jib.rotation.y += dt * 0.35;
    };
    return g;
  },
};
