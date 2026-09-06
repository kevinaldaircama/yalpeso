if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
// Obtener parámetros de la URL  
const params = new URLSearchParams(window.location.search);  
const tel = params.get("tel");  
const ope = params.get("ope");  
const mon = params.get("mon");  

// Insertar datos en el comprobante  
document.getElementById("monto").textContent = "S/ " + (mon || "0");  
document.getElementById("telefono").textContent = tel || "No definido";  
document.getElementById("operadora").textContent = ope || "No definido";  

// Fecha actual  
const fecha = new Date();  
const opcionesFecha = { day: '2-digit', month: 'short', year: 'numeric' };  
document.getElementById("fecha").textContent = fecha.toLocaleDateString('es-ES', opcionesFecha);  

// Hora actual  
const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };  
document.getElementById("hora").textContent = fecha.toLocaleTimeString('es-ES', opcionesHora);  

// Número de operación aleatorio (8 cifras)  
const nroOperacion = Math.floor(10000000 + Math.random() * 90000000);  
document.getElementById("operacion").textContent = nroOperacion;  

// Botón de cerrar  
document.querySelector(".close").addEventListener("click", () => {  
  window.location.href = "recargas";  
});  

// Botón de compartir (si está disponible en el navegador)  
document.querySelector(".share").addEventListener("click", async () => {  
  const data = {  
    title: "Comprobante de Recarga",  
    text: `Recargaste ${document.getElementById("monto").textContent} al número ${tel}`,  
    url: window.location.href  
  };  
  if (navigator.share) {  
    await navigator.share(data);  
  } else {  
    alert("Tu navegador no soporta compartir directamente.");  
  }  
});
