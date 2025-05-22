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

(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const hudWave = document.getElementById('waveNumber');

  const GRID_SIZE = 50;
  const DEBUG = false; // set true to enable logs
  const DRAW_GRID = false; // set true to show placement grid

  class Tower {
    constructor(gridX, gridY) {
      this.gridX = gridX;
      this.gridY = gridY;
    }

    draw(ctx) {
      const x = this.gridX * GRID_SIZE + GRID_SIZE / 2;
      const y = this.gridY * GRID_SIZE + GRID_SIZE / 2;
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(x, y, GRID_SIZE / 2 - 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const enemies = [];
  const towers = [];

  const baseEnemySpeed = 100; // starting speed (pixels/second)
  const baseEnemyCount = 5;   // enemies in the first wave

  const spawnInterval = 1000; // ms between spawns
  let lastSpawn = 0;

  let lastTime = 0;

  let waveNumber = 1;
  let enemiesToSpawn = baseEnemyCount;
  let spawnedThisWave = 0;
  let currentEnemySpeed = baseEnemySpeed;
  let nextWaveTime = performance.now() + 30000; // 30s between waves

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function attemptPlaceTower(gx, gy) {
    const maxX = Math.floor(canvas.width / GRID_SIZE);
    const maxY = Math.floor(canvas.height / GRID_SIZE);
    if (gx < 0 || gy < 0 || gx >= maxX || gy >= maxY) {
      if (DEBUG) console.log('Out of bounds', gx, gy);
      return false;
    }
    if (towers.some(t => t.gridX === gx && t.gridY === gy)) {
      if (DEBUG) console.log('Tower exists at', gx, gy);
      return false;
    }
    towers.push(new Tower(gx, gy));
    if (DEBUG) console.log('Placed tower at', gx, gy);
    return true;
  }

  function onCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gx = Math.floor(x / GRID_SIZE);
    const gy = Math.floor(y / GRID_SIZE);
    attemptPlaceTower(gx, gy);
  }

  canvas.addEventListener('click', onCanvasClick);

  function spawnEnemy(speed) {
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(-20, y, speed));
  }

  function update(dt) {
    const now = performance.now();

    // start next wave
    if (now > nextWaveTime) {
      waveNumber++;
      if (hudWave) hudWave.textContent = waveNumber;
      enemiesToSpawn = baseEnemyCount + (waveNumber - 1) * 2;
      currentEnemySpeed = baseEnemySpeed * (1 + (waveNumber - 1) * 0.2);
      spawnedThisWave = 0;
      nextWaveTime = now + 30000;
    }

    // spawn enemies for current wave
    if (spawnedThisWave < enemiesToSpawn && now - lastSpawn > spawnInterval) {
      spawnEnemy(currentEnemySpeed);
      spawnedThisWave++;
      lastSpawn = now;
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update(dt);
      if (enemy.x - 20 > canvas.width) {
        enemies.splice(i, 1);
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (DRAW_GRID) {
      ctx.strokeStyle = '#555';
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    towers.forEach(t => t.draw(ctx));

    enemies.forEach((enemy, index) => {
      enemy.draw(ctx);
      if (DEBUG) console.log(`Enemy ${index}: (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})`);
    });
  }

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    update(dt);
    render();
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();
