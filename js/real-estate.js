/* ═════════════════════════════════════════════════════════
   CS DEVELOPERS — Script (3D Flow Premium Edition)
   ═════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var navbar    = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  var allLinks  = document.querySelectorAll('.nav-link');
  var sections  = document.querySelectorAll('section[id]');
  var reveals   = document.querySelectorAll('.reveal');
  var form      = document.getElementById('contactForm');

  function handleNavScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  function highlightNav() {
    if (!navbar || !allLinks.length) return;
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var id  = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + section.offsetHeight) {
        allLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  function initReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  if (navbar && hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    allLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href') || '';
        if (href.charAt(0) !== '#') {
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
          return;
        }
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('.footer-logo.re-legacy-scroll').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var href = el.getAttribute('href') || '';
      if (href && href.indexOf('#') !== 0) return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = document.getElementById('userName').value.trim();
      var phone   = document.getElementById('userPhone').value.trim();
      var message = document.getElementById('userMessage').value.trim();
      if (!name || !phone || !message) { alert('Please fill in all fields.'); return; }

      var btn = document.getElementById('submitBtn');
      var originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled    = true;
      btn.style.opacity = '0.7';

      setTimeout(function () {
        alert('Thank you, ' + name + '!\n\nYour message has been received. Our team will contact you shortly at ' + phone + '.');
        form.reset();
        btn.textContent   = originalText;
        btn.disabled      = false;
        btn.style.opacity = '1';
      }, 800);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNavScroll();
        highlightNav();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });


  /* ═══════════════════════════════════════════════════════
     3D FLOW PREMIUM EFFECTS
     ═══════════════════════════════════════════════════════ */

  // ──────────────────────────────────────────────────────
  // 1. HERO PARTICLES
  // ──────────────────────────────────────────────────────
  function initHeroParticles() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var canvas = document.createElement('canvas');
    canvas.id  = 'hero-particles';
    canvas.style.cssText = 'position:absolute;inset:0;z-index:2;pointer-events:none;';
    hero.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W, H, particles;

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      var count = Math.min(60, Math.floor(W * H / 14000));
      for (var i = 0; i < count; i++) {
        particles.push({
          x:     Math.random() * W,
          y:     Math.random() * H,
          r:     Math.random() * 1.8 + 0.4,
          vx:    (Math.random() - 0.5) * 0.18,
          vy:    -(Math.random() * 0.22 + 0.08),
          alpha: Math.random() * 0.5 + 0.15,
          pulse: Math.random() * Math.PI * 2,
          gold: Math.random() > 0.48
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      var now = Date.now() * 0.001;

      particles.forEach(function (p) {
        p.pulse += 0.012;
        var alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (p.gold) {
          ctx.fillStyle = 'rgba(201,169,98,' + alpha + ')';
          ctx.shadowColor = 'rgba(201,169,98,0.55)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = 'rgba(107,135,249,' + (alpha * 0.85) + ')';
          ctx.shadowColor = 'rgba(74,108,247,0.45)';
          ctx.shadowBlur = 5;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -5)   p.y = H + 5;
        if (p.x < -5)   p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
      });

      requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();
    window.addEventListener('resize', function () { resize(); createParticles(); });
  }

  // ──────────────────────────────────────────────────────
  // 2. 3D TILT EFFECT — Project Cards
  // ──────────────────────────────────────────────────────
  function TiltCard(el) {
    var MAX_TILT  = 12;   // degrees
    var SCALE_VAL = 1.03;
    var GLARE_OPC = 0.25;
    var raf       = null;
    var targetRX  = 0, targetRY = 0, currentRX = 0, currentRY = 0;

    // Create glare element
    var glare = document.createElement('div');
    glare.style.cssText = [
      'position:absolute',
      'inset:0',
      'border-radius:inherit',
      'pointer-events:none',
      'z-index:6',
      'opacity:0',
      'background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 65%)',
      'transition:opacity 0.4s ease',
      'will-change:background,opacity'
    ].join(';');
    el.appendChild(glare);

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      currentRX = lerp(currentRX, targetRX, 0.12);
      currentRY = lerp(currentRY, targetRY, 0.12);

      el.style.transform =
        'perspective(800px)' +
        ' rotateX(' + currentRX + 'deg)' +
        ' rotateY(' + currentRY + 'deg)' +
        ' scale(' + SCALE_VAL + ')' +
        ' translateZ(0)';

      var gx = 50 - (currentRY / MAX_TILT) * 40;
      var gy = 50 - (currentRX / MAX_TILT) * 40;
      glare.style.background =
        'radial-gradient(circle at ' + gx + '% ' + gy + '%, rgba(255,255,255,' + GLARE_OPC + ') 0%, transparent 65%)';

      raf = requestAnimationFrame(animate);
    }

    el.addEventListener('mouseenter', function () {
      el.classList.add('tilt-active');
      glare.style.opacity = '1';
      raf = requestAnimationFrame(animate);
    });

    el.addEventListener('mousemove', function (e) {
      var rect    = el.getBoundingClientRect();
      var cx      = rect.left + rect.width  / 2;
      var cy      = rect.top  + rect.height / 2;
      var dx      = (e.clientX - cx) / (rect.width  / 2);
      var dy      = (e.clientY - cy) / (rect.height / 2);

      targetRY =  dx * MAX_TILT;
      targetRX = -dy * MAX_TILT;
    });

    el.addEventListener('mouseleave', function () {
      targetRX = 0;
      targetRY = 0;

      setTimeout(function () {
        cancelAnimationFrame(raf);
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
        el.classList.remove('tilt-active');
        glare.style.opacity = '0';
      }, 300);
    });
  }

  function initTiltCards() {
    document.querySelectorAll('.proj-card').forEach(function (card) {
      // Skip on touch devices
      if ('ontouchstart' in window) return;
      new TiltCard(card);
    });
  }

  // ──────────────────────────────────────────────────────
  // 4. FEATURED CARD 3D HOVER
  // ──────────────────────────────────────────────────────
  function initFeaturedCard3D() {
    var card = document.querySelector('.feat-card');
    if (!card || 'ontouchstart' in window) return;

    var MAX = 6;
    var targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
    var raf;

    function lerpF(a, b, t) { return a + (b - a) * 0.1; }

    function animFeat() {
      currentRX = lerpF(currentRX, targetRX, 0.1);
      currentRY = lerpF(currentRY, targetRY, 0.1);

      card.style.transform =
        'perspective(1400px)' +
        ' rotateX(' + currentRX + 'deg)' +
        ' rotateY(' + currentRY + 'deg)' +
        ' translateY(-10px) scale(1.01)';

      raf = requestAnimationFrame(animFeat);
    }

    card.addEventListener('mouseenter', function () {
      raf = requestAnimationFrame(animFeat);
    });

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var dx   = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
      var dy   = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
      targetRY =  dx * MAX;
      targetRX = -dy * MAX;
    });

    card.addEventListener('mouseleave', function () {
      targetRX = 0;
      targetRY = 0;
      setTimeout(function () {
        cancelAnimationFrame(raf);
        card.style.transform = '';
      }, 400);
    });
  }

  // ──────────────────────────────────────────────────────
  // 5. MAGNETIC BUTTONS
  // ──────────────────────────────────────────────────────
  function initMagneticButtons() {
    if ('ontouchstart' in window) return;

    document.querySelectorAll('.btn').forEach(function (btn) {
      var MAX_MOVE = 8;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        var dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        btn.style.transform = 'translate(' + (dx * MAX_MOVE) + 'px, ' + (dy * MAX_MOVE - 3) + 'px) translateZ(8px) scale(1.02)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // ──────────────────────────────────────────────────────
  // 6. CUSTOM PREMIUM CURSOR
  // ──────────────────────────────────────────────────────
  function initCustomCursor() {
    if ('ontouchstart' in window) return;

    var dot  = document.createElement('div');
    var ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100;
    var rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

    var hoverEls = document.querySelectorAll('a, button, .proj-card, .feat-card, .filter-btn');
    hoverEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });
  }

  // ──────────────────────────────────────────────────────
  // 7. PROJECT FILTER WITH 3D EXIT ANIMATION
  // ──────────────────────────────────────────────────────
  function initProjectFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards      = document.querySelectorAll('.proj-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card, i) {
          var match = filter === 'all' || card.getAttribute('data-status') === filter;

          if (match) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'perspective(800px) translateY(20px) translateZ(-30px) scale(0.95)';
            setTimeout(function () {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
              card.style.opacity    = '1';
              card.style.transform  = 'perspective(800px) translateY(0) translateZ(0) scale(1)';
              setTimeout(function () {
                card.style.transition = '';
                card.style.transform  = '';
              }, 450);
            }, i * 60);
          } else {
            card.style.opacity   = '0';
            card.style.transform = 'perspective(800px) translateY(-10px) translateZ(-20px) scale(0.95)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ──────────────────────────────────────────────────────
  // 8. LOAD MORE BUTTON
  // ──────────────────────────────────────────────────────
  function initLoadMore() {
    var btn = document.getElementById('loadMoreBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var originalText = btn.textContent;
      btn.textContent = 'Loading…';
      btn.disabled    = true;
      btn.style.opacity = '0.7';
      setTimeout(function () {
        btn.textContent   = 'All Projects Loaded';
        btn.style.opacity = '0.5';
      }, 1000);
    });
  }

  // ──────────────────────────────────────────────────────
  // 9. ABOUT IMAGE 3D PARALLAX DEPTH
  // ──────────────────────────────────────────────────────
  function initAboutTilt() {
    var imgWrap = document.querySelector('.about-img');
    if (!imgWrap || 'ontouchstart' in window) return;
    var MAX = 8;
    var targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
    var raf;

    function animAbout() {
      currentRX += (targetRX - currentRX) * 0.1;
      currentRY += (targetRY - currentRY) * 0.1;
      imgWrap.style.transform =
        'perspective(1000px)' +
        ' rotateX(' + currentRX + 'deg)' +
        ' rotateY(' + currentRY + 'deg)' +
        ' translateY(-4px)';
      raf = requestAnimationFrame(animAbout);
    }

    imgWrap.addEventListener('mouseenter', function () {
      raf = requestAnimationFrame(animAbout);
    });

    imgWrap.addEventListener('mousemove', function (e) {
      var rect = imgWrap.getBoundingClientRect();
      var dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      var dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      targetRY =  dx * MAX;
      targetRX = -dy * MAX;
    });

    imgWrap.addEventListener('mouseleave', function () {
      targetRX = 0;
      targetRY = 0;
      setTimeout(function () {
        cancelAnimationFrame(raf);
        imgWrap.style.transform = '';
      }, 400);
    });
  }

  // ──────────────────────────────────────────────────────
  // 10. SECTION PARALLAX DEPTH SCROLL
  // ──────────────────────────────────────────────────────
  function initSectionParallax() {
    var parallaxEls = [
      { el: document.querySelector('.proj-featured'), speed: 0.08, axis: 'y' }
    ];

    window.addEventListener('scroll', function () {
      if (!ticking) return; // handled in main scroll
    });

    // Store for the main RAF
    window._parallaxEls = parallaxEls.filter(function (p) { return !!p.el; });
  }

  // Called in main scroll RAF
  function updateParallax() {
    var scrollY = window.scrollY;

    // Hero text fade/rise
    var heroContent = document.querySelector('.hero-content');
    var hero        = document.querySelector('.hero');
    if (heroContent && hero) {
      var heroH    = hero.offsetHeight;
      var progress = scrollY / heroH;
      if (scrollY < heroH) {
        heroContent.style.transform = 'translateZ(40px) translateY(' + (scrollY * 0.28) + 'px)';
        heroContent.style.opacity   = Math.max(0, 1 - progress * 1.6);
      }
    }

    // Parallax for other sections
    if (window._parallaxEls) {
      window._parallaxEls.forEach(function (item) {
        var rect   = item.el.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - window.innerHeight / 2;
        var offset = center * item.speed;
        item.el.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
      });
    }
  }


  // ──────────────────────────────────────────────────────
  // INIT ALL
  // ──────────────────────────────────────────────────────
  handleNavScroll();
  highlightNav();
  initReveal();
  initHeroParticles();
  initTiltCards();
  initFeaturedCard3D();
  initMagneticButtons();
  initCustomCursor();
  initProjectFilter();
  initLoadMore();
  initAboutTilt();
  initSectionParallax();

})();
