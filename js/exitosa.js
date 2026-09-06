if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
document.addEventListener("DOMContentLoaded", () => {

  // Fecha actual
  const fechaEl = document.getElementById("fecha");
  const ahora = new Date();
  const opciones = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };

  fechaEl.textContent =
    ahora.toLocaleString("es-PE", opciones).replace(".", "");

  // Código aleatorio
  const codeEl = document.getElementById("code");
  const codigo = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  codeEl.textContent = codigo;

  // Copiar código
  const copyBtn = document.getElementById("copyBtn");

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(codeEl.textContent.trim());
      copyBtn.textContent = "✅ Copiado";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copiar código";
      }, 2000);
    } catch {
      alert("No se pudo copiar automáticamente.");
    }
  });

  // Redirección
  const canjearBtn = document.getElementById("canjearBtn");

  canjearBtn.addEventListener("click", () => {
    window.location.href = "https://pagostore.garena.com";
  });

  // Autocompletar desde localStorage
  const seleccion = localStorage.getItem("seleccionCompra");

  if (seleccion) {
    const partes = seleccion.split("S/");
    const descripcion = partes[0].trim();
    const precio = partes[1].trim();

    document.getElementById("detalle").textContent =
      "Free Fire - " + descripcion;

    document.getElementById("monto").textContent = precio;
  } else {
    document.getElementById("detalle").textContent =
      "Free Fire - Paquete de diamantes";

    document.getElementById("monto").textContent = "0.00";
  }

});
