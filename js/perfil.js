import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Inicializar Firebase con configuración global
const cfg = window.firebaseConfig;
const app = initializeApp(cfg);
const auth = getAuth(app);

// 🔹 Verificar token local al cargar
if (!localStorage.getItem("sessionToken")) {
  location.href = "/"; // redirige al inicio si no hay sesión
  // ⚠️ No usar throw aquí, solo redirección
}

// 🔹 Modal
window.mostrarModal = () => document.getElementById("modal").classList.add("active");
window.cerrarModal = () => document.getElementById("modal").classList.remove("active");

// 🔹 Cerrar sesión
window.cerrarSesion = () => {
  localStorage.removeItem("sessionToken"); // borrar token local
  signOut(auth).then(() => location.href = "/"); // redirigir al inicio
};

// 🔹 Validar sesión Firebase activa
onAuthStateChanged(auth, user => {
  if (!user) {
    localStorage.removeItem("sessionToken");
    location.href = "/"; // redirigir al inicio si no hay usuario
  }
});