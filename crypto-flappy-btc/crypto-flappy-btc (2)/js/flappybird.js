const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

const btcImage = new Image();
btcImage.src = "assets/btc-coin.png";

const bird = {
  x: 60,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -12,
  velocity: 0,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 140;
let frame = 0;
let score = 0;

document.addEventListener("keydown", () => {
  bird.velocity = bird.lift;
});

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(frame * 0.05);
  ctx.drawImage(btcImage, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
  ctx.restore();
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 20;
    const bottomHeight = canvas.height - pipeGap - topHeight;
    pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
  }

  pipes.forEach(pipe => {
    pipe.x -= 3;
  });

  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }
}

function checkCollision() {
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    resetGame();
  }

  for (const pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      resetGame();
    }
  }
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
}

function drawScore() {
  ctx.fillStyle = "#eee";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();
  updatePipes();
  drawPipes();
  checkCollision();
  drawScore();

  frame++;
  requestAnimationFrame(loop);
}

loop();
