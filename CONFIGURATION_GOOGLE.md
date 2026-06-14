# 🔍 GUIDE GOOGLE SEARCH CONSOLE

## **1️⃣ CRÉER COMPTE GOOGLE SEARCH CONSOLE**

### Prérequis:
- ✅ Compte Google (Gmail)
- ✅ Site déployé (Netlify live)
- ✅ Domaine (charisferme.fr)

### Créer compte:
1. **Aller:** https://search.google.com/search-console/
2. **Se connecter** avec compte Google
3. **Cliquer:** "Start now"

---

## **2️⃣ AJOUTER PROPRIÉTÉ (PROPERTY)**

### Option A: Domaine (recommandé)
1. **Cliquer:** "URL prefix" → "Domain"
2. **Entrer:** `charisferme.fr` (sans https://)
3. **Cliquer:** "Continue"
4. **Vérifier domaine** via DNS TXT record

### Option B: URL Prefix
1. **Cliquer:** "URL prefix"
2. **Entrer:** `https://charisferme.fr/`
3. **Cliquer:** "Continue"
4. **Vérifier** via HTML file upload

### Vérification DNS (Recommandé):
1. **Google affiche:** `TXT record à ajouter`
2. **Copier:** `google-site-verification=...`
3. **Aller sur:** Registrar domaine (ex: OVH, Gandi)
4. **Ajouter enregistrement DNS TXT:**
   - Nom: @ (ou empty)
   - Valeur: `google-site-verification=...`
   - Cliquer "Save"
5. **Attendre 24-48h** propagation
6. **Revenir Google Search Console**
7. **Cliquer:** "Verify"

### Vérification HTML (Alternative):
1. **Télécharger fichier** fourni par Google
2. **Placer à la racine** du site (`/google...html`)
3. **Cliquer:** "Verify"

---

## **3️⃣ SOUMETTRE SITEMAP**

### Ajouter sitemap.xml:
1. **Aller dans:** Search Console → Sitemaps
2. **URL saisir:** `https://charisferme.fr/sitemap.xml`
3. **Cliquer:** "Submit"
4. **Status:** "Success" (dans 24-48h)

### Vérifier sitemap.xml:
```bash
# Accédez à:
https://charisferme.fr/sitemap.xml
# Doit afficher XML valide avec URLs du site
```

---

## **4️⃣ SOUMETTRE ROBOTS.TXT**

### Ajouter robots.txt:
1. **Aller dans:** Search Console → Crawl → robots.txt Tester
2. **Tester crawl:**
   ```
   User-agent: *
   Allow: /
   Disallow: /admin
   
   Sitemap: https://charisferme.fr/sitemap.xml
   ```

### Vérifier robots.txt:
```bash
# Accédez à:
https://charisferme.fr/robots.txt
# Doit afficher robots.txt valide
```

---

## **5️⃣ CONFIGURER EN PRIORITY**

### Coverage (Couverture):
- ✅ Valid: Toutes les URLs indexées
- ⚠️ Excluded: URLs volontairement exclues
- ❌ Errors: URLs avec erreurs (404, etc)

### Indexed pages:
- Vérifier que pages principales indexées:
  - `https://charisferme.fr/`
  - `https://charisferme.fr/#blog`
  - `https://charisferme.fr/#galerie`
  - etc.

### Enhance:
- ✅ Mobile-friendly: Vérifier que responsive
- ✅ Structured data: JSON-LD indexé
- ✅ Core Web Vitals: Performance check

---

## **6️⃣ AJOUTER PROPRIÉTÉS SUPPLÉMENTAIRES**

### Google Analytics:
1. **Search Console → Settings → Property owners**
2. **Link Google Analytics:**
   - Connecter compte Analytics
   - Sélectionner property
   - "Associate"

### Google My Business:
1. **Aller:** https://business.google.com/
2. **Créer profil** "CHARISFERME"
3. **Ajouter:**
   - Catégorie: Farm/Agriculture
   - Adresse
   - Téléphone
   - Horaires
   - Photos
4. **Linking:** Lier à Search Console

### Open Graph (Meta tags):
✅ Déjà configuré dans index.html:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="/images/hero.jpg">
```

---

## **7️⃣ MONITORING & ANALYTICS**

### Revoir métriques:
1. **Search Console → Performance:**
   - Total clicks
   - Total impressions
   - Average CTR (Click-through rate)
   - Average position

2. **Top queries:**
   - Mots-clés qui genèrent traffic
   - Adapter contenu si besoin

3. **Top pages:**
   - Pages les plus visitées
   - Pages à améliorer

### Indexation:
1. **Coverage → Valid:**
   - Nombre URLs indexées
   - Tend augmenter progressivement

2. **URL Inspection:**
   - Entrer URL spécifique
   - Voir si indexée
   - Demander indexation

---

## **8️⃣ AMÉLIORER SEO PROGRESSIVEMENT**

### Actions recommandées:
- [ ] Ajouter plus de contenu (blog articles)
- [ ] Optimiser balises title/description
- [ ] Ajouter internal links
- [ ] Améliorer Core Web Vitals
- [ ] Augmenter E-E-A-T (Expertise, Experience, Authority, Trustworthiness)

### Monitoring:
- Réviser Google Search Console **hebdomadairement**
- Ajuster stratégie SEO selon données
- Répondre aux Core Web Vitals issues
- Ajouter contenu régulièrement

---

## **9️⃣ CHECKLIST GOOGLE SEARCH CONSOLE**

- [ ] Compte Google Search Console créé
- [ ] Propriété ajoutée (domaine ou URL prefix)
- [ ] Domaine vérifié (DNS ou HTML)
- [ ] Sitemap.xml soumis
- [ ] Robots.txt configuré
- [ ] Google Analytics lié
- [ ] Google My Business créé
- [ ] Mobile-friendly testé
- [ ] Core Web Vitals vérifiés
- [ ] Structured data validé
- [ ] Premier crawl Google complété

---

## **🔟 RACCOURCIS GOOGLE**

```
Search Console: https://search.google.com/search-console/
Google Analytics: https://analytics.google.com/
Google My Business: https://business.google.com/
PageSpeed Insights: https://pagespeed.web.dev/
Mobile-friendly Test: https://search.google.com/test/mobile-friendly
Structured Data: https://schema.org/
```

---

## **TIMELINE INDEXATION**

```
Jour 0: Soumettre Sitemap
Jour 1-3: Google crawl site
Jour 3-7: Pages commencent indexation
Jour 7-14: Plupart des pages indexées
Jour 14-30: Search Console montre traffic
```

⏳ **Patience! SEO = travail long terme (3-6 mois min)**

---

**✨ Google Search Console configuré ! 🔍**
