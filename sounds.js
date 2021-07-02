let shootSound = document.getElementById("shoot");
let scoreSound = document.getElementById("score");
let backgroundSound = document.getElementById("backgroundSound");

function playShootSound() {
    shootSound.play();
}
function pauseShootSound() {
    shootSound.pause();
}
function resetShootSound() {
    shootSound.currentTime = 0;
}
function playScoreSound() {
    scoreSound.play();
}
function pauseScoreSound() {
    scoreSound.pause();
}
function resetScoreSound() {
    scoreSound.currentTime = 0;
}
function playBackgroudSound() {
    backgroundSound.play();
}
function pauseBackgroudSound() {
    backgroundSound.pause();
}
function resetBackgroudSound() {
    backgroundSound.currentTime = 0;
}
