// WEAPON DEFINITIONS & CONFIGURATION
// All user weapon specs rigorously codified:
// GUNS:
//  1. "Turret": 1st free, then 15 coins. 5 dmg every 2.0s. 5 upgrades.
//  2. "AK-47": 3 dmg every 0.5s. 5 upgrades.
//  3. "Minigun": 0.4 dmg every 0.02s. 5 upgrades.
//  4. "Sniper Rifle": 18 dmg every 3.5s. 5 upgrades. High-velocity precision rifle.
//  5. "Combat Shotgun": 5 pellets x 2.2 dmg every 1.1s. 5 upgrades. Wide close-range cone spread.
// GODLY GUNS:
//  6. "Energy Railgun": Charge 10s, shoots blue ray piercing 750 dmg. 5 upgrades.
//  7. "RPG": 5s wait, shoots exploding grenade dealing 250 dmg total split across all enemies hit. 5 upgrades.
//  8. "Tesla Coil": 35 dmg every 4.0s, chain lightning bouncing between up to 5 enemies! 5 upgrades.
//  9. "Cryo Cannon": 40 dmg every 2.8s in 90px AoE, slowing enemies by 65%. 5 upgrades.
//  10. "Orbital Mortar": 160 impact dmg every 6.0s + leaves 3.5s boiling plasma pool dealing 42 DPS. 5 upgrades.
// CLOSE RANGE WEAPONS:
//  11. "Flamethrower": every 7s, blow fire dealing 1 dmg every 0.25s for duration. 3 upgrades.
//  12. "Chainsaw": spins forever, deals 0.3 dmg every 0.1s. 3 upgrades.
//  13. "Buzz Saw": launches returning boomerang saw dealing 6 dmg both ways. 3 upgrades.
//  14. "Toxic Sprayer": corrosive acid dealing 2.5 dmg/0.2s with 2.5x-3.5x bonus against enemies over 1000 HP! 3 upgrades.
// GODLY CLOSE RANGE WEAPONS:
//  15. "Energy Blade": spins forever, deals 2 dmg every 0.1s. 3 upgrades.
//  16. "Graviton Hammer": 25 AoE slam every 5.0s, slows enemies by 50%. 3 upgrades.
//  17. "Void Rift": persistent gravitational vortex dealing 1.8 dmg/0.12s and pulling enemies. 3 upgrades.
//  18. "Solar Core": radiant miniature sun with 4 dmg/0.15s heat aura + periodic 90 dmg solar flare nova. 3 upgrades.

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
    ],
    awakened: {
      title: 'Hyperion Twin-Autocannon',
      desc: 'Fires paired dual plasma shots + homing micro-missiles every 4th volley dealing 3x DMG & stun.'
    }
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
    ],
    awakened: {
      title: 'Storm Carbine: Overclock',
      desc: 'Ramping fire rate up to +80% on consecutive hits + 30% chance for bullets to ricochet.'
    }
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
    ],
    awakened: {
      title: 'Vulkan Deathstorm',
      desc: 'Fires HE micro-rounds with 24px AoE blast + ignites enemies for burning DPS.'
    }
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
    ],
    awakened: {
      title: 'Orbital Rail-Hawkeye',
      desc: 'Infinite screen-wide bullet penetration + +150% executioner damage on healthy targets.'
    }
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
      damage: 750,
      interval: 10.0, // 10s charge
      range: 1200, // pierces all the way across the screen
      piercing: true,
      beamWidth: 28,
      beamDuration: 0.45
    },
    upgradeCosts: [100, 175, 275, 400, 600],
    statUpgrades: [
      { damage: 1200, interval: 9.0 },
      { damage: 1800, interval: 8.0 },
      { damage: 2600, interval: 7.2 },
      { damage: 3700, interval: 6.5 },
      { damage: 5200, interval: 5.5 }
    ],
    awakened: {
      title: 'Antimatter Hyper-Lance',
      desc: 'Leaves a 3s lingering quantum scar rift dealing 70% DPS and slowing passing enemies.'
    }
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
    ],
    awakened: {
      title: 'MIRV Cluster Titan',
      desc: 'Rocket detonation splits into 6 secondary cluster bomblets in a wide 200px carpet bomb.'
    }
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
    ],
    awakened: {
      title: "Thor's Storm Sovereign",
      desc: 'Chains to 10 targets + leaves a floating Ball Lightning orb zapping nearby foes.'
    }
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
    ],
    awakened: {
      title: "Dragon's Abyssal Maw",
      desc: 'Expanding 360° defensive ring of blue hellfire + lingers sticky napalm on ground for 4s.'
    }
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
    ],
    awakened: {
      title: 'Apex Ripper: Bloodline',
      desc: '+30% spin radius + siphons 8% of damage into actively repairing Tower HP (up to 25 HP/s).'
    }
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
    ],
    awakened: {
      title: 'Infinity Gyro-Chakram',
      desc: 'Launches dual scissoring blades applying 40% severing bleed on both forward and return paths.'
    }
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
    ],
    awakened: {
      title: 'Cosmic Vorpal Saber',
      desc: 'Unleashes piercing crescent energy slash waves every 0.6s reaching 350px mid-range.'
    }
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
    ],
    awakened: {
      title: "Titan's Tectonic Breaker",
      desc: 'Ground slam creates a 400px traveling magma fissure shockwave launching foes with 2.5s stun.'
    }
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
    ],
    awakened: {
      title: 'Event Horizon Collapser',
      desc: '2x gravitational pull force + every 4s collapses in a supermassive 6x DMG implosion.'
    }
  },

  shotgun: {
    id: 'shotgun',
    name: 'Combat Shotgun',
    category: 'gun',
    icon: '💥',
    basePrice: 45,
    maxUpgrades: 5,
    description: 'Pump-action shotgun. Fires a wide 5-pellet spread shredding close enemies.',
    baseStats: {
      damage: 2.2,
      pellets: 5,
      interval: 1.1,
      spreadAngle: 0.42,
      range: 600,
      bulletSpeed: 950
    },
    upgradeCosts: [35, 65, 110, 170, 250],
    statUpgrades: [
      { damage: 3.2, pellets: 5, interval: 1.0 },
      { damage: 4.5, pellets: 6, interval: 0.9 },
      { damage: 6.5, pellets: 6, interval: 0.8 },
      { damage: 9.0, pellets: 7, interval: 0.7 },
      { damage: 13.0, pellets: 7, interval: 0.6 }
    ],
    awakened: {
      title: 'Doomsday Flak Cannon',
      desc: 'Fires 11 heavy flechettes, applies 45px knockback, and shreds armor for +25% vulnerability.'
    }
  },

  cryo_cannon: {
    id: 'cryo_cannon',
    name: 'Cryo Cannon',
    category: 'godly-gun',
    icon: '❄️',
    basePrice: 220,
    maxUpgrades: 5,
    description: 'Fires sub-zero canisters that detonate into freezing frost, slowing enemies by 65%!',
    baseStats: {
      damage: 40,
      interval: 2.8,
      range: 1200,
      bulletSpeed: 620,
      blastRadius: 90,
      slowAmount: 0.65,
      slowDuration: 2.5
    },
    upgradeCosts: [120, 210, 340, 500, 720],
    statUpgrades: [
      { damage: 65, interval: 2.5, blastRadius: 105, slowDuration: 2.8, slowAmount: 0.65 },
      { damage: 100, interval: 2.2, blastRadius: 120, slowDuration: 3.2, slowAmount: 0.70 },
      { damage: 150, interval: 1.9, blastRadius: 135, slowDuration: 3.6, slowAmount: 0.70 },
      { damage: 220, interval: 1.7, blastRadius: 150, slowDuration: 4.0, slowAmount: 0.75 },
      { damage: 310, interval: 1.5, blastRadius: 170, slowDuration: 4.5, slowAmount: 0.75 }
    ],
    awakened: {
      title: 'Absolute Zero Glaciator',
      desc: '100% total freeze immobilization for 1.8s + shattered ice shrapnel on death.'
    }
  },

  orbital_mortar: {
    id: 'orbital_mortar',
    name: 'Orbital Mortar',
    category: 'godly-gun',
    icon: '☄️',
    basePrice: 280,
    maxUpgrades: 5,
    description: 'Lobs high-arc explosive shells onto enemy packs, leaving a boiling pool of plasma.',
    baseStats: {
      damage: 160,
      interval: 6.0,
      range: 1200,
      blastRadius: 120,
      poolDuration: 3.5,
      poolDps: 42
    },
    upgradeCosts: [150, 270, 420, 620, 880],
    statUpgrades: [
      { damage: 250, interval: 5.5, blastRadius: 135, poolDuration: 3.8, poolDps: 65 },
      { damage: 380, interval: 5.0, blastRadius: 150, poolDuration: 4.0, poolDps: 100 },
      { damage: 560, interval: 4.5, blastRadius: 165, poolDuration: 4.2, poolDps: 150 },
      { damage: 800, interval: 4.0, blastRadius: 185, poolDuration: 4.5, poolDps: 220 },
      { damage: 1150, interval: 3.5, blastRadius: 210, poolDuration: 5.0, poolDps: 320 }
    ],
    awakened: {
      title: 'Apocalypse Meteor Battery',
      desc: 'Fires 3 staggered orbital meteors on the 3 densest packs + 6s boiling armor-melting pools.'
    }
  },

  toxic_sprayer: {
    id: 'toxic_sprayer',
    name: 'Toxic Sprayer',
    category: 'melee',
    icon: '🧪',
    basePrice: 60,
    maxUpgrades: 3,
    description: 'Sprays corrosive acid fumes. Deals massive bonus damage to enemies over 1000 HP!',
    baseStats: {
      damage: 2.5,
      tickInterval: 0.20,
      range: 170,
      coneAngle: Math.PI / 3.2,
      giantBonus: 2.5,
      giantThreshold: 1000
    },
    upgradeCosts: [55, 110, 190],
    statUpgrades: [
      { damage: 4.5, tickInterval: 0.18, range: 190, giantBonus: 2.8 },
      { damage: 8.0, tickInterval: 0.16, range: 210, giantBonus: 3.2 },
      { damage: 14.0, tickInterval: 0.14, range: 240, giantBonus: 3.5 }
    ],
    awakened: {
      title: 'Biohazard Chimera',
      desc: 'Leaves dense neurotoxin cloud hanging before tower reducing enemy attack DMG by 40% + acid death pops.'
    }
  },

  solar_core: {
    id: 'solar_core',
    name: 'Solar Core',
    category: 'godly-melee',
    icon: '☀️',
    basePrice: 320,
    maxUpgrades: 3,
    description: 'Miniature sun hovering before the tower. Searing heat aura + periodic solar novas!',
    baseStats: {
      damage: 4.0,
      tickInterval: 0.15,
      auraRadius: 90,
      flareDamage: 90,
      flareInterval: 3.0,
      flareRadius: 150,
      blindDuration: 2.0
    },
    upgradeCosts: [180, 340, 540],
    statUpgrades: [
      { damage: 7.5, tickInterval: 0.14, auraRadius: 100, flareDamage: 160, flareInterval: 2.6, flareRadius: 175 },
      { damage: 13.0, tickInterval: 0.13, auraRadius: 110, flareDamage: 270, flareInterval: 2.3, flareRadius: 200 },
      { damage: 22.0, tickInterval: 0.12, auraRadius: 125, flareDamage: 440, flareInterval: 2.0, flareRadius: 230 }
    ],
    awakened: {
      title: 'Supernova Pulsar',
      desc: 'Rapid 1.6s solar flare cycle + screen-wide blind + 4 radiant solar laser lances.'
    }
  },

  ban_gun: {
    id: 'ban_gun',
    name: 'Ban Gun',
    category: 'godly-gun',
    adminOnly: true, // EXCLUSIVE: Can only be equipped in the admin panel!
    icon: '🔨',
    basePrice: 999999999,
    maxUpgrades: 5,
    description: 'SECRET ADMIN WEAPON: Obliterates & bans every enemy on screen! Upgrades lower cooldown from 60s down to rapid fire.',
    baseStats: {
      damage: 10000000000, // 10 Billion base damage: guaranteed one-shot on all targets
      interval: 60.0, // Base cooldown: 60 seconds
      range: 3000,
      isScreenNuke: true
    },
    upgradeCosts: [10000, 50000, 250000, 1000000, 5000000],
    statUpgrades: [
      { damage: 25000000000, interval: 50.0 }, // Level 1: 50s cooldown
      { damage: 50000000000, interval: 40.0 }, // Level 2: 40s cooldown
      { damage: 100000000000, interval: 30.0 }, // Level 3: 30s cooldown
      { damage: 250000000000, interval: 20.0 }, // Level 4: 20s cooldown
      { damage: 500000000000, interval: 10.0 }  // Level 5: 10s cooldown
    ],
    awakened: {
      title: 'Judgement Day: Digital Oblivion',
      desc: 'Matrix digital erasure + double coin drops from all banned targets + 6s wave freeze peace.'
    }
  }
};

const SECRET_UPGRADE_LIMIT = 1000000;

window.WEAPON_REGISTRY = WEAPON_REGISTRY;
window.SECRET_UPGRADE_LIMIT = SECRET_UPGRADE_LIMIT;
