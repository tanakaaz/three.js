import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";

/**
 * 太陽関連のオブジェクトを生成して返す
 * @returns {Object} { pointLight, sunLight, sun }
 */
export function createSunObjects() {
  // スポットライト
  // new THREE.PointLight(色, 光の強さ, 距離, 光の減衰率)
  const pointLight = new THREE.PointLight(0xFFFFFF, 10, 100000, 0.05);
  pointLight.position.set(8000, 1000, 0);
  pointLight.castShadow = true;

  // 太陽の光（環境光）
  const sunLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
  sunLight.position.set(8000, 1000, 0);

  // 物理太陽（球体メッシュ）
  const sunGeo = new THREE.SphereGeometry(6000, 50, 50);
  const sunMat = new THREE.MeshPhongMaterial({ color: 0xFCCA00, wireframe:false });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(24000, 100, 0);

  return { pointLight, sunLight, sun };
}