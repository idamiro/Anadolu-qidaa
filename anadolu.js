const body = document.body;
const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (siteHeader) {
  let headerTicking = false;

  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 36);
    headerTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  updateHeader();
}

if (menuButton && nav) {
  // Vulcet-style mobile menu: inert panel, scroll lock + restore, focus trap.
  // Header expands while open so sticky/fixed + backdrop-filter cannot trap the panel.
  const brandSwitch = document.querySelector(".brand-switch");
  if (brandSwitch) {
    const mobileBrandSwitch = brandSwitch.cloneNode(true);
    mobileBrandSwitch.classList.add("mobile-brand-switch");
    nav.appendChild(mobileBrandSwitch);
  }

  const mobileCta = document.createElement("a");
  const isMirvari = body.classList.contains("mirvari-page");
  mobileCta.href = isMirvari ? "mirvari-elaqe" : "elaqe";
  mobileCta.className = "mobile-cta";
  mobileCta.textContent = isMirvari ? "Daşınma sorğusu" : "Korporativ sorğu";
  nav.appendChild(mobileCta);

  if (!nav.id) nav.id = "site-nav";
  menuButton.setAttribute("aria-controls", nav.id);

  let menuScrollY = 0;
  const isMobileNav = () => window.matchMedia("(max-width: 980px)").matches;

  const resetDesktopNav = () => {
    nav.classList.remove("open");
    nav.inert = false;
    nav.removeAttribute("aria-hidden");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menyunu aç");
    document.documentElement.classList.remove("menu-open");
    body.classList.remove("menu-open");
  };

  const setMenu = (open) => {
    if (!isMobileNav()) {
      resetDesktopNav();
      return;
    }

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Menyunu bağla" : "Menyunu aç");
    nav.setAttribute("aria-hidden", String(!open));
    nav.inert = !open;
    nav.classList.toggle("open", open);

    if (open) {
      menuScrollY = window.scrollY;
      document.documentElement.classList.add("menu-open");
      body.classList.add("menu-open");
      requestAnimationFrame(() => nav.querySelector("a")?.focus());
    } else {
      document.documentElement.classList.remove("menu-open");
      body.classList.remove("menu-open");
      requestAnimationFrame(() => window.scrollTo(0, menuScrollY));
    }
  };

  if (isMobileNav()) {
    nav.inert = true;
    nav.setAttribute("aria-hidden", "true");
  }

  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (menuButton.getAttribute("aria-expanded") !== "true") return;

    if (event.key === "Escape") {
      setMenu(false);
      menuButton.focus();
      return;
    }

    if (event.key === "Tab") {
      const focusable = [menuButton, ...nav.querySelectorAll("a, button")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileNav()) resetDesktopNav();
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const valuesSlider = document.querySelector("[data-values-slider]");
const valuesPrev = document.querySelector("[data-values-prev]");
const valuesNext = document.querySelector("[data-values-next]");

if (valuesSlider && valuesPrev && valuesNext) {
  valuesSlider.scrollLeft = 0;

  const getStep = () => {
    const card = valuesSlider.querySelector(".value-card");
    if (!card) return valuesSlider.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(valuesSlider.querySelector(".values-track")).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const move = (direction) => {
    valuesSlider.scrollBy({ left: getStep() * direction, behavior: "smooth" });
  };

  valuesPrev.addEventListener("click", () => move(-1));
  valuesNext.addEventListener("click", () => move(1));

  let dragging = false;
  let dragStart = 0;
  let scrollStart = 0;

  valuesSlider.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragging = true;
    dragStart = event.clientX;
    scrollStart = valuesSlider.scrollLeft;
    valuesSlider.classList.add("dragging");
    valuesSlider.setPointerCapture(event.pointerId);
  });

  valuesSlider.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    valuesSlider.scrollLeft = scrollStart - (event.clientX - dragStart);
  });

  const stopDragging = () => {
    dragging = false;
    valuesSlider.classList.remove("dragging");
  };

  valuesSlider.addEventListener("pointerup", stopDragging);
  valuesSlider.addEventListener("pointercancel", stopDragging);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let autoplay;
    let sliderVisible = false;
    const stopAutoplay = () => window.clearInterval(autoplay);
    const startAutoplay = () => {
      stopAutoplay();
      if (!sliderVisible) return;
      autoplay = window.setInterval(() => {
        const atEnd = valuesSlider.scrollLeft + valuesSlider.clientWidth >= valuesSlider.scrollWidth - 8;
        valuesSlider.scrollTo({ left: atEnd ? 0 : valuesSlider.scrollLeft + getStep(), behavior: "smooth" });
      }, 5200);
    };

    valuesSlider.addEventListener("pointerenter", stopAutoplay);
    valuesSlider.addEventListener("pointerleave", startAutoplay);
    valuesSlider.addEventListener("touchstart", stopAutoplay, { passive: true });
    valuesSlider.addEventListener("touchend", startAutoplay, { passive: true });
    valuesSlider.addEventListener("focusin", stopAutoplay);
    valuesSlider.addEventListener("focusout", startAutoplay);

    const autoplayObserver = new IntersectionObserver((entries) => {
      sliderVisible = entries[0]?.isIntersecting ?? false;
      if (sliderVisible) startAutoplay();
      else stopAutoplay();
    }, { threshold: .25 });

    autoplayObserver.observe(valuesSlider);
  }
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    const target = Number(item.dataset.count || 0);
    const start = performance.now();
    const duration = 1100;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      item.textContent = item.dataset.plain === "true" ? String(value) : value.toLocaleString("az-AZ");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(item);
  });
}, { threshold: .65 });

document.querySelectorAll("[data-count]").forEach((item) => counterObserver.observe(item));

/* —— Order form (product / logistics) —— */
const PRODUCT_OPTIONS = [
  "ANADOLU 50 kq", "AĞ KİSƏ 50 kq", "ANADOLU 25 kq", "ANADOLU 10 kq", "ANADOLU 5 kq",
  "MİRVARİ 50 kq (təndirlik)", "MİRVARİ 50 kq", "MİRVARİ 25 kq", "MİRVARİ 25 kq (SUPER UN)", "MİRVARİ 10 kq", "MİRVARİ 5 kq",
  "BONKALİTE 35 kq", "BONKALİTE 30 kq", "OBOY 29 kq", "1-Cİ NÖV 45 kq",
  "KƏPƏK 20 kq", "KƏPƏK 19 kq", "KƏPƏK 17 kq", "KƏPƏK 16 kq",
  "BUĞDA YARMASI", "TOZ SAMAN", "RUS BUĞDASI", "ARPA"
];

const ORDER_RECIPIENTS = {
  product: "arslangokay@anadoluqida.com",
  logistics: "mustafayevaseide@anadoluqida.com"
};

const BAKU = [40.4093, 49.8671];

const initOrderForms = () => {
  document.querySelectorAll("[data-order-form]").forEach((form) => {
    const typeSelect = form.querySelector("[data-order-type]");
    const recipientInput = form.querySelector("[data-form-recipient]");
    const subjectInput = form.querySelector("[data-form-subject]");
    const linesRoot = form.querySelector("[data-product-lines]");
    const addBtn = form.querySelector("[data-add-product]");
    const mapRegistry = new Map();

    const setPanelState = () => {
      const type = typeSelect?.value || "product";
      form.querySelectorAll("[data-order-panel]").forEach((panel) => {
        const active = panel.dataset.orderPanel === type;
        panel.classList.toggle("is-active", active);
        panel.querySelectorAll("input, select, textarea, button").forEach((field) => {
          if (field.closest("[data-product-lines]") && type !== "product") {
            field.disabled = true;
            return;
          }
          if (field.hasAttribute("readonly")) return;
          field.disabled = !active;
        });
      });

      const pickup = form.querySelector('[name="pickup_address"]');
      const dropoff = form.querySelector('[name="dropoff_address"]');
      const delivery = form.querySelector('[name="delivery_address"]');
      if (pickup) pickup.required = type === "logistics";
      if (dropoff) dropoff.required = type === "logistics";
      if (delivery) delivery.required = type === "product";

      if (recipientInput) recipientInput.value = ORDER_RECIPIENTS[type] || ORDER_RECIPIENTS.product;
      if (subjectInput) {
        subjectInput.value = type === "logistics"
          ? `Logistika sifarişi → ${ORDER_RECIPIENTS.logistics}`
          : `Məhsul sifarişi → ${ORDER_RECIPIENTS.product}`;
      }
    };

    const createProductRow = (index) => {
      const row = document.createElement("div");
      row.className = "product-line";
      row.dataset.productLine = String(index);
      const options = PRODUCT_OPTIONS.map((name) => `<option value="${name}">${name}</option>`).join("");
      row.innerHTML = `
        <div class="field">
          <label>Məhsulun adı</label>
          <select name="product_name_${index}" required>${options}</select>
        </div>
        <div class="field">
          <label>Məhsulun sayı</label>
          <input name="product_qty_${index}" type="text" required placeholder="Məsələn: 20 kisə / 5 ton">
        </div>
        <button type="button" class="product-remove-btn" data-remove-product aria-label="Sətri sil">×</button>
      `;
      return row;
    };

    const renumberLines = () => {
      if (!linesRoot) return;
      [...linesRoot.querySelectorAll(".product-line")].forEach((row, index) => {
        row.dataset.productLine = String(index);
        const select = row.querySelector("select");
        const input = row.querySelector("input");
        if (select) {
          select.name = `product_name_${index}`;
          select.required = typeSelect?.value === "product";
        }
        if (input) {
          input.name = `product_qty_${index}`;
          input.required = typeSelect?.value === "product";
        }
        const removeBtn = row.querySelector("[data-remove-product]");
        if (removeBtn) removeBtn.hidden = linesRoot.children.length <= 1;
      });
    };

    const addProductLine = () => {
      if (!linesRoot) return;
      if (linesRoot.children.length >= 8) return;
      linesRoot.appendChild(createProductRow(linesRoot.children.length));
      renumberLines();
    };

    linesRoot?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-remove-product]");
      if (!btn) return;
      btn.closest(".product-line")?.remove();
      if (!linesRoot.children.length) addProductLine();
      renumberLines();
    });

    addBtn?.addEventListener("click", addProductLine);
    if (linesRoot && !linesRoot.children.length) addProductLine();

    const searchAddress = async (query) => {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("format", "json");
      url.searchParams.set("q", query);
      url.searchParams.set("limit", "5");
      url.searchParams.set("countrycodes", "az");
      url.searchParams.set("addressdetails", "0");
      url.searchParams.set("accept-language", "az");
      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Geocode failed");
      return response.json();
    };

    const reverseGeocode = async (latlng) => {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "json");
      url.searchParams.set("lat", String(latlng.lat));
      url.searchParams.set("lon", String(latlng.lng));
      url.searchParams.set("zoom", "18");
      url.searchParams.set("addressdetails", "0");
      url.searchParams.set("accept-language", "az");
      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Reverse geocode failed");
      return response.json();
    };

    const setupMap = (key) => {
      const picker = form.querySelector(`[data-map="${key}"]`);
      if (!picker || mapRegistry.has(key) || typeof window.L === "undefined") return;

      const canvas = picker.querySelector(".map-canvas");
      const latInput = picker.querySelector(`[data-map-lat="${key}"]`);
      const lngInput = picker.querySelector(`[data-map-lng="${key}"]`);
      const urlInput = picker.querySelector(`[data-map-url="${key}"]`);
      const openLink = picker.querySelector(`[data-map-open="${key}"]`);
      const addressInput = form.querySelector(`[data-map-address="${key}"]`);
      const searchBtn = picker.querySelector(`[data-map-search="${key}"]`);
      const resultsBox = picker.querySelector(`[data-map-results="${key}"]`);
      const hint = picker.querySelector(".map-hint");
      if (!canvas) return;

      // Fix marker icons for self-hosted Leaflet
      if (!window.__anadoluLeafletIconFixed) {
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: "./vendor/leaflet/images/marker-icon-2x.png",
          iconUrl: "./vendor/leaflet/images/marker-icon.png",
          shadowUrl: "./vendor/leaflet/images/marker-shadow.png"
        });
        window.__anadoluLeafletIconFixed = true;
      }

      const map = window.L.map(canvas, {
        scrollWheelZoom: true,
        attributionControl: true
      }).setView(BAKU, 11);

      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
      }).addTo(map);

      let marker = null;
      let suppressAddressSearch = false;
      let searchTimer = 0;
      let reverseTimer = 0;

      const clearResults = () => {
        if (!resultsBox) return;
        resultsBox.innerHTML = "";
        resultsBox.hidden = true;
      };

      const writeAddress = (value) => {
        if (!addressInput) return;
        suppressAddressSearch = true;
        addressInput.value = value;
        suppressAddressSearch = false;
      };

      const setPin = (latlng, zoom = 15) => {
        const mapsUrl = `https://www.google.com/maps?q=${latlng.lat},${latlng.lng}`;
        if (marker) {
          marker.setLatLng(latlng);
        } else {
          marker = window.L.marker(latlng, { draggable: true, autoPan: true }).addTo(map);
          marker.on("dragend", () => {
            const next = marker.getLatLng();
            setPin(next, map.getZoom());
            fillAddressFromPin(next);
          });
        }
        map.setView(latlng, zoom);
        if (latInput) latInput.value = String(latlng.lat);
        if (lngInput) lngInput.value = String(latlng.lng);
        if (urlInput) urlInput.value = mapsUrl;
        if (openLink) {
          openLink.href = mapsUrl;
          openLink.hidden = false;
        }
      };

      const fillAddressFromPin = (latlng) => {
        window.clearTimeout(reverseTimer);
        if (hint) hint.textContent = "Ünvan müəyyən edilir…";
        reverseTimer = window.setTimeout(async () => {
          try {
            const data = await reverseGeocode(latlng);
            if (data?.display_name) writeAddress(data.display_name);
            if (hint) hint.textContent = "Pin və ünvan sinxronlaşdırıldı. Pini sürükləyə və ya yenidən klikləyə bilərsiniz.";
          } catch (_error) {
            if (hint) hint.textContent = "Pin qoyuldu, amma ünvan oxunmadı. Ünvanı əl ilə yaza bilərsiniz.";
          }
        }, 120);
      };

      const applySearchResult = (item) => {
        const latlng = {
          lat: Number(item.lat),
          lng: Number(item.lon)
        };
        setPin(latlng, 16);
        if (item.display_name) writeAddress(item.display_name);
        if (hint) hint.textContent = "Ünvan xəritədə pinləndi. Dəqiq yer üçün pini sürükləyin və ya başqa nəticə seçin.";
      };

      const showResults = (results, { autoPick = false } = {}) => {
        if (!resultsBox) return;
        clearResults();
        if (!results.length) {
          if (hint) hint.textContent = "Ünvan tapılmadı. Yenidən yazın və ya xəritəyə klikləyin.";
          return;
        }

        if (autoPick) applySearchResult(results[0]);

        if (results.length === 1 && autoPick) return;

        resultsBox.hidden = false;
        results.forEach((item, index) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "map-result-btn";
          btn.textContent = item.display_name;
          if (autoPick && index === 0) btn.setAttribute("aria-current", "true");
          btn.addEventListener("click", () => {
            applySearchResult(item);
            clearResults();
          });
          resultsBox.appendChild(btn);
        });

        if (!autoPick && hint) {
          hint.textContent = "Nəticələrdən birini seçin və ya xəritəyə klikləyin.";
        }
      };

      const runSearch = async ({ autoPick = false } = {}) => {
        const query = (addressInput?.value || "").trim();
        if (query.length < 3) {
          if (hint) hint.textContent = "Ünvanı yazın (ən azı 3 hərf), pin avtomatik görünəcək.";
          return;
        }
        if (hint) hint.textContent = "Axtarılır…";
        if (searchBtn) searchBtn.disabled = true;
        try {
          const results = await searchAddress(query);
          showResults(results, { autoPick: autoPick || results.length === 1 });
        } catch (_error) {
          if (hint) hint.textContent = "Axtarış alınmadı. Bir az sonra yenidən cəhd edin və ya xəritəyə klikləyin.";
          clearResults();
        } finally {
          if (searchBtn) searchBtn.disabled = false;
        }
      };

      map.on("click", (event) => {
        setPin(event.latlng, Math.max(map.getZoom(), 14));
        clearResults();
        fillAddressFromPin(event.latlng);
      });

      searchBtn?.addEventListener("click", () => runSearch({ autoPick: true }));

      addressInput?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        window.clearTimeout(searchTimer);
        runSearch({ autoPick: true });
      });

      addressInput?.addEventListener("input", () => {
        if (suppressAddressSearch) return;
        window.clearTimeout(searchTimer);
        const query = addressInput.value.trim();
        if (query.length < 4) {
          clearResults();
          return;
        }
        if (hint) hint.textContent = "Ünvan yazılır… pin bir az sonra yenilənəcək.";
        searchTimer = window.setTimeout(() => {
          runSearch({ autoPick: true });
        }, 700);
      });

      mapRegistry.set(key, { map, setPin, canvas });
    };

    const refreshVisibleMaps = () => {
      const type = typeSelect?.value || "product";
      const keys = type === "logistics" ? ["pickup", "dropoff"] : ["delivery"];
      keys.forEach((key) => {
        setupMap(key);
        const entry = mapRegistry.get(key);
        if (!entry) return;
        // Maps in newly shown panels need a size refresh
        setTimeout(() => {
          entry.map.invalidateSize();
          entry.map.setView(entry.map.getCenter(), entry.map.getZoom());
        }, 80);
        setTimeout(() => entry.map.invalidateSize(), 250);
      });
    };

    typeSelect?.addEventListener("change", () => {
      setPanelState();
      requestAnimationFrame(() => refreshVisibleMaps());
    });
    setPanelState();
    // Wait for active panel layout before creating Leaflet maps
    requestAnimationFrame(() => {
      refreshVisibleMaps();
      setTimeout(refreshVisibleMaps, 150);
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setPanelState();

      const type = typeSelect?.value || "product";
      if (type === "product") {
        const deliveryUrl = form.querySelector('[data-map-url="delivery"]')?.value;
        if (!deliveryUrl) {
          const status = form.querySelector(".form-status");
          if (status) {
            status.textContent = "Çatdırılma ünvanı üçün xəritədən pin seçin.";
            status.classList.add("is-error");
          }
          return;
        }
      }
      if (type === "logistics") {
        const pickupUrl = form.querySelector('[data-map-url="pickup"]')?.value;
        const dropoffUrl = form.querySelector('[data-map-url="dropoff"]')?.value;
        if (!pickupUrl || !dropoffUrl) {
          const status = form.querySelector(".form-status");
          if (status) {
            status.textContent = "Logistika üçün hər iki ünvanın pinini seçin.";
            status.classList.add("is-error");
          }
          return;
        }
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".form-status");
      const buttonText = submitButton?.textContent || "Sorğu göndər";
      status?.classList.remove("is-success", "is-error");
      if (status) status.textContent = "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Göndərilir...";
      }

      try {
        const formData = new FormData(form);
        const recipient = ORDER_RECIPIENTS[type];
        formData.set("recipient_email", recipient);
        formData.set("email", recipient);
        formData.set("subject", type === "logistics"
          ? `Logistika sifarişi → ${recipient}`
          : `Məhsul sifarişi → ${recipient}`);

        if (type === "product") {
          const lines = [...form.querySelectorAll(".product-line")].map((row, index) => {
            const name = row.querySelector("select")?.value || "";
            const qty = row.querySelector("input")?.value || "";
            return `${index + 1}) ${name} — ${qty}`;
          });
          formData.set("products_summary", lines.join("\n"));
          formData.set("send_address", "Anadolu un Fabriki");
        }

        formData.set("price_note", "Qiymət forma daxil edilməyib — geri dönüşdə bildiriləcək.");

        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Form göndərilmədi.");
        }

        if (status) {
          status.textContent = `Formunuz göndərildi (${recipient}). Qiymət geri dönüşdə bildiriləcək.`;
          status.classList.add("is-success");
        }
        form.reset();
        if (linesRoot) {
          linesRoot.innerHTML = "";
          addProductLine();
        }
        if (typeSelect) typeSelect.value = typeSelect.querySelector("option[selected]")?.value || typeSelect.options[0].value;
        setPanelState();
      } catch (error) {
        if (status) {
          status.textContent = "Göndərilmə zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.";
          status.classList.add("is-error");
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = buttonText;
        }
      }
    });
  });
};

initOrderForms();
