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
    this.awakenWeaponBtn = document.getElementById('awaken-weapon-btn');
    this.awakenCostTag = document.getElementById('awaken-cost-tag');
    this.sellWeaponBtn = document.getElementById('sell-weapon-btn');
    this.crystalDisplay = document.getElementById('crystal-display');
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

    // Auto Wave State
    this.autoWave = false;
    this.autoWaveTimer = 0;
    this.autoWaveBtn = document.getElementById('auto-wave-btn');

    // Run Vault & Secret Password State & UI Elements
    this.currentRunPassword = null;
    this.saveVault = {};
    this.runVaultBtn = document.getElementById('run-vault-btn');
    this.runVaultModal = document.getElementById('run-vault-modal');
    this.runVaultCloseBtn = document.getElementById('run-vault-close-btn');
    this.vaultActiveBanner = document.getElementById('vault-active-banner');
    this.vaultCurrentPass = document.getElementById('vault-current-pass');
    this.vaultCurrentStats = document.getElementById('vault-current-stats');
    this.vaultSaveNowBtn = document.getElementById('vault-save-now-btn');
    this.vaultCopyCodeBtn = document.getElementById('vault-copy-code-btn');
    this.vaultNewPassInput = document.getElementById('vault-new-pass-input');
    this.vaultCreateBtn = document.getElementById('vault-create-btn');
    this.vaultCreateError = document.getElementById('vault-create-error');
    this.vaultCreateSuccess = document.getElementById('vault-create-success');
    this.vaultLoadPassInput = document.getElementById('vault-load-pass-input');
    this.vaultLoadBtn = document.getElementById('vault-load-btn');
    this.vaultLoadError = document.getElementById('vault-load-error');
    this.vaultLoadSuccess = document.getElementById('vault-load-success');
    this.vaultRunsCount = document.getElementById('vault-runs-count');
    this.vaultEntriesList = document.getElementById('vault-entries-list');
    this.vaultDownloadJsonBtn = document.getElementById('vault-download-json-btn');
    this.vaultCopyAllJsonBtn = document.getElementById('vault-copy-all-json-btn');

    // Game State
    this.coins = 20; // Starting bonus for comfort
    this.crystals = 0; // Boss crystals for weapon awakening!
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
      { id: 0, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false, awakened: false },
      { id: 1, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false, awakened: false },
      { id: 2, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false, awakened: false },
      { id: 3, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false, awakened: false },
      { id: 4, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false, awakened: false }
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
    this.quantumScars = []; // railgun singularity lance lingering scars
    this.ballLightnings = []; // tesla coil ball lightnings
    this.crescentWaves = []; // energy blade crescent waves
    this.godsPeaceTimer = 0; // ban gun judgement day peace timer
    this.cameraShake = 0; // camera shake timer

    // Custom weapon sprites
    this.energyBladeImg = new Image();
    this.energyBladeImg.src = 'energy_blade_disc.png';

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

    // Initialize Run Vault System & listeners
    this.initSaveVault();
    this.initVaultEventListeners();

    // When starting a game: ask player to create a secret password, or load existing run
    if (this.currentRunPassword) {
      this.updateRunVaultHUDButton();
      this.startWave(this.wave);
    } else {
      this.openRunVaultModal('create');
    }

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

    // Speed button: 1x -> 2x -> 5x -> 10x -> 20x -> 100x cycle
    const speedBtn = document.getElementById('speed-btn');
    speedBtn.addEventListener('click', () => {
      if (this.gameSpeed === 1) this.setGameSpeed(2);
      else if (this.gameSpeed === 2) this.setGameSpeed(5);
      else if (this.gameSpeed === 5) this.setGameSpeed(10);
      else if (this.gameSpeed === 10) this.setGameSpeed(20);
      else if (this.gameSpeed === 20) this.setGameSpeed(100);
      else this.setGameSpeed(1);
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

    // Awaken Weapon Button
    if (this.awakenWeaponBtn) {
      this.awakenWeaponBtn.addEventListener('click', () => {
        this.awakenSelectedSlot();
      });
    }

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

    // Auto Wave Toggle Button
    if (this.autoWaveBtn) {
      this.autoWaveBtn.addEventListener('click', () => {
        this.autoWave = !this.autoWave;
        if (this.autoWave) {
          this.autoWaveBtn.innerText = '🔁 Auto Wave: ON';
          this.autoWaveBtn.classList.add('active');
          this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '🔁 AUTO WAVE ENABLED', '#00ff88');
          // If currently waiting on wave clear banner, start countdown immediately
          if (!this.isWaveActive && !this.gameOver && !this.overlayBanner.classList.contains('hidden')) {
            this.autoWaveTimer = 0.8;
          }
        } else {
          this.autoWaveBtn.innerText = '🔁 Auto Wave: OFF';
          this.autoWaveBtn.classList.remove('active');
          this.autoWaveTimer = 0;
          if (!this.gameOver) {
            this.overlayActionBtn.innerText = 'NEXT WAVE';
          }
          this.addDamageText(this.towerBaseX + 35, this.groundY - 140, 'Auto Wave Disabled', '#8ca0ba');
        }
      });
    }

    // Overlay Action Button
    this.overlayActionBtn.addEventListener('click', () => {
      this.autoWaveTimer = 0;
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
      { key: 'admin-secret', label: '👑 SECRET ADMIN WEAPONS' },
      { key: 'gun', label: '🔫 Guns' },
      { key: 'godly-gun', label: '⚡ Godly Guns' },
      { key: 'melee', label: '⚔️ Close Range' },
      { key: 'godly-melee', label: '🌟 Godly Close Range' }
    ];

    categories.forEach(cat => {
      const group = document.createElement('optgroup');
      group.label = cat.label;
      for (const [id, wep] of Object.entries(WEAPON_REGISTRY)) {
        if (cat.key === 'admin-secret') {
          if (!wep.adminOnly) continue;
        } else {
          if (wep.adminOnly) continue; // Secret admin-only weapons belong only in admin-secret category
          if (wep.category !== cat.key) continue;
        }
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `${wep.icon} ${wep.name} (Max Lv.${wep.maxUpgrades})`;
        group.appendChild(opt);
      }
      if (group.children.length > 0) {
        this.adminWeaponSelect.appendChild(group);
      }
    });
  }

  initAdminEventListeners() {
    if (!this.adminBtn) return;

    // Open Admin Button: prompts for password every time!
    this.adminBtn.addEventListener('click', () => {
      this.openAdminAuthModal();
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
      this.closeAdminAuthModal();
    });

    // Close Admin Panel modal (revokes authorization so password is required every time)
    this.adminPanelCloseBtn.addEventListener('click', () => {
      this.closeAdminPanel();
    });

    // Backdrop clicks close and reset auth
    if (this.adminAuthModal) {
      this.adminAuthModal.addEventListener('click', (e) => {
        if (e.target === this.adminAuthModal) {
          this.closeAdminAuthModal();
        }
      });
    }

    if (this.adminPanelModal) {
      this.adminPanelModal.addEventListener('click', (e) => {
        if (e.target === this.adminPanelModal) {
          this.closeAdminPanel();
        }
      });
    }

    // Escape key closes modals and resets auth
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.adminPanelModal.classList.contains('hidden')) {
          this.closeAdminPanel();
        } else if (!this.adminAuthModal.classList.contains('hidden')) {
          this.closeAdminAuthModal();
        }
      }
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
        const lvl = parseInt(chip.dataset.lvl) || 0;
        this.adminSetLevel(lvl);
      });
    });

    // Secret Overload Chips (10 to 105)
    const secretChips = document.querySelectorAll('.secret-chip');
    secretChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const lvl = parseInt(chip.dataset.lvl) || 0;
        this.adminSetLevel(lvl);
      });
    });

    // Custom Level Button & Input
    const setCustomLvlBtn = document.getElementById('admin-set-custom-level-btn');
    const customLvlInput = document.getElementById('admin-custom-level-input');
    if (setCustomLvlBtn && customLvlInput) {
      setCustomLvlBtn.addEventListener('click', () => {
        const lvl = Math.max(0, Math.min(1000000, parseInt(customLvlInput.value) || 0));
        this.adminSetLevel(lvl);
      });
    }

    // Max Current Weapon Button (Standard Max)
    const maxCurrentBtn = document.getElementById('admin-max-current-wep-btn');
    if (maxCurrentBtn) {
      maxCurrentBtn.addEventListener('click', () => {
        this.adminMaxTargetWeapon();
      });
    }

    // Overload Target Weapon Button (+100 Secret Tiers)
    const overloadCurrentBtn = document.getElementById('admin-overload-current-wep-btn');
    if (overloadCurrentBtn) {
      overloadCurrentBtn.addEventListener('click', () => {
        this.adminOverloadTargetWeapon();
      });
    }

    // Max All Weapons Button (Standard Max)
    const maxAllBtn = document.getElementById('admin-max-all-weps-btn');
    if (maxAllBtn) {
      maxAllBtn.addEventListener('click', () => {
        this.adminMaxAllWeapons();
      });
    }

    // OVERLOAD ALL 5 WEAPONS Button (+100 Secret Tiers on all 5 slots)
    const overloadAllBtn = document.getElementById('admin-overload-all-weps-btn');
    if (overloadAllBtn) {
      overloadAllBtn.addEventListener('click', () => {
        this.adminOverloadAllWeapons();
      });
    }

    // SPAWN 1x1x1 SECRET BOSS Button
    const spawn1x1x1Btn = document.getElementById('admin-spawn-1x1x1-btn');
    if (spawn1x1x1Btn) {
      spawn1x1x1Btn.addEventListener('click', () => {
        this.adminSpawn1x1x1();
      });
    }

    // SPAWN WEAK WEAPON DUMMY Button (1 Billion HP, deals 500 HP / 10s, no spawn effects)
    const spawnDummyBtn = document.getElementById('admin-spawn-dummy-btn');
    if (spawnDummyBtn) {
      spawnDummyBtn.addEventListener('click', () => {
        this.adminSpawnDummy();
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

    // 20x and 100x Speed Admin Buttons
    const speed20Btn = document.getElementById('admin-speed-20x-btn');
    if (speed20Btn) {
      speed20Btn.addEventListener('click', () => {
        this.setGameSpeed(20);
        this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '⚡ 20x GAME SPEED!', '#00f3ff');
      });
    }

    const speed100Btn = document.getElementById('admin-speed-100x-btn');
    if (speed100Btn) {
      speed100Btn.addEventListener('click', () => {
        this.setGameSpeed(100);
        this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '🌌 100x WARP SPEED!', '#ff00ff');
      });
    }
  }

  setGameSpeed(speed) {
    this.gameSpeed = speed;
    const speedBtn = document.getElementById('speed-btn');
    if (!speedBtn) return;

    speedBtn.classList.remove('speed-active-20x', 'speed-active-100x');
    if (this.gameSpeed === 2) {
      speedBtn.innerText = '2x ⏩';
      speedBtn.style.color = '#00ff88';
      speedBtn.style.borderColor = 'rgba(0, 255, 136, 0.4)';
    } else if (this.gameSpeed === 5) {
      speedBtn.innerText = '5x ⏩⏩';
      speedBtn.style.color = '#ffb703';
      speedBtn.style.borderColor = 'rgba(255, 183, 3, 0.4)';
    } else if (this.gameSpeed === 10) {
      speedBtn.innerText = '10x 🚀⚡';
      speedBtn.style.color = '#ff007f';
      speedBtn.style.borderColor = 'rgba(255, 0, 127, 0.5)';
    } else if (this.gameSpeed === 20) {
      speedBtn.innerText = '20x 💥⚡';
      speedBtn.style.color = '#00f3ff';
      speedBtn.style.borderColor = '#00f3ff';
      speedBtn.classList.add('speed-active-20x');
    } else if (this.gameSpeed === 100) {
      speedBtn.innerText = '100x 🌌🔥';
      speedBtn.style.color = '#ff00ff';
      speedBtn.style.borderColor = '#ff00ff';
      speedBtn.classList.add('speed-active-100x');
    } else {
      this.gameSpeed = 1;
      speedBtn.innerText = '1x ⏩';
      speedBtn.style.color = '#fff';
      speedBtn.style.borderColor = 'rgba(0, 243, 255, 0.3)';
    }
  }

  openAdminAuthModal() {
    this.isAdminAuthenticated = false;
    this.adminPassInput.value = '';
    this.adminAuthError.classList.add('hidden');
    this.adminAuthModal.classList.remove('hidden');
    setTimeout(() => this.adminPassInput.focus(), 50);
  }

  closeAdminAuthModal() {
    this.isAdminAuthenticated = false;
    this.adminPassInput.value = '';
    this.adminAuthError.classList.add('hidden');
    this.adminAuthModal.classList.add('hidden');
  }

  verifyAdminPassword() {
    const val = (this.adminPassInput.value || '').trim();
    if (val === 'adminpanel123') {
      this.isAdminAuthenticated = true;
      this.adminAuthModal.classList.add('hidden');
      this.adminAuthError.classList.add('hidden');
      this.adminPassInput.value = '';
      this.openAdminPanel();
    } else {
      this.isAdminAuthenticated = false;
      this.adminAuthError.classList.remove('hidden');
      this.adminPassInput.value = '';
      this.adminPassInput.focus();
    }
  }

  openAdminPanel() {
    if (!this.isAdminAuthenticated) {
      this.openAdminAuthModal();
      return;
    }
    this.adminPanelModal.classList.remove('hidden');
    this.updateAdminPanelSlotView();
    this.renderSaveVaultList();
  }

  closeAdminPanel() {
    this.isAdminAuthenticated = false; // Always revoke auth so password is required every time
    this.adminPassInput.value = '';
    this.adminPanelModal.classList.add('hidden');
  }

  updateAdminPanelSlotView() {
    const slot = this.slots[this.adminTargetSlot];
    if (this.adminTargetSlotName) {
      this.adminTargetSlotName.textContent = `Crate ${this.adminTargetSlot + 1}`;
    }
    if (this.adminTargetSlotWep) {
      if (slot && slot.weapon) {
        const wep = WEAPON_REGISTRY[slot.weapon];
        const isSecret = slot.level > wep.maxUpgrades;
        if (isSecret) {
          const secretTiers = slot.level - wep.maxUpgrades;
          this.adminTargetSlotWep.innerHTML = `${wep.icon} ${wep.name} <span class="secret-stars-tag">🌌 Lv.${slot.level.toLocaleString()} [OVERLOAD +${secretTiers.toLocaleString()}]</span>`;
        } else {
          const stars = '★'.repeat(slot.level);
          this.adminTargetSlotWep.textContent = `${wep.icon} ${wep.name} (Lv.${slot.level} ${stars})`;
          this.adminTargetSlotWep.style.color = '#00f3ff';
        }
      } else {
        this.adminTargetSlotWep.textContent = 'Empty';
        this.adminTargetSlotWep.style.color = '#8ca0ba';
      }
    }

    const curLvl = (slot && slot.weapon) ? slot.level : this.adminSelectedLevel;

    // Update level chips
    const levelChips = document.querySelectorAll('.level-chip');
    levelChips.forEach(chip => {
      const lvl = parseInt(chip.dataset.lvl);
      chip.classList.toggle('active', lvl === curLvl);
    });

    // Update secret chips
    const secretChips = document.querySelectorAll('.secret-chip');
    secretChips.forEach(chip => {
      const lvl = parseInt(chip.dataset.lvl);
      chip.classList.toggle('active', lvl === curLvl);
    });

    // Update custom level input value
    const customLvlInput = document.getElementById('admin-custom-level-input');
    if (customLvlInput && document.activeElement !== customLvlInput) {
      customLvlInput.value = curLvl;
    }
  }

  adminForceEquip() {
    const weaponId = this.adminWeaponSelect ? this.adminWeaponSelect.value : null;
    if (!weaponId || !WEAPON_REGISTRY[weaponId]) return;
    const wep = WEAPON_REGISTRY[weaponId];
    const slot = this.slots[this.adminTargetSlot];

    slot.weapon = weaponId;
    const maxPossible = wep.maxUpgrades + (window.SECRET_UPGRADE_LIMIT || 1000000);
    slot.level = Math.min(this.adminSelectedLevel, maxPossible);
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
      const maxPossible = wep.maxUpgrades + (window.SECRET_UPGRADE_LIMIT || 1000000);
      slot.level = Math.min(lvl, maxPossible);
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
      this.adminSelectedLevel = slot.level;
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

  adminOverloadTargetWeapon() {
    const slot = this.slots[this.adminTargetSlot];
    if (slot && slot.weapon) {
      const wep = WEAPON_REGISTRY[slot.weapon];
      const maxPossible = wep.maxUpgrades + (window.SECRET_UPGRADE_LIMIT || 1000000);
      slot.level = maxPossible;
      this.adminSelectedLevel = slot.level;
      window.soundManager.playUpgrade();
      this.updateHUD();
      this.renderCrateSlotsUI();
      this.updateInspector();
      this.updateAdminPanelSlotView();
      const coords = this.getSlotCoords(this.adminTargetSlot);
      this.createExplosionParticles(coords.x + 30, coords.y, '#00f3ff', 35);
      this.createExplosionParticles(coords.x + 30, coords.y, '#ff007f', 35);
      this.addDamageText(coords.x + 30, coords.y - 20, `🌌 OVERLOADED TO LV.${slot.level.toLocaleString()}!`, '#ff007f');
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
        this.createExplosionParticles(coords.x + 30, coords.y, '#ffd166', 20);
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

  adminOverloadAllWeapons() {
    let upgradedAny = false;
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.weapon) {
        const wep = WEAPON_REGISTRY[slot.weapon];
        const maxPossible = wep.maxUpgrades + (window.SECRET_UPGRADE_LIMIT || 1000000);
        slot.level = maxPossible;
        upgradedAny = true;
        const coords = this.getSlotCoords(i);
        this.createExplosionParticles(coords.x + 30, coords.y, '#00f3ff', 25);
        this.createExplosionParticles(coords.x + 30, coords.y, '#ff007f', 25);
      }
    }
    if (upgradedAny) {
      window.soundManager.playUpgrade();
      this.updateHUD();
      this.renderCrateSlotsUI();
      this.updateInspector();
      this.updateAdminPanelSlotView();
      this.addDamageText(this.towerBaseX + 35, this.groundY - 180, '💥 ALL 5 CRATES OVERLOADED (+1,000,000)!', '#ff007f');
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

  adminSpawnDummy() {
    // Weak Weapon Dummy: 1 Billion HP, deals 500 health every 10s
    // Explicitly NO special effects on spawn (no camera shake, no explosion sound, no explosion particles)
    this.spawnEnemy('weak_weapon_dummy');
    this.addDamageText(this.canvas.width - 150, this.groundY - 100, '🎯 DUMMY SPAWNED (1B HP)', '#ffaa00');
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

  // ================= RUN VAULT & SECRET PASSWORD SYSTEM ================= //

  initSaveVault() {
    this.saveVault = {};

    // 1. Load initial vault file runs from window.SAVE_VAULT_FILE (from saves.js)
    if (window.SAVE_VAULT_FILE && window.SAVE_VAULT_FILE.runs) {
      Object.assign(this.saveVault, window.SAVE_VAULT_FILE.runs);
    }

    // 2. Load runs saved in localStorage (persisted across sessions in browser)
    try {
      const stored = localStorage.getItem('tds_save_vault');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          Object.assign(this.saveVault, parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read localStorage vault:', e);
    }

    // 3. Check for last active run password in localStorage
    try {
      const lastPass = localStorage.getItem('tds_active_run_password');
      if (lastPass && this.saveVault[lastPass]) {
        this.currentRunPassword = lastPass;
        this.applyRunData(this.decodeSaveCode(this.saveVault[lastPass].saveCode), lastPass, false);
      }
    } catch (e) {
      console.warn('Could not read active run password:', e);
    }

    this.updateRunVaultHUDButton();
    this.renderSaveVaultList();
  }

  initVaultEventListeners() {
    if (this.runVaultBtn) {
      this.runVaultBtn.addEventListener('click', () => {
        this.openRunVaultModal();
      });
    }

    if (this.runVaultCloseBtn) {
      this.runVaultCloseBtn.addEventListener('click', () => {
        this.closeRunVaultModal();
      });
    }

    if (this.runVaultModal) {
      this.runVaultModal.addEventListener('click', (e) => {
        if (e.target === this.runVaultModal) {
          this.closeRunVaultModal();
        }
      });
    }

    // Tab buttons
    const tabBtns = document.querySelectorAll('.vault-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.dataset.tab;
        this.switchVaultTab(tabKey);
      });
    });

    // Create New Run button & Enter key
    if (this.vaultCreateBtn && this.vaultNewPassInput) {
      this.vaultCreateBtn.addEventListener('click', () => {
        this.handleCreateRun();
      });
      this.vaultNewPassInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleCreateRun();
        }
      });
    }

    // Load Run button & Enter key
    if (this.vaultLoadBtn && this.vaultLoadPassInput) {
      this.vaultLoadBtn.addEventListener('click', () => {
        this.handleLoadRun();
      });
      this.vaultLoadPassInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleLoadRun();
        }
      });
    }

    // Active run banner buttons
    if (this.vaultSaveNowBtn) {
      this.vaultSaveNowBtn.addEventListener('click', () => {
        this.saveCurrentRun(true);
      });
    }

    if (this.vaultCopyCodeBtn) {
      this.vaultCopyCodeBtn.addEventListener('click', () => {
        if (this.currentRunPassword && this.saveVault[this.currentRunPassword]) {
          const code = this.saveVault[this.currentRunPassword].saveCode;
          navigator.clipboard.writeText(code).then(() => {
            this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '📋 SAVE CODE COPIED!', '#00f3ff');
            alert('Save Code copied to clipboard!');
          });
        }
      });
    }

    // Download saves.json
    if (this.vaultDownloadJsonBtn) {
      this.vaultDownloadJsonBtn.addEventListener('click', () => {
        this.downloadSavesJson();
      });
    }

    // Copy All JSON
    if (this.vaultCopyAllJsonBtn) {
      this.vaultCopyAllJsonBtn.addEventListener('click', () => {
        this.copyAllVaultJson();
      });
    }
  }

  openRunVaultModal(defaultTab = null) {
    if (!this.runVaultModal) return;
    this.runVaultModal.classList.remove('hidden');

    if (this.vaultCreateError) this.vaultCreateError.classList.add('hidden');
    if (this.vaultCreateSuccess) this.vaultCreateSuccess.classList.add('hidden');
    if (this.vaultLoadError) this.vaultLoadError.classList.add('hidden');
    if (this.vaultLoadSuccess) this.vaultLoadSuccess.classList.add('hidden');

    // Update active banner
    if (this.currentRunPassword && this.saveVault[this.currentRunPassword]) {
      this.vaultActiveBanner.classList.remove('hidden');
      this.vaultCurrentPass.innerText = this.currentRunPassword;
      this.vaultCurrentStats.innerText = `Wave ${this.wave} • ${this.coins} 🪙 • HP ${this.towerHp}/${this.maxTowerHp}`;
    } else {
      this.vaultActiveBanner.classList.add('hidden');
    }

    if (defaultTab) {
      this.switchVaultTab(defaultTab);
    } else if (!this.currentRunPassword) {
      this.switchVaultTab('create');
    } else {
      this.switchVaultTab('load');
    }

    this.renderSaveVaultList();
  }

  closeRunVaultModal() {
    if (!this.runVaultModal) return;
    this.runVaultModal.classList.add('hidden');
    // If wave hasn't started yet and not active, start wave
    if (!this.isWaveActive && this.waveSpawnsRemaining.length === 0 && this.enemies.length === 0 && !this.gameOver) {
      this.startWave(this.wave || 1);
    }
  }

  switchVaultTab(tabKey) {
    const tabBtns = document.querySelectorAll('.vault-tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    const createTab = document.getElementById('vault-tab-create');
    const loadTab = document.getElementById('vault-tab-load');

    if (createTab) createTab.classList.toggle('hidden', tabKey !== 'create');
    if (loadTab) loadTab.classList.toggle('hidden', tabKey !== 'load');

    if (tabKey === 'create' && this.vaultNewPassInput) {
      setTimeout(() => this.vaultNewPassInput.focus(), 60);
    } else if (tabKey === 'load' && this.vaultLoadPassInput) {
      setTimeout(() => this.vaultLoadPassInput.focus(), 60);
    }
  }

  isPasswordTaken(password) {
    if (!password) return false;
    const clean = password.trim().toLowerCase();
    for (const key of Object.keys(this.saveVault)) {
      if (key.trim().toLowerCase() === clean) {
        return true;
      }
    }
    return false;
  }

  handleCreateRun() {
    const pass = (this.vaultNewPassInput.value || '').trim();
    if (this.vaultCreateError) this.vaultCreateError.classList.add('hidden');
    if (this.vaultCreateSuccess) this.vaultCreateSuccess.classList.add('hidden');

    if (!pass || pass.length < 3) {
      this.showVaultCreateError('⚠️ Password must be at least 3 characters long!');
      return;
    }

    if (this.isPasswordTaken(pass)) {
      this.showVaultCreateError(`⚠️ Secret password "${pass}" has ALREADY been selected! Please choose a unique password that has not been used.`);
      return;
    }

    // Success: create unique run
    this.createNewRun(pass);
  }

  showVaultCreateError(msg) {
    if (!this.vaultCreateError) return;
    this.vaultCreateError.innerText = msg;
    this.vaultCreateError.classList.remove('hidden');
    if (this.vaultNewPassInput) this.vaultNewPassInput.focus();
  }

  createNewRun(password) {
    this.currentRunPassword = password;
    this.wave = 1;
    this.coins = 20;
    this.towerHp = 500;
    this.maxTowerHp = 500;
    this.hasBoughtFirstTurret = false;
    this.slots = [
      { id: 0, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 1, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 2, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 3, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false },
      { id: 4, weapon: null, level: 0, timer: 0, subTimer: 0, angle: 0, isFiring: false }
    ];

    // Generate code and save
    const saveCode = this.generateSaveCode();
    const runMeta = {
      password: password,
      wave: this.wave,
      coins: this.coins,
      towerHp: this.towerHp,
      maxTowerHp: this.maxTowerHp,
      hasBoughtFirstTurret: this.hasBoughtFirstTurret,
      autoAdvanceWave: this.autoWave,
      slots: this.slots.map(s => ({ id: s.id, weapon: s.weapon, level: s.level })),
      saveCode: saveCode,
      createdAt: new Date().toISOString(),
      lastSaved: new Date().toISOString()
    };

    this.saveVault[password] = runMeta;
    this.persistVault();
    try {
      localStorage.setItem('tds_active_run_password', password);
    } catch (e) {}

    this.updateRunVaultHUDButton();
    this.renderSaveVaultList();
    this.updateHUD();
    this.renderCrateSlotsUI();
    this.selectSlot(0);

    if (this.vaultCreateSuccess) {
      this.vaultCreateSuccess.innerText = `✅ Secret password "${password}" registered! Your new run is ready!`;
      this.vaultCreateSuccess.classList.remove('hidden');
    }

    if (this.vaultNewPassInput) this.vaultNewPassInput.value = '';

    setTimeout(() => {
      this.closeRunVaultModal();
      this.addDamageText(this.towerBaseX + 35, this.groundY - 140, `🚀 RUN STARTED: ${password}`, '#39ff14');
      window.soundManager.playUpgrade();
      this.startWave(1);
    }, 600);
  }

  handleLoadRun() {
    const pass = (this.vaultLoadPassInput.value || '').trim();
    if (this.vaultLoadError) this.vaultLoadError.classList.add('hidden');
    if (this.vaultLoadSuccess) this.vaultLoadSuccess.classList.add('hidden');

    if (!pass) {
      this.showVaultLoadError('⚠️ Please enter your secret password!');
      return;
    }

    // Match case-insensitively
    let matchedKey = null;
    for (const key of Object.keys(this.saveVault)) {
      if (key.trim().toLowerCase() === pass.toLowerCase()) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      this.showVaultLoadError(`⚠️ Secret password "${pass}" not found in the save vault!`);
      return;
    }

    this.loadRunByPassword(matchedKey);
  }

  showVaultLoadError(msg) {
    if (!this.vaultLoadError) return;
    this.vaultLoadError.innerText = msg;
    this.vaultLoadError.classList.remove('hidden');
    if (this.vaultLoadPassInput) this.vaultLoadPassInput.focus();
  }

  loadRunByPassword(password) {
    const entry = this.saveVault[password];
    if (!entry || !entry.saveCode) {
      this.showVaultLoadError('⚠️ Error: corrupted save entry in vault!');
      return;
    }

    const decoded = this.decodeSaveCode(entry.saveCode);
    if (!decoded) {
      this.showVaultLoadError('⚠️ Error: unable to decode save code!');
      return;
    }

    this.applyRunData(decoded, password, true);

    try {
      localStorage.setItem('tds_active_run_password', password);
    } catch (e) {}

    this.updateRunVaultHUDButton();
    this.renderSaveVaultList();

    if (this.vaultLoadSuccess) {
      this.vaultLoadSuccess.innerText = `✅ Loaded run "${password}" (Wave ${this.wave}, ${this.coins} 🪙)! Resuming run...`;
      this.vaultLoadSuccess.classList.remove('hidden');
    }

    if (this.vaultLoadPassInput) this.vaultLoadPassInput.value = '';

    setTimeout(() => {
      this.closeRunVaultModal();
      this.closeAdminPanel();
      this.addDamageText(this.towerBaseX + 35, this.groundY - 140, `▶️ RESUMED: ${password}`, '#00f3ff');
      window.soundManager.playUpgrade();
      this.startWave(this.wave);
    }, 600);
  }

  applyRunData(data, password, shouldResetCombat = false) {
    if (!data) return;
    this.currentRunPassword = password || data.password || this.currentRunPassword;
    this.wave = data.wave || 1;
    this.coins = typeof data.coins === 'number' ? data.coins : 20;
    this.crystals = typeof data.crystals === 'number' ? data.crystals : 0;
    this.towerHp = typeof data.towerHp === 'number' ? data.towerHp : 500;
    this.maxTowerHp = typeof data.maxTowerHp === 'number' ? data.maxTowerHp : 500;
    this.hasBoughtFirstTurret = !!data.hasBoughtFirstTurret;
    if (data.autoAdvanceWave !== undefined) {
      this.autoWave = !!data.autoAdvanceWave;
      if (this.autoWaveBtn) {
        this.autoWaveBtn.innerText = this.autoWave ? '🔁 Auto Wave: ON' : '🔁 Auto Wave: OFF';
        this.autoWaveBtn.classList.toggle('active', this.autoWave);
      }
    }

    // Apply crate slots
    if (Array.isArray(data.slots)) {
      for (let i = 0; i < 5; i++) {
        const savedSlot = data.slots[i] || {};
        this.slots[i].weapon = savedSlot.weapon || null;
        this.slots[i].level = typeof savedSlot.level === 'number' ? savedSlot.level : 0;
        this.slots[i].awakened = !!savedSlot.awakened;
        this.slots[i].timer = 0;
        this.slots[i].subTimer = 0;
      }
    }

    if (shouldResetCombat) {
      this.enemies = [];
      this.projectiles = [];
      this.particles = [];
      this.damageNumbers = [];
      this.beams = [];
      this.lightningArcs = [];
      this.plasmaPools = [];
      this.quantumScars = [];
      this.ballLightnings = [];
      this.crescentWaves = [];
      this.godsPeaceTimer = 0;
      this.isWaveActive = false;
      this.gameOver = false;
      if (this.overlayBanner) this.overlayBanner.classList.add('hidden');
    }

    this.updateHUD();
    this.renderCrateSlotsUI();
    this.selectSlot(this.selectedSlotIndex || 0);
  }

  generateSaveCode() {
    const runData = {
      version: 1,
      password: this.currentRunPassword || 'unnamed',
      wave: this.wave,
      coins: this.coins,
      crystals: this.crystals || 0,
      towerHp: this.towerHp,
      maxTowerHp: this.maxTowerHp,
      hasBoughtFirstTurret: this.hasBoughtFirstTurret,
      autoAdvanceWave: this.autoWave,
      slots: this.slots.map(s => ({
        id: s.id,
        weapon: s.weapon,
        level: s.level,
        awakened: !!s.awakened
      })),
      savedAt: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(runData);
    return 'TDS1_' + btoa(unescape(encodeURIComponent(jsonStr)));
  }

  decodeSaveCode(code) {
    try {
      if (!code || typeof code !== 'string') return null;
      if (code.startsWith('TDS1_')) {
        const b64 = code.substring(5);
        const jsonStr = decodeURIComponent(escape(atob(b64)));
        return JSON.parse(jsonStr);
      }
      return null;
    } catch (e) {
      console.error('Failed to decode save code:', e);
      return null;
    }
  }

  saveCurrentRun(manualNotification = false) {
    if (!this.currentRunPassword) return;

    const saveCode = this.generateSaveCode();
    const existing = this.saveVault[this.currentRunPassword] || {};

    const updated = {
      ...existing,
      password: this.currentRunPassword,
      wave: this.wave,
      coins: this.coins,
      crystals: this.crystals || 0,
      towerHp: this.towerHp,
      maxTowerHp: this.maxTowerHp,
      hasBoughtFirstTurret: this.hasBoughtFirstTurret,
      autoAdvanceWave: this.autoWave,
      slots: this.slots.map(s => ({ id: s.id, weapon: s.weapon, level: s.level, awakened: !!s.awakened })),
      saveCode: saveCode,
      createdAt: existing.createdAt || new Date().toISOString(),
      lastSaved: new Date().toISOString()
    };

    this.saveVault[this.currentRunPassword] = updated;
    this.persistVault();
    this.renderSaveVaultList();

    if (this.vaultCurrentStats) {
      this.vaultCurrentStats.innerText = `Wave ${this.wave} • ${this.coins} 🪙 • HP ${this.towerHp}/${this.maxTowerHp}`;
    }

    if (manualNotification) {
      window.soundManager.playUpgrade();
      this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '💾 RUN SAVED!', '#ffd166');
      alert(`Run "${this.currentRunPassword}" saved successfully!\nSave Code updated.`);
    }
  }

  autoSaveCurrentRun() {
    if (this.currentRunPassword) {
      this.saveCurrentRun(false);
    }
  }

  persistVault() {
    try {
      localStorage.setItem('tds_save_vault', JSON.stringify(this.saveVault));
    } catch (e) {
      console.warn('Could not persist vault to localStorage:', e);
    }
  }

  updateRunVaultHUDButton() {
    if (!this.runVaultBtn) return;
    if (this.currentRunPassword) {
      this.runVaultBtn.innerText = `🔑 RUN: ${this.currentRunPassword}`;
      this.runVaultBtn.title = `Active Secret Run: ${this.currentRunPassword} (Click to open vault)`;
    } else {
      this.runVaultBtn.innerText = '🔑 RUN: NONE';
      this.runVaultBtn.title = 'No active run. Click to create or enter your secret password.';
    }
  }

  renderSaveVaultList() {
    if (!this.vaultEntriesList) return;
    this.vaultEntriesList.innerHTML = '';

    const keys = Object.keys(this.saveVault);
    if (this.vaultRunsCount) {
      this.vaultRunsCount.innerText = keys.length;
    }

    if (keys.length === 0) {
      this.vaultEntriesList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 20px;">
          No saved runs in vault yet. Create your secret password to start your first run!
        </div>
      `;
      return;
    }

    for (const key of keys) {
      const entry = this.saveVault[key];
      const isCurrent = this.currentRunPassword && this.currentRunPassword.toLowerCase() === key.toLowerCase();

      const card = document.createElement('div');
      card.className = `vault-entry-card ${isCurrent ? 'is-current' : ''}`;

      card.innerHTML = `
        <div class="entry-top-row">
          <div class="entry-pass-title">
            <span class="entry-key-icon">🔑</span>
            <span class="entry-password">${entry.password}</span>
            ${isCurrent ? '<span class="entry-current-badge">CURRENT RUN</span>' : ''}
          </div>
          <div class="entry-stats">
            Wave ${entry.wave || 1} &bull; ${entry.coins || 0} 🪙
          </div>
        </div>
        <div class="entry-code-row">
          <span class="entry-code-preview" title="${entry.saveCode}">${entry.saveCode}</span>
          <div class="entry-actions">
            <button class="vault-mini-btn cyan copy-entry-code-btn" data-code="${entry.saveCode}">📋 Copy</button>
            <button class="vault-mini-btn gold play-entry-btn" data-pass="${entry.password}">▶️ Play</button>
          </div>
        </div>
      `;

      // Copy button
      const copyBtn = card.querySelector('.copy-entry-code-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(entry.saveCode).then(() => {
          copyBtn.innerText = '✅ Copied!';
          setTimeout(() => { copyBtn.innerText = '📋 Copy'; }, 1500);
        });
      });

      // Play button
      const playBtn = card.querySelector('.play-entry-btn');
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadRunByPassword(entry.password);
      });

      this.vaultEntriesList.appendChild(card);
    }
  }

  downloadSavesJson() {
    const payload = {
      updatedAt: new Date().toISOString(),
      runs: this.saveVault
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saves.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '📥 DOWNLOADED saves.json', '#ffd166');
  }

  copyAllVaultJson() {
    const payload = {
      updatedAt: new Date().toISOString(),
      runs: this.saveVault
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      this.addDamageText(this.towerBaseX + 35, this.groundY - 140, '📋 VAULT JSON COPIED!', '#00f3ff');
      alert('All vault runs & save codes copied to clipboard as JSON!');
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
        if (slot.awakened) {
          stars = `<span class="awakened-stars-tag">✨ AWAKENED</span>`;
          if (slot.level > wepDef.maxUpgrades) {
            stars += ` <span class="secret-stars-tag">🌌 (+${slot.level - wepDef.maxUpgrades})</span>`;
          }
        } else if (slot.level > wepDef.maxUpgrades) {
          stars = `<span class="secret-stars-tag">🌌 Lv.${slot.level} (+${slot.level - wepDef.maxUpgrades})</span>`;
        } else {
          for (let s = 0; s < wepDef.maxUpgrades; s++) {
            stars += s < slot.level ? '★' : '☆';
          }
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

      // Stars, Awakened Badge, or Secret Overload Badge
      if (slot.awakened) {
        const title = wep.awakened ? wep.awakened.title : 'MYTHIC';
        if (slot.level > wep.maxUpgrades) {
          this.inspectStars.innerHTML = `<span class="awakened-stars-badge">✨ AWAKENED: ${title}</span> <span class="secret-stars-badge">🌌 (+${(slot.level - wep.maxUpgrades).toLocaleString()})</span>`;
        } else {
          this.inspectStars.innerHTML = `<span class="awakened-stars-badge">✨ AWAKENED: ${title}</span>`;
        }
      } else if (slot.level > wep.maxUpgrades) {
        this.inspectStars.innerHTML = `<span class="secret-stars-badge">🌌 SECRET OVERLOAD &bull; Lv. ${slot.level.toLocaleString()} (+${(slot.level - wep.maxUpgrades).toLocaleString()})</span>`;
      } else {
        let starStr = '';
        for (let s = 0; s < wep.maxUpgrades; s++) {
          starStr += s < slot.level ? '★ ' : '☆ ';
        }
        if (slot.level === wep.maxUpgrades) {
          starStr += ' [MAX]';
        }
        this.inspectStars.innerText = starStr;
      }

      // Stats calculation for current level
      const currentStats = this.getWeaponStats(slot);
      let dmgDisplay = '';
      if (currentStats.damage >= 1e18) dmgDisplay = (currentStats.damage / 1e18).toFixed(2) + 'Qi';
      else if (currentStats.damage >= 1e15) dmgDisplay = (currentStats.damage / 1e15).toFixed(2) + 'Qa';
      else if (currentStats.damage >= 1e12) dmgDisplay = (currentStats.damage / 1e12).toFixed(2) + 'T';
      else if (currentStats.damage >= 1e9) dmgDisplay = (currentStats.damage / 1e9).toFixed(2) + 'B';
      else if (currentStats.damage >= 1e6) dmgDisplay = (currentStats.damage / 1e6).toFixed(2) + 'M';
      else if (currentStats.damage >= 1e4) dmgDisplay = (currentStats.damage / 1e3).toFixed(1) + 'k';
      else dmgDisplay = currentStats.damage.toFixed(1);
      let statsHtml = `
        <span>DMG: <b>${dmgDisplay}</b></span>
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
      if (slot.awakened && wep.awakened) {
        statsHtml += `<div class="awakened-power-desc">✨ <b>${wep.awakened.title}</b>: ${wep.awakened.desc}</div>`;
      }
      this.inspectStatsGrid.innerHTML = statsHtml;

      // Upgrade button status
      if (slot.level >= wep.maxUpgrades) {
        this.upgradeWeaponBtn.disabled = true;
        this.upgradeCostTag.innerText = slot.level > wep.maxUpgrades ? 'OVERLOADED' : 'MAX LEVEL';
      } else {
        const cost = wep.upgradeCosts[slot.level];
        this.upgradeCostTag.innerText = `🪙 ${cost}`;
        this.upgradeWeaponBtn.disabled = this.coins < cost;
      }

      // Awaken Button status
      if (this.awakenWeaponBtn) {
        if (slot.level >= wep.maxUpgrades && !slot.awakened) {
          this.awakenWeaponBtn.classList.remove('hidden');
          this.awakenWeaponBtn.disabled = (this.crystals || 0) < 1;
        } else {
          this.awakenWeaponBtn.classList.add('hidden');
        }
      }
    }
    this.renderShop(); // Refresh buy button disable states
  }

  renderShop() {
    this.weaponStoreList.innerHTML = '';
    const selectedSlot = this.slots[this.selectedSlotIndex];

    Object.values(WEAPON_REGISTRY).forEach(wep => {
      // Secret weapons marked adminOnly cannot be bought in regular shop!
      if (wep.adminOnly) return;

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
    this.autoSaveCurrentRun();
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
    this.autoSaveCurrentRun();
  }

  awakenSelectedSlot() {
    const slot = this.slots[this.selectedSlotIndex];
    if (!slot || !slot.weapon) return;
    const wep = WEAPON_REGISTRY[slot.weapon];
    if (!wep) return;
    if (slot.level < wep.maxUpgrades) return; // Must be at max standard level
    if (slot.awakened) return; // Already awakened
    if ((this.crystals || 0) < 1) return; // Costs 1 crystal

    this.crystals -= 1;
    slot.awakened = true;

    // Celebratory cosmic awakening VFX
    const coords = this.getSlotCoords(this.selectedSlotIndex);
    this.createExplosionParticles(coords.x + 35, coords.y, '#00f3ff', 35);
    this.createExplosionParticles(coords.x + 35, coords.y, '#ff0080', 35);
    this.createExplosionParticles(coords.x + 35, coords.y, '#ffd166', 35);
    this.createExplosionParticles(coords.x + 35, coords.y, '#7928ca', 35);

    const title = wep.awakened ? wep.awakened.title : 'AWAKENED';
    this.addDamageText(coords.x + 35, coords.y - 30, `✨ ${title}!`, '#00f3ff');
    this.addDamageText(coords.x + 35, coords.y - 10, '💎 WEAPON AWAKENED!', '#ff0080');
    this.cameraShake = 0.35;

    if (window.soundManager && window.soundManager.playUpgrade) {
      window.soundManager.playUpgrade();
    }

    this.updateHUD();
    this.renderCrateSlotsUI();
    this.updateInspector();
    this.autoSaveCurrentRun();
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
    this.autoSaveCurrentRun();
  }

  getWeaponStats(slot) {
    const wep = WEAPON_REGISTRY[slot.weapon];
    if (!wep) return {};
    if (slot.level === 0) {
      return { ...wep.baseStats };
    }

    const maxNormal = wep.statUpgrades.length;
    // Standard normal upgrades (1 to maxNormal)
    if (slot.level <= maxNormal) {
      const upg = wep.statUpgrades[slot.level - 1];
      return { ...wep.baseStats, ...upg };
    }

    // 1,000 SECRET UPGRADES: Secret Ascension & Overload Tiers
    // Level is greater than standard max (up to maxNormal + 1000)
    const baseStats = wep.baseStats;
    const peakNormal = { ...baseStats, ...wep.statUpgrades[maxNormal - 1] };
    const extra = slot.level - maxNormal; // 1 to 1000+

    // Clone peak stats and scale powerfully for secret tiers
    const stats = { ...peakNormal };

    // 1. Damage: scales by +35% per secret level
    if (stats.damage !== undefined) {
      stats.damage = peakNormal.damage * (1 + extra * 0.35);
    }

    // 2. Fire interval: progressively faster rate (clamped safely at 0.04s, or 0.1s for screen nukes)
    if (stats.interval !== undefined) {
      const minInterval = slot.weapon === 'ban_gun' ? 0.1 : 0.04;
      stats.interval = Math.max(minInterval, peakNormal.interval * Math.pow(0.985, extra));
      stats.interval = Math.round(stats.interval * 1000) / 1000;
    }

    // 3. Tick interval (for minigun, flamethrower, chainsaw, energy blade, etc.)
    if (stats.tickInterval !== undefined) {
      stats.tickInterval = Math.max(0.015, peakNormal.tickInterval * Math.pow(0.99, extra));
      stats.tickInterval = Math.round(stats.tickInterval * 1000) / 1000;
    }

    // 4. Cycle interval (for flamethrower, RPG, railgun, mortar, solar core)
    if (stats.cycleInterval !== undefined) {
      stats.cycleInterval = Math.max(0.4, peakNormal.cycleInterval * Math.pow(0.98, extra));
      stats.cycleInterval = Math.round(stats.cycleInterval * 100) / 100;
    }

    // 5. Blast / AoE / Zone radius
    if (stats.blastRadius !== undefined) {
      stats.blastRadius = Math.min(500, peakNormal.blastRadius + extra * 0.6);
    }
    if (stats.slamRadius !== undefined) {
      stats.slamRadius = Math.min(500, peakNormal.slamRadius + extra * 0.6);
    }
    if (stats.vortexRadius !== undefined) {
      stats.vortexRadius = Math.min(420, peakNormal.vortexRadius + extra * 0.5);
    }
    if (stats.spinRadius !== undefined) {
      stats.spinRadius = Math.min(320, peakNormal.spinRadius + extra * 0.4);
    }
    if (stats.auraRadius !== undefined) {
      stats.auraRadius = Math.min(350, peakNormal.auraRadius + extra * 0.4);
    }
    if (stats.flareRadius !== undefined) {
      stats.flareRadius = Math.min(500, peakNormal.flareRadius + extra * 0.6);
    }

    // 6. Special mechanics scaling
    // Shotgun pellets: +1 pellet every 8 secret levels
    if (stats.pellets !== undefined) {
      stats.pellets = peakNormal.pellets + Math.floor(extra / 8);
    }
    // Tesla coil chains: +1 chain bounce every 6 secret levels
    if (stats.chainCount !== undefined) {
      stats.chainCount = peakNormal.chainCount + Math.floor(extra / 6);
    }
    // Toxic sprayer giant killer bonus: +0.05x per secret level
    if (stats.giantBonus !== undefined) {
      stats.giantBonus = Math.round((peakNormal.giantBonus + extra * 0.05) * 10) / 10;
    }
    // Orbital mortar pool DPS: scales with damage
    if (stats.poolDps !== undefined) {
      stats.poolDps = peakNormal.poolDps * (1 + extra * 0.35);
    }
    // Solar flare burst damage: scales with damage
    if (stats.flareDamage !== undefined) {
      stats.flareDamage = peakNormal.flareDamage * (1 + extra * 0.35);
    }

    return stats;
  }

  updateHUD() {
    this.coinDisplay.innerText = Math.floor(this.coins);
    if (this.crystalDisplay) {
      this.crystalDisplay.innerText = this.crystals || 0;
    }
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
    } else if (type === 'weak_weapon_dummy' || type === 'dummy') {
      // Weak Weapon Dummy - 1 Billion HP, deals 500 damage every 10 sec
      hp = 1000000000;
      speed = 10;
      size = 64;
      coinReward = 10000;
      color = '#c9935a';
      name = 'Weak Weapon Dummy';
      attackDamage = 500;
      attackInterval = 10.0;
      attackRange = 0;
    }

    // Apply late-game scaling and blood moon (except Weak Weapon Dummy to maintain exact 1B HP and 500 damage)
    if (type !== 'weak_weapon_dummy' && type !== 'dummy') {
      hp = Math.floor(hp * lateScale * bloodMoonMult);
      attackDamage = Math.floor(attackDamage * lateScale * bloodMoonMult);
      coinReward = Math.floor(coinReward * lateScale);
    }

    // Guaranteed 1,000 coins for secret 1x1x1 boss
    if (type === 'boss_1x1x1' || type === '1x1x1') {
      coinReward = 1000;
    }

    const isBoss = ['boss', 'doom_colossus', 'phantom_overlord', 'inferno_wyrm', 'boss_1x1x1', '1x1x1', 'weak_weapon_dummy', 'dummy'].includes(type) || ['boss', 'doom_colossus', 'phantom_overlord', 'inferno_wyrm', 'boss_1x1x1', '1x1x1', 'weak_weapon_dummy', 'dummy'].includes(enemyType);

    this.enemies.push({
      type: enemyType,
      name: name,
      isBoss: isBoss,
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
      attackCooldown: (enemyType === 'weak_weapon_dummy' || enemyType === 'dummy') ? 10.0 : 0.5,
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
      if (this.gameSpeed > 1) {
        // High-precision physics sub-stepping (5x more sub-ticks) to guarantee bullet collisions,
        // weapon ticks, and enemy tracking remain 100% accurate at all speeds:
        // 2x: 5 steps
        // 5x: 10 steps (was 2)
        // 10x: 20 steps (was 4)
        // 20x: 30 steps (was 6)
        // 100x: 60 steps (was 12)
        let steps = 5;
        if (this.gameSpeed === 5) steps = 10;
        else if (this.gameSpeed === 10) steps = 20;
        else if (this.gameSpeed === 20) steps = 30;
        else if (this.gameSpeed === 100) steps = 60;
        else if (this.gameSpeed > 1) steps = Math.min(100, Math.round(this.gameSpeed * 2.5));

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
        this.autoSaveCurrentRun();

        if (this.autoWave) {
          this.autoWaveTimer = 1.2;
          this.overlayActionBtn.innerText = `NEXT WAVE (${this.autoWaveTimer.toFixed(1)}s)`;
        } else {
          this.overlayActionBtn.innerText = 'NEXT WAVE';
        }
        this.overlayBanner.classList.remove('hidden');
      }
    } else if (!this.gameOver && this.autoWave && this.autoWaveTimer > 0) {
      this.autoWaveTimer -= dt;
      if (this.autoWaveTimer <= 0) {
        this.autoWaveTimer = 0;
        this.overlayBanner.classList.add('hidden');
        this.startWave(this.wave + 1);
      } else {
        this.overlayActionBtn.innerText = `NEXT WAVE (${Math.max(0.1, this.autoWaveTimer).toFixed(1)}s)`;
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
          if (p.vy) p.y += p.vy * dt;
          if (p.x >= p.originX + p.range) {
            p.returning = true;
            p.vx = -p.sawSpeed;
            if (p.vy) p.vy = -p.vy;
          }
        } else {
          p.x += p.vx * dt;
          if (p.vy) p.y += p.vy * dt;
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
              // Awakened Twin Guillotines: 40% bleed over 3s
              if (p.isAwakened) {
                e.bleedTimer = 3.0;
                e.bleedDps = p.damage * 0.4 / 3;
                this.addDamageText(e.x, e.y - 15, '🩸BLEED', '#d90429');
              }
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
            isAwakened: p.isAwakened,
            tickTimer: 0
          });

          this.projectiles.splice(i, 1);
          continue;
        }
        continue;
      }

      // Homing micro-missile steering (Turret Awakened)
      if (p.isMissile && p.target && p.target.hp > 0) {
        const targetAngle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
        const curAngle = Math.atan2(p.vy, p.vx);
        let diff = targetAngle - curAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        const newAngle = curAngle + Math.sign(diff) * Math.min(Math.abs(diff), 8.0 * dt);
        const speed = Math.hypot(p.vx, p.vy);
        p.vx = Math.cos(newAngle) * speed;
        p.vy = Math.sin(newAngle) * speed;
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

      // Piercing bullet handling (Sniper Void Piercer)
      if (p.piercing) {
        p.hitEnemies = p.hitEnemies || new Set();
        for (let e of this.enemies) {
          if (!p.hitEnemies.has(e) && e.hp > 0) {
            const dx = p.x - e.x;
            const dy = p.y - e.y;
            if (Math.hypot(dx, dy) < e.size / 2 + p.radius) {
              p.hitEnemies.add(e);
              let dmg = p.damage;
              if (e.hp / e.maxHp > 0.6) {
                dmg *= 2.5;
                this.addDamageText(e.x, e.y - 20, '⚔EXECUTE!', '#c77dff');
              }
              this.damageEnemy(e, dmg, p.color);
              this.createExplosionParticles(p.x, p.y, p.color, 6);
            }
          }
        }
        if (p.lifetime <= 0) {
          this.projectiles.splice(i, 1);
        }
        continue;
      }

      // Check collision with enemies
      let hit = false;
      for (let e of this.enemies) {
        if (e.hp <= 0) continue;
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
            // Hellstorm Barrage armor shred (+50% damage taken)
            if (pool.isAwakened) {
              enemy.armorShatterTimer = 1.0;
              enemy.armorShatterMult = 1.5;
            }
          }
        }
      }

      if (pool.duration <= 0) {
        this.plasmaPools.splice(i, 1);
      }
    }

    // 4d. Update Quantum Scars (Railgun Singularity Lance)
    if (this.quantumScars) {
      for (let i = this.quantumScars.length - 1; i >= 0; i--) {
        const s = this.quantumScars[i];
        s.life -= dt;
        s.tickTimer = (s.tickTimer || 0) + dt;
        if (s.tickTimer >= 0.2) {
          s.tickTimer = 0;
          for (let enemy of this.enemies) {
            const dist = this.pointToSegmentDistance(enemy.x, enemy.y, s.x1, s.y1, s.x2, s.y2);
            if (dist <= enemy.size / 2 + 15) {
              this.damageEnemy(enemy, s.dps * 0.2, '#00f3ff');
              enemy.slowTimer = 0.5;
              enemy.slowMult = 0.6;
            }
          }
        }
        if (s.life <= 0) this.quantumScars.splice(i, 1);
      }
    }

    // 4e. Update Ball Lightnings (Tesla Coil Mjolnir Storm)
    if (this.ballLightnings) {
      for (let i = this.ballLightnings.length - 1; i >= 0; i--) {
        const bl = this.ballLightnings[i];
        bl.life -= dt;
        bl.zapTimer = (bl.zapTimer || 0) + dt;
        bl.x += Math.sin(performance.now() / 250 + i) * 15 * dt;
        bl.y += Math.cos(performance.now() / 300 + i) * 8 * dt;
        if (bl.zapTimer >= 0.3) {
          bl.zapTimer = 0;
          let zapped = 0;
          for (let enemy of this.enemies) {
            if (enemy.hp <= 0) continue;
            if (Math.hypot(enemy.x - bl.x, enemy.y - bl.y) <= 180) {
              this.damageEnemy(enemy, bl.damage, '#c77dff');
              this.addLightningArc(bl.x, bl.y, enemy.x, enemy.y, '#00f3ff');
              zapped++;
              if (zapped >= 2) break;
            }
          }
        }
        if (bl.life <= 0) this.ballLightnings.splice(i, 1);
      }
    }

    // 4f. Update Crescent Waves (Energy Blade Crescent Eclipse)
    if (this.crescentWaves) {
      for (let i = this.crescentWaves.length - 1; i >= 0; i--) {
        const cw = this.crescentWaves[i];
        cw.x += cw.vx * dt;
        cw.life -= dt;
        for (let enemy of this.enemies) {
          if (!cw.hitEnemies.has(enemy) && enemy.hp > 0) {
            if (Math.abs(enemy.x - cw.x) < 25 && Math.abs(enemy.y - cw.y) < cw.width / 2 + enemy.size / 2) {
              cw.hitEnemies.add(enemy);
              this.damageEnemy(enemy, cw.damage, '#00f3ff');
              this.createExplosionParticles(enemy.x, enemy.y, '#00f3ff', 8);
            }
          }
        }
        if (cw.life <= 0) this.crescentWaves.splice(i, 1);
      }
    }

    // Update Peace of the Gods (Ban Gun Judgement Day)
    if (this.godsPeaceTimer > 0) {
      this.godsPeaceTimer -= dt;
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

      // Peace of the Gods: all enemies frozen in golden time!
      if (this.godsPeaceTimer > 0) {
        continue;
      }

      // Check Stun & Frozen
      if (enemy.stunTimer > 0) {
        enemy.stunTimer -= dt;
        continue;
      }
      if (enemy.frozenTimer > 0) {
        enemy.frozenTimer -= dt;
        continue;
      }

      // Burn DoT
      if (enemy.burnTimer > 0) {
        enemy.burnTimer -= dt;
        this.damageEnemy(enemy, (enemy.burnDps || 8) * dt, '#ff4800');
      }

      // Bleed DoT
      if (enemy.bleedTimer > 0) {
        enemy.bleedTimer -= dt;
        this.damageEnemy(enemy, (enemy.bleedDps || 8) * dt, '#d90429');
      }

      // Armor shatter timer
      if (enemy.armorShatterTimer > 0) {
        enemy.armorShatterTimer -= dt;
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

        // Awakened death effects:
        if (enemy.neurotoxin || enemy.poisonDps > 0) {
          this.createExplosionParticles(enemy.x, enemy.y, '#70e000', 16);
          for (let other of this.enemies) {
            if (other !== enemy && other.hp > 0 && Math.hypot(other.x - enemy.x, other.y - enemy.y) <= 80) {
              this.damageEnemy(other, 25 + this.wave * 2, '#70e000');
            }
          }
        }
        if (enemy.frozenTimer > 0) {
          this.createExplosionParticles(enemy.x, enemy.y, '#00f3ff', 20);
          for (let s = 0; s < 8; s++) {
            const sang = (s * Math.PI) / 4;
            this.fireBullet(enemy.x, enemy.y, sang, 15 + this.wave * 1.5, 300, '#00f3ff', 4);
          }
        }

        // Award 1 Boss Crystal whenever any boss is defeated!
        if (enemy.isBoss) {
          this.crystals = (this.crystals || 0) + 1;
          this.addDamageText(enemy.x, enemy.y - 35, '+1 💎 CRYSTAL!', '#00f3ff');
          this.createExplosionParticles(enemy.x, enemy.y, '#00f3ff', 25);
          this.createExplosionParticles(enemy.x, enemy.y, '#c77dff', 25);
          if (window.soundManager && window.soundManager.playUpgrade) {
            window.soundManager.playUpgrade();
          }
        }

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
    
    // Default visual angle towards target for aiming weapons only
    const isSelfRotatingOrMelee = ['energy_blade', 'chainsaw', 'void_rift', 'solar_core', 'graviton_hammer'].includes(slot.weapon);
    if (!isSelfRotatingOrMelee) {
      if (target) {
        slot.angle = Math.atan2(target.y - muzzleY, target.x - muzzleX);
      } else {
        slot.angle = 0;
      }
    }

    // Spec handling:
    switch (slot.weapon) {
      // 1. TURRET: Hyper-Charge Twin Battery (Dual bullets + seeking micro-missile every 4th volley with 3x dmg and 1s stun)
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

            if (slot.awakened) {
              slot.volleyCount = (slot.volleyCount || 0) + 1;
              // Dual paired parallel bullets
              this.fireBullet(spawnX, spawnY - 3, fireAngle, stats.damage, stats.bulletSpeed, '#00f3ff', 5);
              this.fireBullet(spawnX, spawnY + 3, fireAngle, stats.damage, stats.bulletSpeed, '#00f3ff', 5);

              // Every 4th volley fires a seeking micro-missile with 3x damage and 1s stun
              if (slot.volleyCount % 4 === 0) {
                this.fireBullet(spawnX, spawnY, fireAngle, stats.damage * 3, stats.bulletSpeed * 0.85, '#ff007f', 7, {
                  isMissile: true,
                  target: target
                });
                this.addDamageText(spawnX, spawnY - 15, '🚀 SEEKER MISSILE!', '#ff007f');
              }
            } else {
              this.fireBullet(spawnX, spawnY, fireAngle, stats.damage, stats.bulletSpeed, '#00f3ff', 5);
            }
            window.soundManager.playShoot('turret');
          }
        }
        break;
      }

      // 2. AK-47: Rampage Overdrive (Stacking fire rate up to +80% + 30% ricochet chance)
      case 'ak47': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
          if (slot.awakened) {
            slot.rampageStacks = Math.min(8, (slot.rampageStacks || 0) + dt * 1.5);
          }
        } else {
          if (slot.awakened) {
            slot.rampageStacks = Math.max(0, (slot.rampageStacks || 0) - dt * 2.0);
          }
        }

        const effInterval = slot.awakened
          ? stats.interval / (1 + (slot.rampageStacks || 0) * 0.1)
          : stats.interval;

        if (slot.timer >= effInterval) {
          if (target) {
            slot.timer = 0;
            const leadAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const spread = (Math.random() - 0.5) * (slot.awakened ? 0.08 : 0.05);
            const spawnX = muzzleX + Math.cos(leadAngle) * 20;
            const spawnY = muzzleY + Math.sin(leadAngle) * 20;
            const bulletColor = slot.awakened ? '#ff4800' : '#ffb703';
            this.fireBullet(spawnX, spawnY, leadAngle + spread, stats.damage, stats.bulletSpeed, bulletColor, 4.5, {
              ricochet: slot.awakened ? 0.30 : 0
            });
            window.soundManager.playShoot('ak47');
          }
        }
        break;
      }

      // 3. MINIGUN: Incendiary Vulcan (24px explosive micro-blasts + 2s ignite burning DoT)
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
            const color = slot.awakened ? '#ff3300' : '#ffaa00';
            this.fireBullet(spawnX, spawnY, leadAngle + spread, stats.damage, stats.bulletSpeed, color, 3.5, {
              explosive: slot.awakened,
              blastRadius: 24,
              ignite: slot.awakened
            });
            if (Math.random() < 0.25) window.soundManager.playShoot('minigun');
          }
        }
        break;
      }

      // 4. ENERGY RAILGUN: Singularity Lance (Instant beam + 3.0s lingering quantum scar with 70% dps and 40% slow)
      case 'railgun': {
        slot.timer += dt;
        if (target) {
          slot.angle = Math.atan2(target.y - muzzleY, target.x - muzzleX);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            this.fireRailgunBeam(muzzleX, muzzleY, slot.angle, stats.damage, stats.beamWidth, stats.range, slot.awakened);
            window.soundManager.playShoot('railgun');
          }
        }
        break;
      }

      // 5. RPG: Cluster Cataclysm (Main rocket detonation + 6 scattering cluster bomblets in 200px radius for 35% damage)
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
            this.fireRPGGrenade(spawnX, spawnY, leadAngle, stats.damage, stats.bulletSpeed, stats.blastRadius, slot.awakened);
            window.soundManager.playShoot('ak47');
          }
        }
        break;
      }

      // 6. FLAMETHROWER: Dragon's Cataclysm (360-degree blue hellfire surrounding tower + sticky ground napalm)
      case 'flamethrower': {
        slot.timer += dt;
        const isBlowingFire = slot.timer >= stats.cycleInterval;
        if (isBlowingFire) {
          slot.subTimer += dt;
          if (slot.awakened) {
            // Dragon's Cataclysm: 360-degree blue hellfire
            const flameAngle = Math.random() * Math.PI * 2;
            this.particles.push({
              x: muzzleX,
              y: muzzleY,
              vx: Math.cos(flameAngle) * (180 + Math.random() * 80),
              vy: Math.sin(flameAngle) * (180 + Math.random() * 80),
              color: Math.random() > 0.4 ? '#00f3ff' : '#7209b7',
              radius: 8 + Math.random() * 6,
              life: 0.45,
              maxLife: 0.45
            });

            if (slot.subTimer >= stats.tickInterval) {
              slot.subTimer = 0;
              window.soundManager.playFlame();
              for (let enemy of this.enemies) {
                const dist = Math.hypot(enemy.x - muzzleX, enemy.y - muzzleY);
                if (dist <= stats.range * 1.25) {
                  this.damageEnemy(enemy, stats.damage * 1.25, '#00f3ff');
                  enemy.burnTimer = 4.0;
                  enemy.burnDps = stats.damage * 0.5;
                }
              }
            }
          } else {
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
          }

          if (slot.timer >= stats.cycleInterval + stats.flameDuration) {
            slot.timer = 0;
          }
        }
        break;
      }

      // 7. CHAINSAW: Bloodthirsty Ripper (+30% spin radius + siphons 8% damage to heal Tower HP up to 25 HP/s)
      case 'chainsaw': {
        slot.subTimer += dt;
        const spinSpeed = slot.awakened ? (stats.rotSpeed || 10) * 2 : (stats.rotSpeed || 10);
        slot.angle = ((slot.angle || 0) + spinSpeed * dt) % (Math.PI * 2);
        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          let hitAny = false;
          const meleeMountX = coords.x + this.crateWidth / 2 + 15;
          const meleeMountY = coords.y;
          const curRadius = slot.awakened ? stats.spinRadius * 1.3 : stats.spinRadius;

          for (let enemy of this.enemies) {
            const dx = enemy.x - meleeMountX;
            const dy = enemy.y - meleeMountY;
            const dist = Math.hypot(dx, dy);
            if (dist <= curRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.damage, slot.awakened ? '#ff0054' : '#ffaa00');
              hitAny = true;
              this.createExplosionParticles(enemy.x, enemy.y, slot.awakened ? '#ff0054' : '#e0e1dd', 3);

              // Awakened Bloodthirsty Ripper: 8% life siphon to heal Tower HP
              if (slot.awakened) {
                const heal = Math.min(stats.damage * 0.08, 25 * stats.tickInterval);
                if (this.towerHp < this.maxTowerHp) {
                  this.towerHp = Math.min(this.maxTowerHp, this.towerHp + heal);
                  if (Math.random() < 0.2) {
                    this.addDamageText(this.towerBaseX + this.crateWidth / 2, this.groundY - 100, `+${heal.toFixed(1)} HP`, '#39ff14');
                  }
                  this.updateHUD();
                }
              }
            }
          }
          if (hitAny) window.soundManager.playChainsaw();
        }
        break;
      }

      // 8. ENERGY BLADE: Crescent Eclipse (Piercing crescent wave slashes every 0.6s reaching 350px)
      case 'energy_blade': {
        slot.subTimer += dt;
        slot.angle = ((slot.angle || 0) + (stats.rotSpeed || 16) * dt) % (Math.PI * 2);
        const meleeMountX = coords.x + this.crateWidth / 2 + 18;
        const meleeMountY = coords.y;

        // Awakened Crescent Eclipse: fires crescent wave every 0.6s
        if (slot.awakened) {
          slot.crescentTimer = (slot.crescentTimer || 0) + dt;
          if (slot.crescentTimer >= 0.6) {
            slot.crescentTimer = 0;
            this.crescentWaves.push({
              x: meleeMountX + 25,
              y: meleeMountY,
              vx: 450,
              width: 90,
              damage: stats.damage * 1.5,
              life: 350 / 450,
              hitEnemies: new Set()
            });
            window.soundManager.playEnergyBlade();
          }
        }

        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          let hitAny = false;

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

      // 9. SNIPER RIFLE: Void Piercer (Infinite bullet pierce through all targets + 2.5x executioner damage on >60% HP)
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
            const color = slot.awakened ? '#c77dff' : '#ffd166';
            this.fireBullet(spawnX, spawnY, leadAngle, stats.damage, stats.bulletSpeed, color, slot.awakened ? 5 : 3.5, {
              piercing: slot.awakened
            });
            this.createExplosionParticles(spawnX, spawnY, color, 10);
            window.soundManager.playShoot('sniper');
          }
        }
        break;
      }

      // 10. TESLA COIL: Mjolnir Storm (10 chain bounces + floating Ball Lightning orb zapping nearby targets for 3.5s)
      case 'tesla_coil': {
        slot.timer += dt;
        if (target) {
          slot.angle = Math.atan2(target.y - muzzleY, target.x - muzzleX);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const chains = slot.awakened ? 10 : stats.chainCount;
            this.fireTeslaLightning(muzzleX, muzzleY, target, stats.damage, chains, stats.chainDecay, stats.range, slot.awakened);
            window.soundManager.playTesla();
          }
        }
        break;
      }

      // 11. BUZZ SAW: Twin Guillotines (Launches 2 saws in scissor trajectory + 40% bleed over 3s)
      case 'buzz_saw': {
        slot.timer += dt;
        if (slot.timer >= stats.interval) {
          slot.timer = 0;
          if (slot.awakened) {
            // Twin scissor blades
            this.fireBuzzSaw(muzzleX, muzzleY - 10, stats.damage, stats.sawSpeed, stats.range, stats.sawRadius, -140, true);
            this.fireBuzzSaw(muzzleX, muzzleY + 10, stats.damage, stats.sawSpeed, stats.range, stats.sawRadius, 140, true);
          } else {
            this.fireBuzzSaw(muzzleX, muzzleY, stats.damage, stats.sawSpeed, stats.range, stats.sawRadius);
          }
          window.soundManager.playSaw();
        }
        break;
      }

      // 12. GRAVITON HAMMER: Tectonic Fracture (400px traveling magma fissure with 2.5s stun)
      case 'graviton_hammer': {
        slot.timer += dt;
        const chargeProgress = Math.min(1.0, slot.timer / stats.cycleInterval);
        slot.angle = -0.35 - chargeProgress * 0.95;

        if (slot.timer >= stats.cycleInterval) {
          slot.timer = 0;
          slot.angle = 0.45;
          const slamX = coords.x + this.crateWidth / 2 + 35;
          const slamY = coords.y;
          this.triggerHammerSlam(slamX, slamY, stats.damage, stats.slamRadius, stats.slowDuration, slot.awakened);
        }
        break;
      }

      // 13. VOID RIFT: Supermassive Collapse (2x pull force + 4s supermassive 6x damage implosion pulling all enemies)
      case 'void_rift': {
        slot.subTimer += dt;
        slot.angle = (slot.angle + 4.5 * dt) % (Math.PI * 2);
        const mountX = coords.x + this.crateWidth / 2 + 35;
        const mountY = coords.y;

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

        // Pull enemies (2x pull if awakened)
        const pullMult = slot.awakened ? 2.0 : 1.0;
        for (let enemy of this.enemies) {
          const dx = mountX - enemy.x;
          const dy = mountY - enemy.y;
          const dist = Math.hypot(dx, dy);
          if (dist <= stats.vortexRadius * 1.5 && dist > 10) {
            const pull = stats.pullStrength * pullMult * dt;
            enemy.x += (dx / dist) * pull;
            enemy.y += (dy / dist) * pull * 0.35;
          }
        }

        // Supermassive Collapse every 4s if awakened
        if (slot.awakened) {
          slot.collapseTimer = (slot.collapseTimer || 0) + dt;
          if (slot.collapseTimer >= 4.0) {
            slot.collapseTimer = 0;
            this.cameraShake = 0.35;
            window.soundManager.playVoid();
            this.createExplosionParticles(mountX, mountY, '#7209b7', 30);
            this.createExplosionParticles(mountX, mountY, '#c77dff', 20);
            this.addDamageText(mountX + 60, mountY - 30, '🌌 SUPERMASSIVE COLLAPSE!', '#c77dff');
            for (let enemy of this.enemies) {
              enemy.x = Math.max(this.towerBaseX + this.crateWidth / 2 + 40, enemy.x - 120);
              this.damageEnemy(enemy, stats.damage * 6, '#7209b7');
            }
          }
        }

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

      // 14. COMBAT SHOTGUN: Flak Annihilator (11 pellets + 45px knockback + 3s shattered armor (+25% damage taken))
      case 'shotgun': {
        slot.timer += dt;
        if (target) {
          slot.angle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
        }
        if (slot.timer >= stats.interval) {
          if (target) {
            slot.timer = 0;
            const baseAngle = this.getPredictiveAimAngle(muzzleX, muzzleY, target, stats.bulletSpeed);
            const numPellets = slot.awakened ? 11 : stats.pellets;
            const spreadTotal = slot.awakened ? stats.spreadAngle * 1.3 : stats.spreadAngle;
            for (let p = 0; p < numPellets; p++) {
              const spread = (p - (numPellets - 1) / 2) * (spreadTotal / (numPellets - 1 || 1)) + (Math.random() - 0.5) * 0.05;
              const fireAngle = baseAngle + spread;
              const spawnX = muzzleX + Math.cos(fireAngle) * 22;
              const spawnY = muzzleY + Math.sin(fireAngle) * 22;
              this.fireBullet(spawnX, spawnY, fireAngle, stats.damage, stats.bulletSpeed + (Math.random() - 0.5) * 80, '#ff9e00', 3.5, {
                isFlak: slot.awakened
              });
            }
            this.createExplosionParticles(muzzleX + Math.cos(baseAngle) * 22, muzzleY + Math.sin(baseAngle) * 22, '#ff5400', 10);
            window.soundManager.playShoot('shotgun');
          }
        }
        break;
      }

      // 15. CRYO CANNON: Absolute Zero (100% freeze immobilization for 1.8s + frost shard death bursts)
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
            this.fireCryoCanister(spawnX, spawnY, fireAngle, stats.damage, stats.bulletSpeed, stats.blastRadius, stats.slowAmount, stats.slowDuration, slot.awakened);
            window.soundManager.playCryo();
          }
        }
        break;
      }

      // 16. ORBITAL MORTAR: Hellstorm Barrage (3-shell salvo + 6.0s pool with 50% armor shred)
      case 'orbital_mortar': {
        slot.timer += dt;
        slot.angle = -Math.PI / 4;
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
            const targetX = bestTarget.x;
            const poolDur = slot.awakened ? 6.0 : stats.poolDuration;
            this.fireMortarShell(muzzleX, muzzleY, targetX, this.groundY - 10, stats.damage, stats.blastRadius, poolDur, stats.poolDps, slot.awakened);
            
            // Awakened Hellstorm Barrage: 3-shell salvo
            if (slot.awakened) {
              setTimeout(() => {
                this.fireMortarShell(muzzleX, muzzleY, targetX - 50, this.groundY - 10, stats.damage * 0.8, stats.blastRadius, poolDur, stats.poolDps, true);
              }, 120);
              setTimeout(() => {
                this.fireMortarShell(muzzleX, muzzleY, targetX + 50, this.groundY - 10, stats.damage * 0.8, stats.blastRadius, poolDur, stats.poolDps, true);
              }, 240);
            }
            window.soundManager.playMortarLaunch();
          }
        }
        break;
      }

      // 17. TOXIC SPRAYER: Plague Biohazard (Lingering neurotoxin cloud (-40% enemy attack) + acid death bursts)
      case 'toxic_sprayer': {
        slot.subTimer += dt;
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

                // Awakened Plague Biohazard: neurotoxin debuff (-40% attack)
                if (slot.awakened && !enemy.neurotoxin) {
                  enemy.neurotoxin = true;
                  enemy.attackDamage = Math.max(1, enemy.attackDamage * 0.6);
                  this.addDamageText(enemy.x, enemy.y - 25, '☣-40% ATK', '#70e000');
                }
              }
            }
          }
        }
        break;
      }

      // 18. SOLAR CORE: Supernova (1.6s flare cycle + screen-wide blind + 4 solar laser lances)
      case 'solar_core': {
        slot.timer += dt;
        slot.subTimer += dt;
        slot.angle = (slot.angle + 3.0 * dt) % (Math.PI * 2);
        const mountX = coords.x + this.crateWidth / 2 + 15;
        const mountY = coords.y;

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

        if (slot.subTimer >= stats.tickInterval) {
          slot.subTimer = 0;
          for (let enemy of this.enemies) {
            const dist = Math.hypot(enemy.x - mountX, enemy.y - mountY);
            if (dist <= stats.auraRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.damage, '#ffb703');
            }
          }
        }

        const flareInterval = slot.awakened ? 1.6 : stats.flareInterval;
        if (slot.timer >= flareInterval) {
          slot.timer = 0;
          window.soundManager.playSolarFlare();
          this.cameraShake = 0.16;

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

          for (let enemy of this.enemies) {
            const dist = Math.hypot(enemy.x - mountX, enemy.y - mountY);
            if (dist <= stats.flareRadius + enemy.size / 2) {
              this.damageEnemy(enemy, stats.flareDamage, '#ffb703');
              enemy.attackCooldown = Math.max(enemy.attackCooldown, slot.awakened ? 3.0 : stats.blindDuration);
              this.addDamageText(enemy.x, enemy.y - 25, '☀️ BLIND', '#ffd166');
            }
          }

          // Awakened Supernova: 4 concentrated solar laser lances
          if (slot.awakened) {
            const sortedEnemies = [...this.enemies].filter(e => e.hp > 0).sort((a, b) => {
              return Math.hypot(a.x - mountX, a.y - mountY) - Math.hypot(b.x - mountX, b.y - mountY);
            });
            for (let i = 0; i < Math.min(4, sortedEnemies.length); i++) {
              const e = sortedEnemies[i];
              this.beams.push({
                x1: mountX,
                y1: mountY,
                x2: e.x,
                y2: e.y,
                width: 6,
                lifetime: 0.35,
                maxLifetime: 0.35
              });
              this.damageEnemy(e, stats.flareDamage * 1.5, '#ffd166');
              this.createExplosionParticles(e.x, e.y, '#ffd166', 10);
            }
          }
        }
        break;
      }

      // 19. BAN GUN: Judgement Day (Double coin drops from all banned targets + 6s Peace of the Gods bubble freeze)
      case 'ban_gun': {
        slot.timer += dt;
        if (slot.timer >= stats.interval) {
          const targets = this.enemies.filter(e => e.hp > 0);
          if (targets.length > 0) {
            slot.timer = 0;
            this.cameraShake = 0.55;
            if (window.soundManager && window.soundManager.playExplosion) {
              window.soundManager.playExplosion();
            }

            this.addDamageText(this.towerBaseX + this.crateWidth + 120, this.groundY - 140, '🔨 BAN WAVE EXECUTED!', '#ff0055');
            this.addDamageText(this.towerBaseX + this.crateWidth + 120, this.groundY - 110, '🚫 ACCESS REVOKED 🚫', '#ffd166');

            if (slot.awakened) {
              this.godsPeaceTimer = 6.0;
              this.addDamageText(this.towerBaseX + this.crateWidth + 120, this.groundY - 80, '✨ PEACE OF THE GODS (6s) ✨', '#ffd166');
            }

            targets.forEach(enemy => {
              if (slot.awakened) {
                enemy.coinReward *= 2;
              }

              if (this.createLightningArc) {
                this.createLightningArc(muzzleX, muzzleY, enemy.x, enemy.y, '#ff0055');
              }

              this.beams.push({
                x1: muzzleX,
                y1: muzzleY,
                x2: enemy.x,
                y2: enemy.y,
                width: 7,
                lifetime: 0.35,
                maxLifetime: 0.35
              });

              this.createExplosionParticles(enemy.x, enemy.y, '#ff0055', 20);
              this.createExplosionParticles(enemy.x, enemy.y, '#ffd166', 12);

              const banDamage = Math.max(stats.damage || 10000000000, (enemy.maxHp || 1000) * 10, (enemy.hp + (enemy.shieldHp || 0)) * 10);
              this.damageEnemy(enemy, banDamage, '#ff0055');
              enemy.hp = 0;
              if (enemy.shieldHp) enemy.shieldHp = 0;

              this.addDamageText(enemy.x, enemy.y - 25, slot.awakened ? '🚫 PERMA-BANNED (2x🪙)!' : '🚫 BANNED!', '#ff0055');
            });
          } else {
            slot.timer = stats.interval;
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

  fireBullet(x, y, angle, damage, speed, color, radius, extras = {}) {
    this.projectiles.push({
      type: 'bullet',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage,
      color,
      radius,
      lifetime: 4.0,
      ...extras
    });
  }

  fireRPGGrenade(x, y, angle, totalDamage, speed, blastRadius, isAwakened = false) {
    this.projectiles.push({
      type: 'rpg',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      totalDamage,
      blastRadius,
      isAwakened,
      color: '#ff3366',
      radius: 8,
      lifetime: 4.0
    });
  }

  fireRailgunBeam(x, y, angle, damage, width, range, isAwakened = false) {
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

    // Awakened Singularity Lance: lingering quantum scar
    if (isAwakened) {
      this.quantumScars.push({
        x1: x,
        y1: y,
        x2: endX,
        y2: endY,
        width: width * 1.5,
        dps: damage * 0.7,
        life: 3.0,
        maxLife: 3.0,
        tickTimer: 0
      });
    }
  }

  fireBuzzSaw(x, y, damage, speed, range, radius, vy = 0, isAwakened = false) {
    this.projectiles.push({
      type: 'saw',
      x: x,
      y: y,
      originX: x,
      originY: y,
      vx: speed,
      vy: vy,
      range: range,
      sawSpeed: speed,
      radius: radius,
      damage: damage,
      returning: false,
      isAwakened: isAwakened,
      rotAngle: 0,
      lifetime: 8.0,
      hitCooldowns: new Map()
    });
  }

  fireTeslaLightning(originX, originY, firstTarget, baseDamage, maxChains, chainDecay, range, isAwakened = false) {
    let currentTarget = firstTarget;
    let currentDamage = baseDamage;
    const hitEnemies = new Set([firstTarget]);

    // First zap from coil to initial target
    this.damageEnemy(firstTarget, currentDamage, '#00f3ff');
    this.createExplosionParticles(firstTarget.x, firstTarget.y, '#00f3ff', 8);
    this.addLightningArc(originX, originY, firstTarget.x, firstTarget.y, '#00f3ff');

    // Awakened Mjolnir Storm: spawn Ball Lightning orb at target
    if (isAwakened && this.ballLightnings) {
      this.ballLightnings.push({
        x: firstTarget.x,
        y: firstTarget.y,
        damage: baseDamage * 0.8,
        life: 3.5,
        maxLife: 3.5,
        zapTimer: 0
      });
    }

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

  triggerHammerSlam(slamX, slamY, damage, radius, slowDuration, isAwakened = false) {
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

    // Awakened Tectonic Fracture: 400px traveling magma fissure
    if (isAwakened) {
      for (let fx = 0; fx < 400; fx += 25) {
        const px = slamX + fx;
        const py = this.groundY - 10 + (Math.random() - 0.5) * 12;
        this.createExplosionParticles(px, py, '#ff5400', 6);
        this.createExplosionParticles(px, py, '#ffd166', 4);
      }
      for (let enemy of this.enemies) {
        if (enemy.hp > 0 && enemy.x >= slamX && enemy.x <= slamX + 400) {
          this.damageEnemy(enemy, damage * 0.75, '#ff5400');
          enemy.stunTimer = 2.5;
          this.addDamageText(enemy.x, enemy.y - 25, '🌋 STUN 2.5s', '#ff5400');
        }
      }
    }
  }

  fireCryoCanister(x, y, angle, damage, speed, blastRadius, slowAmount, slowDuration, isAwakened = false) {
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
      isAwakened,
      color: '#00f3ff',
      radius: 7,
      lifetime: 4.0
    });
  }

  fireMortarShell(startX, startY, targetX, targetY, damage, blastRadius, poolDuration, poolDps, isAwakened = false) {
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
      isAwakened,
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
          if (p.isAwakened) {
            // Absolute Zero: 100% immobilized
            enemy.frozenTimer = 1.8;
            enemy.slowTimer = 1.8;
            enemy.slowMult = 0;
            this.addDamageText(enemy.x, enemy.y - 25, '❄ ABSOLUTE ZERO', '#00f3ff');
          } else {
            enemy.slowTimer = p.slowDuration;
            enemy.slowMult = 1 - p.slowAmount;
            this.addDamageText(enemy.x, enemy.y - 25, '❄ FREEZE', '#00f3ff');
          }
        }
      }
    } else if (p.type === 'rpg') {
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

      // Awakened Cluster Cataclysm: 6 scatter cluster bomblets
      if (p.isAwakened) {
        for (let b = 0; b < 6; b++) {
          const cAngle = (Math.PI * 2 * b) / 6 + (Math.random() - 0.5) * 0.4;
          const cDist = 45 + Math.random() * 75;
          const cx = p.x + Math.cos(cAngle) * cDist;
          const cy = Math.min(this.groundY - 10, p.y + Math.sin(cAngle) * cDist);
          this.createExplosionParticles(cx, cy, '#ff3366', 15);
          this.createExplosionParticles(cx, cy, '#ffd166', 10);
          for (let e of this.enemies) {
            if (e.hp > 0 && Math.hypot(e.x - cx, e.y - cy) <= 100) {
              this.damageEnemy(e, p.totalDamage * 0.35, '#ff3366');
            }
          }
        }
      }
    } else {
      // Standard or Awakened Bullet
      this.damageEnemy(targetEnemy, p.damage, p.color);
      this.createExplosionParticles(p.x, p.y, p.color, 4);

      // Micro-missile stun (Turret Awakened)
      if (p.isMissile) {
        targetEnemy.stunTimer = 1.0;
        this.addDamageText(targetEnemy.x, targetEnemy.y - 20, '⚡STUN 1s', '#00f3ff');
        this.createExplosionParticles(p.x, p.y, '#00f3ff', 12);
      }

      // Micro-explosions & ignite (Minigun Incendiary Vulcan)
      if (p.explosive) {
        this.createExplosionParticles(p.x, p.y, '#ff4800', 8);
        for (let e of this.enemies) {
          if (e !== targetEnemy && Math.hypot(e.x - p.x, e.y - p.y) <= (p.blastRadius || 24)) {
            this.damageEnemy(e, p.damage, '#ff4800');
            e.burnTimer = 2.0;
            e.burnDps = p.damage * 0.75;
          }
        }
        targetEnemy.burnTimer = 2.0;
        targetEnemy.burnDps = p.damage * 0.75;
      }

      // Flak Annihilator knockback and shatter (Shotgun Awakened)
      if (p.isFlak) {
        targetEnemy.x += 45;
        targetEnemy.armorShatterTimer = 3.0;
        targetEnemy.armorShatterMult = 1.25;
        this.addDamageText(targetEnemy.x, targetEnemy.y - 20, '💥SHATTER', '#ff9e00');
      }

      // Ricochet (AK-47 Rampage Overdrive)
      if (p.ricochet && Math.random() < p.ricochet) {
        let nextTarget = null;
        let minD = 180;
        for (let e of this.enemies) {
          if (e !== targetEnemy && e.hp > 0) {
            const d = Math.hypot(e.x - p.x, e.y - p.y);
            if (d < minD) {
              minD = d;
              nextTarget = e;
            }
          }
        }
        if (nextTarget) {
          const rAngle = Math.atan2(nextTarget.y - p.y, nextTarget.x - p.x);
          this.fireBullet(p.x, p.y, rAngle, p.damage * 0.7, 750, '#ffd166', 3.5);
          this.addDamageText(p.x, p.y - 10, '↪RICOCHET', '#ffd166');
        }
      }
    }
  }

  damageEnemy(enemy, amount, color) {
    // Armor shatter bonus damage from awakened shotgun or mortar pool
    if (enemy.armorShatterTimer > 0) {
      amount *= (enemy.armorShatterMult || 1.25);
    }
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
    this.autoWaveTimer = 0;
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
    this.quantumScars = [];
    this.ballLightnings = [];
    this.crescentWaves = [];
    this.godsPeaceTimer = 0;
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

    // 1c. Draw Lingering Quantum Scars (Railgun Singularity Lance)
    this.drawQuantumScars();

    // 2. Draw Beams & Lightning
    this.drawRailgunBeams();
    this.drawLightningArcs();
    this.drawBallLightnings();
    this.drawCrescentWaves();

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

    // 8. Draw Peace of the Gods Holy Shimmer (Ban Gun Awakened)
    if (this.godsPeaceTimer > 0) {
      this.drawGodsPeace();
    }

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

  drawQuantumScars() {
    if (!this.quantumScars) return;
    for (let s of this.quantumScars) {
      const alpha = Math.min(1.0, s.life / 0.5);
      this.ctx.save();
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 24;
      this.ctx.strokeStyle = `rgba(0, 243, 255, ${0.45 * alpha})`;
      this.ctx.lineWidth = s.width || 12;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x1, s.y1);
      this.ctx.lineTo(s.x2, s.y2);
      this.ctx.stroke();

      // Pulsing violet spatial tear
      this.ctx.strokeStyle = `rgba(157, 78, 221, ${0.7 * alpha})`;
      this.ctx.lineWidth = 6;
      this.ctx.stroke();

      // Shimmering white quantum fissure
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawBallLightnings() {
    if (!this.ballLightnings) return;
    for (let bl of this.ballLightnings) {
      this.ctx.save();
      this.ctx.shadowColor = '#c77dff';
      this.ctx.shadowBlur = 20;
      const grad = this.ctx.createRadialGradient(bl.x, bl.y, 2, bl.x, bl.y, 16);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, '#c77dff');
      grad.addColorStop(0.7, '#7209b7');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(bl.x, bl.y, 16, 0, Math.PI * 2);
      this.ctx.fill();

      // Orbiting micro-sparks
      for (let p = 0; p < 3; p++) {
        const ang = performance.now() / 150 + (p * Math.PI * 2 / 3);
        const px = bl.x + Math.cos(ang) * 12;
        const py = bl.y + Math.sin(ang) * 12;
        this.ctx.fillStyle = '#00f3ff';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  drawCrescentWaves() {
    if (!this.crescentWaves) return;
    for (let cw of this.crescentWaves) {
      this.ctx.save();
      this.ctx.shadowColor = '#00f3ff';
      this.ctx.shadowBlur = 18;
      this.ctx.strokeStyle = '#00f3ff';
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.arc(cw.x - 25, cw.y, cw.width / 2, -Math.PI / 3, Math.PI / 3);
      this.ctx.stroke();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  drawGodsPeace() {
    const alpha = Math.min(0.28, (this.godsPeaceTimer / 6.0) * 0.28);
    this.ctx.save();
    this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Divine border vignette
    this.ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 2.5})`;
    this.ctx.lineWidth = 8;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    // Divine announcement
    this.ctx.font = '700 16px Chakra Petch';
    this.ctx.fillStyle = '#ffd166';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = '#ffd166';
    this.ctx.shadowBlur = 12;
    this.ctx.fillText(`✨ PEACE OF THE GODS (${this.godsPeaceTimer.toFixed(1)}s) ✨`, this.canvas.width / 2, 60);
    this.ctx.restore();
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
      const mountX = x + this.crateWidth / 2 + 18;
      // Mount straight out horizontally from the center of the crate so all 5 crates stay uniformly spaced
      const mountY = y;
      
      // Draw sleek mechanical mounting bracket connecting from crate front to mount
      this.ctx.strokeStyle = '#2b2d42';
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.crateWidth / 2 - 2, y);
      this.ctx.lineTo(mountX, mountY);
      this.ctx.stroke();

      this.ctx.strokeStyle = slot.weapon === 'energy_blade' ? '#00f3ff' : '#8d99ae';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.crateWidth / 2 - 2, y);
      this.ctx.lineTo(mountX, mountY);
      this.ctx.stroke();

      // Hub pivot bearing
      this.ctx.fillStyle = '#1d3557';
      this.ctx.beginPath();
      this.ctx.arc(mountX, mountY, 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.translate(mountX, mountY);
    } else {
      // Guns and launchers are mounted on the front edge of the crate
      this.ctx.translate(x + this.crateWidth / 2 - 2, y);
    }

    // Awakened Visual Aura: Iridescent glowing halo & orbiting celestial sparks
    if (slot.awakened) {
      this.ctx.save();
      const time = performance.now() / 550;
      const auraGrad = this.ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
      auraGrad.addColorStop(0, 'rgba(0, 243, 255, 0.45)');
      auraGrad.addColorStop(0.45, 'rgba(114, 9, 183, 0.35)');
      auraGrad.addColorStop(0.85, 'rgba(255, 0, 110, 0.22)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = auraGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 36, 0, Math.PI * 2);
      this.ctx.fill();

      // Orbiting celestial star sparks
      for (let s = 0; s < 4; s++) {
        const sAng = time * 2.5 + (s * Math.PI / 2);
        const sDist = 18 + Math.sin(time * 3 + s) * 5;
        const sx = Math.cos(sAng) * sDist;
        const sy = Math.sin(sAng) * sDist;
        this.ctx.fillStyle = s % 2 === 0 ? '#00f3ff' : '#ff007f';
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
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
      // 360-degree spinning circular saw energy blade disc matching the reference image
      const spinAngle = (slot.angle || 0) % (Math.PI * 2);
      this.ctx.rotate(spinAngle);

      const discRadius = Math.min(32, 22 + slot.level * 2);

      // Check if preloaded sprite disc is ready
      if (this.energyBladeImg && this.energyBladeImg.complete && this.energyBladeImg.naturalWidth > 0) {
        this.ctx.save();
        // Cyan energetic plasma rim aura
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.shadowBlur = 15;

        // Draw the circular metallic saw disc
        this.ctx.drawImage(this.energyBladeImg, -discRadius, -discRadius, discRadius * 2, discRadius * 2);

        // High-frequency energy discharge border
        this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.7)';
        this.ctx.lineWidth = 1.8;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, discRadius - 1, 0, Math.PI * 2);
        this.ctx.stroke();

        // Gleaming cyan central core spark
        this.ctx.fillStyle = '#00f3ff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      } else {
        // High-fidelity procedural concentric metallic ripple disc fallback
        this.ctx.save();
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.shadowBlur = 12;

        // Dark outer rim
        this.ctx.fillStyle = '#1c1f26';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, discRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Concentric chrome grooves
        const rings = [0.92, 0.82, 0.72, 0.62, 0.50, 0.38, 0.25];
        rings.forEach((rRatio, idx) => {
          this.ctx.strokeStyle = idx % 2 === 0 ? 'rgba(230, 235, 245, 0.85)' : 'rgba(40, 45, 55, 0.9)';
          this.ctx.lineWidth = 2.2;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, discRadius * rRatio, 0, Math.PI * 2);
          this.ctx.stroke();
        });

        // 4-point cross centerpiece hub
        this.ctx.fillStyle = '#e8ecf2';
        for (let a = 0; a < 4; a++) {
          this.ctx.save();
          this.ctx.rotate((Math.PI / 2) * a);
          this.ctx.beginPath();
          this.ctx.moveTo(-2, 0);
          this.ctx.lineTo(0, discRadius * 0.24);
          this.ctx.lineTo(2, 0);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.restore();
        }

        // Inner glowing core
        this.ctx.fillStyle = '#00f3ff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      }

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
    } else if (slot.weapon === 'ban_gun') {
      // Secret Admin Weapon: Obsidian & Crimson Heavy Ban Cannon with digital hologram & countdown
      this.ctx.shadowColor = '#ff0055';
      this.ctx.shadowBlur = 14;

      // Heavy obsidian barrel frame
      this.ctx.fillStyle = '#0f0f14';
      this.ctx.fillRect(-6, -7, 34, 14);

      // Gold-trimmed power rails
      this.ctx.fillStyle = '#ffd166';
      this.ctx.fillRect(-4, -8, 30, 2);
      this.ctx.fillRect(-4, 6, 30, 2);

      // Crimson plasma core chamber
      this.ctx.fillStyle = '#ff0055';
      this.ctx.fillRect(4, -4, 16, 8);

      // Pulsing Ban core emitter / glowing muzzle
      const pulse = 0.7 + Math.sin(Date.now() / 150) * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
      this.ctx.fillRect(26, -5, 6, 10);

      // Floating holographic Ban text & cooldown timer
      this.ctx.save();
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#ff0055';
      this.ctx.font = 'bold 9px monospace';
      this.ctx.textAlign = 'center';
      const remaining = Math.max(0, stats.interval - slot.timer);
      if (remaining <= 0.05) {
        this.ctx.fillStyle = '#39ff14';
        this.ctx.fillText('🔨 READY!', 12, -12);
      } else if (stats.interval < 1.0) {
        this.ctx.fillStyle = '#ff0055';
        this.ctx.fillText(`🚫 ${remaining.toFixed(1)}s`, 12, -12);
      } else {
        this.ctx.fillStyle = '#ff0055';
        this.ctx.fillText(`🚫 ${Math.ceil(remaining)}s`, 12, -12);
      }
      this.ctx.restore();
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
      } else if (e.type === 'weak_weapon_dummy' || e.type === 'dummy') {
        // Weak Weapon Dummy - Target / Training Sandbag Dummy
        // Wooden stand pole
        this.ctx.fillStyle = '#6b4423';
        this.ctx.fillRect(-r * 0.18, 0, r * 0.36, r * 1.05);

        // Cross-brace wooden arms
        this.ctx.fillStyle = '#8b5a2b';
        this.ctx.fillRect(-r * 1.1, -r * 0.35, r * 2.2, r * 0.35);

        // Reinforced burlap dummy torso
        this.ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : '#c9935a';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r * 0.75, r * 0.9, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#5a3818';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Bullseye Target on Torso
        this.ctx.strokeStyle = '#d90429';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#d90429';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
        this.ctx.fill();

        // Dummy head (straw bundle)
        this.ctx.fillStyle = e.hitFlash > 0 ? '#ffffff' : '#d4a373';
        this.ctx.beginPath();
        this.ctx.arc(0, -r * 0.85, r * 0.42, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#5a3818';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Cross-stitched face "+ +"
        this.ctx.strokeStyle = '#2b1d0c';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-r * 0.2, -r * 0.95);
        this.ctx.lineTo(-r * 0.2, -r * 0.75);
        this.ctx.moveTo(-r * 0.3, -r * 0.85);
        this.ctx.lineTo(-r * 0.1, -r * 0.85);
        this.ctx.moveTo(r * 0.2, -r * 0.95);
        this.ctx.lineTo(r * 0.2, -r * 0.75);
        this.ctx.moveTo(r * 0.1, -r * 0.85);
        this.ctx.lineTo(r * 0.3, -r * 0.85);
        this.ctx.stroke();
      } else {
        // Default Scout crawler
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = renderAlpha;

      // Glowing evil eye (skip for types that have custom eyes)
      if (!['swarm_drone', 'phantom_overlord', 'inferno_wyrm', 'necromancer', 'boss_1x1x1', '1x1x1', 'weak_weapon_dummy', 'dummy'].includes(e.type)) {
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

      // Enemy Name & HP text (formatted cleanly for billions/millions)
      this.ctx.font = '600 10px Chakra Petch';
      this.ctx.fillStyle = '#e0e1dd';
      this.ctx.textAlign = 'center';
      let hpDisplay = Math.ceil(e.hp);
      if (e.hp >= 1e9) {
        hpDisplay = (e.hp / 1e9).toFixed(2) + 'B';
      } else if (e.hp >= 1e6) {
        hpDisplay = (e.hp / 1e6).toFixed(2) + 'M';
      } else if (e.hp >= 1e4) {
        hpDisplay = (e.hp / 1e3).toFixed(1) + 'k';
      }
      this.ctx.fillText(`${e.name} (${hpDisplay})`, 0, -r - 14);

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
