if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}


/* VARIABLES */

let db;
let app;

let contactosGlobal = {};

const contactList =
  document.querySelector(".contact-list");

const buscador =
  document.getElementById("buscador");


/* INIT FIREBASE */

const cfg = window.firebaseConfig;

firebase.initializeApp(cfg);

db = firebase.database();


/* =========================
   CARGAR CONTACTOS
========================= */

function cargarContactos(){

  db.ref("contactos")
  .once("value")
  .then(snapshot => {

    contactosGlobal =
      snapshot.val() || {};

    renderizarContactos(
      contactosGlobal
    );

  });


  db.ref("contactos")
  .on("child_changed", () => {

    db.ref("contactos")
    .once("value")
    .then(snapshot => {

      contactosGlobal =
        snapshot.val() || {};

      renderizarContactos(
        contactosGlobal
      );

    });

  });

}


/* =========================
   RENDER
========================= */

function renderizarContactos(datos){

  const fragment =
    document.createDocumentFragment();

  contactList.innerHTML = "";


  if(
    !datos ||
    Object.keys(datos).length === 0
  ){

    contactList.innerHTML =
    `<div class="empty">
      No se encontraron contactos
    </div>`;

    return;

  }


  Object.entries(datos)
  .forEach(([apodo, contacto]) => {

    const nombre =
      contacto.nombre?.trim();

    const numero =
      contacto.numero?.trim();

    if(!numero) return;


    let mostrarNombre =
      (!apodo.startsWith("sin_apodo_")
        && apodo !== nombre)
      ? apodo
      : nombre || "Sin nombre";


    const div =
      document.createElement("div");

    div.className =
      "contact";

    div.onclick = () => {

      location.href =
        "envio.html?apodo=" +
        encodeURIComponent(apodo);

    };


    div.innerHTML = `
      <div class="contact-name">
        ${mostrarNombre}
      </div>

      <div class="contact-number">
        ${numero}
      </div>
    `;


    fragment.appendChild(div);

  });


  contactList.appendChild(fragment);

}


/* =========================
   BUSCADOR
========================= */

buscador.addEventListener(
"input",
()=>{

  const texto =
    buscador.value
    .toLowerCase()
    .trim();


  if(!texto){

    renderizarContactos(
      contactosGlobal
    );

    return;

  }


  const filtrados = {};


  Object.entries(contactosGlobal)
  .forEach(([apodo, contacto]) => {

    const nombre =
      (contacto.nombre || "")
      .toLowerCase();

    const numero =
      (contacto.numero || "")
      .toLowerCase();

    const alias =
      apodo.toLowerCase();


    if(
      nombre.includes(texto) ||
      numero.includes(texto) ||
      alias.includes(texto)
    ){
      filtrados[apodo] =
        contacto;
    }

  });


  renderizarContactos(
    filtrados
  );

});


/* INICIAR */

cargarContactos();