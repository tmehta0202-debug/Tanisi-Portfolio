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
  // Stagger siblings that share a parent (~80ms each) for a cascade.
  (function setStagger() {
    var seen = new Map();
    revealEls.forEach(function (el) {
      var p = el.parentNode;
      var i = seen.get(p) || 0;
      el.style.setProperty("--i", i);
      seen.set(p, i + 1);
    });
  })();
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
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Hero showcase: trigger the staggered screenshot entrance on load ---- */
  var heroShowcase = document.querySelector(".hero__showcase");
  if (heroShowcase) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroShowcase.classList.add("is-visible"); });
    });
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

  /* Cursor glow, 3D tile tilt, and image mask-wipe removed — replaced by the
     purposeful hover (1.03 zoom + alternate cross-fade) and the lighter
     scroll reveals. */

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

  /* Generative hero particle canvas removed to reduce ambient motion and
     keep the hero calm; the layered screenshot composition is the focus. */
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
    // Return to the resting state: pin 01 shown as the current location.
    pins.forEach(function (pin, i) {
      pin.classList.toggle("is-active", i === 0);
      pin.classList.remove("is-done");
      pin.setAttribute("aria-selected", i === 0 ? "true" : "false");
    });
    current = 0;
    paintRoute(0);
    if (progress) progress.textContent = "Tap a stage to open it";
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

  // Resting state: content collapsed, but the first pin reads as the current
  // location so the route looks intentional (highlighted pin + marker at 01).
  pins.forEach(function (pin, i) {
    pin.classList.toggle("is-active", i === 0);
    pin.setAttribute("aria-selected", i === 0 ? "true" : "false");
  });
  panels.forEach(function (panel) { panel.setAttribute("hidden", ""); });
  current = 0;
  paintRoute(0);
  if (progress) progress.textContent = "Tap a stage to open it";

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
    // Open on click anywhere in a preview container (image, padding, or the
    // expand icon, which has pointer-events:none so the click lands here).
    Array.prototype.slice.call(root.querySelectorAll(".cs2u__visual, .cs2d2__stage")).forEach(function (box) {
      box.style.cursor = "zoom-in";
      box.addEventListener("click", function () {
        var imgs = Array.prototype.slice.call(box.querySelectorAll("img"));
        var img = imgs.filter(function (im) { return !im.hidden && im.offsetParent !== null; })[0] || imgs[0];
        if (!img) return;
        var fig = box.closest("figure") || box;
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
