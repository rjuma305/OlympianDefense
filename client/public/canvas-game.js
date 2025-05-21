class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = true;
    this.health = 3;
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

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.isActive = false;
    }
  }
}

class Tower {
  constructor(x, y, range, damage) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.cooldown = 500; // ms
    this.lastShot = 0;
    this.target = null;
    this.firing = false;
  }

  draw(ctx) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
    if (this.firing && this.target && this.target.isActive) {
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.stroke();
    }
  }

  findTarget(enemies) {
    let closest = null;
    let minDist = Infinity;
    for (const enemy of enemies) {
      if (!enemy.isActive) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= this.range && dist < minDist) {
        closest = enemy;
        minDist = dist;
      }
    }
    this.target = closest;
  }

  attemptFire(currentTime) {
    if (!this.target || !this.target.isActive) {
      this.firing = false;
      return;
    }
    if (currentTime - this.lastShot >= this.cooldown) {
      this.lastShot = currentTime;
      this.target.takeDamage(this.damage);
      this.firing = true;
    } else {
      this.firing = false;
    }
  }
}

(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const hudWave = document.getElementById('waveNumber');

  const enemies = [];
  const towers = [];

  const baseEnemySpeed = 100;
  const baseEnemyCount = 5;
  const spawnInterval = 1000;
  let lastSpawn = 0;

  let lastTime = 0;
  let waveNumber = 1;
  let enemiesToSpawn = baseEnemyCount;
  let spawnedThisWave = 0;
  let currentEnemySpeed = baseEnemySpeed;
  let nextWaveTime = performance.now() + 30000;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 50) * 50 + 25;
    const y = Math.floor((e.clientY - rect.top) / 50) * 50 + 25;
    towers.push(new Tower(x, y, 150, 1));
  });

  function spawnEnemy(speed) {
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(-20, y, speed));
  }

  function update(dt, currentTime) {
    const now = performance.now();

    // Handle wave timer
    if (now > nextWaveTime) {
      waveNumber++;
      if (hudWave) hudWave.textContent = waveNumber;
      enemiesToSpawn = baseEnemyCount + (waveNumber - 1) * 2;
      currentEnemySpeed = baseEnemySpeed * (1 + (waveNumber - 1) * 0.2);
      spawnedThisWave = 0;
      nextWaveTime = now + 30000;
    }

    // Spawn enemies
    if (spawnedThisWave < enemiesToSpawn && now - lastSpawn > spawnInterval) {
      spawnEnemy(currentEnemySpeed);
      spawnedThisWave++;
      lastSpawn = now;
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (enemy.isActive) {
        enemy.update(dt);
        if (enemy.x - 20 > canvas.width) {
          enemies.splice(i, 1);
        }
      } else {
        enemies.splice(i, 1); // remove dead
      }
    }

    // Towers fire
    towers.forEach((tower) => {
      tower.findTarget(enemies);
      tower.attemptFire(currentTime);
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemies.forEach((enemy) => enemy.draw(ctx));
    towers.forEach((tower) => tower.draw(ctx));
  }

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt, timestamp);
    render();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();
