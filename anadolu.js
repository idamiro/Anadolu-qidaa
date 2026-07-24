const body = document.body;
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  const mobileCta = document.createElement("a");
  mobileCta.href = "elaqe.html";
  mobileCta.className = "mobile-cta";
  mobileCta.textContent = "Korporativ sorğu";
  nav.appendChild(mobileCta);

  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
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

const requestTopic = document.querySelector("#requestTopic");
const topicPanels = document.querySelectorAll("[data-topic-panel]");

const updatePanels = () => {
  if (!requestTopic) return;
  topicPanels.forEach((panel) => {
    const active = panel.dataset.topicPanel === requestTopic.value;
    panel.classList.toggle("active", active);
    panel.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !active;
    });
  });
};

requestTopic?.addEventListener("change", updatePanels);
updatePanels();

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "Müraciətiniz qəbul edildi. Komandamız sizinlə əlaqə saxlayacaq.";
    form.reset();
    updatePanels();
  });
});
