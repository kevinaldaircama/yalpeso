if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
document.getElementById("continuarBtn").addEventListener("click", enviar);

function enviar(){

const nombre=document.getElementById("nombre").value.trim();
const telefono=document.getElementById("telefono").value.trim();
const monto=document.getElementById("monto").value.trim();
const destino=document.getElementById("destino").value.trim();

if(!nombre || !telefono || !monto || !destino){
alert("Por favor completa todos los campos");
return;
}

const url =
"comprobante1.html?" +
"nombre=" + encodeURIComponent(nombre) +
"&telefono=" + encodeURIComponent(telefono) +
"&monto=" + encodeURIComponent(monto) +
"&destino=" + encodeURIComponent(destino);

window.location.href = url;

}
