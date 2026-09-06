if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

/* SOLO FIX MONTO */
const inputMonto = document.getElementById("monto");  
const textoMonto = document.getElementById("monto-texto");  
  
inputMonto.addEventListener("input", () => {  
  textoMonto.textContent = inputMonto.value || "0";  
});  
  
/* TU SCRIPT ORIGINAL COMPLETO SIN CAMBIOS */

let auth;
let firestore;
let realtimeDB;
let modal;

const cfg = window.firebaseConfig;
firebase.initializeApp(cfg);

auth = firebase.auth();
firestore = firebase.firestore();
realtimeDB = firebase.database();

const urlParams = new URLSearchParams(window.location.search);
const apodo = urlParams.get("apodo");

let montoInput;
let mensaje;
let btnBancos;
let btnYapear;
let errorMonto;
let nombreLabel;
let numeroLabel;

modal = document.getElementById("modalSaldo");

iniciarSistema();

function iniciarSistema(){

  montoInput = document.getElementById('monto');
  mensaje = document.getElementById('mensaje');
  btnBancos = document.getElementById('btn-bancos');
  btnYapear = document.getElementById('btn-yapear');
  errorMonto = document.getElementById('errorMonto');
  nombreLabel = document.getElementById('nombre-label');
  numeroLabel = document.getElementById('numero-label');

  cargarContacto();
  eventosMonto();
  eventosBotones();
}

function cerrarModalSaldo(){ modal.style.display="none"; }
function mostrarModalSaldo(){ modal.style.display="block"; }

function capitalizar(t){
  return t.charAt(0).toUpperCase()+t.slice(1).toLowerCase();
}

function ocultarNombre(n){
  const p=n.trim().split(" ");
  if(p.length>=3)
    return capitalizar(p[0])+" "+capitalizar(p[2].substring(0,3))+"*";
  if(p.length===2)
    return capitalizar(p[0])+" "+capitalizar(p[1].substring(0,3))+"*";
  return capitalizar(n.substring(0,3))+"*";
}

function cargarContacto(){
  if(!apodo) return;

  realtimeDB.ref("contactos/"+apodo)
  .once("value")
  .then(s=>{
    if(!s.exists()) return;

    const d=s.val();
    nombreLabel.textContent = ocultarNombre(d.nombre||apodo);

    if(d.numero){
      numeroLabel.textContent="*** *** "+d.numero.toString().slice(-3);
    }
  });
}

function eventosMonto(){
  montoInput.addEventListener('focus',()=>{
    if(montoInput.value==="0") montoInput.value="";
  });

  montoInput.addEventListener('input',()=>{
    const v=parseFloat(montoInput.value);
    const ok=!isNaN(v)&&v>0;

    errorMonto.style.display=ok?"none":"block";
    btnBancos.disabled=!ok;
    btnYapear.disabled=!ok;
  });
}

function eventosBotones(){
  btnBancos.onclick=()=>location.href="envío";
  btnYapear.onclick=enviarYape;
}

function enviarYape(){

  const nombre=nombreLabel.textContent.trim();
  const monto=parseFloat(montoInput.value);
  const msg=mensaje.value.trim();
  const tel=numeroLabel.textContent.trim();

  if(!nombre||isNaN(monto)) return;

  auth.onAuthStateChanged(user=>{

    if(!user){ location.href="login.html"; return; }

    const ref=firestore.collection("usuarios").doc(user.uid);

    ref.get().then(doc=>{

      if(!doc.exists){ mostrarModalSaldo(); return; }

      let saldo=parseFloat(doc.data().monto);

      if(isNaN(saldo)||saldo<monto){
        mostrarModalSaldo(); return;
      }

      ref.update({monto:(saldo-monto).toFixed(2)})
      .then(()=>firestore.collection("movimientos").add({
        uid:user.uid,
        nombreDestino:nombre,
        monto:monto,
        mensaje:msg,
        fecha:firebase.firestore.Timestamp.now()
      }))
      .then(()=>{
        location.href=`comprobante?nombre=${encodeURIComponent(nombre)}&telefono=${encodeURIComponent(tel)}&monto=${monto}&estado=${encodeURIComponent(msg)}`;
      });

    });

  });

}
