import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";  
  
import {  
  getDatabase,  
  ref,  
  set,  
  get,  
  child  
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";  
  
  
const firebaseConfig = window.firebaseConfig;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
  
let chart;
  
  
document.addEventListener("DOMContentLoaded", () => {  
  
  if(localStorage.getItem("dark") === "true"){  
    document.body.classList.add("dark");  
  }  
  if(localStorage.getItem("dark") === "true"){

  document.getElementById(
    "menuDark"
  ).innerHTML =
  '<i class="fa fa-sun"></i> Modo Claro';

}
  const adminUser = localStorage.getItem("adminUser");  
  
  if (!adminUser) {  
    window.location.href = "login admin";  
    return;  
  }  
  
  document.getElementById("sessionInfo").innerHTML = `  
    <p>👤 Usuario: ${localStorage.getItem("adminUser")}</p>  
    <p>🧑 Nombre: ${localStorage.getItem("adminName")}</p>  
    <p>🔐 Rol: ${localStorage.getItem("adminRole")}</p>  
  `;  
  
  loadStats();  
  loadAdvancedStats();  
  loadProfile();
});  
  
  
  
document.getElementById("generateBtn").addEventListener("click", async () => {  
  
  const email = document.getElementById("userEmail").value.trim();  
  const pass = document.getElementById("userPassword").value.trim();  
  const name = document.getElementById("userName").value.trim();  
  
  if (!email || !pass || !name) {  
    alert("Completa todos los campos");  
    return;  
  }  
  
  const token =  
    Math.random().toString(36).substring(2, 10);  
  
  await set(  
    ref(db, "tokens/" + token),  
    {  
      userEmail: email,  
      userPassword: pass,  
      userName: name,  
      createdBy:  
        localStorage.getItem("adminUser") || "admin",  
      used: false,  
      createdAt: Date.now()  
    }  
  );  
  
  document.getElementById(  
    "tokenOutput"  
  ).textContent =  
    "Token generado: " + token;  
  
  loadStats();  
  
  loadAdvancedStats();  
  
});  
  
  
  
async function loadStats(){  
  
  const snap =  
    await get(child(ref(db), "tokens"));  
  
  let total = 0;  
  let usados = 0;  
  let activos = 0;  
  
  if(!snap.exists()){  
    drawChart(0,0,0);  
    return;  
  }  
  
  const data =  
    Object.values(snap.val());  
  
  total = data.length;  
  usados =  
    data.filter(t => t.used).length;  
  activos = total - usados;  
  
  document.getElementById(  
    "totalStat"  
  ).innerText =  
    "Total: " + total;  
  
  document.getElementById(  
    "usedStat"  
  ).innerText =  
    "Usados: " + usados;  
  
  document.getElementById(  
    "activeStat"  
  ).innerText =  
    "Activos: " + activos;  
  
  drawChart(total, usados, activos);  
  
}  
  
  
  
function drawChart(total, usados, activos){  
  
  const ctx =  
    document.getElementById(  
      "statsChart"  
    );  
  
  if(chart) chart.destroy();  
  
  chart =  
    new Chart(ctx,{  
      type:"doughnut",  
      data:{  
        labels:[  
          "Total",  
          "Usados",  
          "Activos"  
        ],  
        datasets:[  
          {  
            data:[  
              total,  
              usados,  
              activos  
            ],  
            backgroundColor:[  
              "#4e9af1",  
              "#ef4444",  
              "#22c55e"  
            ]  
          }  
        ]  
      }  
    });  
  
}  
async function loadAdvancedStats(){  
  
  const snap =  
    await get(  
      child(ref(db), "tokens")  
    );  
  
  if(!snap.exists()) return;  
  
  const now =  
    Date.now();  
  
  const tokens =  
    Object.values(  
      snap.val()  
    );  
  
  const hoy =  
    tokens.filter(  
      t =>  
        t.createdAt &&  
        now -  
        t.createdAt <  
        86400000  
    ).length;  
  
  const semana =  
    tokens.filter(  
      t =>  
        t.createdAt &&  
        now -  
        t.createdAt <  
        604800000  
    ).length;  
  
  const mes =  
    tokens.filter(  
      t =>  
        t.createdAt &&  
        now -  
        t.createdAt <  
        2592000000  
    ).length;  
  
  document.getElementById(  
    "advancedStats"  
  ).innerHTML = `  
    <p>📅 Tokens hoy: ${hoy}</p>  
    <p>🗓️ Últimos 7 días: ${semana}</p>  
    <p>📆 Últimos 30 días: ${mes}</p>  
  `;  
  
}  
  async function loadProfile(){

  const user =
    localStorage.getItem("adminUser");

  if(!user) return;

  const snap =
    await get(
      child(
        ref(db),
        "admins/" +
        user.replace(/\./g,"_")
      )
    );

  if(!snap.exists()){

    document.getElementById(
      "profileInfo"
    ).innerHTML =
      "Perfil no encontrado";

    return;
  }

  const admin = snap.val();
const expireDate = new Date(admin.expire);
const now = new Date();

const diff =
expireDate.getTime() - now.getTime();

const days =
Math.ceil(
diff / (1000 * 60 * 60 * 24)
);

let estado = "";
let boton = "";

if(days < 0){

  document.getElementById(
    "expiredModal"
  ).style.display = "flex";

  document.body.style.overflow = "hidden";

  estado = `
  <div class="alertExpire">
    ❌ Plan vencido
  </div>
  `;

  boton = `
  <button onclick="location.href='planes.html'">
    🚀 Renovar Ahora
  </button>
  `;

}else if(days <= 7){

  estado = `
  <div class="alertExpire">
    ⚠️ Tu plan vence en ${days} día(s)
  </div>
  `;

  boton = `
  <button onclick="location.href='planes.html'">
    🔄 Renovar Plan
  </button>
  `;

}else{

  estado = `
  <div class="alertOk">
    ✅ Quedan ${days} días
  </div>
  `;

  boton = `
  <button onclick="location.href='planes.html'">
    🚀 Ampliar Plan
  </button>
  `;

}

document.getElementById(
  "profileInfo"
).innerHTML = `

<div class="profileCard">

  <div class="profileAvatar">
    👨‍💼
  </div>

  <h2>${admin.name}</h2>

  <p>${admin.email}</p>

  ${estado}

  <div class="profileGrid">

    <div>
      <span>Usuario</span>
      <strong>${admin.user}</strong>
    </div>

    <div>
      <span>Rol</span>
      <strong>${admin.role}</strong>
    </div>

    <div>
      <span>Teléfono</span>
      <strong>${admin.phone}</strong>
    </div>

    <div>
      <span>Expira</span>
      <strong>${admin.expire}</strong>
    </div>

  </div>

  ${boton}

</div>

`;

} // cierre de loadProfile()
  
document  
.getElementById("exportJSON")  
.addEventListener(  
  "click",  
  async ()=>{  
  
    const snap =  
      await get(  
        child(  
          ref(db),  
          "tokens"  
        )  
      );  
  
    if(!snap.exists()){  
      alert("No hay datos");  
      return;  
    }  
  
    const blob =  
      new Blob(  
        [  
          JSON.stringify(  
            snap.val(),  
            null,  
            2  
          )  
        ],  
        {  
          type:  
            "application/json"  
        }  
      );  
  
    const a =  
      document.createElement(  
        "a"  
      );  
  
    a.href =  
      URL.createObjectURL(  
        blob  
      );  
  
    a.download =  
      "backup_tokens.json";  
  
    a.click();  
  
  }  
);  
  
  
  
document  
.getElementById("importJSON")  
.addEventListener(  
  "change",  
  e=>{  
  
    const file =  
      e.target.files[0];  
  
    if(!file) return;  
  
    const reader =  
      new FileReader();  
  
    reader.onload =  
      async ()=>{  
  
        try{  
  
          const data =  
            JSON.parse(  
              reader.result  
            );  
  
          await set(  
            ref(  
              db,  
              "tokens"  
            ),  
            data  
          );  
  
          alert(  
            "Importado"  
          );  
  
          loadStats();  
           
          loadAdvancedStats();  
  
        }catch{  
  
          alert(  
            "Archivo inválido"  
          );  
  
        }  
  
      };  
  
    reader.readAsText(file);  
  
  }  
);  
  
  
  
document
.getElementById("menuLogout")
.onclick = ()=>{
  localStorage.clear();  
  
  window.location.href =  
    "login admin";  
  
};  
  
  
  
const sidebar =  
  document.getElementById(  
    "sidebar"  
  );  
  
const overlay =  
  document.getElementById(  
    "overlay"  
  );  
  
const menuBtn =  
  document.getElementById(  
    "menuBtn"  
  );  
  
  
menuBtn.addEventListener(  
  "click",  
  ()=>{  
  
    sidebar.classList.toggle(  
      "active"  
    );  
  
    overlay.classList.toggle(  
      "show"  
    );  
  
  }  
);  
  
  
overlay.addEventListener(  
  "click",  
  ()=>{  
  
    sidebar.classList.remove(  
      "active"  
    );  
  
    overlay.classList.remove(  
      "show"  
    );  
  
  }  
);  
      document
.querySelectorAll(".sidebar a[data-section]")
.forEach(btn=>{

  btn.addEventListener("click",()=>{

    document
    .querySelectorAll(".card")
    .forEach(c=>{
      c.style.display = "none";
    });

    const section =
      btn.getAttribute("data-section");

    document
    .getElementById(section)
    .style.display = "block";

    document
    .querySelectorAll(".sidebar a[data-section]")
    .forEach(a=>{
      a.classList.remove("active");
    });

    btn.classList.add("active");

    sidebar.classList.remove("active");
    overlay.classList.remove("show");

  });

});
    
const searchBox =
  document.getElementById("searchBox");

const searchResults =
  document.getElementById("searchResults");

if(searchBox){

  searchBox.addEventListener(
    "input",
    async ()=>{

      const text =
        searchBox.value.toLowerCase();

      searchResults.innerHTML = "";

      const snap =
        await get(
          child(ref(db),"tokens")
        );

      if(!snap.exists()) return;

      const tokens = snap.val();

      let encontrados = 0;

      Object.entries(tokens).forEach(
        ([token,data])=>{

          const texto =
            (token + data.userName + data.userEmail)
            .toLowerCase();

          if(texto.includes(text)){

            encontrados++;

            const li =
              document.createElement("li");

            li.innerHTML = `
              <b>${data.userName}</b><br>
              📧 ${data.userEmail}<br>
              🔑 ${token}<br>

              Estado:
              ${data.used ? '🔴 Usado' : '🟢 Libre'}

              <br><br>

              <button onclick="copyToken('${token}')">
                Copiar Token
              </button>

              ${
                data.used
                  ? `<button onclick="reuseToken('${token}')">
                       ♻️ Reutilizar Token
                     </button>`
                  : ''
              }
            `;

            searchResults.appendChild(li);

          }

        }
      );

      document.getElementById(
        "searchCount"
      ).innerHTML =
        `Resultados: ${encontrados}`;

    }
  );

}
window.copyToken = async(token)=>{

  await navigator.clipboard.writeText(
    token
  );

  alert(
    "Token copiado"
  );

};
window.reuseToken = async(token)=>{

  await set(
    ref(db, "tokens/" + token + "/used"),
    false
  );

  alert("✅ Token reactivado");

  loadStats();
  
  loadAdvancedStats();

};
window.toggleDark = ()=>{

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem("dark", dark);

  document.getElementById("menuDark").innerHTML =
    dark
    ? '<i class="fa fa-sun"></i> Modo Claro'
    : '<i class="fa fa-moon"></i> Modo Oscuro';

  sidebar.classList.remove("active");
  overlay.classList.remove("show");

};
document
.getElementById("menuDark")
.addEventListener(
  "click",
  toggleDark
);
const INACTIVITY_TIME =
  10 * 60 * 1000;

let inactivityTimer;

function resetTimer(){

  clearTimeout(
    inactivityTimer
  );

  inactivityTimer =
    setTimeout(()=>{

      alert(
        "Sesión cerrada por inactividad"
      );        

      localStorage.clear();

      window.location.href =
        "login admin";

    }, INACTIVITY_TIME);

}
[
  "mousemove",
  "mousedown",
  "keypress",
  "touchstart",
  "scroll"
].forEach(event=>{

  document.addEventListener(
    event,
    resetTimer
  );

});

resetTimer();
