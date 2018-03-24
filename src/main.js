import * as three from 'three'
import SimplexNoise from 'simplex-noise'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

const simplex = new SimplexNoise()

const vw = window.innerWidth
const vh = window.innerHeight

const scene = new three.Scene()
const camera = new three.Camera()
camera.position.z = 1

const uniforms = {
    time: {
        type: "f",
        value: 1.0
    },
    resolution: {
        type: "v2",
        value: new three.Vector2(vw, vh)
    },
    center: {
        type: "v2",
        value: new three.Vector2()
    }
}

const material = new three.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true
})

const mesh = new three.Mesh( new three.PlaneGeometry(2, 2), material)
scene.add(mesh)

const renderer = new three.WebGLRenderer({alpha: true});
renderer.setSize(vw, vh)
document.body.appendChild(renderer.domElement)

function draw() {
    requestAnimationFrame(draw)

    const time = performance.now()
    const x = ((Math.sin(time * 0.00055) * 0.4) + 0.5) * vw
    const y =  ((simplex.noise2D(time * 0.0001, 1000) * 0.4) + 0.5) * vh
    const radius = 100 + (simplex.noise2D(time * 0.001, 0) * 5)

    uniforms.time.value = performance.now()
    uniforms.center.value.x = x
    uniforms.center.value.y = y

    renderer.render(scene, camera)
}

requestAnimationFrame(draw)