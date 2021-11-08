var snake;

var winW;
var winH;

class SnakeBit {
    constructor(parent) {

        function oneAbs(i) {
            if (i == 0) {
                return 0;
            }

            return Math.abs(i) / i;

        }

        this.PARENT = parent;

        let push = (this.PARENT.snakebits.length + 1) * -1;

        let xmove = (oneAbs(this.PARENT.vel[0]) * this.PARENT.w * push);
        let ymove = (oneAbs(this.PARENT.vel[1]) * this.PARENT.h * push);

        let lastSnake = this.PARENT.snakebits[-1];

        this.x = lastSnake.x + xmove;
        this.y = lastSnake.y + ymove;

        this.w = this.PARENT.w;
        this.h = this.PARENT.h;
    }

    updateMove() {
        this.x += this.PARENT.vel[0];
        this.y += this.PARENT.vel[1];
    }

    updateDraw() {
        fill(135, 35, 35);
        rect(this.x, this.y, this.w, this.h);
    }

}


class SnakeHead {
    constructor(pos, size, speed) {
        this.x = pos[0];
        this.y = pos[1];

        this.w = size[0];
        this.h = size[1];

        this.speed = speed;
        this.vel = [0, 0];

        this.snakebits = [];

        this.makeBuffer = false;
    }

    addSnakebit() {
        let newBit = new SnakeBit(this)
        this.snakebits.push(newBit);
    }

    updateMove() {
        let oldX = this.x;
        let oldY = this.y;

        if (keyIsDown(LEFT_ARROW)) {
            this.vel = [-this.speed, 0];
        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.vel = [this.speed, 0];
        }

        if (keyIsDown(UP_ARROW)) {
            this.vel = [0, -this.speed];
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.vel = [0, this.speed];
        }

        if (keyIsDown(SHIFT) && this.makeBuffer == false) {
            this.makeBuffer = true;
            this.addSnakebit();

        } else if (!keyIsDown(SHIFT)) { this.makeBuffer = false; }

        this.x += this.vel[0];
        this.y += this.vel[1];

        // if (this.x < 0 || this.x + this.w > winW) {
        //     this.x = oldX;
        // }
        //
        // if (this.y < 0 || this.y + this.h > winH) {
        //     this.y = oldY;
        // }

        for (let bit of this.snakebits) {
            bit.updateMove();
            bit.updateDraw();
        }

    }

    updateDraw() {
        fill(135, 35, 35);
        rect(this.x, this.y, this.w, this.h);
    }
}

function setup() {
    winW = windowWidth-100;
    winH = windowHeight-100;

    createCanvas(winW, winH);
    noStroke();
    snake = new SnakeHead([50, 50], [50, 50], 7);
}

function draw() {
    background(175);
    snake.updateMove();
    snake.updateDraw();
}
