if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}

const resultElement =
  document.getElementById("result");

const fileInput =
  document.getElementById("file-input");

const btnSubir =
  document.getElementById("btnSubir");

const btnCerrar =
  document.getElementById("btnCerrar");

let html5QrCode;
let isCameraRunning = false;


/* BOTÓN CERRAR */

btnCerrar.addEventListener("click", () => {
  history.back();
});


/* BOTÓN SUBIR IMAGEN */

btnSubir.addEventListener("click", () => {
  fileInput.click();
});


/* INICIAR CÁMARA */

async function startCamera() {

  try {

    if (isCameraRunning) return;

    if (!html5QrCode) {
      html5QrCode =
        new Html5Qrcode("reader");
    }

    await html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      qrCodeMessage =>
        handleQRCode(qrCodeMessage)
    );

    isCameraRunning = true;

  } catch (err) {

    console.error(
      "Error cámara:",
      err
    );

  }

}


/* DETENER CÁMARA */

async function stopCamera() {

  try {

    if (
      html5QrCode &&
      isCameraRunning
    ) {

      await html5QrCode.stop();

      isCameraRunning = false;

    }

  } catch {}

}


/* SUBIR IMAGEN */

fileInput.addEventListener(
"change",
async e => {

  const file =
    e.target.files[0];

  if (!file) return;

  try {

    if (!html5QrCode) {
      html5QrCode =
        new Html5Qrcode("reader");
    }

    await stopCamera();

    const qrCodeMessage =
      await html5QrCode.scanFile(
        file,
        false
      );

    handleQRCode(
      qrCodeMessage
    );

    await startCamera();

  }

  catch (err) {

    alert(
      "No se detectó ningún QR en la imagen."
    );

    await startCamera();

  }

});


/* MANEJAR QR */

async function handleQRCode(
  qrCodeMessage
) {

  navigator.vibrate?.(200);

  await stopCamera();


  let qrLista = [];

  try {

    qrLista =
      JSON.parse(
        localStorage.getItem(
          "qrLista"
        )
      ) || [];

  }

  catch {

    qrLista = [];

  }


  const codigo =
    String(qrCodeMessage);


  const encontrado =
    qrLista.find(
      item =>
        item.codigo === codigo
    );


  if (encontrado) {

    const nombreEncoded =
      encodeURIComponent(
        encontrado.nombre
      );

    const destinoEncoded =
      encodeURIComponent(
        encontrado.destino || ""
      );

    window.location.href =
      `envioqr.html?nombre=${nombreEncoded}&destino=${destinoEncoded}`;

  }

  else {

    alert(
      "Este código no está en tu lista."
    );

    await startCamera();

  }

}


/* CERRAR CÁMARA AL SALIR */

window.addEventListener(
  "beforeunload",
  stopCamera
);


/* INICIAR */

startCamera();