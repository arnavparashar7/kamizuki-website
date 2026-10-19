/**
 * KAMIZUKI : STAGE 1 GAME ENGINE
 * 2D Mario-Style Platformer Minigame set in The Fallen Shrine.
 * Features player physics, platforms, spirit orb collection, and Aka-Oni Boss Fight.
 */

class KamiZukiGameEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = false;
    this.isMuted = false;
    this.score = 0;
    this.orbsCollected = 0;
    this.totalOrbs = 8;
    this.playerHp = 100;
    this.maxHp = 100;

    // Player State
    this.player = {
      x: 80,
      y: 380,
      w: 36,
      h: 52,
      vx: 0,
      vy: 0,
      speed: 4.5,
      jumpForce: -11.5,
      grounded: false,
      facing: 'right',
      isAttacking: false,
      attackCooldown: 0,
      attackBox: { x: 0, y: 0, w: 45, h: 45 }
    };

    // Camera
    this.cameraX = 0;

    // Level Platforms (Fallen Shrine ruins)
    this.platforms = [
      { x: 0, y: 480, w: 2200, h: 60, type: 'ground' }, // Main ground floor
      { x: 260, y: 380, w: 180, h: 20 },
      { x: 500, y: 310, w: 160, h: 20 },
      { x: 720, y: 390, w: 200, h: 20 },
      { x: 980, y: 320, w: 220, h: 20 }, // Torii Gate platform
      { x: 1280, y: 370, w: 180, h: 20 },
      { x: 1520, y: 480, w: 680, h: 60 }  // Boss arena floor
    ];

    // Collectible Orbs
    this.orbs = [
      { x: 320, y: 330, collected: false },
      { x: 580, y: 260, collected: false },
      { x: 800, y: 340, collected: false },
      { x: 1040, y: 270, collected: false },
      { x: 1340, y: 320, collected: false },
      { x: 1600, y: 420, collected: false },
      { x: 1800, y: 420, collected: false },
      { x: 1950, y: 420, collected: false }
    ];

    // Boss Aka-Oni State
    this.boss = {
      x: 1850,
      y: 360,
      w: 80,
      h: 120,
      hp: 100,
      maxHp: 100,
      dir: -1,
      vx: 1.5,
      isHit: false,
      hitTimer: 0,
      active: true,
      defeated: false
    };

    // Input Keys
    this.keys = {
      left: false,
      right: false,
      up: false,
      attack: false
    };

    this.bindInputs();
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        this.keys.up = true;
        e.preventDefault();
      }
      if (e.key === 'j' || e.key === 'J' || e.key === 'z' || e.key === 'Z') {
        this.keys.attack = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') this.keys.up = false;
      if (e.key === 'j' || e.key === 'J' || e.key === 'z' || e.key === 'Z') this.keys.attack = false;
    });
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  reset() {
    this.player.x = 80;
    this.player.y = 380;
    this.player.vx = 0;
    this.player.vy = 0;
    this.playerHp = 100;
    this.score = 0;
    this.orbsCollected = 0;
    this.cameraX = 0;
    this.boss.hp = 100;
    this.boss.defeated = false;
    this.orbs.forEach(o => o.collected = false);
    this.start();
  }

  gameLoop(timestamp) {
    if (!this.isRunning) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  update(dt) {
    // Player Horizontal Movement
    if (this.keys.left) {
      this.player.vx = -this.player.speed;
      this.player.facing = 'left';
    } else if (this.keys.right) {
      this.player.vx = this.player.speed;
      this.player.facing = 'right';
    } else {
      this.player.vx *= 0.8;
    }

    // Jump
    if (this.keys.up && this.player.grounded) {
      this.player.vy = this.player.jumpForce;
      this.player.grounded = false;
    }

    // Gravity
    this.player.vy += 0.55;

    // Apply Position
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    // Platform Collision
    this.player.grounded = false;
    this.platforms.forEach(p => {
      if (this.player.x + this.player.w > p.x &&
          this.player.x < p.x + p.w &&
          this.player.y + this.player.h >= p.y &&
          this.player.y + this.player.h <= p.y + 20 &&
          this.player.vy >= 0) {
        this.player.y = p.y - this.player.h;
        this.player.vy = 0;
        this.player.grounded = true;
      }
    });

    // World Bounds
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > 2150) this.player.x = 2150;

    // Camera follow player
    this.cameraX = Math.max(0, Math.min(this.player.x - 250, 2200 - this.width));

    // Attack Mechanics
    if (this.keys.attack && this.player.attackCooldown <= 0) {
      this.player.isAttacking = true;
      this.player.attackCooldown = 0.35; // seconds
      this.checkAttackHit();
    }

    if (this.player.attackCooldown > 0) {
      this.player.attackCooldown -= dt;
      if (this.player.attackCooldown <= 0.2) {
        this.player.isAttacking = false;
      }
    }

    // Orbs Pickup
    this.orbs.forEach(orb => {
      if (!orb.collected &&
          Math.abs((this.player.x + 18) - orb.x) < 30 &&
          Math.abs((this.player.y + 26) - orb.y) < 30) {
        orb.collected = true;
        this.orbsCollected++;
        this.score += 250;
      }
    });

    // Update Boss Aka-Oni
    if (this.boss.active && !this.boss.defeated) {
      this.boss.x += this.boss.vx * this.boss.dir;
      if (this.boss.x < 1550 || this.boss.x > 2050) {
        this.boss.dir *= -1;
      }

      if (this.boss.isHit) {
        this.boss.hitTimer -= dt;
        if (this.boss.hitTimer <= 0) this.boss.isHit = false;
      }
    }
  }

  checkAttackHit() {
    if (!this.boss.active || this.boss.defeated) return;

    const attackX = this.player.facing === 'right' ? this.player.x + this.player.w : this.player.x - 45;
    const attackY = this.player.y;

    if (attackX + 45 > this.boss.x &&
        attackX < this.boss.x + this.boss.w &&
        attackY + 45 > this.boss.y &&
        attackY < this.boss.y + this.boss.h) {
      
      this.boss.hp -= 20;
      this.boss.isHit = true;
      this.boss.hitTimer = 0.25;

      if (this.boss.hp <= 0) {
        this.boss.hp = 0;
        this.boss.defeated = true;
        this.triggerVictory();
      }
    }
  }

  triggerVictory() {
    this.score += 2000;
    if (window.kamiZukiWeb3) {
      window.kamiZukiWeb3.recordBossDefeat();
    }
    if (window.onKamiZukiBossDefeated) {
      window.onKamiZukiBossDefeated();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.translate(-this.cameraX, 0);

    // 1. Draw Night Sky & Background Mountain Silhouette
    this.drawBackground();

    // 2. Draw Platforms (Wooden & Torii shrine style)
    this.drawPlatforms();

    // 3. Draw Spirit Orbs
    this.drawOrbs();

    // 4. Draw Boss Aka-Oni
    this.drawBoss();

    // 5. Draw Player Samurai
    this.drawPlayer();

    this.ctx.restore();

    // 6. Draw HUD (Health, Orbs, Score)
    this.drawHUD();
  }

  drawBackground() {
    // Gradient sky
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#0a0b12');
    skyGrad.addColorStop(1, '#1b1220');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(this.cameraX, 0, this.width, this.height);

    // Moon
    this.ctx.fillStyle = '#f5e8d0';
    this.ctx.beginPath();
    this.ctx.arc(this.cameraX + 750, 90, 45, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowColor = 'rgba(245, 232, 208, 0.4)';
    this.ctx.shadowBlur = 25;

    // Torii Gate Background Structure (x: 1000)
    this.ctx.fillStyle = '#800f1c';
    this.ctx.fillRect(980, 200, 20, 180);
    this.ctx.fillRect(1180, 200, 20, 180);
    this.ctx.fillRect(940, 210, 280, 24);
  }

  drawPlatforms() {
    this.platforms.forEach(p => {
      this.ctx.fillStyle = p.type === 'ground' ? '#181216' : '#2d1f22';
      this.ctx.fillRect(p.x, p.y, p.w, p.h);

      // Crimson top stroke
      this.ctx.fillStyle = '#c81c2e';
      this.ctx.fillRect(p.x, p.y, p.w, 4);
    });
  }

  drawOrbs() {
    this.orbs.forEach(orb => {
      if (orb.collected) return;
      this.ctx.fillStyle = '#e5384b';
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawPlayer() {
    const p = this.player;

    // Samurai Armor Body
    this.ctx.fillStyle = p.isAttacking ? '#f03e51' : '#1e2436';
    this.ctx.fillRect(p.x, p.y, p.w, p.h);

    // Samurai Scarf / Headband
    this.ctx.fillStyle = '#c81c2e';
    this.ctx.fillRect(p.x, p.y + 6, p.w, 10);

    // Glowing Katana Sword
    if (p.isAttacking) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#f03e51';
      this.ctx.shadowBlur = 15;
      const attackX = p.facing === 'right' ? p.x + p.w : p.x - 45;
      this.ctx.fillRect(attackX, p.y + 15, 45, 12);
      this.ctx.shadowBlur = 0;
    }
  }

  drawBoss() {
    if (!this.boss.active) return;
    const b = this.boss;

    this.ctx.fillStyle = b.isHit ? '#ffffff' : '#800f1c';
    this.ctx.fillRect(b.x, b.y, b.w, b.h);

    // Oni Horns
    this.ctx.fillStyle = '#d4af37';
    this.ctx.beginPath();
    this.ctx.moveTo(b.x + 15, b.y);
    this.ctx.lineTo(b.x + 25, b.y - 30);
    this.ctx.lineTo(b.x + 35, b.y);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(b.x + 45, b.y);
    this.ctx.lineTo(b.x + 55, b.y - 30);
    this.ctx.lineTo(b.x + 65, b.y);
    this.ctx.fill();

    // Boss Health Bar Above Head
    if (!b.defeated) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
      this.ctx.fillRect(b.x - 10, b.y - 45, b.w + 20, 10);
      this.ctx.fillStyle = '#c81c2e';
      this.ctx.fillRect(b.x - 10, b.y - 45, (b.w + 20) * (b.hp / b.maxHp), 10);
    }
  }

  drawHUD() {
    // Health Hearts
    this.ctx.fillStyle = '#f03e51';
    this.ctx.font = 'bold 18px sans-serif';
    this.ctx.fillText(`HEALTH: ❤❤❤❤❤`, 20, 35);

    // Orbs & Score
    this.ctx.fillStyle = '#f2e7d3';
    this.ctx.font = 'bold 16px "Space Grotesk", monospace';
    this.ctx.fillText(`SPIRIT ORBS: ${this.orbsCollected}/${this.totalOrbs}`, 220, 35);
    this.ctx.fillText(`SCORE: ${this.score}`, 420, 35);

    // Boss Defeated Victory Overlay
    if (this.boss.defeated) {
      this.ctx.fillStyle = 'rgba(10, 11, 18, 0.85)';
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ctx.fillStyle = '#f03e51';
      this.ctx.font = 'bold 42px "Cinzel Decorative", serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('勝利 : BOSS DEFEATED!', this.width / 2, this.height / 2 - 20);

      this.ctx.fillStyle = '#f2e7d3';
      this.ctx.font = '18px "Space Grotesk", monospace';
      this.ctx.fillText('STAGE 1 TRIAL COMPLETED. STAGE 3 TICKETS UNLOCKED!', this.width / 2, this.height / 2 + 30);
      this.ctx.textAlign = 'left';
    }
  }
}

window.KamiZukiGameEngine = KamiZukiGameEngine;
