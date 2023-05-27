const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

canvas.width = 900;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

let otherPlayer = { x: 0, y: 0, xvelocity: 0, yvelocity: 0, charcolor: "blue" };

const width = 20;
let x = 0;
let y = 0;
let xvelocity = 0;
let yvelocity = 0;
const color = "hsla(" + Math.random() * 360 + ", 100%, 50%, 1)";

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
};

const fps = 60;
let now = window.performance.now();
let before = now;
let interval = 1000 / fps;
let elapsed = 0;

const update = () => {
    x += xvelocity;
    y += yvelocity;
    if (y > canvas.height - width) {
        y = canvas.height - width;
    }
    if (x > canvas.width - width) {
        x = canvas.width - width;
        xvelocity *= -1;
    } else if (x < 0) {
        x = 0;
        xvelocity *= -1;
    }
    socket.emit("player update", {
        x: x,
        y: y,
        xvelocity: xvelocity,
        yvelocity: yvelocity,
        charcolor: color,
    });
};
const condUpdate = (currTime) => {
    now = currTime;
    elapsed = now - before;
    if (elapsed > interval) {
        update();
        before = now - (elapsed % interval); // come back to this and make sure we understand what it is doing completely
    }
};

const setVelocity = () => {
    if (y >= canvas.height - width) {
        if (yvelocity > 1) {
            yvelocity = -1 * (yvelocity - 1);
        } else {
            yvelocity = 0;
        }

        if (y >= canvas.height - width - 5 && keys.w.pressed) {
            yvelocity -= 5;
        }
    } else {
        yvelocity += 0.1;
        yvelocity = Math.min(yvelocity, 7);
        if (y < 0) {
            y = 0;
            yvelocity *= -1;
        }
    }
    if (keys.a.pressed) {
        xvelocity = -2;
    }
    if (keys.d.pressed) {
        xvelocity = 2;
    }
};

const drawSquare = (x, y, xvelocity, yvelocity, width, col) => {
    c.strokeStyle = col;

    c.strokeRect(x, y, width, width);

    // c.strokeRect(x+width/4-3*xvelocity, y+width/4-3*yvelocity, width/2, width/2);
    // c.strokeRect(x+width/2 -(width/8), y+width/2 -(width/8), width/4, width/4);

    for (let i = 1; i < 4; ++i) {
        const scale = i * 2;
        const chordScale = scale * 2;
        const offset = i * 2;
        c.strokeRect(
            x + width / 2 - width / chordScale - offset * xvelocity,
            y + width / 2 - width / chordScale - offset * yvelocity,
            width / scale,
            width / scale
        );
    }
};

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    condUpdate(window.performance.now());
    // c.fillStyle = "red";
    // c.fillRect(x, y, width, width);
    drawSquare(x, y, xvelocity, yvelocity, width, color);
    drawSquare(otherPlayer.x,otherPlayer.y,otherPlayer.xvelocity,otherPlayer.yvelocity,width,otherPlayer.charcolor);
    setVelocity();
}

animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "a":
            keys.a.pressed = true;
            break;
        case "d":
            keys.d.pressed = true;
            break;
        case "w":
            keys.w.pressed = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            keys.a.pressed = false;
            break;
        case "d":
            keys.d.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;
    }
});


socket.on("player update", function (msg) {
    otherPlayer = msg;
});
