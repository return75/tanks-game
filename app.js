let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let animationFrame;
let ballRadius = 20;
let bounce = .75;
let friction = .995;
let gravity = vector.create(0, .1);


let ball1, ball2;
let plateLeft = plate.create (vector.create(0, 0), vector.create(0, 10), 'red');
let plateRight = plate.create (vector.create(width - plate.width, 0), vector.create(0, 5), 'blue');

shoot ();

let update = function () {
    context.clearRect(0, 0, width, height);

    plateRight.position.add(plateRight.velocity);
    reversPlateDirection (plateRight);
    DrawPlate(plateRight);

    plateLeft.position.add(plateLeft.velocity);
    reversPlateDirection (plateLeft);
    DrawPlate(plateLeft);

    

    if (ball1) {
        ball1.velocity.add(gravity);
        checkBottomCollision (ball1);
        checkRightCollision (ball1);
        checkLeftCollision (ball1);
        checkTopCollision (ball1);
        setFrictionOnBottom (ball1);
        ball1.position.add(ball1.velocity);
        DrawBall (ball1, 'blue');
        if (ball2) {
            ball2.velocity.add(gravity);
            checkBottomCollision (ball2);
            checkRightCollision (ball2);
            checkLeftCollision (ball2);
            checkTopCollision (ball2);
            setFrictionOnBottom (ball2);
            checkBallCollision (ball1, ball2);
            ball2.position.add(ball2.velocity);
            DrawBall (ball2, 'red');
        }
    }
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
    if (ball.position.getX() + ballRadius < 0) {
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
            ball1 = ball.create(position, velocity, 1);
            if (!animationFrame) {
                update();
            }
        }
    }, false);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            let position = vector.create(width - ballRadius, height);
            let velocity = vector.create(-20, -20);
            ball2 = ball.create(position, velocity, 2);
            if (!animationFrame) {
                update();
            }
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