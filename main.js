/* ============================================================
   NOVA — main.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- State ---------------- */
  let state = {
    category: "all",
    query: "",
    sort: "featured",
    favorites: new Set(),
  };

  /* ---------------- DOM refs ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const grid = $("#productGrid");
  const emptyState = $("#emptyState");
  const emptyQuery = $("#emptyQuery");
  const resultHint = $("#resultHint");
  const productCount = $("#productCount");

  /* ============================================================
     Loader
     ============================================================ */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    setTimeout(() => loader.classList.add("is-hidden"), 500);
  });
  // Safety: hide loader after max 2.5s regardless
  setTimeout(() => $("#loader")?.classList.add("is-hidden"), 2500);

  /* ============================================================
     Theme toggle (dark / light) — persists for the session
     ============================================================ */
  const themeToggle = $("#themeToggle");
  const root = document.documentElement;

  function setTheme(mode) {
    if (mode === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    try { sessionStorage.setItem("nova-theme", mode); } catch (e) {}
  }

  (function initTheme() {
    let saved = null;
    try { saved = sessionStorage.getItem("nova-theme"); } catch (e) {}
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  })();

  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    setTheme(isLight ? "dark" : "light");
  });

  /* ============================================================
     Navbar: scroll state + mobile burger
     ============================================================ */
  const nav = $("#nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 30);
  }, { passive: true });

  const burger = $("#navBurger");
  const navLinks = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.matches(".nav__link")) {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ============================================================
     Search toggle + live search
     ============================================================ */
  const searchWrap = $("#searchWrap");
  const searchToggle = $("#searchToggle");
  const searchInput = $("#searchInput");

  searchToggle.addEventListener("click", () => {
    searchWrap.classList.toggle("is-open");
    if (searchWrap.classList.contains("is-open")) searchInput.focus();
  });

  let searchDebounce;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.query = e.target.value.trim().toLowerCase();
      // Jump to catalog if searching from elsewhere
      renderProducts();
      if (state.query) {
        document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 220);
  });

  /* ============================================================
     Scroll cue
     ============================================================ */
  $("#scrollCue").addEventListener("click", () => {
    document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
  });

  /* ============================================================
     Category filters
     ============================================================ */
  const catGrid = $("#catGrid");
  catGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-card");
    if (!btn) return;
    $$(".cat-card", catGrid).forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.category = btn.dataset.filter;
    renderProducts();
  });

  /* ============================================================
     Sort
     ============================================================ */
  $("#sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  /* ============================================================
     Clear filters
     ============================================================ */
  $("#clearFilters").addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    searchInput.value = "";
    $$(".cat-card", catGrid).forEach((c) => c.classList.remove("is-active"));
    $('.cat-card[data-filter="all"]', catGrid).classList.add("is-active");
    renderProducts();
  });

  /* ============================================================
     Helpers
     ============================================================ */
  function stars(rating) {
    const rounded = Math.round(rating);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  }

  function badgeClass(badge) {
    if (badge === "Best Seller") return "product-card__badge--best";
    if (badge === "Limited Deal") return "product-card__badge--limited";
    return "";
  }

  function getFilteredProducts() {
    let list = PRODUCTS.slice();

    if (state.category !== "all") {
      list = list.filter((p) => p.category === state.category);
    }
    if (state.query) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(state.query) ||
        p.category.toLowerCase().includes(state.query) ||
        p.blurb.toLowerCase().includes(state.query)
      );
    }

    switch (state.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default:
        // featured: best sellers / limited deals first
        list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }
    return list;
  }

  /* ============================================================
     Render products
     ============================================================ */
  function renderProducts() {
    const list = getFilteredProducts();
    productCount.textContent = PRODUCTS.length;

    if (list.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      emptyQuery.textContent = state.query || "this category";
      resultHint.textContent = "";
      return;
    }
    emptyState.hidden = true;
    resultHint.textContent = `Showing ${list.length} of ${PRODUCTS.length}`;

    grid.innerHTML = list.map(cardTemplate).join("");

    // re-attach tilt + lazy-load + fav handlers on fresh nodes
    initTiltCards();
    initLazyImages();
    initFavButtons();
    revealNewCards();
  }

  function cardTemplate(p) {
    const isFav = state.favorites.has(p.id);
    const oldPriceHtml = p.oldPrice
      ? `<span class="price--old">$${p.oldPrice.toFixed(2)}</span>`
      : "";
    const badgeHtml = p.badge
      ? `<span class="product-card__badge ${badgeClass(p.badge)}">${p.badge}</span>`
      : "";

    return `
    <article class="product-card tilt-card" data-id="${p.id}">
      ${badgeHtml}
      <button class="product-card__fav ${isFav ? "is-active" : ""}" aria-label="Save to favorites" data-fav="${p.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 21s-7.5-4.6-10-9.3C0.3 8.1 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.3C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.3 4.1 3.6 7.7C19.5 16.4 12 21 12 21z"/>
        </svg>
      </button>
      <div class="product-card__img-wrap">
        <img data-src="${p.img}" alt="${p.name}" width="300" height="300" loading="lazy">
      </div>
      <p class="product-card__id">${p.id}</p>
      <span class="product-card__cat">${p.category}</span>
      <h3 class="product-card__title">${p.name}</h3>
      <p class="product-card__blurb">${p.blurb}</p>
      <div class="product-card__rating">
        <span class="stars" aria-label="${p.rating} out of 5 stars">${stars(p.rating)}</span>
        <small>${p.rating} · ${p.reviews.toLocaleString()} reviews</small>
      </div>
      <div class="product-card__price-row">
        <span class="price">$${p.price.toFixed(2)}</span>
        ${oldPriceHtml}
      </div>
      <a href="${p.link}" class="btn btn--primary product-card__cta" data-affiliate="${p.id}" rel="sponsored noopener noreferrer" target="_blank">
        <span>View Deal</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M7 7h10v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </article>`;
  }

  /* ============================================================
     Favorites (visual only, session-based)
     ============================================================ */
  function initFavButtons() {
    $$("[data-fav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.dataset.fav;
        if (state.favorites.has(id)) {
          state.favorites.delete(id);
          btn.classList.remove("is-active");
          showToast("Removed from favorites");
        } else {
          state.favorites.add(id);
          btn.classList.add("is-active");
          showToast("Saved to favorites");
        }
      });
    });
  }

  /* ============================================================
     Lazy-loading images with fade-in
     ============================================================ */
  function initLazyImages() {
    const imgs = $$('.product-card__img-wrap img[data-src]');
    if (!("IntersectionObserver" in window)) {
      imgs.forEach(loadImg);
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImg(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "120px" });
    imgs.forEach((img) => io.observe(img));
  }
  function loadImg(img) {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
    img.removeAttribute("data-src");
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
  }

  /* ============================================================
     3D tilt effect (mouse + touch friendly, pointer-based)
     ============================================================ */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initTiltCards() {
    if (prefersReducedMotion) return;
    $$(".tilt-card").forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "true";

      let rect;
      const max = 9; // degrees

      function onMove(e) {
        rect = card.getBoundingClientRect();
        const x = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top;
        const px = x / rect.width;  // 0..1
        const py = y / rect.height; // 0..1
        const rotateY = (px - 0.5) * max * 2;
        const rotateX = (0.5 - py) * max * 2;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      }
      function reset() {
        card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
      }

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", reset);
      card.addEventListener("touchmove", (e) => { onMove(e); }, { passive: true });
      card.addEventListener("touchend", reset);
    });
  }

  /* Stagger-reveal newly injected product cards */
  function revealNewCards() {
    $$(".product-card", grid).forEach((card, i) => {
      card.style.animationDelay = `${Math.min(i * 0.05, 0.5)}s`;
    });
  }

  /* ============================================================
     Hero tilt card (separate, larger range, smoother)
     ============================================================ */
  (function initHeroTilt() {
    const card = $("#heroTiltCard");
    if (!card || prefersReducedMotion) return;
    const max = 10;
    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * max * 2;
      const rotateX = (0.5 - py) * max * 2;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    function reset() { card.style.transform = "rotateX(0deg) rotateY(0deg)"; }
    window.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      // Only react if pointer is reasonably close to the card to keep it calm
      const within = e.clientX > rect.left - 200 && e.clientX < rect.right + 200 &&
                     e.clientY > rect.top - 200 && e.clientY < rect.bottom + 200;
      if (within) onMove(e); else reset();
    });
    card.addEventListener("mouseleave", reset);
  })();

  /* ============================================================
     Animated counters (hero stats)
     ============================================================ */
  function animateCounters() {
    $$(".stat__num").forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
    });
  }

  /* ============================================================
     Reveal-on-scroll for [data-reveal] elements
     ============================================================ */
  function initReveal() {
    const targets = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      animateCounters();
      return;
    }
    let countersFired = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.querySelector(".hero__stats") && !countersFired) {
            countersFired = true;
            animateCounters();
          }
        }
      });
    }, { threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
  }

  /* ============================================================
     Render testimonials
     ============================================================ */
  function renderTestimonials() {
    const track = $("#reviewsTrack");
    track.innerHTML = TESTIMONIALS.map((t) => {
      const initials = t.name.split(" ").map((n) => n[0]).join("");
      return `
      <div class="review-card">
        <span class="stars" aria-label="${t.rating} out of 5 stars">${stars(t.rating)}</span>
        <p class="review-card__quote">"${t.quote}"</p>
        <div class="review-card__person">
          <span class="review-card__avatar">${initials}</span>
          <div>
            <p class="review-card__name">${t.name}</p>
            <p class="review-card__role">${t.role}</p>
          </div>
        </div>
      </div>`;
    }).join("");
  }

  /* ============================================================
     Accordion (FAQ)
     ============================================================ */
  function initAccordion() {
    $$(".accordion__trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".accordion__item");
        const wasOpen = item.classList.contains("is-open");
        $$(".accordion__item", item.parentElement).forEach((i) => i.classList.remove("is-open"));
        if (!wasOpen) item.classList.add("is-open");
      });
    });
  }

  /* ============================================================
     Newsletter form
     ============================================================ */
  $("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (input.value) {
      showToast(`Subscribed — confirmation sent to ${input.value}`);
      input.value = "";
    }
  });

  /* ============================================================
     Toast utility
     ============================================================ */
  let toastTimer;
  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  /* ============================================================
     Affiliate click tracking (demo) — intercept to show toast
     since '#' links don't go anywhere in this demo build
     ============================================================ */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-affiliate]");
    if (!link) return;
    if (link.getAttribute("href") === "#") {
      e.preventDefault();
      showToast(`Redirecting to retailer for ${link.dataset.affiliate}…`);
    }
  });

  /* ============================================================
     Init
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderTestimonials();
    initAccordion();
    initReveal();
  });
})();
