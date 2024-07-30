import * as THREE from '../modules/three.module.js';

// import gsap from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";

import { GLTFLoader } from '../modules/GLTFLoader.js';
import { EffectComposer } from '../modules/EffectComposer.js';
import { RenderPass } from '../modules/RenderPass.js';
import {VignetteShader} from '../modules/VignetteShader.js';
import { ShaderPass } from '../modules/ShaderPass.js';
import {UnrealBloomPass} from '../modules/UnrealBloomPass.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import * as dat from '../modules/dat.gui.min.js';
window.addEventListener('load',geonLoad);

let canvas , camera , renderer ,scene ;
let gui = new dat.GUI();
canvas = document.querySelector('canvas.webgl');

camera = new THREE.PerspectiveCamera(65,window.innerWidth/window.innerHeight,0.1,200);
camera.position.z=5;


scene = new THREE.Scene();

renderer= new THREE.WebGLRenderer({antialias:true,canvas:canvas});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
// renderer.setClearColor(0xaf0000);

scene.add(camera);


    let cubeGeo = new THREE.BoxGeometry(5,5,5,10,10,10);
    let cubeMat = new THREE.MeshPhysicalMaterial({transparent:true,opacity:.5});
    let cube = new THREE.Mesh(cubeGeo,cubeMat);
    // scene.add(cube);
    cube.position.set(0,0,-5);
//lights 
    let dLight = new THREE.DirectionalLight(0xfdabff,1,10);
    let dLight1 = new THREE.DirectionalLight(0xffffff,1,5);
    let dLight2 = new THREE.DirectionalLight(0xababff,.3,10);
    let pLight = new THREE.PointLight(0xffffff,2,25);
    let aLight= new THREE.AmbientLight(0xffffff,.2);
    // scene.add(aLight)
    pLight.castShadow=true;
    gui.add(pLight.position,'x',-3,3).name('pLight p x');
    gui.add(pLight.position,'y',-3,3).name('pLight p y');
    gui.add(pLight.position,'z',-3,8).name('pLight p z');
    pLight.position.set(0,5,2);
    scene.add(pLight);
    dLight.position.set(2.2,.2,3);
    dLight2.position.set(-5.2,2.2,3);
    dLight1.position.set(-5,.8,2);
    // dLight.castShadow=true;
    // dLight1.castShadow=true;
    // dLight1.position.set(-2,8,3);
    // dLight1.position= dLight.position;
    // dLight1.position.x=-2;
    scene.add(dLight);
    scene.add(dLight1);
    scene.add(dLight2);
    let geon,mixer,act;
let gLoader= new GLTFLoader();
function geonLoad(){


gLoader.load('./assets/3d/bigredv4.glb',function(gltf){
    scene.add(gltf.scene);
    geon = gltf.scene;
    console.log(geon);
    geon.children.forEach((child)=>{
        // child.receiveShadow = true;
        child.castShadow = true;
        // child.material = new THREE.MeshNormalMaterial();
    })
    // mixer=new THREE.AnimationMixer(geon);
    // const clips=gltf.animations;
    geon.children[0].material.color.r = geon.children[0].material.color.g =geon.children[0].material.color.b =0;
    geon.children[0].material.emissive.r = geon.children[0].material.emissive.g =geon.children[0].material.emissive.b =0;
    geon.children[1].material.color.r = 1;
    geon.children[1].material.color.g = 0;
    geon.children[1].material.color.b = 0;
    geon.children[4].material.color.r = 1;
    geon.children[4].material.color.g = 1;
    geon.children[4].material.color.b = 1;
    geon.children[9].material.color.r = 0;
    geon.children[9].material.color.g = 0;
    geon.children[9].material.color.b = 0;
    geon.children[8].material.color.r = 0;
    geon.children[8].material.color.g = 0;
    geon.children[8].material.color.b = 0;
    // geon.children[1].material.emissive = "0x000000";
    geon.position.set(0,0,-3);
    geon.rotation.x=Math.PI*2.5;
    geon.scale.set(.0,.0,.0);
    
        gsap.to(geon.scale,{
            x:0.5,
            y:0.5,
            z:0.5,
            duration:.3,
            ease:'power1'
        })
    // gui.add(geon.scale,'x',100,150).name('geon s x');
    // gui.add(geon.scale,'y',100,150).name('geon s y');
    // gui.add(geon.scale,'z',10,50).name('geon s z');
    gui.add(geon.position,'x',-10,30).name('geon p x');
    gui.add(geon.position,'y',-20,30).name('geon p y');
    gui.add(geon.rotation,'z',-10,10).name('geon r z');
    

});
}
let circleGeom = new THREE.CircleGeometry(1,50);
let circleMat = new THREE.MeshPhysicalMaterial({map:new THREE.TextureLoader().load('./assets/Big Red Logo v01.00.png'),side:THREE.DoubleSide,color:0xff0000,metalness:1.5,roughness:.7,reflectivity:10})
let circle = new THREE.Mesh(circleGeom,circleMat);
circle.castShadow=true;
// scene.add(circle);
console.log(circle);

let shadowPlaneGeo = new THREE.CircleGeometry(15,50);
let shadowPlaneMat = new THREE.MeshPhongMaterial({color:0xff0000,side:THREE.DoubleSide});
let shadowPlane = new THREE.Mesh(shadowPlaneGeo,shadowPlaneMat);
shadowPlane.rotation.x=1.6;
// shadowPlane.rotation.x=Math.PI/2;
shadowPlane.position.y=-1.8;

scene.add(shadowPlane);
shadowPlane.receiveShadow=true;
gui.add(shadowPlane.rotation,'x',-1,2).name('sPlane r x');
gui.add(shadowPlane.position,'y',-2,2).name('sPlane p y');

// cylinder
let cylGeo = new THREE.CylinderGeometry(30,30,10,100,100,false);
let cylMat = new THREE.MeshBasicMaterial({color:0xcf0000,side:THREE.DoubleSide,reflectivity:10,metalness:.6,roughness:1});
let cyl = new THREE.Mesh(cylGeo,cylMat);
scene.add(cyl);
console.log(cyl)
gui.add(cyl.geometry.parameters,'height',0,10).name('cyl h');
let mouseX= 0;
let mouseY=0;

let targetX=0;
let targetY=0;
let mX=circle.rotation.y;
const windowX= window.innerWidth/ 2;
const windowY= window.innerHeight/2;
function onDocumentMouseMove(event){
    mouseX= (event.clientX - windowX);
    mouseY = (event.clientY-windowY);
    // mouseY = ( event.clientY / windowY ) * -.5;
    // circle.rotation.y= (mouseX*0.0002)+mX;
    // geon.children.forEach((child)=>{
    //     // child.rotation.x=(mouseX*0.0002);
    //     child.rotation.z=-(mouseX*0.0001);
    //     // child.rotation.z=(mouseX*0.0001);
    // })
    geon.rotation.z=-(mouseX*0.0001);
    geon.rotation.y=-(mouseY*0.0002);
    // geon.rotation.x=geon.rotation.x-(mouseY*0.01);
    // geon.children[0].rotation.x=(mouseX*0.0002);
    // dLight1.position.x= (mouseX*0.001);
    console.log(mouseY);
  
  }
  gui.add(camera.position,'x',-3,3).name('camera p x');
  gui.add(camera.position,'y',-3,3).name('camera p y');
  gui.add(camera.position,'z',-3,5).name('camera p z');
  gui.add(camera.rotation,'x',-3,3).name('camera r x');
  gui.add(camera.rotation,'y',-3,3).name('camera r y');
  gui.add(camera.rotation,'z',-3,5).name('camera r z');


  gui.add(circle.rotation,'y',-Math.PI,Math.Pi);
  window.addEventListener('mousemove',onDocumentMouseMove);

    const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene,camera);
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight),.5,.6,.28);

console.log(bloom);
composer.addPass(renderPass);
const vignette = new ShaderPass( VignetteShader );
composer.addPass( vignette );
composer.addPass(bloom);
vignette.uniforms.darkness.value=3.5;
vignette.uniforms.offset.value=0.75;
const clock = new THREE.Clock();

const cre = document.querySelector('.cre').addEventListener('click',function(){
    mX=.5
    let anim = gsap.timeline();
    anim.to(camera.position,{
        x:3,
        z:3.2,
        duration:.5,
        ease:'none'
    })
    .to(circle.rotation,{
        y:mX+(-mouseX*0.0002)

    },'simultaneously')
  
    // .to(pLight.position,{
    //     x:0.5,
    //     y:1.2,
    //     z:1,
    // },'simultaneously')
});
const wor = document.querySelector('.wor').addEventListener('click',function(){
    let anim = gsap.timeline();
    anim.to(camera.position,{
        x:0,
        z:2.2,
        duration:.5,
        ease:'none'
    })
});
const u = document.querySelector('.u').addEventListener('click',function(){
    mX= -.5;
    let anim = gsap.timeline();
    anim.to(camera.position,{
        x:-.8,
        z:3.2,
        duration:.5,
        ease:'none'
    },'simultaneously')
    anim.to(camera.rotation,{
        y:.5,
        duration:.5,
        ease:'none'
    },'simultaneously')
    .to(circle.rotation,{
        y:mX+(-mouseX*0.0002)

    },'simultaneously')
    // .to(pLight.position,{
    //     x:-2.8,
    //     y:.5,
    //     z:2.6,

    // },'simultaneously')
});
const cl =document.querySelectorAll('.close');

cl.forEach(c=>{
    c.addEventListener('click',function(){
        mX=0;
        gsap.to(camera.position,{
            x:0,
            y:0,
            z:5,
            duration:.5,
            ease:'none'
        })
        gsap.to(circle.rotation,{
            y:mX+(-mouseX*0.0002)
        })
        gsap.to(camera.rotation,{
            x:0,
            y:0,
            z:0,
            duration:.5,
            ease:'none',
            // onComplete:function(){
            //     gsap.to(pLight.position,{
            //         x:0,
            //         y:2,
            //         z:3,
            //     })
            // }
        })
    })
 
   
})
window.addEventListener('resize', () =>{
    //update sizes
    
  
  
    //Update camera
    camera.aspect= window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  
    //Update renderer/ composer
    composer.setSize(window.innerWidth,window.innerHeight);
    renderer.setSize(window.innerWidth.window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    
});
function render(){
    composer.render();
    // renderer.render(scene,camera);
    // mixer.update(clock.getDelta());
  camera.updateProjectionMatrix();
  cyl.geometry.needsUpdate=true;
//   act.play();
    // cube.rotation.y+=0.05;
    requestAnimationFrame(render);
}

render();
