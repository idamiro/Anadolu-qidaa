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

const brandProfiles = {
  anadolu: {
    name: "Anadolu Qida",
    description: "Un istehsal\u0131 v\u0259 korporativ qida t\u0259chizat\u0131",
    logo: "./anadolu-qida-logo.png",
    target: "index.html"
  },
  mirvari: {
    name: "Mirvari Logistics",
    description: "Planl\u0131 da\u015f\u0131nma v\u0259 logistika xidm\u0259tl\u0259ri",
    logo: "./murvari-logo.jpg",
    target: "mirvari.html"
  }
};

const requestedBrand = new URLSearchParams(window.location.search).get("brand");
const currentBrand = brandProfiles[requestedBrand] ? requestedBrand : (document.body.dataset.brand || "anadolu");
const siteHeader = document.querySelector(".site-header");

if (currentBrand === "mirvari" && requestedBrand === "mirvari") {
  document.body.classList.add("mirvari-page");
  const contextBrand = siteHeader?.querySelector(".brand");
  const contextLogo = contextBrand?.querySelector("img");
  const contextName = contextBrand?.querySelector("span");
  const contextNav = siteHeader?.querySelector(".nav");
  const contextCta = siteHeader?.querySelector(".header-cta");

  if (contextBrand && contextLogo && contextName) {
    contextBrand.classList.add("brand-mirvari");
    contextBrand.href = "mirvari.html";
    contextBrand.setAttribute("aria-label", "Mirvari Logistics ana s\u0259hif\u0259si");
    contextLogo.src = "./murvari-logo.jpg";
    contextLogo.alt = "Mirvari Logistics loqosu";
    contextName.textContent = "Mirvari Logistics";
  }

  if (contextNav) {
    contextNav.innerHTML = `
      <a href="mirvari.html">Ana s\u0259hif\u0259</a>
      <a href="logistika.html">Xidm\u0259tl\u0259r</a>
      <a href="elaqe.html?brand=mirvari">Da\u015f\u0131nma sifari\u015fi</a>
      <a href="elaqe.html?brand=mirvari">\u018flaq\u0259</a>
    `;
  }

  if (contextCta) {
    contextCta.href = "elaqe.html?brand=mirvari";
    contextCta.textContent = "Sor\u011fu g\u00f6nd\u0259r";
  }

  const contextFooter = document.querySelector(".site-footer");
  const footerLogo = contextFooter?.querySelector(".footer-brand img");
  const footerDescription = contextFooter?.querySelector(".footer-brand p");
  const footerNavs = contextFooter?.querySelectorAll("nav.footer-col");
  const footerInfo = contextFooter?.querySelector(".footer-col:not(nav)");
  const footerBottom = contextFooter?.querySelector(".footer-bottom");

  if (footerLogo && footerDescription) {
    footerLogo.src = "./murvari-logo.jpg";
    footerLogo.alt = "Mirvari Logistics loqosu";
    footerDescription.textContent = "Anbar, y\u00fckl\u0259m\u0259, mar\u015frut planlamas\u0131 v\u0259 m\u00fc\u015ft\u0259riy\u0259 \u00e7atd\u0131r\u0131lma xidm\u0259tl\u0259ri.";
  }

  if (footerNavs?.length >= 2) {
    footerNavs[0].innerHTML = '<h3>\u015eirk\u0259t</h3><a href="mirvari.html">Ana s\u0259hif\u0259</a><a href="logistika.html">Logistika</a><a href="elaqe.html?brand=mirvari">\u018flaq\u0259</a>';
    footerNavs[1].innerHTML = '<h3>Xidm\u0259tl\u0259r</h3><a href="logistika.html">Anbar koordinasiyas\u0131</a><a href="logistika.html">Avtomobil da\u015f\u0131malar\u0131</a><a href="elaqe.html?brand=mirvari">Da\u015f\u0131nma sifari\u015fi</a>';
  }

  if (footerInfo) {
    footerInfo.innerHTML = '<h3>Brendl\u0259r</h3><a href="index.html">Anadolu Qida</a><a href="mirvari.html">Mirvari Logistics</a>';
  }

  if (footerBottom) {
    footerBottom.innerHTML = '<span>\u00a9 2026 Mirvari Logistics MMC. B\u00fct\u00fcn h\u00fcquqlar qorunur.</span><a href="mirvari.html">Ana s\u0259hif\u0259</a>';
  }
}

document.body.insertAdjacentHTML("afterbegin", `
  <div class="brand-gateway" data-brand-gateway hidden>
    <div class="brand-gateway-backdrop" aria-hidden="true"></div>
    <section class="brand-gateway-panel" role="dialog" aria-modal="true" aria-labelledby="brandGatewayTitle">
      <button class="brand-gateway-close" type="button" aria-label="Ba\u011fla" data-brand-close>&#215;</button>
      <div class="brand-gateway-heading">
        <span>Bir qrup, iki ixtisasla\u015fma</span>
        <h2 id="brandGatewayTitle">\u015eirk\u0259ti se\u00e7in</h2>
        <p>Davam etm\u0259k ist\u0259diyiniz xidm\u0259t sah\u0259sini se\u00e7in.</p>
      </div>
      <div class="brand-options">
        <button class="brand-option brand-option-anadolu" type="button" data-brand-choice="anadolu">
          <span class="brand-option-index">01</span>
          <span class="brand-option-logo"><img src="./anadolu-qida-logo.png" alt="Anadolu Qida loqosu"></span>
          <span class="brand-option-copy"><strong>Anadolu Qida</strong><small>Un istehsal\u0131 v\u0259 qida t\u0259chizat\u0131</small></span>
          <span class="brand-option-arrow" aria-hidden="true">&#8599;</span>
        </button>
        <button class="brand-option brand-option-mirvari" type="button" data-brand-choice="mirvari">
          <span class="brand-option-index">02</span>
          <span class="brand-option-logo"><img src="./murvari-logo.jpg" alt="Mirvari Logistics loqosu"></span>
          <span class="brand-option-copy"><strong>Mirvari Logistics</strong><small>Da\u015f\u0131nma v\u0259 logistika xidm\u0259tl\u0259ri</small></span>
          <span class="brand-option-arrow" aria-hidden="true">&#8599;</span>
        </button>
      </div>
    </section>
    <div class="brand-intro" data-brand-intro aria-hidden="true">
      <div class="brand-intro-mark"><img src="" alt=""></div>
      <p></p>
      <span class="brand-intro-line"></span>
    </div>
  </div>
`);

const brandGateway = document.querySelector("[data-brand-gateway]");
const brandIntro = document.querySelector("[data-brand-intro]");
const brandClose = document.querySelector("[data-brand-close]");

if (siteHeader && brandGateway) {
  const brandSwitch = document.createElement("button");
  brandSwitch.className = "brand-switch-trigger";
  brandSwitch.type = "button";
  brandSwitch.innerHTML = '<span aria-hidden="true"></span><b>\u015eirk\u0259t se\u00e7</b>';
  brandSwitch.setAttribute("aria-label", "\u015eirk\u0259ti d\u0259yi\u015f");
  const headerCta = siteHeader.querySelector(".header-cta");
  siteHeader.insertBefore(brandSwitch, headerCta || null);

  const openBrandGateway = () => {
    brandGateway.hidden = false;
    document.body.classList.add("brand-gateway-open");
    requestAnimationFrame(() => brandGateway.classList.add("is-visible"));
  };

  const closeBrandGateway = () => {
    brandGateway.classList.remove("is-visible", "is-launching", "intro-anadolu", "intro-mirvari");
    document.body.classList.remove("brand-gateway-open");
    window.setTimeout(() => {
      brandGateway.hidden = true;
    }, 320);
  };

  const launchBrand = (brandKey) => {
    const profile = brandProfiles[brandKey];
    if (!profile || !brandIntro) return;

    try {
      window.sessionStorage.setItem("anadolu-active-brand", brandKey);
    } catch (error) {
      // The selector still works when browser storage is disabled.
    }

    const introImage = brandIntro.querySelector("img");
    const introText = brandIntro.querySelector("p");
    introImage.src = profile.logo;
    introImage.alt = `${profile.name} loqosu`;
    introText.textContent = profile.description;
    brandGateway.classList.remove("intro-anadolu", "intro-mirvari");
    brandGateway.classList.add("is-launching", `intro-${brandKey}`);

    window.setTimeout(() => {
      const currentFile = window.location.pathname.split("/").pop() || "index.html";
      if (currentFile === profile.target) {
        closeBrandGateway();
      } else {
        window.location.href = profile.target;
      }
    }, 1250);
  };

  brandSwitch.addEventListener("click", openBrandGateway);
  brandClose.addEventListener("click", closeBrandGateway);
  brandGateway.querySelectorAll("[data-brand-choice]").forEach((choice) => {
    choice.addEventListener("click", () => launchBrand(choice.dataset.brandChoice));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && brandGateway.classList.contains("is-visible") && !brandGateway.classList.contains("is-launching")) {
      closeBrandGateway();
    }
  });

  let savedBrand = null;
  try {
    savedBrand = window.sessionStorage.getItem("anadolu-active-brand");
  } catch (error) {
    savedBrand = null;
  }

  if (!savedBrand) {
    window.setTimeout(openBrandGateway, 180);
  }
}

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
