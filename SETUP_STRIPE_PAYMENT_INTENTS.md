# Configuration Stripe Payment Intents - CHARISFERME

## Vue d'ensemble
Ce guide explique comment configurer et tester le nouveau système de paiement Stripe Payment Intents (conforme SCA/3DS) sur CHARISFERME.

## Architecture

```
Flux Paiement (nouveau):
1. Frontend (checkout.html) → POST à /.netlify/functions/create-payment-intent
2. Serveur crée PaymentIntent via Stripe API → retourne client_secret
3. Frontend confirme paiement via stripe.confirmCardPayment() avec card element
4. Client gère les défis 3DS automatiquement
5. Après succès → appel submit-order pour emails + création commande
6. Redirection vers page merci
```

## Prerequisites
- Compte Stripe actif (https://stripe.com)
- Compte Netlify avec git connecté
- Node.js 18+ (local testing)
- Netlify CLI (`npm i -g netlify-cli`)

---

## 1️⃣ Configuration Stripe (obtenir les clés)

### Étapes :
1. Aller à https://dashboard.stripe.com/apikeys
2. Copier les deux clés (test ou live selon l'environnement):
   - **Publishable key**: `pk_test_...` ou `pk_live_...` (publique, côté client)
   - **Secret key**: `sk_test_...` ou `sk_live_...` (secrète, côté serveur uniquement)

### Test vs Production
| Environnement | Mode | Keys | Utilisation |
|---------------|------|------|------------|
| Développement | **TEST** | `pk_test_`, `sk_test_` | Tester localement avec cartes de test |
| Production | **LIVE** | `pk_live_`, `sk_live_` | Paiements réels sur Netlify |

### Cartes de test Stripe (en mode TEST)
```
Succès:        4242 4242 4242 4242
Déclinée:      4000 0000 0000 0002
3DS requise:   4000 0025 0000 3155
Expiration:    12/50
CVC:           123
```

---

## 2️⃣ Configuration Email (SendGrid ou SMTP)

### Option A: SendGrid (recommandé)
1. Créer compte gratuit: https://sendgrid.com
2. Aller à **Settings → API Keys**
3. Créer une nouvelle clé API (Full Access)
4. Copier la clé (commence par `SG.`)
5. Configurer expéditeur: **Settings → Sender Authentication** → ajouter domaine

### Option B: SMTP Alternatif (Gmail, autre)
```
Exemple Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votremail@gmail.com
SMTP_PASS=votre_app_password  (pas le mot de passe normal!)
```

---

## 3️⃣ Configuration Locale (.env)

Créer ou mettre à jour `.env` à la racine du projet:

```bash
# ===== STRIPE (obligatoire) =====
STRIPE_SECRET_KEY=sk_test_votre_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_votre_publishable_key

# ===== EMAIL (obligatoire) =====
SENDGRID_API_KEY=SG.votre_api_key
SENDGRID_FROM_EMAIL=noreply@charisferme.fr

# Optionnel (alternative SMTP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=votremail@gmail.com
# SMTP_PASS=votre_app_password

# ===== NODE VERSION (Netlify) =====
NODE_VERSION=18
```

⚠️ **IMPORTANT**: Ne jamais commiter `.env` → ajouter à `.gitignore`

---

## 4️⃣ Configuration Netlify (Production)

### Via interface Netlify:

1. Aller à **Dashboard → Site settings → Build & Deploy → Environment**
2. Ajouter les variables d'environnement:

| Clé | Valeur | Notes |
|-----|--------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Clé secrète LIVE |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Clé publique LIVE (si différente) |
| `SENDGRID_API_KEY` | `SG...` | API Key SendGrid |
| `SENDGRID_FROM_EMAIL` | `noreply@charisferme.fr` | Email expéditeur |
| `NODE_VERSION` | `18` | Version Node.js |

3. Redéployer le site (git push) pour appliquer

### Via Netlify CLI:
```bash
netlify env:set STRIPE_SECRET_KEY sk_live_...
netlify env:set SENDGRID_API_KEY SG...
```

---

## 5️⃣ Test Local avec `netlify dev`

### Installation
```bash
npm install -g netlify-cli
```

### Lancer le serveur local
```bash
netlify dev
```

Sortie attendue:
```
◈ Netlify Dev
◈ Functions server is listening on 3001
◈ Live URL: http://localhost:8888
```

### Tester le flux de paiement
1. Ouvrir http://localhost:8888/checkout.html
2. Remplir le formulaire avec données de test
3. Utiliser card test: `4242 4242 4242 4242` (succès)
4. Cliquer "Payer maintenant"
5. Observer les logs dans le terminal `netlify dev`:
   - ✅ PaymentIntent créé
   - ✅ Paiement confirmé
   - ✅ Email envoyé (ou log console si SendGrid manquant)
6. Redirection vers `merci.html` = succès ✓

### Tester 3DS
1. Utiliser card: `4000 0025 0000 3155`
2. Un popup de confirmation doit apparaître
3. Valider le paiement dans le popup
4. Doit être marqué `succeeded` après

---

## 6️⃣ Fichiers Modifiés

### Backend (functions Netlify)
- **`netlify/functions/create-payment-intent.js`**
  - ✅ Crée `PaymentIntent` (ancien: `Charges`)
  - ✅ Retourne `client_secret` pour confirmation côté client
  - ✅ Support abonnements (inchangé)

- **`netlify/functions/submit-order.js`**
  - ✅ Envoie emails après paiement confirmé
  - ✅ Utilise SendGrid ou SMTP

### Frontend
- **`checkout.html`**
  - ✅ Nouvelle logique: `stripe.confirmCardPayment(clientSecret, ...)`
  - ✅ Gère automatiquement 3DS/SCA
  - ✅ Appelle `submit-order` après succès
  - ✅ Suppression du token-based flow (ancien)

- **`config.js`**
  - ✅ À mettre à jour: `STRIPE_PUBLIC_KEY` (placeholder)

---

## 7️⃣ Checklist Déploiement

- [ ] Clés Stripe (test) générées et copiées
- [ ] `.env` créé localement avec clés test
- [ ] `netlify dev` lancé et fonctionne
- [ ] Flux paiement testé avec card `4242...` = succès
- [ ] 3DS testé avec card `4000 0025...`
- [ ] SendGrid configuré (ou SMTP alternatif)
- [ ] Emails de test reçus
- [ ] Clés LIVE générées dans Stripe Dashboard
- [ ] Variables Netlify configurées (STRIPE_SECRET_KEY, SENDGRID_API_KEY, etc.)
- [ ] Redéployé sur Netlify (`git push`)
- [ ] Test production avec petite transaction
- [ ] Vérifier les logs Netlify: **Site Analytics → Functions**

---

## 8️⃣ Troubleshooting

### "Erreur: Stripe non configuré"
→ Vérifier que `STRIPE_SECRET_KEY` est défini dans `.env` ou Netlify settings

### "PaymentIntent créé mais confirmCardPayment échoue"
→ S'assurer que `STRIPE_PUBLISHABLE_KEY` est correct dans `checkout.html`
→ Vérifier console browser (F12) pour erreurs CORS

### "Emails non envoyés"
→ Vérifier `SENDGRID_API_KEY` dans `.env`
→ Vérifier que le domaine est vérifié dans SendGrid (Sender Auth)
→ Voir les logs `netlify dev` pour détails d'erreur

### "3DS popup n'apparaît pas"
→ Carte utilisée ne requiert pas 3DS. Utiliser `4000 0025 0000 3155`
→ Vérifier que `stripe.confirmCardPayment()` est appelé correctement

### "Test local fonctionne, production échoue"
→ Vérifier clés LIVE utilisées (pas test)
→ Vérifier CORS dans Netlify (normalement `*` configuré)
→ Vérifier que git push a bien redéployé

---

## 9️⃣ Ressources

- [Stripe Docs: Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [SendGrid Docs](https://sendgrid.com/docs/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## 🔟 Prochaines Étapes (Optionnel)

- [ ] Ajouter webhook Stripe (`/netlify/functions/stripe-webhook.js`) pour sync paiements
- [x] Ajouter webhook Stripe (`/netlify/functions/stripe-webhook.js`) pour logging et sync paiements (créé)
- [ ] Persistance DB (Airtable / Firebase) pour suivi commandes
- [ ] Admin dashboard pour voir les commandes
- [ ] Tests automatisés pour functions (Jest)
- [ ] Rate limiting sur endpoints paiement

---

## ⚙️ Configuration Webhook Stripe (Netlify)

1. Dans le Dashboard Stripe → Developers → Webhooks, cliquez sur "Add endpoint".
2. URL endpoint: `https://<VOTRE_SITE>.netlify.app/.netlify/functions/stripe-webhook`
3. Sélectionnez les events: `payment_intent.succeeded`, `payment_intent.payment_failed` (au minimum).
4. Copiez le `Signing secret` fourni par Stripe (commence par `whsec_...`).
5. Dans Netlify → Site settings → Build & Deploy → Environment, ajoutez:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

6. Redéployez le site; Stripe signera maintenant les requêtes que la function `stripe-webhook` vérifiera.

Notes:
- Si `STRIPE_WEBHOOK_SECRET` n'est pas configuré, la function tentera de parser le payload sans vérification de signature (mode non sécurisé, uniquement pour tests).
- Pour production, configurez obligatoirement `STRIPE_WEBHOOK_SECRET` et testez avec l'outil "Send test webhook" dans Stripe.

**Version**: 1.0  
**Date**: 2026-06-18  
**Auteur**: CHARISFERME Team  
**Status**: ✅ Production Ready
