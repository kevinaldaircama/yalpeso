import {
  initializeApp
} from
"https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  get,
  update
} from
"https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import {
  getAuth
} from
"https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


let db;
let auth;
let app;


/* ===== INIT ===== */

const cfg = window.firebaseConfig;

app = initializeApp(cfg);

db = getDatabase(app);

auth = getAuth(app);

startApp();



function startApp(){


const msg =
  document.getElementById("msg");

const tokenInput =
  document.getElementById("token");

const loginBtn =
  document.getElementById("loginBtn");

const maintenanceScreen =
  document.getElementById(
    "maintenanceScreen"
  );


/* ===== MANTENIMIENTO ===== */

const maintenanceRef =
  ref(
    db,
    "config/maintenance/enabled"
  );

onValue(
  maintenanceRef,
  snap=>{

  const enabled =
    snap.val() === true;

  maintenanceScreen
  .classList.toggle(
    "active",
    enabled
  );

  document.body.style.overflow =
    enabled
    ? "hidden"
    : "";

});


/* ===== LOGIN ===== */

async function checkToken(){

  const token =
    tokenInput.value.trim();

  if(!token){

    showMsg(
      "Introduce un token",
      "error"
    );

    return;

  }


  loginBtn.disabled = true;

  loginBtn.textContent =
    "Verificando...";


  try{

    const tokenRef =
      ref(
        db,
        "tokens/" + token
      );

    const snap =
      await get(tokenRef);


    if(!snap.exists()){

      showMsg(
        "Token inválido",
        "error"
      );

      resetBtn();

      return;

    }


    const data =
      snap.val();


    if(data.used){

      showMsg(
        "Token ya usado",
        "error"
      );

      resetBtn();

      return;

    }


    await update(
      tokenRef,
      { used:true }
    );


    localStorage.setItem(
      "sessionToken",
      token
    );


    showMsg(
      "Bienvenido " +
      data.userName,
      "success"
    );


    setTimeout(
      ()=>location.href="login",
      1200
    );

  }
  catch(e){

    console.error(e);

    showMsg(
      "Error al verificar",
      "error"
    );

    resetBtn();

  }

}


function showMsg(text,type){

  msg.textContent = text;

  msg.style.color =
    type==="success"
    ? "var(--success)"
    : "var(--error)";

}


function resetBtn(){

  loginBtn.disabled=false;

  loginBtn.textContent =
    "Continuar";

}


loginBtn.addEventListener(
  "click",
  checkToken
);


/* ===== SESION ===== */

window.addEventListener(
"load",
()=>{

  if(
    localStorage.getItem(
      "sessionToken"
    )
  ){
    location.href="login";
  }

});

}
