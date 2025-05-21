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
  constructor(x, y, range, damage) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.cooldown = 500; // ms between shots
    this.lastShot = 0;
    this.target = null;
    this.firing = false;
  }

  draw(ctx) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
    if (this.firing && this.target) {
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
    if (!this.target) {
      this.firing = false;
      return;
    }
    if (currentTime - this.lastShot >= this.cooldown) {
      this.lastShot = currentTime;
      this.firing = true;
    } else {
      this.firing = false;
    }
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

  function spawnEnemy() {
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(-20, y, enemySpeed));
  }

  function update(dt, timestamp) {
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

    towers.forEach((tower) => {
      tower.findTarget(enemies);
      tower.attemptFire(timestamp);
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemies.forEach((enemy, index) => {
      enemy.draw(ctx);
      console.log(`Enemy ${index}: (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})`);
    });
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
