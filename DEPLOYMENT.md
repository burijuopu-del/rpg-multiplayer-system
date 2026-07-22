# 🚀 Guide de Déploiement - RPG Quest Master

Ce guide vous aidera à déployer votre jeu RPG Quest Master en ligne pour que tout le monde puisse y jouer !

## 📋 Table des Matières

1. [GitHub Pages (Gratuit)](#-github-pages-gratuit)
2. [Vercel (Gratuit)](#-vercel-gratuit)
3. [Netlify (Gratuit)](#-netlify-gratuit)
4. [Itch.io (Gratuit)](#itchio-gratuit)
5. [Serveur Personnel](#-serveur-personnel)
6. [Troubleshooting](#-troubleshooting)

---

## 🐙 GitHub Pages (Gratuit)

**Avantages**: Gratuit, intégré à GitHub, déploiement automatique
**Inconvénients**: Domaine GitHub, pas de backend

### Étape 1: Configurer le Repo
Assurez-vous que votre repo est **PUBLIC** sur GitHub.

### Étape 2: Activer GitHub Pages
1. Allez sur votre repo: `https://github.com/reichenbakmh-hash/rpg-multiplayer-system`
2. Cliquez sur **Settings** ⚙️
3. Cherchez **Pages** dans le menu de gauche
4. Sous "Source", sélectionnez:
   - Branch: `main`
   - Folder: `/ (root)`
5. Cliquez **Save**

### Étape 3: Attendre le Déploiement
- GitHub génère automatiquement votre site
- URL: `https://reichenbakmh-hash.github.io/rpg-multiplayer-system`
- Ça peut prendre 1-2 minutes

### Étape 4: Vérifier le Déploiement
1. Attendez le message vert "Your site is live"
2. Visitez l'URL fournie
3. Le jeu devrait fonctionner !

### Mettre à Jour
Simplement pusher vers `main`:
```bash
git add .
git commit -m "Mise à jour du jeu"
git push origin main
```
Le site se redéploie automatiquement en ~1-2 minutes.

---

## ⚡ Vercel (Gratuit)

**Avantages**: Déploiement ultra-rapide, domaine personnalisé gratuit
**Inconvénients**: Compte Vercel requis

### Étape 1: Créer un Compte Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Autorisez Vercel à accéder à vos repos

### Étape 2: Importer le Projet
1. Cliquez sur **New Project**
2. Sélectionnez votre repo `rpg-multiplayer-system`
3. Cliquez **Import**

### Étape 3: Configurer (optionnel)
- Laissez les settings par défaut
- Cliquez **Deploy**

### Étape 4: Attendre le Déploiement
- Vercel construit et déploie en ~30 secondes
- URL: `https://rpg-multiplayer-system.vercel.app`

### Ajouter un Domaine Personnel (optionnel)
1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `mon-rpg.com`)
3. Suivez les instructions DNS

### Mettre à Jour
Push vers GitHub, Vercel se redéploie automatiquement !

---

## 🌐 Netlify (Gratuit)

**Avantages**: Gratuit, facile à utiliser, analytics gratuit
**Inconvénients**: Un peu plus lent que Vercel

### Étape 1: Créer un Compte Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez **Sign Up**
3. Connectez-vous avec GitHub

### Étape 2: Connecter le Repo
1. Cliquez **New site from Git**
2. Sélectionnez **GitHub**
3. Autorisez Netlify
4. Sélectionnez votre repo

### Étape 3: Configurer le Build
- **Branch to deploy**: `main`
- **Build command**: (laisser vide - c'est un site statique)
- **Publish directory**: `.` (root)
- Cliquez **Deploy site**

### Étape 4: Attendre la Construction
- Netlify construit et déploie en ~1-2 minutes
- URL: `https://[site-name].netlify.app`

### Renommer le Site
1. **Site settings** → **General** → **Site details**
2. Cliquez sur le nom du site
3. Entrez le nouveau nom (ex: `rpg-quest-master`)

### Mettre à Jour
Push vers GitHub, Netlify se redéploie automatiquement !

---

## 🎮 Itch.io (Gratuit)

**Avantages**: Plateforme gaming, communauté active, monétisation possible
**Inconvénients**: Plateforme spécialisée jeux

### Étape 1: Créer un Compte Itch.io
1. Allez sur [itch.io](https://itch.io)
2. Cliquez **Sign Up**
3. Complétez le profil

### Étape 2: Créer un Nouveau Jeu
1. Cliquez sur **Dashboard** (coin supérieur droit)
2. Cliquez **New Project**
3. Remplissez:
   - **Project title**: `RPG Quest Master`
   - **Project URL**: `rpg-quest-master`
   - **Classification**: **Game** → **HTML** → **Web** ✅
   - Cliquez **Save**

### Étape 3: Uploader les Fichiers
1. Allez à **Uploads**
2. Cliquez **Upload files**
3. Sélectionnez tous vos fichiers:
   ```
   index.html
   styles.css
   script.js
   assets/ (dossier complet)
   ```
4. Cochez **This file will be played in the browser**
5. Cliquez **Upload and continue**

### Étape 4: Publier
1. Scrollez jusqu'à **Visibility & Access**
2. Sélectionnez **Publicly visible**
3. Cliquez **Save & publish**

### Étape 5: Partager
- URL: `https://[username].itch.io/rpg-quest-master`
- Partagez avec vos amis !

### Monétiser (optionnel)
1. **Edit game**
2. Cochez **Monetization**
3. Sélectionnez le prix ou "Pay what you want"

---

## 🖥️ Serveur Personnel

Si vous avez un serveur/VPS personnel:

### Avec Node.js + Express
```bash
# 1. Installez Node.js
# 2. Créez le dossier du projet
mkdir rpg-game
cd rpg-game

# 3. Initialisez npm
npm init -y

# 4. Installez Express
npm install express

# 5. Créez server.js
cat > server.js << 'EOF'
const express = require('express');
const app = express();

app.use(express.static('./'));

app.listen(3000, () => {
    console.log('🎮 Serveur lancé sur http://localhost:3000');
});
EOF

# 6. Démarrez le serveur
node server.js
```

Visitez: `http://votre-serveur:3000`

### Avec Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Visitez: `http://votre-serveur:8000`

### Avec Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    root /var/www/rpg-game;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Avec Docker
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t rpg-game .
docker run -p 80:80 rpg-game
```

---

## 🔒 Optimisations Avant Déploiement

### 1. Minifier les Fichiers (optionnel)
```bash
# Installer uglify-js
npm install -g uglify-js

# Minifier script.js
uglifyjs script.js -o script.min.js

# Puis mettre à jour index.html pour pointer vers script.min.js
```

### 2. Ajouter une Favicon
```html
<link rel="icon" type="image/png" href="favicon.png">
```

### 3. Optimiser les Images
```bash
# Avec ImageOptim ou online tools
# Réduisez la taille des assets
```

### 4. Ajouter une Description Meta
```html
<meta name="description" content="Un système RPG multijoueurs avec quêtes, XP, raids coopératifs et plus !">
<meta name="keywords" content="rpg, game, quest, multiplayer, html5">
<meta name="author" content="Votre Nom">
```

### 5. Activer HTTPS
- GitHub Pages: Automatique ✅
- Vercel: Automatique ✅
- Netlify: Automatique ✅
- Serveur personnel: Utilisez Let's Encrypt (Certbot)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

---

## 📊 Vérifier les Performances

### PageSpeed Insights
1. Allez sur [pagespeed.web.dev](https://pagespeed.web.dev)
2. Entrez votre URL
3. Vérifiez le score (viser 80+)

### Lighthouse (dans DevTools)
1. Ouvrez Developer Tools (F12)
2. Allez à **Lighthouse**
3. Cliquez **Analyze**

### WebPageTest
Utilisez [webpagetest.org](https://www.webpagetest.org) pour des tests approfondis

---

## 🐛 Troubleshooting

### ❌ Les sons ne fonctionnent pas
**Problème**: Fichiers audio manquants
```
Solution:
1. Vérifiez que assets/audio/ contient les fichiers MP3
2. Assurez-vous que les chemins sont corrects
3. Testez localement d'abord
```

### ❌ CORS Error
**Problème**: Impossible de charger les ressources
```
Solution:
1. Assurez-vous que tous les fichiers sont sur le même domaine
2. GitHub Pages/Vercel/Netlify gèrent ça automatiquement
3. Si serveur personnel: configurez les headers CORS
```

### ❌ localStorage ne fonctionne pas
**Problème**: Les données ne se sauvegardent pas
```
Solution:
1. Vérifiez que le navigateur permet localStorage
2. Testez en mode privé (désactivé par défaut)
3. Vérifiez la limite de 5-10MB
```

### ❌ Site très lent
**Problème**: Chargement lent
```
Solution:
1. Minifiez CSS et JS
2. Compressez les images
3. Optimisez les fichiers audio
4. Utilisez un CDN (Cloudflare gratuit)
```

### ❌ 404 sur GitHub Pages
**Problème**: Page introuvable
```
Solution:
1. Vérifiez que index.html est à la racine
2. Les Settings → Pages est configuré
3. Attendez 5 minutes après le push
```

---

## 🔄 Mise à Jour Continue

### Setup Automatique avec GitHub Actions (optionnel)
Créer `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        run: echo "Deploying..."
```

---

## 📈 Promouvoir Votre Jeu

### Partager sur:
- 🐦 Twitter: `Regardez mon nouveau jeu RPG en HTML5 ! [URL]`
- 💬 Reddit: Post sur r/WebGames, r/gamedev
- 🎮 Itch.io: Ajouter des tags (#rpg #webgame)
- 📱 Tiktok/Instagram: Vidéo courte de gameplay
- 🌐 Votre blog/portfolio

### SEO Basique:
```html
<title>RPG Quest Master - Jeu de Rôle Multijoueurs</title>
<meta name="description" content="Jeu RPG gratuit avec quêtes, XP, raids...">
```

---

## 💡 Prochaines Étapes

1. ✅ Déployer en production
2. 🎵 Ajouter les fichiers audio
3. 📊 Monitorer les analytics
4. 🐛 Corriger les bugs reportés
5. 🎨 Ajouter des features
6. 📢 Promouvoir le jeu

---

## 📞 Support

- 🐛 Problème de déploiement ? Ouvrez une **Issue** sur GitHub
- 💬 Questions ? Utilisez **GitHub Discussions**
- 🎮 Feedback ? Commentaire sur itch.io

---

**Bon déploiement ! 🚀✨**

Made with 💜 | Last updated: 2026-07-21
