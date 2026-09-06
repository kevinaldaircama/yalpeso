import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const cfg = window.firebaseConfig;
const app = initializeApp(cfg);
const db = getDatabase(app);

startApp();

function startApp(){

  const btnLogin = document.getElementById("btnLogin");
  const loginUser = document.getElementById("loginUser");
  const loginPass = document.getElementById("loginPass");
  const loginStatus = document.getElementById("loginStatus");

  btnLogin.onclick = async () => {

    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();

    if(!user || !pass){
      loginStatus.style.display = "block";
      loginStatus.textContent = "Completa todos los campos";
      loginStatus.className = "error";
      return;
    }

    loginStatus.style.display = "block";
    loginStatus.textContent = "Verificando...";
    btnLogin.disabled = true;

    try {
      const snap = await get(ref(db, "admins"));

if (!snap.exists()) {
  loginStatus.textContent = "Usuario no existe";
  btnLogin.disabled = false;
  return;
}

let data = null;

Object.values(snap.val()).forEach(admin => {
  if (admin.email === user) {
    data = admin;
  }
});

if (!data) {
  loginStatus.textContent = "Usuario no existe";
  btnLogin.disabled = false;
  return;
}

      if(data.pass !== pass){
        loginStatus.textContent = "Contraseña incorrecta";
        btnLogin.disabled = false;
        return;
      }

      loginStatus.textContent = "Bienvenido " + data.name;

      localStorage.setItem("adminUser", data.user);
      localStorage.setItem("adminName", data.name);
      localStorage.setItem("adminRole", data.role);

      setTimeout(()=>{
        window.location.href = "token admin";
      },1000);

    } catch(e){
      loginStatus.textContent = "Error de conexión";
      btnLogin.disabled = false;
    }

  };

}
