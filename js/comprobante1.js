if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
const params = new URLSearchParams(window.location.search);

const nombre = decodeURIComponent(
  params.get("nombre") || "Sin nombre"
);

const telefono = decodeURIComponent(
  params.get("telefono") || "000000000"
);

const monto = decodeURIComponent(
  params.get("monto") || "0"
);

const destino = decodeURIComponent(
  params.get("destino") || "---"
);


document.getElementById("nombre").textContent = nombre;

const montoNum = parseFloat(monto);

document.getElementById("monto").textContent =
  montoNum % 1 === 0
    ? montoNum
    : montoNum.toFixed(2);

document.getElementById("telefono").textContent =
  `*** ***${telefono.slice(-3)}`;

document.getElementById("destino").textContent =
  destino;


const fechaObj = new Date();

document.getElementById("fecha").textContent =
  fechaObj.toLocaleDateString(
    "es-PE",
    {
      day:"2-digit",
      month:"short",
      year:"numeric"
    }
  );

document.getElementById("hora").textContent =
  fechaObj.toLocaleTimeString(
    "es-PE",
    {
      hour:"2-digit",
      minute:"2-digit",
      hour12:true
    }
  );


function lanzarConfeti(){

confetti({
particleCount:150,
spread:70,
origin:{y:0.6}
});

setTimeout(()=>{

confetti({
particleCount:100,
angle:60,
spread:55,
origin:{x:0}
});

confetti({
particleCount:100,
angle:120,
spread:55,
origin:{x:1}
});

},300);

}

lanzarConfeti();


document.getElementById("operacion").textContent =
Math.floor(
10000000 +
Math.random()*90000000
);


const promociones = [  
  "imagen/kevin2.jpg",  
  "imagen/kevin.jpg",  
  "imagen/kevin2.jpg",  
  "imagen/IMG-20260125-WA0045.jpg",  
  "imagen/IMG-20260118-WA0031.jpg"
];

document.querySelector(".banner-img").src =
promociones[
Math.floor(
Math.random()*promociones.length
)
];


async function compartir(){

const comp =
document.getElementById("comprobante");

const canvas =
await html2canvas(
comp,
{
scale:3,
useCORS:true,
backgroundColor:"#5b1c82"
}
);

const blob =
await new Promise(r =>
canvas.toBlob(r,"image/png")
);

const file =
new File(
[blob],
"comprobante.png",
{type:"image/png"}
);

if(
navigator.share &&
navigator.canShare?.({files:[file]})
){

navigator.share({files:[file]});

}else{

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"comprobante.png";

a.click();

}

}
