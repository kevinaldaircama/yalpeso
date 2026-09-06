if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


let app;
let auth;
let db;
let userUID;


/* INIT */

const cfg = window.firebaseConfig;

app = initializeApp(cfg);

auth = getAuth(app);

db = getFirestore(app);

startApp();


function startApp(){

onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  userUID = user.uid;

  document.getElementById("correo").value =
    user.email;

  document.getElementById("password").value =
    "";

  const uidSpan =
    document.getElementById("uid-value");

  uidSpan.dataset.original =
    userUID;

  uidSpan.dataset.hidden = "true";

  uidSpan.textContent =
    "••••••••";


  try {

    const docRef =
      doc(db,"usuarios",userUID);

    const docSnap =
      await getDoc(docRef);

    if (docSnap.exists()) {

      const data =
        docSnap.data();

      document.getElementById("nombre").value =
        data.nombre ?? "";

      document.getElementById("monto").value =
        data.monto ?? "";

      document.getElementById("pin").value =
        data.pin ?? "";

      document.getElementById("telefono").value =
        data.telefono ?? "";

    }

  }
  catch (e) {

    mostrarModal(
      "Error obteniendo datos"
    );

  }

});

}



/* EDITAR */

window.activarEdicion = () => {

  ["nombre","monto","telefono","correo","password"]
  .forEach(id => {

    document
    .getElementById(id)
    .disabled = false;

  });

  document
  .getElementById("guardarBtn")
  .style.display = "inline-block";

};



/* GUARDAR */

window.guardarCambios =
async () => {

  const nombre =
    document.getElementById("nombre").value.trim();

  const monto =
    parseFloat(
      document.getElementById("monto").value
    );

  const telefono =
    document.getElementById("telefono").value.trim();

  const correo =
    document.getElementById("correo").value.trim();

  const password =
    document.getElementById("password").value.trim();


  try {

    const user =
      auth.currentUser;


    const credential =
      EmailAuthProvider.credential(
        user.email,
        password
      );


    await reauthenticateWithCredential(
      user,
      credential
    );


    // ✅ CAMBIO DE CORREO CORRECTO

    if (correo !== user.email) {

      await verifyBeforeUpdateEmail(
        user,
        correo
      );

      mostrarModal(
        "Revisa el nuevo correo para confirmar"
      );

      return;

    }


    await updateDoc(
      doc(db,"usuarios",userUID),
      {
        nombre,
        monto,
        telefono,
        correo
      }
    );


    mostrarModal(
      "Datos actualizados"
    );

  }
  catch (e) {

    mostrarModal(
      e.message
    );

  }

};



/* MODAL */

window.mostrarModal =
(mensaje) => {

  document
  .getElementById("modal-message")
  .textContent = mensaje;

  document
  .getElementById("modal")
  .style.display = "flex";

  setTimeout(
    cerrarModal,
    3000
  );

};


window.cerrarModal = () => {

  document
  .getElementById("modal")
  .style.display = "none";

};



/* UID */

window.toggleVisibility =
(id, iconId) => {

  const span =
    document.getElementById(id);

  const icon =
    document.getElementById(iconId);

  if (span.dataset.hidden === "true") {

    span.textContent =
      span.dataset.original;

    span.dataset.hidden =
      "false";

    icon.classList.replace(
      "fa-eye-slash",
      "fa-eye"
    );

  }
  else {

    span.textContent =
      "••••••••";

    span.dataset.hidden =
      "true";

    icon.classList.replace(
      "fa-eye",
      "fa-eye-slash"
    );

  }

};



/* INPUT OJO */

window.toggleVisibilityInput =
(id, iconId) => {

  const input =
    document.getElementById(id);

  const icon =
    document.getElementById(iconId);

  if (input.type === "text") {

    input.type = "password";

    icon.classList.replace(
      "fa-eye",
      "fa-eye-slash"
    );

  }
  else {

    input.type = "text";

    icon.classList.replace(
      "fa-eye-slash",
      "fa-eye"
    );

  }

};