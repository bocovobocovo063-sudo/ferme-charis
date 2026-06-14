# 📦 CHARISFERME - Guide Gestion des Commandes

**Date:** 17 mai 2026  
**Statut:** ✅ Système complet opérationnel

---

## 🎯 Vue d'ensemble

Vous avez maintenant **2 modes de commande** disponibles pour vos clients:

### **Mode 1: 📧 Commande par Email (Simple)**
- Client remplissez le formulaire panier
- Clique sur **"📧 Envoyer la commande"**
- Commande transmise par email à `contact@charisferme.fr`
- **Vous gérez** le suivi et paiement

### **Mode 2: 💳 Paiement Immédiat (Stripe)**
- Client remplissez le formulaire panier
- Clique sur **"💳 Payer maintenant"**
- Redirection vers page paiement sécurisée
- Paiement Stripe instantané
- Commande confirmée automatiquement

---

## 📊 Flux Technique

```
┌─────────────────────────────────────┐
│    CLIENT PANIER (produits.html)    │
└──────────────┬──────────────────────┘
               │
         ┌─────┴─────┐
         │           │
    📧 EMAIL    💳 PAIEMENT
         │           │
         ▼           ▼
  ┌─────────────┐   ┌──────────────┐
  │   API:      │   │   Stripe     │
  │submit-order │   │  checkout    │
  └──────┬──────┘   └────────┬─────┘
         │                   │
         ▼                   ▼
    ┌────────────┐    ┌──────────────┐
    │ Email:     │    │ Paiement OK? │
    │Contact     │    └────────┬─────┘
    │+Client     │             │
    └────────────┘        ┌────┴─────┐
         │                │          │
         ▼                ▼          ▼
    ┌──────────┐   ┌──────────┐  ERREUR
    │ MERCI.   │   │ MERCI.   │  │
    │ PAGE     │   │ PAGE     │  ▼
    │order     │   │payment   │ RECOURRIER
    └──────────┘   └──────────┘
```

---

## 📧 Flux Email (Mode Simple)

### **Quand le client clique "Envoyer la commande":**

1. **Validation** des champs (nom, email, téléphone)
2. **Appel** à `/.netlify/functions/submit-order` (POST)
3. **Généré**: Numéro commande (`CMD-1234567890`)
4. **Emails envoyés:**
   - ✅ À vous: `contact@charisferme.fr` (détails complets)
   - ✅ Au client: Confirmation + numéro de référence

### **Email reçu par vous:**
```
ID Commande: CMD-1234567890
Client: Jean Dupont
Email: jean@example.com
Téléphone: 06 00 00 00 00
Adresse: 12 rue de la Ferme, 75000 Paris

Articles:
• Légumes de saison 🥬 × 2
• Fromages & Laitiers 🧀 × 1
• Viandes & Volailles 🐓 × 1

Montant Total: €32.50

Message client: Pas d'oignons, merci!

---
Répondre directement à: jean@example.com
```

### **Email reçu par le client:**
```
✅ VOTRE COMMANDE A ÉTÉ REÇUE

Merci Jean!

Numéro de référence: CMD-1234567890
(Conservez ce numéro)

Récapitulatif:
• Légumes de saison 🥬 × 2 = €5.00
• Fromages & Laitiers 🧀 × 1 = €3.80
...

Montant: €32.50

📧 PROCHAINES ÉTAPES:
Notre équipe vous contactera sous 24h pour:
✓ Confirmer votre commande
✓ Organiser la livraison
✓ Traiter le paiement (si nécessaire)

Questions?
Téléphone: 06 00 00 00 00
Email: contact@charisferme.fr
```

---

## 💳 Flux Paiement (Mode Stripe)

### **Quand le client clique "Payer maintenant":**

1. **Sauvegarde** du panier en `localStorage`
2. **Redirection** vers `checkout.html`
3. **Remplissage** formulaire adresse + carte
4. **Paiement** Stripe sécurisé
5. **Confirmation** automatique

**Flux détaillé:**
```
produits.html (panier)
    ↓
Clic "Payer maintenant"
    ↓
localStorage: panier sauvegardé
    ↓
checkout.html (formulaire + Stripe)
    ↓
Client remplit adresse + carte
    ↓
Appel /.netlify/functions/create-payment-intent
    ↓
Stripe traite paiement
    ↓
Succès? → merci.html?type=cart
Erreur? → Message erreur dans checkout
```

---

## ⚙️ Configuration Requise

### **Pour les emails automatiques:**

**Option 1: Netlify + SendGrid (Recommandé)**
1. Créer compte SendGrid: https://sendgrid.com
2. Générer API key
3. Ajouter dans Netlify Environment:
   ```
   SENDGRID_API_KEY = SG.VOTRE_CLE
   SENDGRID_FROM_EMAIL = contact@charisferme.fr
   ```

**Option 2: Gmail**
1. Activer 2FA sur compte Gmail
2. Générer mot de passe d'app: https://myaccount.google.com/apppasswords
3. Ajouter dans Netlify Environment:
   ```
   SMTP_HOST = smtp.gmail.com
   SMTP_USER = contact@charisferme.fr
   SMTP_PASS = votre-mot-de-passe-app
   ```

### **Pour le paiement Stripe:**
```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLIC_KEY = pk_test_...
```

---

## 📱 Interface Client

### **Panier (Avant)**
```
[Article 1] [Article 2] [Article 3]
         ↓
     PANIER PANIER
         ↓
   [Mon Panier] (badge: 3)
```

### **Panier (Après - Tiroir)**
```
🛒 MON PANIER
───────────────
Légumes 🥬 × 2
Fromages 🧀 × 1
Viandes 🐓 × 1
───────────────

Vos coordonnées:
[Nom] [Téléphone]
[Email]
[Adresse]
[Date souhaitée]
[Message]

┌─────────────────────────────┐
│ 📧 Envoyer la commande      │
├─────────────────────────────┤
│ 💳 Payer maintenant (Stripe)│
└─────────────────────────────┘
```

---

## 🔍 Suivi des Commandes

### **En tant que gestionnaire:**

1. **Recevoir email** avec détails commande
2. **Noter le numéro** (ex: `CMD-1234567890`)
3. **Traiter manuellement:**
   - 📞 Appeler le client pour confirmer
   - 📍 Organiser livraison
   - 💰 Traiter paiement (si email)
   - ✅ Marquer comme confirmée
   - 🚚 Préparer livraison
   - ✉️ Envoyer devis si nécessaire

### **Statuts possibles:**
- **REÇUE**: Email envoyé, en attente de confirmation
- **CONFIRMÉE**: Client appelé, détails OK
- **PAIÉE**: Paiement reçu (Stripe ou manuellement)
- **PRÉPARÉE**: Articles mis de côté
- **LIVRÉE**: Produits remis au client

---

## 🛠️ Dépannage

### **❌ Email non reçu**
```
Vérifier:
□ Configuration SENDGRID_API_KEY ou SMTP
□ Logs Netlify: Site settings → Functions
□ Spam: Vérifier dossier spam
□ Adresse: contact@charisferme.fr correcte?
```

### **❌ "Une erreur est survenue"**
```
Solution:
□ Vérifier navigateur console (F12)
□ Vérifier champs requis (nom, email, téléphone)
□ Vérifier panier pas vide
□ Vérifier connexion internet
□ Réessayer après 30 secondes
```

### **❌ Paiement Stripe échoue**
```
Vérifier:
□ Clés Stripe configurées
□ Mode test vs prod
□ Numéro carte valide (4242...)
□ Pas d'expired
□ Zone de livraison valide
```

---

## 📊 Statistiques à Suivre

**À noter chaque mois:**
- Nombre de commandes email
- Nombre de commandes Stripe
- Montant total email
- Montant total Stripe
- Taux d'abandon (panier pas validé)
- Temps moyen traitement

---

## 🚀 Optimisations Futures

### **Phase 2 (Court terme)**
- [ ] Webhooks Stripe (suivi automatique)
- [ ] SMS de confirmation aux clients
- [ ] Système de devis automatisé

### **Phase 3 (Moyen terme)**
- [ ] Compte client (historique commandes)
- [ ] Paiement par virement (alternative Stripe)
- [ ] API pour partenaires

### **Phase 4 (Long terme)**
- [ ] Appli mobile
- [ ] Dashboard analytics
- [ ] Intégration accounting (Sage, etc.)

---

## 📞 Support & Contrats

**Email:** contact@charisferme.fr  
**Téléphone:** 06 00 00 00 00  
**Docs Stripe:** https://stripe.com/docs  
**Docs Netlify:** https://docs.netlify.com  

---

## ✅ Checklist Lancement

- [x] 2 modes de commande (email + Stripe)
- [x] Fonction Netlify submit-order créée
- [x] Fonction Netlify create-payment-intent améliorée
- [x] Validations client complètes
- [x] Pages merci adaptées
- [ ] Emails de configuration (SendGrid ou Gmail)
- [ ] Test mode email
- [ ] Test mode paiement Stripe
- [ ] Formation équipe sur gestion
- [ ] Monitoring actif

---

**Dernière mise à jour:** 17 mai 2026  
**Statut:** 🟢 READY TO USE
