# 🚀 GUIDE DE CONFIGURATION NETLIFY

## **1️⃣ DÉPLOIEMENT INITIAL**

### Prérequis
- ✅ Compte Netlify (https://app.netlify.com)
- ✅ Compte Stripe (https://stripe.com)
- ✅ GitHub repo avec code

### Déployer sur Netlify
```bash
# Option A: Git Push (recommandé)
1. Push le code sur GitHub
2. Aller sur app.netlify.com → Add new site → Import an existing project
3. Sélectionner repo GitHub
4. Cliquer "Deploy site"

# Option B: Drag & Drop
1. Zipper le dossier du site
2. Glisser-déposer sur app.netlify.com
```

**Netlify URL généré:** `https://charisferme-xxxx.netlify.app`

---

## **2️⃣ CONFIGURER LES VARIABLES D'ENVIRONNEMENT**

### Étapes:
1. **Aller dans:** Site settings → Build & deploy → Environment
2. **Cliquer:** "Edit variables"
3. **Ajouter ces variables:**

| Variable | Valeur | Type |
|----------|--------|------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Secret (clé live) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Public (clé live) |
| `FORM_EMAIL` | `contact@charisferme.fr` | Public |
| `NODE_ENV` | `production` | Public |

### Obtenir clés Stripe:
1. Aller https://dashboard.stripe.com/
2. Cliquer "Developers" → "API keys"
3. Copier "Secret key" (sk_live_...)
4. Copier "Publishable key" (pk_live_...)
5. Coller dans Netlify

---

## **3️⃣ CONFIGURER LES FORMULAIRES NETLIFY**

### Formulaires dans index.html:
Tous les formulaires ont déjà `data-netlify="true"` et `name="..."`:

✅ **contact** - Formulaire contact  
✅ **newsletter** - Newsletter  
✅ **order** - Commande  
✅ **devis** - Demande devis  
✅ **reservation** - Réservation  

### Notifications Email:
1. **Aller dans:** Forms → Select form (ex: "contact")
2. **Cliquer:** "Notifications"
3. **Ajouter email:** contact@charisferme.fr
4. **Créer alertes pour chaque form**

### Test Formulaires:
```bash
# Avant deploy:
# Remplir formulaires en local (préview)
# Après deploy:
# Soumettre sur site en production
# Vérifier dans Netlify: Forms → Submissions
```

---

## **4️⃣ CONFIGURER STRIPE EN PRODUCTION**

### Dans la fonction create-payment-intent.js:
✅ Déjà configurée pour:
- Lire `STRIPE_SECRET_KEY` depuis env
- Créer PaymentIntents sécurisés
- Gérer les erreurs
- Retourner `clientSecret`

### Test de paiement:
**Avant de dépasser en production, utiliser:**
- Clés de test Stripe (pk_test_..., sk_test_...)
- Numéro carte test: `4242 4242 4242 4242`
- Expiration: n'importe (future)
- CVC: n'importe (3 chiffres)

### Passer en production:
1. Générer clés LIVE dans Stripe Dashboard
2. Ajouter STRIPE_SECRET_KEY (live) dans Netlify env
3. Changer pk_test_ par pk_live_ dans le script Stripe (index.html ligne ~1250)
4. Deployer
5. **Tester avec vrai paiement** (montant minimum 0.50€)

---

## **5️⃣ CONFIGURER DOMAINE PERSONNALISÉ**

### Lier domaine custom:
1. **Site settings → Domain management**
2. **Primary domain** → Entrer `charisferme.fr`
3. **Ajouter enregistrements DNS** (fournis par Netlify):
   - Type: ALIAS
   - Nom: @
   - Valeur: [fourni par Netlify]

### SSL/HTTPS:
✅ Automatique avec Let's Encrypt (Netlify)

---

## **6️⃣ VÉRIFIER LA CONFIGURATION**

### Checklist:
- [ ] Site déployé et accessible
- [ ] Formulaires soumettent sans erreur
- [ ] Notifications email reçues
- [ ] Fonction Stripe répond (POST /.netlify/functions/create-payment-intent)
- [ ] Variables d'env définies dans Netlify
- [ ] HTTPS actif (cadenas vert)
- [ ] Domaine personnalisé configuré

### Logs & Debugging:
```
Netlify UI:
- Aller dans: Deployments → Logs
- Chercher: "Function" pour logs serverless
- Chercher: "Error" pour erreurs
- Cliquer deploy pour détails
```

---

## **7️⃣ FORMULAIRES ACTUELS & ACTIONS**

| Formulaire | Action | Email Destination |
|-----------|--------|------------------|
| **Contact** | Demande devis/info | contact@charisferme.fr |
| **Newsletter** | Abonnement | contact@charisferme.fr |
| **Order** | Commande produits | contact@charisferme.fr |
| **Devis** | Devis professionnel | contact@charisferme.fr |
| **Reservation** | Réservation activité | contact@charisferme.fr |

---

## **8️⃣ MONITORING EN PRODUCTION**

### Analytics:
- **Netlify Analytics:** Site → Analytics
- **Google Analytics:** (À configurer via GA4)
- **Stripe Dashboard:** Revenue, transactions

### Alertes:
- ✅ Failed deployments
- ✅ Form submissions errors
- ✅ Function invocation errors
- ⚠️ (À configurer)

### Backups:
```bash
# Sauvegarder régulièrement:
- Code source (GitHub)
- Données soumissions (exporter depuis Netlify Forms)
- Données Stripe (exporter depuis Stripe Dashboard)
```

---

## **RACCOURCIS NETLIFY**

```
Dashboard: https://app.netlify.com/sites/charisferme-xxxx
Site deploy: https://charisferme-xxxx.netlify.app
Domain: https://charisferme.fr

Stripe: https://dashboard.stripe.com/
GitHub: [votre repo]
```

---

**✨ Configuration Netlify complète ! 🎉**
