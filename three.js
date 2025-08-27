import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";
import { OrbitControls } from "https://esm.sh/three@0.175.0/examples/jsm/controls/OrbitControls.js";


// サイズを指定
const width = 960;
const height = 540;
let rot = 0;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
canvas: document.querySelector('#myCanvas')
});
// レンダラー：シャドウを有効にする
renderer.shadowMap.enabled = true;

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
// // カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height,1, 100000);
camera.position.set(0, 0, 1000);
// scene.fog = new THREE.Fog(0x000000, 50, 2000);霧再現
// const camera = new THREE.OrthographicCamera(-480, +480, 270, -270, 1, 1000);　奥行きのないカメラ
// camera.position.set(0, 0, 1000);　奥行きのないカメラ

// カメラコントローラーを作成
const controls = new OrbitControls(camera, document.body);
controls.enableDamping = true; // 慣性を有効にする
controls.dampingFactor = 0.05; // 慣性の強さを調整

// 床を作成
const meshFloor = new THREE.Mesh(
    new THREE.BoxGeometry(10000, 0.1, 10000),
    new THREE.MeshStandardMaterial({ color: 0x404040, roughness: 0.0 }),
);
// 床の位置を調整（Y座標を-10に）
meshFloor.receiveShadow = true; // 影を受け取る
scene.add(meshFloor);
    
// 球体を作成（ライトの影響を受ける材質に変更）
const geometry = new THREE.SphereGeometry(1000,100,100);
const material = new THREE.MeshStandardMaterial( {color: 0xF0f0f0} );
// ,wireframe:true
const sphere = new THREE.Mesh( geometry, material );
sphere.position.set(0,1000,0)
sphere.castShadow = true; // 影を落とす
scene.add( sphere );
// 球体を作成（ライトの影響を受ける材質に変更）
const geometryNose = new THREE.SphereGeometry(70,100,100);
const materialNose = new THREE.MeshStandardMaterial( {color: 0x000000} );
// ,wireframe:true
const sphereNose = new THREE.Mesh( geometryNose, materialNose );
sphereNose.position.set(707,1000,700)
sphereNose.castShadow = true; // 影を落とす
scene.add( sphereNose );
// 球体を作成（ライトの影響を受ける材質に変更）
const geometryLeftEye = new THREE.SphereGeometry(70,100,100);
const materialLeftEye = new THREE.MeshStandardMaterial( {color: 0x000000} );
// ,wireframe:true
const sphereLeftEye = new THREE.Mesh( geometryLeftEye, materialLeftEye );
sphereLeftEye.position.set(800,1500,400)
sphereLeftEye.castShadow = true; // 影を落とす
scene.add( sphereLeftEye );
// 球体を作成（ライトの影響を受ける材質に変更）
const geometryRightEye = new THREE.SphereGeometry(70,100,100);
const materialRightEye = new THREE.MeshStandardMaterial( {color: 0x000000} );
// ,wireframe:true
const sphereRightEye = new THREE.Mesh( geometryRightEye, materialRightEye );
sphereRightEye.position.set(400,1500,800)
sphereRightEye.castShadow = true; // 影を落とす
scene.add( sphereRightEye );

// 環境光を追加（全体を少し明るくする）
const ambientLight = new THREE.AmbientLight(0x404040,10); // 薄いグレーの環境光（強度を下げる）
scene.add(ambientLight);

const light = new THREE.RectAreaLight(0xFFFFFF, 300, 1000, 1000);
light.position.set(3000, 3000, 3000); // 斜めから照らす
light.rotation.x = -Math.PI / 2; // ライトの向きを調整
scene.add(light);
// canvas 要素の参照を取得する
const canvas = document.querySelector('#myCanvas');
// マウス座標管理用のベクトルを作成
const mouse = new THREE.Vector2();
// マウスイベントを登録
canvas.addEventListener('mousemove', handleMouseMove);

// マウスを動かしたときのイベント
function handleMouseMove(event) {
  const element = event.currentTarget;
  // canvas要素上のXY座標
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  // canvas要素の幅・高さ
  const w = element.offsetWidth;
  const h = element.offsetHeight;

  // -1〜+1の範囲で現在のマウス座標を登録する
  mouse.x = ( x / w ) * 2 - 1;
  mouse.y = -( y / h ) * 2 + 1;
}
// レイキャストを作成
const raycaster = new THREE.Raycaster();
tick();

// 毎フレーム時に実行されるループイベントです
function tick() {

        // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
        // raycaster.setFromCamera(mous e, camera);

        // その光線とぶつかったオブジェクトを得る
        // const intersects = raycaster.intersectObjects(scene.children);

        // scene.children.map((mesh) => {
        //   // 交差しているオブジェクトが1つ以上存在し、
        //   // 交差しているオブジェクトの1番目(最前面)のものだったら
        //   if (intersects.length > 0 && mesh === intersects[0].object) {
        //     // 色を赤くする
        //     mesh.material.color.setHex(0xa0a0a0);
        //   } else if (mesh instanceof THREE.Mesh){
        //     // それ以外は元の色にする
        //     mesh.material.color.setHex(0x404040);
        //   }
        // });
    controls.update(); // カメラコントローラーの更新
    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
}

// 初期化のために実行
onResize();
// リサイズイベント発生時に実行
window.addEventListener('resize', onResize);

function onResize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}