(function () {
  "use strict";
  window.addEventListener("DOMContentLoaded", onDomContentLoaded);

  let canvas = undefined;
  let game = undefined;
  let playerBall = undefined;
  let raf = undefined;

  let startButton = undefined;

  function onDomContentLoaded() {
    canvas = getCanvas();
    game = new Game();
    setStartButton();

    if (Boolean(canvas)) {
      addListeners(canvas);
      draw(canvas);
    }
  }

  function setStartButton() {
    startButton = document.querySelector("#startGame");
    startButton.onclick = onStartButtonClicked;
  }

  function onStartButtonClicked(evt) {
    game.started = true;
    console.log(game);
  }

  function getCanvas() {
    return document.querySelector("#myGame");
  }

  function addListeners() {
    const events = {
      keyDown: "keydown",
      keyUp: "keyup",
    };

    window.addEventListener(events.keyDown, onKeyDown);
    window.addEventListener(events.keyUp, onKeyUp);

    function onKeyDown(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      movePlayerBall(evt);
    }

    function onKeyUp(evt) {
      // TODO: implements key yup
    }
  }

  function movePlayerBall(evt) {
    playerBall.move(evt);
    animate();
  }

  function animate() {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    playerBall.draw();
    manageAnimationFrame(true);
  }

  function draw(canvas) {
    const context = canvas.getContext("2d");
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      "--primary"
    );

    playerBall = new Ball({ positionX: 100, color, positionY: 100, context });
    game.playerBall = new Ball({
      positionX: 100,
      color,
      positionY: 100,
      context,
    });
    playerBall.draw();
  }

  function manageAnimationFrame(started) {
    if (started) {
      raf = window.requestAnimationFrame(animate);
    } else {
      window.cancelAnimationFrame(raf);
    }
  }
})();

class Ball {
  constructor({ positionX, positionY, color = "blue", context }) {
    this.x = positionX;
    this.y = positionY;
    this.context = context;
    this.color = color;
  }
  speedX = 2;
  speedY = 2;
  radius = 4;
  direction = undefined;
  directions = {
    left: "left",
    right: "right",
    up: "up",
    down: "down",
  };

  setDirection(evt) {
    const codes = {
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp",
      down: "ArrowDown",
    };

    switch (evt.code) {
      case codes.left:
        return this.directions.left;

      case codes.right:
        return this.directions.right;

      case codes.up:
        return this.directions.up;

      case codes.down:
        return this.directions.down;

      default:
        return;
    }
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  animate() {
    switch (this.direction) {
      case this.directions.left:
        this.x -= this.speedX;
        break;

      case this.directions.right:
        this.x += this.speedX;
        break;

      case this.directions.up:
        this.y -= this.speedY;
        break;

      case this.directions.down:
        this.y += this.speedY;

      default:
        break;
    }

    // const minHeight = 0;
    // const minWidth = 0;
    // const maxHeight = this.context.canvas.clientHeight;
    // const maxWidth = this.context.canvas.clientWidth;
    // const nextPositionX = this.x + this.speedX;
    // const nextPositionY = this.y + this.speedY;

    // if (nextPositionX > maxWidth || nextPositionX < minWidth) {
    //   this.speedX = -this.speedX;
    // }
    // if (nextPositionY > maxHeight || nextPositionY < minHeight) {
    //   this.speedY = -this.speedY;
    // }

    // this.x += this.speedX;
    // this.y += this.speedY;
    this.draw();
  }

  move(evt) {
    this.direction = this.setDirection(evt);
    this.animate();
  }
}

class Game {
  started = false;
  playerBall = {};
}
