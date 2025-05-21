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
      const done = () => {
        this.sounds[key] = audio;
        resolve();
      };
      audio.addEventListener('canplaythrough', done, { once: true });
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

(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const assets = new AssetManager();

  const assetList = {
    images: {
      archer_walk: '/assets/images/archer_walk.png',
      tower_spartan: '/assets/images/tower_spartan.png',
      effect_explosion: '/assets/images/effect_explosion.png'
    },
    sounds: {
      sfx_archer_fire: '/assets/audio/sfx_archer_fire.mp3',
      sfx_enemy_death: '/assets/audio/sfx_enemy_death.mp3',
      music_background: '/assets/audio/music_background.mp3'
    }
  };

  const enemies = [];
  const towers = [];
  const effects = [];
  const enemySpeed = 100; // pixels per second
  const spawnInterval = 1000; // ms
  let lastSpawn = 0;
  let lastTime = 0;

  assets.loadAll(assetList).then(init);

  function init() {
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
        }
      }

      findTarget(enemies) {
        let closest = null;
        let distSq = this.range * this.range;
        for (const e of enemies) {
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
          assets.playSound('sfx_enemy_death');
          effects.push(new Explosion(target.x, target.y));
        }
      }
    }

    class Explosion {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 0.5; // seconds
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

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      towers.push(new Tower(x, y));
    });

    function spawnEnemy() {
      const y = Math.random() * canvas.height;
      enemies.push(new Enemy(-20, y, enemySpeed));
    }

    function update(dt, now) {
      if (performance.now() - lastSpawn > spawnInterval) {
        spawnEnemy();
        lastSpawn = performance.now();
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(dt);
        if (!enemy.alive) {
          enemies.splice(i, 1);
          continue;
        }
        if (enemy.x - 20 > canvas.width) {
          enemies.splice(i, 1);
        }
      }

      for (const tower of towers) {
        tower.attemptFire(now / 1000, enemies);
      }

      for (let i = effects.length - 1; i >= 0; i--) {
        const fx = effects[i];
        fx.update(dt);
        if (fx.life <= 0) effects.splice(i, 1);
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      enemies.forEach((enemy, index) => {
        enemy.draw(ctx);
        console.log(`Enemy ${index}: (${enemy.x.toFixed(2)}, ${enemy.y.toFixed(2)})`);
      });
      towers.forEach(t => t.draw(ctx));
      effects.forEach(fx => fx.draw(ctx));
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
  }
})();
