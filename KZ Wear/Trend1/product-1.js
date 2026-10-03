/* ==========================================================
   KZ's Wear — product-1.js   (página del producto: Dust Trousers)

   Las animaciones y el diseño son CSS. Este archivo solo hace dos cosas:
     1) Avisar si pulsas Purchase sin haber elegido talla.
     2) Confirmar el pedido cuando sí la has elegido (de momento es una DEMO:
        todavía no hay carrito ni pago).
   ========================================================== */

/* ---------------------------------------------------------
   Atajos (así no repetimos "document.querySelector" mil veces)
   --------------------------------------------------------- */
const $ = (selector, root = document) => root.querySelector(selector);

const form = $("#buy-form"); // el formulario: tallas + botón
const picker = $("#size-picker"); // la fila de estrellas
const message = $("#buy-message"); // el texto que sale debajo del botón
const productName = $("#product-title").textContent.trim();

/* ---------------------------------------------------------
   Escribe un mensaje debajo del botón.
   kind = "error" (rojizo) o "ok" (dorado)
   --------------------------------------------------------- */
function say(text, kind = "ok") {
  message.textContent = text;
  message.dataset.kind = kind; // el CSS usa data-kind para pintarlo de un color u otro
}

/* ---------------------------------------------------------
   Sacude la fila de estrellas.
   Quitamos y volvemos a poner la clase para que la animación
   se repita aunque pulses el botón varias veces seguidas.
   --------------------------------------------------------- */
function shake(element) {
  element.classList.remove("is-shaking");
  void element.offsetWidth; // truco: obliga al navegador a "darse cuenta" del cambio
  element.classList.add("is-shaking");
}

/* ---------------------------------------------------------
   Al pulsar Purchase
   --------------------------------------------------------- */
form.addEventListener("submit", (event) => {
  event.preventDefault(); // evita que el formulario recargue la página

  const size = new FormData(form).get("size"); // "S", "M", "L"… o null si no hay ninguna

  if (!size) {
    say("Choose your size first.", "error");
    shake(picker);
    return;
  }

  // TODO: aquí irá el carrito de verdad. De momento solo confirmamos.
  say(`${productName} · size ${size} — added. (Demo: the cart isn’t built yet.)`, "ok");
});

/* ---------------------------------------------------------
   Al elegir talla, quitamos el aviso de error
   --------------------------------------------------------- */
form.addEventListener("change", () => {
  if (message.dataset.kind === "error") say("");
});
