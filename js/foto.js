if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);

  document.getElementById("empresa").textContent = params.get("empresa") || "—";
  document.getElementById("servicio").textContent = params.get("servicio") || "—";
  document.getElementById("codigo").textContent = params.get("codigo") || "—";
  document.getElementById("titular").textContent = params.get("titular") || "—";
  document.getElementById("monto").textContent = params.get("monto") || "0.00";

  const ahora = new Date();
  const opcionesFecha = { day:"2-digit", month:"short", year:"numeric" };
  document.getElementById("fecha").textContent =
    ahora.toLocaleDateString("es-PE", opcionesFecha).replace(".", "");

  let horas = ahora.getHours();
  let minutos = ahora.getMinutes().toString().padStart(2,"0");
  let sufijo = horas >= 12 ? "p. m." : "a. m.";

  if(horas > 12) horas -= 12;
  if(horas === 0) horas = 12;

  document.getElementById("hora").textContent =
    `${horas}:${minutos} ${sufijo}`;

  document.getElementById("operacion").textContent =
    Math.floor(10000000 + Math.random() * 90000000);

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }, 500);

  const shareBtn = document.getElementById("shareBtn");

  shareBtn.addEventListener("click", async () => {
    const div = document.getElementById("comprobanteCompleto");

    html2canvas(div).then(async (canvas) => {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "comprobante.png", { type: "image/png" });

        if(navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Comprobante de pago"
            });
          } catch(e) {
            console.log("Compartir cancelado o falló");
          }
        } else {
          alert("Tu navegador no soporta compartir imágenes.");
        }
      });
    });
  });

  const volverBtn = document.getElementById("volverBtn");
  const banner = document.getElementById("bannerServicio");

  if(volverBtn)
    volverBtn.addEventListener("click", () => {
      window.location.href = "home";
    });

  if(banner)
    banner.addEventListener("click", () => {
      window.location.href = "home";
    });

});
