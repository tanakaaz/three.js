import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js";

/**
 * 花びら用マテリアルを生成して返す
 * @param {THREE.Vector3} lightDir 光の方向ベクトル
 * @returns {THREE.ShaderMaterial}
 */
export function createPetalMaterial(lightDir) {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: {
      u_lightDir: { value: lightDir.clone().normalize() }
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
}

/**
 * 花びらメッシュを生成して返す
 * @param {THREE.Material} material 花びら用マテリアル
 * @returns {THREE.Mesh} 花びらメッシュ
 */
export function createPetalObject(material) {
  const size = 90;
  const geo = new THREE.PlaneGeometry(size, size);
  const mesh = new THREE.Mesh(geo, material.clone());

  mesh.position.set(
    (Math.random())*3000,
    Math.random()*1000 + 3000,
    (Math.random()-0.5)*3000
  );

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

  return mesh;
}