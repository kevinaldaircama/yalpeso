if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
let lista = [];

// Cargar datos guardados
window.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("qrLista");
  if (data) lista = JSON.parse(data);
});

// Auto leer QR cuando se sube imagen
document.getElementById("fotoQR").addEventListener("change", function(e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function(evento) {
    const img = new Image();

    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        document.getElementById("codigoQR").value = qrCode.data;
        alert("✅ QR detectado automáticamente.");
      } else {
        alert("⚠️ No se pudo leer el QR. Intenta con una imagen más clara.");
      }
    };

    img.src = evento.target.result;
  };

  lector.readAsDataURL(archivo);
});

// Guardar QR
document.getElementById("btnGuardar").addEventListener("click", guardarQR);

function guardarQR() {
  const codigo = document.getElementById("codigoQR").value.trim();
  const nombre = document.getElementById("nombreQR").value.trim();
  const destino = document.getElementById("destinoQR").value.trim();
  const archivo = document.getElementById("fotoQR").files[0];

  if (!codigo || !nombre || !archivo) {
    alert("⚠️ Completa todos los campos y sube una imagen.");
    return;
  }

  const lector = new FileReader();

  lector.onload = function(e) {
    const imagenBase64 = e.target.result;

    const qr = {
      id: Date.now(),
      codigo,
      nombre,
      destino,
      imagen: imagenBase64
    };

    lista.unshift(qr);
    localStorage.setItem("qrLista", JSON.stringify(lista));

    alert("✅ QR guardado correctamente.");
    limpiarCampos();
  };

  lector.readAsDataURL(archivo);
}

function limpiarCampos() {
  document.getElementById("codigoQR").value = "";
  document.getElementById("nombreQR").value = "";
  document.getElementById("destinoQR").value = "";
  document.getElementById("fotoQR").value = "";
}
