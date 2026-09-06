// Verificar sesión al cargar la página
if (!localStorage.getItem("sessionToken")) {
  location.href = "/"; // Redirige al inicio si no hay sesión
  throw new Error("No hay sesión activa"); // Detener ejecución
}

import { app, auth } from "./firebase-init.js";
import { getFirestore, collection, query, where, getDocs, doc, runTransaction, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);
let usuarioDestino = null;

// Función principal
export function startApp() {

  // Validar usuario logueado con Firebase
  auth.onAuthStateChanged(user => {
    if (!user) {
      localStorage.removeItem("sessionToken"); // eliminar token si Firebase no tiene sesión
      location.href = "/"; // redirigir
    }
  });

  // Paso 1: Buscar usuario por teléfono
  document.getElementById("btnSiguiente").addEventListener("click", async () => {
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje");
    mensaje.innerText = "";
    usuarioDestino = null;

    if (!telefono) { mensaje.innerText = "Ingresa un número"; return; }

    try {
      const q = query(collection(db, "usuarios"), where("telefono", "==", telefono));
      const snapshot = await getDocs(q);
      if (snapshot.empty) { mensaje.innerText = "Usuario no encontrado"; return; }

      snapshot.forEach(docu => usuarioDestino = { id: docu.id, ...docu.data() });

      document.getElementById("nombre").innerText = usuarioDestino.nombre;
      document.getElementById("paso1").style.display = "none";
      document.getElementById("usuarioInfo").style.display = "block";
      document.getElementById("montoEnviar").focus();

    } catch (e) {
      mensaje.innerText = "Error al buscar usuario";
      console.error(e);
    }
  });

  // Paso 2: Enviar saldo
  document.getElementById("btnEnviar").addEventListener("click", async () => {
    const montoInput = document.getElementById("montoEnviar");
    const monto = parseFloat(montoInput.value);
    const mensajeMonto = document.getElementById("mensajeMonto");
    mensajeMonto.innerText = "";

    if (!monto || monto <= 0) { mensajeMonto.innerText = "Monto inválido"; return; }

    const user = auth.currentUser;
    if (!user) { mensajeMonto.innerText = "Debes iniciar sesión"; return; }
    if (!usuarioDestino) { mensajeMonto.innerText = "Usuario inválido"; return; }
    if (user.uid === usuarioDestino.id) { mensajeMonto.innerText = "No puedes enviarte dinero a ti mismo"; return; }

    const remitenteRef = doc(db, "usuarios", user.uid);
    const destinoRef = doc(db, "usuarios", usuarioDestino.id);

    montoInput.disabled = true;

    try {
      await runTransaction(db, async (transaction) => {
        const remitenteSnap = await transaction.get(remitenteRef);
        const destinoSnap = await transaction.get(destinoRef);

        if (!remitenteSnap.exists() || !destinoSnap.exists()) throw "Usuario no existe";

        const remitenteData = remitenteSnap.data();
        const destinoData = destinoSnap.data();

        if (monto > remitenteData.monto) throw "Saldo insuficiente";

        transaction.update(remitenteRef, { monto: remitenteData.monto - monto });
        transaction.update(destinoRef, { monto: destinoData.monto + monto });
      });

      // Guardar historial
      await addDoc(collection(db, "transferencias"), {
        deUid: user.uid,
        paraUid: usuarioDestino.id,
        monto,
        fecha: new Date(),
        estado: "exitosa"
      });

      // Mostrar pantalla de éxito
      const success = document.getElementById("success");
      success.classList.add("active");

      setTimeout(() => {
        success.classList.remove("active");
        document.getElementById("paso1").style.display = "block";
        document.getElementById("usuarioInfo").style.display = "none";
        document.getElementById("telefono").value = "";
        document.getElementById("montoEnviar").value = "";
        montoInput.disabled = false;
      }, 2000);

    } catch (e) {
      mensajeMonto.innerText = "Error: " + e;
      montoInput.disabled = false;
    }
  });

}

// Arrancar la app
startApp();