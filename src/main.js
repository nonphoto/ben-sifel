import * as three from 'three'
import SimplexNoise from 'simplex-noise'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

const simplex = new SimplexNoise()

const vw = window.innerWidth
const vh = window.innerHeight
const hvw = vw / 2
const hvh = vh / 2

const scene = new three.Scene()
const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
camera.position.z = 1
scene.add(camera)

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

const screenMaterial = new three.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true
})
const screenGeometry = new three.PlaneGeometry(2, 2)
const screenMesh = new three.Mesh(screenGeometry, screenMaterial)
scene.add(screenMesh)

const butterflyMaterial = new three.MeshBasicMaterial({color: 0x0000FF})
const butterflyGeometry = new three.PlaneGeometry(1, 1)
const butterflyMesh = new three.Mesh(butterflyGeometry, butterflyMaterial)
scene.add(butterflyMesh)

const gridHelper = new three.GridHelper(2, 10, 0xFF0000, 0xFFFFFF);
gridHelper.rotateX(Math.PI / 2)
scene.add(gridHelper);

const renderer = new three.WebGLRenderer({alpha: true})
renderer.setSize(vw, vh)
renderer.context.disable(renderer.context.DEPTH_TEST)
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