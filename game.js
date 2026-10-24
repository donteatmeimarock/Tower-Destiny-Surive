// ==========================================
// TOWER DESTINY SURVIVE - MAIN ENGINE
// ==========================================

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.coinDisplay = document.getElementById('coin-display');
    this.waveDisplay = document.getElementById('wave-display');
    this.towerHpBar = document.getElementById('tower-hp-bar');
    this.towerHpText = document.getElementById('tower-hp-text');
    this.crateSlotsContainer = document.getElementById('crate-slots-container');
    this.weaponStoreList = document.getElementById('weapon-store-list');
    this.slotInspector = document.getElementById('slot-inspector');
    this.inspectSlotNum = document.getElementById('inspect-slot-num');
    this.inspectWeaponName = document.getElementById('inspect-weapon-name');
    this.inspectWeaponIcon = document.getElementById('inspect-weapon-icon');
    this.inspectStars = document.getElementById('inspect-stars');
    this.inspectStatsGrid = document.getElementById('inspect-stats-grid');
    this.currentWeaponInfo = document.getElementById('current-weapon-info');
    this.upgradeWeaponBtn = document.getElementById('upgrade-weapon-btn');
    this.upgradeCostTag = document.getElementById('upgrade-cost-tag');
    this.sellWeaponBtn = document.getElementById('sell-weapon-btn');
    this.overlayBanner = document.getElementById('overlay-banner');
    this.overlayTitle = document.getElementById('overlay-title');
    this.overlaySub = document.getElementById('overlay-sub');
    this.overlayActionBtn = document.getElementById('overlay-action-btn');

    // Game State
    this.coins = 20; // Starting bonus for comfort
    this.hasBoughtFirstTurret = false;
    this.wave = 1;
    this.isWaveActive = false;
    this.isPaused = false;
    this.gameSpeed = 1;
    this.gameOver = false;
    
    // Tower & Crates specs
    this.maxTowerHp = 500;
    this.towerHp = 500;
    
    // Position of character and 5 crates stacked
    this.towerBaseX = 170;
    this.groundY = 510;
    this.crateWidth = 70;
    this.crateHeight = 44;
    this.numCrates = 5;

    // Slot array for the 5 crates (index 0 is bottom crate, 4 is top crate)
    this.slots = [
      { id: 0, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 1, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 2, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 3, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 4, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false }
    ];

    this.selectedSlotIndex = 0;
    this.activeShopCategory = 'all';

    // Entities
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.damageNumbers = [];
    this.beams = []; // railgun laser beams

    // Spawning waves
    this.waveSpawnsRemaining = [];
    this.spawnTimer = 0;
    this.waveCooldown = 0;

    // Time tracking
    this.lastTime = performance.now();

    // Mouse tracking for character aim/visual
    this.mouseX = 500;
    this.mouseY = 300;

    this.initEventListeners();
    this.renderCrateSlotsUI();
    this.renderShop();
    this.selectSlot(0);
    this.updateHUD();
    this.startWave(1);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  initEventListeners() {
    // Canvas mouse move
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
    });

    // Speed button: 1x -> 2x -> 5x -> 10x cycle
    const speedBtn = document.getElementById('speed-btn');
    speedBtn.addEventListener('click', () => {
      if (this.gameSpeed === 1) {
        this.gameSpeed = 2;
        speedBtn.innerText = '2x ⏩';
        speedBtn.style.color = '#00ff88';
      } else if (this.gameSpeed === 2) {
        this.gameSpeed = 5;
        speedBtn.innerText = '5x ⏩⏩';
        speedBtn.style.color = '#ffb703';
      } else if (this.gameSpeed === 5) {
        this.gameSpeed = 10;
        speedBtn.innerText = '10x 🚀⚡';
        speedBtn.style.color = '#ff007f';
      } else {
        this.gameSpeed = 1;
        speedBtn.innerText = '1x ⏩';
        speedBtn.style.color = '#fff';
      }
    });

    // Pause button
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.addEventListener('click', () => {
      this.isPaused = !this.isPaused;
      pauseBtn.innerText = this.isPaused ? '▶️' : '⏸️';
    });

    // Sound button
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.addEventListener('click', () => {
      window.soundManager.muted = !window.soundManager.muted;
      soundBtn.innerText = window.soundManager.muted ? '🔇' : '🔊';
    });

    // Upgrade Button
    this.upgradeWeaponBtn.addEventListener('click', () => {
      this.upgradeSelectedSlot();
    });

    // Sell Button
    this.sellWeaponBtn.addEventListener('click', () => {
      this.sellSelectedSlot();
    });

    // Shop tabs
    const tabs = document.querySelectorAll('.shop-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeShopCategory = tab.dataset.cat;
        this.renderShop();
      });
    });

    // Overlay Action Button
    this.overlayActionBtn.addEventListener('click', () => {
      if (this.gameOver) {
        this.restartGame();
      } else {
        this.overlayBanner.classList.add('hidden');
        this.startWave(this.wave + 1);
      }
    });
  }

  // Calculate current slot coordinates in world
  getSlotCoords(slotIndex) {
    // 0 is bottom crate, 4 is top crate
    const y = this.groundY - (slotIndex + 1) * this.crateHeight + (this.crateHeight / 2);
    const x = this.towerBaseX;
    return { x, y };
  }

  getCharacterCoords() {
    // Character stands on crate index 4 (top crate)
    const topSlotY = this.groundY - (5 * this.crateHeight);
    return { x: this.towerBaseX, y: topSlotY - 20 };
  }

  // ================= UI RENDERING ================= //
  renderCrateSlotsUI() {
    this.crateSlotsContainer.innerHTML = '';
    // Display slots 5 down to 1 (top to bottom like visual crate stack)
    for (let i = 4; i >= 0; i--) {
      const slot = this.slots[i];
      const card = document.createElement('div');
      card.className = `crate-slot-card ${this.selectedSlotIndex === i ? 'active' : ''}`;
      
      const wepDef = slot.weapon ? WEAPON_REGISTRY[slot.weapon] : null;
      const icon = wepDef ? wepDef.icon : '📦';
      const name = wepDef ? wepDef.name : 'Slot ' + (i + 1);
      
      let stars = '';
      if (slot.weapon) {
        for (let s = 0; s < wepDef.maxUpgrades; s++) {
          stars += s < slot.level ? '★' : '☆';
        }
      }

      card.innerHTML = `
        <span class="slot-index-badge">#${i + 1}</span>
        <div class="slot-crate-icon">${icon}</div>
        <div class="slot-weapon-title">${name}</div>
        <div class="slot-stars-mini">${stars}</div>
      `;

      card.addEventListener('click', () => {
        this.selectSlot(i);
      });

      this.crateSlotsContainer.appendChild(card);
    }
  }

  selectSlot(index) {
    this.selectedSlotIndex = index;
    this.renderCrateSlotsUI();
    this.updateInspector();
  }

  updateInspector() {
    const slot = this.slots[this.selectedSlotIndex];
    this.inspectSlotNum.innerText = `CRATE #${this.selectedSlotIndex + 1}`;

    if (!slot.weapon) {
      this.inspectWeaponName.innerText = 'Empty Crate Slot';
      this.currentWeaponInfo.classList.add('hidden');
      this.sellWeaponBtn.classList.add('hidden');
    } else {
      const wep = WEAPON_REGISTRY[slot.weapon];
      this.inspectWeaponName.innerText = wep.name;
      this.inspectWeaponIcon.innerText = wep.icon;
      this.currentWeaponInfo.classList.remove('hidden');
      this.sellWeaponBtn.classList.remove('hidden');

      // Stars
      let starStr = '';
      for (let s = 0; s < wep.maxUpgrades; s++) {
        starStr += s < slot.level ? '★ ' : '☆ ';
      }
      this.inspectStars.innerText = starStr;

      // Stats calculation for current level
      const currentStats = this.getWeaponStats(slot);
      let statsHtml = `
        <span>DMG: <b>${currentStats.damage.toFixed(1)}</b></span>
      `;
      if (currentStats.interval) {
        statsHtml += `<span>Rate: <b>${currentStats.interval}s</b></span>`;
      }
      if (currentStats.cycleInterval) {
        statsHtml += `<span>Cycle: <b>${currentStats.cycleInterval}s</b></span>`;
      }
      if (currentStats.tickInterval) {
        statsHtml += `<span>Tick: <b>${currentStats.tickInterval}s</b></span>`;
      }
      if (currentStats.blastRadius) {
        statsHtml += `<span>Radius: <b>${currentStats.blastRadius}px</b></span>`;
      }
      this.inspectStatsGrid.innerHTML = statsHtml;

      // Upgrade button status
      if (slot.level >= wep.maxUpgrades) {
        this.upgradeWeaponBtn.disabled = true;
        this.upgradeCostTag.innerText = 'MAX LEVEL';
      } else {
        const cost = wep.upgradeCosts[slot.level];
        this.upgradeCostTag.innerText = `🪙 ${cost}`;
        this.upgradeWeaponBtn.disabled = this.coins < cost;
      }
    }
    this.renderShop(); // Refresh buy button disable states
  }

  renderShop() {
    this.weaponStoreList.innerHTML = '';
    const selectedSlot = this.slots[this.selectedSlotIndex];

    Object.values(WEAPON_REGISTRY).forEach(wep => {
      // Filter by category tab
      if (this.activeShopCategory !== 'all') {
        if (this.activeShopCategory === 'gun' && wep.category !== 'gun') return;
        if (this.activeShopCategory === 'godly-gun' && wep.category !== 'godly-gun') return;
        if (this.activeShopCategory === 'melee' && wep.category !== 'melee') return;
        if (this.activeShopCategory === 'godly-melee' && wep.category !== 'godly-melee') return;
      }

      // Check price: First Turret ever is Free!
      const isFreeTurret = wep.id === 'turret' && !this.hasBoughtFirstTurret;
      const price = isFreeTurret ? 0 : wep.basePrice;

      const itemCard = document.createElement('div');
      itemCard.className = `store-item-card ${wep.category.includes('godly') ? 'godly' : ''}`;

      const catBadge = {
        'gun': '<span class="category-tag cat-gun">GUN</span>',
        'godly-gun': '<span class="category-tag cat-godly-gun">GODLY GUN</span>',
        'melee': '<span class="category-tag cat-melee">CLOSE RANGE</span>',
        'godly-melee': '<span class="category-tag cat-godly-melee">GODLY CLOSE</span>'
      }[wep.category] || '';

      const isSlotOccupied = selectedSlot && selectedSlot.weapon !== null;

      let buttonText = isFreeTurret ? 'FREE!' : '🪙 ' + price;
      let btnLabel = 'EQUIP';
      if (isSlotOccupied) {
        btnLabel = 'SLOT FULL';
        buttonText = 'Sell 1st';
      }

      itemCard.innerHTML = `
        <div class="store-item-icon">${wep.icon}</div>
        <div class="store-item-details">
          <div class="store-item-title-row">
            <span class="store-item-name">${wep.name}</span>
            ${catBadge}
          </div>
          <div class="store-item-desc">${wep.description}</div>
          <div class="store-item-stats">
            Base: ${wep.baseStats.damage} DMG &bull; ${wep.maxUpgrades} Upgrades
          </div>
        </div>
        <button class="buy-btn ${isFreeTurret && !isSlotOccupied ? 'free-buy' : ''} ${isSlotOccupied ? 'slot-occupied' : ''}" id="buy-btn-${wep.id}">
          <span>${btnLabel}</span>
          <span>${buttonText}</span>
        </button>
      `;

      const buyBtn = itemCard.querySelector(`#buy-btn-${wep.id}`);
      // Disabled if not enough coins OR if current slot already has a weapon
      buyBtn.disabled = isSlotOccupied || (this.coins < price);
      buyBtn.title = isSlotOccupied ? "This crate slot is already occupied! Sell the current weapon first." : "";

      buyBtn.addEventListener('click', () => {
        if (isSlotOccupied) return;
        this.buyWeapon(wep.id, price, isFreeTurret);
      });

      this.weaponStoreList.appendChild(itemCard);
    });
  }

  buyWeapon(weaponId, cost, isFreeTurret) {
    const slot = this.slots[this.selectedSlotIndex];
    // Strict block: CANNOT buy into an occupied slot
    if (slot && slot.weapon !== null) {
      alert("This crate slot already has a weapon! Sell the current weapon first to equip a new one.");
      return;
    }

    if (this.coins < cost) return;

    this.coins -= cost;
    if (isFreeTurret) {
      this.hasBoughtFirstTurret = true;
    }

    slot.weapon = weaponId;
    slot.level = 0;
    slot.timer = 0;
    slot.subTimer = 0;

    window.soundManager.playUpgrade();
    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
  }

  upgradeSelectedSlot() {
    const slot = this.slots[this.selectedSlotIndex];
    if (!slot.weapon) return;
    const wep = WEAPON_REGISTRY[slot.weapon];
    if (slot.level >= wep.maxUpgrades) return;

    const cost = wep.upgradeCosts[slot.level];
    if (this.coins < cost) return;

    this.coins -= cost;
    slot.level++;
    window.soundManager.playUpgrade();

    // Visual upgrade flare
    const coords = this.getSlotCoords(this.selectedSlotIndex);
    this.createExplosionParticles(coords.x + 30, coords.y, '#00ff88', 25);

    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
  }

  sellSelectedSlot() {
    const slot = this.slots[this.selectedSlotIndex];
    if (!slot.weapon) return;
    const wep = WEAPON_REGISTRY[slot.weapon];

    // Compute refund (70% base price + 70% upgrades invested)
    let totalInvested = wep.id === 'turret' && this.hasBoughtFirstTurret ? 15 : wep.basePrice;
    for (let i = 0; i < slot.level; i++) {
      totalInvested += wep.upgradeCosts[i];
    }
    const refund = Math.floor(totalInvested * 0.7);
    this.coins += refund;

    slot.weapon = null;
    slot.level = 0;
    slot.timer = 0;

    window.soundManager.playCoin();
    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
  }

  getWeaponStats(slot) {
    const wep = WEAPON_REGISTRY[slot.weapon];
    if (slot.level === 0) {
      return { ...wep.baseStats };
    }
    const upg = wep.statUpgrades[slot.level - 1];
    return { ...wep.baseStats, ...upg };
  }

  updateHUD() {
    this.coinDisplay.innerText = Math.floor(this.coins);
    this.waveDisplay.innerText = this.wave;
    const hpPercent = Math.max(0, (this.towerHp / this.maxTowerHp) * 100);
    this.towerHpBar.style.width = `${hpPercent}%`;
    this.towerHpText.innerText = `${Math.ceil(this.towerHp)} / ${this.maxTowerHp}`;
  }

  // ================= WAVE SPAWNING & ENEMY TYPES ================= //
  startWave(waveNum) {
    this.wave = waveNum;
    this.isWaveActive = true;
    this.updateHUD();

    // Generate enemy queue for this wave
    // Each wave has a distinct composition of enemies:
    // Wave 1: Crawler/Scout (5 HP base) only - easy starter wave
    // Wave 2: Crawlers + Fast Runners
    // Wave 3: Crawlers + Runners + Armored Brute
    // Wave 4: Swarm of Crawlers/Runners + Armored Brutes + Spitter
    // Wave 5+: Includes Tank / Titan and Bosses
    this.waveSpawnsRemaining = [];
    const count = 6 + waveNum * 4;

    for (let i = 0; i < count; i++) {
      let type = 'scout'; // Base weak enemy (5 HP)
      const roll = Math.random();

      if (waveNum === 1) {
        type = 'scout';
      } else if (waveNum === 2) {
        type = roll < 0.7 ? 'scout' : 'runner';
      } else if (waveNum === 3) {
        if (roll < 0.5) type = 'scout';
        else if (roll < 0.8) type = 'runner';
        else type = 'armored';
      } else if (waveNum === 4) {
        if (roll < 0.4) type = 'scout';
        else if (roll < 0.7) type = 'runner';
        else if (roll < 0.88) type = 'armored';
        else type = 'spitter';
      } else {
        // Wave 5+
        if (i === count - 1 && waveNum % 2 === 1) {
          type = 'boss';
        } else if (roll < 0.3) {
          type = 'scout';
        } else if (roll < 0.55) {
          type = 'runner';
        } else if (roll < 0.75) {
          type = 'armored';
        } else if (roll < 0.9) {
          type = 'spitter';
        } else {
          type = 'tank';
        }
      }

      // Spacing between enemies: Made slower so waves feel tactical and distinct
      const delay = 1.3 + Math.random() * 1.4;
      this.waveSpawnsRemaining.push({ type, delay });
    }

    this.spawnTimer = 2.0; // 2.0s preparation pause before first wave enemy
  }

  spawnEnemy(type) {
    const startX = this.canvas.width + 30;
    const groundLevel = this.groundY;

    // Distinct Enemy Types:
    // 1. Scout / Crawler: First, least strong enemy. Exactly 5 HP base!
    // 2. Fast Runner: Agile, 12 HP, runs fast.
    // 3. Armored Brute: Slow, heavily armored, 35 HP.
    // 4. Acid Spitter: Ranged shooter attacking tower from 260px away! 22 HP.
    // 5. Titan Mutator: Massive juggernaut with heavy health (450+ HP)!
    // 6. War Chief (Boss): Colossal boss with massive health (1500+ HP) so godly weapons cannot shred them!

    let hp = 5; // Exactly 5 HP for the first, least strong enemy
    let speed = 40; // slowed down pace
    let size = 22;
    let coinReward = 3;
    let color = '#38b000';
    let name = 'Scout Crawler';
    let attackDamage = 5;
    let attackInterval = 1.2;
    let attackRange = 0; // 0 = melee against crates, >0 = ranged
    let enemyType = type;

    if (type === 'scout') {
      // First, least strong enemy has 5 health (scaling gently in later waves)
      hp = 5 + (this.wave > 1 ? (this.wave - 1) * 2 : 0);
      speed = 46;
      size = 20;
      coinReward = 3;
      color = '#48cae4';
      name = 'Scout Crawler';
      attackDamage = 6 + this.wave;
      attackInterval = 1.2;
    } else if (type === 'runner') {
      hp = 12 + this.wave * 3;
      speed = 88;
      size = 18;
      coinReward = 5;
      color = '#ffd166';
      name = 'Fast Runner';
      attackDamage = 8 + this.wave;
      attackInterval = 0.9;
    } else if (type === 'armored') {
      hp = 35 + this.wave * 12;
      speed = 30;
      size = 30;
      coinReward = 10;
      color = '#9d4edd';
      name = 'Armored Brute';
      attackDamage = 14 + this.wave * 2;
      attackInterval = 1.4;
    } else if (type === 'spitter') {
      hp = 22 + this.wave * 6;
      speed = 36;
      size = 24;
      coinReward = 9;
      color = '#06d6a0';
      name = 'Acid Spitter';
      attackDamage = 10 + this.wave;
      attackInterval = 2.0;
      attackRange = 260; // shoots acid at the crates from distance!
    } else if (type === 'tank') {
      // Nerfed to 75% of previous health and speed
      hp = 335 + this.wave * 135;
      speed = 15;
      size = 42;
      coinReward = 28;
      color = '#ef476f';
      name = 'Titan Mutator';
      attackDamage = 24 + this.wave * 3;
      attackInterval = 1.6;
    } else if (type === 'boss') {
      // Nerfed to 75% of previous health and speed
      hp = 1125 + this.wave * 450;
      speed = 13.5;
      size = 56;
      coinReward = 100;
      color = '#ff0054';
      name = 'WAR CHIEF';
      attackDamage = 42 + this.wave * 6;
      attackInterval = 1.4;
    }

    this.enemies.push({
      type: enemyType,
      name: name,
      x: startX,
      y: groundLevel - size / 2,
      hp: hp,
      maxHp: hp,
      speed: speed,
      size: size,
      coinReward: coinReward,
      color: color,
      attackDamage: attackDamage,
      attackInterval: attackInterval,
      attackRange: attackRange,
      attackCooldown: 0.5,
      hitFlash: 0
    });
  }

  // ================= MAIN LOOP ================= //
  gameLoop(timestamp) {
    const rawDelta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const baseDt = Math.min(rawDelta, 0.05);

    if (!this.isPaused && !this.gameOver) {
      if (this.gameSpeed > 2) {
        // Substep physics simulation for 5x and 10x to ensure bullet collisions & ticks remain perfectly accurate
        const steps = this.gameSpeed === 10 ? 4 : 2;
        const subDt = (baseDt * this.gameSpeed) / steps;
        for (let s = 0; s < steps; s++) {
          this.update(subDt);
        }
      } else {
        const dt = baseDt * this.gameSpeed;
        this.update(dt);
      }
    }

    this.draw();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  update(dt) {
    // 1. Spawning Logic
    if (this.isWaveActive) {
      if (this.waveSpawnsRemaining.length > 0) {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
          const nextSpawn = this.waveSpawnsRemaining.shift();
          this.spawnEnemy(nextSpawn.type);
          this.spawnTimer = nextSpawn.delay;
        }
      } else if (this.enemies.length === 0) {
        // Wave complete!
        this.isWaveActive = false;
        this.overlayTitle.innerText = `WAVE ${this.wave} CLEARED!`;
        this.overlaySub.innerText = `Great defense! You received bonus coins.`;
        this.coins += 15 + this.wave * 5;
        window.soundManager.playUpgrade();
        this.updateHUD();
        this.overlayBanner.classList.remove('hidden');
      }
    }

    // 2. Weapon Processing for all 5 Crate Slots
    this.slots.forEach((slot, index) => {
      if (!slot.weapon) return;
      this.updateSlotWeapon(slot, index, dt);
    });

    // 3. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.lifetime -= dt;

      // Trail particle
      if (Math.random() < 0.4) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          color: p.color,
          radius: p.radius * 0.7,
          life: 0.2,
          maxLife: 0.2
        });
      }

      // Check collision with enemies
      let hit = false;
      for (let e of this.enemies) {
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.hypot(dx, dy);

        if (dist < e.size / 2 + p.radius) {
          hit = true;
          this.onProjectileHit(p, e);
          break;
        }
      }

      if (hit || p.lifetime <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Update Laser Beams (Railgun)
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const beam = this.beams[i];
      beam.lifetime -= dt;
      if (beam.lifetime <= 0) {
        this.beams.splice(i, 1);
      }
    }

    // 5. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.hitFlash > 0) enemy.hitFlash -= dt;

      // Move left towards crates or stop within attack range
      const meleeTargetX = this.towerBaseX + this.crateWidth / 2 + enemy.size / 2;
      const targetStopX = enemy.attackRange > 0 ? (this.towerBaseX + enemy.attackRange) : meleeTargetX;

      if (enemy.x > targetStopX) {
        enemy.x -= enemy.speed * dt;
      } else {
        // Attack the crates / tower
        enemy.attackCooldown -= dt;
        if (enemy.attackCooldown <= 0) {
          enemy.attackCooldown = enemy.attackInterval;
          const dmg = enemy.attackDamage || (8 + this.wave * 2);
          this.towerHp -= dmg;
          window.soundManager.playHurt();

          // Visual hit impact on tower crates
          const hitCrateY = this.groundY - (Math.floor(Math.random() * 5) + 0.5) * this.crateHeight;
          this.createExplosionParticles(this.towerBaseX + this.crateWidth / 2, hitCrateY, '#ff3366', 10);
          this.addDamageText(this.towerBaseX + this.crateWidth / 2 + 10, hitCrateY - 10, `-${dmg.toFixed(0)}`, '#ff3366');

          // If spitter, launch an acid spit particle effect
          if (enemy.type === 'spitter') {
            this.createExplosionParticles(enemy.x, enemy.y, '#06d6a0', 8);
          }

          if (this.towerHp <= 0) {
            this.towerHp = 0;
            this.triggerGameOver();
          }
          this.updateHUD();
        }
      }

      // Check if dead
      if (enemy.hp <= 0) {
        this.coins += enemy.coinReward;
        window.soundManager.playCoin();
        this.createExplosionParticles(enemy.x, enemy.y, enemy.color, 15);
        this.addDamageText(enemy.x, enemy.y - 15, `+${enemy.coinReward}🪙`, '#ffd166');
        this.enemies.splice(i, 1);
        this.updateHUD();
        this.updateInspector();
      }
    }

    // 6. Update Particles & Floats
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const d = this.damageNumbers[i];
      d.y -= 25 * dt;
      d.life -= dt;
      if (d.life <= 0) this.damageNumbers.splice(i, 1);
    }
  }

  // Calculate lead angle predicting where the moving target will be when the bullet arrives
  getPredictiveAimAngle(originX, originY, target, projectileSpeed) {
    if (!target) return 0;
    // Enemy velocity is moving left (-target.speed in x, 0 in y)
    // If enemy has reached stop position, speed effectively 0
    const meleeTargetX = this.towerBaseX + this.crateWidth / 2 + target.size / 2;
    const targetStopX = target.attackRange > 0 ? (this.towerBaseX + target.attackRange) : meleeTargetX;
    const isMoving = target.x > targetStopX;

    const vx = isMoving ? -target.speed : 0;
    const vy = 0;

    const dx = target.x - originX;
    const dy = target.y - originY;

    if (!projectileSpeed || projectileSpeed <= 0) {
      return Math.atan2(dy, dx);
    }

    // Solve quadratic equation for intercept time t:
    // |(dx + vx*t, dy + vy*t)|^2 = (projectileSpeed * t)^2
    // (vx^2 + vy^2 - S^2)*t^2 + 2*(dx*vx + dy*vy)*t + (dx^2 + dy^2) = 0
    const a = (vx * vx + vy * vy) - (projectileSpeed * projectileSpeed);
    const b = 2 * (dx * vx + dy * vy);
    const c = dx * dx + dy * dy;

    let t = 0;
    const disc = b * b - 4 * a * c;
    if (disc >= 0 && Math.abs(a) > 0.0001) {
      const t1 = (-b - Math.sqrt(disc)) / (2 * a);
      const t2 = (-b + Math.sqrt(disc)) / (2 * a);
      if (t1 > 0 && t2 > 0) t = Math.min(t1, t2);
      else if (t1 > 0) t = t1;
      else if (t2 > 0) t = t2;
    }

    if (t <= 0) {
      // Fallback simple distance-based flight time approximation
      const dist = Math.hypot(dx, dy);
      t = dist / projectileSpeed;
    }

    const predictedX = target.x + vx * t;
    const predictedY = target.y + vy * t;

    return Math.atan2(predictedY - originY, predictedX - originX);
  }

  // ================= WEAPON BEHAVIORS ================= //
  updateSlotWeapon(slot, index, dt) {
    const stats = this.getWeaponStats(slot);
    const coords = this.getSlotCoords(index);

    // Muzzle pivot point is on the front right edge of the crate
    const muzzleX = coords.x + (this.crateWidth / 2) + 8;
    const muzzleY = coords.y;

    // Aim angle at closest enemy
    const target = this.getNearestEnemy(muzzleX, muzzleY, stats.range || 999);
    
    // Default visual angle towards target
    if (target) {
      slot.angle = Math.atan2(target.y - muzzleY, target.x - muzzleX);
    } else {
      slot.angle = 0;
    }

    // Spec handling:
    switch (slot.weapon) {
      // 1. TURRET: shoots one bullet dealing 5 dmg every 2.0s (Calculates target velocity lead)
      case 'turret': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const fireAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spawnX = muzzleX + Math.cos(fireAngle) * 16;
            const spawnY = muzzleY + Math.sin(fireAngle) * 16;
            this.fireBullet(spawnX, spawnY, fireAngle, stats.damage, stats.bulletSpeed, '#00f3ff', 5);
            window.soundManager.playShoot('turret');
          }
        }
        break;
      }

      // 2. AK-47: shoots a bullet dealing 3 dmg every 0.5s (Calculates target velocity lead)
      case 'ak47': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const leadAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spread = (Math.random() - 0.5) * 0.05;
            const spawnX = muzzleX + Math.cos(leadAngle) * 20;
            const spawnY = muzzleY + Math.sin(leadAngle) * 20;
            this.fireBullet(spawnX, spawnY, leadAngle + spread, stats.damage, stats.bulletSpeed, '#ffb703', 4.5);
            window.soundManager.playShoot('ak47');
          }
        }
        break;
      }

      // 3. MINIGUN: every 0.02s shoots bullet dealing 0.4 dmg (Predictive high-velocity tracking)
      case 'minigun': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const leadAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spread = (Math.random() - 0.5) * 0.12;
            const spawnX = muzzleX + Math.cos(leadAngle) * 22;
            const spawnY = muzzleY + Math.sin(leadAngle) * 22;
            this.fireBullet(spawnX, spawnY, leadAngle + spread, stats.damage, stats.bulletSpeed, '#ffaa00', 3);
            if (Math.random() < 0.25) window.soundManager.playShoot('minigun');
          }
        }
        break;
      }

      // 4. ENERGY RAILGUN: Charge 10s. Instant hitscan beam (no lead needed, shoots straight through)
      case 'railgun': {
        slot.timer += dt;
        if (target) {
          slot.angle = Math.atan2(target.y - muzzleY, target.x - muzzleX);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            this.fireRailgunBeam(muzzleX, muzzleY, slot.angle, stats.damage, stats.beamWidth, stats.range);
            window.soundManager.playShoot('railgun');
          }
        }
        break;
      }

      // 5. RPG: Wait 5s. Shoot exploding grenade (Calculates lead for rocket velocity)
      case 'rpg': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const leadAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spawnX = muzzleX + Math.cos(leadAngle) * 24;
            const spawnY = muzzleY + Math.sin(leadAngle) * 24;
            this.fireRPGGrenade(spawnX, spawnY, leadAngle, stats.damage, stats.bulletSpeed, stats.blastRadius);
            window.soundManager.playShoot('ak47');
          }
        }
        break;
      }

      // 6. FLAMETHROWER: every 7s, blow fire dealing 1 dmg every 0.25s
      case 'flamethrower': {
        slot.timer += dt;
        // Check cycle: slot.timer runs from 0 up to cycleInterval + flameDuration
        const isBlowingFire = slot.timer >= stats.cycleInterval;
        if (isBlowingFire) {
          slot.subTimer += dt;
          // Spawn flame particles
          const flameAngle = slot.angle + (Math.random() - 0.5) * stats.coneAngle;
          this.particles.push({
            x: muzzleX,
            y: muzzleY,
            vx: Math.cos(flameAngle) * (180 + Math.random() * 80),
            vy: Math.sin(flameAngle) * (180 + Math.random() * 80),
            color: Math.random() > 0.4 ? '#ff5400' : '#ffaa00',
            radius: 8 + Math.random() * 6,
            life: 0.45,
            maxLife: 0.45
          });

          if (slot.subTimer >= stats.tickInterval) {
            slot.subTimer = 0;
            window.soundManager.playFlame();
            // Damage enemies inside flame cone & range
            for (let enemy of this.enemies) {
              const dx = enemy.x - muzzleX;
              const dy = enemy.y - muzzleY;
              const dist = Math.hypot(dx, dy);
              if (dist <= stats.range) {
                const angleToEnemy = Math.atan2(dy, dx);
                let diff = Math.abs(angleToEnemy - slot.angle);
                if (diff > Math.PI) diff = 2 * Math.PI - diff;
                if (diff <= stats.coneAngle / 2) {
                  this.damageEnemy(enemy, stats.damage, '#ff5400');
                }
              }
            }
          }

          if (slot.timer >= stats.cycleInterval + stats.flameDuration) {
            slot.timer = 0; // restart cycle
          }
        }
        break;
      }

      // 7. CHAINSAW: Keeps spinning forever. Every 0.1s touching deals 0.3 dmg
      case 'chainsaw': {
        slot.subTimer += dt;
        slot.angle += stats.rotSpeed * dt;
        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          let hitAny = false;
          const meleeMountX = coords.x + this.crateWidth / 2 + 15;
          const minClearance = stats.spinRadius + 6;
          const meleeMountY = Math.min(coords.y, this.groundY - minClearance);

          for (let enemy of this.enemies) {
            const dx = enemy.x - meleeMountX;
            const dy = enemy.y - meleeMountY;
            const dist = Math.hypot(dx, dy);
            if (dist <= stats.spinRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.damage, '#ffaa00');
              hitAny = true;
              this.createExplosionParticles(enemy.x, enemy.y, '#e0e1dd', 3);
            }
          }
          if (hitAny) window.soundManager.playChainsaw();
        }
        break;
      }

      // 8. ENERGY BLADE: Keeps spinning forever. Every 0.1s touching deals 2 dmg
      case 'energy_blade': {
        slot.subTimer += dt;
        slot.angle += stats.rotSpeed * dt;
        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          let hitAny = false;
          const meleeMountX = coords.x + this.crateWidth / 2 + 15;
          const minClearance = stats.spinRadius + 6;
          const meleeMountY = Math.min(coords.y, this.groundY - minClearance);

          for (let enemy of this.enemies) {
            const dx = enemy.x - meleeMountX;
            const dy = enemy.y - meleeMountY;
            const dist = Math.hypot(dx, dy);
            if (dist <= stats.spinRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.damage, '#00f3ff');
              hitAny = true;
              this.createExplosionParticles(enemy.x, enemy.y, '#00f3ff', 4);
            }
          }
          if (hitAny) window.soundManager.playEnergyBlade();
        }
        break;
      }
    }
  }

  getNearestEnemy(x, y, maxRange) {
    let nearest = null;
    let minD = maxRange;
    for (let enemy of this.enemies) {
      const d = Math.hypot(enemy.x - x, enemy.y - y);
      if (d < minD) {
        minD = d;
        nearest = enemy;
      }
    }
    return nearest;
  }

  fireBullet(x, y, angle, damage, speed, color, radius) {
    this.projectiles.push({
      type: 'bullet',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage,
      color,
      radius,
      lifetime: 4.0 // lasts full journey across the entire screen
    });
  }

  fireRPGGrenade(x, y, angle, totalDamage, speed, blastRadius) {
    this.projectiles.push({
      type: 'rpg',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      totalDamage,
      blastRadius,
      color: '#ff3366',
      radius: 8,
      lifetime: 4.0 // lasts full journey across the entire screen
    });
  }

  fireRailgunBeam(x, y, angle, damage, width, range) {
    const endX = x + Math.cos(angle) * range;
    const endY = y + Math.sin(angle) * range;

    // Pierce all enemies intersecting beam line segment
    for (let enemy of this.enemies) {
      const distToLine = this.pointToSegmentDistance(enemy.x, enemy.y, x, y, endX, endY);
      if (distToLine < enemy.size / 2 + width) {
        this.damageEnemy(enemy, damage, '#00f3ff');
        this.createExplosionParticles(enemy.x, enemy.y, '#00f3ff', 8);
      }
    }

    this.beams.push({
      x1: x,
      y1: y,
      x2: endX,
      y2: endY,
      width: width,
      lifetime: 0.35,
      maxLifetime: 0.35
    });
  }

  pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  onProjectileHit(p, targetEnemy) {
    if (p.type === 'rpg') {
      // Explode and distribute total 250 damage equally among all hit targets
      window.soundManager.playExplosion();
      this.createExplosionParticles(p.x, p.y, '#ff5400', 35);
      
      const hitEnemies = [];
      for (let enemy of this.enemies) {
        const d = Math.hypot(enemy.x - p.x, enemy.y - p.y);
        if (d <= p.blastRadius + enemy.size / 2) {
          hitEnemies.push(enemy);
        }
      }

      if (hitEnemies.length > 0) {
        const damagePerEnemy = p.totalDamage / hitEnemies.length;
        for (let enemy of hitEnemies) {
          this.damageEnemy(enemy, damagePerEnemy, '#ff3366');
        }
      }
    } else {
      // Standard bullet
      this.damageEnemy(targetEnemy, p.damage, p.color);
      this.createExplosionParticles(p.x, p.y, p.color, 4);
    }
  }

  damageEnemy(enemy, amount, color) {
    enemy.hp -= amount;
    enemy.hitFlash = 0.08;
    this.addDamageText(enemy.x + (Math.random() - 0.5) * 20, enemy.y - 10, amount.toFixed(1), color);
  }

  addDamageText(x, y, text, color) {
    this.damageNumbers.push({
      x,
      y,
      text,
      color,
      life: 0.6,
      maxLife: 0.6
    });
  }

  createExplosionParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: 2 + Math.random() * 4,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.5
      });
    }
  }

  triggerGameOver() {
    this.gameOver = true;
    this.overlayTitle.innerText = 'DEFENSE OVERRUN!';
    this.overlaySub.innerText = `You survived until Wave ${this.wave}. Restart to defend again!`;
    this.overlayActionBtn.innerText = 'RESTART DEFENSE';
    this.overlayBanner.classList.remove('hidden');
  }

  restartGame() {
    this.gameOver = false;
    this.towerHp = this.maxTowerHp;
    this.coins = 20;
    this.hasBoughtFirstTurret = false;
    this.wave = 1;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.damageNumbers = [];
    this.beams = [];

    this.slots.forEach(s => {
      s.weapon = null;
      s.level = 0;
      s.timer = 0;
      s.subTimer = 0;
    });

    this.overlayBanner.classList.add('hidden');
    this.overlayActionBtn.innerText = 'NEXT WAVE';
    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
    this.startWave(1);
  }

  // ================= DRAWING / RENDERING ================= //
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Cyber Sci-fi Grid Background
    this.drawBackground();

    // 2. Draw Beams
    this.drawRailgunBeams();

    // 3. Draw The 5 Crates Stack and Character
    this.drawTowerAndCharacter();

    // 4. Draw Projectiles
    this.drawProjectiles();

    // 5. Draw Enemies
    this.drawEnemies();

    // 6. Draw Particles
    this.drawParticles();

    // 7. Draw Floating Numbers
    this.drawDamageNumbers();
  }

  drawBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark sci-fi gradient
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0c101d');
    bgGrad.addColorStop(0.7, '#121728');
    bgGrad.addColorStop(1, '#080a10');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, w, h);

    // Distant futuristic grid lines
    this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.groundY);
      this.ctx.stroke();
    }

    // Ground platform line
    const groundGrad = this.ctx.createLinearGradient(0, this.groundY, 0, h);
    groundGrad.addColorStop(0, '#1c2438');
    groundGrad.addColorStop(1, '#0e121d');
    this.ctx.fillStyle = groundGrad;
    this.ctx.fillRect(0, this.groundY, w, h - this.groundY);

    // Neon ground strip
    this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundY);
    this.ctx.lineTo(w, this.groundY);
    this.ctx.stroke();
  }

  drawTowerAndCharacter() {
    // Draw the 5 Crates Stack (0 is bottom, 4 is top)
    for (let i = 0; i < 5; i++) {
      const slot = this.slots[i];
      const coords = this.getSlotCoords(i);
      const isSelected = this.selectedSlotIndex === i;

      // Crate body (wooden / reinforced steel crate)
      this.ctx.save();
      this.ctx.translate(coords.x, coords.y);

      // Crate outer border glow if selected
      if (isSelected) {
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.shadowBlur = 12;
      }

      // Wooden base
      this.ctx.fillStyle = '#b87333';
      this.ctx.fillRect(-this.crateWidth / 2, -this.crateHeight / 2, this.crateWidth, this.crateHeight);

      // Metal border and rivets
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = isSelected ? '#00f3ff' : '#593d25';
      this.ctx.strokeRect(-this.crateWidth / 2, -this.crateHeight / 2, this.crateWidth, this.crateHeight);

      // Crate inner cross brace
      this.ctx.beginPath();
      this.ctx.moveTo(-this.crateWidth / 2 + 6, -this.crateHeight / 2 + 6);
      this.ctx.lineTo(this.crateWidth / 2 - 6, this.crateHeight / 2 - 6);
      this.ctx.moveTo(this.crateWidth / 2 - 6, -this.crateHeight / 2 + 6);
      this.ctx.lineTo(-this.crateWidth / 2 + 6, this.crateHeight / 2 - 6);
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      this.ctx.stroke();

      // Crate number badge
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '700 10px Chakra Petch';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(`#${i + 1}`, -this.crateWidth / 2 + 5, -this.crateHeight / 2 + 12);

      this.ctx.restore();
    }

    // Draw weapons AFTER all crates are drawn so spinning blades always render on top and never get covered!
    for (let i = 0; i < 5; i++) {
      const slot = this.slots[i];
      const coords = this.getSlotCoords(i);
      if (slot.weapon) {
        this.drawMountedWeapon(coords.x, coords.y, slot);
      }
    }

    // Draw the Character standing on top of crate 5
    const char = this.getCharacterCoords();
    this.drawCharacter(char.x, char.y);
  }

  drawMountedWeapon(x, y, slot) {
    const wep = WEAPON_REGISTRY[slot.weapon];
    const stats = this.getWeaponStats(slot);

    this.ctx.save();

    // Close range spinning weapons are mounted on an extended front mechanical arm (x + 35)
    // so they spin completely free in open air and never hit or overlap the crate body!
    if (slot.weapon === 'chainsaw' || slot.weapon === 'energy_blade') {
      const mountX = x + this.crateWidth / 2 + 15;
      // Ensure the spinning blade center is elevated high enough above groundY so the blade tip never clips the ground!
      const minClearance = stats.spinRadius + 6;
      const mountY = Math.min(y, this.groundY - minClearance);
      
      // Draw mechanical mounting arm extending from the crate
      this.ctx.fillStyle = '#2b2d42';
      this.ctx.fillRect(x + this.crateWidth / 2 - 4, mountY - 4, 20, 8);
      this.ctx.fillStyle = '#8d99ae';
      this.ctx.beginPath();
      this.ctx.arc(mountX, mountY, 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.translate(mountX, mountY);
    } else {
      // Guns are mounted on the front edge of the crate to have unrestricted downward firing angle
      this.ctx.translate(x + this.crateWidth / 2 - 2, y);
    }

    // Close range spinning weapons
    if (slot.weapon === 'chainsaw') {
      this.ctx.rotate(slot.angle);
      // Chainsaw motor base
      this.ctx.fillStyle = '#d90429';
      this.ctx.fillRect(0, -7, 24, 14);
      // Blade
      this.ctx.fillStyle = '#e0e1dd';
      this.ctx.fillRect(24, -5, stats.spinRadius - 20, 10);
      // Teeth
      this.ctx.fillStyle = '#fff';
      for (let t = 24; t < stats.spinRadius; t += 8) {
        this.ctx.fillRect(t, -8, 3, 3);
        this.ctx.fillRect(t, 5, 3, 3);
      }
      this.ctx.restore();
      return;
    }

    if (slot.weapon === 'energy_blade') {
      // 360-degree spinning sleek dual plasma blades
      this.ctx.rotate(slot.angle % (Math.PI * 2));

      const bladeLen = stats.spinRadius;
      const bladeW = 4;

      // Glowing cyan plasma aura
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 12;

      // Outer plasma blade glow (forward and backward blades)
      this.ctx.fillStyle = 'rgba(0, 243, 255, 0.9)';
      // Blade 1
      this.ctx.beginPath();
      this.ctx.moveTo(8, -bladeW);
      this.ctx.lineTo(bladeLen, 0);
      this.ctx.lineTo(8, bladeW);
      this.ctx.closePath();
      this.ctx.fill();

      // Blade 2 (opposite 180 deg)
      this.ctx.beginPath();
      this.ctx.moveTo(-8, -bladeW);
      this.ctx.lineTo(-bladeLen, 0);
      this.ctx.lineTo(-8, bladeW);
      this.ctx.closePath();
      this.ctx.fill();

      // White hot energy blade core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(8, -1.2, bladeLen - 12, 2.4);
      this.ctx.fillRect(-bladeLen + 4, -1.2, bladeLen - 12, 2.4);

      // Central emitter ring & core
      this.ctx.fillStyle = '#1d3557';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#00f3ff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
      return;
    }

    // Aimed Guns (Rotates freely down to ~90° directly below)
    this.ctx.rotate(slot.angle);

    if (slot.weapon === 'turret') {
      // Rotating turret mount
      this.ctx.fillStyle = '#415a77';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
      this.ctx.fill();
      // Barrel
      this.ctx.fillStyle = '#778da9';
      this.ctx.fillRect(5, -3, 20, 6);
    } else if (slot.weapon === 'ak47') {
      // Sleek military rifle
      this.ctx.fillStyle = '#222';
      this.ctx.fillRect(0, -3, 26, 6);
      this.ctx.fillStyle = '#b87333';
      this.ctx.fillRect(-6, -2, 8, 5); // wooden stock
    } else if (slot.weapon === 'minigun') {
      // Heavy multi-barrel
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(0, -6, 28, 12);
      this.ctx.fillStyle = '#ffaa00';
      this.ctx.fillRect(26, -5, 4, 10);
    } else if (slot.weapon === 'railgun') {
      // Godly railgun glowing chassis
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = '#102a43';
      this.ctx.fillRect(0, -6, 32, 12);
      // Blue plasma coil
      const chargeRatio = Math.min(1, slot.timer / stats.interval);
      this.ctx.fillStyle = `rgba(0, 243, 255, ${0.4 + chargeRatio * 0.6})`;
      this.ctx.fillRect(4, -3, 26 * chargeRatio, 6);
    } else if (slot.weapon === 'rpg') {
      // Heavy rocket launcher tube
      this.ctx.fillStyle = '#2d6a4f';
      this.ctx.fillRect(-6, -6, 32, 12);
      // Loaded rocket head if ready
      if (slot.timer >= stats.interval * 0.8) {
        this.ctx.fillStyle = '#ff3366';
        this.ctx.beginPath();
        this.ctx.moveTo(26, -6);
        this.ctx.lineTo(34, 0);
        this.ctx.lineTo(26, 6);
        this.ctx.fill();
      }
    } else if (slot.weapon === 'flamethrower') {
      this.ctx.fillStyle = '#b7094c';
      this.ctx.fillRect(0, -5, 24, 10);
      this.ctx.fillStyle = '#ffb703';
      this.ctx.beginPath();
      this.ctx.arc(24, 0, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawCharacter(x, y) {
    this.ctx.save();
    this.ctx.translate(x, y);

    // Aim angle from character head to mouse
    const aimAngle = Math.atan2(this.mouseY - y, this.mouseX - x);

    // Legs
    this.ctx.fillStyle = '#1d3557';
    this.ctx.fillRect(-8, 8, 6, 12);
    this.ctx.fillRect(2, 8, 6, 12);

    // Torso / Armor vest
    this.ctx.fillStyle = '#e63946';
    this.ctx.fillRect(-10, -8, 20, 16);
    // Vest tactical plate
    this.ctx.fillStyle = '#2b2d42';
    this.ctx.fillRect(-6, -4, 12, 10);

    // Head
    this.ctx.fillStyle = '#f1faee';
    this.ctx.beginPath();
    this.ctx.arc(0, -16, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Helmet / Visor
    this.ctx.fillStyle = '#00f3ff';
    this.ctx.shadowColor = '#00f3ff';
    this.ctx.shadowBlur = 6;
    this.ctx.fillRect(1, -19, 7, 5);

    // Arms pointing with binoculars or signaling
    this.ctx.shadowBlur = 0;
    this.ctx.save();
    this.ctx.rotate(aimAngle * 0.4);
    this.ctx.fillStyle = '#2b2d42';
    this.ctx.fillRect(4, -4, 14, 5);
    this.ctx.restore();

    this.ctx.restore();
  }

  drawProjectiles() {
    for (let p of this.projectiles) {
      this.ctx.save();
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawRailgunBeams() {
    for (let b of this.beams) {
      const alpha = b.lifetime / b.maxLifetime;
      this.ctx.save();
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 25;
      this.ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
      this.ctx.lineWidth = b.width;
      this.ctx.beginPath();
      this.ctx.moveTo(b.x1, b.y1);
      this.ctx.lineTo(b.x2, b.y2);
      this.ctx.stroke();

      // White inner core
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      this.ctx.lineWidth = b.width * 0.4;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawEnemies() {
    for (let e of this.enemies) {
      this.ctx.save();
      this.ctx.translate(e.x, e.y);

      // Flash white when hit
      if (e.hitFlash > 0) {
        this.ctx.fillStyle = '#ffffff';
      } else {
        this.ctx.fillStyle = e.color;
      }

      const r = e.size / 2;

      // Unique visual traits per enemy type
      if (e.type === 'runner') {
        // Sleek elongated shape with rear speed fin
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r * 1.2, r * 0.8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        // Speed spikes
        this.ctx.fillStyle = '#ff9e00';
        this.ctx.fillRect(r * 0.2, -r * 1.1, 4, r * 0.8);
      } else if (e.type === 'armored') {
        // Heavy square armored plating
        this.ctx.fillRect(-r, -r, e.size, e.size);
        this.ctx.strokeStyle = '#3a0ca3';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-r, -r, e.size, e.size);
      } else if (e.type === 'spitter') {
        // Pulsing bio-sac spitter
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#70e000';
        this.ctx.beginPath();
        this.ctx.arc(r * 0.3, -r * 0.3, r * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (e.type === 'tank' || e.type === 'boss') {
        // Massive hulking body with spikes
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        // Heavy spikes
        this.ctx.fillStyle = '#590d22';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          this.ctx.fillRect(Math.cos(a) * r, Math.sin(a) * r, 6, 6);
        }
      } else {
        // Default Scout crawler
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Glowing evil eye
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(-r * 0.3, -r * 0.2, r * 0.25, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#ff0054';
      this.ctx.beginPath();
      this.ctx.arc(-r * 0.35, -r * 0.2, r * 0.12, 0, Math.PI * 2);
      this.ctx.fill();

      // Enemy Name & HP text
      this.ctx.font = '600 10px Chakra Petch';
      this.ctx.fillStyle = '#e0e1dd';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${e.name} (${Math.ceil(e.hp)})`, 0, -r - 14);

      // Health bar above enemy
      const hpWidth = e.size * 1.4;
      const hpHeight = 4;
      const hpPercent = Math.max(0, e.hp / e.maxHp);

      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(-hpWidth / 2, -r - 9, hpWidth, hpHeight);
      this.ctx.fillStyle = '#ff3366';
      this.ctx.fillRect(-hpWidth / 2, -r - 9, hpWidth * hpPercent, hpHeight);

      this.ctx.restore();
    }
  }

  drawParticles() {
    for (let pt of this.particles) {
      const alpha = pt.life / pt.maxLife;
      this.ctx.save();
      this.ctx.fillStyle = pt.color;
      this.ctx.globalAlpha = Math.max(0, alpha);
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawDamageNumbers() {
    this.ctx.save();
    this.ctx.font = '700 13px Chakra Petch';
    for (let d of this.damageNumbers) {
      const alpha = d.life / d.maxLife;
      this.ctx.fillStyle = d.color;
      this.ctx.globalAlpha = Math.max(0, alpha);
      this.ctx.fillText(d.text, d.x, d.y);
    }
    this.ctx.restore();
  }
}

// Start Game on page load
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
