if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}


/* VARIABLES */

let auth;
let db;

let modal;
let modalContent;

let intentosFallidos = 0;
let bloqueoLogin = false;


/* INIT FIREBASE */

const cfg = window.firebaseConfig;

firebase.initializeApp(cfg);

auth = firebase.auth();
db = firebase.firestore();


/* ELEMENTOS */

modal = document.getElementById("modal");
modalContent = document.getElementById("modal-content");


/* ID DISPOSITIVO */

function generarID(){
  return 'dev-' +
    Math.random().toString(36).substr(2,9)
    + Date.now();
}

let dispositivoID =
  localStorage.getItem("deviceID");

if(!dispositivoID){

  dispositivoID = generarID();

  localStorage.setItem(
    "deviceID",
    dispositivoID
  );

}


/* LOGIN */

async function iniciarSesion(){

  if(bloqueoLogin){
    alert("Demasiados intentos");
    return;
  }

  const correo =
    document.getElementById('correo').value.trim();

  const clave =
    document.getElementById('clave').value.trim();

  if (!correo || !clave) {
    alert("Completa todo");
    return;
  }

  modal.style.display = "flex";
  modalContent.innerHTML = "Verificando...";

  try {

    const credenciales =
      await auth.signInWithEmailAndPassword(
        correo,
        clave
      );

    const user = credenciales.user;

    await user.reload();

    intentosFallidos = 0;

    if (!user.emailVerified) {

      modalContent.innerHTML =
        "Correo no verificado";

      verificarCorreoAutomatico();

      return;
    }

    loginUsuario(user);

  }
  catch (error) {

    intentosFallidos++;

    if(intentosFallidos >= 5){

      bloqueoLogin = true;

      modalContent.innerHTML =
        "Bloqueado 30s";

      setTimeout(()=>{
        bloqueoLogin = false;
        intentosFallidos = 0;
      },30000);

      return;
    }

    modalContent.innerHTML =
      error.message;

  }

}


/* VERIFICAR CORREO */

function verificarCorreoAutomatico(){

  const intervalo =
    setInterval(async()=>{

    const user =
      auth.currentUser;

    if(user){

      await user.reload();

      if(user.emailVerified){

        clearInterval(intervalo);

        loginUsuario(user);

      }

    }

  },4000);

}


/* LOGIN USUARIO */

async function loginUsuario(user){

  const uid = user.uid;

  const doc =
    await db.collection("usuarios")
    .doc(uid)
    .get();

  if(doc.exists){

    const usuario =
      doc.data();

    localStorage.setItem(
      "nombreUsuario",
      usuario.nombre
    );

    localStorage.setItem(
      "saldoUsuario",
      usuario.monto
    );

    db.collection("usuarios")
    .doc(uid)
    .update({
      ultimoDispositivo:
        dispositivoID,
      ultimoLogin:
        new Date()
    });

    modalContent.innerHTML =
      "Correcto";

    setTimeout(()=>{
      location.href="login";
    },1200);

  }

}


/* RESET PASSWORD */

function recuperarPassword(){

  const correo =
    document.getElementById('correo')
    .value.trim();

  if (!correo) {
    alert("Escribe correo");
    return;
  }

  auth.sendPasswordResetEmail(correo)
    .then(()=>{
      alert("Correo enviado");
    })
    .catch(error=>{
      alert(error.message);
    });

}


/* VOLVER */

function volver(){
  location.href = "/";
}
