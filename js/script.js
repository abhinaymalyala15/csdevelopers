(function () {
  "use strict";

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

  /* Swiper — Hero */
  if (document.querySelector(".hero-swiper") && typeof Swiper !== "undefined") {
    new Swiper(".hero-swiper", {
      loop: true,
      speed: 900,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: {
        delay: 6500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".hero-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".hero-swiper .swiper-button-next",
        prevEl: ".hero-swiper .swiper-button-prev",
      },
    });
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
    if (heroEl) {
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
  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced && tiltCards.length) {
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var midX = rect.width / 2;
        var midY = rect.height / 2;
        var rotateX = ((y - midY) / midY) * -7;
        var rotateY = ((x - midX) / midX) * 7;
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

  document.querySelectorAll(".enquiry-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = "Sent — we will reach out soon";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2800);
    });
  });

  window.addEventListener("load", function () {
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  });
})();
