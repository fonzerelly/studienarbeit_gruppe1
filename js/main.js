let frametimeBefore = Date.now();
let frametime; // in ms

let spielfeld = document.getElementById("spielfeld");

let ball = {
    object: document.getElementById("ball"),
    position: {
        bottom: 350, //in px
        left: 600, //in px
        angle: 20, //in degrees.
    },
    speed: 400,
    touched: false,
}

function ballLogic(frametime) {
    if (ball.position.left >= spielfeld.offsetWidth - ball.object.offsetWidth) {
        //touches the right border
        ball.position.angle = ball.position.angle - 90;
        moveBall(ball.position.angle, frametime);
        return;
    } else if (ball.position.left <= ball.object.offsetWidth) {
        //touches the left border
        ball.position.angle -= 90;
        moveBall(ball.position.angle, frametime);
        return;
    } else if (ball.position.left < spielfeld.offsetWidth){
        //ball is in game
        moveBall(ball.position.angle, frametime);
        return;
    } 
}

function moveBall(angle, frametime) {
    let newBallPosition = {
        bottom: ball.position.bottom + (getDirection(angle).y * ball.speed * frametime),
        left: ball.position.left + (getDirection(angle).x * ball.speed * frametime),
        angle: angle,
    }
    ball.object.style.bottom = "" + newBallPosition.bottom;
    ball.position.bottom = newBallPosition.bottom;

    ball.object.style.left = "" + newBallPosition.left;
    ball.position.left = newBallPosition.left;
}

function getDirection(directAngle) {
    //Umrechnung von einem Winkel in den dazugehörigen Vektor
    let x;
    let y;
    if (directAngle > 360){
        directAngle = directAngle - 360;
    }
    if (directAngle < 0){
        directAngle = 360 + directAngle;
    }
    let angle = (Math.PI / 180) * directAngle;

    if (directAngle <= 90) {
        let xa = Math.sin(angle);
        let ya = Math.cos(angle);

        x = xa / (xa + ya);
        y = ya / (xa + ya);
    } else if (directAngle <= 180) {
        let xa = Math.sin(angle);
        let ya = Math.cos(angle);

        x = xa / (xa + Math.abs(ya));
        y = ya / (xa + Math.abs(ya));
    } else if (directAngle <= 270) {
        let xa = Math.sin(angle);
        let ya = Math.cos(angle);

        x = xa / Math.abs(xa + ya);
        y = ya / Math.abs(xa + ya);
    } else if (directAngle <= 360) {
        let xa = Math.sin(angle);
        let ya = Math.cos(angle);

        x = xa / (Math.abs(xa) + ya);
        y = ya / (Math.abs(xa) + ya);
    }
    return {
        x: round(x),
        y: round(y),
    }
}

function getAngle(x, y){
    //Umrechnung von einem Vektor in den dazugehörigen Winkel

    if( (x === 0 && y === 0) || (x === 1 && y === 1) ){
        //keine Bewegung === keine Richung
        return; 
    }
    //wir können nicht durch 0 teilen, aber durch annähernd 0
    if(y === 0){
        y = 0.00000001;
    }
    if(x === 0){
        x = 0.00000001;
    }

    let alpha = Math.round( (180 / Math.PI) * Math.atan(x/y));
    let angle;

    //arctan hat nur einen Ergebnisbereich von 0 - 90° -> es müssen noch Anpassungen unternommen werden
    if(x > 0 && y > 0){
        angle = alpha;
    }
    else if(y < 0){
        angle = alpha + 180;
    }
    else if(x < 0){
        angle = alpha + 360;
    }

    return angle;
}

function round(n) {
    // 2 decimal places
    let number = (Math.round(n * 100) / 100)
    return number;
}

function gameLoop() {
    //in dem Loop sollen alle regelmäßigen Events aufgerufen werden.

    let now = Date.now(); //gibt eine bestimmte Anzahl an Millisekunden aus. 
    frametime = (now - frametimeBefore) * 0.001;
    // Abhängigkeit von Frametime ist wichtig, weil selbst bei geringer Prozessorgeschwindigkeit
    // das Spiel nicht schneller laufen soll, als der Spieler es spielen kann. 
    // gleichzeitig bestimmt die frametime die Spielgeschwindigkeit.

    ballLogic(frametime);

    frametimeBefore = now;
}

setInterval(gameLoop, 0);

module.exports = {
    getDirection: getDirection,
    getAngle: getAngle,
    round: round,
}