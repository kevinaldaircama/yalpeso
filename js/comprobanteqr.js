// =====================
// PARAMETROS
// =====================
const params = new URLSearchParams(window.location.search);
const nombre = decodeURIComponent(params.get("nombre") || "Desconocido");
const monto = decodeURIComponent(params.get("monto") || "0");
const destino = decodeURIComponent(params.get("destino") || "Sin destino");

document.getElementById("nombre").textContent = nombre;
document.getElementById("monto").textContent = `S/${monto}`;
document.getElementById("destino").textContent = destino;

// =====================
// FECHA Y HORA
// =====================
const now = new Date();
document.getElementById("fecha").textContent =
  now.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });

document.getElementById("hora").textContent =
  now.toLocaleTimeString("es-PE", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();

// =====================
// OPERACION
// =====================
const numeroOperacion = Math.floor(4000000 + Math.random() * 1000000);
document.getElementById("operacion").textContent =
  numeroOperacion.toString().padStart(8, "0");

// =====================
// BANNER ALEATORIO
// =====================
const banners = ["imagen/1.jpg","imagen/2.jpg","imagen/3.jpg","imagen/4.jpg"];
const bannerEl = document.querySelector(".banner img");
if (bannerEl) {
  const img = banners[Math.floor(Math.random() * banners.length)];
  bannerEl.src = img;
}

// =====================
// FUNCION COMPARTIR COMPLETA
// =====================
async function compartir() {
  const comprobante = document.getElementById("comprobante");

  if (!comprobante) {
    alert("No se encontró comprobante");
    return;
  }

  try {
    // Capturar todo el contenedor con alta resolución
    const canvas = await html2canvas(comprobante, {
      scale: 3,           // Más nitidez
      useCORS: true,       // Permite imágenes externas
      scrollY: -window.scrollY,  // Asegura captura completa
      backgroundColor: "#650D89" // Color de fondo si quieres que incluya el morado
    });

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    const file = new File([blob], "comprobante.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      // Compartir directamente en móviles
      await navigator.share({
        title: "Comprobante",
        text: "Comprobante de pago",
        files: [file]
      });
    } else {
      // Descargar automáticamente si no soporta compartir
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "comprobante.png";
      link.click();
    }
  } catch (err) {
    console.error(err);
    alert("Error al generar imagen");
  }
}

// Conectar botón compartir
const btnCompartir = document.getElementById("btnCompartir");
if (btnCompartir) btnCompartir.addEventListener("click", compartir);
