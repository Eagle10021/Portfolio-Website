// Portfolio interactions. Animations use anime.js v4 (https://animejs.com).
import { animate, stagger, onScroll, splitText, utils } from "https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.esm.min.js";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
root.classList.add("js");

const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* private mode */ } },
};

// ------------------------------------------------------------------ hero
function animateHero() {
  if (reduceMotion) return;
  const { chars } = splitText(".hero-name", { chars: true });
  animate(chars, {
    opacity: [0, 1],
    translateY: ["0.6em", "0em"],
    rotate: [8, 0],
    duration: 900,
    delay: stagger(40, { start: 150 }),
    ease: "outExpo",
  });
  animate(".eyebrow, .hero-role, .hero-actions, .hero-facts", {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 800,
    delay: stagger(110, { start: 350 }),
    ease: "outQuart",
  });
  animate(".hero-photo", { opacity: [0, 1], scale: [0.92, 1], duration: 1100, delay: 250, ease: "outExpo" });
}

// ------------------------------------------------------------------ scroll reveals
function setUpReveals() {
  if (reduceMotion) return;
  for (const el of document.querySelectorAll(".reveal")) {
    animate(el, {
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 800,
      ease: "outExpo",
      autoplay: onScroll({ target: el, repeat: false }),
    });
  }
  for (const group of document.querySelectorAll(".reveal-group")) {
    animate(group.children, {
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.97, 1],
      duration: 700,
      delay: stagger(70),
      ease: "outQuart",
      autoplay: onScroll({ target: group, repeat: false }),
    });
  }
  // count-up numbers (they already show the final value without JS)
  for (const el of document.querySelectorAll("[data-count]")) {
    const counter = { n: 0 };
    const end = Number(el.dataset.count);
    el.textContent = "0";
    animate(counter, {
      n: end,
      duration: 1400,
      ease: "outExpo",
      onUpdate: () => { el.textContent = Math.round(counter.n); },
      autoplay: onScroll({ target: el, repeat: false }),
    });
  }
}

// ------------------------------------------------------------------ Sunset Mirai particles
const sky = document.getElementById("sky");
let sparkAnimations = [];

function startSparks() {
  stopSparks();
  if (reduceMotion || root.dataset.theme !== "mirai") return;
  const count = window.innerWidth < 700 ? 16 : 32;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement("span");
    const size = utils.random(3, 9);
    spark.className = "spark";
    Object.assign(spark.style, {
      width: `${size}px`, height: `${size}px`,
      left: `${utils.random(0, 100)}vw`, top: `${utils.random(60, 110)}vh`,
    });
    sky.appendChild(spark);
    sparkAnimations.push(animate(spark, {
      translateY: [0, -utils.random(window.innerHeight * 0.5, window.innerHeight * 1.1)],
      translateX: [0, utils.random(-60, 60)],
      opacity: [0, utils.random(0.5, 1, 2), 0],
      scale: [0.6, 1.2],
      duration: utils.random(7000, 14000),
      delay: utils.random(0, 6000),
      loop: true,
      ease: "inOutSine",
    }));
  }
}

function stopSparks() {
  sparkAnimations.forEach((a) => a.pause());
  sparkAnimations = [];
  sky.replaceChildren();
}

// ------------------------------------------------------------------ music (off until the visitor turns it on)
const music = document.getElementById("music");
const musicButton = document.getElementById("music-toggle");
const TRACKS = { standard: "audio/Origami.mp3", mirai: "audio/Snowfall.mp3" };
const TARGET_VOLUME = 0.35;
let musicOn = false;

function fadeTo(volume, duration = 900) {
  const level = { v: music.volume };
  return new Promise((resolve) => {
    animate(level, {
      v: volume, duration, ease: "linear",
      onUpdate: () => { music.volume = Math.max(0, Math.min(1, level.v)); },
      onComplete: resolve,
    });
  });
}

async function playTrackForTheme() {
  const src = TRACKS[root.dataset.theme] || TRACKS.standard;
  if (!music.src.endsWith(src)) {
    if (!music.paused) await fadeTo(0, 600);
    music.src = src;
  }
  music.volume = 0;
  try {
    await music.play();
    fadeTo(TARGET_VOLUME);
  } catch {
    setMusic(false); // autoplay blocked
  }
}

async function setMusic(on) {
  musicOn = on;
  musicButton.setAttribute("aria-pressed", String(on));
  musicButton.title = on ? "Music: on" : "Music: off";
  store.set("music", on ? "on" : "off");
  if (on) {
    playTrackForTheme();
  } else if (!music.paused) {
    await fadeTo(0, 500);
    music.pause();
  }
}

musicButton.addEventListener("click", () => setMusic(!musicOn));

// ------------------------------------------------------------------ theme
const themeButton = document.getElementById("theme-toggle");
themeButton.addEventListener("click", () => {
  const next = root.dataset.theme === "mirai" ? "standard" : "mirai";
  root.dataset.theme = next;
  store.set("theme", next);
  startSparks();
  if (musicOn) playTrackForTheme(); // cross-fade to the other theme's track
  if (!reduceMotion) {
    animate("main", { opacity: [0.4, 1], duration: 500, ease: "outQuad" });
  }
});

// ------------------------------------------------------------------ navigation
const menuButton = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
menuButton.addEventListener("click", () => {
  const open = mobileMenu.hidden;
  mobileMenu.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
});
mobileMenu.addEventListener("click", (e) => {
  if (e.target.closest("a")) { mobileMenu.hidden = true; menuButton.setAttribute("aria-expanded", "false"); }
});

const navLinks = [...document.querySelectorAll(".nav-links a")];
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  }
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ------------------------------------------------------------------ gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
document.querySelectorAll(".shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    const thumb = shot.querySelector("img");
    lightboxImg.src = shot.dataset.full;
    lightboxImg.alt = thumb.alt;
    lightboxCaption.textContent = shot.querySelector("span")?.textContent || "";
    lightbox.showModal();
    if (!reduceMotion) animate(lightboxImg, { opacity: [0, 1], scale: [0.94, 1], duration: 450, ease: "outExpo" });
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

// ------------------------------------------------------------------ start
animateHero();
setUpReveals();
startSparks();
