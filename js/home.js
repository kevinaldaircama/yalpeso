if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// ✅ usar config desde firebase-config.js
const firebaseConfig = window.firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const userLink = document.getElementById("userLink");
const saldoValor = document.getElementById("saldo-valor");


// 🔑 Detectar usuario logueado
onAuthStateChanged(auth, async (user) => {

  if (user) {

    const ref = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {

      const datos = docSnap.data();
      
      saldoValor.textContent =
        `S/ ${datos.monto}`;

      cargarMovimientos(user.uid);

    }

  } else {

    window.location.href = "/";

  }

});


// 👁️ Mostrar / ocultar saldo
window.mostrarSaldo = function () {

  const saldo = document.getElementById("saldo-valor");

  saldo.style.opacity =
    (saldo.style.opacity === "0") ? "1" : "0";

}


// 📂 Mostrar / ocultar dropdown
window.toggleDropdown = function () {

  const dropdown = document.getElementById("dropdown");

  dropdown.style.display =
    dropdown.style.display === "block"
      ? "none"
      : "block";

}


// 📊 Cargar movimientos
async function cargarMovimientos(uid) {

  const movimientosRef = collection(db, "movimientos");

  const q = query(
    movimientosRef,
    where("uid", "==", uid),
    orderBy("fecha", "desc")
  );

  const snapshot = await getDocs(q);

  const contenedor =
    document.getElementById("movimientos-container");

  let html = "";

  if (snapshot.empty) {

    html =
      `<div style="text-align:center;color:#888;">
      No tienes movimientos aún.
      </div>`;

  } else {

    snapshot.forEach(docSnap => {

      const mov = docSnap.data();

      const nombre =
        mov.nombreDestino || "*** *** ***";

      const telefono =
        mov.telefonoDestino || "*** *** 672";

      const monto =
        parseFloat(mov.monto).toFixed(2);

      let fechaTexto = "Fecha desconocida";
      let horaTexto = "";

      if (
        mov.fecha &&
        typeof mov.fecha.toDate === "function"
      ) {

        const fecha =
          mov.fecha.toDate();

        fechaTexto =
          fecha.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric"
          });

        horaTexto =
          fecha.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit"
          });

      }

      const url =
        `comprobante.html?nombre=${encodeURIComponent(nombre)}&telefono=${encodeURIComponent(telefono)}&monto=${encodeURIComponent(monto)}`;

      html += `
      <div class="movimiento"
           onclick="window.location.href='${url}'"
           style="cursor:pointer;padding:12px;border-bottom:1px solid #eee;">

        <strong>${nombre}</strong>
        <span class="monto">- S/ ${monto}</span>
        <br>
        <small>${fechaTexto} ${horaTexto}</small>

      </div>
      `;

    });

    html += `
    <div style="text-align:center;color:var(--verde);font-weight:bold;margin-top:10px;">
      VER TODOS
    </div>`;

  }

  contenedor.innerHTML = html;

}


// 🎠 Carousel

let currentSlide = 0;

const slideContainer =
  document.getElementById("slide-container");

const totalSlides =
  slideContainer.children.length;

const dots =
  document.querySelectorAll(".dot");


setInterval(() => {

  currentSlide =
    (currentSlide + 1) % totalSlides;

  slideContainer.style.transform =
    `translateX(-${currentSlide * 100}%)`;

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentSlide
    );

  });

}, 5000);
