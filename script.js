const body = document.body;
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  const mobileSwitch = document.createElement("button");
  mobileSwitch.className = "mobile-switch";
  mobileSwitch.type = "button";
  mobileSwitch.textContent = "Şirkət seç";
  nav.appendChild(mobileSwitch);

  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    body.classList.toggle("menu-open", open);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count || 0);
    const duration = 1100;
    const started = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = element.dataset.plain === "true" ? String(value) : value.toLocaleString("az-AZ");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.65 });

document.querySelectorAll("[data-count]").forEach((element) => counterObserver.observe(element));

body.insertAdjacentHTML("beforeend", `
  <div class="brand-gateway" data-brand-gateway aria-hidden="true" role="dialog" aria-modal="true" aria-label="Şirkət seçimi">
    <div class="gateway-title">Fəaliyyət sahəsini seçin</div>
    <button class="gateway-close" type="button" data-brand-close aria-label="Bağla">×</button>
    <button class="brand-choice" type="button" data-brand-choice data-target="index.html" data-logo="./anadolu-qida-logo.png">
      <video class="gateway-media" autoplay muted loop playsinline aria-hidden="true"><source src="./wheat-fields.mp4" type="video/mp4"></video>
      <span class="brand-choice-content"><img class="brand-choice-logo" src="./anadolu-qida-logo.png" alt=""><strong>Anadolu Qida</strong><span>Un istehsalı və korporativ təchizat</span></span>
      <span class="brand-choice-arrow" aria-hidden="true">→</span>
    </button>
    <button class="brand-choice" type="button" data-brand-choice data-target="mirvari.html" data-logo="./murvari-logo.jpg">
      <video class="gateway-media" autoplay muted loop playsinline aria-hidden="true"><source src="./field-road.mp4" type="video/mp4"></video>
      <span class="brand-choice-content"><img class="brand-choice-logo" src="./murvari-logo.jpg" alt=""><strong>Mirvari Logistics</strong><span>Planlı daşınma və logistika həlləri</span></span>
      <span class="brand-choice-arrow" aria-hidden="true">→</span>
    </button>
  </div>
  <div class="brand-intro" data-brand-intro aria-hidden="true"><img src="./anadolu-qida-logo.png" alt=""></div>
`);

const gateway = document.querySelector("[data-brand-gateway]");
const intro = document.querySelector("[data-brand-intro]");

const openGateway = () => {
  if (!gateway) return;
  gateway.classList.add("open");
  gateway.setAttribute("aria-hidden", "false");
  body.classList.add("gateway-open");
};

const closeGateway = () => {
  if (!gateway) return;
  gateway.classList.remove("open");
  gateway.setAttribute("aria-hidden", "true");
  body.classList.remove("gateway-open");
};

const playIntroAndGo = (choice) => {
  const target = choice.dataset.target;
  const logo = choice.dataset.logo;
  sessionStorage.setItem("brand-selected", "1");
  closeGateway();

  if (!intro) {
    window.location.href = target;
    return;
  }

  const image = intro.querySelector("img");
  image.src = logo;
  intro.classList.add("playing");
  window.setTimeout(() => {
    window.location.href = target;
  }, 1050);
};

document.querySelectorAll("[data-brand-switch]").forEach((button) => {
  button.addEventListener("click", openGateway);
});

if (gateway) {
  gateway.querySelector("[data-brand-close]")?.addEventListener("click", closeGateway);
  gateway.querySelectorAll("[data-brand-choice]").forEach((choice) => {
    choice.addEventListener("click", () => playIntroAndGo(choice));
  });

  if (body.dataset.gateway === "initial" && !sessionStorage.getItem("brand-selected")) {
    window.setTimeout(openGateway, 300);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGateway();
});

const requestTopic = document.querySelector("#requestTopic");
const topicPanels = document.querySelectorAll("[data-topic-panel]");

const updateTopicPanels = () => {
  if (!requestTopic) return;
  topicPanels.forEach((panel) => {
    const active = panel.dataset.topicPanel === requestTopic.value;
    panel.classList.toggle("active", active);
    panel.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !active;
    });
  });
};

requestTopic?.addEventListener("change", updateTopicPanels);
updateTopicPanels();

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) {
      status.textContent = "Müraciətiniz hazırlandı. Komandamız sizinlə əlaqə saxlayacaq.";
    }
    form.reset();
    updateTopicPanels();
  });
});
