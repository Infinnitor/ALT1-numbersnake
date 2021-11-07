var player;

var number;
const MAX_NUMBER_CHOICE = 10;

var totalSum;
var score;

var winW;
var winH;

var FRAMES = 0;


function rectCollide(a, b) {
    if (a.x + a.w > b.x && a.x < b.x + b.w) {
        if (a.y + a.h > b.y && a.y < b.y + b.h) {
            return true;
        }
    }
    return false;
}


function rectCollideList(a, b) {
    if (a[0] + a[2] > b[0] && a[0] < b[0] + b[2]) {
        if (a[1] + a[3] > b[1] && a[1] < b[1] + b[3]) {
            return true;
        }
    }
    return false;
}


function distance(a, b) {
    return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2);
}


// Function from MDN web docs
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


class Player {

    SNAKEBIT_LIFETIME = 30;
    COUNTDOWN_FRAMES = 200;

    constructor(pos, size, speed) {
        this.x = pos[0];
        this.y = pos[1];

        this.w = size[0];
        this.h = size[1];

        this.speed = speed;

        this.vel = [speed, 0];
        this._directionCase = "HORIZONTAL";

        this.snakebits = [];
        this._currentbit = null;

        this._frozen = false;

        this._cIter = 0;
        this._snakeColours = [
            color(135, 35, 35),
            color(35, 135, 35),
            color(35, 135, 135),
            color(200, 135, 35),
            color(135, 35, 135),
        ];

        this.c = this._snakeColours[this._cIter];

        this._eyeR = 25;
        this._eyeRdef = 25;

        this.destroy = false;
        this.destroying = false;

    }

    kill() {
        this._frozen = true;

        if (!this.destroying) {
            for (let i=0; i < this.snakebits.length; i++) {
                let bit = this.snakebits[i];
                let decrease = Math.floor((i/this.snakebits.length) * this.SNAKEBIT_LIFETIME);

                bit.lifetime = decrease;
            }
        }

        this.destroying = true;
        if (!this._popupTimeout) {
            this._popupTimeout = FRAMES;
        }
        this._textbox = "";

    }

    reanimate() {
        this._textbox = null;

        this.SNAKEBIT_LIFETIME = 10;

        for (let i=0; i < this.snakebits.length; i++) {
            let bit = this.snakebits[i];
            bit.destroying = true;
        }

        this._cIter++;
        if (this._cIter >= this._snakeColours.length) {
            this._cIter = 0;
        }
        this.c = this._snakeColours[this._cIter];

        this._frozen = false;
        this.destroying = false;
        this.destroy = false;

        this._popupTimeout = null;
        this._textbox = null;
    }

    addBit() {
        let newB = new Snakebit([this.x, this.y], [this.w, this.h]);
        this.snakebits.push(newB);
        this._currentbit = newB;
    }

    increaseLength() {
        for (let i=0; i < this.snakebits.length; i++) {
            this.snakebits[i].lifetime += 10;
        }
        this.SNAKEBIT_LIFETIME += 10;
    }

    updateMove() {
        let oldX = this.x;
        let oldY = this.y;

        if (!this._frozen) {

            if (this._directionCase != "HORIZONTAL") {

                if (keyIsDown(LEFT_ARROW)) {
                    this.vel = [-this.speed, 0];
                    this.addBit();
                    this._directionCase = "HORIZONTAL";
                }

                if (keyIsDown(RIGHT_ARROW)) {
                    this.vel = [this.speed, 0];
                    this.addBit();
                    this._directionCase = "HORIZONTAL";
                }
            }

            if (this._directionCase != "VERTICAL") {
                if (keyIsDown(UP_ARROW)) {
                    this.vel = [0, -this.speed];
                    this.addBit();
                    this._directionCase = "VERTICAL";
                }

                if (keyIsDown(DOWN_ARROW)) {
                    this.vel = [0, this.speed];
                    this.addBit();
                    this._directionCase = "VERTICAL";
                }
            }

            this.x += this.vel[0];
            this.y += this.vel[1];
        }

        else if (this._popupTimeout) {

            if (keyIsPressed === true) {
                if (!this._lastPress) {
                    this._lastPress = true;

                    let stringInts = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

                    if (stringInts.includes(key)) {
                        this._textbox += key;
                    }
                    else if (keyIsDown(BACKSPACE)) {
                        // Remove last character
                        this._textbox = this._textbox.slice(0, this._textbox.length - 1)
                    }
                }
            }

            else {
                this._lastPress = false;
            }

            if (keyIsDown(ENTER)) {
                // Base 10 parse
                if (parseInt(this._textbox, 10) == totalSum) {
                    this.reanimate();
                    totalSum = 0;
                    this._textbox = null;
                    return;
                }

                else {
                    this.destroy = true;
                    alert(`Actual answer ${totalSum} : Your answer ${parseInt(this._textbox, 10)}`);
                    refresh();
                    return;
                }
            }

            // If more than COUNTDOWN_FRAMES have elapsed, kill the guy
            if (FRAMES - this._popupTimeout > this.COUNTDOWN_FRAMES && this.snakebits.length < 2) {
                alert(`Actual answer : ${totalSum}`);
                refresh();
                this._popupTimeout = null;
                return;
            }
        }

        if (this.x > winW) {
            this.x = -this.w;
        }

        else if (this.x < -this.w) {
            this.x = winW;
        }

        else if (this.y > winH) {
            this.y = -this.h;
        }

        else if (this.y < -this.h) {
            this.y = winH;
        }

        if (this._currentbit) {
            if (distance([this.x, this.y], [this._currentbit.x, this._currentbit.y]) > this.w/2) {
                this.addBit();
            }

        } else {
            this.addBit();
        }

        this._updateBits();
    }

    _updateBits() {
        let undestroyed = [];
        for (let i=0; i < this.snakebits.length; i++) {
            let bit = this.snakebits[i];
            bit.updateMove();

            if (!bit.destroy) {
                undestroyed.push(bit);
            }
        }

        this.snakebits = undestroyed;

    }

    _drawBits() {
        for (let i=0; i < this.snakebits.length; i++) {
            this.snakebits[i].updateDraw();
        }
    }

    updateDraw() {
        fill(this.c);
        rect(this.x, this.y, this.w, this.h, 10);
        this._drawBits();

        if (!this.destroying) {
            this._updateEyes();
        }

        else {
            textSize(this.w*0.75); textAlign(LEFT);
            fill(0, 0, 0);

            text(this._textbox + "_", this.x + 5, this.y + 15 + this.h/2);

            fill(255, 255, 255);
            text(this._textbox + "_", this.x + 5, this.y + 10 + this.h/2);

            let countdownWidth = winW * ((FRAMES - this._popupTimeout) / this.COUNTDOWN_FRAMES) * 1.05;
            fill(this.c);
            rect(winW/2 - countdownWidth/2, 0, countdownWidth, 25, 10);
        }
    }

    // Function to update the funny little eyes
    // Bad code btw
    _updateEyes() {
        function drawEye(x, y, r) {
            fill(255);
            circle(x, y, r);
        }

        function drawPupil(x, y, r) {
            fill(1);
            circle(x, y, r*(13/30));
        }

        if (this._directionCase == "HORIZONTAL") {
            drawEye(this.x + this.w/2, this.y + (this.h/3), this._eyeR);
            drawEye(this.x + this.w/2, this.y + ((this.h/3)*2), this._eyeR);

            drawPupil(this.x + this.w/2, this.y + (this.h/3), this._eyeR);
            drawPupil(this.x + this.w/2, this.y + ((this.h/3)*2), this._eyeR);
        }

        else {
            drawEye(this.x + (this.w/3), this.y + this.h/2, this._eyeR);
            drawEye(this.x + ((this.w/3)*2), this.y + this.h/2, this._eyeR);

            drawPupil(this.x + (this.w/3), this.y + this.h/2, this._eyeR);
            drawPupil(this.x + ((this.w/3)*2), this.y + this.h/2, this._eyeR);
        }

        if (this._eyeR < this._eyeRdef) { this._eyeR++; }
        else if (this._eyeR > this._eyeRdef) { this._eyeR--; }

    }

    wideEyes(a) { this._eyeR = a; }

}


class Snakebit {
    SHRINK_DESTROY = false;

    constructor(pos, size) {
        this.x = pos[0];
        this.y = pos[1];

        this.w = size[0];
        this.h = size[1];

        this.c = player.c;

        this.lifetime = player.SNAKEBIT_LIFETIME;

        this._passed = false;

        this.destroying = false;
        this.destroy = false;
    }

    updateMove() {
        if (!this.destroying) {
            this.lifetime--;
            if (this.lifetime < 1) {
                this.destroying = true;
            }

            if (FRAMES % 4 == 0) {
                if (rectCollide(this, player)) {
                    if (this._passed && !player.destroying) {
                        player.kill();
                    }
                } else {
                    this._passed = true;
                }
            }
        }

        else {
            this.w -= 2;
            this.h -= 2;

            this.x += 1;
            this.y += 1;

            if (this.w < 2 || this.h < 2) {
                this.destroy = true;
            }
        }
    }

    updateDraw() {
        fill(this.c);
        rect(this.x, this.y, this.w, this.h, 10);
    }
}


function makeNumberYummle() {
    let pos = [randint(20, winW-250), randint(20, winH-250)];
    if (rectCollideList([pos[0], pos[1], 50, 50], [player.x, player.y, player.w, player.h])) {
        makeNumberYummle();
        return;
    }

    number = new Number(pos, [50, 50], randint(1, MAX_NUMBER_CHOICE));
}


class Number {
    constructor(pos, size, value) {
        this.x = pos[0];
        this.y = pos[1];
        this.w = size[0];
        this.h = size[1];

        for (let i=0; i < player.snakebits.length; i++) {
            if (rectCollide(this, player.snakebits[i])) {
                this.x = randint(20, winW-250);
                this.y = randint(20, winH-250);
            }
        }

        this.eaten = false;
        this.value = value;
    }

    updateMove() {
        if (!this.eaten) {
            if (rectCollide(this, player)) {
                let amt = 15;
                this.eaten = true;
                totalSum += this.value;

                this.x -= amt;
                this.y -= amt;
                this.w += amt*2;
                this.h += amt*2;

                player.wideEyes(40);
            }
        }

        if (this.eaten == true) {
            this.w -= 2;
            this.h -= 2;

            this.x += 1;
            this.y += 1;
        }
        if (this.w < 2 || this.h < 2) {
            makeNumberYummle();
            player.increaseLength();
        }
    }

    updateDraw() {
        // Rounded rectangle
        fill(35, 35, 135);
        rect(this.x, this.y, this.w, this.h, 10);

        textSize(this.w*0.75);
        textAlign(CENTER);
        fill(255, 255, 255);
        text(this.value, this.x + this.w/2, this.y + this.h/2 + 10);
    }
}


function setup() {
    winW = 800;
    winH = 600;
    let renderer = createCanvas(winW, winH);
    renderer.parent("gameCanvas");
    frameRate(60);

    refresh();
}

function refresh() {
    noStroke();
    totalSum = 0;
    player = new Player([50, 50], [50, 50], 6);
    number = new Number([50, 200], [50, 50], randint(1, MAX_NUMBER_CHOICE));
}


function draw() {
    background(175);

    number.updateMove();
    player.updateMove();

    number.updateDraw();
    player.updateDraw();

    FRAMES++;
}
