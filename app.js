let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let animationFrame;
let ballRadius = 20;
let bounce = .8;
let friction = .995;
let gravity = vector.create(0, .1);


let ball1, ball2;

shoot ();

let update = function () {
    context.clearRect(0, 0, width, height);
    if (ball1) {
        checkBottomCollision (ball1);
        checkRightCollision (ball1);
        checkLeftCollision (ball1);
        checkTopCollision (ball1);
        setFrictionOnBottom (ball1);
        ball1.velocity.add(gravity);
        ball1.position.add(ball1.velocity);
        if (ball2) {
            let res = checkBallCollision (ball1, ball2);
            if (res) {
                DrawBall (ball1, 'blue');
                DrawBall (ball2, 'red');
                return
            }  
            checkBottomCollision (ball2);
            checkRightCollision (ball2);
            checkLeftCollision (ball2);
            checkTopCollision (ball2);
            setFrictionOnBottom (ball2);
            ball2.velocity.add(gravity);
            ball2.position.add(ball2.velocity);
        }
        
    }
    // if (ball2) {
        
    // }
    if (ball1 && ball2) {
        DrawBall (ball1, 'blue');
        DrawBall (ball2, 'red');
    }
    
    
    animationFrame = requestAnimationFrame (update)
}

function DrawBall (ball, color) {
    context.beginPath();
    context.arc(ball.position.getX(), ball.position.getY(), ballRadius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
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
        ball1.setVelocity (vector.create (ball1.velocity.getX () * -1 , ball1.velocity.getY () * -1 ) );
        ball2.setVelocity (vector.create (ball2.velocity.getX () * -1 , ball2.velocity.getY () * -1 ) );
        return true;
    }
    return false;
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