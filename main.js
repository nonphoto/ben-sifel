const lightSource = document.querySelector('#light-source')

window.addEventListener('mousemove', (event) => {
    lightSource.setAttribute('cx', event.clientX)
    lightSource.setAttribute('cy', event.clientY)
})


function draw() {
    const time = performance.now()
    const radius = 100 + (noise.perlin2(time / 100, 0) * 5)
    lightSource.setAttribute('r', radius)

    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)