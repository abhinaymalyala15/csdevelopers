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
  var emFooter = document.querySelector(".em-footer");
  if (emFooter) bindSmoothAnchors(emFooter);

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
