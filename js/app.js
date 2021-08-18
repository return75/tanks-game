let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let background = document.getElementById('background')
let backgroundContext = background.getContext("2d")

let animationFrame
let tankBodyRadius = 60,
    tankCylinderLength = 120,
    tankCylinderWidth = 36,
    ballRadius = 18,
    bounce = .75,
    friction = .995,
    gravity = vector.create(0, .5),
    leftPlayerColor = '#de0505',
    rightPlayerColor = '#0274d7',
    plateColors = ['#003be0', '#e27c0b', '#d00660', '#e07909','#0adee5', '#7609dc', '#18d40b', '#e5dc06'],
    shootPower = 30,
    initialPlateVelocity = 6,
    initialPlateHeight = 140,
    scoreReactangleWidth = 100,
    scoreRectangleHeight = 20

let balls = []
let centerPlate = plate.create(vector.create(width / 2, 0), vector.create(0, 6), plateColors[0], 140)
let leftPlayerScore = 0, rightPlayerScore = 0
let leftTank = tank.create(vector.create(ballRadius, height - ballRadius), -Math.PI / 4)
let rightTank = tank.create(vector.create(width - ballRadius, height - ballRadius), 5 * Math.PI / 4)

let startAnimationFrames = function () {
    context.clearRect(0, 0, width, height)
    centerPlate.position.add(centerPlate.velocity)
    reversPlateDirection (centerPlate)
    drawPlate(centerPlate)

    for (let i = balls.length - 1; i >=0;  i--) {
        let ball = balls[i]
        removeExitedBallFromScreen(ball) && balls.splice(i, 1)
        ball.velocity.add(gravity)
        checkBallPlateCollision(ball)
        checkBottomCollision (ball)
        checkTopCollision (ball)
        setFrictionOnBottom (ball)
        ball.position.add(ball.velocity)
        drawBall (ball, ball.getPlayer() === 'left' ? leftPlayerColor : rightPlayerColor)
    }
    drawScoreRectangle(tankBodyRadius + 100, height - 50, 'left', leftPlayerScore)
    drawScoreRectangle(width - tankBodyRadius - scoreReactangleWidth - 100, height - 50, 'right', rightPlayerScore)
    drawTank(rightTank, rightPlayerColor, '#423937')
    drawTank(leftTank, leftPlayerColor, '#423937')
    animationFrame = requestAnimationFrame(startAnimationFrames)
}
function drawBall (ball, color) {
    context.beginPath()
    context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
    context.fillStyle = color
    context.fill()
}
function drawPlate (plate) {
    context.beginPath()
    context.fillStyle = plate.color
    context.fillRect(plate.position.getX(), plate.position.getY() , plate.width, plate.height)
    context.fill()
}
function drawTank (tank, bodyColor, cylinderColor) {

    // draw tank cylinder
    let cylinderVector = vector.create( Math.sqrt(2) / 2 * tankCylinderLength, Math.sqrt(2) / 2 * tankCylinderLength)
    cylinderVector.setAngle(tank.getAngle())
    let cylinderEndPoint = tank.position.addTo(cylinderVector)
    context.beginPath()
    context.lineWidth = tankCylinderWidth
    context.strokeStyle = cylinderColor
    context.moveTo(tank.position.getX (), tank.position.getY ())
    context.lineTo(cylinderEndPoint.getX (), cylinderEndPoint.getY ())
    context.stroke()

    // draw tank body
    context.beginPath()
    context.arc(tank.position.getX (), tank.position.getY () , tankBodyRadius, 0, 2 * Math.PI)
    context.fillStyle = bodyColor
    context.fill()
}
function reversPlateDirection (plate) {
    if (plate.position.getY() < 0 && plate.velocity.getY() < 0 ) {
        plate.setVelocity(plate.velocity.multiplyBy(-1))
    } else if (plate.position.getY() + plate.height > height && plate.velocity.getY() ) {
        plate.setVelocity(plate.velocity.multiplyBy(-1))
    }
}
function checkBottomCollision (ball) {
    if (ball.position.getY() + ballRadius > height) {
        let ySpeed = -1 * Math.abs(ball.velocity.getY ()) * bounce
        ball.setVelocity (vector.create (ball.velocity.getX (), ySpeed))
        if (ball.velocity.getY() > -1.8) {
            ball.velocity.setY (0)
        }
    }
}
function checkTopCollision (ball) {
    if (ball.position.getY() - ballRadius < 0) {
        ball.setVelocity (vector.create (ball.velocity.getX (), ball.velocity.getY () * -1))
    }
}
function checkRightCollision(ball) {
    if (ball.position.getX() + ballRadius > width) {
        ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()))
    }
}
function checkLeftCollision(ball) {
    if (ball.position.getX() - ballRadius < 0) {
        ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()))
    }
}
function setFrictionOnBottom(ball) {
    if (ball.velocity.getY() === 0 &&  ball.position.getY() + ballRadius > height) {
        ball.setVelocity (vector.create (ball.velocity.getX () * friction , 0))
    }
}
function checkBallsCollision(ball1, ball2) {
    let distance = Math.sqrt (Math.pow((ball1.position.getX () - ball2.position.getX ()), 2) +
    Math.pow((ball1.position.getY () - ball2.position.getY ()), 2))
    if (distance < 2 * ballRadius) {
        let ball1VelocityAngle = ball1.velocity.getAngle()
        let ball2VelocityAngle = ball2.velocity.getAngle()
        ball1.velocity.setAngle (ball2VelocityAngle)
        ball2.velocity.setAngle (ball1VelocityAngle)
    }
}
function checkBallPlateCollision(ball) {
    if (Math.abs(ball.getPosition().getX() - centerPlate.getPosition().getX()) < ballRadius) {
        if (ball.getPosition().getY() > centerPlate.getPosition().getY() - ballRadius &&
            ball.getPosition().getY() < centerPlate.getPosition().getY() + ballRadius + centerPlate.getHeight())
        {
            ball.getPlayer() === 'left' ? leftPlayerScore ++ : rightPlayerScore ++
            checkIfGameEnded()
            ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()))
            createNewPlate()
            playScoreSound()
        }
    }
}
function removeExitedBallFromScreen(ball) {
    let ballX = ball.getPosition().getX()
    let ballY = ball.getPosition().getY()
    return ballX < -ballRadius || ballX > width + ballRadius ||
        ballY < -ballRadius || ballY > height + ballRadius
}
function drawScoreRectangle (xPosition, yPosition, player, score) {
    context.beginPath()
    context.lineWidth = "1"
    context.strokeStyle = "#00ba86"
    context.rect(xPosition, yPosition, scoreReactangleWidth, scoreRectangleHeight)
    context.stroke()
    context.fillStyle = "#00ffb6"
    context.fillRect(xPosition, yPosition, score / 10 * scoreReactangleWidth, scoreRectangleHeight)
}
function keyboardHandling () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            let position = vector.create(ballRadius, height - ballRadius)
            let velocity = vector.create(1, 1)
            velocity.setLength(shootPower)
            velocity.setAngle(leftTank.getAngle ())
            let newBall = ball.create(position, velocity, 'left')
            balls.push(newBall)
            playShootSound()
        } else if (event.code === 'Enter') {
            let position = vector.create(width - ballRadius, height - ballRadius)
            let velocity = vector.create(1, 1)
            velocity.setLength(shootPower)
            velocity.setAngle(rightTank.getAngle ())
            let newBall = ball.create(position, velocity, 'right')
            balls.push(newBall)
            playShootSound()
        } else if (event.code === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame(startAnimationFrames)
            } else {
                cancelAnimationFrame(animationFrame)
                animationFrame = null
            }
        } else if (event.code === 'ArrowUp') {
            rightTank.setAngle(rightTank.getAngle() + .1)
        } else if (event.code === 'ArrowRight') {
            rightTank.setAngle(rightTank.getAngle() + .1)
        } else if (event.code === 'ArrowDown') {
            rightTank.setAngle(rightTank.getAngle() - .1)
        } else if (event.code === 'ArrowLeft') {
            rightTank.setAngle(rightTank.getAngle() - .1)
        } else if (event.code === 'ArrowUp') {
            rightTank.setAngle(rightTank.getAngle() + .1)
        } else if (event.code === 'ArrowDown') {
            rightTank.setAngle(rightTank.getAngle() - .1)
        } else if (event.code === 'KeyA') {
            leftTank.setAngle(leftTank.getAngle() - .1)
        } else if (event.code === 'KeyW') {
            leftTank.setAngle(leftTank.getAngle() - .1)
        } else if (event.code === 'KeyS') {
            leftTank.setAngle(leftTank.getAngle() + .1)
        } else if (event.code === 'KeyD') {
            leftTank.setAngle(leftTank.getAngle() + .1)
        }
    }, false)
}
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
        let y = height - hillHeight - Math.sin(i * Math.PI/180) * waveHeight
        backgroundContext.lineTo(i / sinAngle * width, y)
    }
    backgroundContext.lineTo(width, height)
    backgroundContext.lineTo(0, height)
    backgroundContext.closePath()
    backgroundContext.fillStyle = color
    backgroundContext.fill()
}
function createNewPlate () {
    let totalScore = leftPlayerScore + rightPlayerScore
    let newPlateHeight = initialPlateHeight - totalScore * 5
    let newPlateVelocity = initialPlateVelocity + .8
    let newPlateColor = plateColors[Math.round(Math.random() * plateColors.length)]
    setTimeout(() => {
        centerPlate = plate.create(vector.create(width / 2, height - newPlateHeight), vector.create(0, newPlateVelocity), newPlateColor, newPlateHeight)
    }, 500)
}
function checkIfGameEnded () {
    if (leftPlayerScore === 10 || rightPlayerScore === 10) {
        cancelAnimationFrame(animationFrame)
        animationFrame = null
        showEndGamePanel()
    }
}
function showEndGamePanel () {
    document.querySelector('#end-game').style.display = 'flex'
    document.querySelector('#end-game .left .score').innerHTML = leftPlayerScore.toString()
    document.querySelector('#end-game .right .score').innerHTML = rightPlayerScore.toString()
    if (leftPlayerScore > rightPlayerScore) {
        document.querySelector('#end-game .left .winner').innerHTML = 'winner'
    } else {
        document.querySelector('#end-game .right .winner').innerHTML = 'winner'
    }
    backgroundSound.volume = .4
}

initBackground()
drawBackground()
keyboardHandling()