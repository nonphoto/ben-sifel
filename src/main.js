import * as three from 'three'
import SimplexNoise from 'simplex-noise'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import Vehicle from './vehicle'

const simplex = new SimplexNoise()

const vw = window.innerWidth
const vh = window.innerHeight

const scene = new three.Scene()
const camera = new three.PerspectiveCamera(90, vw / vh, 0.1, 1000)
camera.position.z = 1
scene.add(camera)

const wingTexture = new three.TextureLoader().load('test.png')

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

const wingMaterial = new three.MeshBasicMaterial({map: wingTexture, side: three.DoubleSide})
const blueMaterial = new three.MeshBasicMaterial({color: 0x0000FF, side: three.DoubleSide})
const redMaterial = new three.MeshBasicMaterial({color: 0xFF0000, side: three.DoubleSide})
const wingGeometry = new three.PlaneGeometry(0.2, 0.2)
const leftWing = new three.Mesh(wingGeometry, wingMaterial)
const rightWing = new three.Mesh(wingGeometry, wingMaterial)
scene.add(leftWing)
scene.add(rightWing)

const butterfly = new three.Object3D()
butterfly.add(leftWing)
butterfly.add(rightWing)
scene.add(butterfly)

const gridHelper = new three.GridHelper(2, 10, 0x00FF00, 0xFFFFFF)
gridHelper.rotateX(Math.PI / 2)
// scene.add(gridHelper)

const renderer = new three.WebGLRenderer({alpha: true})
renderer.setSize(vw, vh)
document.body.appendChild(renderer.domElement)

const targetPosition = new three.Vector3()
const vehicle = new Vehicle()

function draw() {
    requestAnimationFrame(draw)

    const time = performance.now()
    targetPosition.x = simplex.noise2D(time * 0.00053, 0)
    targetPosition.y = simplex.noise2D(time * 0.00055, 1000)
    const radius = 100 + (simplex.noise2D(time * 0.001, 0) * 5)

    uniforms.time.value = performance.now()
    uniforms.center.value = butterfly.position

    const wingRotation = Math.sin(time * 0.01) * Math.PI * 0.4

    leftWing.setRotationFromEuler(new three.Euler(Math.PI / 2, -wingRotation, 0))
    rightWing.setRotationFromEuler(new three.Euler(Math.PI / 2, wingRotation, 0))

    vehicle.seek(targetPosition)
    vehicle.update()

    butterfly.position.x = vehicle.position.x
    butterfly.position.y = vehicle.position.y
    butterfly.lookAt(new three.Vector3(0, 2, -1).add(targetPosition))

    renderer.render(scene, camera)
}

requestAnimationFrame(draw)