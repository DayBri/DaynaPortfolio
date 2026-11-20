import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const BASE = import.meta.env.BASE_URL + 'models/';

/**
 * Load a GLB from /public/models and scale it so its height ≈ targetHeight,
 * with its base sitting at y = 0. Resolves to null if it can't be loaded,
 * so callers can keep their placeholder.
 * Returns the scene root; animations are on root.userData.animations.
 */
export async function loadModel(filename, targetHeight) {
  try {
    const gltf = await loader.loadAsync(BASE + filename);
    const root = gltf.scene;
    root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > 0) root.scale.setScalar(targetHeight / size.y);
    box.setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= box.min.y;

    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.userData.animations = gltf.animations;
    return wrapper;
  } catch (err) {
    console.warn(`[assets] Could not load ${filename}, using placeholder.`, err);
    return null;
  }
}
