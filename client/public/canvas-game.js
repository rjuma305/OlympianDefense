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

  const enemies = [];

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
    enemies.forEach((enemy, index) => {
      enemy.draw(ctx);
      console.log(`Enemy ${index}: (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})`);
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
