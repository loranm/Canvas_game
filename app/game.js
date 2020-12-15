(function () {
  "use strict";
  window.addEventListener("DOMContentLoaded", onDomContentLoaded);

  let canvas = undefined;
  let game = {};
  let raf = undefined;

  let startButton = undefined;

  function onDomContentLoaded() {
    canvas = getCanvas();
    setStartButton();

    if (Boolean(canvas)) {
      setGame(canvas);
      addListeners(canvas);
    }
  }

  function setGame(canvas) {
    game = new Game({ canvas });
  }

  function setStartButton() {
    startButton = document.querySelector("#startGame");
    startButton.onclick = onStartButtonClicked;
  }

  function onStartButtonClicked() {
    game.switchState();
    if (!game.started) {
      manageAnimationFrame(game.started);
    } else {
      manageAnimationFrame(game.started);
    }
  }

  function draw() {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    game.animate();
    manageAnimationFrame(game.started);
  }

  function manageAnimationFrame(started) {
    if (started) {
      raf = window.requestAnimationFrame(draw);
    } else {
      window.cancelAnimationFrame(raf);
    }
  }

  function getCanvas() {
    const canvas = document.querySelector("#myGame");
    setCanvasSize(canvas);
    return canvas;
  }

  function setCanvasSize(canvas) {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.5;
  }

  function addListeners(canvas) {
    const events = {
      keyDown: "keydown",
      keyUp: "keyup",
      resize: "resize",
    };

    window.addEventListener(events.keyDown, onKeyDown);
    window.addEventListener(events.keyUp, onKeyUp);
    window.addEventListener(events.resize, onWindowResize);

    function onKeyDown(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      movePlayerBall(evt);
    }

    function onKeyUp(evt) {
      // TODO: implements key yup
    }

    function onWindowResize(evt) {
      setCanvasSize(canvas);
    }
  }

  function movePlayerBall(evt) {
    game.movePlayerBall(evt);
  }
})();

class Ball {
  constructor({
    positionX,
    positionY,
    color = "blue",
    radius = 25,
    speedX = 5,
    speedY = 5,
    context,
  }) {
    this.x = positionX;
    this.y = positionY;
    this.context = context;
    this.color = color;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  animate() {
    const minHeight = 0;
    const minWidth = 0;
    const maxHeight = this.context.canvas.clientHeight;
    const maxWidth = this.context.canvas.clientWidth;
    const nextPositionX = this.x + this.speedX;
    const nextPositionY = this.y + this.speedY;

    if (nextPositionX > maxWidth || nextPositionX < minWidth) {
      this.speedX = -this.speedX;
    }
    if (nextPositionY > maxHeight || nextPositionY < minHeight) {
      this.speedY = -this.speedY;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.draw();
  }
}

class PlayerBall extends Ball {
  direction = undefined;
  directions = {
    left: "left",
    right: "right",
    up: "up",
    down: "down",
  };

  move(evt) {
    this.direction = this.getDirection(evt);
    if (this.direction) {
      this.animate();
    }
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
        break;

      default:
        break;
    }
    this.draw();
  }

  getDirection(evt) {
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
}

class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.createEnemyBall();
    this.createPlayerBall();
  }
  color = getComputedStyle(document.documentElement).getPropertyValue(
    "--primary"
  );

  started = false;
  enemyBalls = [];
  playerBall = {};

  switchState() {
    this.started = !this.started;
    this.animate();
    // this.enemyBalls.forEach((ball) => ball.animate());
  }

  createPlayerBall() {
    const playerBallOptions = {
      positionX: this.canvas.width / 2,
      positionY: this.canvas.height / 2,
      color: this.color,
      context: this.context,
    };
    this.playerBall = new PlayerBall(playerBallOptions);
  }

  createEnemyBall() {
    const ballOptions = {
      positionX: 100,
      positionY: 100,
      color: "red",
      context: this.context,
    };
    const ball2Options = {
      positionX: 50,
      positionY: 10,
      radius: 5,
      color: "green",
      context: this.context,
    };
    const ball = new Ball(ballOptions);
    const ball2 = new Ball(ball2Options);
    this.enemyBalls = [...this.enemyBalls, ball, ball2];
  }

  animate() {
    this.enemyBalls.forEach((ball) => ball.animate());
    this.playerBall.animate();
  }

  movePlayerBall(evt) {
    if (this.started) {
      this.playerBall.move(evt);
    }
  }
}
