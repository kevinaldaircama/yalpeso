if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
const modal = document.getElementById("modal");

// Mostrar automáticamente al entrar
window.onload = () => {
  setTimeout(() => {
    modal.classList.add("active");
  }, 500);
};

// Cerrar modal
function cerrarModal() {
  modal.classList.remove("active");
}

// Abrir soporte
function abrirSoporte() {
  window.open('https://wa.link/rbvrgn', '_blank');
}
