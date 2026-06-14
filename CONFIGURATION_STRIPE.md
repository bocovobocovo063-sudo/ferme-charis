# 💳 GUIDE ACTIVATION STRIPE PRODUCTION

## **IMPORTANT: CHECKLIST AVANT PRODUCTION**

❌ **NE PAS PASSER EN PRODUCTION SANS FAIRE:**
- [ ] Tester avec clés TEST (pk_test_, sk_test_)
- [ ] Tester paiements fictifs (4242 4242...)
- [ ] Vérifier emails de confirmation
- [ ] Tester tous les formulaires
- [ ] Activer HTTPS (✅ Netlify le fait)
- [ ] Configurer domaine custom

---

## **1️⃣ OBTENIR CLÉS STRIPE LIVE**

### Accès Stripe Dashboard:
1. **Aller:** https://dashboard.stripe.com/
2. **Se connecter** avec votre compte Stripe
3. **Cliquer:** Mode "Live" (en haut à gauche)
   - Actuellement: Mode "Test" (bleu)
   - Passer en: Mode "Live" (orange)

### Trouver les clés:
1. **Aller:** Developers → API Keys
2. **En haut:** Sélectionner "Live" mode (toggle)
3. **Copier:**
   - **Secret key:** `sk_live_...`
   - **Publishable key:** `pk_live_...`

⚠️ **IMPORTANT:** Secret key = top secret, ne JAMAIS partager

---

## **2️⃣ CONFIGURER NETLIFY**

### Ajouter variable d'environnement:

1. **Aller sur:** https://app.netlify.com/
2. **Site choisi:** CHARISFERME
3. **Site settings** → **Build & deploy** → **Environment**
4. **Edit variables**
5. **Ajouter:**
   ```
   Clé: STRIPE_SECRET_KEY
   Valeur: sk_live_... (la vraie clé)
   ```
6. **Save**

### Trigger redeploy:
- Le site se redéploiera automatiquement
- Vérifier dans "Deployments" que tout est OK

---

## **3️⃣ METTRE À JOUR CLÉ PUBLIQUE STRIPE**

### Dans index.html (fonction Stripe initiale):

**Chercher ligne ~1250:**
```javascript
const stripe = Stripe('pk_test_...');  // ← À changer
```

**Remplacer par:**
```javascript
const stripe = Stripe('pk_live_...');  // ← Clé live
```

### Ou laisser la clé test:
- ✅ Ça marche aussi (moins sécurisé)
- ✅ Stripe détermine live/test par STRIPE_SECRET_KEY

**RECOMMANDÉ:** Mettre clé live partout

---

## **4️⃣ PASSER EN PRODUCTION**

### Checklist déploiement:
- [ ] `STRIPE_SECRET_KEY` définie dans Netlify env
- [ ] Clé Stripe publi changée (ou pas, ça marche)
- [ ] Netlify redéployé (auto après env change)
- [ ] HTTPS activé (✅ auto sur Netlify)
- [ ] Domaine custom configuré (facultatif)

### Déployer:
```bash
# Option 1: Automatic (Git push)
git commit -m "Stripe production mode"
git push origin main
# Netlify redéploie automatiquement

# Option 2: Manual deploy
# Netlify UI → Deployments → Trigger deploy
```

---

## **5️⃣ TESTER PAIEMENTS PRODUCTION**

### Numéros de test Stripe (Mode Live):
❌ **NE PAS utiliser 4242 4242... en LIVE**

❓ **Stripe ne permet PAS de tester en LIVE**
→ Utiliser **compte test Stripe** ou **Stripe Sandbox**

### Solution:
1. **Aller:** Stripe Dashboard
2. **Basculer en "Test" mode** pour tests
3. **Utiliser carte 4242 4242 4242 4242**
4. **Basculer en "Live" mode** pour vraiment charger

### Tester transaction réelle:
- Montant: 0,50€ (minimum autorisé)
- Carte: Votre vraie Mastercard/Visa
- Ça débitera vraiment
- Email de confirmation Stripe reçu

---

## **6️⃣ MONITORING PAIEMENTS**

### Dashboard Stripe:
- **Payments:** Liste toutes les transactions
- **Customers:** Clients créés
- **Settings:** Webhooks (optionnel mais recommandé)

### Configurer Webhooks (optionnel):
1. **Aller:** Developers → Webhooks
2. **Ajouter endpoint:**
   - URL: `https://charisferme.fr/.netlify/functions/webhook-stripe`
   - Événements: payment_intent.succeeded, payment_intent.payment_failed
3. **Copier Signing secret**
4. **Ajouter dans Netlify env:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Avantages webhooks:
- ✅ Notifications temps réel
- ✅ Éviter les timeouts
- ✅ Mieux que polling
- ❌ Plus complexe à implémenter

---

## **7️⃣ CHECKLIST AVANT/APRÈS PROD**

### Avant (Mode Test):
- [ ] Paiement 4242 4242 4242 4242 réussit
- [ ] Email confirmation reçu
- [ ] Transaction visible dans Stripe Dashboard (Test)
- [ ] Formulaires fonctionnent
- [ ] HTTPS actif

### Après (Mode Live):
- [ ] Paiement test réel (0,50€ débité)
- [ ] Email confirmation reçu
- [ ] Transaction visible dans Stripe Dashboard (Live)
- [ ] Pas d'erreur dans Netlify logs
- [ ] Client reçoit confirmation

---

## **8️⃣ TROUBLESHOOTING**

### "Error: Stripe not configured"
```
→ STRIPE_SECRET_KEY manquante dans Netlify env
→ Ajouter via Netlify UI et redéployer
```

### "Invalid API key"
```
→ Clé copiée incorrectement
→ Vérifier sk_live_ (pas sk_test_)
→ Pas d'espace avant/après
```

### "Card declined"
```
→ Mode Test: Utiliser 4242 4242...
→ Mode Live: Vrai numéro de carte
→ Vérifier date expiration/CVC
```

### Paiement ne s'enregistre pas
```
→ Vérifier Netlify logs (Deployments)
→ Vérifier Stripe Dashboard (Events)
→ Vérifier email configuration
```

---

## **CLÉS STRIPE EXEMPLE**

### Mode Test (apprentissage):
```
pk_test_51TTrQK... (public)
sk_test_51TTrQK... (secret)
```

### Mode Live (production):
```
pk_live_51TTrQK... (public)
sk_live_51TTrQK... (secret) ← À garder secret!
```

---

## **RACCOURCIS STRIPE**

- Dashboard: https://dashboard.stripe.com/
- API Keys: https://dashboard.stripe.com/apikeys
- Payments: https://dashboard.stripe.com/payments
- Webhooks: https://dashboard.stripe.com/webhooks
- Settings: https://dashboard.stripe.com/settings/business

---

**✨ Stripe production activé ! 💳**
