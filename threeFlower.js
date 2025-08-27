import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";
import { createSunObjects } from './js/createSun.js';
import { createPetalMaterial, createPetalObject } from './js/createPetal.js';
import { createGroundObjects } from './js/createGround.js';
import { createTreeObjects } from './js/createTree.js';
import { OrbitControls } from "https://esm.sh/three@0.175.0/examples/jsm/controls/OrbitControls.js";

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#myCanvas')
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

// シーン
const scene = new THREE.Scene();
// カメラ
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100000);
camera.position.set(0, 300, 0);
// (1, 0, 0) 方向（X軸正方向）を向かせる
const dir = new THREE.Vector3(1, 0, 0).normalize();
camera.lookAt(camera.position.clone().add(dir));
// コントローラー
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 注視点を「X軸方向」に設定する
controls.target.copy(camera.position.clone().add(dir));
controls.update();


// ライト生成
const { pointLight, sunLight, sun } = createSunObjects();
scene.add(pointLight);
scene.add(sunLight);
scene.add(sun);
// 🌱 地面（ワイヤーフレーム＆高さランダム）
const ground = createGroundObjects();
scene.add(ground);
// クリッピング平面（y = -20より下を切る）
const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 70); // y + 20 > 0 の部分だけ表示

renderer.clippingPlanes = [clipPlane];
// ======================
// 🌳 木
// ======================
const tree1 = createTreeObjects(3000, 0, -2000);
scene.add(tree1);

const tree2 = createTreeObjects(3000, 0, 2000);
scene.add(tree2);


// ======================
// 🌸 花びらシェーダー（疑似立体）
// ======================
const petalMaterialBase = createPetalMaterial(sunLight.position);

const petals = [];
for(let i=0;i<300;i++){
  const mesh = createPetalObject(petalMaterialBase);
  petals.push(mesh);
  scene.add(mesh);
}

// ======================
// アニメーション
// ======================
function tick(){
  petals.forEach(petal=>{
    petal.position.y -= petal.userData.speed;

    const t = performance.now()/1000;
    petal.position.x += Math.sin(t*petal.userData.swayX + petal.position.y*0.01)*0.5;
    petal.position.z += Math.cos(t*petal.userData.swayZ + petal.position.y*0.01)*0.5;

    petal.rotation.x += petal.userData.rotSpeed.x;
    petal.rotation.y += petal.userData.rotSpeed.y;
    petal.rotation.z += petal.userData.rotSpeed.z;

    if(petal.position.y < 0){
      petal.position.y = 1500;
    }
  });

  controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}
tick();

// ======================
// リサイズ
// ======================
window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});
