# ⚔️ RPG Quest Master - Système de Quêtes Multijoueurs

Un système RPG complet en **HTML5, CSS3 et JavaScript vanilla** avec gestion de joueurs, quêtes, XP, niveaux, raids coopératifs et réalisations !

## 🌟 Caractéristiques Principales

### 👥 Système de Joueurs
- ✅ Créer/supprimer des joueurs avec personnalisation
- ✅ 4 classes uniques : **Guerrier** ⚔️, **Mage** 🔮, **Archer** 🏹, **Paladin** ✨
- ✅ Système de compétences (Force, Défense, Vitesse)
- ✅ Progression de niveau avec courbe exponentielle
- ✅ Barre XP animée avec shimmer effect
- ✅ Système de badges et réalisations
- ✅ Profils détaillés avec statistiques complètes

### 📜 Système de Quêtes Généré Automatiquement
#### Quêtes Quotidiennes (très nombreuses)
- **E** (Très facile) → 5 XP, 7 Gold 🟣
- **D** (Facile) → 10 XP, 15 Gold 🔵
- **C** (Simple) → 20 XP, 30 Gold 🔵
- **B** (Moyen) → 30 XP, 45 Gold 🟣
- **A** (Difficile) → 40 XP, 60 Gold 🟣

#### Quêtes Spéciales
- **S** (Hebdomadaire) → 60 XP, 90 Gold 🟠 *(une par semaine)*
- **SS** (Mensuelle) → 80 XP, 120 Gold 🔴 *(une par mois)*
- **SSS** (Annuelle) → 100 XP, 200 Gold 🔴 *(une par an)*

#### Quêtes d'Événements Spéciaux
- 🌍 **Fêtes Internationales** : Journée des Femmes, Jour de la Terre, Journée de la Musique, Halloween, Noël, etc.
- 🇲🇬 **Fêtes Malgaches** : Fête de l'Indépendance (26 juin), Toussaint, Assomption, etc.
- 🏯 **Fêtes Japonaises** : Nouvel An Japonais, Obon (août), Jour des Enfants, etc.

### ⚔️ Raids Coopératifs Avancés
- ✅ Créer des raids avec 2+ joueurs minimum
- ✅ 3 niveaux de difficulté : 3, 5 ou 10 étages
- ✅ Système de combat au tour par tour
- ✅ Actions : **Attaquer** ou **Soigner l'équipe**
- ✅ Ennemis dynamiques avec HP progressif
- ✅ Récompenses exceptionnelles à la victoire
- ✅ Affichage temps réel de l'équipe et santé des joueurs

### 🏆 Réalisations & Achievements
- **Première Quête** 📜 → Compléter 1 quête
- **Maître des Quêtes** 🎯 → Compléter 10 quêtes
- **Niveau 5** ⬆️ → Atteindre le niveau 5
- **Niveau 10** ⬆️⬆️ → Atteindre le niveau 10
- **Roi du Combat** 👑 → Atteindre le niveau 25
- **Collecteur d'Or** 💰 → Gagner 500 pièces d'or
- **Riche** 💎 → Gagner 2000 pièces d'or
- **Travailleur Acharné** 💪 → Compléter 50 quêtes
- **Rapidité** ⚡ → Compléter 5 quêtes SSS

### 📅 Calendrier Interactif
- ✅ Vue mois du calendrier
- ✅ Affichage des événements spéciaux
- ✅ Highlight du jour actuel
- ✅ Navigation mois précédent/suivant

### 🌍 Système de Saisons Dynamiques
- **Printemps** 🌸 (mars-mai) - Thème verdoyant
- **Été** ☀️ (juin-août) - Thème chaud
- **Automne** 🍂 (septembre-novembre) - Thème doré
- **Hiver** ❄️ (décembre-février) - Thème glacé

### 🎵 Système Audio
- 🔊 Musique de fond (BGM) ambiance épique
- 🔉 Effets sonores : Quête complétée, Level Up, Gain XP
- ✅ Toggle son on/off persistant en localStorage

### 💾 Persistance des Données
- ✅ localStorage pour sauvegarder : joueurs, quêtes, raids, achievements
- ✅ Données persistent entre les sessions
- ✅ Bouton réinitialiser pour recommencer

### 🎨 Interface Immersive & Ludique
- ✨ Gradient coloré moderne (Bleu/Violet)
- 🎆 Confettis au level-up
- 📈 Barres XP animées avec shimmer effect
- 🎯 Cards de quêtes avec rareté colorée
- 🏅 Badges sous les noms des joueurs
- 📱 Design responsive (desktop, tablet, mobile)
- ⚡ Transitions fluides et animations CSS
- 🔔 Notifications XP flottantes
- 👥 Navigation par onglets (Quêtes, Joueurs, Raids, Réalisations, Calendrier)

## 📦 Structure du Projet

```
rpg-multiplayer-system/
├── index.html          # Structure HTML principale
├── styles.css          # Feuille de styles complète (responsive)
├── script.js           # Logique JavaScript complète (~1200 lignes)
├── assets/
│   └── audio/
│       ├── bgm.mp3     # Musique de fond (à ajouter)
│       ├── quest_complete.mp3
│       ├── level_up.mp3
│       └── click.mp3
└── README.md           # Ce fichier
```

## 🚀 Démarrage Rapide

### 1️⃣ Cloner le Projet
```bash
git clone https://github.com/reichenbakmh-hash/rpg-multiplayer-system.git
cd rpg-multiplayer-system
```

### 2️⃣ Ouvrir dans un Navigateur
- Double-cliquez sur `index.html`
- Ou ouvrez avec votre serveur local préféré

### 3️⃣ Commencer le Jeu
1. Allez à l'onglet **👥 Joueurs**
2. Cliquez sur **+ Ajouter Joueur**
3. Entrez un nom et choisissez une classe
4. Allez à l'onglet **📜 Quêtes**
5. Complétez des quêtes en cliquant **Compléter**
6. Sélectionnez le joueur pour gagner XP !

## 🎮 Guide de Jeu

### Progression des Joueurs
```
Niveau 1 → XP: 0/100
Niveau 2 → XP: 0/115 (100 * 1.15)
Niveau 3 → XP: 0/132 (115 * 1.15)
...
À chaque level-up, l'XP requis augmente de 15%
```

### Création d'un Raid
1. Allez à **⚔️ Raids Coopératifs**
2. Cliquez **+ Créer Raid**
3. Nommez votre raid (ex: "Château Noir")
4. Choisissez la difficulté (3, 5 ou 10 étages)
5. Sélectionnez minimum 2 joueurs
6. Lancez le raid et battez les étages !

### Combat au Raid
- **⚔️ Attaquer** : Infligez des dégâts à l'ennemi
- **💚 Soigner** : Restaurez la santé de l'équipe
- Les ennemis contre-attaquent chaque tour
- Complétez tous les étages pour gagner les récompenses !

### Fêtes Spéciales
Le jeu détecte automatiquement :
- 📅 Fêtes internationales (Noël, Halloween, Jour de la Terre, etc.)
- 🇲🇬 Fêtes malgaches (Fête de l'Indépendance le 26 juin)
- 🏯 Fêtes japonaises (Obon, Nouvel An Japonais)

Des quêtes spéciales **+50 XP** apparaissent ces jours-là !

## 🔧 Personnalisation

### Ajouter de la Musique
1. Placez vos fichiers audio dans `assets/audio/`
2. Modifiez les sources dans `index.html` (lignes 11-13)
3. Les formats supportés : MP3, WAV, OGG

### Modifier les Quêtes
Dans `script.js`, cherchez `generateDailyQuests()` pour ajouter de nouveaux titres :
```javascript
E: ['Collecter 5 bois', 'Parler à un PNJ', 'Votre quête ici'],
```

### Ajouter des Réalisations
Dans `script.js`, section `ACHIEVEMENTS` :
```javascript
{ 
  id: 'ma_realisation', 
  icon: '🎯', 
  name: 'Mon Nom', 
  description: 'Ma description',
  condition: (p) => p.level >= 20 
}
```

### Modifier les Couleurs
Dans `styles.css`, section `:root` :
```css
:root {
    --primary: #667eea;      /* Couleur principale */
    --secondary: #764ba2;    /* Couleur secondaire */
    --success: #48bb78;      /* Couleur succès */
    /* ... */
}
```

## 📊 Système de Points et XP

### Gain XP par Quête
| Rareté | Type | XP | Or | Fréquence |
|--------|------|----|----|-----------|
| E | Très facile | 5 | 7 | Quotidien |
| D | Facile | 10 | 15 | Quotidien |
| C | Simple | 20 | 30 | Quotidien |
| B | Moyen | 30 | 45 | Quotidien |
| A | Difficile | 40 | 60 | Quotidien |
| S | Hebdo | 60 | 90 | 1/semaine |
| SS | Mensuel | 80 | 120 | 1/mois |
| SSS | Annuel | 100 | 200 | 1/an |

### Raids Coopératifs
- **3 étages (Facile)** → 150 XP, 225 Gold
- **5 étages (Normal)** → 250 XP, 375 Gold
- **10 étages (Difficile)** → 500 XP, 750 Gold

## 🎓 Compétences par Classe

### ⚔️ Guerrier
- Force: 120% | Défense: 100% | Vitesse: 80%
- Bonus: Meilleure attaque et durabilité

### 🔮 Mage
- Force: 80% | Défense: 80% | Vitesse: 110%
- Bonus: Plus rapide, sort magique

### 🏹 Archer
- Force: 100% | Défense: 90% | Vitesse: 120%
- Bonus: Très rapide, attaques précises

### ✨ Paladin
- Force: 110% | Défense: 120% | Vitesse: 90%
- Bonus: Meilleure défense et support d'équipe

## 📱 Compatibilité

- ✅ Chrome/Edge (dernière version)
- ✅ Firefox (dernière version)
- ✅ Safari (dernière version)
- ✅ Mobile (responsive design)
- ✅ Tablette (interface adaptée)
- ✅ Pas de dépendances externes (vanilla JS)

## 🐛 Bugs Connus & Limitations

- 🔊 Les sons requièrent des fichiers audio réels dans `assets/audio/`
- 📅 Navigation du calendrier (prev/next) nécessite une implémentation complète
- 🌐 Les données sont stockées localement (localStorage) - max ~5MB par domaine
- ☁️ Pas de synchronisation cloud (option future)

## 🚀 Améliorations Futures

- [ ] Synchronisation cloud Firebase/Supabase
- [ ] Multiplayer en temps réel (WebSocket)
- [ ] Système d'inventaire avancé
- [ ] Quêtes dynamiques basées sur l'IA
- [ ] Trading entre joueurs
- [ ] Guildes et événements mondiaux
- [ ] Leaderboard global
- [ ] Boutique in-game avec cosmétiques

## 📄 Licence

MIT - Libre d'utilisation pour tout projet personnel ou commercial

## 🙏 Crédits

Développé avec ❤️ pour les amateurs de jeux de rôle !

---

## 🌐 Héberger en Ligne

### Option 1: GitHub Pages (Gratuit)
```bash
git push origin main
```
Puis allez dans Settings → Pages → Deployez depuis la branche `main`

### Option 2: Vercel/Netlify
1. Connectez votre repo GitHub
2. Les modifications se déploient automatiquement

### Option 3: Itch.io
1. Créez un compte itch.io
2. Uploadez vos fichiers comme jeu HTML5
3. Partagez le lien public

## 📞 Support & Contribution

Trouvez un bug ? Une idée ? 
- Ouvrez une **Issue** sur GitHub
- Proposez une **Pull Request**
- Contactez via GitHub Discussions

---

**Bon amusement dans votre aventure RPG ! ⚔️✨**

Made with 💜 | Last updated: 2026-07-21
