(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.getElementById("siteHeader");
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* Swiper — homepage pillar band (minimal slides + live sliding) */
  if (document.querySelector(".hero-swiper") && typeof Swiper !== "undefined") {
    var pillar = document.querySelector(".hero-swiper.ph-pillar-swiper");
    var swOpts = {
      loop: true,
      speed: pillar ? 720 : 900,
      effect: pillar ? "slide" : "fade",
      autoplay: pillar
        ? {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : {
            delay: 7200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      pagination: {
        el: ".hero-pagination",
        clickable: true,
        dynamicBullets: false,
      },
      navigation: {
        nextEl: ".hero-swiper .swiper-button-next",
        prevEl: ".hero-swiper .swiper-button-prev",
      },
    };
    if (!pillar) {
      swOpts.fadeEffect = { crossFade: true };
    }
    new Swiper(".hero-swiper", swOpts);
  }

  /* Swiper — Project detail gallery + thumbs */
  if (typeof Swiper !== "undefined" && document.querySelector(".pd-gallery") && document.querySelector(".pd-thumbs")) {
    var thumbsSwiper = new Swiper(".pd-thumbs", {
      spaceBetween: 12,
      slidesPerView: 3,
      freeMode: true,
      watchSlidesProgress: true,
      breakpoints: {
        480: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
      },
    });

    new Swiper(".pd-gallery", {
      speed: 700,
      spaceBetween: 0,
      navigation: {
        nextEl: ".pd-gallery .swiper-button-next",
        prevEl: ".pd-gallery .swiper-button-prev",
      },
      pagination: {
        el: ".pd-gallery__pagination",
        clickable: true,
        dynamicBullets: true,
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
    });
  }

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 900,
      once: true,
      offset: 56,
      easing: "ease-out-cubic",
    });
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    var heroEl = document.querySelector(".hero");
    if (heroEl && !heroEl.classList.contains("hero--carousel")) {
      gsap.utils.toArray(".parallax-hero-bg").forEach(function (bg) {
        gsap.to(bg, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray(".hero-slide .hero-content").forEach(function (el) {
        gsap.to(el, {
          y: 36,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }

    var ecoFlow = document.querySelector("[data-eco-flow]");
    if (ecoFlow && !prefersReduced) {
      var ecoSteps = gsap.utils.toArray(".ph-flow__step, .home-eco-step");
      gsap.set(ecoSteps, { opacity: 0, y: 28 });
      ecoSteps.forEach(function (step, i) {
        gsap.to(step, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ecoFlow,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
      });
    }

    var pageHeader = document.querySelector(".page-header");
    var pageHeaderBg = document.querySelector(".page-header__bg");
    if (pageHeader && pageHeaderBg) {
      gsap.to(pageHeaderBg, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".page-header",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    var ctaBg = document.querySelector(".cta-band-bg");
    if (ctaBg) {
      gsap.to(ctaBg, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: ".cta-band",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    /* Homepage service banner — parallax photo layers on scroll */
    var pillarBand = document.querySelector(".ph-pillar-band");
    if (pillarBand && !prefersReduced) {
      gsap.utils.toArray(".ph-banner-parallax").forEach(function (wrap) {
        gsap.fromTo(
          wrap,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: pillarBand,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.15,
            },
          }
        );
      });
    }
  }

  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * (target - start) + start);
      el.textContent = formatNumber(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(n) {
    return n.toLocaleString("en-IN");
  }

  var countersStarted = false;
  var counterSection = document.querySelector("#stats");

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    document.querySelectorAll(".counter").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      animateValue(el, target, 2000);
    });
  }

  if ("IntersectionObserver" in window && counterSection) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startCounters();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(counterSection);
  } else if (document.querySelector(".counter")) {
    startCounters();
  }

  var filterReset = document.getElementById("filter-reset");
  var filterApply = document.getElementById("filter-apply");
  var filterLoc = document.getElementById("filter-location");
  var filterPrice = document.getElementById("filter-price");
  if (filterReset && filterLoc && filterPrice) {
    filterReset.addEventListener("click", function () {
      filterLoc.selectedIndex = 0;
      filterPrice.selectedIndex = 0;
    });
  }
  if (filterApply) {
    filterApply.addEventListener("click", function () {
      filterApply.classList.add("is-pulse");
      setTimeout(function () {
        filterApply.classList.remove("is-pulse");
      }, 450);
    });
  }

  var tiltCards = document.querySelectorAll("[data-tilt]");

  var homeContactForm = document.getElementById("homeContactForm");
  var homeFormThanks = document.getElementById("homeFormThanks");
  if (homeContactForm) {
    homeContactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(homeContactForm);
      var name = (fd.get("name") || "").toString().trim();
      var phone = (fd.get("phone") || "").toString().trim();
      var email = (fd.get("email") || "").toString().trim();
      var interest = (fd.get("interest") || "").toString();
      var message = (fd.get("message") || "").toString().trim();
      var subject = encodeURIComponent("Website enquiry — " + interest);
      var body =
        "Name: " +
        name +
        "\nPhone: " +
        phone +
        (email ? "\nEmail: " + email : "") +
        "\nInterest: " +
        interest +
        (message ? "\n\nMessage:\n" + message : "");
      var mailto = "mailto:info@csdeveelopers.com?subject=" + subject + "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
      if (homeFormThanks) {
        homeFormThanks.hidden = false;
      }
    });
  }

  if (!prefersReduced && tiltCards.length) {
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var midX = rect.width / 2;
        var midY = rect.height / 2;
        var rotateX = ((y - midY) / midY) * -9;
        var rotateY = ((x - midX) / midX) * 9;
        card.style.transform =
          "perspective(1000px) rotateX(" +
          rotateX +
          "deg) rotateY(" +
          rotateY +
          "deg) translateZ(0)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  window.addEventListener("load", function () {
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  });
})();
