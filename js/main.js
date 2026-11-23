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
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  if (nav) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function openMenu() {
    if (!links || !toggle) return;
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
      "design meets technology.",
      "code turns into product.",
      "research shapes the design.",
      "good ideas become prototypes."
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

  /* ---- Image mask reveal: wipe project images open as they scroll in ---- */
  var mediaEls = Array.prototype.slice.call(
    document.querySelectorAll(".tile__media img, .tile__media video")
  );
  if (mediaEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      // Leave images fully visible; no wipe.
    } else {
      mediaEls.forEach(function (el) {
        var host = el.closest(".tile");
        if (host) host.classList.add("mask-hidden");
      });
      var mio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var host = entry.target;
              host.classList.remove("mask-hidden");
              host.classList.add("mask-shown");
              mio.unobserve(host);
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      );
      Array.prototype.slice.call(document.querySelectorAll(".tile.mask-hidden"))
        .forEach(function (t) { mio.observe(t); });
    }
  }

  /* ---- Magnetic hero headline (per-letter nudge toward the cursor) ---- */
  var magneticLine = document.querySelector("[data-magnetic]");
  if (magneticLine && finePointer && !reduceMotion) {
    // Split visible text into per-character spans, preserving nested markup.
    (function splitChars(node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.nodeValue.split("").forEach(function (ch) {
            var span = document.createElement("span");
            span.className = ch === " " ? "char char--space" : "char";
            span.textContent = ch === " " ? "\u00A0" : ch;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          splitChars(child);
        }
      });
    })(magneticLine);

    var chars = Array.prototype.slice.call(magneticLine.querySelectorAll(".char"));
    var RADIUS = 90;   // px of influence
    var STRENGTH = 16; // px max nudge
    var mLast = 0;

    function onHeroMove(e) {
      var now = Date.now();
      if (now - mLast < 16) return; // ~60fps throttle
      mLast = now;
      chars.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          var f = (1 - dist / RADIUS) * STRENGTH;
          c.style.transform =
            "translate(" + (-dx / dist * f).toFixed(1) + "px," + (-dy / dist * f).toFixed(1) + "px)";
        } else {
          c.style.transform = "";
        }
      });
    }
    window.addEventListener("mousemove", onHeroMove, { passive: true });
    magneticLine.addEventListener("mouseleave", function () {
      chars.forEach(function (c) { c.style.transform = ""; });
    });
  }

  /* ---- Compact skills: tabs with a sliding indicator ---- */
  var skillTabs = Array.prototype.slice.call(document.querySelectorAll(".skills__tab"));
  var tabline = document.getElementById("skillsTabline");
  if (skillTabs.length && tabline) {
    function moveTabline(tab) {
      tabline.style.left = tab.offsetLeft + "px";
      tabline.style.width = tab.offsetWidth + "px";
    }
    function selectTab(tab) {
      skillTabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.classList.toggle("is-active", active);
          if (active) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        }
      });
      moveTabline(tab);
    }
    skillTabs.forEach(function (tab) {
      tab.addEventListener("click", function () { selectTab(tab); });
      tab.addEventListener("keydown", function (e) {
        var i = skillTabs.indexOf(tab);
        if (e.key === "ArrowRight") { e.preventDefault(); skillTabs[(i + 1) % skillTabs.length].focus(); skillTabs[(i + 1) % skillTabs.length].click(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); skillTabs[(i - 1 + skillTabs.length) % skillTabs.length].focus(); skillTabs[(i - 1 + skillTabs.length) % skillTabs.length].click(); }
      });
    });
    // Position the indicator once fonts/layout settle.
    var initActive = document.querySelector(".skills__tab.is-active") || skillTabs[0];
    requestAnimationFrame(function () { moveTabline(initActive); });
    window.addEventListener("resize", function () {
      var a = document.querySelector(".skills__tab.is-active");
      if (a) moveTabline(a);
    });
  }

  /* ---- Animated nav indicator that follows the active/hovered link ---- */
  var navIndicator = document.getElementById("navIndicator");
  var navLinksList = Array.prototype.slice.call(document.querySelectorAll("#navLinks .nav__link:not(.nav__link--cta)"));
  if (navIndicator && navLinksList.length && finePointer) {
    function moveIndicatorTo(el) {
      if (!el) { navIndicator.style.opacity = "0"; return; }
      navIndicator.style.left = el.offsetLeft + "px";
      navIndicator.style.width = el.offsetWidth + "px";
      navIndicator.style.opacity = "1";
    }
    function activeLink() { return document.querySelector("#navLinks .nav__link.is-active:not(.nav__link--cta)"); }
    navLinksList.forEach(function (link) {
      link.addEventListener("mouseenter", function () { moveIndicatorTo(link); });
    });
    var linksWrap = document.getElementById("navLinks");
    if (linksWrap) {
      linksWrap.addEventListener("mouseleave", function () { moveIndicatorTo(activeLink()); });
    }
    // Reflect scroll-spy changes on the indicator.
    var navObserver = new MutationObserver(function () {
      if (!linksWrap.matches(":hover")) moveIndicatorTo(activeLink());
    });
    navLinksList.forEach(function (l) { navObserver.observe(l, { attributes: true, attributeFilter: ["class"] }); });
  }

  /* ---- Generative hero particles (gentle floating shapes) ---- */
  var canvas = document.getElementById("heroParticles");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var hero = canvas.closest(".hero");
    var particles = [];
    var colors = ["rgba(26,115,232,0.14)", "rgba(26,160,106,0.13)", "rgba(74,148,236,0.12)"];
    var running = true;

    function size() {
      var r = hero.getBoundingClientRect();
      canvas.width = r.width; canvas.height = r.height;
      var count = Math.min(14, Math.max(6, Math.round(r.width / 110)));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * r.width,
          y: Math.random() * r.height,
          rad: 6 + Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          c: colors[i % colors.length]
        });
      }
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -40) p.x = canvas.width + 40;
        if (p.x > canvas.width + 40) p.x = -40;
        if (p.y < -40) p.y = canvas.height + 40;
        if (p.y > canvas.height + 40) p.y = -40;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    size();
    frame();
    window.addEventListener("resize", size);
    // Pause when the hero scrolls out of view to save battery.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          running = en.isIntersecting;
          if (running) frame();
        });
      }, { threshold: 0 }).observe(hero);
    }
  }
})();
