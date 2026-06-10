/**
 * BARANIGA PORTFOLIO – MAIN JAVASCRIPT
 * Complete JS v1.0
 * Features: Loader, Cursor, Navbar, Matrix Rain, Particles,
 *           Typing Effect, Counters, Skill Bars, Portfolio Filter,
 *           AOS-like Scroll Animations, Contact Form, Back-to-Top,
 *           Dark/Light Theme Toggle, Smooth Scroll
 */

$(document).ready(function () {

  /* ============================================================
     1. LOADING SCREEN
  ============================================================ */
  (function initLoader() {
    const bar   = document.getElementById('loaderBar');
    const text  = document.getElementById('loaderText');
    const loader = document.getElementById('loader');
    const messages = [
      'INITIALIZING SYSTEM...',
      'LOADING ASSETS...',
      'DECRYPTING DATA...',
      'ESTABLISHING SECURE CONNECTION...',
      'ACCESS GRANTED.'
    ];
    let progress = 0;
    let msgIdx   = 0;

    const interval = setInterval(function () {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (text) text.textContent = 'ACCESS GRANTED.';
        setTimeout(function () {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          // Trigger initial animations after loader
          triggerHeroAnimations();
        }, 600);
      }
      if (bar) bar.style.width = Math.min(progress, 100) + '%';
      // Cycle through messages
      const newIdx = Math.floor((progress / 100) * messages.length);
      if (newIdx !== msgIdx && newIdx < messages.length) {
        msgIdx = newIdx;
        if (text) text.textContent = messages[msgIdx];
      }
    }, 120);

    // Prevent scroll during load
    document.body.style.overflow = 'hidden';
  })();

  function triggerHeroAnimations() {
    // Animate counter immediately on hero visible
    startCounters();
  }

  /* ============================================================
     2. CUSTOM CURSOR
  ============================================================ */
  (function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Scale cursor on interactive elements
    const interactables = 'a, button, .filter-btn, .portfolio-card, .service-card';
    $(document).on('mouseenter', interactables, function () {
      cursor.style.width  = '18px';
      cursor.style.height = '18px';
      cursor.style.background = 'var(--green)';
      follower.style.width  = '50px';
      follower.style.height = '50px';
      follower.style.borderColor = 'var(--green)';
    }).on('mouseleave', interactables, function () {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      cursor.style.background = 'var(--cyan)';
      follower.style.width  = '30px';
      follower.style.height = '30px';
      follower.style.borderColor = 'var(--cyan)';
    });
  })();

  /* ============================================================
     3. MATRIX RAIN ANIMATION
  ============================================================ */
  (function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+-=[]{}|;:,.<>?/BARANIGA';
    let columns, drops;
    const fontSize = 13;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops   = new Array(columns).fill(1);
    }
    resize();
    window.addEventListener('resize', resize);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ffff';
      ctx.font      = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? '#39ff14' : '#00ffff';
        ctx.globalAlpha = Math.random() * 0.5 + 0.3;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        ctx.globalAlpha = 1;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(drawMatrix, 55);
  })();

  /* ============================================================
     4. PARTICLE CANVAS (BACKGROUND)
  ============================================================ */
  (function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const NUM_PARTICLES = 60;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x:   Math.random() * canvas.width,
        y:   Math.random() * canvas.height,
        r:   Math.random() * 1.5 + 0.3,
        vx:  (Math.random() - 0.5) * 0.3,
        vy:  (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '0,255,255' : '57,255,20'
      };
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(createParticle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p, i) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();

        // Draw lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            const opacity = (1 - dist / 100) * 0.12;
            ctx.strokeStyle = 'rgba(' + p.color + ',' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  })();

  /* ============================================================
     5. NAVBAR SCROLL BEHAVIOR & ACTIVE LINK
  ============================================================ */
  (function initNavbar() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    // Scrolled class
    $(window).on('scroll.navbar', function () {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Active section highlighting
      let current = '';
      sections.forEach(function (sec) {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });

    // Smooth scroll for nav links (jQuery enhancement)
    $('a[href^="#"]').on('click', function (e) {
      const target = $(this.getAttribute('href'));
      if (target.length) {
        e.preventDefault();
        const offset = target.offset().top - 70;
        $('html, body').animate({ scrollTop: offset }, 700, 'swing');
        // Close mobile menu
        const collapse = document.getElementById('navbarMenu');
        if (collapse && collapse.classList.contains('show')) {
          new bootstrap.Collapse(collapse).hide();
        }
      }
    });
  })();

  /* ============================================================
     6. TYPING EFFECT
  ============================================================ */
  (function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const words = [
      'Web Developer',
      'Graphics Designer',
      'UI/UX Designer',
      'Bootstrap Expert',
      'Creative Coder',
      'B.Sc Student'
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function type() {
      const word = words[wordIdx];
      if (!deleting) {
        el.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) {
          deleting = true;
          pauseTimer = setTimeout(type, 2000);
          return;
        }
        setTimeout(type, 90);
      } else {
        el.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 45);
      }
    }

    setTimeout(type, 1500);
  })();

  /* ============================================================
     7. AOS-LIKE SCROLL REVEAL
  ============================================================ */
  (function initScrollReveal() {
    const items = document.querySelectorAll('[data-aos]');

    function checkVisibility() {
      const windowH = window.innerHeight;
      items.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        if (rect.top < windowH - 60) {
          setTimeout(function () {
            el.classList.add('aos-animate');
            // Trigger skill bars when skills section animates
            if (el.closest('#skills')) {
              animateSkillBars();
            }
            // Trigger indicators when about section animates
            if (el.closest('#about')) {
              animateIndicators();
            }
          }, delay);
        }
      });
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    // Initial check (after loader)
    setTimeout(checkVisibility, 800);
  })();

  /* ============================================================
     8. ANIMATED SKILL BARS
  ============================================================ */
  let skillsAnimated = false;
  function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach(function (bar) {
      const width = bar.getAttribute('data-width');
      setTimeout(function () {
        bar.style.width = width + '%';
      }, 200);
    });
  }

  /* ============================================================
     9. ANIMATED INDICATORS (ABOUT)
  ============================================================ */
  let indicatorsAnimated = false;
  function animateIndicators() {
    if (indicatorsAnimated) return;
    indicatorsAnimated = true;
    document.querySelectorAll('.indicator-fill').forEach(function (fill) {
      const width = fill.getAttribute('data-width');
      setTimeout(function () {
        fill.style.width = width + '%';
      }, 300);
    });
  }

  /* ============================================================
     10. COUNTER ANIMATION
  ============================================================ */
  let countersStarted = false;
  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll('.counter').forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'));
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 40);
    });
  }

  // Also trigger counters on scroll into view
  $(window).on('scroll.counters', function () {
    const heroSection = document.getElementById('home');
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      startCounters();
    }
  });

  /* ============================================================
     11. PORTFOLIO FILTER
  ============================================================ */
  (function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items      = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(function () {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
              item.style.transition = 'opacity 0.4s, transform 0.4s';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.85)';
            item.style.transition = 'opacity 0.3s, transform 0.3s';
            setTimeout(function () {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  })();

  /* ============================================================
     12. CONTACT FORM
  ============================================================ */
  (function initContactForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const btn     = document.getElementById('sendMsgBtn');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Validate
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim() || (field.type === 'email' && !validateEmail(field.value))) {
          field.classList.add('is-invalid');
          valid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });
      if (!valid) return;

      // Simulate sending
      const btnText    = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');
      btnText.classList.add('d-none');
      btnLoading.classList.remove('d-none');
      btn.disabled = true;

      setTimeout(function () {
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        btn.disabled = false;
        form.reset();
        if (success) {
          success.classList.remove('d-none');
          setTimeout(function () { success.classList.add('d-none'); }, 5000);
        }
      }, 2000);
    });

    // Remove invalid class on input
    form.querySelectorAll('.cyber-input').forEach(function (input) {
      input.addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });
    });
  })();

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     13. BACK TO TOP BUTTON
  ============================================================ */
  (function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    $(window).on('scroll.btt', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
    });
  })();

  /* ============================================================
     14. DARK / LIGHT THEME TOGGLE
  ============================================================ */
  (function initTheme() {
    const toggleBtn  = document.getElementById('themeToggle');
    const themeIcon  = document.getElementById('themeIcon');
    const html       = document.documentElement;

    // Restore preference
    const saved = localStorage.getItem('brnTheme') || 'dark';
    html.setAttribute('data-theme', saved);
    updateIcon(saved);

    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('brnTheme', next);
      updateIcon(next);
    });

    function updateIcon(theme) {
      if (!themeIcon) return;
      if (theme === 'dark') {
        themeIcon.className = 'bi bi-sun-fill';
        if (toggleBtn) toggleBtn.title = 'Switch to Light Mode';
      } else {
        themeIcon.className = 'bi bi-moon-fill';
        if (toggleBtn) toggleBtn.title = 'Switch to Dark Mode';
      }
    }
  })();

  /* ============================================================
     15. CURRENT YEAR IN FOOTER
  ============================================================ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     16. SKILLS SECTION – TRIGGER ON SCROLL
  ============================================================ */
  $(window).on('scroll.skills', function () {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      animateSkillBars();
    }
  });

  /* ============================================================
     17. ABOUT SECTION – TRIGGER ON SCROLL
  ============================================================ */
  $(window).on('scroll.indicators', function () {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      animateIndicators();
    }
  });

  /* ============================================================
     18. NAVBAR MOBILE CLOSE ON LINK CLICK
  ============================================================ */
  $('.navbar-nav .nav-link').on('click', function () {
    const menu = document.getElementById('navbarMenu');
    if (menu && menu.classList.contains('show')) {
      new bootstrap.Collapse(menu).hide();
    }
  });

  /* ============================================================
     19. HOVER TILT EFFECT ON CARDS (subtle 3D)
  ============================================================ */
  (function initTiltEffect() {
    document.querySelectorAll('.portfolio-card, .service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = this.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width / 2;
        const cy     = rect.height / 2;
        const rotX   = ((y - cy) / cy) * 4;
        const rotY   = ((x - cx) / cx) * -4;
        this.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
        this.style.transition = 'transform 0.5s ease';
      });
    });
  })();

  /* ============================================================
     20. GLOWING BORDER TRAIL EFFECT ON GLASS CARDS
  ============================================================ */
  (function initBorderGlow() {
    document.querySelectorAll('.glass-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  })();

  /* ============================================================
     21. TIMELINE ANIMATION CHECK
  ============================================================ */
  $(window).on('scroll.timeline', function () {
    document.querySelectorAll('.timeline-event').forEach(function (ev) {
      const rect = ev.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        ev.style.opacity = '1';
        ev.style.transform = 'none';
      }
    });
  });

  /* ============================================================
     22. LAZY IMAGE LOADING (Intersection Observer)
  ============================================================ */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(function (img) { imageObserver.observe(img); });
  }

  /* ============================================================
     23. SCROLL PROGRESS INDICATOR (TOP BAR)
  ============================================================ */
  (function initScrollProgress() {
    // Create element
    const bar = document.createElement('div');
    bar.id = 'scrollProgress';
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '2px',
      width: '0%',
      background: 'linear-gradient(90deg, #00ffff, #39ff14)',
      zIndex: '10000',
      pointerEvents: 'none',
      boxShadow: '0 0 8px #00ffff',
      transition: 'width 0.1s linear'
    });
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = (scrollTop / docHeight) * 100;
      bar.style.width  = percentage + '%';
    }, { passive: true });
  })();

  /* ============================================================
     24. CONSOLE EASTER EGG
  ============================================================ */
  console.log('%c 🛡️ BARANIGA PORTFOLIO ', 'background:#00ffff;color:#000;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:4px;');
  console.log('%c Web Developer & Graphics Designer ', 'color:#39ff14;font-size:12px;');
  console.log('%c 📍 TBML College · Tamil Nadu, India ', 'color:#8a2be2;font-size:12px;');
  console.log('%c ⚡ Built with HTML5, CSS3, JS, Bootstrap 5, jQuery ', 'color:#aaa;font-size:11px;');

}); // END $(document).ready
