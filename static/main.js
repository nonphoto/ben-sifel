import * as three from '../web_modules/three.js'
import anime from '../web_modules/animejs.js'
import SimplexNoise from '../web_modules/simplex-noise-esm.js'

import vertexShader from './vertex.js'
import fragmentShader from './fragment.js'
import Vehicle from './vehicle.js'

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.hasAttribute('data-adminview')) return

    const renderContainer = document.createElement('div')
    renderContainer.setAttribute('id', 'render-container')
    document.body.appendChild(renderContainer)

    const simplex = new SimplexNoise()

    const targetPosition = new three.Vector3()
    const mousePosition = new three.Vector3()
    const vehicle = new Vehicle()

    let wingProgress = 0

    let vw = renderContainer.clientWidth
    let vh = renderContainer.clientHeight

    function toWorldSpace(v) {
        v.x = (v.x / vw * 2) - 1
        v.y = 1 - (v.y / vh * 2)
        return v
    }

    function toScreenSpace(v) {
        v.x = ((v.x * 0.5) + 0.5) * vw
        v.y = ((-v.y * 0.5) + 0.5) * vh
        return v
    }

    const perspectiveScene = new three.Scene()
    const perspectiveCamera = new three.PerspectiveCamera(30, 1, 0.1, 1000)
    perspectiveCamera.position.z = 5
    perspectiveScene.add(perspectiveCamera)

    const orthographicScene = new three.Scene()
    const orthographicCamera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    orthographicCamera.position.z = 1
    orthographicScene.add(orthographicCamera)

    const wingTexture = new three.TextureLoader().load('https://ben-sifel.nonphoto.now.sh/static/wing.png')

    const renderTarget = new three.WebGLRenderTarget( vh, vh, {
        wrapS: three.ClampToEdgeWrapping,
        wrapT: three.ClampToEdgeWrapping,
        format: three.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: false
    })

    const uniforms = {
        time: { type: 'f', value: 1.0 },
        resolution: { type: 'v2', value: new three.Vector2(vw, vh) },
        center: { type: 'v2', value: new three.Vector2() },
        flicker: { type: 'f', value: 1 },
        invert: { type: 'f', value: 0 },
        butterflyTexture: { type: 't', value: renderTarget.texture },
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
    leftWing.rotation.set(Math.PI * 0.5, 0, 0)

    const rightWingContainer = new three.Object3D()
    const rightWing = new three.Mesh(wingGeometry, wingMaterial)
    rightWingContainer.add(rightWing)
    rightWing.position.set(0.5, 0, 0)
    rightWing.rotation.set(Math.PI * 0.5, 0, 0)
    rightWing.scale.x = -1

    const butterfly = new three.Object3D()
    butterfly.add(leftWingContainer)
    butterfly.add(rightWingContainer)
    perspectiveScene.add(butterfly)

    const renderer = new three.WebGLRenderer({alpha: true})
    renderer.setSize(vw, vh)
    renderer.autoClear = false

    renderContainer.appendChild(renderer.domElement)

    function handleResize() {
        const innerWidth = renderContainer.clientWidth
        const innerHeight = renderContainer.clientHeight

        if (Math.abs(innerWidth - vw) < 1) return

        vw = innerWidth
        vh = innerHeight

        orthographicCamera.updateProjectionMatrix()

        uniforms.resolution.value.x = vw
        uniforms.resolution.value.y = vh

        renderTarget.setSize(vh, vh)
        renderer.setSize(vw, vh)
    }

    function handleMouseMove(event) {
        mousePosition.x = event.clientX
        mousePosition.y = event.clientY
        toWorldSpace(mousePosition)
    }

    function handleMouseClick(event) {
        if (event.target.href) return

        const shouldTurnOn = uniforms.invert.value <= 0.5
        anime({
            targets: uniforms.invert,
            value: shouldTurnOn ? 1 : 0,
            easing: 'easeOutQuint',
        })
        anime({
            targets: document.documentElement,
            backgroundColor: shouldTurnOn ? '#f5f5f5' : '#000000',
            color: shouldTurnOn ? '#000000' : '#f5f5f5',
            easing: 'easeOutQuint'
        })
    }

    function draw(time) {
        requestAnimationFrame(draw)

        renderer.clear()

        targetPosition.x = simplex.noise2D(time * 0.00053, 0)
        targetPosition.y = simplex.noise2D(time * 0.00055, 1000)
        const flicker = simplex.noise2D(time * 0.01, 0)

        vehicle.update(targetPosition)

        butterfly.lookAt(new three.Vector3(0, 1, -0.5).add(targetPosition))

        uniforms.time.value = time
        uniforms.center.value = vehicle.position.clone()
        uniforms.flicker.value = flicker

        wingProgress += (vehicle.velocity.length() * 30) + 0.15
        const wingRotation = Math.sin(wingProgress) * Math.PI * 0.3

        leftWingContainer.rotation.z = wingRotation
        rightWingContainer.rotation.z = -wingRotation

        renderer.setViewport(0, 0, vh, vh)
        renderer.render(perspectiveScene, perspectiveCamera, renderTarget, true)

        renderer.setViewport(0, 0, vw, vh)
        renderer.render(orthographicScene, orthographicCamera)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleMouseClick)
    requestAnimationFrame(draw)
})
