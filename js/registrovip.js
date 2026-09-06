/* -------------------- VARIABLES GLOBALES -------------------- */
let auth;
let db;
let modal;
let modalContent;


/* -------------------- INICIALIZAR FIREBASE -------------------- */

const cfg = window.firebaseConfig;

firebase.initializeApp(cfg);

auth = firebase.auth();
db = firebase.firestore();

startApp();


/* -------------------- INICIALIZAR UI -------------------- */

function startApp() {

  modal = document.getElementById("modal");
  modalContent = document.getElementById("modal-content");

  window.correo = document.getElementById("correo");
  window.clave = document.getElementById("clave");
  window.clave2 = document.getElementById("clave2");
  window.usuario = document.getElementById("usuario");
  window.telefono = document.getElementById("telefono");
  window.monto = document.getElementById("monto");

}


/* -------------------- FUNCIONES UI -------------------- */

window.nextStep = function(step){

  document.getElementById("step"+step).classList.remove("active");
  document.getElementById("step"+(step+1)).classList.add("active");

}

window.abrirTerminos = function(){
  document.getElementById("modalTerminos").style.display="flex";
}

window.cerrarTerminos = function(){
  document.getElementById("modalTerminos").style.display="none";
}

window.cerrarSiFondo = function(e){
  if(e.target.id==="modalTerminos"){
    cerrarTerminos();
  }
}


/* -------------------- REGISTRAR USUARIO -------------------- */

window.registrarUsuario = async function(){

  const email = correo.value.trim().toLowerCase();

  const dominiosPermitidos = ["gmail.com","hotmail.com","outlook.com"];

  const dominiosTemporales = [
    "tempmail.com","10minutemail.com","guerrillamail.com",
    "mailinator.com","yopmail.com","trashmail.com",
    "temp-mail.org","fakeinbox.com","getnada.com",
    "sharklasers.com","dispostable.com","maildrop.cc",
    "mintemail.com","throwawaymail.com","mailnesia.com"
  ];

  if(!email.includes("@")){
    alert("Correo inválido");
    return;
  }

  if(!usuario.value || !correo.value || !telefono.value || !monto.value){
    alert("Completa todos los campos");
    return;
  }

  const partes = email.split("@");
  const usuarioEmail = partes[0];
  const dominio = partes[1];

  const caracteresProhibidos = /[+#$&,:!*%^()=\/\\|?<>\[\]{}]/;

  if(caracteresProhibidos.test(usuarioEmail)){
    alert("No se permiten caracteres especiales");
    return;
  }

  if(dominiosTemporales.includes(dominio)){
    alert("No se permiten correos temporales");
    return;
  }

  if(!dominiosPermitidos.includes(dominio)){
    alert("Solo Gmail Hotmail Outlook");
    return;
  }

  if(clave.value !== clave2.value){
    alert("Las contraseñas no coinciden");
    return;
  }

  if(clave.value.length < 6){
    alert("Mínimo 6 caracteres");
    return;
  }

  modal.style.display = "flex";
  modalContent.innerHTML = "Validando...";

  try {

    // 🔍 VALIDAR DUPLICADOS
    const correoQuery = await db
      .collection("usuarios")
      .where("correo","==",email)
      .get();

    if(!correoQuery.empty){
      modalContent.innerHTML="Correo ya registrado";
      return;
    }

    const telefonoQuery = await db
      .collection("usuarios")
      .where("telefono","==",telefono.value)
      .get();

    if(!telefonoQuery.empty){
      modalContent.innerHTML="Telefono ya registrado";
      return;
    }

    // 🔥 GUARDAR DATOS TEMPORALES
    localStorage.setItem("registro_temp", JSON.stringify({
      nombre: usuario.value,
      correo: email,
      telefono: telefono.value,
      monto: monto.value,
      clave: clave.value
    }));

    modalContent.innerHTML = "Redirigiendo...";

    // 👉 IR A PIN
    setTimeout(()=>{
      window.location.href = "pin";
    },1000);

  } catch(e){
    modalContent.innerHTML = "Error: " + e.message;
  }

}


/* -------------------- LOGIN DETECTAR -------------------- */

auth.onAuthStateChanged(user=>{

  if(user){

    user.reload().then(()=>{

      if(user.emailVerified){

        db.collection("usuarios")
        .doc(user.uid)
        .update({
          verificado:true
        });

      }

    });

  }

});
