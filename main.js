const vw = window.innerWidth
const vh = window.innerHeight

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, vw / vh, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer()
renderer.setSize(vw, vh)
document.body.appendChild(renderer.domElement)

function draw() {
    const time = performance.now()
    const x = ((Math.sin(time * 0.00055) * 0.4) + 0.5) * vw
    const y =  ((noise.simplex2(time * 0.0001, 1000) * 0.4) + 0.5) * vh
    const radius = 100 + (noise.perlin2(time * 0.001, 0) * 5)


    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)