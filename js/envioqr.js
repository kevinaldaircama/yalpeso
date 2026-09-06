if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
// Tomar parámetros de la URL
const params = new URLSearchParams(window.location.search);
const nombre = params.get("nombre");
const destino = params.get("destino");

if (nombre) document.getElementById("nombre").value = nombre;
if (destino) document.getElementById("subtexto").textContent = destino;

// Enviar datos al comprobante
function enviar() {
  const nombre = encodeURIComponent(document.getElementById("nombre").value);
  const destino = encodeURIComponent(document.getElementById("subtexto").textContent);
  const monto = encodeURIComponent(document.getElementById("monto").value);

  window.location.href = `comprobanteqr.html?nombre=${nombre}&monto=${monto}&destino=${destino}`;
}
