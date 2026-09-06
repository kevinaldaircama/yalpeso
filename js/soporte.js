// abrir selector al hacer click
document.querySelector(".file").addEventListener("click", ()=>{
  document.getElementById("imagen").click();
});

function previewImage(event){
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(){
    document.getElementById("preview").innerHTML =
      `<img src="${reader.result}">`;
  }

  if(file){
    reader.readAsDataURL(file);
  }
}

function enviarWhatsApp(){

  const nombre = document.getElementById("nombre").value || "No especificado";
  const pagoId = document.getElementById("pagoId").value || "No disponible";
  const mensaje = document.getElementById("mensaje").value || "Sin mensaje";

  const texto = `
📩 *REPORTE DE PAGO*

👤 Nombre: ${nombre}
🧾 ID: ${pagoId}

📝 Mensaje:
${mensaje}

Adjunto comprobante 📸
`;

  const telefono = "51994031672"; // 🔥 TU NÚMERO

  const url = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(texto);

  window.open(url, "_blank");
}
