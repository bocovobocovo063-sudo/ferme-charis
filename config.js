// CHARISFERME - Configuration & Environment Variables
// ✅ Production Ready Configuration

const CONFIG = {
    // ===== SITE METADATA =====
    SITE_NAME: 'CHARISFERME',
    SITE_URL: 'https://www.charisferme.fr',
    SITE_DOMAIN: 'charisferme.fr',
    BUSINESS_NAME: 'CHARISFERME - Ferme Artisanale',
    BUSINESS_PHONE: '+33600000000',
    BUSINESS_EMAIL: 'contact@charisferme.fr',
    BUSINESS_ADDRESS: 'Ferme de Charis, 12345 Village, France',
    BUSINESS_SIRET: '123456789000012',

  // ===== ANALYTICS =====
  GA_ID: 'G-XXXXXXXXXX', // Remplacer par votre ID Google Analytics
  SEGMENT_KEY: '', // Pour Segment si utilisé
  MIXPANEL_TOKEN: '', // Pour Mixpanel si utilisé
  HOTJAR_ID: '', // Pour Hotjar pour heatmaps

  // ===== API ENDPOINTS =====
  API_BASE_URL: 'https://api.charisferme.fr',
  STRIPE_PUBLIC_KEY: 'pk_live_XXXXXXXXXXXX', // Remplacer avec clé Stripe
  STRIPE_SECRET_KEY: 'sk_live_XXXXXXXXXXXX', // À utiliser côté serveur uniquement
  PAYPAL_CLIENT_ID: '',

  // ===== SENDGRID / EMAIL =====
  SENDGRID_API_KEY: '', // À configurer côté serveur
  SENDGRID_FROM_EMAIL: 'noreply@charisferme.fr',
  SENDGRID_TEMPLATES: {
    CONTACT_FORM: 'd-XXXXXXXXXXXX',
    RESERVATION: 'd-XXXXXXXXXXXX',
    NEWSLETTER: 'd-XXXXXXXXXXXX',
    ORDER_CONFIRMATION: 'd-XXXXXXXXXXXX'
  },

  // ===== SOCIAL MEDIA =====
  SOCIAL: {
    FACEBOOK: 'https://www.facebook.com/charisferme',
    INSTAGRAM: 'https://www.instagram.com/charisferme',
    TWITTER: 'https://twitter.com/charisferme',
    LINKEDIN: 'https://linkedin.com/company/charisferme',
    YOUTUBE: 'https://youtube.com/@charisferme',
    TIKTOK: 'https://tiktok.com/@charisferme',
    WHATSAPP: 'https://wa.me/33600000000'
  },

  // ===== PWA & MANIFEST =====
  PWA_ENABLED: true,
  APP_NAME: 'CHARISFERME',
  APP_SHORT_NAME: 'Charis',
  APP_DESCRIPTION: 'Ferme artisanale avec produits locaux en circuits courts',
  THEME_COLOR: '#059669',
  BACKGROUND_COLOR: '#ffffff',

  // ===== CACHE CONFIGURATION =====
  CACHE_STRATEGY: 'cache-first', // ou 'network-first'
  CACHE_DURATION: {
    IMAGES: 31536000, // 1 year
    CSS_JS: 2592000,  // 1 month
    API: 3600,        // 1 hour
    HTML: 86400       // 1 day
  },

  // ===== GDPR & COOKIES =====
  GDPR_ENABLED: true,
  COOKIE_POLICY_URL: 'https://www.charisferme.fr/cookie-policy',
  PRIVACY_POLICY_URL: 'https://www.charisferme.fr/privacy',
  TERMS_URL: 'https://www.charisferme.fr/terms',
  COOKIE_CONSENT_KEY: 'charisferme-cookie-consent',

  // ===== PERFORMANCE SETTINGS =====
  PRELOAD_RESOURCES: true,
  LAZY_LOAD_IMAGES: true,
  ENABLE_COMPRESSION: true,
  ENABLE_MINIFICATION: true,
  OPTIMIZE_FONTS: true,

  // ===== NOTIFICATIONS =====
  PUSH_NOTIFICATIONS_ENABLED: true,
  NOTIFICATION_DURATION: 3000, // milliseconds
  NOTIFICATION_POSITION: 'top-right', // 'top-left', 'bottom-right', 'bottom-left'

  // ===== FEATURE FLAGS =====
  FEATURES: {
    DARK_MODE: true,
    PWA: true,
    SERVICE_WORKER: true,
    ANALYTICS: true,
    COOKIES_BANNER: true,
    FORM_VALIDATION: true,
    LAZY_LOADING: true,
    LIVE_CHAT: false, // À activer quand live chat est prêt
    NEWSLETTER: true,
    TESTIMONIALS: true,
    REVIEWS: true,
    RATINGS: true,
    WISHLIST: false, // À implémenter
    CART: true,
    CHECKOUT: true,
    BLOG: true,
    GALLERY: true,
    EVENTS: true,
    RESERVATIONS: true,
  },

  // ===== DEVELOPMENT / PRODUCTION =====
  DEBUG: false,
  ENVIRONMENT: 'production', // 'development' ou 'production'
  LOG_LEVEL: 'warn', // 'error', 'warn', 'info', 'debug'

  // ===== SEO =====
  SEO_ENABLED: true,
  ROBOTS_TXT: '/robots.txt',
  SITEMAP_XML: '/sitemap.xml',
  CANONICAL_URL: 'https://www.charisferme.fr',

  // ===== INTERNATIONALIZATION =====
  DEFAULT_LANGUAGE: 'fr',
  SUPPORTED_LANGUAGES: ['fr', 'en'],
  SUPPORTED_CURRENCIES: ['EUR', 'USD'],
  DEFAULT_CURRENCY: 'EUR',

  // ===== TIMEZONE =====
  TIMEZONE: 'Europe/Paris',

  // ===== BUSINESS HOURS =====
  BUSINESS_HOURS: {
    MON_FRI: { OPEN: '09:00', CLOSE: '18:00' },
    SATURDAY: { OPEN: '09:00', CLOSE: '18:00' },
    SUNDAY: { OPEN: '10:00', CLOSE: '14:00' }
  }
};

if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
  window.getEnv = (key) => CONFIG[key] || (typeof process !== 'undefined' ? process.env[key] : undefined);
  window.isProduction = () => CONFIG.ENVIRONMENT === 'production';
  window.isDevelopment = () => CONFIG.ENVIRONMENT === 'development';
  window.isFeatureEnabled = (feature) => CONFIG.FEATURES[feature] === true;
  window.logConfig = (level, message, data = null) => {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const configLevel = levels[CONFIG.LOG_LEVEL] || 2;
    const messageLevel = levels[level] || 2;

    if (messageLevel <= configLevel) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      if (data) {
        console.log(`${prefix} ${message}`, data);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  };
}

// ===== HELPER FUNCTIONS =====

function getEnv(key) {
  return CONFIG[key] || (typeof process !== 'undefined' ? process.env[key] : undefined);
}

function isProduction() {
  return CONFIG.ENVIRONMENT === 'production';
}

function isDevelopment() {
  return CONFIG.ENVIRONMENT === 'development';
}

function isFeatureEnabled(feature) {
  return CONFIG.FEATURES[feature] === true;
}

function log(level, message, data = null) {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  const configLevel = levels[CONFIG.LOG_LEVEL] || 2;
  const messageLevel = levels[level] || 2;

  if (messageLevel <= configLevel) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, getEnv, isProduction, isDevelopment, isFeatureEnabled, log };
}
