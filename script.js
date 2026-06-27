/* =============================================
   BABBI 1952 — WEBSITE CLONE
   Complete JavaScript
   ============================================= */

(function () {
  'use strict';

  /* -----------------------------------------------
     UTILITY: IntersectionObserver for fade-in
  ----------------------------------------------- */
  const observeFade = () => {
    const items = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  };

  /* -----------------------------------------------
     HEADER: Scroll behavior — bg change + hide nav
  ----------------------------------------------- */
  const initHeader = () => {
    const topBar  = document.querySelector('.top-bar');
    const mainNav = document.querySelector('#main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      // Topbar background switch
      if (currentScroll > 60) {
        topBar.classList.add('scrolled');
      } else {
        topBar.classList.remove('scrolled');
      }

      // Hide/show nav on scroll direction
      if (currentScroll > 200) {
        if (currentScroll > lastScroll) {
          mainNav.classList.add('hidden');
        } else {
          mainNav.classList.remove('hidden');
        }
      }

      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  };

  /* -----------------------------------------------
     SEARCH OVERLAY
  ----------------------------------------------- */
  const initSearch = () => {
    const searchBtn     = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose   = document.getElementById('search-close');
    const searchInput   = document.getElementById('search-input');

    if (!searchBtn || !searchOverlay) return;

    const openSearch = () => {
      searchOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput && searchInput.focus(), 300);
    };

    const closeSearch = () => {
      searchOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    searchBtn.addEventListener('click', openSearch);
    searchClose && searchClose.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSearch();
    });
  };

  /* -----------------------------------------------
     MOBILE MENU OVERLAY
  ----------------------------------------------- */
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu-overlay');
    const menuClose = document.getElementById('mobile-menu-close');
    const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-link-small');

    if (!menuBtn || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    menuClose && menuClose.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (link.classList.contains('mobile-nav-close') || link.getAttribute('href').startsWith('#')) {
          closeMenu();
        }
      });
    });
  };

  /* -----------------------------------------------
     INGREDIENTS TABS
  ----------------------------------------------- */
  const initIngredientsTabs = () => {
    const tabs   = document.querySelectorAll('.ing-tab');
    const panels = document.querySelectorAll('.ing-panel');

    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        // Update tabs
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Update panels
        panels.forEach((panel) => {
          panel.classList.remove('active');
          panel.style.opacity = '0';
        });

        const activePanel = document.querySelector(`.ing-panel[data-panel="${target}"]`);
        if (activePanel) {
          activePanel.classList.add('active');
          // Trigger reflow for transition
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              activePanel.style.opacity = '1';
            });
          });
        }
      });
    });
  };

  /* -----------------------------------------------
     INGREDIENTS SLIDER (within each panel)
  ----------------------------------------------- */
  const initIngredientSliders = () => {
    const sliders = document.querySelectorAll('.ing-slider');

    sliders.forEach((slider) => {
      const slides  = slider.querySelectorAll('.ing-slide');
      const dots    = slider.parentElement.querySelectorAll('.dot');
      if (slides.length <= 1) return;

      let current  = 0;
      let interval = null;

      const goTo = (idx) => {
        current = (idx + slides.length) % slides.length;
        slider.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      };

      const autoplay = () => {
        interval = setInterval(() => goTo(current + 1), 4500);
      };

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          clearInterval(interval);
          goTo(i);
          autoplay();
        });
      });

      // Touch/swipe support
      let startX = 0;
      slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      slider.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          clearInterval(interval);
          goTo(current + (diff > 0 ? 1 : -1));
          autoplay();
        }
      }, { passive: true });

      autoplay();
    });
  };

  /* -----------------------------------------------
     HISTORY PARALLAX (mouse parallax on desktop)
  ----------------------------------------------- */
  const initHistoryParallax = () => {
    const historySection = document.querySelector('.history-section');
    const photosInner    = document.getElementById('history-photos-inner');
    if (!historySection || !photosInner) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect   = historySection.getBoundingClientRect();
          const viewH  = window.innerHeight;

          if (rect.top < viewH && rect.bottom > 0) {
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const offset   = (progress - 0.5) * 80;
            photosInner.style.transform = `translateY(${offset}px)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  /* -----------------------------------------------
     TRADITION PRODUCT IMAGE PARALLAX FLOAT
  ----------------------------------------------- */
  const initProductParallax = () => {
    const productImg = document.querySelector('.tradition-product-img');
    if (!productImg) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect  = productImg.getBoundingClientRect();
          const viewH = window.innerHeight;

          if (rect.top < viewH && rect.bottom > 0) {
            // progress 0→1 as element moves from bottom to top of viewport
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const floatY   = (progress - 0.5) * -60; // gentle -30px to +30px float
            const rotateZ  = (progress - 0.5) * 2;   // subtle 1° tilt like Babbi
            productImg.style.transform = `translateY(${floatY}px) rotate(${rotateZ}deg)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  };

  /* -----------------------------------------------
     CERTIFICATIONS 3-LAYER PARALLAX
  ----------------------------------------------- */
  const initCertificationsParallax = () => {
    const section = document.getElementById('certifications');
    if (!section) return;

    const bgLayer = section.querySelector('.parallax-bg');
    const particles = section.querySelectorAll('.particle');
    
    // Disable if prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const SPEED_BG = -0.15;
    const SPEED_FOREGROUND = 0.45;

    let ticking = false;
    let inView = false;

    // Use IntersectionObserver to pause scroll calculations when section is out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        inView = entry.isIntersecting;
        if (inView) {
          updateParallax(); // Initial positioning
        }
      });
    }, { threshold: 0 }); // Trigger as soon as 1px is visible

    observer.observe(section);

    function updateParallax() {
      if (!inView) {
        ticking = false;
        return;
      }
      
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = viewportCenter - sectionCenter;

      if (bgLayer) {
        bgLayer.style.transform = `translateY(${offset * SPEED_BG}px)`;
      }

      particles.forEach(p => {
        p.style.transform = `translateY(${offset * SPEED_FOREGROUND}px)`;
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking && inView) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    
    // Initial call
    updateParallax();
  };

  /* -----------------------------------------------
     HERO SCROLL SMOOTH PARALLAX
  ----------------------------------------------- */
  const initHeroParallax = () => {
    const heroImg = document.querySelector('.hero-img');
    if (!heroImg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight * 1.2) {
            heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  /* -----------------------------------------------
     TICKER: Pause on hover
  ----------------------------------------------- */
  const initTicker = () => {
    const tickerInners = document.querySelectorAll('.ticker-inner');
    tickerInners.forEach((ticker) => {
      ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
      });
      ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
      });
    });
  };

  /* -----------------------------------------------
     VIDEO CARD (mock interaction)
  ----------------------------------------------- */
  const initVideoCard = () => {
    const playBtn = document.getElementById('play-btn');
    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.95);
        display: flex; align-items: center; justify-content: center;
        animation: fadeInModal 0.35s ease;
      `;

      const style = document.createElement('style');
      style.textContent = `@keyframes fadeInModal { from { opacity: 0 } to { opacity: 1 } }`;
      document.head.appendChild(style);

      const inner = document.createElement('div');
      inner.style.cssText = `
        width: min(800px, 92vw);
        text-align: center;
        color: rgba(255,255,255,0.6);
        font-family: 'Jost', sans-serif;
        font-size: 14px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      `;

      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%;
        height: 450px;
        background: linear-gradient(135deg, #1a0f08, #2C1F14);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
      `;
      placeholder.innerHTML = `
        <div style="text-align: center;">
          <div style="font-family: 'Playfair Display', serif; font-size: 20px; color: rgba(201, 184, 154, 0.8); font-style: italic; margin-bottom: 12px;">The Babbi Story</div>
          <div style="font-size: 11px; letter-spacing: 0.2em; color: rgba(255,255,255,0.35);">VIDEO PLAYER</div>
        </div>
      `;

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '× CLOSE';
      closeBtn.style.cssText = `
        background: none; border: 1px solid rgba(255,255,255,0.25);
        color: rgba(255,255,255,0.6); font-family: 'Jost', sans-serif;
        font-size: 11px; letter-spacing: 0.2em; padding: 10px 24px;
        cursor: pointer; transition: all 0.3s;
      `;
      closeBtn.onmouseenter = () => {
        closeBtn.style.background = 'rgba(255,255,255,0.1)';
        closeBtn.style.color = '#fff';
      };
      closeBtn.onmouseleave = () => {
        closeBtn.style.background = 'none';
        closeBtn.style.color = 'rgba(255,255,255,0.6)';
      };
      closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      };

      inner.appendChild(placeholder);
      inner.appendChild(closeBtn);
      overlay.appendChild(inner);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        }
      });

      document.body.style.overflow = 'hidden';
      document.body.appendChild(overlay);
    });
  };

  /* -----------------------------------------------
     SCROLL TEXT REVEAL ANIMATION (TRADITION SECTION)
  ----------------------------------------------- */
  const initScrollTextAnimation = () => {
    const textEl = document.getElementById('scroll-text-anim');
    if (!textEl) return;
    
    // We split by text nodes and elements to preserve HTML tags like <em>
    const splitTextPreserveHTML = (element) => {
      let html = '';
      element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach(word => {
            if (word.trim().length > 0) {
              html += `<span class="scroll-word">${word}</span>`;
            } else {
              html += word; // Keep whitespace
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // It's an element like <em>
          const tag = node.tagName.toLowerCase();
          const words = node.textContent.split(/(\s+)/);
          let innerHtml = '';
          words.forEach(word => {
            if (word.trim().length > 0) {
              innerHtml += `<span class="scroll-word">${word}</span>`;
            } else {
              innerHtml += word;
            }
          });
          html += `<${tag}>${innerHtml}</${tag}>`;
        }
      });
      return html;
    };
    
    textEl.innerHTML = splitTextPreserveHTML(textEl);
    
    const words = textEl.querySelectorAll('.scroll-word');
    if (words.length === 0) return;
    
    // Set initial opacity
    words.forEach(word => {
      word.style.opacity = '0.2';
      word.style.transition = 'opacity 0.1s ease-out';
    });
    
    const onScroll = () => {
      const rect = textEl.getBoundingClientRect();
      const viewH = window.innerHeight;
      
      // Calculate progress of the text element passing through the middle of the viewport
      const triggerPoint = viewH * 0.7; // Start animating when top hits 70% of screen
      const endPoint = viewH * 0.3; // Finish when bottom hits 30% of screen
      
      const startY = triggerPoint; 
      const endY = endPoint;
      const elementY = rect.top + (rect.height / 2); // Use center of text block
      
      let progress = (startY - elementY) / (startY - endY);
      progress = Math.max(0, Math.min(1, progress)); // clamp between 0 and 1
      
      // Calculate which word should be fully visible based on progress
      const targetIndex = Math.floor(progress * words.length);
      
      words.forEach((word, index) => {
        if (index <= targetIndex && progress > 0) {
          word.style.opacity = '1';
        } else {
          word.style.opacity = '0.2';
        }
      });
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger once on load
    onScroll();
  };

  /* -----------------------------------------------
     ADD FADE ANIMATION CLASSES TO ELEMENTS
  ----------------------------------------------- */
  const addAnimationClasses = () => {
    // Tradition
    const tradLabel = document.querySelector('.tradition-text-col .section-label');
    const tradDesc  = document.querySelector('.tradition-description');
    const tradBody  = document.querySelector('.tradition-body');
    const tradBtn   = document.querySelector('.tradition-text-col .btn-outline');
    const tradImgs  = document.querySelectorAll('.tradition-img-wrap');

    tradLabel && tradLabel.classList.add('fade-up');
    tradDesc  && tradDesc.classList.add('fade-up', 'delay-1');
    tradBody  && tradBody.classList.add('fade-up', 'delay-2');
    tradBtn   && tradBtn.classList.add('fade-up', 'delay-3');
    tradImgs.forEach((img, i) => img.classList.add('fade-up', `delay-${i + 1}`));

    // Ingredients
    const ingTitle = document.querySelector('.ing-title');
    const ingDesc  = document.querySelector('.ing-desc');
    ingTitle && ingTitle.classList.add('fade-left');
    ingDesc  && ingDesc.classList.add('fade-left', 'delay-1');

    // History
    const histLabel = document.querySelector('.history-text-col .section-label');
    const histTitle = document.querySelector('.history-title');
    const histDesc  = document.querySelector('.history-desc');
    const histBtn   = document.querySelector('#find-out-more-btn');

    histLabel && histLabel.classList.add('fade-up');
    histTitle && histTitle.classList.add('fade-up', 'delay-1');
    histDesc  && histDesc.classList.add('fade-up', 'delay-2');
    histBtn   && histBtn.classList.add('fade-up', 'delay-3');

    const histPhotos = document.querySelectorAll('.history-photo-wrap');
    histPhotos.forEach((p, i) => p.classList.add('fade-left', `delay-${i + 1}`));

    // Pistachio
    const pistLabel = document.querySelector('.pistachio-content .section-label');
    const pistTitle = document.querySelector('.pistachio-title');
    const pistDesc  = document.querySelector('.pistachio-desc');
    const pistCtas  = document.querySelector('.pistachio-ctas');

    pistLabel && pistLabel.classList.add('fade-up');
    pistTitle && pistTitle.classList.add('fade-up', 'delay-1');
    pistDesc  && pistDesc.classList.add('fade-up', 'delay-2');
    pistCtas  && pistCtas.classList.add('fade-up', 'delay-3');

    // Academy
    const academyTitle = document.querySelector('.academy-title');
    const academyDesc  = document.querySelector('.academy-desc');
    const academyCtas  = document.querySelector('.academy-ctas');
    const academyImgs  = document.querySelectorAll('.academy-img-wrap');

    academyTitle && academyTitle.classList.add('fade-right');
    academyDesc  && academyDesc.classList.add('fade-right', 'delay-1');
    academyCtas  && academyCtas.classList.add('fade-right', 'delay-2');
    academyImgs.forEach((img, i) => img.classList.add('fade-left', `delay-${i + 1}`));
  };

  /* -----------------------------------------------
     SMOOTH ANCHOR SCROLLING
  ----------------------------------------------- */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 106; // header height
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  };

  /* -----------------------------------------------
     HERO CONTENT ENTRANCE ANIMATION
  ----------------------------------------------- */
  const initHeroEntrance = () => {
    const heroTitle    = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCard     = document.querySelector('.hero-video-card');

    const animate = (el, delay, translateY = 30) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = `translateY(${translateY}px)`;
      el.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    };

    animate(heroTitle, 200);
    animate(heroSubtitle, 450);
    animate(heroCard, 650);
  };

  /* -----------------------------------------------
     CURSOR DOT (subtle branded cursor)
  ----------------------------------------------- */
  const initCursor = () => {
    // Only on desktop
    if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0; z-index: 9998;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(176, 154, 114, 0.75);
      pointer-events: none;
      transition: transform 0.15s ease, width 0.25s ease, height 0.25s ease, opacity 0.3s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);

    let cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    // Enlarge on interactive elements
    document.querySelectorAll('a, button, .ing-tab, .tradition-img-wrap, .academy-img-wrap').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '36px';
        cursor.style.height = '36px';
        cursor.style.background = 'rgba(176, 154, 114, 0.15)';
        cursor.style.border = '1px solid rgba(176, 154, 114, 0.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '8px';
        cursor.style.height = '8px';
        cursor.style.background = 'rgba(176, 154, 114, 0.75)';
        cursor.style.border = 'none';
      });
    });
  };

  /* -----------------------------------------------
     INIT ALL
  ----------------------------------------------- */
  const init = () => {
    initHeader();
    initSearch();
    initMobileMenu();
    initIngredientsTabs();
    initIngredientSliders();
    initHistoryParallax();
    initProductParallax();
    initCertificationsParallax();
    initHeroParallax();
    initTicker();
    addAnimationClasses();
    observeFade();
    initSmoothScroll();
    initHeroEntrance();
    initScrollTextAnimation();
    initCursor();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
