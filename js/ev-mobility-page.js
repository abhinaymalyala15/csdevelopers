(function () {
  var revealElements = document.querySelectorAll(".em-main .reveal");
  if (revealElements.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function bindSmoothAnchors(root) {
    root.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  var emMain = document.querySelector(".em-main");
  if (emMain) bindSmoothAnchors(emMain);

  var siteFooter = document.querySelector(".site-footer.ph-footer");
  if (siteFooter) bindSmoothAnchors(siteFooter);

  document.querySelectorAll(".btn-enquire[data-scroll]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-scroll");
      if (!id) return;
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var bikeForm = document.getElementById("bikeEnquiryForm");
  if (bikeForm) {
    bikeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("rider-name");
      var phone = document.getElementById("rider-phone");
      var model = document.getElementById("bike-model-select");
      if (!name || !phone || !model) return;
      var n = name.value.trim();
      var p = phone.value.trim();
      var m = model.value;
      var message = encodeURIComponent(
        "Hi CS Developers! I'd like to enquire about: " + m + "\nName: " + n + "\nPhone: " + p
      );
      window.open("https://wa.me/919581266445?text=" + message, "_blank");
    });
  }

  var chartContainer = document.querySelector(".em-isc-chart");
  if (chartContainer) {
    var chartObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var bars = entry.target.querySelectorAll(".em-chart-bar");
          bars.forEach(function (bar, i) {
            var h = bar.style.height;
            bar.style.height = "0%";
            setTimeout(function () {
              bar.style.height = h;
            }, 150 * i);
          });
          chartObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    chartObserver.observe(chartContainer);
  }
})();
