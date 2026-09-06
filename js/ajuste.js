if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Traer configuración
const cfg = window.firebaseConfig;

// Inicializar Firebase
const app = initializeApp(cfg);
const auth = getAuth(app);

// Verificar usuario
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Función para cerrar sesión
window.cerrarSesion = function() {
  signOut(auth).then(() => {
    alert("Sesión cerrada");
    window.location.href = "/";
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error);
  });
};