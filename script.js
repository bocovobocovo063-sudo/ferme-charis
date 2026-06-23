/**
 * CHARISFERME - Main Script
 * Version: 2.1 - Production Ready
 * Date: 8 mai 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM ELEMENTS =====
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const header = document.querySelector('.site-header');
  const pageProgress = document.getElementById('pageProgress');
  const sections = document.querySelectorAll('main section[id]');
  const scrollBtn = document.querySelector('.scroll-to-top');

  // ===== MOBILE MENU =====
  const toggleMobileMenu = () => {
    if (!menuToggle || !siteNav) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  };

  // ===== SCROLL PROGRESS BAR =====
  const updateProgressBar = () => {
    if (!pageProgress) return;

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    pageProgress.style.width = `${progress}%`;
  };

  // ===== ACTIVE NAVIGATION =====
  const updateActiveNav = () => {
    const currentPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = document.querySelector(`.main-nav a[href="#${section.id}"]`);

      if (link && currentPosition >= top && currentPosition < bottom) {
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      }
    });
  };

  // ===== SCROLL HANDLER =====
  const handleScroll = () => {
    updateActiveNav();
    updateProgressBar();

    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 16);
    }

    if (scrollBtn) {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }
  };

  // ===== SCROLL TO TOP =====
  const initScrollToTop = () => {
    if (!scrollBtn) return;

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ===== REVEAL ON SCROLL =====
  const initScrollReveal = () => {
    const elements = document.querySelectorAll('.section, .card, .testimonial-card, .gallery-card, .faq-item');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  };

  // ===== PRODUCT FILTER =====
  const initProductFilter = () => {
    const filterButtons = document.querySelectorAll('.product-filter .filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length === 0 || productCards.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        productCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  };

  // ===== GALLERY LIGHTBOX =====
  const initGalleryLightbox = () => {
    const galleryCards = document.querySelectorAll('.gallery-card');
    const modal = document.getElementById('imageModal');

    if (!modal || galleryCards.length === 0) return;

    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalClose = modal.querySelector('.modal-close');

    const openModal = (image, title, caption) => {
      if (modalImage) modalImage.src = image;
      if (modalTitle) modalTitle.textContent = title || 'Galerie';
      if (modalCaption) modalCaption.textContent = caption || '';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const image = card.dataset.image;
        const title = card.querySelector('h3')?.textContent || '';
        const caption = card.dataset.caption || '';
        openModal(image, title, caption);
      });
    });

    modalClose?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  };

  // ===== TESTIMONIAL SLIDER =====
  const initTestimonialSlider = () => {
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonials = document.querySelectorAll('.testimonial-track .testimony-card');

    if (!testimonialTrack || testimonials.length === 0) return;

    let currentIndex = 0;
    let autoPlayTimer;

    const updateSlider = () => {
      testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateSlider();
    };

    const startAutoPlay = () => {
      autoPlayTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    };

    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    startAutoPlay();
  };

  // ===== STAT COUNTERS =====
  const initStatCounters = () => {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const stats = statsSection.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stats.forEach(el => {
            if (el.dataset.animated) return;

            const text = el.textContent.trim();
            const match = text.match(/^\d+/);

            if (!match) return;

            el.dataset.animated = 'true';
            const target = parseInt(match[0], 10);
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 60));
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                el.textContent = target;
                clearInterval(interval);
              } else {
                el.textContent = current;
              }
            }, 20);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
  };

  // ===== COOKIES BANNER =====
  const initCookieBanner = () => {
    const cookieConsent = localStorage.getItem('charisferme-cookie-consent');
    if (cookieConsent) return;

    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <p>Nous utilisons des cookies pour améliorer votre expérience. <a href="mentions-legales.html#cookies" aria-label="Politique de confidentialité">En savoir plus</a></p>
        <div class="cookie-actions">
          <button type="button" id="acceptCookies" class="btn btn-primary">Accepter</button>
          <button type="button" id="rejectCookies" class="btn btn-secondary">Refuser</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('acceptCookies')?.addEventListener('click', () => {
      localStorage.setItem('charisferme-cookie-consent', 'accepted');
      banner.remove();
      if (window.toast) window.toast.success('Cookies acceptés', 2000);
    });

    document.getElementById('rejectCookies')?.addEventListener('click', () => {
      localStorage.setItem('charisferme-cookie-consent', 'rejected');
      banner.remove();
      if (window.toast) window.toast.info('Cookies refusés', 2000);
    });
  };

  // ===== FORM VALIDATION =====
  const initFormValidation = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const validator = new FormValidator(form);

      form.addEventListener('submit', (e) => {
        if (!validator.validateAll()) {
          e.preventDefault();
          if (window.toast) {
            window.toast.error('Veuillez corriger les erreurs du formulaire');
          }
        }
      });
    });
  };

  // ===== KEYBOARD NAVIGATION =====
  const initKeyboardNav = () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal) modal.classList.remove('open');
        
        if (siteNav) {
          siteNav.classList.remove('open');
          menuToggle?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  };

  // ===== NEWSLETTER POPUP =====
  const initNewsletterPopup = () => {
    const popup = document.getElementById('newsletterPopup');
    const overlay = document.getElementById('popupOverlay');
    const closeBtn = popup?.querySelector('.popup-close');
    const form = document.getElementById('popupNewsletterForm');

    if (!popup || !overlay) return;
    if (localStorage.getItem('charisferme-newsletter-shown')) return;

    const openPopup = () => {
      popup.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
      popup.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      localStorage.setItem('charisferme-newsletter-shown', '1');
    };

    setTimeout(openPopup, 5000);

    closeBtn?.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      closePopup();
      if (window.toast) window.toast.success('Merci ! Bienvenue dans la communauté CHARISFERME 🌿');
    });
  };

  // ===== PROMO BAR =====
  const initPromoBar = () => {
    const bar = document.getElementById('promoBar');
    const closeBtn = document.getElementById('promoBarClose');
    if (!bar || !closeBtn) return;
    if (localStorage.getItem('charisferme-promo-closed')) {
      bar.classList.add('hidden');
      return;
    }
    closeBtn.addEventListener('click', () => {
      bar.classList.add('hidden');
      localStorage.setItem('charisferme-promo-closed', '1');
    });
  };

  // ===== FAQ ACCORDION =====
  const initFaqAccordion = () => {
    const items = document.querySelectorAll('.faq-acc-item');
    if (!items.length) return;
    items.forEach(item => {
      const btn = item.querySelector('.faq-acc-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-acc-btn')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  // ===== GALLERY FILTER (galerie.html) =====
  const initGalleryFilter = () => {
    const filterBtns = document.querySelectorAll('.gallery-filter .filter-btn');
    const items = document.querySelectorAll('.gallery-item[data-category]');

    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        items.forEach(item => {
          item.classList.toggle('hidden', cat !== 'all' && item.dataset.category !== cat);
        });
      });
    });
  };

  // ===== ECOMMERCE CART SYSTEM =====
  const initEcommerceCart = () => {
    if (window.hasInlineProductCart) {
      console.log('⚠️ Inline produits cart active: skipping duplicate ecommerce cart init');
      return;
    }
    const cartFab = document.querySelector('.cart-fab');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartClose = cartDrawer?.querySelector('.cart-close');
    const addButtons = document.querySelectorAll('.btn-add');
    const cartItems = document.querySelector('.cart-items');
    const clearCartBtn = document.querySelector('.cart-clear');
    const submitCartBtn = document.querySelector('.btn-send');

    if (!cartDrawer) return;

    // ===== CART FUNCTIONS =====
    const getCart = () => JSON.parse(localStorage.getItem('charisferme-cart') || '[]');
    const saveCart = (cart) => localStorage.setItem('charisferme-cart', JSON.stringify(cart));

    const updateCartUI = () => {
      const cart = getCart();
      const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
      
      if (cartFab) {
        if (cartCount > 0) {
          cartFab.classList.add('visible');
          cartFab.querySelector('.cart-fab-count').textContent = cartCount;
        } else {
          cartFab.classList.remove('visible');
        }
      }

      if (cartItems) {
        if (cart.length === 0) {
          cartItems.innerHTML = '<div class="cart-empty">Votre panier est vide. Ajoutez des produits ! 🛒</div>';
        } else {
          cartItems.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
              <div class="cart-item-emoji">${item.emoji || '🥬'}</div>
              <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-qty">${item.qty} x €${item.price.toFixed(2).replace('.', ',')}</div>
              </div>
              <button class="cart-item-remove" data-index="${idx}" title="Retirer">✕</button>
            </div>
          `).join('');

          // Ajouter listeners aux boutons de suppression
          document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              const cart = getCart();
              cart.splice(parseInt(btn.dataset.index), 1);
              saveCart(cart);
              updateCartUI();
            });
          });
        }
      }
    };

    const parsePrice = (priceText) => {
      if (!priceText) return 0;
      const normalized = priceText.replace(/,/g, '.').replace(/€/g, '').trim();
      const match = normalized.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    };

    const parseQuantity = (card) => {
      const qtyEl = card.querySelector('.qty-value');
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : NaN;
      return Number.isFinite(qty) && qty > 0 ? qty : 1;
    };

    // ===== ADD TO CART =====
    addButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.pcard');
        if (!card) return;

        const title = card.querySelector('.pcard-title')?.textContent || 'Produit';
        const price = parsePrice(card.querySelector('.pcard-price')?.textContent);
        const qty = parseQuantity(card);
        const category = card.dataset.category || 'produit';
        const emoji = ['🥬', '🥕', '🥦', '🧀', '🥩', '🐔', '🥚'][Math.floor(Math.random() * 7)];

        let cart = getCart();
        const existing = cart.findIndex(item => item.name === title);

        if (existing >= 0) {
          cart[existing].qty += qty;
        } else {
          cart.push({ name: title, price: price, qty: qty, emoji: emoji, category: category });
        }

        saveCart(cart);
        updateCartUI();
        
        if (window.toast) window.toast.success(`"${title}" ajouté au panier ! ✓`);
        
        // Animation
        btn.classList.add('added');
        setTimeout(() => btn.classList.remove('added'), 600);
      });
    });

    /* CART DRAWER */
    if (cartFab) {
      cartFab.addEventListener('click', () => {
        cartOverlay?.classList.add('open');
        cartDrawer.classList.add('open');
      });
    }

    cartClose?.addEventListener('click', () => {
      cartOverlay?.classList.remove('open');
      cartDrawer.classList.remove('open');
    });

    cartOverlay?.addEventListener('click', () => {
      cartOverlay.classList.remove('open');
      cartDrawer.classList.remove('open');
    });

    /* CLEAR CART */
    clearCartBtn?.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr ? Votre panier sera vidé.')) {
        localStorage.setItem('charisferme-cart', '[]');
        updateCartUI();
        if (window.toast) window.toast.info('Panier vidé');
      }
    });

    /* SUBMIT CART */
    submitCartBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const cart = getCart();
      if (cart.length === 0) {
        if (window.toast) window.toast.error('Votre panier est vide !');
        return;
      }

      const email = document.querySelector('input[type="email"]')?.value;
      const name = document.querySelector('input[name="name"]')?.value;
      const note = document.querySelector('textarea')?.value;

      if (!email || !name) {
        if (window.toast) window.toast.error('Veuillez remplir vos informations');
        return;
      }

      submitCartBtn.disabled = true;
      submitCartBtn.textContent = '⏳ Traitement...';

      try {
        // Enregistrer et rediriger vers la page de paiement
        localStorage.setItem('charisferme-cart-contact', JSON.stringify({ email, name, note }));
        window.location.href = './checkout.html?type=cart';
      } catch (err) {
        if (window.toast) window.toast.error('Erreur : ' + err.message);
        submitCartBtn.disabled = false;
        submitCartBtn.textContent = '📦 Passer la commande';
      }
    });

    // ===== INIT =====
    updateCartUI();
  };

  // ===== INITIALIZE ALL SYSTEMS =====
  toggleMobileMenu();
  initScrollToTop();
  window.addEventListener('scroll', handleScroll, { passive: true });
  initScrollReveal();
  initProductFilter();
  initGalleryLightbox();
  initTestimonialSlider();
  initStatCounters();
  initCookieBanner();
  initFormValidation();
  initKeyboardNav();
  initNewsletterPopup();
  initGalleryFilter();
  initPromoBar();
  initFaqAccordion();
  initEcommerceCart();

  console.log('✅ CHARISFERME - Tous les systèmes sont initialisés');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      console.log('Service Worker registration failed (offline mode may not work)');
    });
  });
}
