import {
  Component, OnInit, Inject, Injectable, Renderer2, ElementRef, AfterViewChecked, HostListener
} from '@angular/core';

import {DOCUMENT} from '@angular/platform-browser';

import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import OBJLoader from 'three-obj-loader';

const orbitControls = OrbitControls(THREE);

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})

export class SceneComponent implements AfterViewChecked {
  private renderer: any;
  private scene: any;
  private camera: any;
  private inited: boolean = false;

  constructor(private domRenderer: Renderer2, private el: ElementRef) {
    OBJLoader(THREE);
  }

  ngAfterViewChecked() {
    if (!this.inited) {
      this.inited = true;
      this.start();
    }
  }

  start() {
    this.loadScene(this.render.bind(this));
  }

  render() {
    requestAnimationFrame(this.render.bind(this));

    this.renderer.render(this.scene, this.camera);
  }

  loadScene(cb) {
    const _self = this;
    const width = this.getWidth();
    const height = this.getHeight();

    let renderer, camera, scene;
    const loader = new THREE.OBJLoader();

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.createCanvas()
    });
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setSize(width, height);

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.set(0, 181, 0);
    camera.lookAt(new THREE.Vector3());

    const controls = new orbitControls(camera);

    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    this.domRenderer.appendChild(this.el.nativeElement.firstChild, this.renderer.domElement);

    loader.load(
      'assets/k2-area.obj',
      function (object) {
        _self.addModel(object.children[0], cb);
      }
    );

    // Debug
    Object.assign(window, { scene, THREE });
  }

  addModel(object, cb) {
    const map = new THREE.TextureLoader().load('/assets/k2-area-color.png');
    const bumpMap = new THREE.TextureLoader().load('/assets/k2-area-map.png');

    object.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(255,255,255)"),
      emissive: new THREE.Color("rgb(0,0,0)"),
      specular: new THREE.Color("rgb(17,17,17)"),
      shininess: 50,
      map: map,
      bumpMap: bumpMap,
      bumpScale: 0.5,
      vertexColors: null
    });
    object.material.needsUpdate = true;

    this.scene.add(object);

    cb && cb();
  }

  createCanvas() {
    return document.createElement('canvas');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = this.getWidth();
    const height = this.getHeight();

    if(!this.renderer) {
      return;
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getWidth() {
    return this.el.nativeElement.firstChild.clientWidth;
  }

  getHeight() {
    return this.el.nativeElement.firstChild.clientHeight;
  }

}
