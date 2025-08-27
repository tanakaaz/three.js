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
const target = camera.position.clone().add(dir);
camera.lookAt(target);

// コントローラー
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 注視点を「X軸方向」に設定する
// controls.target.copy(target);
// controls.update();


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

for(let i = 0; i < 10; i++){
  const t = createTreeObjects(Math.random() * 16000 - 8000, 0, Math.random() * 16000 - 8000);
  scene.add(t);
}


// ======================
// 🌸 花びらシェーダー（疑似立体）
// ======================
const petalMaterialBase = createPetalMaterial(sunLight.position);

const petals = [];
// for(let i=0;i<300;i++){
//   const mesh = createPetalObject(petalMaterialBase);
//   petals.push(mesh);
//   scene.add(mesh);
// }

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

// タイピングゲーム用
const typingDiv = document.getElementById('typing');
const words = ['sakura', 'hanabira', 'taiyo', 'midori', 'ki', 'haru', 'yuki', 'sora'];
let currentWord = '';
let inputBuffer = '';

function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  inputBuffer = '';
  typingDiv.textContent = currentWord;
}
setNewWord();
// 効果音ファイルのパス（プロジェクトに追加してください）
const correctSound = new Audio('./sounds/correct.mp3'); // 正解時
const wrongSound = new Audio('./sounds/wrong.mp3');     // 間違い時

window.addEventListener('keydown', (e) => {
  if (e.key.length === 1) {
    // 入力前の一致部分
    const prevMatch = currentWord.startsWith(inputBuffer + e.key);

    inputBuffer += e.key;
    // 入力が一致している部分だけ表示
    typingDiv.innerHTML = `<span style="color:#e91e63">${inputBuffer}</span>${currentWord.slice(inputBuffer.length)}`;

    // 間違えた瞬間に音
    if (!currentWord.startsWith(inputBuffer)) {
      wrongSound.currentTime = 0;
      wrongSound.play();
    } else if (inputBuffer === currentWord) {
      // 正解した瞬間に音
      correctSound.currentTime = 0;
      correctSound.play();

      setNewWord();
      // 花びらを追加する演出
      for(let i=0;i<20;i++){
        const mesh = createPetalObject(petalMaterialBase);
        petals.push(mesh);
        scene.add(mesh);
      }
      // for(let i=0;i<20;i++){
      //   const t = createTreeObjects(Math.random() * 16000 - 8000, 0, Math.random() * 16000 - 8000);
      //   scene.add(t);
      // }
    }
  }
  // バックスペース対応
  if (e.key === 'Backspace') {
    inputBuffer = inputBuffer.slice(0, -1);
    typingDiv.innerHTML = `<span style="color:#e91e63">${inputBuffer}</span>${currentWord.slice(inputBuffer.length)}`;
  }
});