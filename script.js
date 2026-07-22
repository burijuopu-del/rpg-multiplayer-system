/* ============================================================================
   🎮 RPG QUEST MASTER - SCRIPT OPTIMISÉ & FONCTIONNEL
   ============================================================================ */

'use strict';

// ===== CONFIGURATION =====
const STORAGE_KEY = 'rpg_data_v4';
const UNDO_WINDOW = 10 * 60 * 1000; // 10 minutes

const GAME_CONFIG = {
    leveling: { baseXP: 100, growth: 1.2 },
    questRarities: {
        E: { name: 'E - Très facile', xp: 5, gold: 10, icon: '⚪' },
        D: { name: 'D - Facile', xp: 10, gold: 20, icon: '🟢' },
        C: { name: 'C - Simple', xp: 20, gold: 40, icon: '🔵' },
        B: { name: 'B - Moyen', xp: 30, gold: 60, icon: '🟣' },
        A: { name: 'A - Difficile', xp: 40, gold: 90, icon: '🟠' },
        S: { name: 'S - Hebdomadaire', xp: 80, gold: 150, icon: '🔴' },
        SS: { name: 'SS - Mensuelle', xp: 150, gold: 300, icon: '🔮' },
        SSS: { name: 'SSS - Annuelle', xp: 300, gold: 500, icon: '👑' }
    },
    classes: {
        warrior: { emoji: '⚔️', name: 'Guerrier' },
        mage: { emoji: '🔮', name: 'Mage' },
        archer: { emoji: '🏹', name: 'Archer' },
        paladin: { emoji: '✨', name: 'Paladin' }
    }
};

const QUEST_POOLS = {
    daily_titles: [
        'Faire 30 minutes de sport',
        'Lire 20 pages',
        'Apprendre une nouvelle compétence',
        'Aider quelqu\'un',
        'Méditer 10 minutes',
        'Écrire 500 mots',
        'Faire une bonne action',
        'Étudier 1 heure'
    ],
    special_dates: [
        { date: '01-01', name: 'Nouvel An', emoji: '🎆' },
        { date: '03-08', name: 'Journée des Femmes', emoji: '👩' },
        { date: '06-21', name: 'Fête de la Musique', emoji: '🎵' },
        { date: '06-26', name: 'Indépendance Madagascar', emoji: '🇲🇬' },
        { date: '08-13', name: 'Obon (Japon)', emoji: '🏯' },
        { date: '10-31', name: 'Halloween', emoji: '👻' },
        { date: '12-25', name: 'Noël', emoji: '🎄' }
    ]
};

// ===== ÉTAT DU JEU =====
const GameState = {
    players: [],
    quests: [],
    raids: [],
    logs: [],
    chatMessages: [],
    isAdmin: false
};

// ===== UTILITAIRES =====
const $ = id => document.getElementById(id);
const uid = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function dateKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:10px;color:white;font-weight:bold;z-index:9999;${type === 'success' ? 'background:#22c55e' : type === 'error' ? 'background:#ef4444' : 'background:#667eea'}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

function confetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#22c55e', '#ffd700'];
    for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        el.style.cssText = `position:fixed;left:${Math.random()*100}%;top:-10px;width:8px;height:8px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:50%;pointer-events:none;animation:confetti-fall ${1+Math.random()*1}s ease-out forwards`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
    }
}

if (!document.querySelector('style[data-confetti]')) {
    const style = document.createElement('style');
    style.setAttribute('data-confetti', 'true');
    style.textContent = '@keyframes confetti-fall { to { transform: translate(0, 100vh) rotate(360deg); opacity: 0; } }';
    document.head.appendChild(style);
}

// ===== SAVE/LOAD =====
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(GameState));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        Object.assign(GameState, JSON.parse(saved));
    } else {
        GameState.players = [createPlayer('Chasseur S-Rank', 'warrior')];
        generateDailyQuests();
    }
}

// ===== JOUEURS =====
function createPlayer(name = 'Joueur', pClass = 'warrior') {
    const baseXP = GAME_CONFIG.leveling.baseXP;
    return {
        id: uid(),
        name,
        class: pClass,
        level: 1,
        xp: 0,
        xpNeeded: baseXP,
        gold: 50,
        completedQuests: [],
        createdAt: Date.now()
    };
}

function addPlayer() {
    const name = $('playerName')?.value?.trim();
    const pClass = $('playerClass')?.value || 'warrior';
    
    if (!name) {
        toast('Entrez un nom', 'error');
        return;
    }
    
    GameState.players.push(createPlayer(name, pClass));
    saveState();
    renderAll();
    closeAddPlayerModal();
    toast(`✨ ${name} arrive !`, 'success');
}

function deletePlayer(id) {
    if (confirm('Supprimer ce joueur ?')) {
        GameState.players = GameState.players.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

// ===== QUÊTES =====
function generateDailyQuests() {
    const today = dateKey();
    GameState.quests = GameState.quests.filter(q => q.completed || q.createdDate !== today);
    
    // Quêtes quotidiennes
    ['E', 'D', 'C', 'B', 'A'].forEach(rarity => {
        for (let i = 0; i < (5 - ['E','D','C','B','A'].indexOf(rarity)); i++) {
            const pool = QUEST_POOLS.daily_titles;
            const title = pool[Math.floor(Math.random() * pool.length)];
            GameState.quests.push({
                id: uid(),
                title,
                rarity,
                type: 'daily',
                xp: GAME_CONFIG.questRarities[rarity].xp,
                gold: GAME_CONFIG.questRarities[rarity].gold,
                completed: false,
                createdDate: today
            });
        }
    });
    
    // Quêtes spéciales (fêtes)
    const today_mmdd = today.slice(5);
    QUEST_POOLS.special_dates.forEach(special => {
        if (special.date === today_mmdd) {
            GameState.quests.push({
                id: uid(),
                title: `${special.emoji} ${special.name} - Mission Spéciale`,
                rarity: 'S',
                type: 'special',
                xp: 120,
                gold: 200,
                completed: false,
                createdDate: today
            });
        }
    });
}

function completeQuest(questId, playerId) {
    const quest = GameState.quests.find(q => q.id === questId);
    const player = GameState.players.find(p => p.id === playerId);
    
    if (!quest || !player || quest.completed) return;
    
    quest.completed = true;
    player.xp += quest.xp;
    player.gold += quest.gold;
    player.completedQuests.push(questId);
    
    // Vérifier montée de niveau
    while (player.xp >= player.xpNeeded) {
        player.xp -= player.xpNeeded;
        player.level += 1;
        player.xpNeeded = Math.floor(GAME_CONFIG.leveling.baseXP * Math.pow(GAME_CONFIG.leveling.growth, player.level - 1));
        toast(`🎉 ${player.name} passe niveau ${player.level} !`, 'success');
        confetti();
    }
    
    addLog(`${player.name} complète "${quest.title}" (+${quest.xp} XP)`, questId);
    saveState();
    renderAll();
    toast(`+${quest.xp} XP pour ${player.name}`, 'success');
}

// ===== LOGS & UNDO =====
function addLog(text, questId = null) {
    GameState.logs.unshift({
        id: uid(),
        text,
        questId,
        timestamp: Date.now()
    });
    if (GameState.logs.length > 50) GameState.logs.pop();
}

function undoLog(logId) {
    const log = GameState.logs.find(l => l.id === logId);
    if (!log) return;
    
    const age = Date.now() - log.timestamp;
    if (age > UNDO_WINDOW) {
        toast('Délai d\'annulation dépassé', 'error');
        return;
    }
    
    // Trouver la quête et le joueur et annuler
    const quest = GameState.quests.find(q => q.id === log.questId);
    if (quest) quest.completed = false;
    
    GameState.logs = GameState.logs.filter(l => l.id !== logId);
    saveState();
    renderAll();
    toast('Action annulée', 'success');
}

// ===== RAIDS =====
function createRaid() {
    const name = $('raidName')?.value?.trim();
    const difficulty = parseInt($('raidDifficulty')?.value || '5');
    
    if (!name) {
        toast('Nom du raid requis', 'error');
        return;
    }
    
    const selectedPlayers = Array.from(document.querySelectorAll('#raidPlayersList input:checked'))
        .map(cb => cb.value);
    
    if (selectedPlayers.length < 2) {
        toast('Minimum 2 joueurs', 'error');
        return;
    }
    
    GameState.raids.push({
        id: uid(),
        name,
        difficulty,
        maxHp: 100 + difficulty * 150,
        currentHp: 100 + difficulty * 150,
        members: selectedPlayers,
        rewards: { xp: difficulty * 80, gold: difficulty * 60 },
        completed: false
    });
    
    saveState();
    renderAll();
    closeCreateRaidModal();
    toast('Raid créé !', 'success');
}

function completeRaid(raidId) {
    const raid = GameState.raids.find(r => r.id === raidId);
    if (!raid) return;
    
    raid.members.forEach(playerId => {
        const player = GameState.players.find(p => p.id === playerId);
        if (player) {
            player.xp += raid.rewards.xp;
            player.gold += raid.rewards.gold;
        }
    });
    
    raid.completed = true;
    saveState();
    renderAll();
    toast('🏆 Raid vaincu !', 'success');
    confetti();
}

// ===== CHAT =====
function sendChatMessage() {
    const input = $('chatInput');
    const msg = input?.value?.trim();
    if (!msg) return;
    
    GameState.chatMessages.push({
        id: uid(),
        text: msg,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });
    
    if (GameState.chatMessages.length > 100) GameState.chatMessages.shift();
    input.value = '';
    saveState();
    renderChatMessages();
}

// ===== RENDU =====
function renderHero() {
    const player = GameState.players[0];
    if (!player) return;
    
    const pct = Math.min(100, Math.floor((player.xp / player.xpNeeded) * 100));
    const heroPanel = $('heroPanel');
    
    heroPanel.innerHTML = `
        <h1>${escapeHtml(player.name)}</h1>
        <p>${GAME_CONFIG.classes[player.class].emoji} ${GAME_CONFIG.classes[player.class].name} • Niveau ${player.level}</p>
        <p>💰 ${player.gold} Or</p>
        <div class="xp-bar-container">
            <div class="xp-bar-fill" style="width:${pct}%"></div>
        </div>
        <p>${player.xp} / ${player.xpNeeded} XP</p>
    `;
}

function renderQuests() {
    const container = $('questsContainer');
    const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    let quests = GameState.quests;
    if (filter === 'daily') quests = quests.filter(q => q.type === 'daily');
    if (filter === 'special') quests = quests.filter(q => q.type === 'special');
    
    if (!quests.length) {
        container.innerHTML = '<div class="mini-card" style="grid-column:1/-1;">Aucune quête</div>';
        return;
    }
    
    container.innerHTML = quests.map(q => {
        const rarityInfo = GAME_CONFIG.questRarities[q.rarity];
        return `
            <div class="quest-card rarity-${q.rarity.toLowerCase()} ${q.completed ? 'completed' : ''}">
                <div>
                    <div class="quest-header">
                        <div class="quest-title">${escapeHtml(q.title)}</div>
                        <span class="quest-rarity">${rarityInfo.icon} ${q.rarity}</span>
                    </div>
                    <div class="quest-rewards">
                        <span class="quest-xp">⭐ +${q.xp} XP</span>
                        <span class="quest-gold">💰 +${q.gold}</span>
                    </div>
                </div>
                <button class="btn-complete ${q.completed ? 'disabled' : ''}" 
                    onclick="openQuestPicker('${q.id}')" 
                    ${q.completed ? 'disabled' : ''}>
                    ${q.completed ? '✅ Complétée' : '▶️ Valider'}
                </button>
            </div>
        `;
    }).join('');
}

function openQuestPicker(questId) {
    const players = GameState.players;
    if (!players.length) {
        toast('Créez un joueur d\'abord', 'error');
        return;
    }
    
    const msg = players.map(p => `${GAME_CONFIG.classes[p.class].emoji} ${escapeHtml(p.name)}`).join(' | ');
    const choice = prompt(`Qui complète cette quête ?\n\n${msg}\n\nEntrez le nom exact :`);
    
    if (!choice) return;
    const player = players.find(p => p.name.toLowerCase() === choice.toLowerCase());
    
    if (!player) {
        toast('Joueur non trouvé', 'error');
        return;
    }
    
    completeQuest(questId, player.id);
}

function renderPlayers() {
    const container = $('playersContainer');
    
    if (!GameState.players.length) {
        container.innerHTML = '<div class="mini-card" style="grid-column:1/-1;">Aucun joueur</div>';
        return;
    }
    
    container.innerHTML = GameState.players.sort((a, b) => b.level - a.level).map(p => {
        const xpPct = Math.min(100, Math.floor((p.xp / p.xpNeeded) * 100));
        return `
            <div class="player-card" onclick="showPlayerDetails('${p.id}')">
                <div class="player-header">
                    <div class="player-avatar">${GAME_CONFIG.classes[p.class].emoji}</div>
                    <div class="player-info">
                        <h3>${escapeHtml(p.name)}</h3>
                        <p class="player-class">${GAME_CONFIG.classes[p.class].name}</p>
                    </div>
                </div>
                <div class="player-stats">
                    <div class="stat-item">
                        <span class="stat-label">Niveau</span>
                        <span class="stat-value">${p.level}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Quêtes</span>
                        <span class="stat-value">${p.completedQuests.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Or</span>
                        <span class="stat-value">💰 ${p.gold}</span>
                    </div>
                </div>
                <div style="margin-top:10px;">
                    <div class="xp-bar-container">
                        <div class="xp-bar-fill" style="width:${xpPct}%"></div>
                    </div>
                    <p style="font-size:0.8rem;color:#6b7280;margin-top:5px;">${p.xp} / ${p.xpNeeded} XP</p>
                </div>
            </div>
        `;
    }).join('');
}

function showPlayerDetails(playerId) {
    const player = GameState.players.find(p => p.id === playerId);
    if (!player) return;
    
    const content = $('playerModalContent');
    content.innerHTML = `
        <h2>${GAME_CONFIG.classes[player.class].emoji} ${escapeHtml(player.name)}</h2>
        <p style="color:#6b7280;margin-bottom:20px;">${GAME_CONFIG.classes[player.class].name}</p>
        
        <div style="background:rgba(102,126,234,0.05);padding:15px;border-radius:10px;margin-bottom:20px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                <div>
                    <p style="color:#6b7280;font-size:0.9rem;">Niveau</p>
                    <p style="font-size:1.5rem;font-weight:700;">${player.level}</p>
                </div>
                <div>
                    <p style="color:#6b7280;font-size:0.9rem;">Or</p>
                    <p style="font-size:1.5rem;font-weight:700;">💰 ${player.gold}</p>
                </div>
                <div>
                    <p style="color:#6b7280;font-size:0.9rem;">Quêtes Complétées</p>
                    <p style="font-size:1.5rem;font-weight:700;">${player.completedQuests.length}</p>
                </div>
                <div>
                    <p style="color:#6b7280;font-size:0.9rem;">Créé le</p>
                    <p style="font-size:0.9rem;">${new Date(player.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
        </div>
        
        <button class="btn-secondary" onclick="deletePlayer('${player.id}'); closePlayerModal();">🗑️ Supprimer</button>
    `;
    
    $('playerModal')?.classList.add('show');
}

function renderRaids() {
    const container = $('raidsContainer');
    
    if (!GameState.raids.length) {
        container.innerHTML = '<div class="mini-card" style="grid-column:1/-1;">Aucun raid</div>';
        return;
    }
    
    container.innerHTML = GameState.raids.map(r => {
        const hpPct = Math.max(0, Math.floor((r.currentHp / r.maxHp) * 100));
        return `
            <div class="raid-card">
                <h3>⚔️ ${escapeHtml(r.name)}</h3>
                <p>Difficulté: ${r.difficulty} étages</p>
                <div class="raid-hp-bar">
                    <div class="raid-hp-fill" style="width:${hpPct}%"></div>
                </div>
                <p>HP: ${r.currentHp} / ${r.maxHp}</p>
                <button class="btn-primary" onclick="damageRaid('${r.id}')" ${r.completed ? 'disabled' : ''}>⚔️ Attaquer</button>
                <button class="btn-secondary" onclick="deleteRaid('${r.id}')" style="margin-left:10px;">🗑️ Supprimer</button>
            </div>
        `;
    }).join('');
}

function damageRaid(raidId) {
    const raid = GameState.raids.find(r => r.id === raidId);
    if (!raid) return;
    
    raid.currentHp = Math.max(0, raid.currentHp - 50);
    
    if (raid.currentHp === 0) {
        completeRaid(raidId);
    } else {
        saveState();
        renderRaids();
    }
}

function deleteRaid(raidId) {
    GameState.raids = GameState.raids.filter(r => r.id !== raidId);
    saveState();
    renderRaids();
}

function renderChatMessages() {
    const container = $('chatMessages');
    if (!container) return;
    
    if (!GameState.chatMessages.length) {
        container.innerHTML = '<div style="color:#6b7280;">Aucun message</div>';
        return;
    }
    
    container.innerHTML = GameState.chatMessages.map(msg => `
        <div class="chat-message">
            <div class="chat-meta">${msg.timestamp}</div>
            <div>${escapeHtml(msg.text)}</div>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

function renderLogs() {
    const container = $('logsContainer');
    if (!container) return;
    
    if (!GameState.logs.length) {
        container.innerHTML = '<div class="mini-card">Aucune action</div>';
        return;
    }
    
    container.innerHTML = GameState.logs.slice(0, 20).map(log => {
        const age = Date.now() - log.timestamp;
        const canUndo = age <= UNDO_WINDOW;
        return `
            <div class="log-item">
                <span>${escapeHtml(log.text)}</span>
                ${canUndo ? `<button class="btn-secondary" onclick="undoLog('${log.id}')">↩ Annuler</button>` : ''}
            </div>
        `;
    }).join('');
}

function renderAdmin() {
    const container = $('adminContent');
    if (!container) return;
    
    const adminBtn = document.querySelector('.admin-btn');
    const isAdminEnabled = GameState.isAdmin;
    
    container.innerHTML = `
        <label style="display:flex;align-items:center;gap:10px;margin-bottom:20px;cursor:pointer;">
            <input type="checkbox" ${isAdminEnabled ? 'checked' : ''} onchange="toggleAdminMode()">
            <span>Activer mode Admin (localhost uniquement)</span>
        </label>
        
        ${isAdminEnabled ? `
            <h3>👥 Gérer les Joueurs</h3>
            <div style="display:grid;gap:10px;">
                ${GameState.players.map(p => `
                    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(102,126,234,0.05);padding:15px;border-radius:10px;">
                        <div>
                            <p style="font-weight:700;">${escapeHtml(p.name)}</p>
                            <p style="color:#6b7280;font-size:0.9rem;">Niv. ${p.level} | ${p.gold} Or</p>
                        </div>
                        <div style="display:flex;gap:10px;">
                            <button class="btn-secondary" onclick="adminAddXP('${p.id}')">+XP</button>
                            <button class="btn-secondary" onclick="adminAddGold('${p.id}')">+Or</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="color:#6b7280;">Mode Admin désactivé</p>'}
    `;
}

function toggleAdminMode() {
    if (!location.hostname.includes('localhost') && !location.hostname.includes('127.0.0.1')) {
        toast('Admin mode: localhost only', 'error');
        return;
    }
    GameState.isAdmin = !GameState.isAdmin;
    saveState();
    renderAdmin();
}

function adminAddXP(playerId) {
    const amount = prompt('XP à ajouter:');
    if (!amount) return;
    
    const player = GameState.players.find(p => p.id === playerId);
    if (player) {
        player.xp += parseInt(amount);
        saveState();
        renderAll();
    }
}

function adminAddGold(playerId) {
    const amount = prompt('Or à ajouter:');
    if (!amount) return;
    
    const player = GameState.players.find(p => p.id === playerId);
    if (player) {
        player.gold += parseInt(amount);
        saveState();
        renderAll();
    }
}

function renderAll() {
    renderHero();
    renderQuests();
    renderPlayers();
    renderRaids();
    renderChatMessages();
    renderLogs();
    renderAdmin();
}

// ===== NAVIGATION =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        e.target.classList.add('active');
        const tabId = `${e.target.dataset.tab}-tab`;
        $(tabId)?.classList.add('active');
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderQuests();
    });
});

// ===== MODAUX =====
function openAddPlayerModal() {
    $('addPlayerModal')?.classList.add('show');
}

function closeAddPlayerModal() {
    $('addPlayerModal')?.classList.remove('show');
}

function openCreateRaidModal() {
    const list = $('raidPlayersList');
    if (list) {
        list.innerHTML = GameState.players.map(p => `
            <div class="checkbox-item">
                <input type="checkbox" id="raid-${p.id}" value="${p.id}">
                <label for="raid-${p.id}">${GAME_CONFIG.classes[p.class].emoji} ${escapeHtml(p.name)}</label>
            </div>
        `).join('');
    }
    $('createRaidModal')?.classList.add('show');
}

function closeCreateRaidModal() {
    $('createRaidModal')?.classList.remove('show');
}

function closePlayerModal() {
    $('playerModal')?.classList.remove('show');
}

// Fermer modaux en cliquant dehors
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });
});

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Générer quêtes si c'est une nouvelle journée
    if (!localStorage.getItem('last_quest_date')) {
        generateDailyQuests();
        localStorage.setItem('last_quest_date', dateKey());
    }
    
    renderAll();
    
    // Chat input enter
    $('chatInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Check new day every minute
    setInterval(() => {
        const lastDate = localStorage.getItem('last_quest_date');
        const today = dateKey();
        if (lastDate !== today) {
            localStorage.setItem('last_quest_date', today);
            generateDailyQuests();
            saveState();
            renderAll();
            toast('📅 Nouvelles quêtes disponibles !', 'info');
        }
    }, 60000);
});

// Exposition globale
window.addPlayer = addPlayer;
window.deletePlayer = deletePlayer;
window.completeQuest = completeQuest;
window.createRaid = createRaid;
window.damageRaid = damageRaid;
window.deleteRaid = deleteRaid;
window.sendChatMessage = sendChatMessage;
window.undoLog = undoLog;
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.openCreateRaidModal = openCreateRaidModal;
window.closeCreateRaidModal = closeCreateRaidModal;
window.closePlayerModal = closePlayerModal;
window.showPlayerDetails = showPlayerDetails;
window.openQuestPicker = openQuestPicker;
window.toggleAdminMode = toggleAdminMode;
window.adminAddXP = adminAddXP;
window.adminAddGold = adminAddGold;