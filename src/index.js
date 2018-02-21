var THREE = require('three');
var createApp = require('canvas-testbed');
var OrbitControls = require('three-orbit-controls')(THREE);
var OBJLoader = require('three-obj-loader')(THREE);

var renderer,
  scene,
  camera,
  controls;

function start(gl, width, height) {
  var loader = new THREE.OBJLoader();
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  renderer = new THREE.WebGLRenderer({
    canvas: gl.canvas
  });
  renderer.setClearColor(0xffffff, 1.0);

  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x000000, 1));
  scene.add(directionalLight);

  directionalLight.position.set(0, 100, 0);

  camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
  camera.position.set(0, 181, 0);
  camera.lookAt(new THREE.Vector3());

  controls = new OrbitControls(camera);

  loader.load(
    'assets/k2.obj',
    function (object) {
      addModel(object.children[0]);
    }
  );

  // Debug
  window.scene = scene;
  window.THREE = THREE;
}

function render(gl, width, height) {
  renderer.render(scene, camera)
}

function resize(width, height) {
  if (!renderer)
    return;

  renderer.setViewport(0, 0, width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix()
}

function addModel(object) {
  var map = new THREE.TextureLoader().load('/assets/k2-color.png');
  var bumpMap = new THREE.TextureLoader().load('/assets/k2-img-mastered.png');

  object.material = new THREE.MeshPhongMaterial({
    color      :  new THREE.Color("rgb(255,255,255)"),
    emissive   :  new THREE.Color("rgb(0,0,0)"),
    specular   :  new THREE.Color("rgb(17,17,17)"),
    shininess  :  50,
    map: map,
    bumpMap: bumpMap,
    bumpScale: 1,
    vertexColors: null
  });
  object.material.needsUpdate = true;

  scene.add(object);
}

document.addEventListener('DOMContentLoaded', function () {
  createApp(render, start, {
    context: 'webgl',
    onResize: resize
  });
});
