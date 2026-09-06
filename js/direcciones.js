document.addEventListener("DOMContentLoaded", () => {

  const backBtn = document.getElementById("backBtn");
  const newAddressBtn = document.getElementById("newAddressBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "inicio.html";
    });
  }

  if (newAddressBtn) {
    newAddressBtn.addEventListener("click", () => {
      alert("Aquí iría la pantalla para agregar nueva dirección");
      // window.location.href = "nueva-direccion.html";
    });
  }

});