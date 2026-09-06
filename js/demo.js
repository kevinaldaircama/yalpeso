let tiempoRestante = 120;
let timerInterval;

// Cerrar bienvenida después de 1 minuto
setTimeout(() => {
    cerrarWelcome();
}, 60000);

function cerrarWelcome(){
    document.getElementById("welcomeModal").classList.add("hidden");
}

function iniciarTemporizador(){

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        tiempoRestante--;

        let minutos = Math.floor(tiempoRestante / 60);
        let segundos = tiempoRestante % 60;

        document.getElementById("contador").textContent =
            String(minutos).padStart(2,'0') +
            ":" +
            String(segundos).padStart(2,'0');

        if(tiempoRestante <= 0){

            clearInterval(timerInterval);

            document
            .getElementById("timeModal")
            .classList.remove("hidden");

            bloquearFormulario();
        }

    },1000);
}

function bloquearFormulario(){

    document
    .querySelectorAll("input, button")
    .forEach(elemento => {

        if(
            elemento.getAttribute("onclick") !==
            "verAnuncio()"
        ){
            elemento.disabled = true;
        }

    });

}

function desbloquearFormulario(){

    document
    .querySelectorAll("input, button")
    .forEach(elemento => {
        elemento.disabled = false;
    });

}
function verAnuncio(){

    const boton = document.querySelector("#timeModal button");

    boton.disabled = true;
    boton.textContent = "Abriendo anuncio...";

    // Espera 10 segundos antes de dar tiempo extra
    setTimeout(() => {

        tiempoRestante = 120;

        desbloquearFormulario();

        document
            .getElementById("timeModal")
            .classList.add("hidden");

        iniciarTemporizador();

        boton.disabled = false;
        boton.textContent =
            "Ver anuncio y obtener 2 minutos más";

        alert("Se agregaron 2 minutos adicionales.");

    }, 10000);

}
function generarYape(){

    if(tiempoRestante <= 0){
        return;
    }

    const nombre =
    document.getElementById("nombre")
    .value.trim();

    const telefono =
    document.getElementById("telefono")
    .value.trim();

    const monto =
    document.getElementById("monto")
    .value.trim();

    const mensaje =
    document.getElementById("mensaje");

    if(!nombre || !telefono || !monto){

        alert(
            "Por favor completa todos los campos."
        );

        return;
    }

    mensaje.style.display = "block";
    mensaje.textContent =
    "Procesando datos...";

    setTimeout(() => {

        mensaje.textContent =
        "Generando información...";

        setTimeout(() => {

            const url =
            `comprobante demo.html?nombre=${encodeURIComponent(nombre)}&telefono=${encodeURIComponent(telefono)}&monto=${encodeURIComponent(monto)}`;

            window.location.href = url;

        },2000);

    },2000);

}

iniciarTemporizador();
