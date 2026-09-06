function calcularEaster(year) {
  let a = year % 19;
  let b = Math.floor(year / 100);
  let c = year % 100;
  let d = Math.floor(b / 4);
  let e = b % 4;
  let f = Math.floor((b + 8) / 25);
  let g = Math.floor((b - f + 1) / 3);
  let h = (19 * a + b - d - g + 15) % 30;
  let i = Math.floor(c / 4);
  let k = c % 4;
  let l = (32 + 2 * e + 2 * i - h - k) % 7;
  let m = Math.floor((a + 11 * h + 22 * l) / 451);
  let month = Math.floor((h + l - 7 * m + 114) / 31);
  let day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}
function semanaSanta(year) {
  const easter = calcularEaster(year);

  const jueves = new Date(easter);
  jueves.setDate(easter.getDate() - 3);

  const viernes = new Date(easter);
  viernes.setDate(easter.getDate() - 2);

  return [
    { nombre: "Jueves Santo ✝️", fecha: jueves },
    { nombre: "Viernes Santo ✝️", fecha: viernes }
  ];
}
function obtenerEventos() {
  const year = new Date().getFullYear();

  const primerDiaMayo = new Date(year, 4, 1);

const primerDomingo =
  primerDiaMayo.getDay() === 0
    ? 1
    : 8 - primerDiaMayo.getDay();

const segundoDomingo = primerDomingo + 7;

const diaMadre = new Date(year, 4, segundoDomingo);
  const primerDiaJunio = new Date(year, 5, 1);

const primerDomingoJunio =
  primerDiaJunio.getDay() === 0
    ? 1
    : 8 - primerDiaJunio.getDay();

const tercerDomingo = primerDomingoJunio + 14;

const diaPadre = new Date(year, 5, tercerDomingo);

  return [
    { nombre: "Feliz día del san Valentín 💖", fecha: new Date(year, 1, 14) },

    ...semanaSanta(year),

    { nombre: " Feliz día del Trabajo 👷", fecha: new Date(year, 4, 1) },

    { nombre: "Feliz día de la Madre 👩‍👧", fecha: diaMadre },

    { nombre: "Feliz día del Padre 👨‍👧", fecha: diaPadre },

    { nombre: "Felices fiestas Patrias 🇵🇪", fecha: new Date(year, 6, 28) },
    { nombre: "Felices fiestas Patrias 🇵🇪", fecha: new Date(year, 6, 29) },

    { nombre: "Feliz Navidad 🎄", fecha: new Date(year, 11, 25) }
  ];
}
/* =========================
   🧠 DETECTAR SEMANA PROMO
========================= */
function eventoActivo() {
  const hoy = new Date();

  return obtenerEventos().find(e => {
    const diff = (e.fecha - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });
}

/* =========================
   💸 CALCULAR PRECIO
========================= */
function aplicarDescuento(precio) {
  return eventoActivo()
    ? Math.round(precio * 0.9)
    : precio;
}

/* =========================
   🏷️ ACTUALIZAR PRECIOS UI
========================= */
function actualizarPrecios() {
  const evento = eventoActivo();

  document.querySelectorAll(".price").forEach(el => {
    const precio = parseInt(el.dataset.precio);
    const nuevo = aplicarDescuento(precio);

    if (evento) {
      el.innerHTML = `
        <span class="old">S/ ${precio}</span>
        <span class="new">S/ ${nuevo}</span>
        <span class="sale">-10%</span>
      `;
    } else {
      el.innerHTML = `S/ ${precio}`;
    }
  });
}

/* =========================
   🎊 MODAL PROMOCIÓN
========================= */
function mostrarPromo(){
  const evento = eventoActivo();
  if (!evento) return;

  const modal = document.createElement("div");

  modal.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.7);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:99999;
    ">
      <div style="
        background:linear-gradient(135deg,#667eea,#764ba2);
        color:white;
        padding:25px;
        border-radius:20px;
        text-align:center;
        max-width:320px;
        box-shadow:0 10px 40px rgba(0,0,0,.4);
      ">
        <h2>${evento.nombre}</h2>
        <p>🎉 ten un 10% de descuento hasta terminar la hora.</p>

        <div id="contador" style="
          font-size:22px;
          font-weight:bold;
          margin:10px 0;
          background:rgba(0,0,0,.2);
          padding:10px;
          border-radius:10px;
        ">
          00:00:00
        </div>

        <button onclick="this.closest('div').parentElement.remove()"
        style="
          margin-top:12px;
          padding:10px 15px;
          border:none;
          background:white;
          color:#667eea;
          border-radius:10px;
          font-weight:bold;
        ">
          Aceptar promoción 🚀
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  iniciarContador();
}

function iniciarContador(){
  const contador = document.getElementById("contador");

  function actualizar(){
    const ahora = new Date();

    // Próxima medianoche
    const fin = new Date();
    fin.setHours(24,0,0,0);

    const diff = fin - ahora;

    if(diff <= 0){
      contador.innerText = "00:00:00";
      return;
    }

    const h = Math.floor(diff / 1000 / 60 / 60);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    contador.innerText =
      String(h).padStart(2,'0') + ":" +
      String(m).padStart(2,'0') + ":" +
      String(s).padStart(2,'0');
  }

  actualizar();
  setInterval(actualizar,1000);
}
/* =========================
   🚀 INICIO
========================= */
window.addEventListener("load", () => {
  actualizarPrecios();

  if (eventoActivo()) {
    setTimeout(mostrarPromo, 1200);
  }
});
/* =========================
   💳 LÓGICA DE PAGO
========================= */
/* =========================
   💳 LÓGICA DE PAGO
========================= */
let planSeleccionado = "";
let precioSeleccionado = 0;

function pagar(plan, precio){

  planSeleccionado = plan;

  const precioFinal = aplicarDescuento(precio);
  precioSeleccionado = precioFinal;

  document.getElementById("planNombre").innerText = planSeleccionado;
  document.getElementById("planPrecio").innerText = precioSeleccionado;

  document.getElementById("modalPago").style.display = "flex";
}

function cerrarModal(){
  document.getElementById("modalPago").style.display = "none";
}

/* =========================
   💳 MERCADO PAGO
========================= */
function irMP(){
  window.open(
    "https://link.mercadopago.com.pe/kevintechtutorials",
    "_blank"
  );
}
function confirmarPago(){

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const idPago = document.getElementById("idPago").value;

  if(!nombre || !correo || !idPago){
    alert("Completa todos los campos");
    return;
  }

  const numero = "51994031672";

  const mensaje = `
📥 *Nuevo pago recibido*

👤 Nombre: ${nombre}
📧 Correo: ${correo}
🧾 ID Pago: ${idPago}

📦 Plan: ${planSeleccionado}
💰 Monto: S/ ${precioSeleccionado}
  `;

  const url =
    "https://wa.me/" +
    numero +
    "?text=" +
    encodeURIComponent(mensaje);

  window.open(url, "_blank");
}
