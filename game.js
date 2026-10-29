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

    // Admin Panel State & UI Elements
    this.isAdminAuthenticated = false;
    this.godMode = false;
    this.adminTargetSlot = 0;
    this.adminSelectedLevel = 0;

    this.adminBtn = document.getElementById('admin-btn');
    this.adminAuthModal = document.getElementById('admin-auth-modal');
    this.adminPassInput = document.getElementById('admin-pass-input');
    this.adminSubmitPassBtn = document.getElementById('admin-submit-pass-btn');
    this.adminAuthCloseBtn = document.getElementById('admin-auth-close-btn');
    this.adminAuthError = document.getElementById('admin-auth-error');
    this.adminPanelModal = document.getElementById('admin-panel-modal');
    this.adminPanelCloseBtn = document.getElementById('admin-panel-close-btn');
    this.adminWeaponSelect = document.getElementById('admin-weapon-select');
    this.adminTargetSlotName = document.getElementById('admin-target-slot-name');
    this.adminTargetSlotWep = document.getElementById('admin-target-slot-wep');
    this.adminGodModeBtn = document.getElementById('admin-god-mode-btn');

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
    this.lightningArcs = []; // tesla coil chain lightning arcs
    this.plasmaPools = []; // orbital mortar lingering plasma pools
    this.cameraShake = 0; // camera shake timer

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
    this.populateAdminWeaponSelect();
    this.initAdminEventListeners();
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

  // ================= ADMIN PANEL METHODS ================= //
  populateAdminWeaponSelect() {
    if (!this.adminWeaponSelect) return;
    this.adminWeaponSelect.innerHTML = '';

    const categories = [
      { key: 'gun', label: '🔫 Guns' },
      { key: 'godly-gun', label: '⚡ Godly Guns' },
      { key: 'melee', label: '⚔️ Close Range' },
      { key: 'godly-melee', label: '🌟 Godly Close Range' }
    ];

    categories.forEach(cat => {
      const group = document.createElement('optgroup');
      group.label = cat.label;
      for (const [id, wep] of Object.entries(WEAPON_REGISTRY)) {
        if (wep.category === cat.key) {
          const opt = document.createElement('option');
          opt.value = id;
          opt.textContent = `${wep.icon} ${wep.name} (Max Lv.${wep.maxUpgrades})`;
          group.appendChild(opt);
        }
      }
      this.adminWeaponSelect.appendChild(group);
    });
  }

  initAdminEventListeners() {
    if (!this.adminBtn) return;

    // Open Admin Button (prompts for password [adminpanel123] if not authenticated)
    this.adminBtn.addEventListener('click', () => {
      if (this.isAdminAuthenticated) {
        this.openAdminPanel();
      } else {
        this.openAdminAuthModal();
      }
    });

    // Submit password button
    this.adminSubmitPassBtn.addEventListener('click', () => {
      this.verifyAdminPassword();
    });

    // Enter key inside password input
    this.adminPassInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.verifyAdminPassword();
      }
    });

    // Close Auth modal
    this.adminAuthCloseBtn.addEventListener('click', () => {
      this.adminAuthModal.classList.add('hidden');
    });

    // Close Admin Panel modal
    this.adminPanelCloseBtn.addEventListener('click', () => {
      this.adminPanelModal.classList.add('hidden');
    });

    // Quick Coin buttons
    const coinBtns = document.querySelectorAll('.coin-add-btn');
    coinBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = parseInt(btn.dataset.coins) || 1000;
        this.adminAddCoins(amt);
      });
    });

    // Custom Coin button
    const customCoinBtn = document.getElementById('give-custom-coins-btn');
    const customCoinInput = document.getElementById('custom-coins-input');
    if (customCoinBtn && customCoinInput) {
      customCoinBtn.addEventListener('click', () => {
        const val = parseInt(customCoinInput.value) || 0;
        if (val > 0) {
          this.adminAddCoins(val);
        }
      });
    }

    // Heal Tower
    const healBtn = document.getElementById('admin-max-hp-btn');
    if (healBtn) {
      healBtn.addEventListener('click', () => {
        this.towerHp = this.maxTowerHp;
        this.updateHUD();
        window.soundManager.playUpgrade();
        this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '❤️ FULLY HEALED!', '#00ff88');
      });
    }

    // God Mode Toggle
    if (this.adminGodModeBtn) {
      this.adminGodModeBtn.addEventListener('click', () => {
        this.godMode = !this.godMode;
        if (this.godMode) {
          this.adminGodModeBtn.textContent = '🛡️ God Mode: ON';
          this.adminGodModeBtn.classList.add('active');
          this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '🛡️ GOD MODE ACTIVATED', '#ff007f');
        } else {
          this.adminGodModeBtn.textContent = '🛡️ God Mode: OFF';
          this.adminGodModeBtn.classList.remove('active');
          this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '🛡️ God Mode Disabled', '#8ca0ba');
        }
      });
    }

    // Target Slot Selector Chips
    const slotChips = document.querySelectorAll('.admin-slot-chip');
    slotChips.forEach(chip => {
      chip.addEventListener('click', () => {
        slotChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.adminTargetSlot = parseInt(chip.dataset.slot) || 0;
        this.updateAdminPanelSlotView();
      });
    });

    // Force Equip Button (allows placing weapons you didn't buy into crates)
    const forceEquipBtn = document.getElementById('admin-force-equip-btn');
    if (forceEquipBtn) {
      forceEquipBtn.addEventListener('click', () => {
        this.adminForceEquip();
      });
    }

    // Clear Slot Button
    const clearSlotBtn = document.getElementById('admin-clear-slot-btn');
    if (clearSlotBtn) {
      clearSlotBtn.addEventListener('click', () => {
        this.adminClearSlot();
      });
    }

    // Level Chips (set upgrades)
    const levelChips = document.querySelectorAll('.level-chip');
    levelChips.forEach(chip => {
      chip.addEventListener('click', () => {
        levelChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const lvl = parseInt(chip.dataset.lvl) || 0;
        this.adminSetLevel(lvl);
      });
    });

    // Max Current Weapon Button
    const maxCurrentBtn = document.getElementById('admin-max-current-wep-btn');
    if (maxCurrentBtn) {
      maxCurrentBtn.addEventListener('click', () => {
        this.adminMaxTargetWeapon();
      });
    }

    // Max All Weapons Button
    const maxAllBtn = document.getElementById('admin-max-all-weps-btn');
    if (maxAllBtn) {
      maxAllBtn.addEventListener('click', () => {
        this.adminMaxAllWeapons();
      });
    }

    // SPAWN 1x1x1 SECRET BOSS Button
    const spawn1x1x1Btn = document.getElementById('admin-spawn-1x1x1-btn');
    if (spawn1x1x1Btn) {
      spawn1x1x1Btn.addEventListener('click', () => {
        this.adminSpawn1x1x1();
      });
    }

    // Kill All Enemies Button
    const killAllBtn = document.getElementById('admin-kill-all-btn');
    if (killAllBtn) {
      killAllBtn.addEventListener('click', () => {
        this.adminKillAllEnemies();
      });
    }

    // Force Next Wave Button
    const nextWaveBtn = document.getElementById('admin-next-wave-btn');
    if (nextWaveBtn) {
      nextWaveBtn.addEventListener('click', () => {
        this.enemies = [];
        this.waveSpawnsRemaining = [];
        this.startWave(this.wave + 1);
        this.addDamageText(this.towerBaseX + 35, this.groundY - 140, `🌊 WAVE ${this.wave} STARTED!`, '#00f3ff');
      });
    }

    // Jump Wave Button
    const jumpWaveBtn = document.getElementById('admin-wave-jump-btn');
    const jumpWaveInput = document.getElementById('admin-wave-jump-input');
    if (jumpWaveBtn && jumpWaveInput) {
      jumpWaveBtn.addEventListener('click', () => {
        const targetWave = parseInt(jumpWaveInput.value) || 1;
        if (targetWave >= 1) {
          this.enemies = [];
          this.waveSpawnsRemaining = [];
          this.startWave(targetWave);
          this.addDamageText(this.towerBaseX + 35, this.groundY - 140, `⏩ JUMPED TO WAVE ${targetWave}!`, '#00f3ff');
        }
      });
    }
  }

  openAdminAuthModal() {
    this.adminPassInput.value = '';
    this.adminAuthError.classList.add('hidden');
    this.adminAuthModal.classList.remove('hidden');
    setTimeout(() => this.adminPassInput.focus(), 50);
  }

  verifyAdminPassword() {
    const val = (this.adminPassInput.value || '').trim();
    if (val === 'adminpanel123') {
      this.isAdminAuthenticated = true;
      this.adminAuthModal.classList.add('hidden');
      this.adminAuthError.classList.add('hidden');
      this.openAdminPanel();
    } else {
      this.adminAuthError.classList.remove('hidden');
      this.adminPassInput.value = '';
      this.adminPassInput.focus();
    }
  }

  openAdminPanel() {
    if (!this.isAdminAuthenticated) return;
    this.adminPanelModal.classList.remove('hidden');
    this.updateAdminPanelSlotView();
  }

  updateAdminPanelSlotView() {
    const slot = this.slots[this.adminTargetSlot];
    if (this.adminTargetSlotName) {
      this.adminTargetSlotName.textContent = `Crate ${this.adminTargetSlot + 1}`;
    }
    if (this.adminTargetSlotWep) {
      if (slot && slot.weapon) {
        const wep = WEAPON_REGISTRY[slot.weapon];
        const stars = '★'.repeat(slot.level);
        this.adminTargetSlotWep.textContent = `${wep.icon} ${wep.name} (Lv.${slot.level} ${stars})`;
        this.adminTargetSlotWep.style.color = '#00f3ff';
      } else {
        this.adminTargetSlotWep.textContent = 'Empty';
        this.adminTargetSlotWep.style.color = '#8ca0ba';
      }
    }

    // Update level chips
    const levelChips = document.querySelectorAll('.level-chip');
    levelChips.forEach(chip => {
      const lvl = parseInt(chip.dataset.lvl);
      if (slot && slot.weapon) {
        chip.classList.toggle('active', lvl === slot.level);
      } else {
        chip.classList.toggle('active', lvl === this.adminSelectedLevel);
      }
    });
  }

  adminForceEquip() {
    const weaponId = this.adminWeaponSelect ? this.adminWeaponSelect.value : null;
    if (!weaponId || !WEAPON_REGISTRY[weaponId]) return;
    const wep = WEAPON_REGISTRY[weaponId];
    const slot = this.slots[this.adminTargetSlot];

    slot.weapon = weaponId;
    slot.level = Math.min(this.adminSelectedLevel, wep.maxUpgrades);
    slot.timer = 0;
    slot.subTimer = 0;

    window.soundManager.playUpgrade();
    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
    this.updateAdminPanelSlotView();

    const coords = this.getSlotCoords(this.adminTargetSlot);
    this.createExplosionParticles(coords.x + 30, coords.y, '#00f3ff', 25);
    this.addDamageText(coords.x + 30, coords.y - 20, `⚡ EQUIPPED ${wep.name.toUpperCase()}!`, '#00f3ff');
  }

  adminClearSlot() {
    const slot = this.slots[this.adminTargetSlot];
    slot.weapon = null;
    slot.level = 0;
    slot.timer = 0;
    slot.subTimer = 0;

    window.soundManager.playCoin();
    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
    this.updateAdminPanelSlotView();
  }

  adminSetLevel(lvl) {
    this.adminSelectedLevel = lvl;
    const slot = this.slots[this.adminTargetSlot];
    if (slot && slot.weapon) {
      const wep = WEAPON_REGISTRY[slot.weapon];
      slot.level = Math.min(lvl, wep.maxUpgrades);
      window.soundManager.playUpgrade();
      this.updateHUD();
      this.renderCrateSlotsUI();
      this.updateInspector();
    }
    this.updateAdminPanelSlotView();
  }

  adminMaxTargetWeapon() {
    const slot = this.slots[this.adminTargetSlot];
    if (slot && slot.weapon) {
      const wep = WEAPON_REGISTRY[slot.weapon];
      slot.level = wep.maxUpgrades;
      window.soundManager.playUpgrade();
      this.updateHUD();
      this.renderCrateSlotsUI();
      this.updateInspector();
      this.updateAdminPanelSlotView();
      const coords = this.getSlotCoords(this.adminTargetSlot);
      this.createExplosionParticles(coords.x + 30, coords.y, '#ffd166', 30);
      this.addDamageText(coords.x + 30, coords.y - 20, '⭐ MAXED OUT!', '#ffd166');
    }
  }

  adminMaxAllWeapons() {
    let upgradedAny = false;
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.weapon) {
        const wep = WEAPON_REGISTRY[slot.weapon];
        slot.level = wep.maxUpgrades;
        upgradedAny = true;
        const coords = this.getSlotCoords(i);
        this.createExplosionParticles(coords.x + 30, coords.y, '#ff007f', 20);
      }
    }
    if (upgradedAny) {
      window.soundManager.playUpgrade();
      this.updateHUD();
      this.renderCrateSlotsUI();
      this.updateInspector();
      this.updateAdminPanelSlotView();
      this.addDamageText(this.towerBaseX + 35, this.groundY - 180, '🌟 ALL 5 CRATES MAXED!', '#00f3ff');
    }
  }

  adminAddCoins(amount) {
    this.coins += amount;
    window.soundManager.playCoin();
    this.updateHUD();
    this.updateInspector();
    this.addDamageText(this.towerBaseX + 35, this.groundY - 140, `+${amount.toLocaleString()}🪙`, '#ffd166');
  }

  adminSpawn1x1x1() {
    this.spawnEnemy('boss_1x1x1');
    window.soundManager.playExplosion();
    this.cameraShake = 0.3;
    this.addDamageText(this.canvas.width - 150, this.groundY - 100, '👾 1x1x1 SPAWNED! (1,000🪙)', '#00f3ff');
  }

  adminKillAllEnemies() {
    if (this.enemies.length === 0) return;
    window.soundManager.playExplosion();
    this.cameraShake = 0.25;
    for (let enemy of this.enemies) {
      this.coins += enemy.coinReward;
      this.createExplosionParticles(enemy.x, enemy.y, enemy.color, 15);
      this.addDamageText(enemy.x, enemy.y - 15, `+${enemy.coinReward}🪙`, '#ffd166');
    }
    this.enemies = [];
    this.updateHUD();
    this.updateInspector();
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
      if (currentStats.chainCount) {
        statsHtml += `<span>Chains: <b>${currentStats.chainCount}</b></span>`;
      }
      if (currentStats.slamRadius) {
        statsHtml += `<span>Radius: <b>${currentStats.slamRadius}px</b></span>`;
      }
      if (currentStats.slowDuration) {
        statsHtml += `<span>Slow: <b>${currentStats.slowDuration}s</b></span>`;
      }
      if (currentStats.vortexRadius) {
        statsHtml += `<span>Zone: <b>${currentStats.vortexRadius}px</b></span>`;
      }
      if (currentStats.pullStrength) {
        statsHtml += `<span>Pull: <b>${currentStats.pullStrength}</b></span>`;
      }
      if (currentStats.sawRadius) {
        statsHtml += `<span>Saw: <b>${currentStats.sawRadius}px</b></span>`;
      }
      if (currentStats.pellets) {
        statsHtml += `<span>Pellets: <b>${currentStats.pellets}</b></span>`;
      }
      if (currentStats.poolDps) {
        statsHtml += `<span>Pool: <b>${currentStats.poolDps}/s</b></span>`;
      }
      if (currentStats.giantBonus) {
        statsHtml += `<span>Giant: <b>${currentStats.giantBonus}×</b></span>`;
      }
      if (currentStats.flareDamage) {
        statsHtml += `<span>Nova: <b>${currentStats.flareDamage}</b></span>`;
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
  // ENEMY ROSTER:
  //  Scout Crawler     — weakest, wave 1+
  //  Fast Runner       — agile, wave 2+
  //  Armored Brute     — slow tank, wave 3+
  //  Acid Spitter      — ranged attacker, wave 4+
  //  Swarm Drone       — tiny fast cluster enemy, wave 4+
  //  Poison Crawler    — leaves DoT effect on tower, wave 5+
  //  Shadow Stalker    — cloaking flanker, wave 6+
  //  Berserker         — gets stronger as HP drops, wave 7+
  //  Shield Bearer     — reduces frontal damage, wave 8+
  //  Necromancer       — ranged caster that summons minions, wave 9+
  //  Titan Mutator     — massive juggernaut, wave 5+
  //  BOSS: War Chief       — standard boss, odd waves 5+
  //  BOSS: Doom Colossus   — earthquake boss, waves 7, 14, 21...
  //  BOSS: Phantom Overlord— teleporting boss, waves 9, 18, 27...
  //  BOSS: Inferno Wyrm    — fire dragon boss, waves 15, 25, 35...

  startWave(waveNum) {
    this.wave = waveNum;
    this.isWaveActive = true;
    this.updateHUD();

    this.waveSpawnsRemaining = [];

    // ---- WAVE COMPOSITION TABLE ----
    // Each wave is carefully designed with themed compositions.
    // After wave 20, waves loop with escalating difficulty modifiers.

    const waveTable = this.getWaveComposition(waveNum);

    for (const entry of waveTable) {
      const delay = entry.delay || (1.3 + Math.random() * 1.4);
      this.waveSpawnsRemaining.push({ type: entry.type, delay });
    }

    this.spawnTimer = 2.0; // 2.0s preparation pause before first wave enemy
  }

  getWaveComposition(waveNum) {
    const spawns = [];

    // Helper: push N enemies of a type with optional delay
    const add = (type, count, delay) => {
      for (let i = 0; i < count; i++) {
        spawns.push({ type, delay: delay || (1.3 + Math.random() * 1.4) });
      }
    };

    // Helper: push random pick from weighted array
    const addWeighted = (count, weights, delay) => {
      // weights: [{ type, weight }]
      const totalW = weights.reduce((s, w) => s + w.weight, 0);
      for (let i = 0; i < count; i++) {
        let roll = Math.random() * totalW;
        let chosen = weights[0].type;
        for (const w of weights) {
          roll -= w.weight;
          if (roll <= 0) { chosen = w.type; break; }
        }
        spawns.push({ type: chosen, delay: delay || (1.3 + Math.random() * 1.4) });
      }
    };

    // Determine boss for this wave (if any)
    const getBossType = (w) => {
      if (w >= 15 && w % 10 === 5) return 'inferno_wyrm';    // Wave 15, 25, 35...
      if (w >= 9 && w % 9 === 0) return 'phantom_overlord';   // Wave 9, 18, 27...
      if (w >= 7 && w % 7 === 0) return 'doom_colossus';      // Wave 7, 14, 21...
      if (w >= 5 && w % 2 === 1) return 'boss';               // Odd waves 5+
      return null;
    };

    switch (waveNum) {
      case 1: // Tutorial: Pure scouts
        add('scout', 10);
        break;

      case 2: // Intro runners
        add('scout', 7);
        add('runner', 5);
        break;

      case 3: // Armored introduction
        add('scout', 5);
        add('runner', 5);
        add('armored', 3);
        break;

      case 4: // Spitters & swarm drones debut
        add('scout', 4);
        add('runner', 4);
        add('armored', 3);
        add('spitter', 3);
        add('swarm_drone', 6, 0.4);
        break;

      case 5: // First boss wave! + tanks + poison crawlers
        add('runner', 6);
        add('armored', 4);
        add('spitter', 3);
        add('poison_crawler', 3);
        add('tank', 1);
        add('boss', 1);
        break;

      case 6: // Shadow stalker debut — ambush wave
        add('scout', 4);
        add('runner', 5);
        add('shadow_stalker', 5, 1.8);
        add('armored', 3);
        add('spitter', 3);
        break;

      case 7: // Doom Colossus boss + berserker debut
        add('runner', 6);
        add('armored', 4);
        add('berserker', 4);
        add('spitter', 3);
        add('tank', 2);
        add('doom_colossus', 1);
        break;

      case 8: // Shield bearer debut — defense wave
        add('scout', 5);
        add('shield_bearer', 5);
        add('armored', 4);
        add('berserker', 3);
        add('spitter', 4);
        add('poison_crawler', 3);
        break;

      case 9: // Necromancer debut + Phantom Overlord boss
        add('runner', 5);
        add('necromancer', 3, 2.5);
        add('shadow_stalker', 4);
        add('shield_bearer', 3);
        add('armored', 3);
        add('phantom_overlord', 1);
        break;

      case 10: // SWARM WAVE — massive drone assault
        add('swarm_drone', 25, 0.3);
        add('runner', 6);
        add('poison_crawler', 4);
        add('spitter', 3);
        break;

      case 11: // War Chief returns with elite guard
        add('berserker', 5);
        add('shield_bearer', 4);
        add('necromancer', 2);
        add('tank', 3);
        add('shadow_stalker', 3);
        add('boss', 1);
        break;

      case 12: // TANK RUSH — heavy assault
        add('armored', 8);
        add('tank', 5);
        add('shield_bearer', 4);
        add('spitter', 4);
        break;

      case 13: // Nightmare wave — all elites
        add('berserker', 5);
        add('shadow_stalker', 5);
        add('necromancer', 3);
        add('poison_crawler', 4);
        add('shield_bearer', 3);
        add('boss', 1);
        break;

      case 14: // Doom Colossus returns with army
        add('tank', 4);
        add('berserker', 4);
        add('shield_bearer', 3);
        add('necromancer', 3);
        add('armored', 5);
        add('doom_colossus', 1);
        break;

      case 15: // INFERNO WYRM debut — fire & fury
        add('runner', 8);
        add('berserker', 5);
        add('poison_crawler', 4);
        add('shadow_stalker', 4);
        add('tank', 3);
        add('inferno_wyrm', 1);
        break;

      case 16: // BLOOD MOON — everything is buffed (handled by spawn scaling)
        add('scout', 6);
        add('runner', 6);
        add('armored', 5);
        add('berserker', 5);
        add('shadow_stalker', 4);
        add('necromancer', 3);
        add('shield_bearer', 3);
        add('swarm_drone', 10, 0.3);
        break;

      case 17: // Double boss gauntlet
        add('tank', 4);
        add('berserker', 4);
        add('shield_bearer', 4);
        add('necromancer', 2);
        add('boss', 1);
        add('doom_colossus', 1);
        break;

      case 18: // Phantom Overlord returns + swarm chaos
        add('swarm_drone', 15, 0.3);
        add('shadow_stalker', 6);
        add('necromancer', 3);
        add('poison_crawler', 4);
        add('phantom_overlord', 1);
        break;

      case 19: // ENDURANCE — relentless mixed assault
        add('runner', 8);
        add('berserker', 6);
        add('armored', 5);
        add('tank', 4);
        add('shield_bearer', 4);
        add('spitter', 5);
        add('necromancer', 3);
        add('boss', 1);
        break;

      case 20: // APOCALYPSE WAVE — triple boss!
        add('tank', 5);
        add('berserker', 6);
        add('shield_bearer', 5);
        add('necromancer', 4);
        add('shadow_stalker', 5);
        add('boss', 1);
        add('doom_colossus', 1);
        add('phantom_overlord', 1);
        break;

      default: {
        // Wave 21+ : Infinite escalation with cycling themes
        const cycle = ((waveNum - 1) % 5); // 0-4 cycle
        const baseCount = 8 + Math.floor(waveNum * 1.5);

        if (cycle === 0) {
          // Swarm theme
          add('swarm_drone', Math.floor(baseCount * 0.5), 0.3);
          addWeighted(Math.floor(baseCount * 0.5), [
            { type: 'runner', weight: 3 },
            { type: 'poison_crawler', weight: 2 },
            { type: 'berserker', weight: 2 },
            { type: 'shadow_stalker', weight: 2 }
          ]);
        } else if (cycle === 1) {
          // Heavy assault theme
          addWeighted(baseCount, [
            { type: 'armored', weight: 3 },
            { type: 'tank', weight: 3 },
            { type: 'shield_bearer', weight: 3 },
            { type: 'berserker', weight: 2 }
          ]);
        } else if (cycle === 2) {
          // Stealth & magic theme
          addWeighted(baseCount, [
            { type: 'shadow_stalker', weight: 3 },
            { type: 'necromancer', weight: 3 },
            { type: 'poison_crawler', weight: 2 },
            { type: 'spitter', weight: 2 }
          ]);
        } else if (cycle === 3) {
          // Balanced elite theme
          addWeighted(baseCount, [
            { type: 'berserker', weight: 2 },
            { type: 'shield_bearer', weight: 2 },
            { type: 'necromancer', weight: 2 },
            { type: 'tank', weight: 2 },
            { type: 'shadow_stalker', weight: 1 },
            { type: 'spitter', weight: 1 }
          ]);
        } else {
          // Chaos theme — everything!
          addWeighted(baseCount, [
            { type: 'scout', weight: 1 },
            { type: 'runner', weight: 2 },
            { type: 'armored', weight: 2 },
            { type: 'spitter', weight: 2 },
            { type: 'swarm_drone', weight: 2 },
            { type: 'poison_crawler', weight: 2 },
            { type: 'shadow_stalker', weight: 2 },
            { type: 'berserker', weight: 2 },
            { type: 'shield_bearer', weight: 2 },
            { type: 'necromancer', weight: 1 },
            { type: 'tank', weight: 1 }
          ]);
        }

        // Add boss at end based on wave number pattern
        const bossType = getBossType(waveNum);
        if (bossType) {
          add(bossType, 1);
        }

        // Every 10 waves past 20, add an extra boss
        if (waveNum % 10 === 0 && waveNum > 20) {
          add('inferno_wyrm', 1);
        }
        break;
      }
    }

    // Shuffle the spawns (except last entry if it's a boss — keep boss at end)
    const lastEntry = spawns[spawns.length - 1];
    const isBossLast = lastEntry && ['boss', 'doom_colossus', 'phantom_overlord', 'inferno_wyrm'].includes(lastEntry.type);

    if (isBossLast && spawns.length > 1) {
      const bossEntry = spawns.pop();
      // Shuffle non-boss entries
      for (let i = spawns.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [spawns[i], spawns[j]] = [spawns[j], spawns[i]];
      }
      spawns.push(bossEntry);
    } else {
      for (let i = spawns.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [spawns[i], spawns[j]] = [spawns[j], spawns[i]];
      }
    }

    return spawns;
  }

  spawnEnemy(type) {
    const startX = this.canvas.width + 30;
    const groundLevel = this.groundY;

    // Scaling factor for infinite waves — enemies get tougher past wave 20
    const lateScale = this.wave > 20 ? 1 + (this.wave - 20) * 0.08 : 1;
    // Blood Moon buff for wave 16 and every 16th wave after
    const isBloodMoon = this.wave % 16 === 0;
    const bloodMoonMult = isBloodMoon ? 1.4 : 1;

    let hp = 5;
    let speed = 40;
    let size = 22;
    let coinReward = 3;
    let color = '#38b000';
    let name = 'Scout Crawler';
    let attackDamage = 5;
    let attackInterval = 1.2;
    let attackRange = 0; // 0 = melee against crates, >0 = ranged
    let enemyType = type;

    // Special enemy flags
    let cloakAlpha = 1.0;          // For shadow stalkers
    let shieldHp = 0;              // For shield bearers
    let maxShieldHp = 0;
    let berserkerRage = false;     // For berserkers
    let poisonDps = 0;             // For poison crawlers
    let summonTimer = 0;           // For necromancers
    let summonInterval = 0;
    let teleportTimer = 0;         // For phantom overlord
    let teleportInterval = 0;
    let fireBreathTimer = 0;       // For inferno wyrm
    let fireBreathInterval = 0;
    let quakeTimer = 0;            // For doom colossus
    let quakeInterval = 0;
    let glitchAttackTimer = 0;     // For 1x1x1 secret boss
    let glitchAttackInterval = 0;

    if (type === 'scout') {
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
      attackRange = 260;
    } else if (type === 'swarm_drone') {
      // Tiny, fast, comes in clusters — low HP but overwhelming numbers
      hp = 3 + this.wave * 1;
      speed = 110 + Math.random() * 30;
      size = 12;
      coinReward = 1;
      color = '#adb5bd';
      name = 'Swarm Drone';
      attackDamage = 3 + Math.floor(this.wave * 0.5);
      attackInterval = 0.6;
    } else if (type === 'poison_crawler') {
      // Leaves poison effect — damages tower over time when attacking
      hp = 18 + this.wave * 5;
      speed = 38;
      size = 22;
      coinReward = 7;
      color = '#70e000';
      name = 'Poison Crawler';
      attackDamage = 5 + this.wave;
      attackInterval = 1.5;
      poisonDps = 3 + this.wave * 0.5; // extra DPS applied each attack tick
    } else if (type === 'shadow_stalker') {
      // Cloaks while moving — becomes partially invisible, harder to hit
      hp = 25 + this.wave * 5;
      speed = 72;
      size = 20;
      coinReward = 8;
      color = '#4a4e69';
      name = 'Shadow Stalker';
      attackDamage = 12 + this.wave * 1.5;
      attackInterval = 0.8;
      cloakAlpha = 0.2; // nearly invisible while moving
    } else if (type === 'berserker') {
      // Gets faster and hits harder as HP drops
      hp = 45 + this.wave * 10;
      speed = 50;
      size = 26;
      coinReward = 12;
      color = '#d62828';
      name = 'Berserker';
      attackDamage = 16 + this.wave * 2;
      attackInterval = 1.0;
      berserkerRage = true;
    } else if (type === 'shield_bearer') {
      // Has a regenerating frontal shield that absorbs damage
      hp = 30 + this.wave * 8;
      speed = 28;
      size = 28;
      coinReward = 11;
      color = '#457b9d';
      name = 'Shield Bearer';
      attackDamage = 10 + this.wave * 1.5;
      attackInterval = 1.3;
      shieldHp = 20 + this.wave * 5;
      maxShieldHp = shieldHp;
    } else if (type === 'necromancer') {
      // Ranged caster that periodically summons scout minions
      hp = 40 + this.wave * 8;
      speed = 25;
      size = 26;
      coinReward = 15;
      color = '#7209b7';
      name = 'Necromancer';
      attackDamage = 8 + this.wave;
      attackInterval = 2.0;
      attackRange = 300;
      summonInterval = 6.0; // summons a minion every 6s
      summonTimer = 3.0; // first summon after 3s
    } else if (type === 'tank') {
      hp = 335 + this.wave * 135;
      speed = 15;
      size = 42;
      coinReward = 28;
      color = '#ef476f';
      name = 'Titan Mutator';
      attackDamage = 24 + this.wave * 3;
      attackInterval = 1.6;
    } else if (type === 'boss') {
      hp = 1125 + this.wave * 450;
      speed = 13.5;
      size = 56;
      coinReward = 100;
      color = '#ff0054';
      name = '⚔ WAR CHIEF';
      attackDamage = 42 + this.wave * 6;
      attackInterval = 1.4;
    } else if (type === 'doom_colossus') {
      // Earthquake boss — periodically shakes screen and deals AoE to tower
      hp = 2000 + this.wave * 600;
      speed = 10;
      size = 68;
      coinReward = 150;
      color = '#6b2d10';
      name = '💀 DOOM COLOSSUS';
      attackDamage = 55 + this.wave * 8;
      attackInterval = 1.6;
      quakeInterval = 8.0;
      quakeTimer = 5.0;
    } else if (type === 'phantom_overlord') {
      // Teleporting boss — phases in and out, hard to target
      hp = 1500 + this.wave * 500;
      speed = 20;
      size = 52;
      coinReward = 140;
      color = '#560bad';
      name = '👻 PHANTOM OVERLORD';
      attackDamage = 38 + this.wave * 5;
      attackInterval = 1.2;
      teleportInterval = 5.0;
      teleportTimer = 3.0;
      cloakAlpha = 0.7;
    } else if (type === 'inferno_wyrm') {
      // Fire dragon boss — breathes fire at tower periodically
      hp = 3000 + this.wave * 800;
      speed = 12;
      size = 74;
      coinReward = 200;
      color = '#ff4800';
      name = '🐉 INFERNO WYRM';
      attackDamage = 65 + this.wave * 10;
      attackInterval = 1.8;
      attackRange = 200;
      fireBreathInterval = 6.0;
      fireBreathTimer = 4.0;
    } else if (type === 'boss_1x1x1' || type === '1x1x1') {
      // Secret 1x1x1 Boss - Glitch Corrupted Entity
      hp = 3500 + this.wave * 500;
      speed = 13;
      size = 64;
      coinReward = 1000; // Gives 1000 coins on defeat!
      color = '#00f3ff';
      name = '⬛ 1x1x1';
      attackDamage = 50 + this.wave * 5;
      attackInterval = 1.4;
      attackRange = 250;
      glitchAttackInterval = 4.0;
      glitchAttackTimer = 2.0;
    }

    // Apply late-game scaling and blood moon
    hp = Math.floor(hp * lateScale * bloodMoonMult);
    attackDamage = Math.floor(attackDamage * lateScale * bloodMoonMult);
    coinReward = Math.floor(coinReward * lateScale);

    // Guaranteed 1,000 coins for secret 1x1x1 boss
    if (type === 'boss_1x1x1' || type === '1x1x1') {
      coinReward = 1000;
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
      hitFlash: 0,
      // Special properties
      cloakAlpha: cloakAlpha,
      shieldHp: shieldHp,
      maxShieldHp: maxShieldHp,
      berserkerRage: berserkerRage,
      poisonDps: poisonDps,
      summonTimer: summonTimer,
      summonInterval: summonInterval,
      teleportTimer: teleportTimer,
      teleportInterval: teleportInterval,
      fireBreathTimer: fireBreathTimer,
      fireBreathInterval: fireBreathInterval,
      quakeTimer: quakeTimer,
      quakeInterval: quakeInterval,
      glitchAttackTimer: glitchAttackTimer,
      glitchAttackInterval: glitchAttackInterval,
      rot3d: 0,
      floatOffset: 0,
      phaseAlpha: 1.0 // for phantom overlord phasing visual
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
        const waveThemes = {
          10: '🐝 SWARM WAVE SURVIVED!',
          12: '🪖 TANK RUSH SURVIVED!',
          13: '💀 NIGHTMARE SURVIVED!',
          15: '🐉 INFERNO WYRM SLAIN!',
          16: '🩸 BLOOD MOON SURVIVED!',
          17: '⚔ BOSS GAUNTLET CLEARED!',
          20: '☠ APOCALYPSE SURVIVED!'
        };
        const themeTitle = waveThemes[this.wave];
        this.overlayTitle.innerText = themeTitle || `WAVE ${this.wave} CLEARED!`;
        const bonusCoins = 15 + this.wave * 5 + (this.wave >= 10 ? this.wave * 3 : 0);
        this.overlaySub.innerText = `Great defense! +${bonusCoins} bonus coins.`;
        this.coins += bonusCoins;
        // Bonus tower heal every 5 waves
        if (this.wave % 5 === 0) {
          const healAmount = Math.min(50 + this.wave * 5, this.maxTowerHp - this.towerHp);
          if (healAmount > 0) {
            this.towerHp += healAmount;
            this.overlaySub.innerText += ` Tower healed +${healAmount} HP!`;
          }
        }
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

    // Camera shake decay
    if (this.cameraShake > 0) {
      this.cameraShake -= dt;
      if (this.cameraShake < 0) this.cameraShake = 0;
    }

    // 3. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      // Saw Projectile (Buzz Saw boomerang)
      if (p.type === 'saw') {
        p.rotAngle = (p.rotAngle || 0) + 30 * dt;
        p.lifetime -= dt;

        // Decrement hit cooldowns
        if (p.hitCooldowns) {
          for (let [enemy, cd] of p.hitCooldowns.entries()) {
            if (cd - dt <= 0) p.hitCooldowns.delete(enemy);
            else p.hitCooldowns.set(enemy, cd - dt);
          }
        }

        // Move saw forward or return
        if (!p.returning) {
          p.x += p.vx * dt;
          if (p.x >= p.originX + p.range) {
            p.returning = true;
            p.vx = -p.sawSpeed;
          }
        } else {
          p.x += p.vx * dt;
          if (p.x <= p.originX) {
            // Returned to crate launcher!
            this.projectiles.splice(i, 1);
            continue;
          }
        }

        // Spark trail
        if (Math.random() < 0.4) {
          this.particles.push({
            x: p.x + (Math.random() - 0.5) * 8,
            y: p.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            color: '#ffd166',
            radius: 2,
            life: 0.18,
            maxLife: 0.18
          });
        }

        // Damage all enemies it touches (with individual cooldown)
        for (let e of this.enemies) {
          const dx = p.x - e.x;
          const dy = p.y - e.y;
          const dist = Math.hypot(dx, dy);

          if (dist < e.size / 2 + p.radius) {
            if (!p.hitCooldowns.has(e)) {
              p.hitCooldowns.set(e, 0.28);
              this.damageEnemy(e, p.damage, '#ffd166');
              this.createExplosionParticles(e.x, e.y, '#e0e1dd', 4);
              window.soundManager.playSaw();
            }
          }
        }

        if (p.lifetime <= 0) {
          this.projectiles.splice(i, 1);
        }
        continue;
      }

      // Mortar Shell (Orbital Mortar parabolic trajectory)
      if (p.type === 'mortar') {
        p.arcTime += dt;
        const t = Math.min(1.0, p.arcTime / p.maxArcTime);
        p.x = p.startX + (p.targetX - p.startX) * t;
        const linearY = p.startY + (p.targetY - p.startY) * t;
        const arcOffset = 4 * p.arcHeight * t * (1 - t);
        p.y = linearY - arcOffset;

        // Smoke and fiery spark trail
        if (Math.random() < 0.6) {
          this.particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 20,
            vy: Math.random() * 15,
            color: Math.random() > 0.4 ? '#ff7b00' : '#495057',
            radius: 3 + Math.random() * 3,
            life: 0.3,
            maxLife: 0.3
          });
        }

        if (t >= 1.0) {
          this.cameraShake = 0.25;
          window.soundManager.playExplosion();
          this.createExplosionParticles(p.targetX, p.targetY, '#ff5400', 30);
          this.createExplosionParticles(p.targetX, p.targetY, '#c77dff', 20);

          // AoE blast damage
          for (let e of this.enemies) {
            const d = Math.hypot(e.x - p.targetX, e.y - p.targetY);
            if (d <= p.blastRadius + e.size / 2) {
              this.damageEnemy(e, p.damage, '#ff5400');
            }
          }

          // Spawn lingering boiling plasma pool
          this.plasmaPools.push({
            x: p.targetX,
            y: this.groundY,
            radius: p.blastRadius * 0.75,
            duration: p.poolDuration,
            maxDuration: p.poolDuration,
            dps: p.poolDps,
            tickTimer: 0
          });

          this.projectiles.splice(i, 1);
          continue;
        }
        continue;
      }

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

    // 4b. Update Lightning Arcs (Tesla Coil)
    for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
      const arc = this.lightningArcs[i];
      arc.lifetime -= dt;
      if (arc.lifetime <= 0) {
        this.lightningArcs.splice(i, 1);
      }
    }

    // 4c. Update Plasma Pools (Orbital Mortar)
    for (let i = this.plasmaPools.length - 1; i >= 0; i--) {
      const pool = this.plasmaPools[i];
      pool.duration -= dt;
      pool.tickTimer += dt;

      // Boiling plasma particles
      if (Math.random() < 0.45) {
        const px = pool.x + (Math.random() - 0.5) * pool.radius * 2;
        this.particles.push({
          x: px,
          y: pool.y - Math.random() * 8,
          vx: (Math.random() - 0.5) * 20,
          vy: -20 - Math.random() * 35,
          color: Math.random() > 0.5 ? '#ff5400' : '#c77dff',
          radius: 3 + Math.random() * 4,
          life: 0.35,
          maxLife: 0.35
        });
      }

      if (pool.tickTimer >= 0.25) {
        pool.tickTimer = 0;
        const tickDmg = pool.dps * 0.25;
        for (let enemy of this.enemies) {
          if (Math.abs(enemy.x - pool.x) <= pool.radius + enemy.size / 2) {
            this.damageEnemy(enemy, tickDmg, '#ff7b00');
          }
        }
      }

      if (pool.duration <= 0) {
        this.plasmaPools.splice(i, 1);
      }
    }

    // 5. Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.hitFlash > 0) enemy.hitFlash -= dt;

      // === BERSERKER RAGE: Speed & damage increase as HP drops ===
      if (enemy.berserkerRage) {
        const hpRatio = enemy.hp / enemy.maxHp;
        const rageMult = 1 + (1 - hpRatio) * 1.5; // up to 2.5x at near-death
        enemy.speed = (50 + (this.wave > 20 ? 10 : 0)) * rageMult;
        // Visual: color shifts to brighter red as rage increases
        const rageIntensity = Math.floor((1 - hpRatio) * 200);
        enemy.color = `rgb(${Math.min(255, 214 + rageIntensity)}, ${Math.max(0, 40 - rageIntensity)}, ${Math.max(0, 40 - rageIntensity)})`;
      }

      // === SHADOW STALKER: Cloak while moving ===
      if (enemy.type === 'shadow_stalker') {
        const meleeX = this.towerBaseX + this.crateWidth / 2 + enemy.size / 2;
        if (enemy.x > meleeX + 20) {
          enemy.cloakAlpha = 0.15 + Math.sin(performance.now() / 300) * 0.1;
        } else {
          enemy.cloakAlpha = 0.8; // becomes more visible when attacking
        }
      }

      // === PHANTOM OVERLORD: Teleport behavior ===
      if (enemy.teleportInterval > 0) {
        enemy.teleportTimer -= dt;
        if (enemy.teleportTimer <= 0) {
          enemy.teleportTimer = enemy.teleportInterval;
          // Teleport to a random x position (still ahead of tower)
          const minX = this.towerBaseX + 100;
          const maxX = this.canvas.width - 50;
          const newX = minX + Math.random() * (maxX - minX);
          this.createExplosionParticles(enemy.x, enemy.y, '#560bad', 20);
          enemy.x = newX;
          enemy.phaseAlpha = 0.1; // fade in effect
          this.createExplosionParticles(enemy.x, enemy.y, '#9b5de5', 15);
        }
        // Fade in after teleport
        if (enemy.phaseAlpha < 1.0) {
          enemy.phaseAlpha = Math.min(1.0, enemy.phaseAlpha + dt * 2.0);
        }
      }

      // === NECROMANCER: Summon minions ===
      if (enemy.summonInterval > 0 && enemy.hp > 0) {
        enemy.summonTimer -= dt;
        if (enemy.summonTimer <= 0) {
          enemy.summonTimer = enemy.summonInterval;
          // Spawn a scout minion near the necromancer
          this.createExplosionParticles(enemy.x + 20, enemy.y, '#7209b7', 12);
          const minionHp = 5 + this.wave * 2;
          this.enemies.push({
            type: 'scout', name: 'Summoned Scout',
            x: enemy.x + 30, y: this.groundY - 10,
            hp: minionHp, maxHp: minionHp,
            speed: 55, size: 16, coinReward: 1,
            color: '#b388ff', // purple-tinted summoned scout
            attackDamage: 4 + this.wave, attackInterval: 1.2,
            attackRange: 0, attackCooldown: 0.5, hitFlash: 0,
            cloakAlpha: 1.0, shieldHp: 0, maxShieldHp: 0,
            berserkerRage: false, poisonDps: 0,
            summonTimer: 0, summonInterval: 0,
            teleportTimer: 0, teleportInterval: 0,
            fireBreathTimer: 0, fireBreathInterval: 0,
            quakeTimer: 0, quakeInterval: 0, phaseAlpha: 1.0
          });
        }
      }

      // === DOOM COLOSSUS: Earthquake AoE ===
      if (enemy.quakeInterval > 0 && enemy.hp > 0) {
        enemy.quakeTimer -= dt;
        if (enemy.quakeTimer <= 0) {
          enemy.quakeTimer = enemy.quakeInterval;
          const quakeDmg = 15 + this.wave * 3;
          if (!this.godMode) {
            this.towerHp -= quakeDmg;
          }
          // Screen shake particles
          for (let q = 0; q < 5; q++) {
            const qx = this.towerBaseX + Math.random() * this.crateWidth;
            const qy = this.groundY - Math.random() * (this.crateHeight * 5);
            this.createExplosionParticles(qx, qy, '#6b2d10', 8);
          }
          this.addDamageText(this.towerBaseX + 35, this.groundY - 120, `QUAKE -${quakeDmg}`, '#ff6b35');
          window.soundManager.playExplosion();
          if (this.towerHp <= 0) { this.towerHp = 0; this.triggerGameOver(); }
          this.updateHUD();
        }
      }

      // === INFERNO WYRM: Fire breath at tower ===
      if (enemy.fireBreathInterval > 0 && enemy.hp > 0) {
        enemy.fireBreathTimer -= dt;
        if (enemy.fireBreathTimer <= 0) {
          enemy.fireBreathTimer = enemy.fireBreathInterval;
          const fireDmg = 50;
          if (!this.godMode) {
            this.towerHp -= fireDmg;
          }
          // Fire breath particle spray
          for (let f = 0; f < 20; f++) {
            const angle = Math.PI + (Math.random() - 0.5) * 0.8;
            this.particles.push({
              x: enemy.x - enemy.size / 2,
              y: enemy.y,
              vx: Math.cos(angle) * (200 + Math.random() * 150),
              vy: Math.sin(angle) * (100 + Math.random() * 80),
              color: Math.random() > 0.5 ? '#ff4800' : '#ffaa00',
              radius: 6 + Math.random() * 8,
              life: 0.6 + Math.random() * 0.3,
              maxLife: 0.9
            });
          }
          this.addDamageText(this.towerBaseX + 35, this.groundY - 80, `🔥 FIRE -${fireDmg}`, '#ff4800');
          window.soundManager.playFlame();
          if (this.towerHp <= 0) { this.towerHp = 0; this.triggerGameOver(); }
          this.updateHUD();
        }
      }

      // === 1x1x1 SECRET BOSS: Glitch attacks and floating motion ===
      if (enemy.type === 'boss_1x1x1' || enemy.type === '1x1x1') {
        enemy.rot3d = (enemy.rot3d || 0) + 1.8 * dt;
        enemy.floatOffset = Math.sin(performance.now() / 250) * 8;

        // Glitch digital matrix spark particles
        if (Math.random() < 0.6) {
          const colors = ['#00f3ff', '#39ff14', '#ff007f', '#ffffff'];
          const gc = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push({
            x: enemy.x + (Math.random() - 0.5) * enemy.size,
            y: enemy.y + (Math.random() - 0.5) * enemy.size,
            vx: (Math.random() - 0.5) * 60,
            vy: (Math.random() - 0.5) * 60,
            color: gc,
            radius: 2 + Math.random() * 3,
            life: 0.3,
            maxLife: 0.3
          });
        }

        if (enemy.glitchAttackInterval > 0 && enemy.hp > 0) {
          enemy.glitchAttackTimer -= dt;
          if (enemy.glitchAttackTimer <= 0) {
            enemy.glitchAttackTimer = enemy.glitchAttackInterval;
            const glitchDmg = 50;
            if (!this.godMode) {
              this.towerHp -= glitchDmg;
            }
            this.cameraShake = 0.22;
            for (let g = 0; g < 18; g++) {
              const tx = this.towerBaseX + Math.random() * this.crateWidth;
              const ty = this.groundY - Math.random() * (this.crateHeight * 5);
              this.createExplosionParticles(tx, ty, '#00f3ff', 5);
              this.createExplosionParticles(tx, ty, '#ff007f', 5);
            }
            this.addDamageText(this.towerBaseX + 35, this.groundY - 140, `GLITCH -${glitchDmg}`, '#00f3ff');
            window.soundManager.playExplosion();
            if (this.towerHp <= 0) {
              this.towerHp = 0;
              this.triggerGameOver();
            }
            this.updateHUD();
          }
        }
      }

      // Move left towards crates or stop within attack range
      const meleeTargetX = this.towerBaseX + this.crateWidth / 2 + enemy.size / 2;
      const targetStopX = enemy.attackRange > 0 ? (this.towerBaseX + enemy.attackRange) : meleeTargetX;

      // Slow debuff handling (from Graviton Hammer)
      let effectiveSpeed = enemy.speed;
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt;
        effectiveSpeed *= (enemy.slowMult || 0.5);
      }

      if (enemy.x > targetStopX) {
        enemy.x -= effectiveSpeed * dt;
      } else {
        // Attack the crates / tower
        enemy.attackCooldown -= dt;
        if (enemy.attackCooldown <= 0) {
          enemy.attackCooldown = enemy.attackInterval;
          let dmg = enemy.attackDamage || (8 + this.wave * 2);

          // Berserker bonus damage at low HP
          if (enemy.berserkerRage) {
            const hpRatio = enemy.hp / enemy.maxHp;
            dmg = dmg * (1 + (1 - hpRatio) * 1.0);
          }

          if (!this.godMode) {
            this.towerHp -= dmg;
          }
          window.soundManager.playHurt();

          // Poison crawler extra DoT
          if (enemy.poisonDps > 0) {
            if (!this.godMode) {
              this.towerHp -= enemy.poisonDps;
            }
            this.addDamageText(this.towerBaseX + this.crateWidth / 2 - 20, this.groundY - 200, `☠ -${enemy.poisonDps.toFixed(0)}`, '#70e000');
          }

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

        if (enemy.type === 'boss_1x1x1' || enemy.type === '1x1x1') {
          // Extra massive celebratory fanfare for defeating 1x1x1 secret boss
          this.createExplosionParticles(enemy.x, enemy.y, '#00f3ff', 40);
          this.createExplosionParticles(enemy.x, enemy.y, '#ff007f', 40);
          this.createExplosionParticles(enemy.x, enemy.y, '#ffd166', 40);
          this.createExplosionParticles(enemy.x, enemy.y, '#39ff14', 40);
          this.addDamageText(enemy.x, enemy.y - 45, '👑 1x1x1 DEFEATED!', '#00f3ff');
          this.addDamageText(enemy.x, enemy.y - 20, '+1,000🪙 BOSS REWARD!', '#ffd166');
          this.cameraShake = 0.35;
        } else {
          this.createExplosionParticles(enemy.x, enemy.y, enemy.color, 15);
          this.addDamageText(enemy.x, enemy.y - 15, `+${enemy.coinReward}🪙`, '#ffd166');
        }

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

      // 9. SNIPER RIFLE: high-velocity long-range precision shots
      case 'sniper': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const leadAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spawnX = muzzleX + Math.cos(leadAngle) * 30;
            const spawnY = muzzleY + Math.sin(leadAngle) * 30;
            this.fireBullet(spawnX, spawnY, leadAngle, stats.damage, stats.bulletSpeed, '#ffd166', 3.5);
            this.createExplosionParticles(spawnX, spawnY, '#ffb703', 10);
            window.soundManager.playShoot('sniper');
          }
        }
        break;
      }

      // 10. TESLA COIL: chain lightning bouncing between multiple enemies
      case 'tesla_coil': {
        slot.timer += dt;
        if (target) {
          slot.angle = Math.atan2(target.y - muzzleY, target.x - muzzleX);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            this.fireTeslaLightning(muzzleX, muzzleY, target, stats.damage, stats.chainCount, stats.chainDecay, stats.range);
            window.soundManager.playTesla();
          }
        }
        break;
      }

      // 11. BUZZ SAW: Launches returning boomerang saw blade
      case 'buzz_saw': {
        slot.timer += dt;
        if (slot.timer >= stats.interval) {
          slot.timer = 0;
          this.fireBuzzSaw(muzzleX, muzzleY, stats.damage, stats.sawSpeed, stats.range, stats.sawRadius);
          window.soundManager.playSaw();
        }
        break;
      }

      // 12. GRAVITON HAMMER: Periodic shockwave slam that slows enemies
      case 'graviton_hammer': {
        slot.timer += dt;
        const chargeProgress = Math.min(1.0, slot.timer / stats.cycleInterval);
        // Animate hammer raising back overhead as charge fills
        slot.angle = -0.35 - chargeProgress * 0.95;

        if (slot.timer >= stats.cycleInterval) {
          slot.timer = 0;
          slot.angle = 0.45; // Slam down forward
          const slamX = coords.x + this.crateWidth / 2 + 35;
          const slamY = coords.y;
          this.triggerHammerSlam(slamX, slamY, stats.damage, stats.slamRadius, stats.slowDuration);
        }
        break;
      }

      // 13. VOID RIFT: Persistent gravitational anomaly that pulls and rapidly damages enemies
      case 'void_rift': {
        slot.subTimer += dt;
        slot.angle = (slot.angle + 4.5 * dt) % (Math.PI * 2);
        const mountX = coords.x + this.crateWidth / 2 + 35;
        const mountY = coords.y;

        // Inward spiral vortex particles
        if (Math.random() < 0.65) {
          const pAngle = Math.random() * Math.PI * 2;
          const pDist = stats.vortexRadius * (0.5 + Math.random() * 0.7);
          this.particles.push({
            x: mountX + Math.cos(pAngle) * pDist,
            y: mountY + Math.sin(pAngle) * pDist,
            vx: -Math.cos(pAngle) * 95 - Math.sin(pAngle) * 75,
            vy: -Math.sin(pAngle) * 95 + Math.cos(pAngle) * 75,
            color: Math.random() > 0.5 ? '#7209b7' : '#c77dff',
            radius: 2 + Math.random() * 2.5,
            life: 0.38,
            maxLife: 0.38
          });
        }

        // Pull enemies towards the singularity
        for (let enemy of this.enemies) {
          const dx = mountX - enemy.x;
          const dy = mountY - enemy.y;
          const dist = Math.hypot(dx, dy);
          if (dist <= stats.vortexRadius * 1.5 && dist > 10) {
            const pull = stats.pullStrength * dt;
            enemy.x += (dx / dist) * pull;
            enemy.y += (dy / dist) * pull * 0.35;
          }
        }

        // Periodic damage ticks
        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          let hitAny = false;
          for (let enemy of this.enemies) {
            const dist = Math.hypot(enemy.x - mountX, enemy.y - mountY);
            if (dist <= stats.vortexRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.damage, '#9d4edd');
              hitAny = true;
            }
          }
          if (hitAny && Math.random() < 0.3) {
            window.soundManager.playVoid();
          }
        }
        break;
      }

      // 14. COMBAT SHOTGUN: 5-pellet close/mid-range spread
      case 'shotgun': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const baseAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            for (let p = 0; p < stats.pellets; p++) {
              const spread = (p - (stats.pellets - 1) / 2) * (stats.spreadAngle / (stats.pellets - 1 || 1)) + (Math.random() - 0.5) * 0.05;
              const fireAngle = baseAngle + spread;
              const spawnX = muzzleX + Math.cos(fireAngle) * 22;
              const spawnY = muzzleY + Math.sin(fireAngle) * 22;
              this.fireBullet(spawnX, spawnY, fireAngle, stats.damage, stats.bulletSpeed + (Math.random() - 0.5) * 80, '#ff9e00', 3.5);
            }
            this.createExplosionParticles(muzzleX + Math.cos(baseAngle) * 22, muzzleY + Math.sin(baseAngle) * 22, '#ff5400', 10);
            window.soundManager.playShoot('shotgun');
          }
        }
        break;
      }

      // 15. CRYO CANNON: Freezing frost canister that slows enemies by 65% in an AoE
      case 'cryo_cannon': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const fireAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spawnX = muzzleX + Math.cos(fireAngle) * 26;
            const spawnY = muzzleY + Math.sin(fireAngle) * 26;
            this.fireCryoCanister(spawnX, spawnY, fireAngle, stats.damage, stats.bulletSpeed, stats.blastRadius, stats.slowAmount, stats.slowDuration);
            window.soundManager.playCryo();
          }
        }
        break;
      }

      // 16. ORBITAL MORTAR: High-arc artillery targeting densest enemy cluster + lingering plasma pool
      case 'orbital_mortar': {
        slot.timer += dt;
        slot.angle = -Math.PI / 4; // Angled upward
        if (slot.timer >= stats.interval) {
          let bestTarget = null;
          let maxDensity = -1;
          for (let e of this.enemies) {
            if (e.hp <= 0) continue;
            let count = 0;
            for (let other of this.enemies) {
              if (other.hp > 0 && Math.hypot(e.x - other.x, e.y - other.y) <= 120) count++;
            }
            if (count > maxDensity) {
              maxDensity = count;
              bestTarget = e;
            }
          }

          if (bestTarget) {
            slot.timer = 0;
            this.fireMortarShell(muzzleX, muzzleY, bestTarget.x, this.groundY - 10, stats.damage, stats.blastRadius, stats.poolDuration, stats.poolDps);
            window.soundManager.playMortarLaunch();
          }
        }
        break;
      }

      // 17. TOXIC SPRAYER: Corrosive acid spray with Giant Slayer bonus against enemies > 1000 HP
      case 'toxic_sprayer': {
        slot.subTimer += dt;
        // Spray neon acid particles
        const sprayAngle = slot.angle + (Math.random() - 0.5) * stats.coneAngle;
        this.particles.push({
          x: muzzleX,
          y: muzzleY,
          vx: Math.cos(sprayAngle) * (160 + Math.random() * 80),
          vy: Math.sin(sprayAngle) * (160 + Math.random() * 80),
          color: Math.random() > 0.4 ? '#70e000' : '#38b000',
          radius: 6 + Math.random() * 5,
          life: 0.4,
          maxLife: 0.4
        });

        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          window.soundManager.playAcid();
          for (let enemy of this.enemies) {
            const dx = enemy.x - muzzleX;
            const dy = enemy.y - muzzleY;
            const dist = Math.hypot(dx, dy);
            if (dist <= stats.range) {
              const angleToEnemy = Math.atan2(dy, dx);
              let diff = Math.abs(angleToEnemy - slot.angle);
              if (diff > Math.PI) diff = 2 * Math.PI - diff;
              if (diff <= stats.coneAngle / 2) {
                // Giant slayer perk: boost damage against enemies over 1000 health!
                let dmg = stats.damage;
                const isGiant = (enemy.maxHp >= stats.giantThreshold) || (enemy.hp >= stats.giantThreshold);
                if (isGiant) {
                  dmg *= stats.giantBonus;
                  this.damageEnemy(enemy, dmg, '#70e000');
                  if (Math.random() < 0.35) {
                    this.addDamageText(enemy.x, enemy.y - 20, '☣CRIT', '#70e000');
                  }
                } else {
                  this.damageEnemy(enemy, dmg, '#38b000');
                }
              }
            }
          }
        }
        break;
      }

      // 18. SOLAR CORE: Radiant miniature sun with heat aura + periodic solar flare nova
      case 'solar_core': {
        slot.timer += dt;
        slot.subTimer += dt;
        slot.angle = (slot.angle + 3.0 * dt) % (Math.PI * 2);
        const mountX = coords.x + this.crateWidth / 2 + 15;
        const mountY = Math.min(coords.y, this.groundY - 42);

        // Radiant solar corona particles
        if (Math.random() < 0.6) {
          const a = Math.random() * Math.PI * 2;
          const d = stats.auraRadius * (0.3 + Math.random() * 0.7);
          this.particles.push({
            x: mountX + Math.cos(a) * d,
            y: mountY + Math.sin(a) * d,
            vx: Math.cos(a) * (30 + Math.random() * 40),
            vy: Math.sin(a) * (30 + Math.random() * 40),
            color: Math.random() > 0.5 ? '#ffb703' : '#ffd166',
            radius: 2 + Math.random() * 3,
            life: 0.35,
            maxLife: 0.35
          });
        }

        // Passive heat aura damage
        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          for (let enemy of this.enemies) {
            const dist = Math.hypot(enemy.x - mountX, enemy.y - mountY);
            if (dist <= stats.auraRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.damage, '#ffb703');
            }
          }
        }

        // Solar flare nova cycle
        if (slot.timer >= stats.flareInterval) {
          slot.timer = 0;
          window.soundManager.playSolarFlare();
          this.cameraShake = 0.16;

          // Expanding golden nova ring
          this.particles.push({
            x: mountX,
            y: mountY,
            vx: 0,
            vy: 0,
            color: '#ffdd00',
            radius: stats.flareRadius,
            isRing: true,
            life: 0.4,
            maxLife: 0.4
          });

          // Solar flare damage + sunburst blind
          for (let enemy of this.enemies) {
            const dist = Math.hypot(enemy.x - mountX, enemy.y - mountY);
            if (dist <= stats.flareRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.flareDamage, '#ffb703');
              // Slow attack rate (blind)
              enemy.attackCooldown = Math.max(enemy.attackCooldown, stats.blindDuration);
              this.addDamageText(enemy.x, enemy.y - 25, '☀️ BLIND', '#ffd166');
            }
          }
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

  fireBuzzSaw(x, y, damage, speed, range, radius) {
    this.projectiles.push({
      type: 'saw',
      x: x,
      y: y,
      originX: x,
      originY: y,
      vx: speed,
      vy: 0,
      range: range,
      sawSpeed: speed,
      radius: radius,
      damage: damage,
      returning: false,
      rotAngle: 0,
      lifetime: 8.0,
      hitCooldowns: new Map()
    });
  }

  fireTeslaLightning(originX, originY, firstTarget, baseDamage, maxChains, chainDecay, range) {
    let currentTarget = firstTarget;
    let currentDamage = baseDamage;
    const hitEnemies = new Set([firstTarget]);

    // First zap from coil to initial target
    this.damageEnemy(firstTarget, currentDamage, '#00f3ff');
    this.createExplosionParticles(firstTarget.x, firstTarget.y, '#00f3ff', 8);
    this.addLightningArc(originX, originY, firstTarget.x, firstTarget.y, '#00f3ff');

    // Bounce to next enemies
    let chainsDone = 1;
    while (chainsDone < maxChains) {
      currentDamage *= chainDecay;
      let nextTarget = null;
      let minD = 190; // chain bounce radius

      for (let enemy of this.enemies) {
        if (hitEnemies.has(enemy) || enemy.hp <= 0) continue;
        const d = Math.hypot(enemy.x - currentTarget.x, enemy.y - currentTarget.y);
        if (d < minD) {
          minD = d;
          nextTarget = enemy;
        }
      }

      if (!nextTarget) break;

      hitEnemies.add(nextTarget);
      this.damageEnemy(nextTarget, currentDamage, '#c77dff');
      this.createExplosionParticles(nextTarget.x, nextTarget.y, '#c77dff', 6);
      this.addLightningArc(currentTarget.x, currentTarget.y, nextTarget.x, nextTarget.y, '#b388ff');

      currentTarget = nextTarget;
      chainsDone++;
    }
  }

  addLightningArc(x1, y1, x2, y2, color = '#00f3ff') {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(4, Math.floor(dist / 24));
    const points = [{ x: x1, y: y1 }];
    const normalX = -dy / (dist || 1);
    const normalY = dx / (dist || 1);

    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const jitter = (Math.random() - 0.5) * 22;
      points.push({
        x: x1 + dx * t + normalX * jitter,
        y: y1 + dy * t + normalY * jitter
      });
    }
    points.push({ x: x2, y: y2 });

    this.lightningArcs.push({
      points,
      color,
      lifetime: 0.28,
      maxLifetime: 0.28
    });
  }

  triggerHammerSlam(slamX, slamY, damage, radius, slowDuration) {
    this.cameraShake = 0.22;
    window.soundManager.playHammer();

    // Ground slam fissure particles
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      this.particles.push({
        x: slamX,
        y: slamY,
        vx: Math.cos(angle) * (160 + Math.random() * 80),
        vy: Math.sin(angle) * (160 + Math.random() * 80),
        color: Math.random() > 0.4 ? '#9d4edd' : '#c77dff',
        radius: 4 + Math.random() * 4,
        life: 0.4,
        maxLife: 0.4
      });
    }

    // Shockwave ring particle
    this.particles.push({
      x: slamX,
      y: slamY,
      vx: 0,
      vy: 0,
      color: '#e0aaff',
      radius: radius,
      isRing: true,
      life: 0.35,
      maxLife: 0.35
    });

    // Damage and slow all enemies within radius
    for (let enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - slamX, enemy.y - slamY);
      if (dist <= radius + enemy.size / 2) {
        this.damageEnemy(enemy, damage, '#9d4edd');
        enemy.slowTimer = slowDuration;
        enemy.slowMult = 0.5;
        this.addDamageText(enemy.x, enemy.y - 25, '❄ SLOW', '#00f3ff');
        this.createExplosionParticles(enemy.x, enemy.y, '#c77dff', 6);
      }
    }
  }

  fireCryoCanister(x, y, angle, damage, speed, blastRadius, slowAmount, slowDuration) {
    this.projectiles.push({
      type: 'cryo',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage,
      blastRadius,
      slowAmount,
      slowDuration,
      color: '#00f3ff',
      radius: 7,
      lifetime: 4.0
    });
  }

  fireMortarShell(startX, startY, targetX, targetY, damage, blastRadius, poolDuration, poolDps) {
    this.projectiles.push({
      type: 'mortar',
      x: startX,
      y: startY,
      startX,
      startY,
      targetX,
      targetY,
      damage,
      blastRadius,
      poolDuration,
      poolDps,
      arcTime: 0,
      maxArcTime: 1.1,
      arcHeight: 180,
      radius: 6,
      color: '#ff5400',
      lifetime: 3.0
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
    if (p.type === 'cryo') {
      window.soundManager.playCryo();
      this.createExplosionParticles(p.x, p.y, '#00f3ff', 24);
      this.createExplosionParticles(p.x, p.y, '#ffffff', 14);

      for (let enemy of this.enemies) {
        const d = Math.hypot(enemy.x - p.x, enemy.y - p.y);
        if (d <= p.blastRadius + enemy.size / 2) {
          this.damageEnemy(enemy, p.damage, '#00f3ff');
          enemy.slowTimer = p.slowDuration;
          enemy.slowMult = 1 - p.slowAmount;
          this.addDamageText(enemy.x, enemy.y - 25, '❄ FREEZE', '#00f3ff');
        }
      }
    } else if (p.type === 'rpg') {
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
    // Shield Bearer: Shield absorbs damage first
    if (enemy.shieldHp > 0) {
      const absorbed = Math.min(enemy.shieldHp, amount);
      enemy.shieldHp -= absorbed;
      amount -= absorbed;
      if (absorbed > 0) {
        this.addDamageText(enemy.x + (Math.random() - 0.5) * 20, enemy.y - 20, `🛡${absorbed.toFixed(1)}`, '#457b9d');
      }
    }
    if (amount > 0) {
      enemy.hp -= amount;
      this.addDamageText(enemy.x + (Math.random() - 0.5) * 20, enemy.y - 10, amount.toFixed(1), color);
    }
    enemy.hitFlash = 0.08;
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
    this.lightningArcs = [];
    this.plasmaPools = [];
    this.cameraShake = 0;

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
    this.ctx.save();
    if (this.cameraShake > 0) {
      const shakeAmt = this.cameraShake * 18;
      const sx = (Math.random() - 0.5) * shakeAmt;
      const sy = (Math.random() - 0.5) * shakeAmt;
      this.ctx.translate(sx, sy);
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Cyber Sci-fi Grid Background
    this.drawBackground();

    // 1b. Draw Lingering Plasma Pools (Orbital Mortar)
    this.drawPlasmaPools();

    // 2. Draw Beams & Lightning
    this.drawRailgunBeams();
    this.drawLightningArcs();

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

    this.ctx.restore();
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

  drawPlasmaPools() {
    for (let pool of this.plasmaPools) {
      const alpha = Math.min(1.0, pool.duration / 0.5);
      this.ctx.save();
      this.ctx.shadowColor = '#ff5400';
      this.ctx.shadowBlur = 20;

      // Outer plasma glow on ground
      const grad = this.ctx.createRadialGradient(pool.x, pool.y, 4, pool.x, pool.y, pool.radius);
      grad.addColorStop(0, `rgba(255, 230, 0, ${0.85 * alpha})`);
      grad.addColorStop(0.35, `rgba(255, 84, 0, ${0.75 * alpha})`);
      grad.addColorStop(0.7, `rgba(180, 0, 255, ${0.5 * alpha})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.ellipse(pool.x, pool.y, pool.radius, pool.radius * 0.35, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
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
    if (slot.weapon === 'chainsaw' || slot.weapon === 'energy_blade' || slot.weapon === 'void_rift' || slot.weapon === 'graviton_hammer' || slot.weapon === 'solar_core') {
      const mountX = x + this.crateWidth / 2 + 15;
      // Ensure the weapon center is elevated high enough above groundY
      const radius = stats.spinRadius || 36;
      const minClearance = radius + 6;
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
      // Guns and launchers are mounted on the front edge of the crate
      this.ctx.translate(x + this.crateWidth / 2 - 2, y);
    }

    // Close range spinning & field weapons
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

    if (slot.weapon === 'void_rift') {
      // Swirling gravity singularity vortex
      this.ctx.rotate(slot.angle);

      // Outer violet gravity distortion
      this.ctx.shadowColor = '#9d4edd';
      this.ctx.shadowBlur = 18;

      // Accretion disk radial gradient
      const grad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#c77dff');
      grad.addColorStop(0.6, '#5a189a');
      grad.addColorStop(1, 'rgba(16, 0, 43, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 26, 0, Math.PI * 2);
      this.ctx.fill();

      // Pitch-black singularity core
      this.ctx.fillStyle = '#05020a';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 11, 0, Math.PI * 2);
      this.ctx.fill();

      // Orbiting micro-singularity dots
      this.ctx.fillStyle = '#e0aaff';
      for (let o = 0; o < 3; o++) {
        const oAngle = (Math.PI * 2 * o) / 3;
        this.ctx.beginPath();
        this.ctx.arc(Math.cos(oAngle) * 16, Math.sin(oAngle) * 16, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Pure white singularity center point
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
      return;
    }

    if (slot.weapon === 'graviton_hammer') {
      this.ctx.rotate(slot.angle);

      // Articulated hydraulic shaft
      this.ctx.fillStyle = '#2b2d42';
      this.ctx.fillRect(0, -5, 32, 10);
      this.ctx.fillStyle = '#8d99ae';
      this.ctx.fillRect(4, -2.5, 24, 5);

      // Heavy grav-hammer head
      this.ctx.shadowColor = '#9d4edd';
      this.ctx.shadowBlur = 12;
      this.ctx.fillStyle = '#240046';
      this.ctx.fillRect(28, -15, 20, 30);

      // Impact face
      this.ctx.fillStyle = '#c77dff';
      this.ctx.fillRect(46, -13, 4, 26);

      // Glowing gravity core
      this.ctx.fillStyle = '#e0aaff';
      this.ctx.beginPath();
      this.ctx.arc(38, 0, 5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
      return;
    }

    if (slot.weapon === 'solar_core') {
      this.ctx.rotate(slot.angle);

      // Blazing solar corona aura
      this.ctx.shadowColor = '#ffd166';
      this.ctx.shadowBlur = 24;

      // Outer golden solar corona gradient
      const sunGrad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#fff3b0');
      sunGrad.addColorStop(0.65, '#ffb703');
      sunGrad.addColorStop(1, 'rgba(251, 133, 0, 0)');
      this.ctx.fillStyle = sunGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 24, 0, Math.PI * 2);
      this.ctx.fill();

      // Pulsing solar prominences
      this.ctx.fillStyle = 'rgba(255, 183, 3, 0.7)';
      for (let p = 0; p < 6; p++) {
        const pAng = (Math.PI * 2 * p) / 6 + slot.angle * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(Math.cos(pAng) * 14, Math.sin(pAng) * 14, 4, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Bright white-hot core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 9, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
      return;
    }

    // Aimed Weapons & Guns
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
    } else if (slot.weapon === 'sniper') {
      // Precision long-range rifle
      this.ctx.fillStyle = '#1b263b';
      this.ctx.fillRect(0, -3, 38, 6); // long precision barrel
      this.ctx.fillStyle = '#343a40';
      this.ctx.fillRect(-8, -2, 10, 5); // stock
      // Muzzle brake
      this.ctx.fillStyle = '#778da9';
      this.ctx.fillRect(36, -5, 4, 10);
      // High-power scope
      this.ctx.fillStyle = '#0d1b2a';
      this.ctx.fillRect(6, -8, 16, 5);
      this.ctx.fillStyle = '#00f3ff';
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 6;
      this.ctx.fillRect(21, -7.5, 2, 4); // lens glint
    } else if (slot.weapon === 'tesla_coil') {
      // Tesla Coil generator
      this.ctx.fillStyle = '#8d5b4c';
      this.ctx.fillRect(0, -6, 10, 12); // bronze base
      // Copper coil windings
      for (let c = 0; c < 4; c++) {
        this.ctx.fillStyle = c % 2 === 0 ? '#d4a373' : '#b08968';
        this.ctx.fillRect(10 + c * 4, -4.5, 3.5, 9);
      }
      // Top electrode sphere with electricity
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 12;
      this.ctx.fillStyle = '#e0e1dd';
      this.ctx.beginPath();
      this.ctx.arc(30, 0, 7, 0, Math.PI * 2);
      this.ctx.fill();
      // Spark arcs
      const charge = Math.min(1.0, slot.timer / stats.interval);
      if (charge > 0.35 && Math.random() < charge) {
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(30, 0);
        this.ctx.lineTo(34 + Math.random() * 8, (Math.random() - 0.5) * 12);
        this.ctx.stroke();
      }
    } else if (slot.weapon === 'buzz_saw') {
      // Buzz saw launcher casing
      this.ctx.fillStyle = '#343a40';
      this.ctx.fillRect(0, -7, 26, 14);
      // Hazard stripes
      this.ctx.fillStyle = '#ffb703';
      this.ctx.fillRect(6, -6, 4, 12);
      this.ctx.fillRect(14, -6, 4, 12);
      // Loaded saw blade tip ready in launcher
      this.ctx.fillStyle = '#adb5bd';
      this.ctx.beginPath();
      this.ctx.arc(26, 0, 8, -Math.PI / 2, Math.PI / 2);
      this.ctx.fill();
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
    } else if (slot.weapon === 'shotgun') {
      // Tactical Combat Shotgun: Heavy dual/pump matte barrels, vented heat-shield & walnut stock
      this.ctx.fillStyle = '#1f2421';
      this.ctx.fillRect(0, -5, 22, 10);
      // Dual matte steel barrels
      this.ctx.fillStyle = '#495057';
      this.ctx.fillRect(18, -4, 10, 3.5);
      this.ctx.fillRect(18, 0.5, 10, 3.5);
      // Textured pump fore-end
      this.ctx.fillStyle = '#9c6644';
      this.ctx.fillRect(8, -6, 8, 3);
      // Heavy stock
      this.ctx.fillStyle = '#212529';
      this.ctx.fillRect(-8, -3, 9, 6);
    } else if (slot.weapon === 'cryo_cannon') {
      // Cryo Cannon: Frost-chassis heavy projector with glowing liquid nitrogen tank & icy emitter
      this.ctx.shadowColor = '#00f5d4';
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = '#0b525b';
      this.ctx.fillRect(0, -6, 26, 12);
      // Cryo emitter muzzle
      this.ctx.fillStyle = '#48cae4';
      this.ctx.fillRect(24, -7, 6, 14);
      // Liquid nitrogen cylindrical vial
      this.ctx.fillStyle = '#90e0ef';
      this.ctx.fillRect(4, -3, 14, 6);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(8, -1.5, 6, 3);
    } else if (slot.weapon === 'orbital_mortar') {
      // Orbital Mortar: Heavy angled artillery cannon with reinforcing hydraulic rings & glowing plasma breech
      this.ctx.fillStyle = '#370617';
      this.ctx.fillRect(-6, -7, 30, 14);
      this.ctx.fillStyle = '#6a040f';
      this.ctx.fillRect(20, -8, 8, 16);
      // Heavy reinforcing rings
      this.ctx.fillStyle = '#d00000';
      this.ctx.fillRect(2, -8, 4, 16);
      this.ctx.fillRect(12, -8, 4, 16);
      // Glowing plasma breech
      this.ctx.shadowColor = '#ffba08';
      this.ctx.shadowBlur = 8;
      this.ctx.fillStyle = '#faa307';
      this.ctx.beginPath();
      this.ctx.arc(-2, 0, 4, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (slot.weapon === 'toxic_sprayer') {
      // Toxic Sprayer: Industrial Hazmat chemical canister & high-pressure sprayer nozzle
      this.ctx.fillStyle = '#2d6a4f';
      this.ctx.fillRect(0, -6, 22, 12);
      // Pressurized neon green toxic reservoir
      this.ctx.shadowColor = '#70e000';
      this.ctx.shadowBlur = 8;
      this.ctx.fillStyle = '#70e000';
      this.ctx.fillRect(4, -3, 10, 6);
      // High-pressure cone nozzle
      this.ctx.fillStyle = '#52b788';
      this.ctx.beginPath();
      this.ctx.moveTo(22, -6);
      this.ctx.lineTo(28, -2);
      this.ctx.lineTo(28, 2);
      this.ctx.lineTo(22, 6);
      this.ctx.closePath();
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
      if (p.type === 'saw') {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotAngle || 0);

        // Steel circular blade
        this.ctx.shadowColor = '#ffd166';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#ced4da';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Sharp spinning saw teeth
        const numTeeth = 10;
        this.ctx.fillStyle = '#f8f9fa';
        for (let t = 0; t < numTeeth; t++) {
          const a = (Math.PI * 2 * t) / numTeeth;
          this.ctx.beginPath();
          this.ctx.moveTo(Math.cos(a) * p.radius, Math.sin(a) * p.radius);
          this.ctx.lineTo(Math.cos(a + 0.18) * (p.radius + 6), Math.sin(a + 0.18) * (p.radius + 6));
          this.ctx.lineTo(Math.cos(a + 0.35) * p.radius, Math.sin(a + 0.35) * p.radius);
          this.ctx.closePath();
          this.ctx.fill();
        }

        // Dark metal inner plate
        this.ctx.fillStyle = '#495057';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.radius * 0.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Center hub
        this.ctx.fillStyle = '#e63946';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.radius * 0.25, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
        continue;
      }

      if (p.type === 'cryo') {
        this.ctx.save();
        this.ctx.shadowColor = '#00f5d4';
        this.ctx.shadowBlur = 14;
        // Outer frozen frost mist gradient
        const frostGrad = this.ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius + 5);
        frostGrad.addColorStop(0, '#ffffff');
        frostGrad.addColorStop(0.4, '#90e0ef');
        frostGrad.addColorStop(0.8, '#00b4d8');
        frostGrad.addColorStop(1, 'rgba(0, 119, 182, 0)');
        this.ctx.fillStyle = frostGrad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius + 5, 0, Math.PI * 2);
        this.ctx.fill();
        // Solid crystalline ice core
        this.ctx.fillStyle = '#caf0f8';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        continue;
      }

      if (p.type === 'mortar') {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        const flightAngle = Math.atan2(p.vy, p.vx);
        this.ctx.rotate(flightAngle);
        // Heavy aerodynamic artillery shell
        this.ctx.shadowColor = '#ff6b35';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#370617';
        this.ctx.fillRect(-8, -4, 12, 8);
        // Ballistic shell nosecone
        this.ctx.fillStyle = '#e63946';
        this.ctx.beginPath();
        this.ctx.moveTo(4, -4);
        this.ctx.lineTo(12, 0);
        this.ctx.lineTo(4, 4);
        this.ctx.closePath();
        this.ctx.fill();
        // Thruster exhaust flame
        this.ctx.fillStyle = '#ffd166';
        this.ctx.beginPath();
        this.ctx.moveTo(-8, -3);
        this.ctx.lineTo(-14, 0);
        this.ctx.lineTo(-8, 3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        continue;
      }

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

  drawLightningArcs() {
    for (let arc of this.lightningArcs) {
      const alpha = arc.lifetime / arc.maxLifetime;
      if (arc.points.length < 2) continue;

      this.ctx.save();
      this.ctx.shadowColor = arc.color;
      this.ctx.shadowBlur = 16;
      this.ctx.strokeStyle = arc.color;
      this.ctx.globalAlpha = Math.max(0, alpha);
      this.ctx.lineWidth = 3.5;
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(arc.points[0].x, arc.points[0].y);
      for (let p of arc.points) {
        this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.stroke();

      // Bright white inner core
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
      this.ctx.lineWidth = 1.4;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawEnemies() {
    for (let e of this.enemies) {
      this.ctx.save();
      this.ctx.translate(e.x, e.y);

      // Apply cloaking/phasing alpha
      const renderAlpha = (e.cloakAlpha || 1.0) * (e.phaseAlpha || 1.0);
      this.ctx.globalAlpha = renderAlpha;

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
      } else if (e.type === 'swarm_drone') {
        // Tiny diamond-shaped drone with flicker
        this.ctx.rotate(performance.now() / 200);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -r);
        this.ctx.lineTo(r, 0);
        this.ctx.lineTo(0, r);
        this.ctx.lineTo(-r, 0);
        this.ctx.closePath();
        this.ctx.fill();
        // Tiny thruster glow
        this.ctx.fillStyle = '#00b4d8';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (e.type === 'poison_crawler') {
        // Slimy green body with dripping poison
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        // Poison drip droplets
        this.ctx.fillStyle = '#2d6a4f';
        const dripY = r + Math.sin(performance.now() / 300) * 4;
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.3, dripY * 0.4, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(r * 0.2, dripY * 0.6, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        // Skull icon on body
        this.ctx.fillStyle = '#d4f7d4';
        this.ctx.font = `${Math.floor(r)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('☠', 0, r * 0.3);
      } else if (e.type === 'shadow_stalker') {
        // Ghostly triangular stealth shape
        this.ctx.shadowColor = '#4a4e69';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(r, 0);
        this.ctx.lineTo(-r, -r * 0.8);
        this.ctx.lineTo(-r * 0.4, 0);
        this.ctx.lineTo(-r, r * 0.8);
        this.ctx.closePath();
        this.ctx.fill();
        // Dagger-like edges
        this.ctx.strokeStyle = '#9a8c98';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      } else if (e.type === 'berserker') {
        // Muscular spiked body — gets bigger visual glow at low HP
        const rageGlow = (1 - e.hp / e.maxHp);
        if (rageGlow > 0.3) {
          this.ctx.shadowColor = '#ff0000';
          this.ctx.shadowBlur = 10 + rageGlow * 20;
        }
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        // Rage spikes
        this.ctx.fillStyle = '#fca311';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const spikeLen = r * 0.5 * (1 + rageGlow * 0.5);
          this.ctx.fillRect(Math.cos(a) * r, Math.sin(a) * r, spikeLen, 3);
        }
      } else if (e.type === 'shield_bearer') {
        // Rounded body with frontal shield arc
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        // Draw shield (arc on left/front side)
        if (e.shieldHp > 0) {
          const shieldRatio = e.shieldHp / e.maxShieldHp;
          this.ctx.strokeStyle = `rgba(69, 123, 157, ${0.4 + shieldRatio * 0.6})`;
          this.ctx.lineWidth = 4 + shieldRatio * 3;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, r + 5, -Math.PI * 0.6, Math.PI * 0.6);
          this.ctx.stroke();
          // Shield glow
          this.ctx.shadowColor = '#a8dadc';
          this.ctx.shadowBlur = 6;
          this.ctx.strokeStyle = `rgba(168, 218, 220, ${shieldRatio * 0.8})`;
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        }
      } else if (e.type === 'necromancer') {
        // Hooded caster with swirling dark energy
        // Body - hooded robe shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, -r);
        this.ctx.lineTo(r * 0.8, r * 0.6);
        this.ctx.lineTo(-r * 0.8, r * 0.6);
        this.ctx.closePath();
        this.ctx.fill();
        // Dark energy orb
        this.ctx.fillStyle = '#e040fb';
        this.ctx.shadowColor = '#e040fb';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(0, -r * 0.1, r * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        // Swirling particles visual
        const orbAngle = performance.now() / 500;
        this.ctx.fillStyle = '#ce93d8';
        this.ctx.beginPath();
        this.ctx.arc(Math.cos(orbAngle) * r * 0.5, Math.sin(orbAngle) * r * 0.5, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(Math.cos(orbAngle + 2) * r * 0.5, Math.sin(orbAngle + 2) * r * 0.5, 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (e.type === 'tank' || e.type === 'boss') {
        // Massive hulking body with spikes
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#590d22';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          this.ctx.fillRect(Math.cos(a) * r, Math.sin(a) * r, 6, 6);
        }
      } else if (e.type === 'doom_colossus') {
        // Enormous rocky golem with glowing cracks
        this.ctx.shadowColor = '#ff6b35';
        this.ctx.shadowBlur = 15;
        // Rocky body
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        // Glowing magma cracks
        this.ctx.strokeStyle = '#ff6b35';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-r * 0.5, -r * 0.5);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(r * 0.3, -r * 0.3);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(-r * 0.2, r * 0.4);
        this.ctx.lineTo(r * 0.1, 0);
        this.ctx.lineTo(r * 0.5, r * 0.2);
        this.ctx.stroke();
        // Heavy boulder shoulders
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.7, -r * 0.3, r * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(r * 0.7, -r * 0.3, r * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (e.type === 'phantom_overlord') {
        // Ethereal floating specter with phasing effect
        this.ctx.shadowColor = '#9b5de5';
        this.ctx.shadowBlur = 20;
        // Ghostly body
        this.ctx.beginPath();
        this.ctx.arc(0, -r * 0.2, r * 0.8, 0, Math.PI);
        this.ctx.lineTo(-r * 0.8, r * 0.6);
        // Wavy bottom edge
        for (let wx = -r * 0.8; wx <= r * 0.8; wx += r * 0.3) {
          this.ctx.quadraticCurveTo(wx + r * 0.15, r * 0.9, wx + r * 0.3, r * 0.6);
        }
        this.ctx.closePath();
        this.ctx.fill();
        // Eerie glowing eyes
        this.ctx.fillStyle = '#e040fb';
        this.ctx.shadowColor = '#e040fb';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.25, -r * 0.2, r * 0.12, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(r * 0.15, -r * 0.2, r * 0.12, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (e.type === 'inferno_wyrm') {
        // Massive fire dragon/serpent
        this.ctx.shadowColor = '#ff4800';
        this.ctx.shadowBlur = 20;
        // Serpentine body
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r, r * 0.7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        // Flame scales pattern
        this.ctx.fillStyle = '#ffaa00';
        for (let s = -r * 0.6; s < r * 0.6; s += r * 0.3) {
          this.ctx.beginPath();
          this.ctx.moveTo(s, -r * 0.5);
          this.ctx.lineTo(s + r * 0.15, -r * 0.8);
          this.ctx.lineTo(s + r * 0.3, -r * 0.5);
          this.ctx.fill();
        }
        // Wings
        this.ctx.fillStyle = 'rgba(255, 72, 0, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(-r * 0.3, -r * 0.3);
        this.ctx.lineTo(-r * 1.2, -r * 1.0);
        this.ctx.lineTo(-r * 0.1, -r * 0.1);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(r * 0.3, -r * 0.3);
        this.ctx.lineTo(r * 1.2, -r * 1.0);
        this.ctx.lineTo(r * 0.1, -r * 0.1);
        this.ctx.fill();
        // Flaming eyes
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = '#ffaa00';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.3, -r * 0.15, r * 0.12, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(r * 0.1, -r * 0.15, r * 0.12, 0, Math.PI * 2);
        this.ctx.fill();
        // Jaw / mouth
        this.ctx.fillStyle = '#8B0000';
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.1, r * 0.2, r * 0.25, 0, Math.PI);
        this.ctx.fill();
      } else if (e.type === 'boss_1x1x1' || e.type === '1x1x1') {
        // Mysterious 1x1x1 Glitch Hypercube Boss
        const fY = e.floatOffset || 0;
        this.ctx.translate(0, fY);

        // Chromatic aberration glitch outlines
        const glitchShift = Math.sin(performance.now() / 90) * 3.5;
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-r + glitchShift, -r, e.size, e.size);

        this.ctx.strokeStyle = '#ff007f';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-r - glitchShift, -r, e.size, e.size);

        // Pitch black void inner cube
        this.ctx.fillStyle = '#06060c';
        this.ctx.fillRect(-r, -r, e.size, e.size);

        // Cyber cyan border
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-r, -r, e.size, e.size);

        // Rotating nested wireframe
        this.ctx.save();
        this.ctx.rotate(e.rot3d || 0);
        this.ctx.strokeStyle = '#39ff14';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(-r * 0.55, -r * 0.55, e.size * 0.55, e.size * 0.55);
        this.ctx.restore();

        // Sinister center core eye
        this.ctx.fillStyle = '#ff0054';
        this.ctx.shadowColor = '#ff0054';
        this.ctx.shadowBlur = 14;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Glitch 1x1x1 tag inside cube
        this.ctx.fillStyle = '#00f3ff';
        this.ctx.font = 'bold 9px "Chakra Petch", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('[ 1x1x1 ]', 0, r * 0.65);
      } else {
        // Default Scout crawler
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = renderAlpha;

      // Glowing evil eye (skip for types that have custom eyes)
      if (!['swarm_drone', 'phantom_overlord', 'inferno_wyrm', 'necromancer', 'boss_1x1x1', '1x1x1'].includes(e.type)) {
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.3, -r * 0.2, r * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#ff0054';
        this.ctx.beginPath();
        this.ctx.arc(-r * 0.35, -r * 0.2, r * 0.12, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Reset alpha for UI elements
      this.ctx.globalAlpha = 1.0;

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

      // Shield bar (below HP bar) for shield bearers
      if (e.maxShieldHp > 0 && e.shieldHp > 0) {
        const shieldPercent = e.shieldHp / e.maxShieldHp;
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillStyle = '#a8dadc';
        this.ctx.fillRect(-hpWidth / 2, -r - 4, hpWidth * shieldPercent, 3);
      }

      // Frost slow aura (from Graviton Hammer)
      if (e.slowTimer > 0) {
        this.ctx.save();
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.shadowBlur = 8;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }

      this.ctx.restore();
    }
  }

  drawParticles() {
    for (let pt of this.particles) {
      const alpha = pt.life / pt.maxLife;
      this.ctx.save();
      if (pt.isRing) {
        const currentR = pt.radius * (1 - alpha * 0.7);
        this.ctx.strokeStyle = pt.color;
        this.ctx.shadowColor = pt.color;
        this.ctx.shadowBlur = 14;
        this.ctx.globalAlpha = Math.max(0, alpha);
        this.ctx.lineWidth = 4 * alpha;
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, currentR, 0, Math.PI * 2);
        this.ctx.stroke();
      } else {
        this.ctx.fillStyle = pt.color;
        this.ctx.globalAlpha = Math.max(0, alpha);
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
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
