/* ============================================================
   Tanisi Mehta · Portfolio interactions
   - Sticky nav shadow on scroll
   - Mobile menu toggle (accessible)
   - Scroll-reveal animations (IntersectionObserver)
   - Active nav link highlighting (scroll spy)
   - Footer year
   ============================================================ */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky nav shadow ---- */
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  function closeMenu() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function openMenu() {
    links.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      if (links.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
  }
  // Close menu when a link is tapped, or when resizing to desktop, or on Escape
  navLinks.forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Scroll reveal ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Scroll spy: active nav link ---- */
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = "#" + entry.target.id;
            navLinks.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === id);
            });
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -55% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Hero typing animation ---- */
  var typeEl = document.getElementById("typeText");
  if (typeEl) {
    var phrases = [
      "building things people find useful.",
      "combining code and design.",
      "exploring how people interact with technology.",
      "turning ideas into working prototypes.",
      "making complicated things feel simpler."
    ];
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // No animation: show the first phrase and a steady caret.
      typeEl.textContent = phrases[0];
    } else {
      var pIndex = 0;
      var cIndex = 0;
      var deleting = false;

      function tick() {
        var current = phrases[pIndex];
        if (!deleting) {
          cIndex++;
          typeEl.textContent = current.slice(0, cIndex);
          if (cIndex === current.length) {
            deleting = true;
            return setTimeout(tick, 1600); // pause on full phrase
          }
          setTimeout(tick, 58);
        } else {
          cIndex--;
          typeEl.textContent = current.slice(0, cIndex);
          if (cIndex === 0) {
            deleting = false;
            pIndex = (pIndex + 1) % phrases.length;
            return setTimeout(tick, 320); // pause before next phrase
          }
          setTimeout(tick, 32);
        }
      }
      setTimeout(tick, 500);
    }
  }

  /* ---- Shared motion / pointer guards ---- */
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- Gentle section entrance transitions ---- */
  var sectionReveals = Array.prototype.slice.call(
    document.querySelectorAll(".section-reveal")
  );
  if (sectionReveals.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      sectionReveals.forEach(function (el) { el.classList.add("is-inview"); });
    } else {
      var sio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              sio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      sectionReveals.forEach(function (el) { sio.observe(el); });
    }
  }

  /* ---- Cursor-following glow (subtle, understated) ---- */
  var glow = document.getElementById("cursorGlow");
  if (glow && finePointer && !reduceMotion) {
    var gx = window.innerWidth / 2;
    var gy = window.innerHeight / 3;
    var tx = gx;
    var ty = gy;
    var rafId = null;
    var shown = false;

    function render() {
      // Ease toward the pointer for a smooth, trailing feel.
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      glow.style.setProperty("--glow-x", gx + "px");
      glow.style.setProperty("--glow-y", gy + "px");
      if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) {
        rafId = window.requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    }
    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        glow.classList.add("is-active");
      }
      if (rafId === null) rafId = window.requestAnimationFrame(render);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget) glow.classList.remove("is-active");
    });
  }

  /* ---- Subtle 3D tilt on project tiles (image/video previews) ---- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  if (tiles.length && finePointer && !reduceMotion) {
    var MAX_TILT = 5; // degrees; kept small and understated
    tiles.forEach(function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var r = tile.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;  // 0..1
        var py = (e.clientY - r.top) / r.height;  // 0..1
        var ry = (px - 0.5) * (MAX_TILT * 2);     // rotateY from horizontal pos
        var rx = (0.5 - py) * (MAX_TILT * 2);     // rotateX from vertical pos
        tile.style.setProperty("--rx", ry.toFixed(2) + "deg");
        tile.style.setProperty("--ry", rx.toFixed(2) + "deg");
        tile.classList.add("tilt");
      });
      tile.addEventListener("mouseleave", function () {
        tile.classList.remove("tilt");
        tile.style.removeProperty("--rx");
        tile.style.removeProperty("--ry");
      });
    });
  }
})();
