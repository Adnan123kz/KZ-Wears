/* ==========================================================
   KZ's Wear — script.js

   1) CONFIGURACIÓN  → aquí cambias productos, fotos e Instagram
   2) Utilidades
   3) Pintar la página con esos datos
   4) Comportamientos (menú, scroll, clic en productos…)

   Otras imágenes:
   · Fondo del hero  → index.html, busca <img class="hero__bg">
   · Favicon         → images/favicon.svg
   ========================================================== */

/* ---------------------------------------------------------
   1) CONFIGURACIÓN
   --------------------------------------------------------- */

// Los productos. El hero enseña solo la FOTO de los 4 primeros (flotando, sin texto);
// la sección Trend enseña foto + nombre + precio de todos.
//
//  · Cambiar una foto: guarda la nueva en images/products/ y cambia "image"
//    (o sustituye el archivo dejándole el mismo nombre y no tocas nada).
//  · price va en euros y sin símbolo: 29 → "29,00 €".
//  · Nombres y precios de abajo son de EJEMPLO.
const PRODUCTS = [
  { name: "Tee 01", price: 29, image: "images/products/product-1.jpg" },
  { name: "Tee 02", price: 29, image: "images/products/product-2.jpg" },
  { name: "Tee 03", price: 29, image: "images/products/product-3.jpg" },
  { name: "Tee 04", price: 29, image: "images/products/product-4.jpg" },
];

// Instagram: tu usuario, el enlace a tu perfil y las 6 fotos de la cuadrícula.
const INSTAGRAM = {
  handle: "@kzswear", // ← pon tu usuario real cuando abras la cuenta
  url: "https://www.instagram.com/", // ← pon el enlace a tu perfil
  images: [
    "images/instagram/ig-1.jpg",
    "images/instagram/ig-2.jpg",
    "images/instagram/ig-3.jpg",
    "images/instagram/ig-4.jpg",
    "images/instagram/ig-5.jpg",
    "images/instagram/ig-6.jpg",
  ],
};

/* ---------------------------------------------------------
   2) UTILIDADES
   --------------------------------------------------------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// 29 → "29,00 €"
const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

// Evita que unas comillas en un nombre rompan el HTML.
const esc = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INSTAGRAM_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5"></rect>
    <circle cx="12" cy="12" r="4"></circle>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
  </svg>`;

/* ---------------------------------------------------------
   3) PINTAR LA PÁGINA
   --------------------------------------------------------- */

// Hero: 2 fotos a la izquierda y 2 a la derecha. Solo la foto, sin nombre.
function renderHero() {
  const columns = { left: $('[data-hero-col="left"]'), right: $('[data-hero-col="right"]') };

  PRODUCTS.slice(0, 4).forEach((product, i) => {
    const side = i < 2 ? "left" : "right";
    columns[side].insertAdjacentHTML(
      "beforeend",
      `<div class="tile" style="--i:${i}">
         <a class="tile__link" href="#trend" data-product="product-${i + 1}">
           <img src="${esc(product.image)}" alt="${esc(product.name)}" width="800" height="800" decoding="async">
         </a>
         <span class="tile__ground" aria-hidden="true"></span>
       </div>`
    );
  });
}

// Trend: foto + nombre + precio.
function renderTrend() {
  $("#trend-grid").innerHTML = PRODUCTS.map(
    (product, i) => `
      <li class="card reveal" id="product-${i + 1}" style="--i:${i}">
        <div class="card__media">
          <img src="${esc(product.image)}" alt="${esc(product.name)}" width="800" height="800" loading="lazy" decoding="async">
        </div>
        <h3 class="card__name">${esc(product.name)}</h3>
        <p class="card__price">${euro.format(product.price)}</p>
      </li>`
  ).join("");
}

// Instagram: cuadrícula de fotos + botón.
function renderInstagram() {
  $("#insta-grid").innerHTML = INSTAGRAM.images
    .map(
      (src, i) => `
      <li class="insta__item reveal" style="--i:${i}">
        <a href="${esc(INSTAGRAM.url)}" target="_blank" rel="noopener noreferrer"
           aria-label="Open ${esc(INSTAGRAM.handle)} on Instagram (photo ${i + 1})">
          <img src="${esc(src)}" alt="" width="600" height="600" loading="lazy" decoding="async">
          ${INSTAGRAM_ICON}
        </a>
      </li>`
    )
    .join("");

  const button = $("#insta-link");
  button.href = INSTAGRAM.url;
  button.textContent = `Follow ${INSTAGRAM.handle}`;
}

/* ---------------------------------------------------------
   4) COMPORTAMIENTOS
   --------------------------------------------------------- */

// Menú: cambia de aspecto al bajar y se abre/cierra en móvil.
function setupHeader() {
  const header = $(".site-header");
  const toggle = $(".nav-toggle");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    header.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setMenu(!header.classList.contains("is-menu-open")));
  $$(".site-nav a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
}

// Clic en un producto del hero → baja a Trend y resalta esa tarjeta.
function setupProductLinks() {
  $(".hero").addEventListener("click", (e) => {
    const link = e.target.closest("[data-product]");
    if (!link) return;
    e.preventDefault();

    const card = document.getElementById(link.dataset.product);
    // En pantalla ancha caben las 4 tarjetas: vamos al inicio de la sección.
    // En móvil se apilan: centramos la tarjeta concreta.
    const wide = window.matchMedia("(min-width: 992px)").matches;
    const target = wide ? $("#trend") : card;

    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: wide ? "start" : "center" });

    setTimeout(() => {
      card.classList.remove("is-flash");
      void card.offsetWidth; // reinicia la animación si se pulsa dos veces
      card.classList.add("is-flash");
    }, reduceMotion ? 0 : 500);
  });
}

// Los elementos con clase "reveal" aparecen suavemente al entrar en pantalla.
function setupReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   ARRANQUE
   --------------------------------------------------------- */
renderHero();
renderTrend();
renderInstagram();
setupHeader();
setupProductLinks();
setupReveal();
$("#year").textContent = new Date().getFullYear();
