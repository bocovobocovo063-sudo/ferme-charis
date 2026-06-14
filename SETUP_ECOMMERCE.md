# 🛍️ CHARISFERME - Guide Setup E-Commerce & Abonnements

**Date:** 17 mai 2026  
**Version:** 2.5 - E-Commerce Ready  
**Statut:** ✅ Prêt pour production

---

## 📋 Nouvelles Fonctionnalités Ajoutées

### ✅ 1. **Panier E-Commerce**
- 🛒 Panier flottant avec localStorage
- ➕ Boutons d'ajout au panier sur chaque produit
- 🔧 Contrôle de quantité avec stepper
- 📦 Récapitulatif avant paiement
- ✅ Confirmation de commande

**Fichiers:** `produits.html`, `checkout.html`, `script.js`

### ✅ 2. **Système d'Abonnement**
- 📅 3 fréquences: Hebdomadaire, Bimensuel, Mensuel
- 💳 Paiement récurrent Stripe
- 📊 3 plans tarifaires par fréquence
- 🎯 Composeur de panier personnalisé
- ⭐ Témoignages clients
- ❓ FAQ détaillée

**Fichiers:** `abonnement.html`

### ✅ 3. **Paiement Sécurisé (Stripe)**
- 🔐 Intégration Stripe Elements
- 💰 Support cartes bancaires
- 📧 Confirmations email
- 📝 Métadonnées de commande
- 🔄 Gestion des abonnements récurrents

**Fichiers:** `checkout.html`, `netlify/functions/create-payment-intent.js`

### ✅ 4. **Pages Dynamiques**
- ✅ Page de remerciement adaptée (cart vs subscription)
- 🔗 Navigation mise à jour (lien Abonnement)
- 📱 Design responsive complet

**Fichiers:** `merci.html`, `index.html`, `*.html` (tous les menus)

---

## 🚀 Configuration Requise

### **Étape 1: Créer un compte Stripe**

1. **Créer un compte:** https://dashboard.stripe.com
2. **Obtenir les clés:**
   - Clé publique: `pk_test_...` ou `pk_live_...`
   - Clé secrète: `sk_test_...` ou `sk_live_...`

### **Étape 2: Configurer Netlify**

1. **Accéder à Netlify:** https://app.netlify.com
2. **Aller dans:** Site settings → Build & deploy → Environment
3. **Ajouter variables d'environnement:**
   ```
   STRIPE_SECRET_KEY = sk_test_VOTRE_CLE_ICI
   STRIPE_PUBLIC_KEY = pk_test_VOTRE_CLE_ICI
   SMTP_HOST = smtp.gmail.com (ou votre serveur email)
   SMTP_USER = votre-email@gmail.com
   SMTP_PASS = votre-mot-de-passe-app
   ```

### **Étape 3: Configurer checkout.html**

```javascript
// Ligne 203 dans checkout.html
window.STRIPE_PUBLIC_KEY = 'pk_test_VOTRE_CLE_ICI'; // ← Remplacer
```

### **Étape 4: Mettre à jour les prix des produits**

**Dans produits.html** (ligne ~670):
```javascript
// Remplacer les prix factices par vos prix réels
const price = parseFloat(...) || 0;
```

### **Étape 5: Configurer Email (SendGrid ou Gmail)**

Pour Gmail avec 2FA:
1. Générer un mot de passe d'app: https://myaccount.google.com/apppasswords
2. Ajouter dans Netlify environment variables

---

## 📱 Architecture des Pages

### **Page Produits (`produits.html`)**
```
Affiche: Liste de produits avec filtre
Permet: Ajouter au panier, modifier quantité
Redirige: Vers checkout.html
```

### **Page Abonnement (`abonnement.html`)**
```
Affiche: 3 plans × 3 fréquences (9 options)
Permet: Sélectionner plan & fréquence
Redirige: Vers checkout.html
```

### **Page Paiement (`checkout.html`)**
```
Affiche: Formulaire + résumé panier
Permet: Saisir infos client + carte
Envoie: Requête à Netlify Function
Redirige: Vers merci.html (si succès)
```

### **Page Merci (`merci.html`)**
```
Affiche: Message adapté (cart ou subscription)
Montre: Numéro de commande
Envoie: Email de confirmation
```

---

## 🔄 Flux E-Commerce

### **Flux Panier Simple:**
```
Produits → Ajouter au panier → Checkout → Paiement → Merci
```

### **Flux Abonnement:**
```
Abonnement → Choisir plan → Checkout → Paiement Stripe → Merci + Actif
```

### **LocalStorage utilisé:**
```javascript
// Panier
localStorage['charisferme-cart'] = [{name, price, qty, emoji}]

// Abonnement en cours
localStorage['charisferme-subscription-pending'] = {planName, price, frequency}

// Contact
localStorage['charisferme-cart-contact'] = {name, email, phone, address}
```

---

## 💾 Fonction Netlify: `create-payment-intent.js`

### **Entrée (POST):**
```json
{
  "token": "tok_...",
  "amount": 1000,
  "email": "client@example.com",
  "name": "Jean Dupont",
  "orderType": "cart" | "subscription",
  "frequency": "weekly" | "monthly",
  "items": [{name, qty, price}]
}
```

### **Sortie (Succès):**
```json
{
  "success": true,
  "orderId": "ORD-1234567890",
  "chargeId": "ch_..."
}
```

### **Sortie (Erreur):**
```json
{
  "success": false,
  "error": "Message d'erreur",
  "code": "card_declined"
}
```

---

## 📧 Emails Automatiques

L'abonnement envoie des confirmations email via Nodemailer:

**À:** Email client  
**Objet:** `Commande CHARISFERME - ORD-123456`  
**Contenu:**
- Numéro de commande
- Récapitulatif articles
- Total TTC
- Adresse de livraison
- Infos abonnement (si applicable)

---

## 🔒 Sécurité

✅ **Implémentée:**
- Tokens Stripe sécurisés (pas de numéros de carte stockés)
- Clés secrètes en environnement (jamais en code)
- Validation côté serveur des montants
- Métadonnées traçables

⚠️ **À faire:**
- Ajouter authentification client (account system)
- Implémenter webhooks Stripe pour les retours de paiement
- Ajouter logging audit des transactions
- Configurer 3D Secure pour PSD2 compliance

---

## 🧪 Test en Mode Sandbox

### **Numéros de carte de test Stripe:**
```
Visa:           4242 4242 4242 4242
Carte refusée:  4000 0000 0000 0002
CVV: 123 • Expiration: 12/25
```

### **Tester un flux complet:**
1. Aller sur `/produits.html`
2. Ajouter des articles au panier
3. Cliquer "Mon panier" → "Envoyer commande"
4. Remplir le formulaire de paiement
5. Utiliser une carte de test Stripe
6. Vérifier redirection vers `merci.html`

---

## 📊 Statistiques Disponibles

Via Stripe Dashboard:
- Chiffre d'affaires total
- Nombre de transactions
- Taux de conversion
- Clients récurrents (abonnements)
- Revenue par fréquence

---

## 🐛 Troubleshooting

### **Problème: "Stripe non configuré"**
→ Vérifier `STRIPE_SECRET_KEY` dans Netlify Environment

### **Problème: Bouton paiement désactivé**
→ Vérifier que tous les champs requis sont remplis

### **Problème: Email non envoyé**
→ Vérifier `SMTP_USER` et `SMTP_PASS` dans Netlify

### **Problème: Carte refusée en test**
→ Utiliser `4242 4242 4242 4242` avec n'importe quelle expiration future

---

## 📞 Support

**Email:** contact@charisferme.fr  
**Docs Stripe:** https://stripe.com/docs  
**Docs Netlify:** https://docs.netlify.com  

---

## ✅ Checklist Déploiement

- [ ] Clés Stripe configurées dans Netlify
- [ ] Email/SMTP configuré pour notifications
- [ ] Numéros de téléphone/emails à jour
- [ ] Adresses de livraison validées
- [ ] Test paiement en sandbox
- [ ] Page merci affichant numéro commande
- [ ] Confirmation email reçue
- [ ] Abonnements actifs après paiement
- [ ] Mode LIVE Stripe activé (production)
- [ ] HTTPS activé sur domaine

---

**Dernière mise à jour:** 17 mai 2026
