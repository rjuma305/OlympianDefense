class AssetManager {
  constructor() {
    this.images = {};
    this.sounds = {};
  }

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images[key] = img;
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  loadSound(key, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.addEventListener('canplaythrough', () => {
        this.sounds[key] = audio;
        resolve();
      }, { once: true });
      audio.onerror = reject;
    });
  }

  loadAll({ images = {}, sounds = {} }) {
    const tasks = [];
    for (const [k, src] of Object.entries(images)) tasks.push(this.loadImage(k, src));
    for (const [k, src] of Object.entries(sounds)) tasks.push(this.loadSound(k, src));
    return Promise.all(tasks);
  }

  getImage(key) {
    return this.images[key];
  }

  getSound(key) {
    return this.sounds[key];
  }

  playSound(key) {
    const base = this.getSound(key);
    if (base) {
      const clone = base.cloneNode();
      clone.play().catch(() => {});
    }
  }
}

(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const tributeDisplay = document.getElementById('tributeDisplay');
  const waveNumberDisplay = document.getElementById('waveNumber');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');

  const assets = new AssetManager();

  const assetList = {
    images: {
      archer_walk: '/assets/images/enemies/archer_walk_strip.png',
      tower_spartan: '/assets/images/towers/tower_spartan.png',
      effect_explosion: '/assets/images/effects/effect_explosion_strip.png'
    },
    sounds: {
      sfx_archer_fire: '/assets/audio/sfx/sfx_archer_fire.wav',
      sfx_enemy_death: '/assets/audio/sfx/sfx_enemy_death.wav',
      music_background: '/assets/audio/music/music_background_epic.mp3'
    }
  };

  const enemies = [];
  const towers = [];
  const effects = [];

  let tribute = 100;
  let running = false;

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

  function updateHUD() {
    tributeDisplay.textContent = `Tribute: ${tribute}`;
    if (waveNumberDisplay) waveNumberDisplay.textContent = `Wave: ${waveNumber}`;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  assets.loadAll(assetList).then(() => {
    const bg = assets.getSound('music_background');
    if (bg) {
      bg.loop = true;
      bg.volume = 0.4;
      bg.play().catch(() => {});
    }

    class Enemy {
      constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
      }

      update(dt) {
        this.x += this.speed * dt;
      }

      draw(ctx) {
        const img = assets.getImage('archer_walk');
        if (img) {
          ctx.drawImage(img, this.x - 20, this.y - 20, 40, 40);
        } else {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    class Tower {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 150;
        this.cooldown = 0.5;
        this.lastShot = 0;
      }

      draw(ctx) {
        const img = assets.getImage('tower_spartan');
        if (img) {
          ctx.drawImage(img, this.x - 20, this.y - 20, 40, 40);
        } else {
          ctx.fillStyle = 'blue';
          ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
        }
      }

      findTarget(enemies) {
        let closest = null;
        let distSq = this.range * this.range;
        for (const e of enemies) {
          if (!e.alive) continue;
          const dx = e.x - this.x;
          const dy = e.y - this.y;
          const d = dx * dx + dy * dy;
          if (d <= distSq) {
            distSq = d;
            closest = e;
          }
        }
        return closest;
      }

      attemptFire(time, enemies) {
        if (time - this.lastShot < this.cooldown) return;
        const target = this.findTarget(enemies);
        if (target) {
          this.lastShot = time;
          assets.playSound('sfx_archer_fire');
          target.alive = false;
          tribute += 5;
          updateHUD();
          assets.playSound('sfx_enemy_death');
          effects.push(new Explosion(target.x, target.y));
        }
      }
    }

    class Explosion {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 0.5;
      }

      update(dt) {
        this.life -= dt;
      }

      draw(ctx) {
        const img = assets.getImage('effect_explosion');
        if (img) {
          ctx.drawImage(img, this.x - 20, this.y - 20, 40, 40);
        }
      }
    }

    canvas.addEventListener('click', (e) => {
      if (tribute < 20) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 50) * 50 + 25;
      const y = Math.floor((e.clientY - rect.top) / 50) * 50 + 25;
      towers.push(new Tower(x, y));
      tribute -= 20;
      updateHUD();
    });

    function spawnEnemy(speed) {
      const y = Math.random() * canvas.height;
      enemies.push(new Enemy(-20, y, speed));
    }

    function update(dt, now) {
      const timeNow = performance.now();

      if (timeNow > nextWaveTime) {
        waveNumber++;
        enemiesToSpawn = baseEnemyCount + (waveNumber - 1) * 2;
        currentEnemySpeed = baseEnemySpeed * (1 + (waveNumber - 1) * 0.2);
        spawnedThisWave = 0;
        nextWaveTime = timeNow + 30000;
        updateHUD();
      }

      if (spawnedThisWave < enemiesToSpawn && timeNow - lastSpawn > spawnInterval) {
        spawnEnemy(currentEnemySpeed);
        spawnedThisWave++;
        lastSpawn = timeNow;
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(dt);
        if (!enemy.alive || enemy.x - 20 > canvas.width) {
          enemies.splice(i, 1);
        }
      }

      towers.forEach(tower => tower.attemptFire(now / 1000, enemies));

      for (let i = effects.length - 1; i >= 0; i--) {
        const fx = effects[i];
        fx.update(dt);
        if (fx.life <= 0) effects.splice(i, 1);
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      enemies.forEach(enemy => enemy.draw(ctx));
      towers.forEach(t => t.draw(ctx));
      effects.forEach(fx => fx.draw(ctx));
    }

    function gameLoop(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      if (running) {
        update(dt, timestamp);
        render();
      }
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

    updateHUD();

    function startGame() {
      running = true;
    }

    function pauseGame() {
      running = false;
    }

    function restartGame() {
      enemies.length = 0;
      towers.length = 0;
      effects.length = 0;
      waveNumber = 1;
      tribute = 100;
      spawnedThisWave = 0;
      lastSpawn = 0;
      lastTime = 0;
      currentEnemySpeed = baseEnemySpeed;
      nextWaveTime = performance.now() + 30000;
      running = true;
      updateHUD();
    }

    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    restartBtn.addEventListener('click', restartGame);
  });
})();
