(function () {
  "use strict";

  var nav = document.getElementById("mainNav");
  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");
  var yearEl = document.getElementById("fsYear");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (nav) {
    window.addEventListener(
      "scroll",
      function () {
        nav.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true }
    );
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".fade-in").forEach(function (el) {
    observer.observe(el);
  });
})();
