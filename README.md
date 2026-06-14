# CHARISFERME - Site vitrine

Site vitrine statique pour la ferme CHARISFERME, conçu pour présenter les activités, les produits et les contacts.

## Structure du projet

- `index.html` : page principale avec sections Accueil, À propos, Équipe, Activités, Produits, Offres, Tarifs, Commande, Devis, Agenda, Réservation, Partenaires, Galerie, Actualités, Avis clients, FAQ, Newsletter, Localisation, Contact.
- `styles.css` : styles professionnels, responsive et navigation mobile.
- `script.js` : interactions du menu, agenda dynamique, commande en ligne, formulaires Netlify, calcul de panier et slider témoignages, système de réservation avec calendrier interactif.
- `favicon.svg` : icône du site.
- `404.html` : page d’erreur personnalisée.
- `netlify.toml` : configuration de déploiement Netlify.
- `robots.txt` : règles de référencement.

## Personnalisation

1. Remplacer les textes de présentation, les coordonnées et les horaires dans `index.html`.
2. Ajouter vos propres photos ou remplacer l’image de fond dans `styles.css`.
3. Adapter les produits et activités aux offres réelles de CHARISFERME.
4. Mettre à jour les liens sociaux ou les informations de contact.

## Tester localement

Option 1 : ouvrir `index.html` directement dans un navigateur.

Option 2 : utiliser un serveur local :

- Avec Python 3 :
  ```bash
  python -m http.server 8000
  ```
  puis ouvrir `http://localhost:8000`.

- Avec Visual Studio Code : installer l’extension Live Server et lancer le serveur.

## Déploiement recommandé

### 1. Netlify

1. Créer un compte sur https://www.netlify.com.
2. Connecter le dépôt Git ou déposer le dossier du projet.
3. Choisir le dossier racine (`/`) comme répertoire de publication.
4. Activer les formulaires si vous souhaitez utiliser la section contact.

Netlify détecte automatiquement le site statique. Le formulaire fonctionne avec `data-netlify="true"`.

### 2. GitHub Pages

1. Initialiser un dépôt Git dans le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Site vitrine CHARISFERME"
   ```
2. Pousser le projet sur GitHub.
3. Activer GitHub Pages dans les paramètres du dépôt.
4. Choisir la branche `main` ou `master` et le dossier `/`.

### 3. Vercel

1. Se connecter sur https://www.vercel.com.
2. Importer le projet depuis GitHub, GitLab ou Bitbucket.
3. Sélectionner la racine du projet et lancer le déploiement.

## Domaine personnalisé

- Acheter un domaine comme `charisferme.fr`.
- Configurer un enregistrement A ou CNAME selon l’hébergeur.
- Activer le HTTPS via l’hébergeur (certificat gratuit souvent inclus).

## Fichiers utiles

- `favicon.svg` : icône du site.
- `404.html` : page d’erreur personnalisée si la route est introuvable.
- `robots.txt` : autorise l’indexation du site.
- `netlify.toml` : configuration pour Netlify.

## Améliorations possibles

- Ajouter des photos locales et une galerie plus riche.
- Intégrer une carte interactive (Google Maps, OSM).
- Ajouter une page `Actualités` ou `Agenda`.
- Ajouter un formulaire de devis professionnel avec options de projet.
- Ajouter une page `Tarifs & formules` pour présenter les offres et les packs.
- Ajouter une section `Équipe & savoir-faire` pour mettre en valeur votre expertise.
- Ajouter un agenda dynamique pour les marchés, ateliers et visites.
- Ajouter une page `Commande en ligne` pour simplifier les achats locaux.
- Ajouter un bouton WhatsApp et un contact immédiat depuis le menu.
- Remplacer le formulaire par un service dédié si besoin.
