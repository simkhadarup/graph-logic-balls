const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 450;

const COLORS = ["red", "blue", "green"];
const BALL_COUNT = 14;

let balls = [];
let score = 0;
let magnetStrength = 0.0025;

const scoreEl = document.getElementById("score");
const slider = document.getElementById("strength");
const valueEl = document.getElementById("value");

slider.addEventListener("input", () => {
  magnetStrength = slider.value * 0.0005;
  valueEl.textContent = slider.value;
});

class Ball {
  constructor() {
    this.radius = 10;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.colorIndex = Math.floor(Math.random() * COLORS.length);
  }

  get color() {
    return COLORS[this.colorIndex];
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < this.radius || this.x > canvas.width - this.radius) {
      this.dx *= -1;
    }
    if (this.y < this.radius || this.y > canvas.height - this.radius) {
      this.dy *= -1;
    }
  }

  changeColor() {
    this.colorIndex = (this.colorIndex + 1) % COLORS.length;
  }
}

// Distance helper
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

//  GRAPH LOGIC INTERACTION
function logicInteraction() {
  let newScore = 0;

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let d = dist(balls[i], balls[j]);

      if (d < 120) {
        // draw graph edge
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.strokeStyle = balls[i].color === balls[j].color
          ? "rgba(255,255,255,0.3)"
          : "rgba(255,255,255,0.1)";
        ctx.stroke();

        // LOGIC RULE
        let force = magnetStrength;
        if (balls[i].color === balls[j].color) {
          balls[i].dx += (balls[j].x - balls[i].x) * force;
          balls[i].dy += (balls[j].y - balls[i].y) * force;
          newScore++;
        } else {
          balls[i].dx -= (balls[j].x - balls[i].x) * force;
          balls[i].dy -= (balls[j].y - balls[i].y) * force;
        }
      }
    }
  }

  score = newScore;
  scoreEl.textContent = score;
}

//  CLICK TO CHANGE COLOR
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  balls.forEach(ball => {
    if (dist(ball, { x: mx, y: my }) < ball.radius) {
      ball.changeColor();
    }
  });
});

//  MAIN LOOP
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  logicInteraction();

  balls.forEach(ball => {
    ball.move();
    ball.draw();
  });

  requestAnimationFrame(animate);
}

// Init
for (let i = 0; i < BALL_COUNT; i++) {
  balls.push(new Ball());
}

animate();
