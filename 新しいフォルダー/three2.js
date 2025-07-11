import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";
import { OrbitControls } from "https://esm.sh/three@0.175.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three@0.175.0/examples/jsm/loaders/GLTFLoader.js";

// サイズを指定
const width = 960;
const height = 540;
let rot = 0;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
canvas: document.querySelector('#myCanvas')
});
renderer.setSize(width, height);

// シーンを作成
const scene = new THREE.Scene();

// 軸ヘルパーの表示
const axesHelper = new THREE.AxesHelper(1000); // 引数は軸の長さ
scene.add(axesHelper);
function makeTextSprite(message) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.fillText(message, 0, 50);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 2.5, 1); // サイズ調整
    return sprite;
}
const labelX = makeTextSprite("X");
labelX.position.set(20, 0, 0);
scene.add(labelX);
const labelY = makeTextSprite("Y");
labelY.position.set(0, 20, 0);
scene.add(labelY);
const labelZ = makeTextSprite("Z");
labelZ.position.set(0, 0, 20);
scene.add(labelZ);

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.set(0, 0, 1000);

// カメラコントローラーを作成
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true; // 慣性を有効にする
controls.dampingFactor = 0.05; // 慣性の強さを調
// // 画像を読み込む
// const geometry = new THREE.SphereGeometry(300,30,30);
// const material = new THREE.MeshBasicMaterial( {color: 0xFF0000,wireframe: true} );
// const sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );

// 平行光源
const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
directionalLight.position.set(1, 3, 1);
// // シーンに追加
// scene.add(directionalLight);
// // 平行光源
// const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF);
// directionalLight1.position.set(3, 3, 3);
// // シーンに追加
// scene.add(directionalLight1);
// 非同期処理で待機するのでasync function宣言とする// GLTF形式のモデルデータを読み込む
const loader = new GLTFLoader();
// GLTFファイルのパスを指定
const gltf = await loader.loadAsync('./models/gltf/glTF/ToyCar.gltf');
// 読み込み後に3D空間に追加
const model = gltf.scene;
scene.add(model);

model.scale.set(30, 30, 30); // モデルのサイズを調整
tick();

// 毎フレーム時に実行されるループイベントです
function tick() {
    controls.update(); // カメラコントローラーの更新
    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
}