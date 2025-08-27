import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";

/**
 * 地面オブジェクトを生成して返す
 * @returns {THREE.Mesh} ground
 */
export function createGroundObjects() {
  const groundSize = 24000;
  const segments = 150;

  const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize, segments, segments);

  // 頂点のZをランダムにして凹凸をつける
  //(デフォでXY平面なのでZをいじると凹凸になる)
  for(let i=0; i<groundGeo.attributes.position.count; i++){
    groundGeo.attributes.position.setZ(i, Math.random()*100 - 50);
  }
  groundGeo.computeVertexNormals();

  const groundMat = new THREE.MeshPhongMaterial({
    color: 0xA5Dfff,
    wireframe: true
  });

  const ground = new THREE.Mesh(groundGeo, groundMat);
  //x軸で回転させることで、壁から平面にする。
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -20;
  ground.receiveShadow = true;

  return ground;
}