(function () {
  "use strict";

  var saPage = document.getElementById("sa-page");
  if (!saPage) return;

  function refreshIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  document.querySelectorAll("#sa-page .reveal").forEach(function (el) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
  });

  var slides = saPage.querySelectorAll(".slider-img");
  var dotsContainer = document.getElementById("sliderDots");
  var current = 0;
  var autoplayTimer;

  function goSlide(n) {
    if (!slides.length || !dotsContainer) return;
    slides[current].classList.remove("active");
    dotsContainer.children[current].classList.remove("active");
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add("active");
    dotsContainer.children[current].classList.add("active");
    resetAutoplay();
  }

  window.goSlide = goSlide;

  if (dotsContainer) {
    slides.forEach(function (_, i) {
      var d = document.createElement("div");
      d.className = "slider-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", function () {
        goSlide(i);
      });
      dotsContainer.appendChild(d);
    });
  }

  function nextSlide() {
    goSlide(current + 1);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 4500);
  }

  if (slides.length) {
    resetAutoplay();
  }

  var trustItems = [
    { icon: "graduation-cap", text: "500+ students guided" },
    { icon: "globe-2", text: "4+ countries covered" },
    { icon: "shield-check", text: "High visa success rate" },
    { icon: "award", text: "Scholarship guidance" },
    { icon: "users", text: "Dedicated counsellors" },
    { icon: "clock", text: "On-time submissions" },
    { icon: "heart-handshake", text: "Post-arrival support" },
    { icon: "star", text: "Student-first approach" },
  ];

  var track = document.getElementById("trustTrack");
  if (track) {
    trustItems.concat(trustItems).forEach(function (item) {
      var el = document.createElement("div");
      el.className = "trust-item";
      el.innerHTML =
        '<i data-lucide="' +
        item.icon +
        '" style="width:16px;height:16px;"></i> ' +
        item.text;
      track.appendChild(el);
    });
    refreshIcons();
  }

  refreshIcons();

  var statNums = saPage.querySelectorAll(".stat-card .num");
  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var raw = el.textContent.trim();
        var match = raw.match(/^([\d.]+)(.*)$/);
        if (!match) return;
        var num = parseFloat(match[1]);
        var suffix = match[2] || "";
        if (isNaN(num)) return;
        var start = 0;
        var duration = 1200;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var val = Math.round(eased * num);
          el.textContent = val + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = raw;
          }
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  statNums.forEach(function (el) {
    countObserver.observe(el);
  });
})();
