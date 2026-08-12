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

  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menyunu aç");
    body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Menyunu bağla" : "Menyunu aç");
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

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
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Form göndərilmədi.");
      }

      if (status) {
        status.textContent = "Formunuz göndərildi. Komandamız tezliklə sizinlə əlaqə saxlayacaq.";
        status.classList.add("is-success");
      }
      form.reset();
      updatePanels();
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

/* Craft home motion */
if (body.classList.contains("craft-home") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const parallaxNode = document.querySelector("[data-parallax]");
  if (parallaxNode) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 48);
        parallaxNode.style.transform = `translate3d(0, ${offset}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.querySelectorAll(".craft-photo-frame, .craft-circle-img").forEach((frame) => {
    frame.addEventListener("pointermove", (event) => {
      const rect = frame.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      frame.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    frame.addEventListener("pointerleave", () => {
      frame.style.transform = "";
    });
  });
}
