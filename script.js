const form = document.querySelector(".contact-form");
const statusText = document.querySelector(".form-status");
const menuToggle = document.querySelector(".menu-toggle");
const heroVideo = document.querySelector("#heroVideo");
const hero = document.querySelector(".hero-home");
const sequenceItems = document.querySelectorAll(".hero-sequence span");

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    statusText.textContent = "Sor\u011fu qey\u0259 al\u0131nd\u0131. Anadolu Qida komandas\u0131 sizinl\u0259 \u0259laq\u0259 saxlayacaq.";
    form.reset();
  });
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

if (heroVideo && hero) {
  const phases = [
    { type: "video", src: "./wheat-fields.mp4", index: 0, duration: 7600 },
    { type: "factory", index: 1, duration: 3800 },
    { type: "video", src: "./field-road.mp4", index: 2, duration: 7200 },
    { type: "video", src: "./coverr-truck-driving-near-the-beach-8711.mp4", index: 2, duration: 6200 }
  ];
  let phaseIndex = 0;

  const setActiveSequence = (activeIndex) => {
    sequenceItems.forEach((item, itemIndex) => {
      item.classList.toggle("active", itemIndex === activeIndex);
    });
  };

  const runPhase = () => {
    const phase = phases[phaseIndex];
    setActiveSequence(phase.index);

    if (phase.type === "factory") {
      hero.classList.add("factory-phase");
    } else {
      hero.classList.remove("factory-phase");
      if (!heroVideo.src.endsWith(phase.src.replace("./", ""))) {
        heroVideo.src = phase.src;
      }
      heroVideo.play().catch(() => {
        hero.classList.add("factory-phase");
      });
    }

    window.setTimeout(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      runPhase();
    }, phase.duration);
  };

  runPhase();
}
