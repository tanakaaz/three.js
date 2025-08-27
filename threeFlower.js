import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";
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
camera.position.set(0, 800, 2500);

// コントローラー
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 環境光
scene.add(new THREE.AmbientLight(0x404040, 3));

// ライト
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(500, 2000, 1000);
light.castShadow = true;
scene.add(light);

// 🌱 地面（ワイヤーフレーム＆高さランダム）
const groundSize = 12000; // Increase the size to make the ground wider
const segments = 40; // Increase the number of segments for more detail

const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize, segments, segments);

// 頂点のYをランダムにして凹凸をつける
for(let i=0; i<groundGeo.attributes.position.count; i++){
  groundGeo.attributes.position.setZ(i, Math.random()*200 - 10); // -50〜+50の高さ
}
groundGeo.computeVertexNormals();

const groundMat = new THREE.MeshPhongMaterial({
  color: 0x228B22,
  wireframe: true // ワイヤーフレーム表示
});

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
ground.position.y = -20;
ground.receiveShadow = true;
scene.add(ground);

// ======================
// 🌳 木
// ======================
// 幹
const trunkGeo = new THREE.CylinderGeometry(40, 60, 600, 11);
const trunkMat = new THREE.MeshPhongMaterial({ color: 0x8B4513, wireframe:true });
const trunk = new THREE.Mesh(trunkGeo, trunkMat);
trunk.position.set(0, 300, 0);
trunk.castShadow = true;
scene.add(trunk);

// 葉っぱの丸い部分（簡易的な木の形）
const leafGeo = new THREE.SphereGeometry(600, 11, 11);
const leafMat = new THREE.MeshPhongMaterial({ color: 0xFFB7C5, wireframe:true });
const leaves = new THREE.Mesh(leafGeo, leafMat);
leaves.position.set(0, 1200, 0);
leaves.castShadow = true;
leaves.receiveShadow = true;
scene.add(leaves);

// ======================
// 🌸 花びらシェーダー（疑似立体）
// ======================
const petalMaterialBase = new THREE.ShaderMaterial({
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  uniforms: {
    u_lightDir: { value: new THREE.Vector3(0.5,1,0.8).normalize() }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPos;
    void main(){
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPos;
    uniform vec3 u_lightDir;
    void main(){
      vec2 p = vUv - 0.5;
      float r = length(p*vec2(1.5,1.0));
      float petal = smoothstep(0.5,0.49,r);
      float notch = smoothstep(0.1,0.12,abs(p.x)-(0.25-p.y));
      float alpha = petal*(1.0-notch);
      if(alpha < 0.1) discard;
      vec3 normal = normalize(vec3(0.0,0.0,1.0)+vec3(p*0.5,0.0));
      float light = dot(normal, normalize(u_lightDir))*0.5+0.5;
      gl_FragColor = vec4(vec3(1.0,0.7,0.8)*light, alpha);
    }
  `
});

// ======================
// 花びら生成
// ======================
const petals = [];
for(let i=0;i<300;i++){
  const size = 50 + Math.random()*40; // 小さめサイズ
  const geo = new THREE.PlaneGeometry(size, size);
  const mat = petalMaterialBase.clone();
  const mesh = new THREE.Mesh(geo, mat);

  mesh.position.set(
    (Math.random()-0.5)*2500,
    Math.random()*1000 + 1000,
    (Math.random()-0.5)*2500
  );

  // ランダム挙動
  mesh.userData = {
    speed: 1.5 + Math.random()*2,
    swayX: 0.2 + Math.random()*0.8,
    swayZ: 0.2 + Math.random()*0.8,
    swayAmpX: 30 + Math.random()*50,
    swayAmpZ: 20 + Math.random()*30
  };

  mesh.userData.rotSpeed = {
    x: (Math.random()-0.5)*0.01,
    y: (Math.random()-0.5)*0.02,
    z: (Math.random()-0.5)*0.01
  };

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

    if(petal.position.y < 100){
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
