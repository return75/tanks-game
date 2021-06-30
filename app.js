let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let animationFrame;
let tankBodyRadius = 60,
    tankCylinderLength = 120,
    tankCylinderWidth = 36,
    ballRadius = 18,
    bounce = .75,
    friction = .995,
    gravity = vector.create(0, .4);

let balls = [];
let plateLeft = plate.create (vector.create(0, 0), vector.create(0, 10), 'blue');
let plateRight = plate.create (vector.create(width - plate.width, 0), vector.create(0, 5), 'red');

let leftTank = tank.create(vector.create(ballRadius, height), -Math.PI / 4);
let rightTank = tank.create(vector.create(width - ballRadius, height), 5 * Math.PI / 4);


let update = function () {
    context.clearRect(0, 0, width, height);
    plateRight.position.add(plateRight.velocity);
    reversPlateDirection (plateRight);
    drawPlate(plateRight);

    plateLeft.position.add(plateLeft.velocity);
    reversPlateDirection (plateLeft);
    drawPlate(plateLeft);

    balls.forEach(ball => {
        ball.velocity.add(gravity);
        checkBottomCollision (ball);
        //checkRightCollision (ball);
        //checkLeftCollision (ball);
        checkTopCollision (ball);
        setFrictionOnBottom (ball);
        ball.position.add(ball.velocity);
        drawBall (ball, ball.getPlayer() === 'left' ? 'blue' : 'red');
    });
    drawTank(rightTank);
    drawTank(leftTank);
    drawLeftTankPower ();
    movePower();
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
function drawTank (tank) {
    // draw tank body
    context.beginPath();
    context.arc(tank.position.getX (), tank.position.getY () , tankBodyRadius, 0, 2 * Math.PI);
    context.fillStyle = 'black';
    context.fill();

    // draw tank cylinder
    let cylinderVector = vector.create( Math.sqrt(2) / 2 * tankCylinderLength, Math.sqrt(2) / 2 * tankCylinderLength);
    cylinderVector.setAngle(tank.getAngle());
    let cylinderEndPoint = tank.position.addTo(cylinderVector);
    context.beginPath();
    context.lineWidth = tankCylinderWidth;
    context.moveTo(tank.position.getX (), tank.position.getY ());
    context.lineTo(cylinderEndPoint.getX (), cylinderEndPoint.getY ());
    context.stroke();
}
function drawLeftTankPower() {
    context.beginPath();
    context.lineWidth = "1";
    context.strokeStyle = "black";
    context.rect(tankBodyRadius + 80, height - 30, 150, 20);
    context.stroke();
}
function movePower() {
    context.fillStyle = "black";
    context.fillRect(tankBodyRadius + 80, height - 30, 100, 20);
}
function reversPlateDirection (plate) {
    if (plate.position.getY() < 0 && plate.velocity.getY() < 0 ) {
        plate.setVelocity(plate.velocity.multiplyBy(-1));
    } else if (plate.position.getY() + plate.height > height && plate.velocity.getY() ) {
        plate.setVelocity(plate.velocity.multiplyBy(-1));
    }
}
function checkBottomCollision (ball) {
    if (ball.position.getY() - ballRadius > height) {
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

function shoot () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            let position = vector.create(ballRadius, height);
            let velocity = vector.create(20, -20);
            velocity.setAngle(leftTank.getAngle ());
            let newBall = ball.create(position, velocity, 1);
            newBall.setPlayer('left')
            balls.push(newBall);
        } else if (event.code === 'Enter') {
            let position = vector.create(width - ballRadius, height);
            let velocity = vector.create(-20, -20);
            velocity.setAngle(rightTank.getAngle ());
            let newBall = ball.create(position, velocity, 2);
            newBall.setPlayer('right')
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
        } else if (event.code === 'ArrowDown') {
            rightTank.setAngle(rightTank.getAngle() - .05);
        } else if (event.code === 'ArrowUp') {
            rightTank.setAngle(rightTank.getAngle() + .05);
        } else if (event.code === 'ArrowDown') {
            rightTank.setAngle(rightTank.getAngle() - .05);
        } else if (event.code === 'KeyA') {
            leftTank.setAngle(leftTank.getAngle() - .05);
        } else if (event.code === 'KeyZ') {
            leftTank.setAngle(leftTank.getAngle() + .05);
        }
    }, false);
}

shoot ();
update ();
