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

/* ============================================================
   "How I Work" — map-style journey navigation + stage interactions.
   Scoped to #caseStudy. Moving location marker travels the SVG route;
   pins mark destinations; completed stages get a done state.
   ============================================================ */
(function () {
  "use strict";
  var root = document.getElementById("caseStudy");
  if (!root) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Stage navigation via map pins ----- */
  var pins = Array.prototype.slice.call(root.querySelectorAll(".cs2map__pin"));
  var panels = Array.prototype.slice.call(root.querySelectorAll(".cs2__panel"));
  var prevBtn = document.getElementById("cs2Prev");
  var nextBtn = document.getElementById("cs2Next");
  var progress = document.getElementById("cs2Progress");
  var routePath = document.getElementById("cs2Route");
  var routeProg = document.getElementById("cs2RouteProgress");
  var marker = document.getElementById("cs2Marker");
  var markerPulse = document.getElementById("cs2MarkerPulse");

  var content = root.querySelector(".cs2__content");
  var layout = root.querySelector(".cs2__layout");
  var expanded = false;

  var current = 0;
  var routeLen = 0;
  var stagePos = []; // {offset, x, y} per stage along the path
  // Target x (in the 880-wide viewBox) under each pin, so the marker lands
  // exactly beneath the pin it represents (matches the pins' inline left %).
  var TARGET_X = [70, 340, 580, 810];

  function computeRoute() {
    if (!routePath || !routePath.getTotalLength) return;
    routeLen = routePath.getTotalLength();
    stagePos = [];
    var samples = 400;
    for (var s = 0; s < pins.length; s++) {
      var targetX = TARGET_X[s] != null ? TARGET_X[s] : (880 * s) / (pins.length - 1);
      var best = { d: Infinity, off: 0, x: 0, y: 0 };
      for (var k = 0; k <= samples; k++) {
        var off = (routeLen * k) / samples;
        var pt = routePath.getPointAtLength(off);
        var d = Math.abs(pt.x - targetX);
        if (d < best.d) best = { d: d, off: off, x: pt.x, y: pt.y };
      }
      // Normalized 0-100 position (pathLength=100) for the progress fill.
      best.pct = (best.off / routeLen) * 100;
      stagePos.push(best);
    }
  }

  function paintRoute(index) {
    if (!stagePos.length) return;
    var pos = stagePos[index];
    if (marker) { marker.setAttribute("cx", pos.x); marker.setAttribute("cy", pos.y); }
    if (markerPulse) { markerPulse.setAttribute("cx", pos.x); markerPulse.setAttribute("cy", pos.y); }
    // Fill the solid green progress line from the start through this stage.
    if (routeProg) routeProg.style.setProperty("--p", pos.pct.toFixed(2));
  }

  function expand() {
    if (expanded) return;
    expanded = true;
    if (content) content.classList.add("is-expanded");
    if (layout) layout.classList.add("is-open");
  }

  function collapse() {
    if (!expanded) return;
    expanded = false;
    if (content) content.classList.remove("is-expanded");
    if (layout) layout.classList.remove("is-open");
    pins.forEach(function (pin) { pin.classList.remove("is-active"); pin.setAttribute("aria-selected", "false"); });
    if (progress) progress.textContent = "Pick a stage";
    // Route progress returns to empty when nothing is selected.
    if (routeProg) routeProg.style.setProperty("--p", "0");
  }

  function select(index, focusPin) {
    index = Math.max(0, Math.min(pins.length - 1, index));
    current = index;
    expand();
    pins.forEach(function (pin, i) {
      pin.classList.toggle("is-active", i === index);
      pin.classList.toggle("is-done", i < index);
      pin.setAttribute("aria-selected", i === index ? "true" : "false");
      if (i === index && focusPin) pin.focus();
    });
    panels.forEach(function (panel, i) {
      if (i === index) { panel.removeAttribute("hidden"); fadeIn(panel); }
      else panel.setAttribute("hidden", "");
    });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === pins.length - 1;
    if (progress) progress.textContent = "Stage " + (index + 1) + " of " + pins.length;
    paintRoute(index);
  }

  // Short, subtle fade+slide used to coordinate content transitions.
  function fadeIn(el) {
    if (!el || reduce) return;
    el.classList.remove("cs2-fade");
    // reflow to restart the animation
    void el.offsetWidth;
    el.classList.add("cs2-fade");
  }

  pins.forEach(function (pin, i) {
    pin.addEventListener("click", function () {
      // Clicking the already-active pin collapses back to the compact map.
      if (expanded && current === i && pin.classList.contains("is-active")) collapse();
      else select(i);
    });
    pin.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); select(i + 1, true); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); select(i - 1, true); }
      else if (e.key === "Home") { e.preventDefault(); select(0, true); }
      else if (e.key === "End") { e.preventDefault(); select(pins.length - 1, true); }
    });
  });
  if (prevBtn) prevBtn.addEventListener("click", function () { select(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { select(current + 1); });

  // Recompute route geometry once laid out, and on resize.
  function initRoute() { computeRoute(); paintRoute(current); }
  if (routePath) {
    requestAnimationFrame(initRoute);
    window.addEventListener("resize", function () { computeRoute(); paintRoute(current); });
  }

  // Collapsed initial state: route only, no stage opened yet.
  pins.forEach(function (pin) { pin.classList.remove("is-active"); pin.setAttribute("aria-selected", "false"); });
  panels.forEach(function (panel) { panel.setAttribute("hidden", ""); });
  if (progress) progress.textContent = "Pick a stage";

  // Collapse controls: close button, click outside the panel, Escape.
  var collapseBtn = document.getElementById("cs2Collapse");
  if (collapseBtn) collapseBtn.addEventListener("click", collapse);
  document.addEventListener("click", function (e) {
    if (!expanded) return;
    // Ignore clicks inside the content, on the route nav, or on the lightbox.
    if (content && content.contains(e.target)) return;
    var mapNav = document.getElementById("cs2Map");
    if (mapNav && mapNav.contains(e.target)) return;
    var lbEl = document.getElementById("cs2Lightbox");
    if (lbEl && lbEl.contains(e.target)) return;
    if (root.contains(e.target)) collapse();
  });
  document.addEventListener("keydown", function (e) {
    // Escape collapses the stage (unless the lightbox is open; it handles Esc).
    var lbEl = document.getElementById("cs2Lightbox");
    if (e.key === "Escape" && expanded && (!lbEl || lbEl.hidden)) collapse();
  });

  /* ----- Understand: project switch + per-project step walkthrough ----- */
  var u = root.querySelector("[data-cs2u]");
  if (u) {
    var uPicks = Array.prototype.slice.call(u.querySelectorAll("[data-cs2u-pick]"));
    var uProjects = Array.prototype.slice.call(u.querySelectorAll("[data-cs2u-project]"));

    function uShowProject(key) {
      uPicks.forEach(function (b) {
        var on = b.getAttribute("data-cs2u-pick") === key;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      uProjects.forEach(function (p) {
        if (p.getAttribute("data-cs2u-project") === key) { p.removeAttribute("hidden"); fadeIn(p); }
        else p.setAttribute("hidden", "");
      });
    }
    uPicks.forEach(function (b) {
      b.addEventListener("click", function () { uShowProject(b.getAttribute("data-cs2u-pick")); });
    });

    // Per-project step buttons: update visual, caption, and text together.
    uProjects.forEach(function (proj) {
      var stepBtns = Array.prototype.slice.call(proj.querySelectorAll("[data-cs2u-step]"));
      stepBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var key = btn.getAttribute("data-cs2u-step");
          stepBtns.forEach(function (b2) {
            var on = b2 === btn;
            b2.classList.toggle("is-active", on);
            b2.setAttribute("aria-selected", on ? "true" : "false");
          });
          proj.querySelectorAll("[data-cs2u-steptext]").forEach(function (el) {
            if (el.getAttribute("data-cs2u-steptext") === key) { el.removeAttribute("hidden"); el.classList.add("is-active"); fadeIn(el); }
            else { el.setAttribute("hidden", ""); el.classList.remove("is-active"); }
          });
          // Swap the matching visual + caption if this project has per-step images.
          proj.querySelectorAll("[data-cs2u-img]").forEach(function (img) {
            if (img.getAttribute("data-cs2u-img") === key) { img.removeAttribute("hidden"); fadeIn(img); }
            else img.setAttribute("hidden", "");
          });
          proj.querySelectorAll("[data-cs2u-cap]").forEach(function (cap) {
            if (cap.getAttribute("data-cs2u-cap") === key) cap.removeAttribute("hidden");
            else cap.setAttribute("hidden", "");
          });
        });
      });
    });
  }

  /* ----- Design: screen switch + topic highlight anchored to the image ----- */
  var d = root.querySelector("[data-cs2d2]");
  if (d) {
    var dScreens = Array.prototype.slice.call(d.querySelectorAll("[data-cs2d2-screen]"));
    var dImgs = Array.prototype.slice.call(d.querySelectorAll("[data-cs2d2-img]"));
    var dTopics = Array.prototype.slice.call(d.querySelectorAll("[data-cs2d2-topic]"));
    var hl = d.querySelector("[data-cs2d2-hl]");
    var stageFig = d.querySelector(".cs2d2__stage");
    var activeScreen = "0";

    function placeHighlight(topic) {
      if (!hl || !topic) return;
      var hlData = topic.getAttribute("data-hl"); // "left,top,width,height" in %
      if (!hlData) { hl.classList.remove("is-on"); return; }
      var parts = hlData.split(",");
      hl.style.left = parts[0] + "%";
      hl.style.top = parts[1] + "%";
      hl.style.width = parts[2] + "%";
      hl.style.height = parts[3] + "%";
      hl.classList.add("is-on");
    }

    function showTopic(topic) {
      dTopics.forEach(function (t) { t.classList.toggle("is-active", t === topic); });
      placeHighlight(topic);
    }

    function showScreen(screen) {
      activeScreen = screen;
      dScreens.forEach(function (s) {
        var on = s.getAttribute("data-cs2d2-screen") === screen;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-selected", on ? "true" : "false");
      });
      dImgs.forEach(function (img) {
        if (img.getAttribute("data-cs2d2-img") === screen) { img.removeAttribute("hidden"); fadeIn(img); }
        else img.setAttribute("hidden", "");
      });
      // Show only this screen's topics; activate the first one.
      var first = null;
      dTopics.forEach(function (t) {
        var on = t.getAttribute("data-screen") === screen;
        t.classList.toggle("is-visible", on);
        if (on && !first) first = t;
      });
      showTopic(first);
    }

    dScreens.forEach(function (s) {
      s.addEventListener("click", function () { showScreen(s.getAttribute("data-cs2d2-screen")); });
    });
    dTopics.forEach(function (t) {
      t.addEventListener("click", function () { showTopic(t); });
    });
    showScreen("0");
  }

  /* ----- Build: select a project contribution ----- */
  var b = root.querySelector("[data-cs2b]");
  if (b) {
    var bItems = Array.prototype.slice.call(b.querySelectorAll("[data-cs2b-pick]"));
    bItems.forEach(function (it) {
      it.addEventListener("click", function () {
        var key = it.getAttribute("data-cs2b-pick");
        bItems.forEach(function (x) {
          var on = x === it;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-selected", on ? "true" : "false");
        });
        b.querySelectorAll("[data-cs2b-shot]").forEach(function (s) {
          if (s.getAttribute("data-cs2b-shot") === key) { s.removeAttribute("hidden"); s.classList.add("is-active"); }
          else { s.setAttribute("hidden", ""); s.classList.remove("is-active"); }
        });
      });
    });
  }

  /* ----- Lightbox: click a preview to inspect it larger ----- */
  var lb = document.getElementById("cs2Lightbox");
  var lbImg = document.getElementById("cs2LbImg");
  var lbCap = document.getElementById("cs2LbCap");
  var lastFocus = null;
  if (lb && lbImg) {
    function openLightbox(src, alt, caption) {
      lastFocus = document.activeElement;
      lbImg.src = src; lbImg.alt = alt || "";
      lbCap.textContent = caption || alt || "";
      lb.hidden = false; lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeBtn = document.getElementById("cs2LbClose");
      if (closeBtn) closeBtn.focus();
    }
    function closeLightbox() {
      lb.hidden = true; lb.setAttribute("aria-hidden", "true");
      lbImg.src = "";
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus(); // preserve where the user was
    }
    // Open on click of any Understand/Design preview image (only the visible one).
    Array.prototype.slice.call(root.querySelectorAll(".cs2u__visual img, .cs2d2__stage img")).forEach(function (img) {
      img.addEventListener("click", function () {
        if (img.hidden) return;
        // Prefer a nearby caption for Understand visuals.
        var fig = img.closest("figure");
        var cap = fig ? fig.querySelector("figcaption:not([hidden])") : null;
        openLightbox(img.currentSrc || img.src, img.alt, cap ? cap.textContent : img.alt);
      });
    });
    Array.prototype.slice.call(lb.querySelectorAll("[data-cs2lb-close]")).forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) closeLightbox();
    });
  }
})();
