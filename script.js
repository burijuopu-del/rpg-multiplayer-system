'use strict';

const STORAGE_KEY = 'rpg_v5';
const UNDO_WINDOW = 10 * 60 * 1000;
const ADMIN_CODE = 'Oresama';

const CLASSES = {
    warrior: { emoji: '⚔️', name: 'Guerrier', color: '#ff6b9d' },
    mage: { emoji: '🔮', name: 'Mage', color: '#a855f7' },
    archer: { emoji: '🏹', name: 'Archer', color: '#22c55e' },
    paladin: { emoji: '✨', name: 'Paladin', color: '#fbbf24' }
};

const SEASONS = {
    summer: { name: 'Été Flamboyant', emoji: '☀️', months: [12, 1, 2] },
    autumn: { name: 'Automne Mystique', emoji: '🍂', months: [3, 4, 5] },
    winter: { name: 'Hiver Glacial', emoji: '❄️', months: [6, 7, 8] },
    spring: { name: 'Printemps Éthéré', emoji: '🌸', months: [9, 10, 11] }
};

const QUEST_BANKS = {
    E: [
        'Boire 2 verres d\'eau',
        'Marcher 500 pas',
        'Faire son lit',
        'Éteindre l\'écran 10min',
        'Lire 1 page',
        'Ranger 1 objet',
        'Respirer 2 minutes',
        'Faire 1 compliment',
        'Noter 1 chose positive',
        'Laver une tasse',
        'Se tenir droit 1 minute',
        'Faire 5 étirements',
        'Regarder par la fenêtre 2 min',
        'Écouter 1 musique attentivement',
        'Manger sans écran'
    ],
    D: [
        'Marcher 10 minutes',
        'Lire 5 pages',
        'Faire 10 squats',
        'Ranger son bureau 5 min',
        'Pause sans téléphone 20 min',
        'Boire 1 litre d\'eau',
        'Apprendre 3 mots',
        'Méditation guidée',
        'Écrire 3 lignes journal',
        'Appeler un proche',
        'Faire une vraie collation saine',
        'Écouter podcast 10 min',
        'Faire 1 mini tâche repoussée',
        'Éviter téléphone pendant repas'
    ],
    C: [
        'Lire 15 minutes',
        'Marcher 20 minutes',
        'Faire 15 squats + 10 pompes',
        'Sans réseaux sociaux 1h',
        'Cuisiner petit repas',
        'Écrire 1 page journal',
        'Nettoyer sa chambre',
        'Faire 10 min de sport',
        'Apprendre 5 mots nouveaux',
        'Regarder tutoriel utile',
        'Stretching complet',
        'Réaliser tâche importante',
        '30 min sur une passion',
        'Éviter achats impulsifs 24h'
    ],
    B: [
        'Lire 30 minutes',
        'Faire 30 min de sport',
        'Focus 45 minutes',
        'Sans téléphone 2 heures',
        'Cuisiner repas élaboré',
        'Apprendre compétence 1h',
        'Vraie sortie sociale',
        'Aide utile sans demande',
        'Réorganiser une pièce',
        'Session création artistique',
        'Budget ou suivi finances',
        'Résoudre gros problème',
        'Repas équilibré toute journée',
        'Vraie conversation de qualité'
    ],
    A: [
        'Journée sans réseaux',
        'Terminer gros projet',
        '1h sport intense',
        'Cuisiner plat complexe',
        'Lire dense + résumé',
        '3h focus sans distraction',
        'Journée productive complète',
        'Sortie volontaire',
        'Contrôle émotionnel maîtrisé',
        '4h sans téléphone',
        'Projet artistique avancé',
        'Apprendre compétence utile',
        'Audit finances personnelles'
    ],
    S: [
        'Lire 1 livre complet',
        'Faire 3 séances de sport',
        '5h sans réseaux sociaux',
        'Cuisiner 3 repas maison',
        '2 vraies interactions sociales',
        'Tri complet de ses affaires',
        'Finir compétence débutant',
        'Journal tous les jours 7j',
        'Gros nettoyage espace',
        'Terminer tâche longue',
        'Semaine propre au sommeil',
        'Réduire temps écran'
    ],
    SS: [
        'Lire 1 livre complet',
        'Faire 12 séances sport',
        '4 semaines épargne suivi',
        'Cuisiner 12 repas maison',
        'Construire compétence utile',
        'Réduire temps écran durable',
        'Développer sommeil stable',
        'Finaliser projet créatif',
        'Plusieurs sorties qualité',
        'Terminer gros objectif',
        'Mois sans achat impulsif',
        'Améliorer aspect santé'
    ],
    SSS: [
        'Lire 12 livres',
        'Construire discipline toute année',
        'Atteindre objectif santé',
        'Économiser somme importante',
        'Développer compétence majeure',
        'Créer projet long terme',
        'Améliorer vie sociale',
        'Maîtriser impulsions',
        'Tenir journal 1 an',
        'Changement durable téléphone',
        'Devenir constant sport',
        'Terminer grand projet créatif'
    ]
};

const GameState = {
    players: [],
    quests: [],
    raids: [],
    logs: [],
    chats: [],
    isAdmin: false
};

const $ = id => document.getElementById(id);
const uid = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function dateKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCurrentSeason() {
    const m = new Date().getMonth() + 1;
    for (let s of Object.values(SEASONS)) {
        if (s.months.includes(m)) return s;
    }
    return SEASONS.spring;
}

function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:10px;color:white;font-weight:bold;z-index:9999;${type === 'success' ? 'background:#22c55e' : type === 'error' ? 'background:#ef4444' : 'background:#667eea'};animation:fadeOut 2.5s forwards`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

if (!document.querySelector('style[data-toast]')) {
    const s = document.createElement('style');
    s.setAttribute('data-toast', '');
    s.textContent = '@keyframes fadeOut { 0% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }';
    document.head.appendChild(s);
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(GameState));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        Object.assign(GameState, JSON.parse(saved));
    } else {
        GameState.players = [createPlayer('Aventurier', 'warrior')];
        generateQuests();
    }
}

function createPlayer(name = 'Joueur', pClass = 'warrior') {
    return {
        id: uid(),
        name,
        class: pClass,
        level: 1,
        xp: 0,
        xpNeeded: 100,
        gold: 50,
        quests: 0,
        createdAt: Date.now()
    };
}

function addPlayer() {
    const name = $('playerName')?.value?.trim();
    const pClass = $('playerClass')?.value || 'warrior';
    if (!name) { toast('Nom requis', 'error'); return; }
    GameState.players.push(createPlayer(name, pClass));
    saveState();
    renderAll();
    closeAddPlayerModal();
    toast(`✨ ${name} arrive !`, 'success');
}

function deletePlayer(id) {
    if (confirm('Supprimer ?')) {
        GameState.players = GameState.players.filter(p => p.id !== id);
        saveState();
        renderAll();
    }
}

function generateQuests() {
    const today = dateKey();
    GameState.quests = GameState.quests.filter(q => q.completed);
    
    const rarities = ['E', 'E', 'E', 'E', 'E', 'D', 'D', 'D', 'C', 'C', 'B', 'A'];
    rarities.forEach(r => {
        const pool = QUEST_BANKS[r];
        const title = pool[Math.floor(Math.random() * pool.length)];
        GameState.quests.push({
            id: uid(),
            title,
            rarity: r,
            xp: { E: 5, D: 10, C: 20, B: 30, A: 40, S: 80, SS: 150, SSS: 300 }[r],
            gold: { E: 10, D: 20, C: 40, B: 60, A: 90, S: 150, SS: 300, SSS: 500 }[r],
            completed: false,
            createdAt: today
        });
    });
}

function adminGenerateExtraQuests(rarity = 'B') {
    if (!GameState.isAdmin) { toast('Accès refusé', 'error'); return; }
    
    const pool = QUEST_BANKS[rarity];
    if (!pool) { toast('Rareté invalide', 'error'); return; }
    
    const title = pool[Math.floor(Math.random() * pool.length)];
    GameState.quests.push({
        id: uid(),
        title,
        rarity: rarity,
        xp: { E: 5, D: 10, C: 20, B: 30, A: 40, S: 80, SS: 150, SSS: 300 }[rarity],
        gold: { E: 10, D: 20, C: 40, B: 60, A: 90, S: 150, SS: 300, SSS: 500 }[rarity],
        completed: false,
        createdAt: dateKey()
    });
    
    saveState();
    renderQuests();
    toast(`✨ Quête ${rarity} ajoutée !`, 'success');
}

function deleteChat(chatId) {
    if (!GameState.isAdmin) { toast('Accès refusé', 'error'); return; }
    GameState.chats = GameState.chats.filter(c => c.id !== chatId);
    saveState();
    renderChat();
    toast('Message supprimé', 'success');
}

function completeQuest(qid, pid) {
    const q = GameState.quests.find(x => x.id === qid);
    const p = GameState.players.find(x => x.id === pid);
    if (!q || !p || q.completed) return;
    
    q.completed = true;
    p.xp += q.xp;
    p.gold += q.gold;
    p.quests++;
    
    while (p.xp >= p.xpNeeded) {
        p.xp -= p.xpNeeded;
        p.level++;
        p.xpNeeded = Math.floor(100 * Math.pow(1.2, p.level - 1));
        toast(`🎉 ${p.name} niveau ${p.level} !`, 'success');
    }
    
    GameState.logs.unshift({
        id: uid(),
        text: `${p.name} complète "${q.title}" (+${q.xp} XP)`,
        questId: qid,
        timestamp: Date.now()
    });
    if (GameState.logs.length > 50) GameState.logs.pop();
    
    saveState();
    renderAll();
}

function createRaid() {
    const name = $('raidName')?.value?.trim();
    const diff = parseInt($('raidDifficulty')?.value) || 5;
    if (!name) { toast('Nom requis', 'error'); return; }
    
    const members = Array.from(document.querySelectorAll('#raidPlayersList input:checked')).map(x => x.value);
    if (members.length < 2) { toast('Min 2 joueurs', 'error'); return; }
    
    GameState.raids.push({
        id: uid(),
        name,
        hp: 100 + diff * 150,
        maxHp: 100 + diff * 150,
        members,
        rewards: { xp: diff * 80, gold: diff * 60 }
    });
    saveState();
    renderAll();
    closeCreateRaidModal();
    toast('Raid créé !', 'success');
}

function damageRaid(rid) {
    const r = GameState.raids.find(x => x.id === rid);
    if (!r) return;
    r.hp = Math.max(0, r.hp - 50);
    if (r.hp === 0) {
        r.members.forEach(pid => {
            const p = GameState.players.find(x => x.id === pid);
            if (p) { p.xp += r.rewards.xp; p.gold += r.rewards.gold; }
        });
        toast('🏆 Raid vaincu !', 'success');
    }
    saveState();
    renderAll();
}

function sendChat() {
    const msg = $('chatInput')?.value?.trim();
    if (!msg) return;
    GameState.chats.push({ id: uid(), text: msg, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) });
    if (GameState.chats.length > 100) GameState.chats.shift();
    $('chatInput').value = '';
    saveState();
    renderChat();
}

function renderHero() {
    const p = GameState.players[0];
    if (!p) return;
    const pct = Math.min(100, Math.floor((p.xp / p.xpNeeded) * 100));
    const season = getCurrentSeason();
    $('heroPanel').innerHTML = `
        <h1>${p.name}</h1>
        <p>${CLASSES[p.class].emoji} ${CLASSES[p.class].name} • Niv ${p.level}</p>
        <p>${season.emoji} ${season.name}</p>
        <p>💰 ${p.gold} Or</p>
        <div class="xp-bar-container"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
        <p>${p.xp} / ${p.xpNeeded} XP</p>
    `;
}

function renderQuests() {
    const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    let quests = GameState.quests;
    if (filter === 'easy') quests = quests.filter(q => ['E', 'D', 'C'].includes(q.rarity));
    if (filter === 'hard') quests = quests.filter(q => ['A', 'S', 'SS', 'SSS'].includes(q.rarity));
    
    if (!quests.length) { $('questsContainer').innerHTML = '<div class="mini-card" style="grid-column:1/-1;">Aucune</div>'; return; }
    
    $('questsContainer').innerHTML = quests.map(q => `
        <div class="quest-card rarity-${q.rarity.toLowerCase()}">
            <div>
                <div class="quest-header">
                    <div class="quest-title">${q.title}</div>
                    <span class="quest-rarity">${q.rarity}</span>
                </div>
                <div class="quest-rewards">
                    <span class="quest-xp">⭐ +${q.xp}</span>
                    <span class="quest-gold">💰 +${q.gold}</span>
                </div>
            </div>
            <button class="btn-complete" onclick="openQuestPicker('${q.id}')" ${q.completed ? 'disabled' : ''}>
                ${q.completed ? '✅ OK' : '▶️ Valider'}
            </button>
        </div>
    `).join('');
}

function openQuestPicker(qid) {
    const names = GameState.players.map(p => `${CLASSES[p.class].emoji} ${p.name}`).join(' | ');
    const choice = prompt(`Qui ?\n\n${names}\n\nNom exact :`);
    const p = GameState.players.find(x => x.name.toLowerCase() === choice?.toLowerCase());
    if (p) completeQuest(qid, p.id);
}

function renderPlayers() {
    if (!GameState.players.length) { $('playersContainer').innerHTML = '<div class="mini-card" style="grid-column:1/-1;">Aucun</div>'; return; }
    
    $('playersContainer').innerHTML = GameState.players.sort((a, b) => b.level - a.level).map(p => {
        const pct = Math.min(100, Math.floor((p.xp / p.xpNeeded) * 100));
        return `
            <div class="player-card">
                <div class="player-header">
                    <div class="player-avatar" style="background:${CLASSES[p.class].color};">${CLASSES[p.class].emoji}</div>
                    <div class="player-info">
                        <h3>${p.name}</h3>
                        <p class="player-class">${CLASSES[p.class].name}</p>
                    </div>
                </div>
                <div class="player-stats">
                    <div class="stat-item"><span class="stat-label">Niv</span><span class="stat-value">${p.level}</span></div>
                    <div class="stat-item"><span class="stat-label">Quêtes</span><span class="stat-value">${p.quests}</span></div>
                    <div class="stat-item"><span class="stat-label">Or</span><span class="stat-value">💰 ${p.gold}</span></div>
                </div>
                <div style="margin-top:10px;">
                    <div class="xp-bar-container"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
                    <p style="font-size:0.8rem;color:#6b7280;margin-top:5px;">${p.xp}/${p.xpNeeded}</p>
                </div>
                <button class="btn-secondary" onclick="deletePlayer('${p.id}')" style="width:100%;margin-top:10px;">🗑️ Supprimer</button>
            </div>
        `;
    }).join('');
}

function renderRaids() {
    if (!GameState.raids.length) { $('raidsContainer').innerHTML = '<div class="mini-card" style="grid-column:1/-1;">Aucun</div>'; return; }
    
    $('raidsContainer').innerHTML = GameState.raids.map(r => {
        const hpPct = Math.max(0, Math.floor((r.hp / r.maxHp) * 100));
        return `
            <div class="raid-card">
                <h3>⚔️ ${r.name}</h3>
                <div class="raid-hp-bar"><div class="raid-hp-fill" style="width:${hpPct}%"></div></div>
                <p>HP: ${r.hp} / ${r.maxHp}</p>
                <button class="btn-primary" onclick="damageRaid('${r.id}')" style="width:100%;margin-top:10px;">⚔️ Attaquer</button>
            </div>
        `;
    }).join('');
}

function renderChat() {
    const c = $('chatMessages');
    if (!c) return;
    if (!GameState.chats.length) { c.innerHTML = '<div style="color:#6b7280;">Aucun</div>'; return; }
    c.innerHTML = GameState.chats.map(m => `
        <div class="chat-message">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:10px;">
                <div>
                    <span style="font-size:0.8rem;color:#6b7280;">${m.time}</span>
                    <div>${m.text}</div>
                </div>
                ${GameState.isAdmin ? `<button class="btn-secondary" onclick="deleteChat('${m.id}')" style="padding:4px 8px;font-size:0.8rem;">✕</button>` : ''}
            </div>
        </div>
    `).join('');
    c.scrollTop = c.scrollHeight;
}

function renderLogs() {
    const c = $('logsContainer');
    if (!c) return;
    if (!GameState.logs.length) { c.innerHTML = '<div class="mini-card">Aucun</div>'; return; }
    c.innerHTML = GameState.logs.slice(0, 20).map(l => {
        const age = Date.now() - l.timestamp;
        const canUndo = age <= UNDO_WINDOW;
        return `<div class="log-item"><span>${l.text}</span>${canUndo ? `<button class="btn-secondary" onclick="undoLog('${l.id}');">↩️</button>` : ''}</div>`;
    }).join('');
}

function undoLog(lid) {
    const l = GameState.logs.find(x => x.id === lid);
    if (!l) return;
    const q = GameState.quests.find(x => x.id === l.questId);
    if (q) q.completed = false;
    GameState.logs = GameState.logs.filter(x => x.id !== lid);
    saveState();
    renderAll();
    toast('Annulé', 'success');
}

function renderAdmin() {
    const c = $('adminContent');
    if (!c) return;
    
    if (!GameState.isAdmin) {
        c.innerHTML = `
            <p style="color:#6b7280;margin-bottom:15px;">Entrez le code pour accéder au panneau admin</p>
            <div style="display:flex;gap:10px;">
                <input id="adminCode" type="password" placeholder="Code" style="flex:1;padding:10px;border:2px solid rgba(102,126,234,0.3);border-radius:8px;font-family:Poppins;">
                <button class="btn-primary" onclick="validateAdminCode()">Accéder</button>
            </div>
        `;
    } else {
        c.innerHTML = `
            <div style="margin-bottom:30px;padding:15px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:10px;color:white;">
                <p style="font-weight:700;font-size:1.1rem;">✅ Admin Activé</p>
                <button class="btn-secondary" onclick="deactivateAdmin()" style="margin-top:10px;width:100%;">Déactiver</button>
            </div>
            
            <h3 style="margin-bottom:15px;">⚙️ Générer Quêtes</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px;margin-bottom:30px;">
                ${['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'].map(r => `
                    <button class="btn-secondary" onclick="adminGenerateExtraQuests('${r}')" style="font-weight:700;">${r}</button>
                `).join('')}
            </div>
            
            <h3 style="margin-bottom:15px;">👥 Gérer Joueurs</h3>
            <div style="display:grid;gap:10px;">
                ${GameState.players.map(p => `
                    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(102,126,234,0.05);padding:15px;border-radius:10px;">
                        <div>
                            <p style="font-weight:700;">${p.name}</p>
                            <p style="color:#6b7280;font-size:0.9rem;">Niv ${p.level}</p>
                        </div>
                        <div style="display:flex;gap:10px;">
                            <button class="btn-secondary" onclick="adminAddXP('${p.id}')">+XP</button>
                            <button class="btn-secondary" onclick="adminAddGold('${p.id}')">+Or</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function validateAdminCode() {
    const code = $('adminCode')?.value || '';
    if (code === ADMIN_CODE) {
        GameState.isAdmin = true;
        saveState();
        renderAdmin();
        toast('🔓 Admin activé !', 'success');
    } else {
        toast('Code incorrect', 'error');
    }
    // ==================== ADMIN HIDDEN TOOLS ====================

const ADMIN_ACCESS_KEY = 'adminUnlocked';

function isAdminUnlocked() {
    return sessionStorage.getItem(ADMIN_ACCESS_KEY) === 'true';
}

function setAdminUnlocked(value) {
    if (value) {
        sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
    } else {
        sessionStorage.removeItem(ADMIN_ACCESS_KEY);
    }
    renderAdminTools();
}

function renderAdminTools() {
    const lockedView = document.getElementById('adminLockedView');
    const unlockedView = document.getElementById('adminUnlockedView');

    if (!lockedView || !unlockedView) return;

    if (isAdminUnlocked()) {
        lockedView.style.display = 'none';
        unlockedView.style.display = 'block';
    } else {
        lockedView.style.display = 'block';
        unlockedView.style.display = 'none';
    }
}

function unlockAdmin() {
    const input = document.getElementById('adminCodeInput');
    if (!input) return;

    const code = input.value.trim();

    const correctCode = 'Oresama';

    if (code === correctCode) {
        setAdminUnlocked(true);
        showToast('Accès admin accordé.', 'success');
        input.value = '';
    } else {
        showToast('Code incorrect.', 'error');
    }
}
    // ==================== CUSTOM QUEST MANAGER ====================

function parseQuestLine(line) {
    const parts = line.split('|').map(v => v.trim());

    // Format attendu :
    // Titre | Description | Rang | Stat | XP | Or
    if (parts.length < 6) return null;

    const [title, description, rarity, stat, xp, gold] = parts;

    if (!GAME_CONFIG.questRarities[rarity]) return null;
    if (stat && !GAME_CONFIG.statDefinitions[stat]) return null;

    return {
        id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: 'custom',
        rarity,
        title,
        description,
        stat: stat || null,
        statGain: rarity === 'SSS' ? 6 : rarity === 'SS' ? 4 : rarity === 'S' ? 3 : rarity === 'A' ? 2 : 1,
        xp: Number(xp) || GAME_CONFIG.questRarities[rarity].xp,
        gold: Number(gold) || GAME_CONFIG.questRarities[rarity].gold,
        completed: false,
        completedAt: null,
        createdByAdmin: true
    };
}

function addCustomQuestsFromInput() {
    const input = document.getElementById('customQuestInput');
    if (!input) return;

    const lines = input.value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    if (!lines.length) {
        showToast('Écris au moins une quête.', 'warning');
        return;
    }

    const created = [];

    lines.forEach(line => {
        const quest = parseQuestLine(line);
        if (quest) {
            GameState.quests.push(quest);
            created.push(quest);
        }
    });

    if (!created.length) {
        showToast('Aucune quête valide détectée.', 'warning');
        return;
    }

    saveState();
    renderAll();
    showToast(`${created.length} quête(s) personnalisée(s) ajoutée(s).`, 'success');
    input.value = '';
}

function clearCustomQuestInput() {
    const input = document.getElementById('customQuestInput');
    if (input) input.value = '';
}

function deleteQuest(questId) {
    if (!confirm('Supprimer cette quête ?')) return;

    GameState.quests = GameState.quests.filter(q => q.id !== questId);
    saveState();
    renderAll();
    showToast('Quête supprimée.', 'info');
}

function toggleQuestCompletionAdmin(questId) {
    const quest = GameState.quests.find(q => q.id === questId);
    if (!quest) return;

    quest.completed = !quest.completed;
    quest.completedAt = quest.completed ? Date.now() : null;

    saveState();
    renderAll();
}

function renderAdminQuestList() {
    const container = document.getElementById('adminQuestList');
    if (!container) return;

    const quests = GameState.quests || [];

    container.innerHTML = quests.map(q => `
        <div class="mini-card" style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
            <div>
                <strong>${q.title}</strong><br>
                <span style="color:#64748b;">${q.description || ''}</span><br>
                <span class="badge-soft">Rang ${q.rarity}</span>
                ${q.stat ? `<span class="badge-soft">${GAME_CONFIG.statDefinitions[q.stat]?.label || q.stat}</span>` : ''}
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn-secondary" onclick="toggleQuestCompletionAdmin('${q.id}')">
                    ${q.completed ? 'Marquer non faite' : 'Marquer faite'}
                </button>
                <button class="btn-secondary" onclick="deleteQuest('${q.id}')">Supprimer</button>
            </div>
        </div>
    `).join('');
}
}

function deactivateAdmin() {
    GameState.isAdmin = false;
    saveState();
    renderAdmin();
    toast('Admin désactivé', 'info');
}

function adminAddXP(pid) {
    const amt = prompt('XP:');
    if (!amt) return;
    const p = GameState.players.find(x => x.id === pid);
    if (p) { p.xp += parseInt(amt); saveState(); renderAll(); }
}

function adminAddGold(pid) {
    const amt = prompt('Or:');
    if (!amt) return;
    const p = GameState.players.find(x => x.id === pid);
    if (p) { p.gold += parseInt(amt); saveState(); renderAll(); }
}

function renderAll() {
    renderHero();
    renderQuests();
    renderPlayers();
    renderRaids();
    renderChat();
    renderLogs();
    renderAdmin();
    renderAdminQuestList();
    $('seasonBadge').textContent = getCurrentSeason().emoji + ' ' + getCurrentSeason().name;
}

// Nav
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        $(e.target.dataset.tab + '-tab')?.classList.add('active');
    });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderQuests();
    });
});

// Modaux
function openAddPlayerModal() { $('addPlayerModal')?.classList.add('show'); }
function closeAddPlayerModal() { $('addPlayerModal')?.classList.remove('show'); }
function openCreateRaidModal() {
    const list = $('raidPlayersList');
    if (list) list.innerHTML = GameState.players.map(p => `
        <div class="checkbox-item">
            <input type="checkbox" id="r${p.id}" value="${p.id}">
            <label for="r${p.id}">${CLASSES[p.class].emoji} ${p.name}</label>
        </div>
    `).join('');
    $('createRaidModal')?.classList.add('show');
}
function closeCreateRaidModal() { $('createRaidModal')?.classList.remove('show'); }

document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); });
});

// Init
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    if (!localStorage.getItem('qd')) {
        generateQuests();
        localStorage.setItem('qd', dateKey());
    } else if (localStorage.getItem('qd') !== dateKey()) {
        generateQuests();
        localStorage.setItem('qd', dateKey());
    }
    saveState();
    renderAll();
    $('chatInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
});

// Expose
window.addPlayer = addPlayer;
window.deletePlayer = deletePlayer;
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.openCreateRaidModal = openCreateRaidModal;
window.closeCreateRaidModal = closeCreateRaidModal;
window.completeQuest = completeQuest;
window.createRaid = createRaid;
window.damageRaid = damageRaid;
window.openQuestPicker = openQuestPicker;
window.sendChat = sendChat;
window.undoLog = undoLog;
window.validateAdminCode = validateAdminCode;
window.deactivateAdmin = deactivateAdmin;
window.adminGenerateExtraQuests = adminGenerateExtraQuests;
window.deleteChat = deleteChat;
window.adminAddXP = adminAddXP;
window.adminAddGold = adminAddGold;
