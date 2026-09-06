if (!localStorage.getItem("sessionToken")) {
  location.href = "index";
}
document.addEventListener("DOMContentLoaded", () => {

  const seleccion = localStorage.getItem('seleccionCompra');
  const detalleCompra = document.getElementById('detalleCompra');
  const precio = document.getElementById('precio');
  const total = document.getElementById('total');
  const btnYapear = document.getElementById('btnYapear');

  if (seleccion) {
    const partes = seleccion.split('S/');
    detalleCompra.textContent = 'Free Fire - ' + partes[0].trim();
    const precioSel = 'S/ ' + partes[1].trim();
    precio.textContent = precioSel;
    total.textContent = precioSel;
  } else {
    detalleCompra.textContent = 'Free Fire - 100 Diamantes + 10% de Bonus';
    precio.textContent = 'S/ 3.50';
    total.textContent = 'S/ 3.50';
  }

  if (btnYapear) {
    btnYapear.addEventListener('click', () => {
      window.location.href = "exitosa.html";
    });
  }

});
