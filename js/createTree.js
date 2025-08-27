import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";

/**
 * 木オブジェクトを生成して返す
 * @param {number} x 配置x座標
 * @param {number} y 配置y座標
 * @param {number} z 配置z座標
 * @returns {THREE.Group} tree
 */
export function createTreeObjects(x, y, z) {
  const tree = new THREE.Group();

  // 幹
  const trunkGeo = new THREE.CylinderGeometry(40, 60, 600, 11);
  const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8B4513, wireframe:true });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(x, y + 300, z);
  trunk.castShadow = true;
  tree.add(trunk);

  // 葉っぱ
  const leafGeo = new THREE.SphereGeometry(600, 11, 11);
  const leafMat = new THREE.MeshPhongMaterial({ color: 0xFFB7C5, wireframe:true });
  const leaves = new THREE.Mesh(leafGeo, leafMat);
  leaves.position.set(x, y + 1200, z);
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  tree.add(leaves);

  return tree;
}