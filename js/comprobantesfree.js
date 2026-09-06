if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}


document.addEventListener("DOMContentLoaded", () => {

  const fecha = new Date();

  const opciones = {

    day: '2-digit',
    month: 'short',
    year: 'numeric',

    hour: '2-digit',
    minute: '2-digit',

    hour12: true

  };


  const fechaElemento =
    document.getElementById(
      'fechaHora'
    );


  if (fechaElemento) {

    fechaElemento.textContent =

      new Intl.DateTimeFormat(
        'es-ES',
        opciones
      )

      .format(fecha)

      .replace('.', '');

  }



  const params =
    new URLSearchParams(
      window.location.search
    );



  const username =
    document.getElementById(
      "username"
    );

  const playerId =
    document.getElementById(
      "playerId"
    );

  const monto =
    document.getElementById(
      "monto"
    );

  const paquete =
    document.getElementById(
      "paquete"
    );



  if (username)
    username.textContent =
      params.get("username") || "---";

  if (playerId)
    playerId.textContent =
      params.get("id") || "---";

  if (monto)
    monto.textContent =
      params.get("monto") || "0.00";

  if (paquete)
    paquete.textContent =
      params.get("paquete") || "Diamantes";



  const volverBtn =
    document.getElementById(
      "volverInicio"
    );


  if (volverBtn) {

    volverBtn.addEventListener(

      "click",

      () => {

        window.location.href = "/";

      }

    );

  }

});



// ✅ COMPARTIR

async function compartir() {

  const comprobante =
    document.getElementById(
      "comprobante"
    );


  if (!comprobante) {

    alert("No encontrado");

    return;

  }


  try {

    const canvas =
      await html2canvas(
        comprobante,
        {
          scale: 2,
          useCORS: true
        }
      );


    const blob =
      await new Promise(
        resolve =>
          canvas.toBlob(
            resolve,
            "image/png"
          )
      );


    const file =
      new File(
        [blob],
        "comprobante.png",
        {
          type: "image/png"
        }
      );



    if (

      navigator.canShare &&

      navigator.canShare({
        files: [file]
      })

    ) {

      await navigator.share({

        title: "Comprobante",

        text: "Compra exitosa",

        files: [file]

      });

    }

    else {

      const link =
        document.createElement("a");

      link.href =
        canvas.toDataURL(
          "image/png"
        );

      link.download =
        "comprobante.png";

      link.click();

    }

  }

  catch (e) {

    console.log(e);

    alert(
      "Error al compartir"
    );

  }

}