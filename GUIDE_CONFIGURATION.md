# 🔧 GUIDE DE CONFIGURATION - CHARISFERME

**Date:** 14 juin 2026  
**Statut:** ✅ GUIDE COMPLET DE MISE EN PRODUCTION

---

## 📋 TABLE DES MATIÈRES

1. [Configuration Initiale](#configuration-initiale)
2. [Stripe (Paiements)](#stripe)
3. [SendGrid (Emails)](#sendgrid)
4. [Google Analytics](#google-analytics)
5. [Images & Ressources](#images)
6. [Déploiement Netlify](#netlify)
7. [Sécurité & Vérifications](#sécurité)

---

## <a id="configuration-initiale"></a>1. ✅ CONFIGURATION INITIALE

### Étape 1: Cloner le projet
```bash
git clone <votre-repo>
cd SITE_FERME
```

### Étape 2: Copier le fichier .env
```bash
cp .env.example .env
```

### Étape 3: Installer les dépendances (si nécessaire)
```bash
npm install
# ou si vous utilisez Netlify Functions
cd netlify/functions
npm install
cd ../..
```

### Étape 4: Vérifier la structure
```
SITE_FERME/
├── index.html
├── produits.html
├── checkout.html
├── abonnement.html
├── .env.example ✅
├── .gitignore ✅
├── netlify/
│   └── functions/
│       └── create-payment-intent.js
├── images/
│   ├── icon-192.svg
│   ├── icon-512.svg
│   ├── hero.svg
│   └── ...
└── netlify.toml
```

---

## <a id="stripe"></a>2. 💳 CONFIGURATION STRIPE

### Étape 1: Créer un compte Stripe
1. Aller sur https://stripe.com
2. Cliquer sur "Sign up"
3. Remplir vos informations métier (Ferme CHARISFERME)

### Étape 2: Obtenir vos clés API
1. Aller dans **Dashboard → Developers → API keys**
2. Copier vos clés:
   - **Publishable key** (commence par `pk_test_` ou `pk_live_`)
   - **Secret key** (commence par `sk_test_` ou `sk_live_`)

### Étape 3: Configurer dans .env
```env
STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXX
```

### Étape 4: Configuration Netlify
1. Dans l'interface Netlify: **Site settings → Build & deploy → Environment**
2. Ajouter les variables:
   - `STRIPE_PUBLIC_KEY` = votre clé publique
   - `STRIPE_SECRET_KEY` = votre clé secrète (pour la production)

### Étape 5: Tester les paiements
```javascript
// Dans la console du navigateur (DevTools)
window.toast.success('Test: Paiement Stripe configuré');
```

**Test rapide (mode test):**
- Numéro de carte: `4242 4242 4242 4242`
- Date: `12/25`
- CVC: `123`

---

## <a id="sendgrid"></a>3. 📧 CONFIGURATION SENDGRID (EMAILS)

### Étape 1: Créer un compte SendGrid
1. Aller sur https://sendgrid.com
2. Cliquer sur "Sign Up"
3. Vérifier votre email

### Étape 2: Obtenir une API Key
1. Dans le dashboard: **Settings → API Keys**
2. Cliquer sur "Create API Key"
3. Donner un nom: `CHARISFERME-Production`
4. Copier la clé générée (commence par `SG.`)

### Étape 3: Configurer l'adresse d'envoi
1. **Settings → Sender Authentication**
2. Ajouter votre domaine `charisferme.fr` ou utiliser une adresse verified:
   - `noreply@charisferme.fr`
   - `contact@charisferme.fr`

### Étape 4: Configurer dans .env
```env
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXX
SENDGRID_FROM_EMAIL=noreply@charisferme.fr
```

### Étape 5: Configuration Netlify
Ajouter dans **Netlify Build & deploy → Environment:**
- `SENDGRID_API_KEY` = votre clé API
- `SENDGRID_FROM_EMAIL` = noreply@charisferme.fr

### Étape 6: Tester l'envoi
Après un achat test, vérifier que l'email de confirmation arrive.

---

## <a id="google-analytics"></a>4. 📊 GOOGLE ANALYTICS

### Étape 1: Créer une propriété GA4
1. Aller sur https://analytics.google.com
2. Cliquer sur "Créer un compte"
3. Remplir les informations:
   - Nom du compte: `CHARISFERME`
   - Nom de la propriété: `CHARISFERME Website`
   - Type: `Web`

### Étape 2: Obtenir votre ID de mesure
1. Dans **Admin → Propriété → Flux de données**
2. Copier l'ID de mesure (commence par `G-`)

### Étape 3: Configurer dans config.js
```javascript
// Dans config.js
GA_ID: 'G-XXXXXXXXXX', // Remplacer par votre ID
```

### Étape 4: Vérifier le suivi
1. Ouvrir votre site en développement
2. Aller dans **Google Analytics → Real-time**
3. Vous devriez vous voir en tant que visiteur

---

## <a id="images"></a>5. 🖼️ IMAGES & RESSOURCES

### Images créées (SVG placeholders)
✅ `images/icon-192.svg` - Logo PWA 192x192
✅ `images/icon-512.svg` - Logo PWA 512x512
✅ `images/hero.svg` - Image accueil 1200x600
✅ `images/screenshot-1.svg` - Screenshot PWA
✅ `images/screenshot-2.svg` - Screenshot panier
✅ `images/produit-legumes.svg` - Produit exemple

### Étape 1: Convertir SVG en PNG
**Option A: Utiliser CloudConvert (gratuit)**
1. Aller sur https://cloudconvert.com/svg-to-png
2. Upload chaque SVG
3. Télécharger en PNG à la bonne taille

**Option B: Utiliser ImageMagick (local)**
```bash
convert images/icon-192.svg images/icon-192.png
convert images/icon-512.svg images/icon-512.png
convert images/hero.svg images/hero.jpg
```

**Option C: Générer avec Node.js**
```bash
npm install sharp
# Script pour convertir (voir convert-images.js)
```

### Étape 2: Ajouter vos vraies images
Remplacer les fichiers SVG par:
- **icon-192.png**: Logo 192×192 (pour PWA)
- **icon-512.png**: Logo 512×512 (pour PWA)
- **hero.jpg**: Image accueil (1200×600, <200KB)
- **produit-*.jpg**: Images produits
- **galerie-*.jpg**: Images galerie
- **blog-*.jpg**: Images articles

### Optimisation images
```bash
# Installer ImageOptim ou utiliser https://tinypng.com
# Réduire taille avant upload pour meilleure performance
```

---

## <a id="netlify"></a>6. 🚀 DÉPLOIEMENT NETLIFY

### Étape 1: Connecter le repo Git
1. Aller sur https://netlify.com
2. Cliquer sur **"New site from Git"**
3. Choisir GitHub/GitLab/Bitbucket
4. Sélectionner votre repo

### Étape 2: Configurer les paramètres de build
```toml
# netlify.toml (déjà configuré)
[build]
  publish = "."
  functions = "netlify/functions"
```

### Étape 3: Ajouter les variables d'environnement
Dans **Site settings → Build & deploy → Environment:**
```
STRIPE_PUBLIC_KEY = pk_live_XXXX
STRIPE_SECRET_KEY = sk_live_XXXX
SENDGRID_API_KEY = SG.XXXX
SENDGRID_FROM_EMAIL = noreply@charisferme.fr
GA_ID = G-XXXX
```

### Étape 4: Configurer le domaine
1. **Domains → Custom domain**
2. Ajouter `charisferme.fr`
3. Suivre les instructions DNS

### Étape 5: Activer HTTPS
- Netlify génère automatiquement un certificat SSL Let's Encrypt ✅

### Étape 6: Tester le déploiement
```bash
# Build local avant de pusher
npm run build
# ou simplement: git push

# Vérifier sur Netlify Dashboard → Deploys
```

---

## <a id="sécurité"></a>7. 🔒 SÉCURITÉ & VÉRIFICATIONS

### Checklist avant la mise en production

- [ ] ✅ `.env` NOT commité (vérifier .gitignore)
- [ ] ✅ Clés Stripe utilisées (test → production)
- [ ] ✅ SendGrid configuré avec domaine vérifié
- [ ] ✅ Google Analytics connecté
- [ ] ✅ Images optimisées et chargées
- [ ] ✅ HTTPS activé sur le domaine
- [ ] ✅ PWA testée (Application tab dans DevTools)
- [ ] ✅ Formulaires testés (contact, panier, paiement)
- [ ] ✅ Mode sombre testé sur tous les navigateurs
- [ ] ✅ Mobile responsive vérifié

### Commandes utiles

```bash
# Vérifier les fichiers sensibles avant commit
git status
git check-ignore -v .env

# Simuler build Netlify localement
npm run build

# Vérifier les logs Netlify
# https://app.netlify.com/sites/YOUR_SITE/deploys
```

### Contacts de support

- **Stripe**: https://support.stripe.com
- **SendGrid**: https://support.sendgrid.com
- **Netlify**: https://support.netlify.com
- **Google Analytics**: https://support.google.com/analytics

---

## 📞 SUPPORT CHARISFERME

Pour toute question:
- Email: `contact@charisferme.fr`
- Téléphone: `+33600000000`
- WhatsApp: `https://wa.me/33600000000`

---

**Dernière mise à jour:** 14 juin 2026 ✅
