class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  update(dt) {
    this.x += this.speed * dt;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 100;
  }

  update(enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= this.range) {
        enemies.splice(i, 1);
        tribute += 5;
        updateHUD();
        break;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
  }
}

(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const enemies = [];
  const towers = [];

  const enemySpeed = 100; // pixels per second
  const spawnInterval = 1000; // ms
  let lastSpawn = 0;
  let lastTime = 0;

  let running = false;
  let tribute = 100;
  const tributeDisplay = document.getElementById('tributeDisplay');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');

  function updateHUD() {
    tributeDisplay.textContent = `Tribute: ${tribute}`;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('click', (e) => {
    if (tribute < 20) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    towers.push(new Tower(x, y));
    tribute -= 20;
    updateHUD();
  });

  function spawnEnemy() {
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(-20, y, enemySpeed));
  }

  function update(dt) {
    // spawn new enemy
    if (performance.now() - lastSpawn > spawnInterval) {
      spawnEnemy();
      lastSpawn = performance.now();
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update(dt);
      if (enemy.x - 20 > canvas.width) {
        enemies.splice(i, 1);
      }
    }

    towers.forEach(tower => tower.update(enemies));
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemies.forEach((enemy, index) => {
      enemy.draw(ctx);
      console.log(`Enemy ${index}: (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})`);
    });
    towers.forEach(t => t.draw(ctx));
  }

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (running) {
      update(dt);
      render();
    }
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);

  updateHUD();

  function startGame() {
    if (!running) {
      running = true;
    }
  }

  function pauseGame() {
    running = false;
  }

  function restartGame() {
    enemies.length = 0;
    towers.length = 0;
    tribute = 100;
    updateHUD();
    lastSpawn = 0;
    lastTime = 0;
    running = true;
  }

  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', pauseGame);
  restartBtn.addEventListener('click', restartGame);
})();
