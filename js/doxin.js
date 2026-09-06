document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("btnEnviar");

  if (btn) {
    btn.addEventListener("click", enviar);
  }

});

function enviar() {

  const id = document.getElementById("id").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const dias = document.getElementById("dias").value.trim();
  const metodo = document.getElementById("metodo").value;
  const mensajeExtra = document.getElementById("mensaje").value.trim();
  const error = document.getElementById("error");

  if (!id || !usuario || !dias || !metodo) {
    error.innerText = "⚠️ Debes completar todos los campos obligatorios";
    return;
  }

  if (dias <= 0) {
    error.innerText = "⚠️ Los días deben ser mayor a 0";
    return;
  }

  error.innerText = "";

  const whatsapp = "51922561959"; // Cambia tu número aquí

  let texto =
`Hola, deseo solicitar acceso:

🆔 ID: ${id}
👤 Usuario: ${usuario}
📅 Días solicitados: ${dias}
💳 Método de pago: ${metodo}`;

  if (mensajeExtra) {
    texto += `\n\n📝 Mensaje:\n${mensajeExtra}`;
  }

  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank");
}