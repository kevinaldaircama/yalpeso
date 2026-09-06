import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";  
import { getDatabase, ref, set, get, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";  
  
const firebaseConfig = window.firebaseConfig;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); 
  
let dashboard,
users,
tokens,
settings,
welcome,
usersList,
filterStatus;
  
let editModal, editUser, editEmail, editPass, editName, editPhone, editExpire, editRole;
  
let newUser, newEmail, newPass, newName, newPhone;  
  
const WEB_NAME = window.location.hostname;  
  
// ---------------- INIT ----------------  
  
document.addEventListener("DOMContentLoaded",()=>{ 
document.getElementById("btnLogin").onclick = login; 

dashboard = document.getElementById("dashboard");  
users = document.getElementById("users");  
settings = document.getElementById("settings");  
tokens = document.getElementById("tokens");
welcome = document.getElementById("welcome");  
usersList = document.getElementById("usersList");  
filterStatus = document.getElementById("filterStatus");  
  
newUser = document.getElementById("newUser");  
newEmail = document.getElementById("newEmail");  
newPass = document.getElementById("newPass");  
newName = document.getElementById("newName");  
newPhone = document.getElementById("newPhone");  
  
editModal = document.getElementById("modalEdit");  
editUser = document.getElementById("editUser");
editEmail = document.getElementById("editEmail");
editPass = document.getElementById("editPass"); 
editName = document.getElementById("editName");  
editPhone = document.getElementById("editPhone");  
editExpire = document.getElementById("editExpire");  
editRole = document.getElementById("editRole");  
  
if(!localStorage.getItem("ownerUser")){  
document.getElementById("loginOverlay").style.display="flex";  
}else{  
mostrarPanel();  
}  
  
sidebar.classList.remove("active");  
content.classList.remove("active");  
menuBtn.classList.remove("active");  
  
updateMaintText();  
  
});  
  
  
// ---------------- MENU ----------------  
  
const sidebar=document.getElementById("sidebar");  
const menuBtn=document.getElementById("menuBtn");  
const content=document.getElementById("content");  
  
menuBtn.onclick=()=>{  
sidebar.classList.toggle("active");  
content.classList.toggle("active");  
menuBtn.classList.toggle("active");  
};  
  
document.querySelectorAll(".sidebar a[data-section]").forEach(link=>{

  link.onclick=()=>{

    document.querySelectorAll(".sidebar a[data-section]")
    .forEach(a=>a.classList.remove("active"));

    link.classList.add("active");

    dashboard.style.display="none";
    users.style.display="none";
    tokens.style.display="none";
    settings.style.display="none";

    document.getElementById(link.dataset.section)
    .style.display="block";

    if(link.dataset.section==="tokens"){
      loadTokens();
    }

    menuBtn.click();
  };

});

document.getElementById("logoutBtn").onclick=()=>{
  logout();
};
  
  
// ---------------- LOGIN ----------------  
 
const ADMIN_EMAIL = "kevinaldaircamachoserna51@gmail.com";
const ADMIN_PASSWORD = "kevintech";
const ADMIN_NAME = "KevinTech";
const ADMIN_ROLE = "owner";

window.login = () => {

  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (email !== ADMIN_EMAIL || pass !== ADMIN_PASSWORD) {
    document.getElementById("error").style.display = "block";
    return;
  }

  localStorage.setItem("ownerUser", ADMIN_EMAIL);
  localStorage.setItem("ownerRole", ADMIN_ROLE);
  localStorage.setItem("ownerName", ADMIN_NAME);

  mostrarPanel();
};
  
  
// ---------------- PANEL ----------------  
  
function mostrarPanel(){

  document.getElementById("loginOverlay").style.display="none";

  dashboard.style.display="block";
  users.style.display="none";
  tokens.style.display="none";
  settings.style.display="none";

  welcome.innerText =
    "Bienvenido " +
    localStorage.getItem("ownerName");

  loadUsers();
  loadChart();
}
  
  
// ---------------- LOGOUT ----------------  
  
window.logout=()=>{  
localStorage.removeItem("ownerUser");
localStorage.removeItem("ownerRole");
localStorage.removeItem("ownerName");
location.reload();  
};  
  
  
// ---------------- CREATE USER ----------------  
  
window.createUser=async()=>{  
  
const user=newUser.value.trim();  
const email=newEmail.value.trim();  
const pass=newPass.value.trim();  
const name=newName.value.trim();  
const phone=newPhone.value.replace(/\D/g,"");
const dias = parseInt(
  document.getElementById("newExpire").value
);

const role =
  document.getElementById("newRole").value;

if(!user || !pass || !name || !phone || !dias || !email){
  alert("Completa todos");
  return;
}

const fecha = new Date();

fecha.setDate(
  fecha.getDate() + dias
);

const expire =
  fecha.toISOString().split("T")[0];
  
const exist = await get(ref(db,"admins/"+user.replace(".","_")));  
  
if(exist.exists()){  
alert("Usuario ya existe");  
return;  
}  
  
await set(ref(db,"admins/"+user.replace(".","_")),{  
user,email,pass,name,phone,expire,role  
});  
  
newUser.value="";  
newEmail.value="";  
newPass.value="";  
newName.value="";  
newPhone.value="";  
document.getElementById("newExpire").value="";  
  
loadUsers();  
loadChart();  
  
showCreated(user,email,pass,name,phone,expire);  
  
};  
function showCreated(user,email,pass,name,phone,expire){  
  
const modal = document.getElementById("modalCreated");  
const data = document.getElementById("createdData");  
const btn = document.getElementById("sendWA");  
  
const web = window.location.hostname;  
  
const msg =  
`Felicidades ${user} su cuenta se ha creado con éxito,  
a continuación le doy sus datos de acceso.  
  
Web: ${web}  
Usuario: ${user}  
Correo: ${email}  
Contraseña: ${pass}  
Vence: ${expire}`;  
  
data.innerText = msg;  
  
const wa =  
"https://wa.me/"+phone+  
"?text="+encodeURIComponent(msg);  
  
btn.onclick=()=>{  
window.open(wa);  
};  
  
modal.style.display="flex";  
  
}  
  window.closeCreated = () => {
  document.getElementById("modalCreated").style.display = "none";
};
// ---------------- LOAD USERS ----------------  
  
window.loadUsers = async () => {
  const snap = await get(ref(db, "admins"));
  usersList.innerHTML = "";
  if (!snap.exists()) return;

  const filter = filterStatus.value;

  Object.entries(snap.val()).forEach(([id, u]) => {
    let dias = 0;

if (u.expire) {
  const d = new Date(u.expire);
  if (!isNaN(d)) {
    dias = Math.floor((d.getTime() - Date.now()) / 86400000);
  }
}

    if (filter === "vigente" && dias < 0) return;
    if (filter === "expirado" && dias >= 0) return;

    const waMsg = `Hola ${u.name}, tu servicio en ${WEB_NAME} vence en ${dias} días`;
    const waUrl = `https://wa.me/${u.phone}?text=${encodeURIComponent(waMsg)}`;

    usersList.innerHTML += `
      <tr>
        <td>${u.user}</td>
        <td>${u.email || ""}</td>
        <td>*****</td>
        <td>${u.name}</td>
        <td><button onclick="window.open('${waUrl}')">${u.phone}</button></td>
        <td>${u.expire || ""}</td>
        <td>${dias}</td>
        <td>
          <button onclick="openEdit('${id}')">Editar</button>
          <button onclick="deleteUser('${id}')">Eliminar</button>
        </td>
      </tr>
    `;
  });

  loadChart();
}
  
  
// ---------------- DELETE ----------------  
  
window.deleteUser=async(id)=>{  
  
if(!confirm("Eliminar?")) return;  
  
await remove(ref(db,"admins/"+id));  
  
loadUsers();  
  
};  
  
  
// ---------------- EDIT ----------------  
  
window.openEdit=(id)=>{  
  
editModal.style.display="flex";  
editModal.dataset.id=id;  
  
get(ref(db,"admins/"+id)).then(snap=>{  
  
const u=snap.val();  
  
editUser.value=u.user; 
editEmail.value = u.email || ""; 
editPass.value=u.pass;  
editName.value=u.name;  
editPhone.value=u.phone;  
if (u.expire) {

  const fechaVence = new Date(u.expire);

  const dias = Math.ceil(
    (fechaVence.getTime() - Date.now()) / 86400000
  );

  editExpire.value = dias > 0 ? dias : 0;

} else {

  editExpire.value = 0;

}
editRole.value=u.role;  
  
});  
  
};  
  
window.closeModal=()=>{  
editModal.style.display="none";  
};  
  
window.saveEdit = async () => {

  const id = editModal.dataset.id;

  const dias = parseInt(editExpire.value);

  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);

  const expire = fecha.toISOString().split("T")[0];

  await update(ref(db, "admins/" + id), {
    email: editEmail.value,
    pass: editPass.value,
    name: editName.value,
    phone: editPhone.value,
    expire: expire,
    role: editRole.value
  });

  closeModal();
  loadUsers();
};
  
  
// ---------------- CHART ----------------  
  
let roleChart;  
  
async function loadChart(){  
  
const snap = await get(ref(db,"admins"));  
if(!snap.exists()) return;  
  
const data=Object.values(snap.val());  
  
const roles={},vigente={},expirado={};  
  
data.forEach(u=>{  
  
if(!roles[u.role]){  
roles[u.role]=0;  
vigente[u.role]=0;  
expirado[u.role]=0;  
}  
  
roles[u.role]++;  
  
const dias = u.expire  
? Math.floor((new Date(u.expire).getTime()-Date.now())/(1000*60*60*24))  
: 0;  
  
if(dias<0) expirado[u.role]++;  
else vigente[u.role]++;  
  
});  
  
const labels=Object.keys(roles);  
  
const ctx=document.getElementById("roleChart");  
  
if(roleChart) roleChart.destroy();  
  
roleChart=new Chart(ctx,{  
type:"bar",  
data:{  
labels,  
datasets:[  
{label:"Vigentes",data:labels.map(r=>vigente[r]),backgroundColor:"#4e9af1"},  
{label:"Expirados",data:labels.map(r=>expirado[r]),backgroundColor:"#ef4444"}  
]  
}  
});  
  
}  
  // ---------------- RENOVAR TODO A 30 DÍAS ----------------
window.renewAll = async () => {
  const snap = await get(ref(db, "admins"));
  if (!snap.exists()) return;

  const updates = {};
  const today = new Date();
  today.setHours(0,0,0,0); // limpiar hora para evitar problemas

  // Fecha de vencimiento = hoy + 30 días
  const newExpire = new Date(today);
  newExpire.setDate(newExpire.getDate() + 30);
  const formattedExpire = newExpire.toISOString().split("T")[0];

  Object.entries(snap.val()).forEach(([id, u]) => {
    updates[id + "/expire"] = formattedExpire;
  });

  await update(ref(db, "admins"), updates);

  loadUsers();  // recarga tabla
  loadChart();  // recarga gráfico
  
};
  
// ---------------- MAINT ----------------  
  
window.toggleMaintenance = async () => {
  const r = ref(db, "config/maintenance/enabled");
  const snap = await get(r);

  const current = snap.exists() ? snap.val() : false;
  const newValue = !current;

  await set(r, newValue);

  updateMaintText();
};
  
function updateMaintText(){  
  
get(ref(db,"config/maintenance/enabled")).then(s=>{  
  
const el=document.getElementById("maintStatus");  
  
if(!el) return;  
  
el.innerText="Estado mantenimiento: "+(s.exists()&&s.val()?"ACTIVADO":"DESACTIVADO");  
  
});  
  
}  
window.generateToken = async () => {

  const name =
    document.getElementById("tokenName").value.trim();

  const email =
    document.getElementById("tokenEmail").value.trim();

  const pass =
    document.getElementById("tokenPass").value.trim();

  if(!name || !email || !pass){
    alert("Completa todos los campos");
    return;
  }

  const token =
    Math.random()
      .toString(36)
      .substring(2,10)
      .toUpperCase();

  await set(
    ref(db,"tokens/"+token),
    {
      userEmail: email,
      userPassword: pass,
      userName: name,
      used: false,
      createdAt: Date.now()
    }
  );

  document.getElementById("tokenResult")
    .innerHTML =
    "<b>Token:</b> " + token;
document.getElementById("tokenName").value = "";
document.getElementById("tokenEmail").value = "";
document.getElementById("tokenPass").value = "";
  loadTokens();

};

async function loadTokens(){

  const snap =
    await get(ref(db,"tokens"));

  const tbody =
    document.getElementById("tokensList");

  tbody.innerHTML = "";

  if(!snap.exists()) return;

  Object.entries(snap.val())
  .forEach(([token,data])=>{

    tbody.innerHTML += `
      <tr>
        <td>${token}</td>
        <td>${data.userName}</td>
        <td>${data.userEmail}</td>
        <td>
          ${data.used ? "Usado" : "Disponible"}
        </td>
      </tr>
    `;

  });

}
