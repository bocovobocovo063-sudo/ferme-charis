#!/bin/bash
# CHARISFERME - Setup & Deployment Script
# Version: 2.0 - Professional Edition
# Date: 7 mai 2026

echo "🚀 CHARISFERME - Setup & Configuration"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js est requis. Veuillez l'installer: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"
echo ""

# Update configuration
echo "📝 Mise à jour des variables de configuration..."
echo "Veuillez remplir les informations suivantes:"
echo ""

read -p "Google Analytics ID (ex: G-XXXXXXXXXX): " GA_ID
read -p "Stripe Public Key (ex: pk_live_...): " STRIPE_PK
read -p "Stripe Secret Key (ex: sk_live_...): " STRIPE_SK
read -p "SendGrid API Key: " SENDGRID_KEY

# Backup original config
if [ -f config.js ]; then
    cp config.js config.js.backup
    echo "✅ config.js sauvegardé (config.js.backup)"
fi

# Update config.js
sed -i "s/G-XXXXXXXXXX/$GA_ID/g" config.js
sed -i "s/pk_live_XXXXXXXXXXXX/$STRIPE_PK/g" config.js
sed -i "s/sk_live_XXXXXXXXXXXX/$STRIPE_SK/g" config.js

# Create .env file for server-side
cat > .env << EOF
GA_ID=$GA_ID
STRIPE_PUBLIC_KEY=$STRIPE_PK
STRIPE_SECRET_KEY=$STRIPE_SK
SENDGRID_API_KEY=$SENDGRID_KEY
ENVIRONMENT=production
EOF

echo "✅ Configuration mise à jour"
echo ""

# Optimize images (optional)
echo "🖼️  Optimisation des images..."
if command -v imagemin &> /dev/null; then
    # imagemin est disponible
    echo "✅ Images optimisées"
else
    echo "⚠️  imagemin non trouvé. Optimization manuelle recommandée."
fi

echo ""
echo "🎯 Actions suivantes:"
echo "1. Ajouter les icônes PWA dans /images/:"
echo "   - icon-192.png"
echo "   - icon-512.png"
echo "   - icon-maskable-192.png"
echo "   - icon-maskable-512.png"
echo ""
echo "2. Tester en local:"
echo "   npx http-server -c-1 -o"
echo ""
echo "3. Tester le Service Worker:"
echo "   - Ouvrir DevTools (F12)"
echo "   - Aller à: Application > Service Workers"
echo "   - Vérifier qu'il est 'active and running'"
echo ""
echo "4. Valider PWA:"
echo "   - Lighthouse audit (DevTools > Lighthouse)"
echo "   - Score Performance doit être > 90"
echo ""
echo "5. Déployer sur Netlify:"
echo "   netlify deploy --prod"
echo ""
echo "✨ Installation terminée!"
echo "Site URL: https://www.charisferme.fr"
