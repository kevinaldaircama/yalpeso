const cfg = window.firebaseConfig;
firebase.initializeApp(cfg);

const auth = firebase.auth();
const db = firebase.firestore();

let clave = "";
let paso = 1;
let primeraClave = "";
let verificarIntervalo = null;

/* PUNTOS */
function actualizarPuntos(){
  const puntos = document.querySelectorAll(".punto");
  puntos.forEach((p,i)=>{
    p.classList.toggle("activo", i < clave.length);
  });
}

/* MODAL FLEXIBLE */
function mostrarModal(mensaje, opciones = []) {
  const modal = document.getElementById("modalAlert");
  const msg = document.getElementById("modalMensaje");
  const botones = document.getElementById("modalBotones");

  msg.innerText = mensaje;
  botones.innerHTML = "";

  opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.innerText = op.text;
    btn.onclick = () => {
      if(op.callback) op.callback();
      modal.style.display = "none";
    };
    botones.appendChild(btn);
  });

  modal.style.display = "flex";
}

/* AGREGAR */
function agregar(num){
  if(clave.length >= 6) return;

  clave += num;
  actualizarPuntos();

  if(clave.length === 6){

    setTimeout(async ()=>{

      if(paso === 1){
        primeraClave = clave;
        clave = "";
        paso = 2;

        actualizarPuntos();
        document.querySelector(".ingresa").innerText = "Confirma tu clave";
        return;
      }

      if(paso === 2){

        if(clave !== primeraClave){
          mostrarModal("Las claves no coinciden ❌");
          clave = "";
          primeraClave = "";
          paso = 1;

          actualizarPuntos();
          document.querySelector(".ingresa").innerText = "Ingresa tu clave Yape";
          return;
        }

        const data = JSON.parse(localStorage.getItem("registro_temp"));

        if(!data){
          mostrarModal("Error: datos perdidos");
          return;
        }

        try{
          const res = await auth.createUserWithEmailAndPassword(
            data.correo,
            data.clave
          );

          const user = res.user;
          await user.sendEmailVerification();

          await db.collection("usuarios")
          .doc(user.uid)
          .set({
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            monto: data.monto,
            pin: clave,
            verificado: false,
            fecha: new Date()
          });

          localStorage.removeItem("registro_temp");

          // Modal informativo largo sin botón
          mostrarModal(
            "Estimado usuario, su cuenta está a punto de crearse. Para finalizar, debe verificar su correo electrónico. Revise la bandeja de entrada o spam y haga clic en el enlace de verificación.",
            []
          );

          verificarCorreo();

        }catch(e){
          mostrarModal("Error: " + e.message);
        }

      }

    },200);
  }
}

/* VERIFICAR CORREO */
function verificarCorreo(){
  verificarIntervalo = setInterval(async ()=>{

    const user = auth.currentUser;
    if(user){
      await user.reload();

      if(user.emailVerified){
        await db.collection("usuarios")
        .doc(user.uid)
        .update({ verificado: true });

        clearInterval(verificarIntervalo);

        // Modal con botón "Iniciar sesión"
        mostrarModal(
          "¡Cuenta verificada correctamente! ✅",
          [
            { text: "Iniciar sesión", callback: () => { window.location.href = "login"; } }
          ]
        );
      }
    }

  },5000);
}

/* BORRAR */
function borrar(){
  clave = clave.slice(0,-1);
  actualizarPuntos();
}
