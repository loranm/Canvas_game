(function () {
  "use strict";
  window.addEventListener("DOMContentLoaded", onDomContentLoaded);

  function onDomContentLoaded() {
    const canvas = getCanvas();
    if (Boolean(canvas)) {
      addListeners(canvas);
      draw(canvas);
    }
  }

  function getCanvas() {
    return document.querySelector("#myGame");
  }

  function addListeners(canvas) {
    const events = {
      mouseOver: "mouseover",
      mouseOut: "mouseout",
      mouseLeave: "mouseleave",
    };
    let raf = null;

    canvas.addEventListener(events.mouseOver, onMouseOver);
    canvas.addEventListener(events.mouseLeave, onMouseLeave);

    function onMouseOver(evt) {
      raf = window.requestAnimationFrame(animate);
    }

    function onMouseLeave(evt) {
      window.cancelAnimationFrame(raf);
    }
  }

  function animate(evt) {
    console.log(evt);
  }

  function draw(canvas) {
    const context = canvas.getContext("2d");
    const playerBall = new Ball({ context });
    playerBall.draw();
  }
})();

class Ball {
  constructor({ size = 25, color = "blue", context }) {
    this.x = size;
    this.y = size;
    this.context = context;
    this.color = color;
    this.radius = size / 4;
  }

  speed = 2;
  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fillStyle = this.color;
    this.context.fill();
  }
}
