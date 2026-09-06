if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

/* -------------------- FIREBASE -------------------- */

const cfg = window.firebaseConfig;

firebase.initializeApp(cfg);
const db = firebase.database();

/* -------------------- VARIABLES -------------------- */

let contactosGlobal = {};

/* -------------------- START -------------------- */

startApp();

function startApp() {
  db.ref("contactos").on("value", snapshot => {
    contactosGlobal = snapshot.val() || {};
    renderLista(contactosGlobal);
  });
}

/* -------------------- MENSAJES -------------------- */

function mostrarMensaje(t) {
  document.getElementById("mensajeTexto").innerText = t;
  document.getElementById("modalMensaje").style.display = "flex";
}

function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

/* -------------------- DUPLICADOS -------------------- */

function existeDuplicado(nombre, numero, ignoreKey = null) {
  return Object.keys(contactosGlobal).some(key => {

    if (key === ignoreKey) return false;

    const c = contactosGlobal[key] || {};

    return (
      (c.nombre || "").toLowerCase() === nombre.toLowerCase() &&
      c.numero === numero
    );
  });
}

/* -------------------- GUARDAR -------------------- */

function guardarContacto() {

  const apodo =
    document.getElementById("apodo").value.trim() ||
    "sin_apodo_" + Date.now();

  const nombre =
    document.getElementById("nombre").value.trim();

  const numero =
    document.getElementById("numero").value.trim();

  if (!nombre || !numero) {
    mostrarMensaje("Completa nombre y número.");
    return;
  }

  if (existeDuplicado(nombre, numero)) {
    mostrarMensaje("Ya existe este contacto.");
    return;
  }

  db.ref("contactos/" + apodo).set({
    nombre,
    numero,
    destino: "Yape"
  });

}

/* -------------------- LISTA -------------------- */

function renderLista(data) {

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const filtro =
    (document.getElementById("buscador").value || "")
    .toLowerCase();

  Object.keys(data).forEach(key => {

    const c = data[key] || {};

    if (
      (c.nombre || "").toLowerCase().includes(filtro) ||
      (c.numero || "").includes(filtro)
    ) {

      lista.innerHTML += `
        <div class="card">
          <strong>${c.nombre}</strong><br>
          ${c.numero}<br>

          <button onclick="abrirEditar('${key}')">Editar</button>
          <button onclick="abrirEliminar('${key}')">Eliminar</button>
        </div>
      `;
    }
  });
}

/* -------------------- BUSCADOR -------------------- */

document.getElementById("buscador")
  .addEventListener("input", () => renderLista(contactosGlobal));

/* -------------------- EDITAR -------------------- */

function abrirEditar(key) {

  const c = contactosGlobal[key] || {};

  document.getElementById("editKey").value = key;
  document.getElementById("editNombre").value = c.nombre || "";
  document.getElementById("editNumero").value = c.numero || "";
  document.getElementById("editApodo").value = key;

  document.getElementById("modalEditar").style.display = "flex";
}

function guardarEdicion() {

  const oldKey = document.getElementById("editKey").value;

  const nuevoApodo =
    document.getElementById("editApodo").value.trim();

  const nombre =
    document.getElementById("editNombre").value.trim();

  const numero =
    document.getElementById("editNumero").value.trim();

  if (existeDuplicado(nombre, numero, oldKey)) {
    mostrarMensaje("Ya existe este contacto.");
    return;
  }

  db.ref("contactos/" + oldKey).remove().then(() => {

    db.ref("contactos/" + nuevoApodo).set({
      nombre,
      numero,
      destino: "Yape"
    });

  });

  cerrarModal("modalEditar");
}

/* -------------------- ELIMINAR -------------------- */

function abrirEliminar(key) {

  document.getElementById("deleteKey").value = key;
  document.getElementById("modalEliminar").style.display = "flex";
}

function confirmarEliminar() {

  const key =
    document.getElementById("deleteKey").value;

  db.ref("contactos/" + key).remove();

  cerrarModal("modalEliminar");
}

/* -------------------- EXPORTAR -------------------- */

function exportarJSON() {

  if (Object.keys(contactosGlobal).length === 0) {
    mostrarMensaje("No hay contactos.");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(contactosGlobal, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "contactos.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* -------------------- IMPORTAR -------------------- */

document.getElementById("importFile")
  .addEventListener("change", function (e) {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

      try {

        const data = JSON.parse(event.target.result);

        Object.keys(data).forEach(key => {

          const c = data[key];

          if (
            c.nombre &&
            c.numero &&
            !existeDuplicado(c.nombre, c.numero)
          ) {

            db.ref("contactos/" + key).set({
              nombre: c.nombre,
              numero: c.numero,
              destino: "Yape"
            });

          }

        });

        mostrarMensaje("Importado correctamente");

      } catch {
        mostrarMensaje("Archivo inválido");
      }

    };

    reader.readAsText(file);
  });
