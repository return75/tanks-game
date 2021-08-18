let shootSound = document.getElementById("shoot")
let scoreSound = document.getElementById("score")
let backgroundSound = document.getElementById("backgroundSound")

function playShootSound() {
    shootSound.volume = .1
    shootSound.play()
}
function pauseShootSound() {
    shootSound.pause()
}
function resetShootSound() {
    shootSound.currentTime = 0
}
function playScoreSound() {
    scoreSound.play()
}
function pauseScoreSound() {
    scoreSound.pause()
}
function resetScoreSound() {
    scoreSound.currentTime = 0
}
function playBackgroudSound() {
    backgroundSound.volume = 1
    backgroundSound.play()
    backgroundSound.addEventListener('ended', () => {
        backgroundSound.currentTime = 0
        backgroundSound.play()
    })
}
function pauseBackgroudSound() {
    backgroundSound.pause()
}
function resetBackgroudSound() {
    backgroundSound.currentTime = 0
}
