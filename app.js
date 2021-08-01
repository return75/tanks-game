let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let background = document.getElementById('background')
let backgroundContext = background.getContext("2d");
initBackground();
drawBackground();
//playBackgroudSound();



let animationFrame;
let tankBodyRadius = 60,
    tankCylinderLength = 120,
    tankCylinderWidth = 36,
    ballRadius = 18,
    bounce = .75,
    friction = .995,
    gravity = vector.create(0, .4),
    leftPlayerColor = '#f9ba52',
    rightPlayerColor = '#498bff';

let balls = [];
let leftPlate = plate.create (vector.create(0, 0), vector.create(0, 6), leftPlayerColor);
let rightPlate = plate.create (vector.create(width - plate.width, 200), vector.create(0, 6), rightPlayerColor);

let leftTank = tank.create(vector.create(ballRadius, height - ballRadius), -Math.PI / 4);
let rightTank = tank.create(vector.create(width - ballRadius, height - ballRadius), 5 * Math.PI / 4);
let leftTankPower = tankPower.create(vector.create(tankBodyRadius + 80, height - 105), 0, 1);
let rightTankPower = tankPower.create(vector.create(width - tankBodyRadius - 80, height - 105), 60, 2);

let update = function () {
    context.clearRect(0, 0, width, height);
    rightPlate.position.add(rightPlate.velocity);
    reversPlateDirection (rightPlate);
    drawPlate(rightPlate);

    leftPlate.position.add(leftPlate.velocity);
    reversPlateDirection (leftPlate);
    drawPlate(leftPlate);

    for (let i = balls.length - 1; i >=0 ; i--) {
        let ball = balls[i];
        removeExitedBallFromScreen(ball) && balls.splice(i, 1);
        ball.velocity.add(gravity);
        checkBallPlateLeftCollision(ball);
        checkBallPlateRightCollision(ball);
        checkBottomCollision (ball);
        checkTopCollision (ball);

        setFrictionOnBottom (ball);
        ball.position.add(ball.velocity);
        drawBall (ball, ball.getPlayer() === 'left' ? leftPlayerColor : rightPlayerColor);
    }
    drawTank(rightTank, rightPlayerColor, '#423937');
    drawTank(leftTank, leftPlayerColor, '#423937');
    //drawTankPower(leftTankPower);
    //drawTankPower(rightTankPower);
    animationFrame = requestAnimationFrame (update)
}

function drawBall (ball, color) {
    context.beginPath();
    context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.save();
    context.restore();
}
function drawPlate (plate) {
    context.beginPath();
    context.fillStyle = plate.color;
    context.fillRect(plate.position.getX(), plate.position.getY() , plate.width, plate.height);
    context.fill();
}
function drawTank (tank, bodyColor, cylinderColor) {

    // draw tank cylinder
    let cylinderVector = vector.create( Math.sqrt(2) / 2 * tankCylinderLength, Math.sqrt(2) / 2 * tankCylinderLength);
    cylinderVector.setAngle(tank.getAngle());
    let cylinderEndPoint = tank.position.addTo(cylinderVector);
    context.beginPath();
    context.lineWidth = tankCylinderWidth;
    context.strokeStyle = cylinderColor;
    context.moveTo(tank.position.getX (), tank.position.getY ());
    context.lineTo(cylinderEndPoint.getX (), cylinderEndPoint.getY ());
    context.stroke();

    // draw tank body
    context.beginPath();
    context.arc(tank.position.getX (), tank.position.getY () , tankBodyRadius, 0, 2 * Math.PI);
    context.fillStyle = bodyColor;
    context.fill();


}
function drawTankPower(tankPower) {
    context.beginPath();
    context.lineWidth = "1";
    context.strokeStyle = "black";
    context.rect(tankPower.getPosition().getX(), tankPower.getPosition().getY(), tankPower.width, tankPower.height);
    context.stroke();

    if (tankPower.getDirection() === 'down') {
        tankPower.setPower(tankPower.getPower() + 3);
    } else {
        tankPower.setPower(tankPower.getPower() - 3);
    }
    if (tankPower.getPower() >= 100 && tankPower.getDirection() === 'down') {
        tankPower.setDirection('up');
    } else if (tankPower.getPower() <= 0 && tankPower.getDirection() === 'up') {
        tankPower.setDirection('down');
    }
    context.fillStyle = "black";
    context.fillRect(tankPower.getPosition().getX(), tankPower.getPosition().getY(), tankPower.width, tankPower.power);
}
function reversPlateDirection (plate) {
    if (plate.position.getY() < 0 && plate.velocity.getY() < 0 ) {
        plate.setVelocity(plate.velocity.multiplyBy(-1));
    } else if (plate.position.getY() + plate.height > height && plate.velocity.getY() ) {
        plate.setVelocity(plate.velocity.multiplyBy(-1));
    }
}
function checkBottomCollision (ball) {
    if (ball.position.getY() + ballRadius > height) {
        let ySpeed = -1 * Math.abs(ball.velocity.getY ()) * bounce;
        ball.setVelocity (vector.create (ball.velocity.getX (), ySpeed));
        if (ball.velocity.getY() > -1.8) {
            ball.velocity.setY (0);
        }
    }
}
function checkTopCollision (ball) {
    if (ball.position.getY() - ballRadius < 0) {
        ball.setVelocity (vector.create (ball.velocity.getX (), ball.velocity.getY () * -1));
    }
}
function checkRightCollision(ball) {
    if (ball.position.getX() + ballRadius > width) {
        ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()));
    }
}
function checkLeftCollision(ball) {
    if (ball.position.getX() - ballRadius < 0) {
        ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()));
    }
}
function setFrictionOnBottom(ball) {
    if (ball.velocity.getY() === 0 &&  ball.position.getY() + ballRadius > height) {
        ball.setVelocity (vector.create (ball.velocity.getX () * friction , 0));
    }
}
function checkBallCollision(ball1, ball2) {
    let distance = Math.sqrt (Math.pow((ball1.position.getX () - ball2.position.getX ()), 2) +
    Math.pow((ball1.position.getY () - ball2.position.getY ()), 2));
    if (distance < 2 * ballRadius) {
        let ball1VelocityAngle = ball1.velocity.getAngle ();
        let ball2VelocityAngle = ball2.velocity.getAngle ();
        ball1.velocity.setAngle (ball2VelocityAngle);
        ball2.velocity.setAngle (ball1VelocityAngle);
    }
}

function checkBallPlateLeftCollision (ball) {
    if (ball.getPosition().getX() < leftPlate.getPosition().getX() + ballRadius) {
        if (ball.getPosition().getY() > leftPlate.getPosition().getY() - ballRadius &&
            ball.getPosition().getY() < leftPlate.getPosition().getY() + ballRadius + leftPlate.getHeight()) {
            ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()));
            playScoreSound();
        }
    }
}
function checkBallPlateRightCollision(ball) {
    if (ball.getPosition().getX() > rightPlate.getPosition().getX() - ballRadius) {
        if (ball.getPosition().getY() > rightPlate.getPosition().getY() - ballRadius &&
            ball.getPosition().getY() < rightPlate.getPosition().getY() + ballRadius + rightPlate.getHeight()) {
            ball.setVelocity (vector.create (ball.velocity.getX () * -1, ball.velocity.getY ()));
            playScoreSound();
        }
    }
}

function removeExitedBallFromScreen(ball) {
    let ballX = ball.getPosition().getX();
    let ballY = ball.getPosition().getY();
    return ballX < -ballRadius || ballX > width + ballRadius ||
        ballY < -ballRadius || ballY > height + ballRadius;
}

function keyboardHandling () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            let position = vector.create(ballRadius, height - ballRadius);
            let velocity = vector.create(1, 1);
            //velocity.setLength(leftTankPower.getPower() / 2);
            velocity.setLength(30);
            velocity.setAngle(leftTank.getAngle ());
            let newBall = ball.create(position, velocity, 'left');
            balls.push(newBall);
        } else if (event.code === 'Enter') {
            let position = vector.create(width - ballRadius, height - ballRadius);
            let velocity = vector.create(1, 1);
            //velocity.setLength(rightTankPower.getPower() / 2);
            velocity.setLength(30);
            velocity.setAngle(rightTank.getAngle ());
            let newBall = ball.create(position, velocity, 'right');
            balls.push(newBall);
        } else if (event.code === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame (update)
            } else {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        } else if (event.code === 'ArrowUp') {
            rightTank.setAngle(rightTank.getAngle() + .05);
        } else if (event.code === 'ArrowRight') {
            rightTank.setAngle(rightTank.getAngle() + .05);
        } else if (event.code === 'ArrowDown') {
            rightTank.setAngle(rightTank.getAngle() - .05);
        } else if (event.code === 'ArrowLeft') {
            rightTank.setAngle(rightTank.getAngle() - .05);
        } else if (event.code === 'ArrowUp') {
            rightTank.setAngle(rightTank.getAngle() + .05);
        } else if (event.code === 'ArrowDown') {
            rightTank.setAngle(rightTank.getAngle() - .05);
        } else if (event.code === 'KeyA') {
            leftTank.setAngle(leftTank.getAngle() - .05);
        } else if (event.code === 'KeyW') {
            leftTank.setAngle(leftTank.getAngle() - .05);
        } else if (event.code === 'KeyS') {
            leftTank.setAngle(leftTank.getAngle() + .05);
        } else if (event.code === 'KeyD') {
            leftTank.setAngle(leftTank.getAngle() + .05);
        }
    }, false);
}
keyboardHandling ();
update ();

function initBackground () {
    background.width = window.innerWidth;
    background.height = window.innerHeight;
}
function drawBackground () {
    drawSky();
    drawHill(150, 20, 4, '#b4ff62');
    drawHill(120, 30, 2, '#84B249');
    drawHill(100, 50, 1, '#39a85a');
}
function drawSky() {
    let gradient = backgroundContext.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, "#AADBEA");
    gradient.addColorStop(1, "#FEF1E1");
    backgroundContext.fillStyle = gradient;
    backgroundContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
}
function drawHill (hillHeight, waveHeight, hillCount, color) {
    let sinAngle = hillCount * 360;
    backgroundContext.beginPath();
    for(let i = 0; i <= sinAngle; i +=1) {
        let y = height - hillHeight - Math.sin(i * Math.PI/180) * waveHeight;
        backgroundContext.lineTo(i / sinAngle * width, y);
    }
    backgroundContext.lineTo(width, height);
    backgroundContext.lineTo(0, height);
    backgroundContext.closePath();
    backgroundContext.fillStyle = color;
    backgroundContext.fill();
}

