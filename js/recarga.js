if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
document.getElementById("btnRecargar").addEventListener("click", function () {
  const tel = document.getElementById("telefono").value.trim();
  const ope = document.getElementById("operador").value;
  const mon = document.getElementById("monto").value.trim();
  const msg = document.getElementById("mensaje");

  if (!tel || !ope || !mon) {
    alert("Por favor complete todos los campos.");
    return;
  }

  msg.style.display = "block";
  msg.textContent = "Procesando datos...";

  setTimeout(() => {
    msg.textContent = "Generando voucher...";

    setTimeout(() => {
      const url = "recargascomprobante.html?tel=" + encodeURIComponent(tel) +
                  "&ope=" + encodeURIComponent(ope) +
                  "&mon=" + encodeURIComponent(mon);
      window.location.href = url;
    }, 2000);

  }, 2000);
});
