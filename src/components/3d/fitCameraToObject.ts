import * as THREE from 'three';

/**
 * Frames a PerspectiveCamera so that `object` (and all its descendants)
 * fully fit inside the viewport with a comfortable margin.
 *
 * @param camera   The Three.js PerspectiveCamera to reposition.
 * @param object   The scene object to frame.
 * @param padding  Fraction of extra space around the object. 0.15 = 15% margin.
 */
export function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  padding = 0.15
) {
  object.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(object);

  if (box.isEmpty()) return;

  const sphere = box.getBoundingSphere(new THREE.Sphere());
  if (!Number.isFinite(sphere.radius) || sphere.radius <= 0) return;

  const radius = sphere.radius * (1 + padding);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

  const distV = radius / Math.tan(vFov / 2);
  const distH = radius / Math.tan(hFov / 2);
  const distance = Math.max(distV, distH);

  camera.position.set(0, 0, distance);
  camera.lookAt(0, 0, 0);

  camera.near = Math.max(0.01, distance - radius * 3);
  camera.far = distance + radius * 8;
  camera.updateProjectionMatrix();
}