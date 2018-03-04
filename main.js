const lightSource = document.querySelector('#light-source')

const vw = window.innerWidth
const vh = window.innerHeight

function draw() {
    const time = performance.now()
    const x = ((Math.sin(time * 0.00055) * 0.4) + 0.5) * vw
    const y =  ((noise.simplex2(time * 0.0001, 1000) * 0.4) + 0.5) * vh
    const radius = 100 + (noise.perlin2(time * 0.001, 0) * 5)

    lightSource.setAttribute('cx', x)
    lightSource.setAttribute('cy', y)
    lightSource.setAttribute('r', radius)

    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)