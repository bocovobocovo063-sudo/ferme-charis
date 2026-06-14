/**
 * CHARISFERME - Utilitaires & Systèmes Globaux
 * Version: 2.1 - Production Ready
 * Date: 8 mai 2026
 */

// ===== THEME MANAGER =====
class ThemeManager {
  constructor() {
    this.darkModeClass = 'dark-mode';
    this.storageKey = 'charisferme-theme';
    this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemDark = this.systemPreference.matches;

    if (savedTheme) {
      this.setTheme(savedTheme, false);
    } else {
      this.setTheme(systemDark ? 'dark' : 'light', false);
    }

    // Listen for system theme changes
    this.systemPreference.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });
    }
  }

  setTheme(theme, animate = true) {
    const html = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    if (animate) {
      html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    if (theme === 'dark') {
      html.classList.add(this.darkModeClass);
      if (toggle) {
        toggle.textContent = '☀️';
        toggle.setAttribute('title', 'Mode clair');
        toggle.setAttribute('aria-label', 'Activer le mode clair');
      }
    } else {
      html.classList.remove(this.darkModeClass);
      if (toggle) {
        toggle.textContent = '🌙';
        toggle.setAttribute('title', 'Mode sombre');
        toggle.setAttribute('aria-label', 'Activer le mode sombre');
      }
    }

    if (animate) {
      setTimeout(() => {
        html.style.transition = '';
      }, 300);
    }

    localStorage.setItem(this.storageKey, theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  toggle() {
    const current = this.getCurrentTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark', true);
  }

  getCurrentTheme() {
    return localStorage.getItem(this.storageKey) || 
           (this.systemPreference.matches ? 'dark' : 'light');
  }

  isDarkMode() {
    return this.getCurrentTheme() === 'dark';
  }
}

// ===== TOAST NOTIFICATIONS =====
class ToastNotification {
  constructor() {
    this.container = document.getElementById('toastContainer');
    this.toastTimeout = new Map();
  }

  show(message, type = 'info', duration = 3000) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const icon = icons[type] || '•';
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <div class="toast-content">
        <p style="margin: 0;">${this.escapeHtml(message)}</p>
      </div>
      <button type="button" class="toast-close" aria-label="Fermer la notification">✕</button>
    `;

    this.container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.add('hide');
      setTimeout(() => {
        toast.remove();
        this.toastTimeout.delete(toast);
      }, 300);
    };

    closeBtn?.addEventListener('click', removeToast);

    const timeoutId = setTimeout(removeToast, duration);
    this.toastTimeout.set(toast, timeoutId);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 3000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 3000) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
}

// ===== FORM VALIDATOR =====
class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = {};
    this.init();
  }

  init() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const fieldName = input.name || input.id;
      if (!fieldName) return;

      this.fields[fieldName] = {
        element: input,
        rules: this.parseRules(input),
        errors: []
      };

      input.addEventListener('blur', () => this.validateField(fieldName));
      input.addEventListener('input', () => {
        if (this.fields[fieldName].errors.length > 0) {
          this.validateField(fieldName);
        }
      });
    });
  }

  parseRules(input) {
    const rules = {};

    if (input.hasAttribute('required')) rules.required = true;
    if (input.type === 'email') rules.email = true;
    if (input.type === 'url') rules.url = true;
    if (input.type === 'tel') rules.tel = true;
    if (input.type === 'number') rules.number = true;

    const minLength = input.getAttribute('minlength');
    if (minLength) rules.minLength = parseInt(minLength, 10);

    const maxLength = input.getAttribute('maxlength');
    if (maxLength) rules.maxLength = parseInt(maxLength, 10);

    const pattern = input.getAttribute('pattern');
    if (pattern) rules.pattern = new RegExp(pattern);

    return rules;
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    const value = field.element.value.trim();
    field.errors = [];

    if (field.rules.required && !value) {
      field.errors.push('Ce champ est requis');
    }

    if (value) {
      if (field.rules.email && !this.isValidEmail(value)) {
        field.errors.push('Adresse email invalide');
      }

      if (field.rules.url && !this.isValidUrl(value)) {
        field.errors.push('URL invalide');
      }

      if (field.rules.tel && !this.isValidPhone(value)) {
        field.errors.push('Numéro de téléphone invalide');
      }

      if (field.rules.number && isNaN(value)) {
        field.errors.push('Veuillez entrer un nombre');
      }

      if (field.rules.minLength && value.length < field.rules.minLength) {
        field.errors.push(`Minimum ${field.rules.minLength} caractères`);
      }

      if (field.rules.maxLength && value.length > field.rules.maxLength) {
        field.errors.push(`Maximum ${field.rules.maxLength} caractères`);
      }

      if (field.rules.pattern && !field.rules.pattern.test(value)) {
        field.errors.push('Format invalide');
      }
    }

    this.displayErrors(field);
    return field.errors.length === 0;
  }

  validateAll() {
    let isValid = true;
    Object.keys(this.fields).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }

  displayErrors(field) {
    const wrapper = field.element.closest('.form-group') || field.element.parentElement;
    let errorElement = wrapper.querySelector('.form-error');

    if (field.errors.length > 0) {
      field.element.classList.add('error');
      field.element.setAttribute('aria-invalid', 'true');

      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.setAttribute('role', 'alert');
        field.element.after(errorElement);
      }
      errorElement.textContent = field.errors[0];
    } else {
      field.element.classList.remove('error');
      field.element.setAttribute('aria-invalid', 'false');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i;
    return phoneRegex.test(phone);
  }

  reset() {
    Object.keys(this.fields).forEach(fieldName => {
      this.fields[fieldName].errors = [];
      this.fields[fieldName].element.classList.remove('error');
      this.displayErrors(this.fields[fieldName]);
    });
  }
}

// ===== LAZY LOADER =====
class LazyLoader {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.init();
    } else {
      this.fallback();
    }
  }

  init() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  fallback() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ===== ANALYTICS TRACKER =====
class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateId();
    this.pageViewTime = Date.now();
    this.init();
  }

  init() {
    this.trackPageView();
    window.addEventListener('beforeunload', () => this.trackSessionEnd());
  }

  trackPageView() {
    if (window.gtag) {
      gtag('event', 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        session_id: this.sessionId
      });
    }
  }

  trackSessionEnd() {
    const sessionTime = (Date.now() - this.pageViewTime) / 1000;
    if (window.gtag) {
      gtag('event', 'session_end', {
        session_duration: Math.round(sessionTime),
        session_id: this.sessionId
      });
    }
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ===== GLOBAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all systems
  window.themeManager = new ThemeManager();
  window.toast = new ToastNotification();
  window.lazyLoader = new LazyLoader();
  window.analytics = new AnalyticsTracker();

  console.log('✅ CHARISFERME - Systèmes chargés avec succès');
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    ToastNotification,
    FormValidator,
    LazyLoader,
    AnalyticsTracker
  };
}
