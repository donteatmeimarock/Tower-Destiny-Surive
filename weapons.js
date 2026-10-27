// WEAPON DEFINITIONS & CONFIGURATION
// All user weapon specs rigorously codified:
// GUNS:
//  1. "Turret": 1st free, then 15 coins. 5 dmg every 2.0s. 5 upgrades.
//  2. "AK-47": 3 dmg every 0.5s. 5 upgrades.
//  3. "Minigun": 0.4 dmg every 0.02s. 5 upgrades.
//  4. "Sniper Rifle": 18 dmg every 3.5s. 5 upgrades. High-velocity precision rifle.
// GODLY GUNS:
//  5. "Energy Railgun": Charge 10s, shoots blue ray piercing 75 dmg. 5 upgrades.
//  6. "RPG": 5s wait, shoots exploding grenade dealing 250 dmg total split across all enemies hit. 5 upgrades.
//  7. "Tesla Coil": 35 dmg every 4.0s, chain lightning bouncing between up to 5 enemies! 5 upgrades.
// CLOSE RANGE WEAPONS:
//  8. "Flamethrower": every 7s, blow fire dealing 1 dmg every 0.25s for duration. 3 upgrades.
//  9. "Chainsaw": spins forever, deals 0.3 dmg every 0.1s. 3 upgrades.
//  10. "Buzz Saw": launches returning boomerang saw dealing 6 dmg both ways. 3 upgrades.
// GODLY CLOSE RANGE WEAPONS:
//  11. "Energy Blade": spins forever, deals 2 dmg every 0.1s. 3 upgrades.
//  12. "Graviton Hammer": 25 AoE slam every 5.0s, slows enemies by 50%. 3 upgrades.
//  13. "Void Rift": persistent gravitational vortex dealing 1.8 dmg/0.12s and pulling enemies. 3 upgrades.

const WEAPON_REGISTRY = {
  turret: {
    id: 'turret',
    name: 'Turret',
    category: 'gun',
    icon: '🔫',
    basePrice: 15, // first purchase is free
    maxUpgrades: 5,
    description: 'Starter gun. First one is FREE! Shoots steady rounds.',
    baseStats: {
      damage: 5,
      interval: 2.0, // seconds
      range: 1200, // extends all the way across the screen
      bulletSpeed: 750
    },
    // Upgrade progression (5 levels)
    upgradeCosts: [20, 35, 60, 95, 140],
    statUpgrades: [
      { damage: 7.5, interval: 1.8 },
      { damage: 11, interval: 1.6 },
      { damage: 16, interval: 1.4 },
      { damage: 22, interval: 1.2 },
      { damage: 30, interval: 1.0 }
    ]
  },

  ak47: {
    id: 'ak47',
    name: 'AK-47',
    category: 'gun',
    icon: '⚡',
    basePrice: 35,
    maxUpgrades: 5,
    description: 'Next better gun. Fast automatic rifle with reliable DPS.',
    baseStats: {
      damage: 3,
      interval: 0.5, // 0.5 seconds
      range: 1200, // extends all the way across the screen
      bulletSpeed: 880
    },
    upgradeCosts: [30, 55, 90, 140, 210],
    statUpgrades: [
      { damage: 4.5, interval: 0.45 },
      { damage: 6.5, interval: 0.40 },
      { damage: 9.5, interval: 0.35 },
      { damage: 13.5, interval: 0.30 },
      { damage: 19.0, interval: 0.25 }
    ]
  },

  minigun: {
    id: 'minigun',
    name: 'Minigun',
    category: 'gun',
    icon: '🌪️',
    basePrice: 85,
    maxUpgrades: 5,
    description: 'Insane fire rate! Shoots rapid-fire lead shredding hordes.',
    baseStats: {
      damage: 0.4,
      interval: 0.02, // 50 bullets per sec!
      range: 1200, // extends all the way across the screen
      bulletSpeed: 980
    },
    upgradeCosts: [60, 110, 175, 260, 380],
    statUpgrades: [
      { damage: 0.65, interval: 0.02 },
      { damage: 1.0, interval: 0.018 },
      { damage: 1.5, interval: 0.016 },
      { damage: 2.2, interval: 0.015 },
      { damage: 3.2, interval: 0.014 }
    ]
  },

  sniper: {
    id: 'sniper',
    name: 'Sniper Rifle',
    category: 'gun',
    icon: '🎯',
    basePrice: 55,
    maxUpgrades: 5,
    description: 'Precision long-range rifle. Slow but devastating single shots.',
    baseStats: {
      damage: 18,
      interval: 3.5,
      range: 1200,
      bulletSpeed: 1500
    },
    upgradeCosts: [40, 75, 120, 185, 275],
    statUpgrades: [
      { damage: 28, interval: 3.2 },
      { damage: 42, interval: 2.9 },
      { damage: 60, interval: 2.6 },
      { damage: 85, interval: 2.3 },
      { damage: 120, interval: 2.0 }
    ]
  },

  railgun: {
    id: 'railgun',
    name: 'Energy Railgun',
    category: 'godly-gun',
    icon: '💠',
    basePrice: 180,
    maxUpgrades: 5,
    description: 'Charge for 10 sec, then unleash a devastating blue piercing beam!',
    baseStats: {
      damage: 75,
      interval: 10.0, // 10s charge
      range: 1200, // pierces all the way across the screen
      piercing: true,
      beamWidth: 28,
      beamDuration: 0.45
    },
    upgradeCosts: [100, 175, 275, 400, 600],
    statUpgrades: [
      { damage: 120, interval: 9.0 },
      { damage: 180, interval: 8.0 },
      { damage: 260, interval: 7.2 },
      { damage: 370, interval: 6.5 },
      { damage: 520, interval: 5.5 }
    ]
  },

  rpg: {
    id: 'rpg',
    name: 'RPG',
    category: 'godly-gun',
    icon: '🚀',
    basePrice: 200,
    maxUpgrades: 5,
    description: 'Wait 5 sec. Shoots exploding grenade dealing 250 total damage split equally.',
    baseStats: {
      damage: 250, // total damage split equally among targets
      interval: 5.0, // 5s wait
      range: 1200, // flies all the way across the screen
      bulletSpeed: 480,
      blastRadius: 130
    },
    upgradeCosts: [90, 160, 250, 360, 520],
    statUpgrades: [
      { damage: 380, interval: 4.6, blastRadius: 145 },
      { damage: 550, interval: 4.2, blastRadius: 160 },
      { damage: 780, interval: 3.8, blastRadius: 175 },
      { damage: 1100, interval: 3.4, blastRadius: 190 },
      { damage: 1600, interval: 3.0, blastRadius: 210 }
    ]
  },

  tesla_coil: {
    id: 'tesla_coil',
    name: 'Tesla Coil',
    category: 'godly-gun',
    icon: '⚡',
    basePrice: 250,
    maxUpgrades: 5,
    description: 'Unleashes chain lightning bouncing between up to 5 enemies!',
    baseStats: {
      damage: 35,
      interval: 4.0,
      range: 600,
      chainCount: 3,
      chainDecay: 0.60
    },
    upgradeCosts: [130, 230, 360, 520, 740],
    statUpgrades: [
      { damage: 55, interval: 3.7, chainCount: 3, chainDecay: 0.60 },
      { damage: 80, interval: 3.4, chainCount: 4, chainDecay: 0.60 },
      { damage: 115, interval: 3.1, chainCount: 4, chainDecay: 0.65 },
      { damage: 160, interval: 2.8, chainCount: 5, chainDecay: 0.65 },
      { damage: 220, interval: 2.5, chainCount: 5, chainDecay: 0.70 }
    ]
  },

  flamethrower: {
    id: 'flamethrower',
    name: 'Flamethrower',
    category: 'melee',
    icon: '🔥',
    basePrice: 65,
    maxUpgrades: 3,
    description: 'Every 7 seconds, spew torrents of flame dealing 1 dmg every 0.25s.',
    baseStats: {
      damage: 1.0,
      cycleInterval: 7.0, // every 7s
      flameDuration: 2.2, // burns for 2.2s
      tickInterval: 0.25, // 1 damage every 0.25s
      range: 160,
      coneAngle: Math.PI / 3 // 60 degrees
    },
    upgradeCosts: [50, 100, 180],
    statUpgrades: [
      { damage: 2.0, cycleInterval: 6.0, flameDuration: 2.6, range: 180 },
      { damage: 3.8, cycleInterval: 5.2, flameDuration: 3.0, range: 200 },
      { damage: 6.5, cycleInterval: 4.5, flameDuration: 3.5, range: 220 }
    ]
  },

  chainsaw: {
    id: 'chainsaw',
    name: 'Chainsaw',
    category: 'melee',
    icon: '⚙️',
    basePrice: 50,
    maxUpgrades: 3,
    description: 'Keeps spinning forever. Touching deals 0.3 damage every 0.1s.',
    baseStats: {
      damage: 0.3,
      tickInterval: 0.1, // every 0.1s
      spinRadius: 85, // close-range perimeter
      rotSpeed: 10 // visual rotation
    },
    upgradeCosts: [45, 90, 160],
    statUpgrades: [
      { damage: 0.65, spinRadius: 95, rotSpeed: 14 },
      { damage: 1.2, spinRadius: 105, rotSpeed: 18 },
      { damage: 2.0, spinRadius: 120, rotSpeed: 24 }
    ]
  },

  buzz_saw: {
    id: 'buzz_saw',
    name: 'Buzz Saw',
    category: 'melee',
    icon: '🪚',
    basePrice: 75,
    maxUpgrades: 3,
    description: 'Launches a spinning saw blade that flies out and returns like a boomerang!',
    baseStats: {
      damage: 6,
      interval: 2.5,
      range: 250,
      sawSpeed: 400,
      sawRadius: 18
    },
    upgradeCosts: [60, 120, 210],
    statUpgrades: [
      { damage: 10, interval: 2.2, range: 280, sawRadius: 22 },
      { damage: 18, interval: 1.9, range: 310, sawRadius: 26 },
      { damage: 30, interval: 1.6, range: 350, sawRadius: 30 }
    ]
  },

  energy_blade: {
    id: 'energy_blade',
    name: 'Energy Blade',
    category: 'godly-melee',
    icon: '⚔️',
    basePrice: 200,
    maxUpgrades: 3,
    description: 'Keeps spinning forever. Touching deals 2.0 damage every 0.1s with plasma aura.',
    baseStats: {
      damage: 2.0,
      tickInterval: 0.1, // every 0.1s
      spinRadius: 52, // compact, sleek blade size
      rotSpeed: 16
    },
    upgradeCosts: [120, 220, 360],
    statUpgrades: [
      { damage: 4.0, spinRadius: 60, rotSpeed: 20 },
      { damage: 7.5, spinRadius: 68, rotSpeed: 24 },
      { damage: 13.0, spinRadius: 78, rotSpeed: 30 }
    ]
  },

  graviton_hammer: {
    id: 'graviton_hammer',
    name: 'Graviton Hammer',
    category: 'godly-melee',
    icon: '🔨',
    basePrice: 240,
    maxUpgrades: 3,
    description: 'Periodically slams down creating a massive shockwave that damages and slows nearby enemies!',
    baseStats: {
      damage: 25,
      cycleInterval: 5.0,
      slamRadius: 130,
      slowDuration: 1.5
    },
    upgradeCosts: [140, 260, 420],
    statUpgrades: [
      { damage: 45, cycleInterval: 4.3, slamRadius: 150, slowDuration: 2.0 },
      { damage: 75, cycleInterval: 3.6, slamRadius: 170, slowDuration: 2.5 },
      { damage: 120, cycleInterval: 3.0, slamRadius: 200, slowDuration: 3.0 }
    ]
  },

  void_rift: {
    id: 'void_rift',
    name: 'Void Rift',
    category: 'godly-melee',
    icon: '🌀',
    basePrice: 300,
    maxUpgrades: 3,
    description: 'Opens a persistent void vortex that constantly damages and pulls enemies inward!',
    baseStats: {
      damage: 1.8,
      tickInterval: 0.12,
      vortexRadius: 100,
      pullStrength: 25
    },
    upgradeCosts: [160, 300, 480],
    statUpgrades: [
      { damage: 3.5, tickInterval: 0.11, vortexRadius: 115, pullStrength: 35 },
      { damage: 6.0, tickInterval: 0.10, vortexRadius: 130, pullStrength: 50 },
      { damage: 10.0, tickInterval: 0.09, vortexRadius: 150, pullStrength: 70 }
    ]
  }
};

window.WEAPON_REGISTRY = WEAPON_REGISTRY;
