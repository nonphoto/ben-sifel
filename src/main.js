import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

const vw = window.innerWidth
const vh = window.innerHeight

const scene = new THREE.Scene()
const camera = new THREE.Camera()
camera.position.z = 1

const uniforms = {
    time: {
        type: "f",
        value: 1.0
    },
    resolution: {
        type: "v2",
        value: new THREE.Vector2(vw, vh)
    }
}

const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
})

const mesh = new THREE.Mesh( new THREE.PlaneGeometry(2, 2), material)
scene.add(mesh)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(vw, vh)
document.body.appendChild(renderer.domElement)

function draw() {
    requestAnimationFrame(draw)

    const time = performance.now()
    const x = ((Math.sin(time * 0.00055) * 0.4) + 0.5) * vw
    const y =  ((noise.simplex2(time * 0.0001, 1000) * 0.4) + 0.5) * vh
    const radius = 100 + (noise.perlin2(time * 0.001, 0) * 5)

    uniforms.time.value = performance.now()
    renderer.render(scene, camera)
}

requestAnimationFrame(draw)