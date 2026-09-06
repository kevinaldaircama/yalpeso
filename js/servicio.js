if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
document.getElementById("pagoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const empresa = document.getElementById("empresa").value;
  const servicio = document.getElementById("servicio").value;
  const codigo = document.getElementById("codigo").value;
  const titular = document.getElementById("titular").value;
  const monto = document.getElementById("monto").value;

  // Redirigir con parámetros
  window.location.href =
    `foto.html?empresa=${encodeURIComponent(empresa)}&` +
    `servicio=${encodeURIComponent(servicio)}&` +
    `codigo=${encodeURIComponent(codigo)}&` +
    `titular=${encodeURIComponent(titular)}&` +
    `monto=${encodeURIComponent(monto)}`;
});
