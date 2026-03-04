const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

const birdImg = new Image();
birdImg.src = 'your-face.png'; // upload your image to repo as your-face.png

let bird = { x: 80, y: 200, size: 50, vy: 0, gravity: 0.4, jump: -8 };
let pipes = [];
let score = 0;
let gameOver = true;
let started = false;

function spawnPipe() {
  const gap = 140;
  const minH = 80;
  const h = minH + Math.random() * (canvas.height - gap - minH * 2);
  pipes.push({ x: canvas.width, top: h - canvas.height, bottom: h + gap });
}

function update() {
  if (!started || gameOver) return;

  bird.vy += bird.gravity;
  bird.y += bird.vy;

  if (bird.y + bird.size > canvas.height || bird.y < 0) gameOver = true;

  pipes.forEach((p, i) => {
    p.x -= 2;
    if (p.x + 60 < 0) pipes.splice(i, 1);

    // collision
    if (
      bird.x + bird.size > p.x &&
      bird.x < p.x + 60 &&
      (bird.y < p.top + canvas.height || bird.y + bird.size > p.bottom)
    ) gameOver = true;

    if (p.x + 60 < bird.x && !p.scored) {
      score++;
      p.scored = true;
      document.getElementById('score').textContent = score;
    }
  });

  if (pipes.length === 0 || pipes[pipes.length-1].x < canvas.width - 180) spawnPipe();
}

function draw() {
  ctx.fillStyle = '#71c5cf';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ground
  ctx.fillStyle = '#5ee270';
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  // bird
  if (birdImg.complete) {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.size, bird.size);
  } else {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
  }

  // pipes
  ctx.fillStyle = '#569454';
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, 60, p.top + canvas.height);
    ctx.fillRect(p.x, p.bottom, 60, canvas.height);
  });

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', 60, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Click to restart', 70, canvas.height / 2 + 40);
  }
}

function reset() {
  bird.y = 200;
  bird.vy = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  document.getElementById('score').textContent = '0';
  document.getElementById('start').style.display = 'none';
}

function flap() {
  if (!started) {
    started = true;
    document.getElementById('start').style.display = 'none';
  }
  if (!gameOver) bird.vy = bird.jump;
  else reset();
}

document.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); flap(); } });
canvas.addEventListener('click', flap);

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

birdImg.onload = () => { spawnPipe(); loop(); };
if (!birdImg.complete) loop(); // fallback
