if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
const options = document.querySelectorAll('.option');
const continueBtn = document.getElementById('continueBtn');
const modal = document.getElementById('modal');

let selectedPackage = null;
let selectedPrice = null;

// Seleccionar opción
options.forEach(opt=>{
  opt.addEventListener('click',()=>{
    options.forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
    selectedPackage = opt.dataset.package;
    selectedPrice = opt.dataset.price;
    continueBtn.classList.add('enabled');
    continueBtn.disabled = false;
  });
});

// Abrir modal
continueBtn.addEventListener('click',()=>{
  if(!selectedPackage) return;
  modal.classList.add('active');
  document.getElementById('amount').value = selectedPrice;
  document.getElementById('package').value = selectedPackage;
});

// Cerrar modal
document.getElementById('closeModal').addEventListener('click',()=>{
  modal.classList.remove('active');
});

// Pagar
document.getElementById('payBtn').addEventListener('click',()=>{
  const id = document.getElementById('playerId').value.trim();
  const user = document.getElementById('userName').value.trim();

  if(!id || !user){
    alert('Por favor completa todos los campos.');
    return;
  }

  const url = `conprobante free.html?username=${encodeURIComponent(user)}&id=${encodeURIComponent(id)}&monto=${selectedPrice}&paquete=${encodeURIComponent(selectedPackage)}`;
  window.location.href = url;
});
