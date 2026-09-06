if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";


let app;
let auth;
let db;

let userUID = null;
let currentPin = null;


/* ===== INIT FIREBASE ===== */

const cfg = window.firebaseConfig;

app = initializeApp(cfg);

auth = getAuth(app);

db = getFirestore(app);


startApp();


function startApp(){

const form =
document.getElementById("pinForm");

const message =
document.getElementById("message");


// usuario

onAuthStateChanged(
auth,
async (user)=>{

  if(user){

    userUID = user.uid;

    const docRef =
    doc(
      db,
      "usuarios",
      userUID
    );

    const docSnap =
    await getDoc(docRef);

    if(docSnap.exists()){

      currentPin =
      docSnap.data().pin;

    }

  }
  else{

    message.textContent =
    "Debes iniciar sesión";

  }

});


// submit

form.addEventListener(
"submit",
async (event)=>{

event.preventDefault();

const oldPin =
document.getElementById("oldPin")
.value.trim();

const newPin =
document.getElementById("newPin")
.value.trim();

const confirmPin =
document.getElementById("confirmPin")
.value.trim();


// validar

if(oldPin !== currentPin){

showError(
"PIN actual incorrecto"
);

return;

}


if(
newPin.length < 4 ||
newPin.length > 6
){

showError(
"PIN debe tener 4-6 dígitos"
);

return;

}


if(newPin === oldPin){

showError(
"No puede ser igual"
);

return;

}


if(newPin !== confirmPin){

showError(
"No coincide"
);

return;

}


if(/^(\\d)\\1+$/.test(newPin)){

showError(
"No todos iguales"
);

return;

}


// guardar

try{

await updateDoc(

doc(
  db,
  "usuarios",
  userUID
),

{ pin:newPin }

);

location.href =
"exito.html";

}
catch(e){

showError(
"Error: " + e.message
);

}

});


function showError(text){

message.textContent =
text;

message.className =
"error";

}

}