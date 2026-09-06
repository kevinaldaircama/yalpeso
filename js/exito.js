if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
// Redirigir al inicio al hacer clic en el botón
document.getElementById('inicioBtn').addEventListener('click', () => {
    window.location.href = 'home'; // Cambia la ruta según tu proyecto
});
