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

const heroVideos = [...document.querySelectorAll(".hero-video-layer")];

if (heroVideos.length > 1) {
  let activeVideo = 0;

  const playVideo = (index) => {
    heroVideos.forEach((video, videoIndex) => {
      const isActive = videoIndex === index;
      video.classList.toggle("active", isActive);
      if (!isActive) video.pause();
    });

    const video = heroVideos[index];
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  heroVideos.forEach((video, index) => {
    video.addEventListener("ended", () => {
      if (index !== activeVideo) return;
      activeVideo = (activeVideo + 1) % heroVideos.length;
      playVideo(activeVideo);
    });
  });
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
