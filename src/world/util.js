import * as THREE from 'three';

/** Small deterministic RNG so the world looks the same every load. */
export function seededRandom(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });
}

export function mesh(geometry, material, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Place an object on the planet surface at a local direction, standing upright.
 * If `forwardHint` is given, the object's local +Z is turned toward it (e.g. to face the path).
 */
export function placeOnSurface(obj, direction, radius, forwardHint = null) {
  const n = direction.clone().normalize();
  obj.position.copy(n).multiplyScalar(radius);
  if (!forwardHint) {
    obj.quaternion.setFromUnitVectors(UP, n);
    return;
  }
  const x = new THREE.Vector3().crossVectors(n, forwardHint).normalize();
  const z = new THREE.Vector3().crossVectors(x, n);
  obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, n, z));
}
