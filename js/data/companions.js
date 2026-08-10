// ============================================================
// HabitFlow — Companion Registry
// ============================================================
const COLLECTIONS = {
  starter: {
    title: "🟢 Starter Collection",
    description: "Your first companions. Available immediately.",
  },

  streak: {
    title: "🔥 Streak Collection",
    description: "Unlock by maintaining your daily streak.",
  },

  legendary: {
    title: "👑 Legendary Collection",
    description: "Reserved for HabitFlow's most dedicated users.",
  },

  master: {
    title: "🤖 Master Collection",
    description: "Only consistency legends can reach this tier.",
  },
};

const COMPANIONS = [
  {
    id: "basic",
    name: "Streaksaur Prime",
    image: "../img/avatars/streaksaur/basic.png",
    collection: "starter",
    rarity: "Common",
    class: "Companion",
    unlockStreak: 0,
    tagline: "Every legendary streak begins with a single step.",
    description:
      "The original Streaksaur. Loyal, cheerful, and always ready to begin a new journey.",
  },

  {
    id: "sleepy",
    name: "Dreamsaur",
    image: "../img/avatars/streaksaur/sleepy.png",
    collection: "starter",
    rarity: "Common",
    class: "Dreamer",
    unlockStreak: 0,
    tagline: "Rest today. Rise stronger tomorrow.",
    description:
      "A peaceful companion that reminds you consistency also means knowing when to recharge.",
  },

  {
    id: "explorer",
    name: "Trailsaur",
    image: "../img/avatars/streaksaur/explorer.png",
    collection: "starter",
    rarity: "Common",
    class: "Explorer",
    unlockStreak: 0,
    tagline: "Every habit is a new adventure.",
    description:
      "Curious and fearless, Trailsaur loves discovering new paths toward self-improvement.",
  },

  {
    id: "warrior",
    name: "Battlesaur",
    image: "../img/avatars/streaksaur/warrior.png",
    collection: "streak",
    rarity: "Rare",
    class: "Warrior",
    unlockStreak: 7,
    tagline: "Forged through unwavering consistency.",
    description:
      "A fearless guardian earned after proving your first week of dedication.",
  },

  {
    id: "knight",
    name: "Valorsaur",
    image: "../img/avatars/streaksaur/knight.png",
    collection: "streak",
    rarity: "Rare",
    class: "Knight",
    unlockStreak: 14,
    tagline: "Honor every promise you make to yourself.",
    description:
      "A noble protector whose shield is built from discipline and perseverance.",
  },

  {
    id: "detective",
    name: "Mystisaur",
    image: "../img/avatars/streaksaur/detective.png",
    collection: "streak",
    rarity: "Rare",
    class: "Detective",
    unlockStreak: 21,
    tagline: "Success leaves clues. Find them.",
    description:
      "Observes every habit, uncovers every weakness, and turns patterns into victories.",
  },

  {
    id: "pirate",
    name: "Corsairsaur",
    image: "../img/avatars/streaksaur/pirate.png",
    collection: "streak",
    rarity: "Epic",
    class: "Pirate",
    unlockStreak: 30,
    tagline: "Chart your own course.",
    description:
      "A fearless captain who believes every milestone is another treasure discovered.",
  },

  {
    id: "mage",
    name: "Mysticsaur",
    image: "../img/avatars/streaksaur/mage.png",
    collection: "streak",
    rarity: "Epic",
    class: "Mage",
    unlockStreak: 45,
    tagline: "Consistency is the strongest magic.",
    description:
      "Channels ancient streak energy to transform discipline into extraordinary power.",
  },

  {
    id: "hero",
    name: "Supersaur",
    image: "../img/avatars/streaksaur/hero.png",
    collection: "streak",
    rarity: "Epic",
    class: "Hero",
    unlockStreak: 60,
    tagline: "Great habits create great heroes.",
    description:
      "A symbol of courage for those who never give up on becoming their best selves.",
  },

  {
    id: "dragon",
    name: "Drakesaur",
    image: "../img/avatars/streaksaur/dragon.png",
    collection: "legendary",
    rarity: "Legendary",
    class: "Dragon",
    unlockStreak: 90,
    tagline: "Unleash the fire within.",
    description:
      "An ancient dragon companion awakened only by relentless determination.",
  },

  {
    id: "fire",
    name: "Blazesaur",
    image: "../img/avatars/streaksaur/fire.png",
    collection: "legendary",
    rarity: "Legendary",
    class: "Flame Master",
    unlockStreak: 120,
    tagline: "Fuel your streak. Burn brighter.",
    description: "Its flames grow stronger with every habit you complete.",
  },

  {
    id: "king",
    name: "Kingsaur",
    image: "../img/avatars/streaksaur/king.png",
    collection: "legendary",
    rarity: "Legendary",
    class: "King",
    unlockStreak: 180,
    tagline: "Rule your habits before they rule you.",
    description:
      "A legendary ruler who rewards unwavering commitment with unmatched prestige.",
  },

  {
    id: "robot",
    name: "Mechasaur",
    image: "../img/avatars/streaksaur/robot.png",
    collection: "master",
    rarity: "Mythic",
    class: "Mech",
    unlockStreak: 240,
    tagline: "Precision. Discipline. Progress.",
    description: "Every action is calculated. Every streak optimized.",
  },

  {
    id: "astronaut",
    name: "Cosmosaur",
    image: "../img/avatars/streaksaur/astronaut.png",
    collection: "master",
    rarity: "Mythic",
    class: "Astronaut",
    unlockStreak: 300,
    tagline: "Aim beyond the stars.",
    description:
      "Proof that consistent effort can take you farther than you ever imagined.",
  },

  {
    id: "batman",
    name: "Shadowsaur",
    image: "../img/avatars/streaksaur/batman.png",
    collection: "master",
    rarity: "Mythic",
    class: "Shadow Knight",
    unlockStreak: 365,
    tagline: "Discipline thrives in the dark.",
    description:
      "A silent guardian who protects year-long streaks with relentless determination.",
  },

  {
    id: "hacker",
    name: "Hacksaur",
    image: "../img/avatars/streaksaur/hacker.png",
    collection: "master",
    rarity: "Mythic",
    class: "Cyber Agent",
    unlockStreak: 500,
    tagline: "Hack your habits. Upgrade yourself.",
    description:
      "Masters systems, routines, and the code of consistent success.",
  },

  {
    id: "ninja",
    name: "Stealthsaur",
    image: "../img/avatars/streaksaur/ninja.png",
    collection: "master",
    rarity: "Mythic",
    class: "Ninja",
    unlockStreak: 650,
    tagline: "Silent effort. Loud results.",
    description: "Moves unnoticed, yet every action strengthens your streak.",
  },

  {
    id: "saiyan",
    name: "Saiyansaur",
    image: "../img/avatars/streaksaur/saiyan.png",
    collection: "master",
    rarity: "Mythic",
    class: "Ascended Warrior",
    unlockStreak: 800,
    tagline: "Every streak unlocks a new form.",
    description:
      "The ultimate evolution, achieved only through extraordinary perseverance.",
  },

  {
    id: "samurai",
    name: "Katanasaur",
    image: "../img/avatars/streaksaur/samurai.png",
    collection: "master",
    rarity: "Mythic",
    class: "Samurai",
    unlockStreak: 1000,
    tagline: "Mastery is forged through discipline.",
    description:
      "The final guardian of HabitFlow. Reserved for those whose dedication spans a thousand days.",
  },

  {
    id: "titan",
    name: "Titanasaur",
    image: "../img/avatars/streaksaur/titan.png",
    collection: "master",
    rarity: "Mythic",
    class: "Titan Slayer",
    unlockStreak: 1200,

    tagline: "Dedicate your heart. Keep moving forward.",

    description:
      "Beyond every wall lies another challenge. Those who refuse to stop are the ones who discover what lies beyond.",
  },
];
