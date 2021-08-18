let background = document.getElementById('background')
let backgroundContext = background.getContext("2d")

function initBackground () {
    background.width = window.innerWidth
    background.height = window.innerHeight
}
function drawBackground () {
    drawSky()
    drawHill(150, 20, 4, '#765008')
    drawHill(120, 30, 2, '#eeda1d')
    drawHill(100, 50, 1, '#b47e0b')
}
function drawSky() {
    let gradient = backgroundContext.createLinearGradient(0, 0, 0, window.innerHeight)
    gradient.addColorStop(0, "#AADBEA")
    gradient.addColorStop(1, "#FEF1E1")
    backgroundContext.fillStyle = gradient
    backgroundContext.fillRect(0, 0, window.innerWidth, window.innerHeight)
}
function drawHill (hillHeight, waveHeight, hillCount, color) {
    let sinAngle = hillCount * 360
    backgroundContext.beginPath()
    for(let i = 0; i <= sinAngle; i +=1) {
        let y = window.innerHeight - hillHeight - Math.sin(i * Math.PI/180) * waveHeight
        backgroundContext.lineTo(i / sinAngle * window.innerWidth, y)
    }
    backgroundContext.lineTo(window.innerWidth, window.innerHeight)
    backgroundContext.lineTo(0, window.innerHeight)
    backgroundContext.closePath()
    backgroundContext.fillStyle = color
    backgroundContext.fill()
}

initBackground()
drawBackground()