import * as three from 'three'
import SimplexNoise from 'simplex-noise'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import Vehicle from './vehicle'

const halfPi = Math.PI * 0.5

const simplex = new SimplexNoise()

let vw = window.innerWidth
let vh = window.innerHeight
let aspect = vw / vh

const perspectiveScene = new three.Scene()
const perspectiveCamera = new three.PerspectiveCamera(30, aspect, 0.1, 1000)
perspectiveCamera.position.z = 3
perspectiveScene.add(perspectiveCamera)

const orthographicScene = new three.Scene()
const orthographicCamera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
orthographicCamera.position.z = 1
orthographicScene.add(orthographicCamera)

const wingTexture = new three.TextureLoader().load('1.png')

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
orthographicScene.add(screenMesh)

const wingMaterial = new three.MeshBasicMaterial({
    map: wingTexture,
    side: three.DoubleSide,
    transparent: true
})

const wingGeometry = new three.PlaneGeometry(1, 1)

const leftWingContainer = new three.Object3D()
const leftWing = new three.Mesh(wingGeometry, wingMaterial)
leftWingContainer.add(leftWing)
leftWing.position.set(-0.5, 0, 0)
leftWing.rotation.set(halfPi, 0, 0)

const rightWingContainer = new three.Object3D()
const rightWing = new three.Mesh(wingGeometry, wingMaterial)
rightWingContainer.add(rightWing)
rightWing.position.set(0.5, 0, 0)
rightWing.rotation.set(halfPi, 0, 0)
rightWing.scale.x = -1

const butterfly = new three.Object3D()
butterfly.add(leftWingContainer)
butterfly.add(rightWingContainer)
perspectiveScene.add(butterfly)

const renderer = new three.WebGLRenderer({alpha: true})
renderer.setSize(vw, vh)
renderer.autoClear = false
document.body.appendChild(renderer.domElement)

const targetPosition = new three.Vector3()
const vehicle = new Vehicle()

function handleResize() {
    vw = window.innerWidth
    vh = window.innerHeight
    aspect = vw / vh

    camera.aspect = aspect
    camera.updateProjectionMatrix()

    uniforms.resolution.value.x = vw
    uniforms.resolution.value.y = vh

    renderer.setSize(vw, vh)
}

window.addEventListener('resize', handleResize)

function draw() {
    requestAnimationFrame(draw)

    renderer.clear()

    const time = performance.now()
    targetPosition.x = simplex.noise2D(time * 0.00053, 0)
    targetPosition.y = simplex.noise2D(time * 0.00055, 1000)
    const radius = 100 + (simplex.noise2D(time * 0.001, 0) * 5)

    vehicle.seek(targetPosition)
    vehicle.update()

    butterfly.lookAt(new three.Vector3(0, 2, -1).add(targetPosition))

    uniforms.time.value = time
    uniforms.center.value = vehicle.position

    const wingRotation = Math.sin(time * 0.01) * Math.PI * 0.4

    leftWingContainer.rotation.z = wingRotation
    rightWingContainer.rotation.z = -wingRotation

    const w = vw * 0.1
    const h = vh * 0.1
    const x = ((vehicle.position.x * 0.5) + 0.5) * vw - (w * 0.5)
    const y = ((-vehicle.position.y * 0.5) + 0.5) * vh - (h * 0.5)

    renderer.setViewport(x, y, w, h)
    renderer.render(perspectiveScene, perspectiveCamera)

    renderer.setViewport(0, 0, vw, vh)
    renderer.render(orthographicScene, orthographicCamera)
}

requestAnimationFrame(draw)