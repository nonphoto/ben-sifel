const lightSource = document.querySelector('#light-source')

window.addEventListener('mousemove', (event) => {
    lightSource.setAttribute('cx', event.clientX)
    lightSource.setAttribute('cy', event.clientY)
})


function draw() {
    const radius = 100 + (Math.random() * 10)
    lightSource.setAttribute('r', radius)

    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)