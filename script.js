const form = document.querySelector(".contact-form");
const statusText = document.querySelector(".form-status");
const menuToggle = document.querySelector(".menu-toggle");
const heroVideo = document.querySelector("#heroVideo");

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
