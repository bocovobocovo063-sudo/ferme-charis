# 🔍 CHECKLIST - SITE PROFESSIONNEL CHARISFERME

## ✅ Vérifications Avant Déploiement

### 1. **Mode Sombre**
- [ ] Bouton toggle visible dans header
- [ ] Mode dark appliqué à tous éléments
- [ ] localStorage persiste préférence
- [ ] Pas de flash blanc au chargement
- [ ] Transitions fluides dark ↔ light
- [ ] Tous les textes lisibles en dark mode

### 2. **Notifications Toast**
```javascript
// Tester dans console:
window.toast.success('Test succès');
window.toast.error('Test erreur');
window.toast.warning('Test warning');
window.toast.info('Test info');
```
- [ ] Notifications s'affichent en bas à droite
- [ ] Animations fluides d'apparition
- [ ] Auto-fermeture après 3s
- [ ] Bouton fermeture manuel fonctionne
- [ ] Pas d'erreurs console

### 3. **Service Worker & PWA**
- [ ] DevTools → Application → Service Workers: "ACTIVATED and RUNNING"
- [ ] `manifest.json` chargé correctement
- [ ] Icons PWA configurés (192x512)
- [ ] Mode installable sur mobile
- [ ] Offline page fonctionne
- [ ] Cache strategy working

### 4. **Validation Formulaires**
- [ ] Tester: email vide → erreur
- [ ] Tester: email invalide → erreur
- [ ] Tester: téléphone invalide → erreur
- [ ] Messages d'erreur apparaissent
- [ ] Couleur rouge pour erreurs
- [ ] Submit bloqué si invalide
- [ ] Validation en temps réel (blur)

### 5. **Cookies Banner**
- [ ] Banneau s'affiche au premier chargement
- [ ] Bouton "Accepter" cache banner
- [ ] Bouton "Refuser" cache banner
- [ ] localStorage stocke le choix
- [ ] Banner ne réapparaît pas après choix
- [ ] Design responsive mobile

### 6. **Performance**
```
Lighthouse Audit (F12):
- [ ] Performance: 90+/100
- [ ] Accessibility: 90+/100
- [ ] Best Practices: 90+/100
- [ ] SEO: 95+/100
```
- [ ] Core Web Vitals PASSING
- [ ] Pas de CLS issues
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] Images optimisées

### 7. **Mobile Responsivité**
- [ ] Tester sur: iPhone, Android
- [ ] Menu mobile fonctionne
- [ ] Textes lisibles (pas trop petits)
- [ ] Boutons min 44x44px
- [ ] Pas de scroll horizontal
- [ ] Images responsive
- [ ] Forms adaptés mobile

### 8. **Accessibilité**
- [ ] Navigation au clavier complète
- [ ] Tab order logique
- [ ] Aria-labels présents
- [ ] Contraste couleurs OK (DevTools)
- [ ] Focus indicators visibles
- [ ] Alt text sur images
- [ ] Screen reader test (NVDA/JAWS)

### 9. **SEO**
- [ ] Meta tags corrects
- [ ] Open Graph tags OK
- [ ] Twitter Card OK
- [ ] Schema.org structured data
- [ ] Sitemap.xml valide
- [ ] robots.txt correct
- [ ] Canonical URLs
- [ ] No 404 errors

### 10. **Sécurité**
- [ ] HTTPS/SSL activé
- [ ] Headers de sécurité présents:
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
- [ ] CORS configuré
- [ ] Pas de sensible data en JS
- [ ] .env sécurisé
- [ ] Pas de console warnings

### 11. **Analytics**
- [ ] Google Analytics ID configuré
- [ ] Events tracking fonctionne
- [ ] Page views enregistrées
- [ ] Session time tracking
- [ ] No analytics errors

### 12. **Configuration**
- [ ] config.js rempli correctement
- [ ] GA_ID: `G-XXXXXXXXXX`
- [ ] Stripe keys configurées
- [ ] SendGrid key configuré
- [ ] Social media liens OK
- [ ] Emails de contact corrects

### 13. **Fichiers Critiques**
- [ ] `index.html` - Valide & complet
- [ ] `styles.css` - Pas de syntax errors
- [ ] `script.js` - Pas de JS errors
- [ ] `utils.js` - Fonctionnalités actives
- [ ] `sw.js` - Service Worker OK
- [ ] `manifest.json` - JSON valide
- [ ] `.htaccess` - Comprendre la config

### 14. **Cross-Browser Testing**
- [ ] Chrome/Edge: ✅
- [ ] Firefox: ✅
- [ ] Safari: ✅
- [ ] Mobile Safari (iOS): ✅
- [ ] Chrome Mobile: ✅
- [ ] Samsung Internet: ✅

### 15. **Links & Navigation**
- [ ] Tous les liens internes fonctionnent
- [ ] Tous les liens externes s'ouvrent
- [ ] Pas de 404 errors
- [ ] Back button fonctionne
- [ ] Breadcrumbs logiques
- [ ] Anchor links (#) travaillent

### 16. **Images & Media**
- [ ] Toutes images chargent
- [ ] Images optimisées (< 100kb)
- [ ] Alt text présent
- [ ] Lazy loading fonctionne
- [ ] Pas d'images 404
- [ ] Responsive images (srcset)

### 17. **Forms**
- [ ] Contact form fonctionne
- [ ] Reservation form fonctionne
- [ ] Newsletter signup fonctionne
- [ ] Confirmation messages apparaissent
- [ ] Pas de form resubmits
- [ ] Validation côté client + serveur

### 18. **Social Sharing**
- [ ] Share buttons visibles
- [ ] Facebook share fonctionne
- [ ] Twitter share OK
- [ ] LinkedIn share OK
- [ ] WhatsApp button fonctionne
- [ ] Email sharing OK

### 19. **Email Notifications**
- [ ] Contact form email envoyé
- [ ] Réservation confirmation email
- [ ] Newsletter emails working
- [ ] Pas de spam emails
- [ ] Templates corrects

### 20. **Analytics Tracking**
- [ ] Page views trackées
- [ ] Click events trackées
- [ ] Form submissions trackées
- [ ] Conversion goals configurés
- [ ] UTM parameters working
- [ ] User journeys visible

---

## 🚀 Déploiement Checklist

### Avant Netlify Deploy:
- [ ] Tous tests en local PASSED
- [ ] No console errors
- [ ] Performance audit 90+
- [ ] SEO audit 95+
- [ ] 404 errors fixed
- [ ] Broken links fixed

### Configuration Netlify:
- [ ] Domain configuré
- [ ] SSL/HTTPS activé
- [ ] Redirects configurés
- [ ] Headers d'optimisation
- [ ] Cache headers OK
- [ ] Build command correct

### Post-Deploy:
- [ ] Site loadable en production
- [ ] PWA still installable
- [ ] Service Worker active
- [ ] Analytics tracking
- [ ] Emails envoyés
- [ ] Performance OK en production

---

## 📊 Performance Targets

| Métrique | Cible | Actual | Status |
|----------|-------|--------|--------|
| Lighthouse | 90+ | _ | ⬜ |
| CLS | < 0.1 | _ | ⬜ |
| LCP | < 2.5s | _ | ⬜ |
| FID | < 100ms | _ | ⬜ |
| TTL | < 3s | _ | ⬜ |
| Google SEO | Top 10 | _ | ⬜ |
| Mobile Score | 90+ | _ | ⬜ |

---

## 🔐 Sécurité Checklist

- [ ] Pas de credentials en code
- [ ] Pas de API keys exposées
- [ ] HTTPS/SSL obligatoire
- [ ] Rate limiting actif
- [ ] CORS headers correct
- [ ] CSP headers present
- [ ] XSS protection active
- [ ] CSRF tokens present
- [ ] SQL injection prevention
- [ ] Regular security updates

---

## 📱 Mobile Test Checklist

**Test Device Types:**
- [ ] iPhone 12/13/14 (iOS)
- [ ] iPhone 6/SE (old iOS)
- [ ] Samsung S21/S22 (Android)
- [ ] Pixel 6/7 (Android)
- [ ] Tablet iPad Pro
- [ ] Tablet Samsung Tab

**Mobile Tests:**
- [ ] Touch events work
- [ ] Buttons clickable (min 44x44)
- [ ] No horizontal scroll
- [ ] Keyboard doesn't cover form
- [ ] Images scale properly
- [ ] Font sizes readable

---

## ✨ Qualité Assurance

**Code Quality:**
- [ ] No console.errors
- [ ] No console.warnings
- [ ] Valid HTML (W3C)
- [ ] Valid CSS (W3C)
- [ ] No duplicate IDs
- [ ] Accessibility score 90+

**User Experience:**
- [ ] Fast load times
- [ ] Smooth animations
- [ ] Clear CTAs
- [ ] Intuitive navigation
- [ ] Mobile-first design
- [ ] Dark mode support

---

## 🎯 Final Sign-Off

- [ ] Tous tests PASSED ✅
- [ ] Ready for production
- [ ] Team review complete
- [ ] Client approval received
- [ ] Deploy authorized
- [ ] Monitoring configured

---

**Date de Vérification:** _________
**Vérifié par:** _________
**Status:** 🟢 READY / 🟡 IN PROGRESS / 🔴 BLOCKED

---

*Merci d'utiliser cette checklist!*
