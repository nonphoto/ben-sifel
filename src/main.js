import * as three from 'three'
import SimplexNoise from 'simplex-noise'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import Vehicle from './vehicle'

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
orthographicScene.add(screenMesh)

const wingMaterial = new three.MeshBasicMaterial({map: wingTexture, side: three.DoubleSide})
const blueMaterial = new three.MeshBasicMaterial({color: 0x0000FF, side: three.DoubleSide})
const redMaterial = new three.MeshBasicMaterial({color: 0xFF0000, side: three.DoubleSide})
const wingGeometry = new three.PlaneGeometry(1, 1)
const leftWing = new three.Mesh(wingGeometry, wingMaterial)
const rightWing = new three.Mesh(wingGeometry, wingMaterial)

const butterfly = new three.Object3D()
butterfly.add(leftWing)
butterfly.add(rightWing)
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

    leftWing.setRotationFromEuler(new three.Euler(Math.PI / 2, -wingRotation, 0))
    rightWing.setRotationFromEuler(new three.Euler(Math.PI / 2, wingRotation, 0))

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