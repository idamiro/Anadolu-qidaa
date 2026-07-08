const form = document.querySelector(".contact-form");
const statusText = document.querySelector(".form-status");
const menuToggle = document.querySelector(".menu-toggle");
const heroVideo = document.querySelector("#heroVideo");
const counters = document.querySelectorAll(".counter");
const requestTopic = document.querySelector("#requestTopic");
const topicPanels = document.querySelectorAll("[data-topic-panel]");
document.querySelectorAll("main > section:not(.hero)").forEach((block) => {
  block.classList.add("reveal-ready");
  block.classList.add("reveal-on-scroll");
});
const revealBlocks = document.querySelectorAll(".reveal-on-scroll");
const valuesCarousel = document.querySelector("#valuesCarousel");
const valuesNavButtons = document.querySelectorAll("[data-values-dir]");

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    statusText.textContent = "Sor\u011fu qey\u0259 al\u0131nd\u0131. Anadolu Qida komandas\u0131 sizinl\u0259 \u0259laq\u0259 saxlayacaq.";
    form.reset();
    updateTopicPanels();
  });
}

const updateTopicPanels = () => {
  if (!requestTopic || !topicPanels.length) return;
  topicPanels.forEach((panel) => {
    const isActive = panel.dataset.topicPanel === requestTopic.value;
    panel.classList.toggle("active", isActive);
    panel.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !isActive;
    });
  });
};

if (requestTopic) {
  requestTopic.addEventListener("change", updateTopicPanels);
  updateTopicPanels();
}

if (valuesCarousel && valuesNavButtons.length) {
  valuesNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.valuesDir || "1");
      valuesCarousel.scrollBy({
        left: direction * Math.max(valuesCarousel.clientWidth * 0.82, 280),
        behavior: "smooth"
      });
    });
  });
}

if (revealBlocks.length) {
  const reveal = (block) => block.classList.add("in-view");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealBlocks.forEach((block) => revealObserver.observe(block));
  } else {
    revealBlocks.forEach(reveal);
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      document.body.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (heroVideo) {
  const phases = [
    { src: "./wheat-fields.mp4", duration: 9000 },
    { src: "./field-road.mp4", duration: 9000 }
  ];
  let phaseIndex = 0;

  const runPhase = () => {
    const phase = phases[phaseIndex];
    if (!heroVideo.src.endsWith(phase.src.replace("./", ""))) {
      heroVideo.src = phase.src;
    }
    heroVideo.play().catch(() => {});

    window.setTimeout(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      runPhase();
    }, phase.duration);
  };

  runPhase();
}

if (counters.length) {
  const formatNumber = (value, useSpace) => {
    const rounded = Math.round(value);
    return useSpace ? rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : String(rounded);
  };

  const animateCounter = (counter) => {
    if (counter.dataset.done === "true") return;
    counter.dataset.done = "true";

    const target = Number(counter.dataset.count || "0");
    const start = Number(counter.dataset.start || "0");
    const duration = Number(counter.dataset.duration || "1200");
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    const useSpace = counter.dataset.format === "space";
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${prefix}${formatNumber(start + ((target - start) * eased), useSpace)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = `${prefix}${formatNumber(target, useSpace)}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }
}
