/* ==========================================================================
   ⚔️ RPG QUEST MASTER - SCRIPT OPTIMISÉ (SCRIPT.JS)
   ========================================================================== */

'use strict';

// ==================== 1. CONFIGURATION & DONNÉES DU JEU ====================

const STORAGE_KEY = 'rpg_quest_master_data_v3';

const GAME_CONFIG = {
  leveling: {
    baseXP: 100,
    growth: 1.22
  },
  quests: {
    dailyCounts: { E: 5, D: 4, C: 3, B: 2, A: 1 },
    undoWindowMs: 10 * 60 * 1000 // 10 minutes
  },
  seasons: {
    spring: { name: 'Printemps Éthéré', emoji: '🌸', months: [9, 10, 11] },
    summer: { name: 'Été Flamboyant', emoji: '☀️', months: [12, 1, 2] },
    autumn: { name: 'Automne Mystique', emoji: '🍂', months: [3, 4, 5] },
    winter: { name: 'Hiver Glacial', emoji: '❄️', months: [6, 7, 8] }
  },
  questRarities: {
    E: { name: 'E - Très facile', xp: 15, gold: 5, color: '#475569', icon: '⚪' },
    D: { name: 'D - Facile', xp: 30, gold: 12, color: '#94a3b8', icon: '🟢' },
    C: { name: 'C - Simple', xp: 55, gold: 25, color: '#22c55e', icon: '🔵' },
    B: { name: 'B - Moyen', xp: 90, gold: 45, color: '#06b6d4', icon: '🟣' },
    A: { name: 'A - Difficile', xp: 140, gold: 75, color: '#f97316', icon: '🟠' },
    S: { name: 'S - Hebdomadaire', xp: 250, gold: 150, color: '#ef4444', icon: '🔴' },
    SS: { name: 'SS - Mensuelle', xp: 500, gold: 350, color: '#a855f7', icon: '🔮' },
    SSS: { name: 'SSS - Annuelle Légendaire', xp: 1200, gold: 1000, color: '#ffd700', icon: '👑' }
  },
  classesInfo: {
    warrior: { emoji: '⚔️', name: 'Guerrier de Sang', color: '#ef4444', primaryStat: 'physique' },
    mage: { emoji: '🔮', name: 'Mage Arcanique', color: '#a855f7', primaryStat: 'intelligence' },
    archer: { emoji: '🏹', name: 'Ranger de l'Ombre', color: '#22c55e', primaryStat: 'creativite' },
    paladin: { emoji: '✨', name: 'Paladin Lumineux', color: '#f59e0b', primaryStat: 'discipline' }
  },
  statDefinitions: {
    physique: { label: 'Physique', emoji: '💪' },
    intelligence: { label: 'Intelligence', emoji: '🧠' },
    discipline: { label: 'Discipline', emoji: '🎯' },
    social: { label: 'Social', emoji: '🤝' },
    creativite: { label: 'Créativité', emoji: '🎨' },
    sante: { label: 'Santé', emoji: '❤️' },
    finance: { label: 'Finance', emoji: '💰' }
  },
  internationalHolidays: [
    { type: 'date', date: '01-01', name: 'Nouvel An', emoji: '🎆', stat: 'discipline' },
    { type: 'date', date: '03-08', name: 'Journée des Femmes', emoji: '👩', stat: 'social' },
    { type: 'date', date: '04-22', name: 'Jour de la Terre', emoji: '🌍', stat: 'sante' },
    { type: 'date', date: '05-01', name: 'Fête du Travail', emoji: '👨‍💼', stat: 'discipline' },
    { type: 'date', date: '06-21', name: 'Fête de la Musique', emoji: '🎵', stat: 'creativite' },
    { type: 'date', date: '10-31', name: 'Halloween', emoji: '👻', stat: 'social' },
    { type: 'date', date: '12-25', name: 'Noël', emoji: '🎄', stat: 'social' }
  ]
};

const STAT_QUEST_POOLS = {
  physique: [
    'Réaliser 25 séries d'exercices physiques',
    'Session de marche active de 30 minutes',
    'Séance complète d'étirements musculaires',
    'Monter 100 marches d'escalier d'affilée'
  ],
  intelligence: [
    'Lire 25 pages d'un livre d'apprentissage',
    'Résoudre une énigme ou un problème complexe',
    'Suivre un cours ou tutoriel instructif',
    'Rédiger un résumé de connaissances acquises'
  ],
  discipline: [
    'Planifier l'intégralité de la journée du lendemain',
    'Session de focus profond (Pomodoro 45 min)',
    'Ranger et purifier complètement le bureau',
    'Exécuter la routine matinale sans déviation'
  ],
  social: [
    'Prendre des nouvelles d'un ami ou proche',
    'Exprimer un compliment sincère à quelqu'un',
    'Participer à une discussion de groupe constructive',
    'Aider activement un collègue ou membre de guilde'
  ],
  creativite: [
    'Écrire 300 mots de création littéraire',
    'Réaliser un dessin, schéma ou concept visuel',
    'Proposer une solution innovante à un problème',
    'Composer ou arranger un motif musical'
  ],
  sante: [
    'Boire au minimum 2 Litres d'eau pure',
    'Session de méditation et respiration de 10 min',
    'Consommer un repas 100% équilibré et naturel',
    'Éteindre tous les écrans 1 heure avant le coucher'
  ],
  finance: [
    'Catégoriser et enregistrer toutes les dépenses du jour',
    'Économiser une somme dédiée au coffre de guilde',
    'Analyser son budget hebdomadaire',
    'Éviter tout achat impulsif durant la journée'
  ]
};

const LOOT_TABLE = [
  { rarity: 'common', weight: 55, name: 'Potion de Volonté', stat: 'discipline', bonus: 2, icon: '🧪' },
  { rarity: 'rare', weight: 28, name: 'Bague d'Endurance', stat: 'physique', bonus: 4, icon: '💍' },
  { rarity: 'epic', weight: 12, name: 'Grimoire d'Omniscience', stat: 'intelligence', bonus: 7, icon: '📖' },
  { rarity: 'legendary', weight: 5, name: 'Couronne du Monarque', stat: 'all', bonus: 12, icon: '👑' }
];

const ACHIEVEMENTS = [
  { id: 'first_quest', icon: '📜', name: 'Éveil du Héros', description: 'Compléter votre première quête', condition: p => p.completedQuests.length >= 1 },
  { id: 'quest_10', icon: '🎯', name: 'Aventurier Assidu', description: 'Accomplir 10 quêtes au total', condition: p => p.completedQuests.length >= 10 },
  { id: 'quest_50', icon: '⚔️', name: 'Tueur de Démons', description: 'Accomplir 50 quêtes', condition: p => p.completedQuests.length >= 50 },
  { id: 'level_5', icon: '🌟', name: 'Ascension I', description: 'Atteindre le niveau 5', condition: p => p.level >= 5 },
  { id: 'level_15', icon: '🔥', name: 'Ascension II', description: 'Atteindre le niveau 15', condition: p => p.level >= 15 },
  { id: 'gold_1000', icon: '💰', name: 'Pactole Rutilant', description: 'Accumuler 1000 Pièces d'Or', condition: p => p.gold >= 1000 }
];

// ==================== 2. FONCTIONS UTILITAIRES & HELPERS ====================

const $ = (id) => {
  const el = document.getElementById(id);
  return el || null;
};

function safeJsonParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; }
  catch { return fallback; }
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function pad2(n) { return String(n).padStart(2, '0'); }

function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(str).replace(/[&<>"']/g, char => map[char]);
}

function getCurrentSeason() {
  const m = new Date().getMonth() + 1;
  return Object.values(GAME_CONFIG.seasons).find(s => s.months.includes(m)) || GAME_CONFIG.seasons.spring;
}

function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickDeterministic(arr, seed) {
  if (!arr || !arr.length) return null;
  return arr[seed % arr.length];
}

function getOrCreateElement(id, tagName = 'div') {
  let el = $(id);
  if (!el) {
    el = document.createElement(tagName);
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

function showToast(msg, type = 'info') {
  const container = getOrCreateElement('toastContainer');
  const toast = document.createElement('div');
  toast.className = `rpg-toast ${type} show`;
  toast.textContent = msg;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function showFloatingText(text, x, y, type = 'xp') {
  const el = document.createElement('div');
  el.className = type === 'damage' ? 'damage-notification damage-float' : 'xp-notification xp-float';
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function createConfetti() {
  const zone = $('confetti');
  if (!zone) return;
  
  zone.innerHTML = '';
  const colors = ['#ffd700', '#6366f1', '#a855f7', '#22c55e', '#ef4444'];
  
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: -10px;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      transition: all 2.5s cubic-bezier(0.25, 1, 0.5, 1);
    `;
    zone.appendChild(p);

    setTimeout(() => {
      p.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`;
      p.style.opacity = '0';
    }, 50);
    
    setTimeout(() => p.remove(), 2600);
  }
}

// ==================== 3. GESTION DE L'ÉTAT DU JEU (STATE) ====================

const GameState = {
  player: null,
  quests: [],
  raids: [],
  logs: [],
  chatMessages: [],
  activeTab: 'quests',
  questFilter: 'all'
};

function getRequiredXP(level) {
  return Math.floor(GAME_CONFIG.leveling.baseXP * Math.pow(GAME_CONFIG.leveling.growth, level - 1));
}

function getPlayerTitle(level) {
  if (level >= 30) return '👑 Souverain Divin';
  if (level >= 20) return '⚔️ Légende Vivante';
  if (level >= 10) return '🔥 Champion Arcanique';
  if (level >= 5) return '🛡️ Aventurier Aguerri';
  return '🌱 Novice Prometteur';
}

function createDefaultPlayer(name = 'Chasseur S-Rank', pClass = 'warrior') {
  return {
    id: uid('player'),
    name: name,
    class: pClass,
    level: 1,
    xp: 0,
    gold: 50,
    stats: { physique: 10, intelligence: 10, discipline: 10, social: 10, creativite: 10, sante: 10, finance: 10 },
    inventory: [
      { id: uid('item'), name: 'Anneau de Débutant', stat: 'discipline', bonus: 1, icon: '💍', equipped: true }
    ],
    achievements: [],
    completedQuests: [],
    streak: { current: 1, lastDate: dateKey() }
  };
}

function createDefaultRaids() {
  return [
    {
      id: uid('raid'),
      name: 'Seigneur des Ombres Ignis',
      description: 'Un boss primordial résidant dans la faille temporelle. Infligez des dégâts en complétant vos quêtes !',
      maxHp: 1000,
      currentHp: 750,
      rewards: { xp: 500, gold: 300 },
      icon: '🐉'
    }
  ];
}

function loadState() {
  const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY), null);
  if (saved) {
    Object.assign(GameState, saved);
  } else {
    GameState.player = createDefaultPlayer();
    GameState.raids = createDefaultRaids();
    generateDailyQuests();
    saveState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GameState));
}

// ==================== 4. SYSTEME DE QUÊTES & RAIDS ====================

function generateDailyQuests() {
  const today = dateKey();
  const seed = seedFromString(today);
  const newQuests = [];

  // Quêtes quotidiennes générées dynamiquement
  Object.entries(GAME_CONFIG.statDefinitions).forEach(([statKey, statInfo], idx) => {
    const pool = STAT_QUEST_POOLS[statKey] || [`Mission spéciale de ${statInfo.label}`];
    const title = pickDeterministic(pool, seed + idx);
    const rarity = idx % 2 === 0 ? 'D' : 'C';

    newQuests.push({
      id: uid('quest'),
      title: title,
      description: `Développe ta stat [${statInfo.label}] pour renforcer ton personnage.`,
      rarity: rarity,
      type: 'daily',
      stat: statKey,
      xp: GAME_CONFIG.questRarities[rarity].xp,
      gold: GAME_CONFIG.questRarities[rarity].gold,
      dateCreated: today,
      completed: false
    });
  });

  // Quête Légendaire Annuelle SSS
  newQuests.push({
    id: uid('quest_sss'),
    title: 'Ascension Ultimatum SSS',
    description: 'Atteignez un cap majeur de vie cette année pour débloquer le rang suprême.',
    rarity: 'SSS',
    type: 'annual',
    stat: 'discipline',
    xp: GAME_CONFIG.questRarities.SSS.xp,
    gold: GAME_CONFIG.questRarities.SSS.gold,
    dateCreated: today,
    completed: false
  });

  GameState.quests = [...GameState.quests.filter(q => q.type !== 'daily' || q.completed), ...newQuests];
}

function completeQuest(questId, event) {
  const quest = GameState.quests.find(q => q.id === questId);
  if (!quest || quest.completed) return;

  quest.completed = true;
  quest.completedAt = Date.now();

  const player = GameState.player;
  player.xp += quest.xp;
  player.gold += quest.gold;
  player.completedQuests.push(quest.id);

  // Augmentation de stat
  if (quest.stat && player.stats[quest.stat] !== undefined) {
    player.stats[quest.stat] += 1;
  }

  // Animation Effet Flottant (XP & Or)
  if (event?.clientX) {
    showFloatingText(`+${quest.xp} XP`, event.clientX, event.clientY - 20, 'xp');
  }

  // Dégâts au Boss de Raid
  damageActiveRaids(quest.xp, event);

  // Vérifier Level Up
  checkLevelUp();

  // Tirage de Loot
  if (Math.random() < 0.35) {
    triggerLootDrop();
  }

  // Log de l'action
  addLog(`Quête accomplie : ${quest.title} (+${quest.xp} XP, +${quest.gold} Or)`, quest.id);

  saveState();
  renderAll();
  createConfetti();
  showToast(`Quête terminée ! +${quest.xp} XP / +${quest.gold} Or`, 'success');
}

function damageActiveRaids(damageAmount, event) {
  GameState.raids.forEach(raid => {
    if (raid.currentHp > 0) {
      raid.currentHp = Math.max(0, raid.currentHp - damageAmount);
      if (event?.clientX) {
        showFloatingText(`-${damageAmount} HP`, event.clientX + 40, event.clientY - 40, 'damage');
      }
      if (raid.currentHp === 0) {
        GameState.player.xp += raid.rewards.xp;
        GameState.player.gold += raid.rewards.gold;
        showToast(`VICTOIRE DE RAID ! Boss ${raid.name} vaincu !`, 'success');
      }
    }
  });
}

function checkLevelUp() {
  const player = GameState.player;
  let req = getRequiredXP(player.level);

  while (player.xp >= req) {
    player.xp -= req;
    player.level += 1;
    req = getRequiredXP(player.level);
    showToast(`🎉 MONTÉE DE NIVEAU ! Vous êtes désormais Niveau ${player.level} !`, 'success');
  }
}

function triggerLootDrop() {
  const loot = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
  const item = {
    id: uid('item'),
    name: loot.name,
    stat: loot.stat,
    bonus: loot.bonus,
    icon: loot.icon,
    equipped: false
  };
  GameState.player.inventory.push(item);
  showToast(`🎁 BUTIN TROUVÉ : ${item.icon} ${item.name} (+${item.bonus} ${item.stat})`, 'info');
}

function undoQuestCompletion(logId) {
  const logIndex = GameState.logs.findIndex(l => l.id === logId);
  if (logIndex === -1) return;

  const log = GameState.logs[logIndex];
  if (!log.questId) return;

  const quest = GameState.quests.find(q => q.id === log.questId);
  if (quest && quest.completed) {
    quest.completed = false;
    GameState.player.xp = Math.max(0, GameState.player.xp - quest.xp);
    GameState.player.gold = Math.max(0, GameState.player.gold - quest.gold);
    
    GameState.logs.splice(logIndex, 1);
    
    saveState();
    renderAll();
    showToast('Action annulée avec succès.', 'warning');
  }
}

function addLog(text, questId = null) {
  GameState.logs.unshift({
    id: uid('log'),
    text: text,
    questId: questId,
    timestamp: Date.now()
  });
  if (GameState.logs.length > 30) GameState.logs.pop();
}

// ==================== 5. RENDU DE L'INTERFACE (UI RENDERERS) ====================

/**
 * Template builders - Fonctions pures pour construire le HTML sans le modifier dans le DOM
 */

function buildHeroHtml() {
  const p = GameState.player;
  if (!p) return '';

  const reqXp = getRequiredXP(p.level);
  const xpPercent = Math.min(100, Math.floor((p.xp / reqXp) * 100));
  const season = getCurrentSeason();

  return `
    <div class="hero-main">
      <div class="hero-badge glow-effect">${season.emoji} Saison ${season.name}</div>
      <h1>${escapeHtml(p.name)}</h1>
      <p class="hero-subtitle">${getPlayerTitle(p.level)} • Classe: <strong>${GAME_CONFIG.classesInfo[p.class]?.name || 'Guerrier'}</strong></p>
    </div>
    <div class="hero-stats-summary">
      <div style="margin-bottom: 10px; font-weight:700;">Niveau ${p.level} • <span style="color:#ffd700;">💰 ${p.gold} Or</span></div>
      <div class="xp-bar-container" title="${p.xp} / ${reqXp} XP">
        <div class="xp-bar-fill" style="width: ${xpPercent}%;"></div>
      </div>
      <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:5px; text-align:right;">${p.xp} / ${reqXp} XP (${xpPercent}%)</div>
    </div>
  `;
}

function buildQuestCardHtml(q) {
  const rarityInfo = GAME_CONFIG.questRarities[q.rarity] || GAME_CONFIG.questRarities.E;
  const statLabel = q.stat ? GAME_CONFIG.statDefinitions[q.stat]?.label || '' : '';
  
  return `
    <div class="quest-card rarity-${q.rarity.toLowerCase()} ${q.completed ? 'completed' : ''}" data-quest-id="${escapeHtml(q.id)}">
      <div>
        <div class="quest-header">
          <div class="quest-title">${escapeHtml(q.title)}</div>
          <span class="quest-rarity">${rarityInfo.icon} ${q.rarity}</span>
        </div>
        <div class="quest-description">${escapeHtml(q.description)}</div>
        <div class="quest-rewards">
          <span class="quest-xp">+${q.xp} XP</span>
          <span class="quest-gold">💰 +${q.gold}</span>
          ${q.stat ? `<span class="quest-xp" style="color:#22c55e;">+1 ${statLabel}</span>` : ''}
        </div>
      </div>
      <div class="quest-footer">
        ${q.completed 
          ? `<button class="btn-complete" disabled style="background:#334155; cursor:default;">✔️ Accomplie</button>` 
          : `<button class="btn-complete">Valider la Quête</button>`}
      </div>
    </div>
  `;
}

function buildPlayerCardHtml() {
  const p = GameState.player;
  if (!p) return '';
  
  const classInfo = GAME_CONFIG.classesInfo[p.class] || GAME_CONFIG.classesInfo.warrior;

  const statsHtml = Object.entries(p.stats).map(([k, v]) => `
    <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:8px; font-size:0.9rem;">
      ${GAME_CONFIG.statDefinitions[k]?.emoji || '📊'} ${GAME_CONFIG.statDefinitions[k]?.label || k}: <strong>${v}</strong>
    </div>
  `).join('');

  const inventoryHtml = p.inventory.map(item => `
    <span style="background:rgba(99, 102, 241, 0.2); border:1px solid rgba(99, 102, 241, 0.4); padding:4px 10px; border-radius:999px; font-size:0.85rem;">
      ${item.icon} ${escapeHtml(item.name)} (+${item.bonus} ${item.stat})
    </span>
  `).join('');

  return `
    <div class="player-card">
      <div class="player-header">
        <div class="player-avatar player-class-${p.class}">${classInfo.emoji}</div>
        <div class="player-info">
          <h3>${escapeHtml(p.name)}</h3>
          <span class="player-badge">${classInfo.name}</span>
        </div>
      </div>
      <div>
        <strong>Stats IRL :</strong>
        <div class="stats-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:8px; margin-top:8px;">
          ${statsHtml}
        </div>
      </div>
      <div>
        <strong>Équipement & Inventaire :</strong>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
          ${inventoryHtml}
        </div>
      </div>
    </div>
  `;
}

function buildRaidCardHtml(raid) {
  const hpPercent = Math.max(0, Math.floor((raid.currentHp / raid.maxHp) * 100));
  const isDefeated = raid.currentHp === 0;
  
  return `
    <div class="raid-card ${isDefeated ? 'defeated' : ''}">
      <div class="raid-header">
        <div style="font-size:2rem;">${raid.icon}</div>
        <div>
          <h3>${escapeHtml(raid.name)}</h3>
          <p style="font-size:0.9rem; color:var(--text-secondary);">${escapeHtml(raid.description)}</p>
        </div>
      </div>
              <div class="raid-hp-bar" title="${raid.currentHp} / ${raid.maxHp}" style="margin-top:12px; border-radius:999px; background:rgba(148,163,184,.22); overflow:hidden;">
          <div class="raid-hp-fill" style="width:${hpPercent}%; height:16px; background:linear-gradient(90deg,#667eea,#764ba2);"></div>
        </div>

        <div class="raid-meta" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
          <span class="badge-soft">❤️ ${raid.currentHp} / ${raid.maxHp} HP</span>
          <span class="badge-soft">💰 Récompense ${raid.rewards.gold}</span>
          <span class="badge-soft">${isDefeated ? '🏁 Vaincu' : '🔥 En cours'}</span>
        </div>

        <div class="raid-actions" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; margin-top:14px;">
          <button class="btn-raid-battle" data-action="raid-fight" data-raid-id="${escapeHtml(raid.id)}">⚔️ Combattre</button>
          <button class="btn-raid-battle" data-action="raid-heal" data-raid-id="${escapeHtml(raid.id)}" style="background:linear-gradient(135deg,#22c55e,#16a34a);">💚 Soigner</button>
          <button class="btn-raid-delete" data-action="raid-delete" data-raid-id="${escapeHtml(raid.id)}">🗑️ Supprimer</button>
        </div>
      </div>
    `;
}
// ==================== 6. ÉTAT MULTI-JOUEURS & ROLES ====================

function normalizePlayerState() {
  if (!Array.isArray(GameState.players)) {
    GameState.players = [];
  }

  if (GameState.player && !GameState.players.length) {
    GameState.players = [GameState.player];
  }

  if (!GameState.player && GameState.players.length) {
    GameState.player = GameState.players[0];
  }

  if (!GameState.activePlayerId) {
    GameState.activePlayerId = GameState.player?.id || GameState.players[0]?.id || null;
  }

  if (GameState.activePlayerId && GameState.players.length) {
    const found = GameState.players.find(p => p.id === GameState.activePlayerId);
    if (found) GameState.player = found;
  }
}

function getPlayers() {
  normalizePlayerState();
  return GameState.players || [];
}

function getActivePlayer() {
  normalizePlayerState();
  return GameState.players.find(p => p.id === GameState.activePlayerId) || GameState.players[0] || GameState.player || null;
}

function setActivePlayer(playerId) {
  normalizePlayerState();
  const player = GameState.players.find(p => p.id === playerId);
  if (!player) return;
  GameState.activePlayerId = playerId;
  GameState.player = player;
  saveState();
  renderAll();
}

function createPlayer(name, pClass = 'warrior') {
  const player = createDefaultPlayer(name, pClass);
  GameState.players = getPlayers();
  GameState.players.push(player);
  GameState.player = GameState.players[0];
  GameState.activePlayerId = player.id;

  recordAction({
    type: 'player_create',
    label: `Création du joueur ${name}`,
    actorPlayerId: player.id,
    affectedPlayers: [{
      playerId: player.id,
      before: null,
      after: deepClone(player)
    }]
  });

  saveState();
  renderAll();
  showToast(`✨ ${name} entre dans l'aventure.`, 'success');
  return player;
}

function getPlayerById(playerId) {
  return getPlayers().find(p => p.id === playerId) || null;
}
function getPlayerById(playerId) {
  return getPlayers().find(p => p.id === playerId) || null;
}

function capturePlayerSnapshot(player) {
  return player ? deepClone(player) : null;
}

function restorePlayerSnapshot(playerId, snapshot) {
  const idx = getPlayers().findIndex(p => p.id === playerId);
  if (idx === -1 || !snapshot) return;
  GameState.players[idx] = deepClone(snapshot);
  if (GameState.activePlayerId === playerId) {
    GameState.player = GameState.players[idx];
  }
}
// ==================== 7. JOURNAL D'ACTIONS, ANNULATION, MÉMOIRE ====================

function recordAction(entry) {
  if (!Array.isArray(GameState.logs)) GameState.logs = [];

  GameState.logs.unshift({
    id: uid('log'),
    timestamp: Date.now(),
    undone: false,
    ...deepClone(entry)
  });

  if (GameState.logs.length > 80) {
    GameState.logs.length = 80;
  }

  saveState();
  renderActionLogs();
}

function canUndoAction(log) {
  if (!log || log.undone) return false;
  const age = Date.now() - Number(log.timestamp || 0);
  return age <= GAME_CONFIG.quests.undoWindowMs;
}

function undoAction(logId) {
  const log = GameState.logs.find(l => l.id === logId);
  if (!log) {
    showToast('Action introuvable.', 'error');
    return;
  }

  if (!canUndoAction(log)) {
    showToast('Cette action est trop ancienne pour être annulée.', 'warning');
    return;
  }

  if (!confirm(`Annuler: ${log.label || log.type} ?`)) return;

  if (Array.isArray(log.affectedPlayers)) {
    log.affectedPlayers.forEach(entry => {
      if (entry.before === null) {
        GameState.players = getPlayers().filter(p => p.id !== entry.playerId);
      } else {
        restorePlayerSnapshot(entry.playerId, entry.before);
      }
    });
  }

  if (log.questId && log.questBefore) {
    restoreQuestSnapshot(log.questId, log.questBefore);
  }

  if (log.raidsBefore) {
    GameState.raids = deepClone(log.raidsBefore);
  }

  if (log.meta?.restoreGold !== undefined && GameState.player) {
    GameState.player.gold = log.meta.restoreGold;
  }

  if (log.meta?.restoreXP !== undefined && GameState.player) {
    GameState.player.xp = log.meta.restoreXP;
  }

  log.undone = true;
  log.undoneAt = Date.now();

  saveState();
  renderAll();
  showToast('Action annulée avec succès.', 'success');
}

function undoLatestActionForPlayer(playerId) {
  const log = [...GameState.logs].find(entry =>
    !entry.undone &&
    canUndoAction(entry) &&
    (
      entry.actorPlayerId === playerId ||
      (Array.isArray(entry.affectedPlayers) && entry.affectedPlayers.some(a => a.playerId === playerId))
    )
  );

  if (!log) {
    showToast('Aucune action annulable trouvée.', 'warning');
    return;
  }

  undoAction(log.id);
}

function renderActionLogs() {
  const zone = $('actionLogsList');
  if (!zone) return;

  const logs = GameState.logs || [];
  if (!logs.length) {
    zone.innerHTML = `<div class="mini-card">Aucune action enregistrée pour le moment.</div>`;
    return;
  }

  zone.innerHTML = logs.map(log => {
    const when = new Date(log.timestamp).toLocaleString('fr-FR');
    const status = log.undone ? 'Annulée' : (canUndoAction(log) ? 'Annulable' : 'Expirée');
    return `
      <div class="mini-card" style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
        <div>
          <strong>${escapeHtml(log.label || log.type || 'Action')}</strong><br>
          <span style="color:#64748b;">${escapeHtml(when)}</span><br>
          <span style="color:#64748b;">Statut: ${status}</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${!log.undone && canUndoAction(log) ? `<button class="btn-secondary" onclick="undoAction('${log.id}')">↩ Annuler</button>` : ''}
          ${log.actorPlayerId ? `<button class="btn-secondary" onclick="undoLatestActionForPlayer('${log.actorPlayerId}')">↩ Dernière du joueur</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}
// ==================== 8. PLAYERS, TITRES, INVENTAIRE WOW ====================

function getPlayerTitleFromStats(player) {
  const s = player.stats;
  if (player.level >= 30) return '👑 Souverain Divin';
  if (player.level >= 20) return '⚔️ Légende Vivante';
  if (s.discipline >= 100) return '🎯 Maître de la Discipline';
  if (s.intelligence >= 100) return '🧠 Sage Suprême';
  if (s.finance >= 100) return '💰 Magnat';
  if (s.physique >= 100) return '💪 Colosse';
  if (s.creativite >= 100) return '🎨 Visionnaire';
  return '🌱 Aventurier Prometteur';
}

function buildRosterPlayerCardHtml(player) {
  const classInfo = GAME_CONFIG.classesInfo[player.class] || GAME_CONFIG.classesInfo.warrior;
  const xpPct = clamp(Math.floor((player.xp / player.xpNeeded) * 100), 0, 100);
  const primaryStat = classInfo.primaryStat || getStrongestStat(player.stats);
  const inventoryPreview = (player.inventory || []).slice(0, 3).map(item => `
    <span class="badge-soft">${item.icon || '🎁'} ${escapeHtml(item.name)}</span>
  `).join('');

  return `
    <div class="player-card" data-player-id="${escapeHtml(player.id)}" style="cursor:pointer;">
      <div class="player-header">
        <div style="display:flex;gap:12px;align-items:center;">
          <div class="player-avatar player-class-${player.class}">${classInfo.emoji}</div>
          <div class="player-info">
            <h3>${escapeHtml(player.name)}</h3>
            <p class="player-class">${classInfo.name}</p>
            <div class="player-badge">${getPlayerTitleFromStats(player)}</div>
          </div>
        </div>
        <div class="mini-card" style="min-width:110px;text-align:center;">
          <strong>${GAME_CONFIG.statDefinitions[primaryStat].emoji} ${GAME_CONFIG.statDefinitions[primaryStat].label}</strong>
          ${player.stats[primaryStat] || 0}
        </div>
      </div>

      <div class="player-stats">
        <div class="stat-row"><span class="stat-label">Niveau</span><span class="stat-value">${player.level}</span></div>
        <div class="stat-row"><span class="stat-label">Quêtes</span><span class="stat-value">${player.completedQuests?.length || 0}</span></div>
        <div class="stat-row"><span class="stat-label">Or</span><span class="stat-value">💰 ${player.gold || 0}</span></div>
        <div class="stat-row"><span class="stat-label">Badges</span><span class="stat-value">${player.badges?.length || 0}</span></div>
      </div>

      <div class="xp-container">
        <div class="xp-label"><span>XP</span><span>${xpPct}%</span></div>
        <div class="xp-bar">
          <div class="xp-fill" style="width:${xpPct}%">
            <div class="xp-text">${player.xp}/${player.xpNeeded}</div>
          </div>
        </div>
      </div>

      <div style="margin-top:12px;">
        <strong>Inventaire express</strong>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
          ${inventoryPreview || '<span class="badge-soft">Aucun objet</span>'}
        </div>
      </div>
    </div>
  `;
}
function renderPlayers() {
  const list = $('playersList');
  if (!list) return;

  const players = getPlayers().slice().sort((a, b) => (b.level - a.level) || (b.xp - a.xp));
  if (!players.length) {
    list.innerHTML = `<div class="mini-card" style="grid-column:1/-1;text-align:center;">Aucun joueur. Crée le premier héros.</div>`;
    return;
  }

  list.innerHTML = players.map(buildRosterPlayerCardHtml).join('');

  list.querySelectorAll('.player-card').forEach(card => {
    card.addEventListener('click', () => {
      const player = getPlayerById(card.dataset.playerId);
      if (player) openPlayerDetailsModal(player.id);
    });
  });
}

function openPlayerDetailsModal(playerId) {
  const player = getPlayerById(playerId);
  if (!player) return;

  const modal = $('playerDetailsModal');
  const content = $('playerDetailsContent');
  if (!modal || !content) return;

  const statsGrid = Object.entries(player.stats).map(([key, value]) => `
    <div class="stat-chip">
      <strong>${GAME_CONFIG.statDefinitions[key].emoji} ${GAME_CONFIG.statDefinitions[key].label}</strong>
      ${value} • ${value < 25 ? 'Novice' : value < 50 ? 'Apprenti' : value < 100 ? 'Expert' : value < 250 ? 'Maître' : 'Légende'}
    </div>
  `).join('');

  const inventoryGrid = (player.inventory || []).map(item => `
    <div class="inventory-item">
      <strong>${item.icon || '🎁'} ${escapeHtml(item.name)}</strong><br>
      ${item.stat === 'all' ? 'Tous les stats' : GAME_CONFIG.statDefinitions[item.stat]?.label || item.stat} +${item.bonus}
    </div>
  `).join('');

  content.innerHTML = `
    <div class="quest-focus-banner">
      <div><strong>${GAME_CONFIG.classesInfo[player.class].emoji} ${escapeHtml(player.name)}</strong></div>
      <div class="player-title">${getPlayerTitleFromStats(player)}</div>
      <button class="btn-secondary" onclick="undoLatestActionForPlayer('${player.id}')">↩ Annuler dernière action</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
      <div>
        <h2>${GAME_CONFIG.classesInfo[player.class].emoji} ${escapeHtml(player.name)}</h2>
        <p style="color:#64748b;">${GAME_CONFIG.classesInfo[player.class].name}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn-secondary" onclick="setActivePlayer('${player.id}')">Activer</button>
        <button class="btn-secondary" onclick="deletePlayer('${player.id}'); closePlayerDetailsModal();">Supprimer</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-chip"><strong>🎚️ Niveau</strong>${player.level}</div>
      <div class="stat-chip"><strong>⭐ XP</strong>${player.xp}/${player.xpNeeded}</div>
      <div class="stat-chip"><strong>💰 Or</strong>${player.gold}</div>
      <div class="stat-chip"><strong>🔥 Série</strong>${player.streak?.current || 0}</div>
      <div class="stat-chip"><strong>🏆 Record</strong>${player.streak?.best || 0}</div>
      <div class="stat-chip"><strong>🎖️ Badges</strong>${player.badges?.length || 0}</div>
    </div>

    <div class="xp-container" style="margin-top:16px;">
      <div class="xp-label"><span>Progression</span><span>${Math.round(player.getXPPercentage())}%</span></div>
      <div class="xp-bar">
        <div class="xp-fill" style="width:${player.getXPPercentage()}%">
          <div class="xp-text">${player.xp}/${player.xpNeeded}</div>
        </div>
      </div>
    </div>

    <h3 style="margin-top:24px;">📊 Attributs</h3>
    <div class="stats-grid">${statsGrid}</div>

    <h3 style="margin-top:24px;">🎒 Inventaire</h3>
    <div class="inventory-grid">${inventoryGrid || '<div class="mini-card">Aucun objet pour l’instant.</div>'}</div>
  `;

  modal.classList.add('show');
}

function closePlayerDetailsModal() {
  $('playerDetailsModal')?.classList.remove('show');
}

function addPlayer() {
  const name = $('newPlayerName')?.value?.trim();
  const playerClass = $('newPlayerClass')?.value || 'warrior';
  if (!name) {
    showToast('Le nom du joueur est requis.', 'warning');
    return;
  }

  const player = createPlayer(name, playerClass);
  if ($('newPlayerName')) $('newPlayerName').value = '';
  closeAddPlayerModal();
  showToast(`✨ ${player.name} rejoint le royaume.`, 'success');
}

function deletePlayer(playerId) {
  if (!confirm('Supprimer ce joueur ?')) return;
  GameState.players = getPlayers().filter(p => p.id !== playerId);
  if (GameState.activePlayerId === playerId) {
    GameState.activePlayerId = GameState.players[0]?.id || null;
    GameState.player = GameState.players[0] || null;
  }
  saveState();
  renderAll();
}

// ==================== 9. QUÊTES AVEC PICKER, APPLICATION & ANNULATION ====================

function openQuestPicker(questId) {
  const quest = GameState.quests.find(q => q.id === questId);
  if (!quest) return;

  const players = getPlayers();
  if (!players.length) {
    showToast('Crée un joueur d’abord.', 'warning');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'modal show';
  modal.style.zIndex = '4000';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Choisir le héros qui valide</h2>
      <p style="color:#64748b;">${escapeHtml(quest.title)}</p>
      <div style="display:grid;gap:10px;margin-top:14px;">
        ${players.map(p => `
          <button class="btn-primary" style="text-align:left;" onclick="validateQuestForPlayer('${questId}','${p.id}'); this.closest('.modal').remove();">
            ${GAME_CONFIG.classesInfo[p.class].emoji} ${escapeHtml(p.name)} • Niveau ${p.level}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function validateQuestForPlayer(questId, playerId, source = 'manual') {
  const quest = GameState.quests.find(q => q.id === questId);
  const player = getPlayerById(playerId);

  if (!quest || !player || quest.completed) return;

  const beforePlayer = capturePlayerSnapshot(player);
  const beforeQuest = captureQuestSnapshot(questId);
  const beforeXP = player.xp;
  const beforeGold = player.gold;
  const beforeRaids = captureRaidsSnapshot();

  quest.completed = true;
  quest.completedAt = Date.now();
  quest.completedBy = playerId;

  player.xp += quest.xp;
  player.gold += quest.gold;
  player.completedQuests = player.completedQuests || [];
  if (!player.completedQuests.includes(quest.id)) player.completedQuests.push(quest.id);

  if (quest.stat && player.stats[quest.stat] !== undefined) {
    player.stats[quest.stat] += (quest.statGain || 1);
  }

  if (source === 'daily') {
    player.streak = player.streak || { current: 0, best: 0, lastDate: null };
    const today = dateKey();
    if (player.streak.lastDate !== today) {
      player.streak.current = (player.streak.lastDate && String(player.streak.lastDate) === String(new Date(Date.now() - 86400000).toISOString().slice(0, 10))) ? player.streak.current + 1 : 1;
      player.streak.best = Math.max(player.streak.best || 0, player.streak.current);
      player.streak.lastDate = today;
    }
  }

  const leveledUp = checkLevelUp(player);
  const loot = maybeDropLoot(player);

  recordAction({
    type: 'quest_complete',
    label: `Quête validée: ${quest.title}`,
    actorPlayerId: playerId,
    questId,
    questBefore: beforeQuest,
    questAfter: captureQuestSnapshot(questId),
    raidsBefore: beforeRaids,
    affectedPlayers: [{
      playerId,
      before: beforePlayer,
      after: capturePlayerSnapshot(player)
    }],
    meta: {
      restoreXP: beforeXP,
      restoreGold: beforeGold,
      leveledUp,
      lootName: loot?.name || null
    }
  });

  saveState();
  renderAll();
  createConfetti();
  showToast(`${player.name} valide "${quest.title}".`, 'success');
}

function questActionHandler(questId) {
  openQuestPicker(questId);
}

function checkLevelUp(player) {
  let leveled = 0;
  while (player.xp >= player.xpNeeded) {
    player.xp -= player.xpNeeded;
    player.level += 1;
    player.xpNeeded = getRequiredXP(player.level);
    leveled += 1;
  }
  if (leveled > 0) {
    showToast(`🎉 ${player.name} passe niveau ${player.level} !`, 'success');
  }
  return leveled;
}

function maybeDropLoot(player) {
  const roll = Math.random() * 100;
  if (roll > 35) return null;

  const loot = getDeterministicLoot();
  player.inventory = player.inventory || [];
  player.inventory.unshift({
    id: uid('item'),
    ...loot,
    equipped: false
  });

  if (player.inventory.length > 20) player.inventory.length = 20;
  showToast(`🎁 Loot obtenu: ${loot.icon} ${loot.name}`, 'info');
  return loot;
}

function getDeterministicLoot() {
  const tierRoll = Math.random() * 100;
  let tier = LOOT_TABLE[0];
  if (tierRoll > 95) tier = LOOT_TABLE[3];
  else if (tierRoll > 80) tier = LOOT_TABLE[2];
  else if (tierRoll > 45) tier = LOOT_TABLE[1];
  else tier = LOOT_TABLE[0];

  return {
    rarity: tier.rarity,
    name: tier.name,
    stat: tier.stat,
    bonus: tier.bonus,
    icon: tier.icon
  };
}
function undoQuestCompletionByLog(logId) {
  undoAction(logId);
}

// ==================== 10. RAIDS COOP, ÉTAGES, WOW ====================

function openCreateRaidModal() {
  const players = getPlayers();
  if (!players.length) {
    showToast('Crée au moins un joueur.', 'warning');
    return;
  }

  const list = $('raidPlayersList');
  if (list) {
    list.innerHTML = players.map(p => `
      <div class="checkbox-item">
        <input type="checkbox" id="raid-player-${p.id}" value="${p.id}">
        <label for="raid-player-${p.id}">${GAME_CONFIG.classesInfo[p.class].emoji} ${escapeHtml(p.name)}</label>
      </div>
    `).join('');
  }

  $('createRaidModal')?.classList.add('show');
}

function closeCreateRaidModal() {
  $('createRaidModal')?.classList.remove('show');
}

function createRaid() {
  const name = $('raidName')?.value?.trim();
  const floors = parseInt($('raidFloors')?.value || '5', 10);
  const selectedPlayers = Array.from(document.querySelectorAll('#raidPlayersList input:checked'))
    .map(cb => getPlayerById(cb.value))
    .filter(Boolean);

  if (!name) {
    showToast('Nom de raid requis.', 'warning');
    return;
  }

  if (selectedPlayers.length < 2) {
    showToast('Au moins 2 joueurs requis.', 'warning');
    return;
  }
   const raid = {
    id: uid('raid'),
    icon: '🏰',
    name,
    description: `Raid coopératif à ${floors} étages.`,
    totalFloors: floors,
    currentFloor: 1,
    currentHp: 100 + floors * 120,
    maxHp: 100 + floors * 120,
    members: selectedPlayers.map(p => p.id),
    rewards: { xp: floors * 80, gold: floors * 60 },
    createdAt: Date.now()
  };

  GameState.raids.push(raid);
  recordAction({
    type: 'raid_create',
    label: `Création du raid ${name}`,
    actorPlayerId: selectedPlayers[0]?.id || null,
    raidsBefore: captureRaidsSnapshot()
  });

  saveState();
  renderAll();
  closeCreateRaidModal();
  showToast(`⚔️ Raid "${name}" créé.`, 'success');
}

function renderRaids() {
  const zone = $('raidsList');
  if (!zone) return;

  const raids = GameState.raids || [];
  if (!raids.length) {
    zone.innerHTML = `<div class="mini-card" style="grid-column:1/-1;text-align:center;">Aucun raid pour l’instant. Lance une zone de chaos contrôlé.</div>`;
    return;
  }

  zone.innerHTML = raids.map(buildRaidCardHtml).join('');
  bindRaidActions();
}

function bindRaidActions() {
  const zone = $('raidsList');
  if (!zone || zone.__bound) return;
  zone.__bound = true;

  zone.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const raidId = btn.dataset.raidId;
    const action = btn.dataset.action;

    if (action === 'raid-fight') startRaidBattle(raidId);
    if (action === 'raid-heal') raidHealTeam(raidId);
    if (action === 'raid-delete') deleteRaid(raidId);
  });
}

function startRaidBattle(raidId) {
  const raid = GameState.raids.find(r => String(r.id) === String(raidId));
  if (!raid) return;

  const modal = $('raidBattleModal');
  const content = $('raidBattleContent');
  if (!modal || !content) return;

  const renderBattle = () => {
    const hpPct = clamp(Math.floor((raid.currentHp / raid.maxHp) * 100), 0, 100);
    content.innerHTML = `
      <div class="quest-focus-banner">
        <div style="font-size:2rem;">${raid.icon}</div>
        <div>
          <strong>${escapeHtml(raid.name)}</strong><br>
          <span style="color:#64748b;">${escapeHtml(raid.description)}</span>
        </div>
      </div>

      <div class="raid-battle-container">
        <div class="raid-floor-info">
          <div class="raid-floor-title">Boss / Raid</div>
          <div class="raid-enemy">
            <div class="raid-enemy-name">${escapeHtml(raid.name)}</div>
            <div class="raid-enemy-hp">HP: ${raid.currentHp}/${raid.maxHp}</div>
            <div class="raid-enemy-hp-bar">
              <div class="raid-enemy-hp-fill" style="width:${hpPct}%"></div>
            </div>
          </div>
        </div>

        <div class="raid-team-status">
          <div class="raid-team-title">Équipe</div>
          <div class="raid-team-members">
            ${(raid.members || []).map(id => {
              const p = getPlayerById(id);
              if (!p) return '';
              return `
                <div class="raid-member">
                  <div class="raid-member-name">${GAME_CONFIG.classesInfo[p.class].emoji} ${escapeHtml(p.name)}</div>
                  <div class="raid-member-hp">Niv. ${p.level} • HP ${Math.floor(p.getHP())}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="raid-actions" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
        <button class="btn-attack" data-battle-action="attack" data-raid-id="${raid.id}">⚔️ Attaquer</button>
        <button class="btn-heal" data-battle-action="heal" data-raid-id="${raid.id}">💚 Soigner</button>
        <button class="btn-secondary" onclick="closeRaidBattle()">Fermer</button>
      </div>
    `;

    bindBattleActions(raidId, renderBattle);
  };

  modal.classList.add('show');
  renderBattle();
}

function bindBattleActions(raidId, renderBattle) {
  const content = $('raidBattleContent');
  if (!content || content.__bound) return;
  content.__bound = true;

  content.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-battle-action]');
    if (!btn) return;
    const action = btn.dataset.battleAction;
    const raid = GameState.raids.find(r => String(r.id) === String(raidId));
    if (!raid) return;

    if (action === 'attack') {
      raid.currentHp = Math.max(0, raid.currentHp - Math.max(15, Math.floor(getActivePlayer()?.getAttackPower?.() || 20)));
      if (raid.currentHp === 0) {
        completeRaid(raid);
      } else {
        showToast('Le raid encaisse un coup massif.', 'info');
        saveState();
        renderAll();
        renderBattle();
      }
    }

    if (action === 'heal') {
      raid.currentHp = Math.min(raid.maxHp, raid.currentHp + 35);
      showToast('La team se régénère.', 'success');
      saveState();
      renderAll();
      renderBattle();
    }
  });
}

function completeRaid(raid) {
  const members = (raid.members || []).map(getPlayerById).filter(Boolean);
  members.forEach(p => {
    const before = capturePlayerSnapshot(p);
    p.xp += raid.rewards.xp;
    p.gold += raid.rewards.gold;
    checkLevelUp(p);
    recordAction({
      type: 'raid_reward',
      label: `Récompense raid: ${raid.name}`,
      actorPlayerId: p.id,
      raidsBefore: captureRaidsSnapshot(),
      affectedPlayers: [{ playerId: p.id, before, after: capturePlayerSnapshot(p) }]
    });
  });

  raid.completedAt = Date.now();
  raid.defeated = true;

  createConfetti();
  showToast(`🏆 Raid "${raid.name}" terminé !`, 'success');
  saveState();
  renderAll();
  closeRaidBattle();
         }
function raidHealTeam(raidId) {
  const raid = GameState.raids.find(r => String(r.id) === String(raidId));
  if (!raid) return;
  raid.currentHp = Math.min(raid.maxHp, raid.currentHp + 25);
  showToast('Le raid se stabilise.', 'success');
  saveState();
  renderAll();
}

function closeRaidBattle() {
  $('raidBattleModal')?.classList.remove('show');
}

function deleteRaid(raidId) {
  if (!confirm('Supprimer ce raid ?')) return;
  GameState.raids = (GameState.raids || []).filter(r => String(r.id) !== String(raidId));
  saveState();
  renderAll();
}

// ==================== 11. SOCIAL, AUTH, MESSAGES TEMPS RÉEL ====================

const SocialState = {
  auth: null,
  currentUser: null,
  users: [],
  currentDMUid: null,
  globalMessages: [],
  privateMessages: [],
  unsubUsers: null,
  unsubGlobal: null,
  unsubDM: null
};

async function initFirebaseSocial() {
  if (!window.firebaseApp || !window.db) {
    showToast('Firebase non détecté. Le social restera local.', 'warning');
    return;
  }

  const authMod = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
  const fsMod = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

  SocialState.auth = authMod.getAuth(window.firebaseApp);
  SocialState.fs = fsMod;
  SocialState.db = window.db;

  authMod.onAuthStateChanged(SocialState.auth, async (user) => {
    SocialState.currentUser = user || null;
    renderAuthState();
    if (user) {
      await ensureUserProfile(user);
      await subscribeUsers();
      await subscribeGlobalMessages();
      showToast(`Connecté: ${user.displayName || user.email}`, 'success');
    } else {
      unsubscribeSocial();
      renderAuthState();
    }
  });

  bindAuthUI();
  bindChatUI();
}

async function ensureUserProfile(user) {
  const { doc, setDoc, serverTimestamp } = SocialState.fs;
  await setDoc(doc(SocialState.db, 'users', user.uid), {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Joueur',
    email: user.email || null,
    updatedAt: Date.now(),
    lastSeen: serverTimestamp()
  }, { merge: true });
}

function bindAuthUI() {
  $('btnLogin')?.addEventListener('click', loginFromForm);
  $('btnRegister')?.addEventListener('click', registerFromForm);
  $('logoutBtn')?.addEventListener('click', logoutFromSocial);

  ['authEmail', 'authPassword', 'authDisplayName'].forEach(id => {
    $(id)?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loginFromForm();
    });
  });
}

function bindChatUI() {
  $('globalChatSend')?.addEventListener('click', () => sendGlobalMessage());
  $('privateChatSend')?.addEventListener('click', () => sendPrivateMessage());
  $('clearActionLogsBtn')?.addEventListener('click', () => {
    GameState.logs = [];
    saveState();
    renderActionLogs();
  });

  $('globalChatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendGlobalMessage();
  });

  $('privateChatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendPrivateMessage();
  });
}

function renderAuthState() {
  const status = $('authStatus');
  const logoutBtn = $('logoutBtn');
  if (!status) return;

  if (SocialState.currentUser) {
    status.textContent = `Connecté: ${SocialState.currentUser.displayName || SocialState.currentUser.email}`;
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    status.textContent = 'Connexion requise';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

function getAuthValues() {
  return {
    email: $('authEmail')?.value?.trim() || '',
    password: $('authPassword')?.value || '',
    displayName: $('authDisplayName')?.value?.trim() || ''
  };
}

async function registerFromForm() {
  if (!SocialState.auth) return showToast('Firebase non disponible.', 'warning');
  const { email, password, displayName } = getAuthValues();
  if (!email || !password) return showToast('Email et mot de passe requis.', 'warning');

  const authMod = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
  const cred = await authMod.createUserWithEmailAndPassword(SocialState.auth, email, password);
  if (displayName) await authMod.updateProfile(cred.user, { displayName });
  await ensureUserProfile(cred.user);
}

async function loginFromForm() {
  if (!SocialState.auth) return showToast('Firebase non disponible.', 'warning');
  const { email, password } = getAuthValues();
  if (!email || !password) return showToast('Email et mot de passe requis.', 'warning');

  const authMod = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
  await authMod.signInWithEmailAndPassword(SocialState.auth, email, password);
}

async function logoutFromSocial() {
  if (!SocialState.auth) return;
  const authMod = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
  await authMod.signOut(SocialState.auth);
}

async function subscribeUsers() {
  if (!SocialState.db || !SocialState.fs) return;
  if (SocialState.unsubUsers) SocialState.unsubUsers();

  const { collection, query, orderBy, onSnapshot } = SocialState.fs;
  const q = query(collection(SocialState.db, 'users'), orderBy('displayName', 'asc'));

  SocialState.unsubUsers = onSnapshot(q, (snap) => {
    SocialState.users = snap.docs.map(d => d.data()).filter(Boolean);
    renderPrivateUsers();
  });
}

async function subscribeGlobalMessages() {
  if (!SocialState.db || !SocialState.fs) return;
  if (SocialState.unsubGlobal) SocialState.unsubGlobal();

  const { collection, query, where, orderBy, limit, onSnapshot } = SocialState.fs;
  const q = query(
    collection(SocialState.db, 'messages'),
    where('scope', '==', 'global'),
    orderBy('createdAt', 'asc'),
    limit(60)
  );

  SocialState.unsubGlobal = onSnapshot(q, (snap) => {
    SocialState.globalMessages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderGlobalMessages();
  });
}

async function subscribePrivateMessages(targetUid) {
  if (!SocialState.db || !SocialState.fs || !SocialState.currentUser || !targetUid) return;
  if (SocialState.unsubDM) SocialState.unsubDM();

  const convId = [SocialState.currentUser.uid, targetUid].sort().join('__');
  const { collection, query, where, orderBy, limit, onSnapshot } = SocialState.fs;
  const q = query(
    collection(SocialState.db, 'messages'),
    where('scope', '==', 'dm'),
    where('conversationId', '==', convId),
    orderBy('createdAt', 'asc'),
    limit(80)
  );

  SocialState.currentDMUid = targetUid;
  renderDmTargetLabel();
  SocialState.unsubDM = onSnapshot(q, (snap) => {
    SocialState.privateMessages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderPrivateMessages();
  });
}

function unsubscribeSocial() {
  if (SocialState.unsubUsers) SocialState.unsubUsers();
  if (SocialState.unsubGlobal) SocialState.unsubGlobal();
  if (SocialState.unsubDM) SocialState.unsubDM();
  SocialState.unsubUsers = null;
  SocialState.unsubGlobal = null;
  SocialState.unsubDM = null;
  SocialState.users = [];
  SocialState.globalMessages = [];
  SocialState.privateMessages = [];
  SocialState.currentDMUid = null;
}

async function sendGlobalMessage() {
  const input = $('globalChatInput');
  const text = input?.value?.trim();
  if (!text) return;
  if (!SocialState.currentUser) return showToast('Connecte-toi pour parler au groupe.', 'warning');

  const { addDoc, collection, serverTimestamp } = SocialState.fs;
  await addDoc(collection(SocialState.db, 'messages'), {
    scope: 'global',
    conversationId: null,
    authorUid: SocialState.currentUser.uid,
    authorName: SocialState.currentUser.displayName || SocialState.currentUser.email,
    text,
    createdAt: Date.now(),
    createdAtServer: serverTimestamp()
  });

  input.value = '';
}

async function sendPrivateMessage() {
  const input = $('privateChatInput');
  const text = input?.value?.trim();
  if (!text) return;
  if (!SocialState.currentUser || !SocialState.currentDMUid) return showToast('Choisis un destinataire.', 'warning');

  const { addDoc, collection, serverTimestamp } = SocialState.fs;
  const convId = [SocialState.currentUser.uid, SocialState.currentDMUid].sort().join('__');

  await addDoc(collection(SocialState.db, 'messages'), {
    scope: 'dm',
    conversationId: convId,
    participants: [SocialState.currentUser.uid, SocialState.currentDMUid],
    authorUid: SocialState.currentUser.uid,
    authorName: SocialState.currentUser.displayName || SocialState.currentUser.email,
    text,
    createdAt: Date.now(),
    createdAtServer: serverTimestamp()
  });

  input.value = '';
}

function renderGlobalMessages() {
  const zone = $('globalChatMessages');
  if (!zone) return;

  if (!SocialState.globalMessages.length) {
    zone.innerHTML = `<div class="mini-card">Aucun message de groupe.</div>`;
    return;
  }

  zone.innerHTML = SocialState.globalMessages.map(msg => `
    <div class="chat-message ${msg.authorUid === SocialState.currentUser?.uid ? 'me' : ''}">
      <div class="chat-meta">${escapeHtml(msg.authorName || 'Joueur')} • ${new Date(msg.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      <div>${escapeHtml(msg.text || '')}</div>
    </div>
  `).join('');
}

function renderPrivateMessages() {
  const zone = $('privateChatMessages');
  if (!zone) return;

  if (!SocialState.privateMessages.length) {
    zone.innerHTML = `<div class="mini-card">Aucun message privé.</div>`;
    return;
  }

  zone.innerHTML = SocialState.privateMessages.map(msg => `
    <div class="chat-message ${msg.authorUid === SocialState.currentUser?.uid ? 'me' : ''}">
      <div class="chat-meta">${escapeHtml(msg.authorName || 'Joueur')} • ${new Date(msg.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
      <div>${escapeHtml(msg.text || '')}</div>
    </div>
  `).join('');
}

function renderPrivateUsers() {
  const zone = $('dmUserList');
  if (!zone) return;

  const users = (SocialState.users || []).filter(u => u.uid && u.uid !== SocialState.currentUser?.uid);
  if (!users.length) {
    zone.innerHTML = `<div class="mini-card">Aucun autre utilisateur.</div>`;
    return;
  }

  zone.innerHTML = users.map(u => `
    <button class="chat-user ${SocialState.currentDMUid === u.uid ? 'active' : ''}" data-dm-uid="${escapeHtml(u.uid)}">
      <span>${escapeHtml(u.displayName || u.email || 'Joueur')}</span>
      <span class="badge-soft">DM</span>
    </button>
  `).join('');

  zone.querySelectorAll('[data-dm-uid]').forEach(btn => {
    btn.addEventListener('click', () => {
      subscribePrivateMessages(btn.dataset.dmUid);
    });
  });

  renderDmTargetLabel();
     }
function renderDmTargetLabel() {
  const label = $('dmTargetLabel');
  if (!label) return;

  const user = (SocialState.users || []).find(u => u.uid === SocialState.currentDMUid);
  label.textContent = user ? `DM avec ${user.displayName || user.email}` : 'Aucun destinataire';
}

// ==================== 12. CLASSEMENT, CALENDRIER, RÉACTIONS VISUELLES ====================

function renderLeaderboard() {
  const zone = $('leaderboardList');
  if (!zone) return;

  const players = getPlayers().slice().sort((a, b) => (b.level - a.level) || (b.gold - a.gold) || (b.xp - a.xp));
  if (!players.length) {
    zone.innerHTML = `<div class="mini-card">Aucun joueur.</div>`;
    return;
  }

  zone.innerHTML = players.slice(0, 10).map((p, idx) => `
    <div class="mini-card" style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
      <div>
        <strong>${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`} ${escapeHtml(p.name)}</strong>
        <div style="color:#64748b;">${GAME_CONFIG.classesInfo[p.class].name}</div>
      </div>
      <div style="text-align:right;">
        <div><strong>Niv. ${p.level}</strong></div>
        <div>${p.gold} Or</div>
      </div>
    </div>
  `).join('');
}

function renderCalendar() {
  const view = $('calendarView');
  const label = $('calendarMonth');
  if (!view || !label) return;

  if (!GameState.currentCalendarDate) GameState.currentCalendarDate = new Date();

  const year = GameState.currentCalendarDate.getFullYear();
  const month = GameState.currentCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const start = new Date(firstDay);
  start.setDate(start.getDate() - ((firstDay.getDay() + 6) % 7));

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  label.textContent = `${monthNames[month]} ${year}`;

  view.innerHTML = '';
  ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(d => {
    const head = document.createElement('div');
    head.style.fontWeight = '800';
    head.style.textAlign = 'center';
    head.style.padding = '8px';
    head.textContent = d;
    view.appendChild(head);
  });

  const current = new Date(start);
  const today = new Date();

  while (current <= lastDay || ((current.getDay() + 6) % 7) !== 0) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    if (current.getMonth() !== month) cell.classList.add('other-month');

    const hasEvent = [
      ...GAME_CONFIG.internationalHolidays,
      ...GAME_CONFIG.madagascarHolidays,
      ...GAME_CONFIG.japanHolidays
    ].some(e => matchesHoliday(e, current));

    if (current.toDateString() === today.toDateString()) cell.classList.add('today');
    else if (hasEvent) cell.classList.add('event');

    cell.innerHTML = `
      <div class="calendar-day-number">${current.getDate()}</div>
      ${hasEvent ? '<div class="calendar-day-quests">✨</div>' : ''}
    `;

    view.appendChild(cell);
    current.setDate(current.getDate() + 1);
  }
}

function prevMonth() {
  GameState.currentCalendarDate = new Date(GameState.currentCalendarDate.getFullYear(), GameState.currentCalendarDate.getMonth() - 1, 1);
  renderCalendar();
}

function nextMonth() {
  GameState.currentCalendarDate = new Date(GameState.currentCalendarDate.getFullYear(), GameState.currentCalendarDate.getMonth() + 1, 1);
  renderCalendar();
}
// ==================== 13. RENDU GLOBAL, NAVIGATION, INIT ====================

function renderQuests() {
  const zone = $('questsList');
  if (!zone) return;

  const filter = GameState.questFilter || 'all';
  const quests = (GameState.quests || []).filter(q => filter === 'all' ? true : q.type === filter);

  if (!quests.length) {
    zone.innerHTML = `<div class="mini-card" style="grid-column:1/-1;text-align:center;">Aucune quête disponible.</div>`;
    return;
  }

  zone.innerHTML = quests.map(buildQuestCardHtml).join('');
  zone.querySelectorAll('.btn-complete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.quest-card');
      if (!card) return;
      questActionHandler(card.dataset.questId, e);
    });
  });
}

function renderHero() {
  const heroBox = document.querySelector('.hero-panel');
  if (!heroBox) return;

  const p = getActivePlayer();
  if (!p) return;

  const req = getRequiredXP(p.level);
  const pct = clamp(Math.floor((p.xp / req) * 100), 0, 100);
  const season = getCurrentSeason();

  const heroMain = heroBox.querySelector('.hero-main');
  if (heroMain) {
    heroMain.innerHTML = `
      <div class="hero-badge glow-effect">${season.emoji} Saison ${season.name}</div>
      <h1>${escapeHtml(p.name)}</h1>
      <p class="hero-subtitle">${getPlayerTitleFromStats(p)} • Classe: <strong>${GAME_CONFIG.classesInfo[p.class]?.name || 'Guerrier'}</strong></p>
    `;
  }

  let heroStats = heroBox.querySelector('.hero-stats-summary');
  if (!heroStats) {
    heroStats = document.createElement('div');
    heroStats.className = 'hero-stats-summary';
    heroBox.appendChild(heroStats);
  }

  heroStats.innerHTML = `
    <div style="margin-bottom:10px;font-weight:800;">Niveau ${p.level} • <span style="color:#ffd700;">💰 ${p.gold} Or</span></div>
    <div class="xp-bar-container" style="background:rgba(255,255,255,.16); border-radius:999px; overflow:hidden;">
      <div class="xp-bar-fill" style="width:${pct}%; height:16px; background:linear-gradient(90deg,#667eea,#764ba2);"></div>
    </div>
    <div style="font-size:.85rem;color:rgba(255,255,255,.82);margin-top:5px;text-align:right;">${p.xp} / ${req} XP (${pct}%)</div>
  `;
}

function renderAll() {
  normalizePlayerState();
  renderHero();
  renderQuests();
  renderPlayers();
  renderRaids();
  renderActionLogs();
  renderLeaderboard();
  renderCalendar();
  renderAuthState();
  renderGlobalMessages();
  renderPrivateMessages();
  renderPrivateUsers();
  saveState();
}

function bindNavigation() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      const target = e.currentTarget;
      target.classList.add('active');
      const tabId = `${target.dataset.tab}-tab`;
      $(tabId)?.classList.add('active');
      GameState.activeTab = target.dataset.tab;
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      GameState.questFilter = e.currentTarget.dataset.filter || 'all';
      renderQuests();
    });
  });

  $('questsList')?.addEventListener('dblclick', (e) => {
    const card = e.target.closest('.quest-card');
    if (!card) return;
    const quest = GameState.quests.find(q => q.id === card.dataset.questId);
    if (quest) showToast(`🎯 ${quest.title}`, 'info');
  });
}

function resetAllData() {
  if (!confirm('⚠️ Tout effacer ?')) return;
 

function captureQuestSnapshot(questId) {
  const quest = GameState.quests.find(q => q.id === questId);
  return quest ? deepClone(quest) : null;
}

function restoreQuestSnapshot(questId, snapshot) {
  if (!snapshot) return;
  const idx = GameState.quests.findIndex(q => q.id === questId);
  if (idx !== -1) {
    GameState.quests[idx] = deepClone(snapshot);
  } else {
    GameState.quests.push(deepClone(snapshot));
  }
}

function captureRaidsSnapshot() {
  return deepClone(GameState.raids || []);
}

localStorage.removeItem(STORAGE_KEY);
  GameState.player = createDefaultPlayer();
  GameState.players = [GameState.player];
  GameState.quests = [];
  GameState.raids = createDefaultRaids();
  GameState.logs = [];
  GameState.chatMessages = [];
  GameState.activeTab = 'quests';
  GameState.questFilter = 'all';
  loadState();
  renderAll();
  showToast('Données réinitialisées.', 'info');
}

function toggleSound() {
  const btn = $('soundToggle');
  if (btn) btn.textContent = btn.textContent === '🔊' ? '🔇' : '🔊';
  showToast('Bascule du son effectuée.', 'info');
}

async function initApp() {
  loadState();
  normalizePlayerState();

  if (!GameState.quests || !GameState.quests.length) {
    generateDailyQuests();
  }

  if (!GameState.raids || !GameState.raids.length) {
    GameState.raids = createDefaultRaids();
  }

  if (!GameState.logs) GameState.logs = [];
  if (!GameState.currentCalendarDate) GameState.currentCalendarDate = new Date();

  bindNavigation();

  $('soundToggle')?.addEventListener('click', toggleSound);
  $('logoutBtn')?.addEventListener('click', logoutFromSocial);
  $('clearActionLogsBtn')?.addEventListener('click', () => {
    if (!confirm('Vider le journal d’actions ?')) return;
    GameState.logs = [];
    saveState();
    renderActionLogs();
  });

  document.addEventListener('pointerdown', () => {
    const bgm = $('bgm');
    if (bgm) bgm.play().catch(() => {});
  }, { once: true });

  try {
    await initFirebaseSocial();
  } catch (err) {
    console.warn(err);
  }

  renderAll();
  setInterval(() => {
    const today = dateKey();
    if (GameState.lastQuestDate !== today) {
      GameState.lastQuestDate = today;
      generateDailyQuests();
      saveState();
      renderAll();
    }
  }, 60000);
}

document.addEventListener('DOMContentLoaded', initApp);
// ==================== 14. EXPOSITION GLOBALE ====================

window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.addPlayer = addPlayer;
window.deletePlayer = deletePlayer;
window.openPlayerDetailsModal = openPlayerDetailsModal;
window.closePlayerDetailsModal = closePlayerDetailsModal;
window.openCreateRaidModal = openCreateRaidModal;
window.closeCreateRaidModal = closeCreateRaidModal;
window.createRaid = createRaid;
window.startRaidBattle = startRaidBattle;
window.closeRaidBattle = closeRaidBattle;
window.deleteRaid = deleteRaid;
window.toggleSound = toggleSound;
window.resetAllData = resetAllData;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.setActivePlayer = setActivePlayer;
window.validateQuestForPlayer = validateQuestForPlayer;
window.undoAction = undoAction;
window.undoLatestActionForPlayer = undoLatestActionForPlayer;
window.completeQuest = questActionHandler;
window.subscribePrivateMessages = subscribePrivateMessages;
window.sendGlobalMessage = sendGlobalMessage;
window.sendPrivateMessage = sendPrivateMessage;
window.logoutFromSocial = logoutFromSocial;
window.loginFromForm = loginFromForm;
window.registerFromForm = registerFromForm;
