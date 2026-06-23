# Test Manual - Stripe Payment Intents (sans netlify dev)

## Prérequis
- Curl installé (PowerShell built-in ou Git Bash)
- Clés Stripe TEST
- Un serveur HTTP local (Python, PHP, ou VS Code LiveServer)

---

## Méthode 1: Tester avec Python HTTP Simple

### Lancer un serveur HTTP local
```bash
# Dans le dossier c:\Users\bocov\SITE FERME
python -m http.server 8000
```

Puis ouvrir: http://localhost:8000/test-payment.html

---

## Méthode 2: Tester avec Curl (API Netlify Function)

### 1️⃣ Tester create-payment-intent

Créer un PaymentIntent:
```bash
curl -X POST http://localhost:3001/.netlify/functions/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2999,
    "email": "test@example.com",
    "name": "Jean Dupont",
    "address": "123 Rue Test",
    "city": "Paris",
    "postal": "75001",
    "phone": "06123456789",
    "orderType": "cart",
    "items": [
      {"name": "Panier Test", "price": 29.99, "qty": 1}
    ]
  }'
```

Réponse attendue:
```json
{
  "success": true,
  "orderId": "ORD-1718632800000",
  "clientSecret": "pi_test_XXXX_secret_XXXX",
  "paymentIntentId": "pi_test_XXXX",
  "message": "PaymentIntent créé, confirmer côté client avec Stripe.js"
}
```

### 2️⃣ Tester submit-order (emails)

```bash
curl -X POST http://localhost:3001/.netlify/functions/submit-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "06123456789",
    "address": "123 Rue Test, 75001 Paris",
    "items": [
      {"name": "Produit A", "emoji": "🛒", "qty": 2, "price": 15.00}
    ],
    "type": "paid",
    "paymentIntentId": "pi_test_XXXX"
  }'
```

Réponse attendue:
```json
{
  "success": true,
  "commandeId": "CMD-1718632800000",
  "message": "Commande reçue! Nous vous contacterons sous 24h.",
  "emailVia": "console_log",
  "emailSent": false
}
```

---

## Méthode 3: Tester dans le Browser (test-payment.html)

J'ai créé `test-payment.html` qui simule le flux complet côté client:

1. Remplir le formulaire test
2. Cliquer "Créer PaymentIntent" (teste create-payment-intent)
3. Observer la réponse client_secret
4. (Optionnel) Confirmer avec Stripe.js si clés valides

Ouvrir: http://localhost:8000/test-payment.html

---

## Cartes Stripe de Test

| Cas | Carte | Expiration | CVC |
|-----|-------|-----------|-----|
| ✅ Succès | 4242 4242 4242 4242 | 12/50 | 123 |
| ❌ Décliné | 4000 0000 0000 0002 | 12/50 | 123 |
| 3️⃣ 3DS requis | 4000 0025 0000 3155 | 12/50 | 123 |

---

## Variables d'Environnement pour Tests

Créer `.env` local:
```
STRIPE_SECRET_KEY=sk_test_votre_clé_secrète_test
STRIPE_PUBLISHABLE_KEY=pk_test_votre_clé_publique_test
SENDGRID_API_KEY=  # Laisser vide pour logs console
SENDGRID_FROM_EMAIL=noreply@charisferme.fr
NODE_VERSION=18
```

---

## Logs à Vérifier

### Terminal Netlify Dev
- ✅ "PaymentIntent créé avec ID: pi_test_..."
- ✅ "Email SendGrid envoyé à..."  ou "Email console log envoyé"
- ❌ "Erreur Stripe" = clé manquante ou invalide

### Browser Console (F12)
- ✅ "Mode TEST Stripe (localhost)"
- ✅ "PaymentIntent créé, confirmer côté client avec Stripe.js"
- ❌ "Erreur: Stripe non configuré" = STRIPE_PUBLISHABLE_KEY manquant

---

## Checklist Test

- [ ] Clés Stripe TEST obtenues (https://dashboard.stripe.com/apikeys)
- [ ] `.env` créé avec clés TEST
- [ ] Serveur HTTP lancé sur http://localhost:8000
- [ ] test-payment.html accessible
- [ ] Créer PaymentIntent fonctionne (reçoit client_secret)
- [ ] Formulaire accepte les données de test
- [ ] Logs console affichent les bonnes variables

---

## Troubleshooting

### "CORS Error" lors de l'appel API
→ S'assurer que netlify.toml a `Access-Control-Allow-Origin: *`

### "PaymentIntent créé mais confirmCardPayment échoue"
→ Stripe.js non chargé ou clé publique invalide
→ Vérifier F12 → Network que Stripe.js est chargé depuis cdn.stripe.com

### "create-payment-intent retourne 500"
→ Vérifier `.env` → STRIPE_SECRET_KEY présent
→ Vérifier que netlify/functions/create-payment-intent.js existe

---

## Déploiement Production

Une fois tests OK local:

1. Configurer clés LIVE Stripe dans Netlify UI
2. Configurer SENDGRID_API_KEY dans Netlify UI
3. Git push pour redéployer
4. Tester sur domaine production

Voir: [SETUP_STRIPE_PAYMENT_INTENTS.md](./SETUP_STRIPE_PAYMENT_INTENTS.md)
