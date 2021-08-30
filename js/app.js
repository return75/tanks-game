let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight


let animationFrame,
    leftPlayerScore = 0,
    rightPlayerScore = 0
    tankBodyRadius = 60,
    tankCylinderLength = 120,
    tankCylinderWidth = 36,
    ballRadius = 18,
    bounce = .75,
    friction = .995,
    gravity = vector.create(0, .5),
    leftPlayerColor = '#de0505',
    rightPlayerColor = '#0274d7',
    shootPower = 30,
    targetPower = 35,
    scoreRectangleWidth = 100,
    scoreRectangleHeight = 20,
    randomBallIntervalId = null,
    balls = [],
    targets = []

let leftTank = tank.create(vector.create(ballRadius, height - ballRadius), -Math.PI / 4)
let rightTank = tank.create(vector.create(width - ballRadius, height - ballRadius), 5 * Math.PI / 4)

let startAnimationFrames = function () {
    clearCanvas()
    drawTargets()
    drawBalls()
    checkBallsTargetCollision()
    drawScoreRectangle(tankBodyRadius + 100, height - 50, 'left', leftPlayerScore)
    drawScoreRectangle(width - tankBodyRadius - scoreRectangleWidth - 100, height - 50, 'right', rightPlayerScore)
    drawTank(rightTank, rightPlayerColor, '#423937')
    drawTank(leftTank, leftPlayerColor, '#423937')
    checkIfGameEnded()
    animationFrame = requestAnimationFrame(startAnimationFrames)
}
function clearCanvas () {
    context.clearRect(0, 0, width, height)
}
function drawBall (ball, color) {
    context.beginPath()
    context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI)
    context.fillStyle = color
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
function drawBalls () {
    for (let i = balls.length - 1; i >=0;  i--) {
        let ball = balls[i]
        removeExitedBallFromScreen(ball) && balls.splice(i, 1)
        ball.velocity.add(gravity)
        checkBottomCollision (ball)
        checkTopCollision (ball)
        setFrictionOnBottom (ball)
        ball.position.add(ball.velocity)
        drawBall (ball, ball.getPlayer() === 'left' ? leftPlayerColor : rightPlayerColor)
    }
}
function drawTargets () {
    for (let i = targets.length - 1; i >=0;  i--) {
        let target = targets[i]
        removeExitedBallFromScreen(target) && targets.splice(i, 1)
        target.velocity.add(gravity)
        checkBottomCollision (target)
        checkTopCollision (target)
        setFrictionOnBottom (target)
        target.position.add(target.velocity)
        drawTarget(target, 20)
    }
}
function drawTarget (target, targetRadius) {
    context.beginPath()
    context.arc(target.position.getX(), target.position.getY(), targetRadius, 0, 2 * Math.PI)
    context.fillStyle = '#c9c102'
    context.fill()
}
function createRandomTarget () {
    randomBallIntervalId = setInterval(function () {
        let randomDirection = Math.random() * 4 - 2
        let newTarget = target.create(vector.create(width / 2, height), vector.create(randomDirection, targetPower))
        targets.push(newTarget)
    }, 4000)
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
    if (ball.getPosition().getY() <= ballRadius) {
        ball.setVelocity (vector.create(ball.getVelocity().getX (), ball.getVelocity().getY () * -1))
    }
}
function checkBallsTargetCollision () {
    let lastLeftBall = balls.filter(item => item.player === 'left').slice(-1)[0]
    let lastRightBall = balls.filter(item => item.player === 'right').slice(-1)[0]
    let lastTarget = targets.slice(-1)[0]
    lastLeftBall && lastTarget && checkBallTargetCollision(lastLeftBall, lastTarget)
    lastRightBall && lastTarget && checkBallTargetCollision(lastRightBall, lastTarget)

}
function checkBallTargetCollision (ball, target) {
    let distance = Math.sqrt (Math.pow((ball.getPosition().getX() - target.getPosition().getX()), 2) +
        Math.pow((ball.getPosition().getY() - target.getPosition().getY()), 2))
    if (distance < 2 * ballRadius) {
        let ballCentersVector = vector.create(ball.getPosition().getX() - target.getPosition().getX(),
            ball.getPosition().getY() - target.getPosition().getY())
        let ballVelocityLength = ball.getVelocity().getLength()
        let targetVelocityLength = target.getVelocity().getLength()
        ball.getVelocity().setAngle(ballCentersVector.getAngle())
        ball.getVelocity().setLength(targetVelocityLength)
        target.getVelocity().setAngle(Math.PI + ballCentersVector.getAngle())
        target.getVelocity().setLength(ballVelocityLength)
        if (!target.collided && ball.getPlayer() === 'left') {
            leftPlayerScore++
            playScoreSound()
            target.setCollided(true)
        } else if (!target.collided) {
            rightPlayerScore++
            playScoreSound()
            target.setCollided(true)
        }

   }
}
function setFrictionOnBottom(ball) {
    if (ball.velocity.getY() === 0 &&  ball.position.getY() + ballRadius > height) {
        ball.setVelocity (vector.create (ball.velocity.getX () * friction , 0))
    }
}
// function checkBallsCollision(ball1, ball2) {
//     let distance = Math.sqrt (Math.pow((ball1.getPosition().getX () - ball2.getPosition().getX ()), 2) +
//     Math.pow((ball1.getPosition().getY () - ball2.getPosition().getY ()), 2))
//     if (distance < 2 * ballRadius) {
//         let ball1VelocityAngle = ball1.getVelocity().getAngle()
//         let ball2VelocityAngle = ball2.getVelocity().getAngle()
//         ball1.getVelocity().setAngle(ball2VelocityAngle)
//         ball2.getVelocity().setAngle(ball1VelocityAngle)
//     }
// }
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
    context.rect(xPosition, yPosition, scoreRectangleWidth, scoreRectangleHeight)
    context.stroke()
    context.fillStyle = "#00ffb6"
    context.fillRect(xPosition, yPosition, score / 10 * scoreRectangleWidth, scoreRectangleHeight)
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
    clearInterval(randomBallIntervalId)
    if (leftPlayerScore > rightPlayerScore) {
        document.querySelector('#end-game .left .winner').innerHTML = 'winner'
    } else {
        document.querySelector('#end-game .right .winner').innerHTML = 'winner'
    }
    backgroundSound.volume = .4
}
keyboardHandling()
createRandomTarget()



