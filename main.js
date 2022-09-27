import { gsap } from "gsap/dist/gsap";
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import moonfragmentShader from './shaders/moonFragment.glsl'
import moonvertexShader from './shaders/moonVertex.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'


//scene,camera,renderer
const canvascontainer = document.querySelector('#canvascontainer')
const scene = new THREE.Scene()
const camera= new THREE.PerspectiveCamera(75, canvascontainer.offsetWidth / canvascontainer.offsetHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: document.querySelector('canvas')})
renderer.setSize(canvascontainer.offsetWidth, canvascontainer.offsetHeight)
renderer.setPixelRatio(devicePixelRatio)


//Create a group (which will later include our sphere and its texture meshed together)
const moongrp = new THREE.Group();
scene.add(moongrp);

const globe = new THREE.Group();
scene.add(globe);


//Earth creation
const earthgeo = new THREE.SphereGeometry( 5,50, 50);
const earthmat = new THREE.ShaderMaterial( { vertexShader ,fragmentShader,
      uniforms:
     {
      globeTexture: 
      {
            value: new THREE.TextureLoader().load('./img/globe1.png')
      }
} } )
const earth = new THREE.Mesh( earthgeo, earthmat )
globe.add( earth )


//moon creation
const moongeo = new THREE.SphereGeometry( 2,20, 20 );
const moonmat = new THREE.ShaderMaterial( {vertexShader: moonvertexShader,fragmentShader: moonfragmentShader,
      uniforms:
     {
      globeTexture: 
      {
            value: new THREE.TextureLoader().load('./img/moon.jpg')
      }
} } )
const moon = new THREE.Mesh( moongeo, moonmat )
moon.position.set(0, 0, 30)
moon.scale.set(1.1, 1.1, 1.1)
moongrp.add(moon)


//creation of atmosphere
const atmosgeo = new THREE.SphereGeometry( 5,60, 60 )
const atmosmat = new THREE.ShaderMaterial( { vertexShader: atmosphereVertexShader ,fragmentShader: atmosphereFragmentShader, blending: THREE.AdditiveBlending, side: THREE.BackSide } )
const atmosphere = new THREE.Mesh( atmosgeo, atmosmat )


//scale for increasinge intensity
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere);


//stars creation
const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({color: 0xffffff})
const stars = new THREE.Points(starGeometry,starMaterial)
scene.add(stars)


const pointgeo = new THREE.SphereGeometry(0.2,15,15)
const pointMat = new THREE.MeshBasicMaterial({color: 0xff0000})
const point = new THREE.Mesh(pointgeo,pointMat)
earth.add(point)
point.position.set(5,0,0)


//star multiplication
const starVertices= []
for(let i = 0; i<150000;i++){
      const x = (Math.random()-0.5)*4000
      const y = (Math.random()-0.5)*4000
      const z = (Math.random()-0.5)*2000
      starVertices.push(x,y,z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices,3))


//resize
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


//orbit controls
new OrbitControls(camera, renderer.domElement)
camera.position.x=75
const controls = new OrbitControls(camera, renderer.domElement)
const mouse ={
      x: undefined,
      y: undefined
}


//zoom animation
gsap.to( camera, {
      duration: 8,
      zoom: 5,
      onUpdate: function () {
            camera.updateProjectionMatrix();
      }
} );
gsap.to( controls.target, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      onUpdate: function () {
            controls.update()
      }
} );


//animation
function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
      globe.rotation.y+=0.004
      stars.rotation.y+=0.002
      moongrp.rotation.y+=0.004
      moon.rotation.y+=0.004
      gsap.to(earth.rotation, {x: mouse.x *1.0,duration: 4})
    }
animate()


//mouse eventlistener
addEventListener('mousemove',(event)=>{
    mouse.x = (event.clientX  / innerWidth)*2-1
    mouse.y = -(event.clientY / innerHeight)*2+1
    })


//live api
    $(document).ready(function(){
      init()

      var data1 = ""
      var data2 = ""
      
      function init(){
            var url = "https://api.covid19api.com/summary"

            $.get(url,function(data1){
                console.log(data1.Global)

                data1 = `
                
              <td>${data1.Global.TotalConfirmed}</td>
              <td>${data1.Global.TotalDeaths}</td>
              <td>${data1.Global.TotalRecovered}</td>

                `
                $("#data1").html(data1)
            })

            $.get(url,function(data2){
                  console.log(data2.Global)
  
                  data2 = `
                  
                <td>${data2.Global.NewConfirmed}</td>
                <td>${data2.Global.NewDeaths}</td>
                <td>${data2.Global.NewRecovered}</td>
  
                  `
                  $("#data2").html(data2)
            })

              $.get(url,function(date){
                  console.log(date.Global)
  
                  date = `
                  <p>Data Upto Date :${date.Global.Date}</p>
                  `
                  $("#date").html(date)
            })
      }

      $('button').click(function refresh(){
       
      cleardata()
      });


      function cleardata(){
        $("#data1").empty()
        $("#data2").empty() 
        $("#date").empty() 
        init()
      }
})
