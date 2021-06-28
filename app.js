let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let animationFrame;
let tankBodyRadius = 50, tankCylinderLength = 100, tankCylinderWidth = 50, ballRadius = 20, bounce = .75, friction = .995, gravity = vector.create(0, .1);

let balls = [];
let plateLeft = plate.create (vector.create(0, 0), vector.create(0, 10), 'red');
let plateRight = plate.create (vector.create(width - plate.width, 0), vector.create(0, 5), 'blue');

let leftTank = tank.create(vector.create(0, height), -Math.PI / 4);
let rightTank = tank.create(vector.create(width, height), 5 * Math.PI / 4);




let update = function () {
    context.clearRect(0, 0, width, height);
    DrawTank(rightTank);
    //DrawTank(leftTank);
    return




    plateRight.position.add(plateRight.velocity);
    reversPlateDirection (plateRight);
    DrawPlate(plateRight);

    plateLeft.position.add(plateLeft.velocity);
    reversPlateDirection (plateLeft);
    DrawPlate(plateLeft);


    balls.forEach(ball => {
        ball.velocity.add(gravity);
        checkBottomCollision (ball);
        checkRightCollision (ball);
        checkLeftCollision (ball);
        checkTopCollision (ball);
        setFrictionOnBottom (ball);
        ball.position.add(ball.velocity);
        DrawBall (ball, ball.getPlayer() === 'left' ? 'blue' : 'red');
    });
    animationFrame = requestAnimationFrame (update)
}

function DrawBall (ball, color) {
    context.beginPath();
    context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.save();
    context.restore();
}
function DrawPlate (plate) {
    context.beginPath();
    context.fillRect(plate.position.getX (), plate.position.getY () , plate.width, plate.height);
   // context.closePath();
    context.fillStyle = plate.color;
    context.fill();
    context.save();
    context.restore();
}
function DrawTank (tank) {
    context.beginPath();
    context.arc(tank.position.getX (), tank.position.getY () , tankBodyRadius, 0, 2 * Math.PI);
    context.fillStyle = 'black';
    context.fill();
    //console.log('angle',tank.getAngle())
    //console.log('tank position',tank.position);
    let cylinderVector = vector.create( Math.sqrt(2) / 2 * tankCylinderLength, Math.sqrt(2) / 2 * tankCylinderLength);
    cylinderVector.setAngle(tank.getAngle());
    //console.log('cylinderVector',cylinderVector)
    let modifyVector = vector.create( cylinderVector.getY() * -1 , cylinderVector.getX() * -1);

    modifyVector.setLength(tankCylinderWidth / 2);
    console.log('modifyVector',modifyVector)
    let startRectangleDrawVector = tank.position.addTo(cylinderVector).addTo(modifyVector);
    let endRectangleDrawVector = startRectangleDrawVector.addTo(modifyVector.multiplyBy(-2))
    console.log('startRectangleDrawVector',startRectangleDrawVector);
    console.log('endRectangleDrawVector',endRectangleDrawVector);
    // Rotated rectangle
    //context.rotate(tank.getAngle());
    context.fillStyle = 'black';
    context.beginPath();
    // context.moveTo(startRectangleDrawVector.getX(), startRectangleDrawVector.getY());
    // context.lineTo(endRectangleDrawVector.getX(), endRectangleDrawVector.getY());
    // context.lineTo(tank.position.getX (), tank.position.getY ());
    console.log(tank.position.getX (), tank.position.getY ())
    context.moveTo(1492, 396);
    context.lineTo(1428, 382);
    context.lineTo(1536 , 460);
    context.fill();
    // context.fillRect(startRectangleDrawVector.getX(), startRectangleDrawVector.getY(),
    //     tankCylinderLength, tankCylinderWidth);
    //context.setTransform(1, 0, 0, 1, 0, 0);
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

function shoot () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            let position = vector.create(ballRadius, height);
            let velocity = vector.create(20, -20);
            let newBall = ball.create(position, velocity, 1);
            newBall.setPlayer('left')
            balls.push(newBall);
        }
    }, false);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            let position = vector.create(width - ballRadius, height);
            let velocity = vector.create(-20, -20);
            let newBall = ball.create(position, velocity, 2);
            newBall.setPlayer('right')
            balls.push(newBall)
        }
    }, false);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame (update)
            } else {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }
    }, false);
}

shoot ();
update ();
