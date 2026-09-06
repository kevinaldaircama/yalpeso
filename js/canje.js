if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
const opciones = document.querySelectorAll('.option');
const boton = document.getElementById('btnContinuar');
let seleccion = "";

opciones.forEach(op => {
  op.addEventListener('click', () => {
    opciones.forEach(o => o.classList.remove('active'));
    op.classList.add('active');
    op.querySelector('input').checked = true;
    seleccion = op.innerText.trim();
    boton.classList.add('enabled');
    boton.disabled = false;
  });
});

boton.addEventListener('click', () => {
  if (!boton.disabled) {
    localStorage.setItem('seleccionCompra', seleccion);
    window.location.href = 'con'; // Cambiar a la página de confirmación
  }
});
