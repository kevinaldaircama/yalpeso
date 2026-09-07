import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


/* =====================================================
   FIREBASE
===================================================== */

const firebaseConfig = window.firebaseConfig;

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


/* =====================================================
   CONFIGURACIÓN ADMIN
===================================================== */

const DEFAULT_ADMIN_EMAIL =
  "kevinaldaircamachoserna51@gmail.com";

const DEFAULT_ADMIN_PASSWORD =
  "kevintech";

const DEFAULT_ADMIN_NAME =
  "KevinTech";


const ADMIN_PATH =
  "config/admin";


/* =====================================================
   VARIABLES
===================================================== */

let dashboard;
let users;
let tokens;
let profile;
let settings;

let welcome;
let usersList;
let filterStatus;

let editModal;
let editUser;
let editEmail;
let editPass;
let editName;
let editPhone;
let editExpire;
let editRole;

let newUser;
let newEmail;
let newPass;
let newName;
let newPhone;

let roleChart;

const WEB_NAME =
  window.location.hostname;


/* =====================================================
   HASH SHA-256
===================================================== */

async function hashPassword(password){

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(password);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array
    .from(new Uint8Array(hash))
    .map(
      b => b
        .toString(16)
        .padStart(2,"0")
    )
    .join("");

}


/* =====================================================
   CREAR ADMIN INICIAL
===================================================== */

async function initializeAdmin(){

  const adminRef =
    ref(db, ADMIN_PATH);

  const snap =
    await get(adminRef);


  if(!snap.exists()){

    const passwordHash =
      await hashPassword(
        DEFAULT_ADMIN_PASSWORD
      );


    await set(
      adminRef,
      {

        email:
          DEFAULT_ADMIN_EMAIL,

        name:
          DEFAULT_ADMIN_NAME,

        passwordHash:
          passwordHash,

        createdAt:
          Date.now()

      }
    );

    return;

  }


  /*
    Compatibilidad con una instalación anterior
    que pudiera tener adminPassword.
  */

  const data =
    snap.val();


  if(
    data.adminPassword &&
    !data.passwordHash
  ){

    const passwordHash =
      await hashPassword(
        data.adminPassword
      );


    await update(
      adminRef,
      {

        passwordHash,

        adminPassword:null

      }
    );

  }

}


/* =====================================================
   INIT
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    dashboard =
      document.getElementById(
        "dashboard"
      );

    users =
      document.getElementById(
        "users"
      );

    tokens =
      document.getElementById(
        "tokens"
      );

    profile =
      document.getElementById(
        "profile"
      );

    settings =
      document.getElementById(
        "settings"
      );

    welcome =
      document.getElementById(
        "welcome"
      );

    usersList =
      document.getElementById(
        "usersList"
      );

    filterStatus =
      document.getElementById(
        "filterStatus"
      );


    newUser =
      document.getElementById(
        "newUser"
      );

    newEmail =
      document.getElementById(
        "newEmail"
      );

    newPass =
      document.getElementById(
        "newPass"
      );

    newName =
      document.getElementById(
        "newName"
      );

    newPhone =
      document.getElementById(
        "newPhone"
      );


    editModal =
      document.getElementById(
        "modalEdit"
      );

    editUser =
      document.getElementById(
        "editUser"
      );

    editEmail =
      document.getElementById(
        "editEmail"
      );

    editPass =
      document.getElementById(
        "editPass"
      );

    editName =
      document.getElementById(
        "editName"
      );

    editPhone =
      document.getElementById(
        "editPhone"
      );

    editExpire =
      document.getElementById(
        "editExpire"
      );

    editRole =
      document.getElementById(
        "editRole"
      );


    document.getElementById(
      "btnLogin"
    ).onclick = login;


    /*
      Crear administrador inicial
      solamente si no existe.
    */

    try{

      await initializeAdmin();

    }catch(error){

      console.error(
        "Error inicializando admin:",
        error
      );

    }


    if(
      localStorage.getItem(
        "ownerUser"
      )
    ){

      mostrarPanel();

    }else{

      document.getElementById(
        "loginOverlay"
      ).style.display = "flex";

    }


    updateMaintText();

  }
);


/* =====================================================
   MENU
===================================================== */

const sidebar =
  document.getElementById(
    "sidebar"
  );

const menuBtn =
  document.getElementById(
    "menuBtn"
  );

const content =
  document.getElementById(
    "content"
  );


menuBtn.onclick = () => {

  sidebar.classList.toggle(
    "active"
  );

  content.classList.toggle(
    "active"
  );

  menuBtn.classList.toggle(
    "active"
  );

};


document
  .querySelectorAll(
    ".sidebar a[data-section]"
  )
  .forEach(link => {

    link.onclick = () => {

      document
        .querySelectorAll(
          ".sidebar a[data-section]"
        )
        .forEach(a =>
          a.classList.remove(
            "active"
          )
        );


      link.classList.add(
        "active"
      );


      dashboard.style.display =
        "none";

      users.style.display =
        "none";

      tokens.style.display =
        "none";

      profile.style.display =
        "none";

      settings.style.display =
        "none";


      const section =
        document.getElementById(
          link.dataset.section
        );


      section.style.display =
        "block";


      if(
        link.dataset.section ===
        "tokens"
      ){

        loadTokens();

      }


      if(
        link.dataset.section ===
        "profile"
      ){

        loadProfile();

      }


      menuBtn.click();

    };

  });


document.getElementById(
  "logoutBtn"
).onclick = () => {

  logout();

};


/* =====================================================
   LOGIN
===================================================== */

async function login(){

  const email =
    document
      .getElementById("email")
      .value
      .trim()
      .toLowerCase();


  const pass =
    document
      .getElementById("password")
      .value;


  const error =
    document.getElementById(
      "error"
    );


  error.style.display =
    "none";


  if(
    !email ||
    !pass
  ){

    error.innerText =
      "Completa todos los campos";

    error.style.display =
      "block";

    return;

  }


  try{

    const snap =
      await get(
        ref(db, ADMIN_PATH)
      );


    if(!snap.exists()){

      error.innerText =
        "Perfil administrativo no encontrado";

      error.style.display =
        "block";

      return;

    }


    const admin =
      snap.val();


    const passwordHash =
      await hashPassword(pass);


    if(
      email !==
        String(admin.email)
          .toLowerCase()
      ||
      passwordHash !==
        admin.passwordHash
    ){

      error.innerText =
        "Correo o contraseña incorrectos";

      error.style.display =
        "block";

      return;

    }


    localStorage.setItem(
      "ownerUser",
      admin.email
    );

    localStorage.setItem(
      "ownerRole",
      "owner"
    );

    localStorage.setItem(
      "ownerName",
      admin.name || "KevinTech"
    );


    mostrarPanel();


  }catch(error){

    console.error(error);

    error.innerText =
      "Error al conectar con Firebase";

    error.style.display =
      "block";

  }

}


window.login =
  login;


/* =====================================================
   PANEL
===================================================== */

function mostrarPanel(){

  document.getElementById(
    "loginOverlay"
  ).style.display =
    "none";


  dashboard.style.display =
    "block";

  users.style.display =
    "none";

  tokens.style.display =
    "none";

  profile.style.display =
    "none";

  settings.style.display =
    "none";


  welcome.innerText =
    localStorage.getItem(
      "ownerName"
    ) ||
    "KevinTech";


  loadUsers();

  loadChart();

}


/* =====================================================
   LOGOUT
===================================================== */

window.logout = () => {

  localStorage.removeItem(
    "ownerUser"
  );

  localStorage.removeItem(
    "ownerRole"
  );

  localStorage.removeItem(
    "ownerName"
  );


  location.reload();

};


/* =====================================================
   PERFIL
===================================================== */

async function loadProfile(){

  try{

    const snap =
      await get(
        ref(db, ADMIN_PATH)
      );


    if(!snap.exists())
      return;


    const admin =
      snap.val();


    document.getElementById(
      "profileName"
    ).value =
      admin.name || "";


    document.getElementById(
      "profileEmail"
    ).value =
      admin.email || "";


  }catch(error){

    console.error(
      "Error cargando perfil:",
      error
    );

  }

}


window.loadProfile =
  loadProfile;


/* =====================================================
   GUARDAR NOMBRE Y CORREO
===================================================== */

window.saveProfileData =
  async function(){

    const name =
      document.getElementById(
        "profileName"
      ).value.trim();


    const email =
      document.getElementById(
        "profileEmail"
      ).value.trim()
      .toLowerCase();


    if(!name){

      alert(
        "Ingresa tu nombre"
      );

      return;

    }


    if(!email){

      alert(
        "Ingresa tu correo"
      );

      return;

    }


    if(
      !email.includes("@")
    ){

      alert(
        "El correo no es válido"
      );

      return;

    }


    try{

      await update(
        ref(db, ADMIN_PATH),
        {

          name,
          email

        }
      );


      localStorage.setItem(
        "ownerUser",
        email
      );

      localStorage.setItem(
        "ownerName",
        name
      );


      welcome.innerText =
        name;


      alert(
        "Perfil actualizado correctamente"
      );


    }catch(error){

      console.error(error);

      alert(
        "No se pudo actualizar el perfil"
      );

    }

  };


/* =====================================================
   MOSTRAR / OCULTAR PASSWORD
===================================================== */

window.togglePassword =
  function(id, button){

    const input =
      document.getElementById(id);


    if(
      input.type ===
      "password"
    ){

      input.type =
        "text";

      button.innerHTML =
        '<i class="fa fa-eye-slash"></i>';

    }else{

      input.type =
        "password";

      button.innerHTML =
        '<i class="fa fa-eye"></i>';

    }

  };


/* =====================================================
   CAMBIAR PASSWORD ADMIN
===================================================== */

window.changeAdminPassword =
  async function(){

    const current =
      document.getElementById(
        "currentPassword"
      ).value;


    const newPassword =
      document.getElementById(
        "newAdminPassword"
      ).value;


    const confirmPassword =
      document.getElementById(
        "confirmAdminPassword"
      ).value;


    if(
      !current ||
      !newPassword ||
      !confirmPassword
    ){

      alert(
        "Completa todos los campos"
      );

      return;

    }


    if(
      newPassword.length < 6
    ){

      alert(
        "La nueva contraseña debe tener al menos 6 caracteres"
      );

      return;

    }


    if(
      newPassword !==
      confirmPassword
    ){

      alert(
        "Las contraseñas nuevas no coinciden"
      );

      return;

    }


    try{

      const snap =
        await get(
          ref(db, ADMIN_PATH)
        );


      if(!snap.exists()){

        alert(
          "No existe el perfil administrador"
        );

        return;

      }


      const admin =
        snap.val();


      const currentHash =
        await hashPassword(
          current
        );


      if(
        currentHash !==
        admin.passwordHash
      ){

        alert(
          "La contraseña actual es incorrecta"
        );

        return;

      }


      const newHash =
        await hashPassword(
          newPassword
        );


      await update(
        ref(db, ADMIN_PATH),
        {

          passwordHash:
            newHash

        }
      );


      alert(
        "Contraseña cambiada correctamente. Inicia sesión nuevamente."
      );


      logout();


    }catch(error){

      console.error(error);

      alert(
        "No se pudo cambiar la contraseña"
      );

    }

  };


/* =====================================================
   CREAR USUARIO
===================================================== */

window.createUser =
  async () => {

    const user =
      newUser.value.trim();


    const email =
      newEmail.value.trim();


    const pass =
      newPass.value.trim();


    const name =
      newName.value.trim();


    const phone =
      newPhone.value
        .replace(/\D/g,"");


    const dias =
      parseInt(
        document
          .getElementById(
            "newExpire"
          )
          .value
      );


    const role =
      document
        .getElementById(
          "newRole"
        )
        .value;


    if(
      !user ||
      !pass ||
      !name ||
      !phone ||
      !dias ||
      !email ||
      !role
    ){

      alert(
        "Completa todos los campos"
      );

      return;

    }


    const fecha =
      new Date();


    fecha.setDate(
      fecha.getDate() +
      dias
    );


    const expire =
      fecha
        .toISOString()
        .split("T")[0];


    const id =
      user.replace(/\./g,"_");


    const exist =
      await get(
        ref(
          db,
          "admins/" + id
        )
      );


    if(exist.exists()){

      alert(
        "Usuario ya existe"
      );

      return;

    }


    await set(
      ref(
        db,
        "admins/" + id
      ),
      {

        user,
        email,
        pass,
        name,
        phone,
        expire,
        role

      }
    );


    newUser.value = "";
    newEmail.value = "";
    newPass.value = "";
    newName.value = "";
    newPhone.value = "";

    document.getElementById(
      "newExpire"
    ).value = "";

    document.getElementById(
      "newRole"
    ).value = "";


    loadUsers();

    loadChart();


    showCreated(
      user,
      email,
      pass,
      name,
      phone,
      expire
    );

  };


/* =====================================================
   CUENTA CREADA
===================================================== */

function showCreated(
  user,
  email,
  pass,
  name,
  phone,
  expire
){

  const modal =
    document.getElementById(
      "modalCreated"
    );


  const data =
    document.getElementById(
      "createdData"
    );


  const btn =
    document.getElementById(
      "sendWA"
    );


  const msg =
`Felicidades ${user}, su cuenta se ha creado con éxito.

A continuación le doy sus datos de acceso.

Web: ${WEB_NAME}
Usuario: ${user}
Correo: ${email}
Contraseña: ${pass}
Vence: ${expire}`;


  data.innerText =
    msg;


  const wa =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodeURIComponent(msg);


  btn.onclick =
    () => {

      window.open(
        wa,
        "_blank"
      );

    };


  modal.style.display =
    "flex";

}


window.closeCreated =
  () => {

    document.getElementById(
      "modalCreated"
    ).style.display =
      "none";

  };


/* =====================================================
   LOAD USERS
===================================================== */

window.loadUsers =
  async () => {

    try{

      const snap =
        await get(
          ref(db,"admins")
        );


      usersList.innerHTML =
        "";


      if(!snap.exists())
        return;


      const filter =
        filterStatus.value;


      Object.entries(
        snap.val()
      ).forEach(
        ([id,u]) => {


          /*
            Ignorar el perfil especial
            del administrador.
          */

          if(
            id === "_owner"
          )
            return;


          let dias = 0;


          if(u.expire){

            const d =
              new Date(
                u.expire
              );


            if(
              !isNaN(d)
            ){

              dias =
                Math.floor(
                  (
                    d.getTime() -
                    Date.now()
                  ) /
                  86400000
                );

            }

          }


          if(
            filter ===
            "vigente" &&
            dias < 0
          )
            return;


          if(
            filter ===
            "expirado" &&
            dias >= 0
          )
            return;


          const waMsg =
            `Hola ${u.name}, tu servicio en ${WEB_NAME} vence en ${dias} días`;


          const waUrl =
            `https://wa.me/${u.phone}?text=${encodeURIComponent(waMsg)}`;


          const tr =
            document.createElement(
              "tr"
            );


          tr.innerHTML = `

<td>${escapeHTML(u.user || "")}</td>

<td>${escapeHTML(u.email || "")}</td>

<td>••••••••</td>

<td>${escapeHTML(u.name || "")}</td>

<td>
<button
class="table-button"
onclick="window.open('${waUrl}','_blank')"
>
<i class="fab fa-whatsapp"></i>
${escapeHTML(u.phone || "")}
</button>
</td>

<td>${escapeHTML(u.expire || "")}</td>

<td>${dias}</td>

<td>

<div class="action-buttons">

<button
class="edit-button"
onclick="openEdit('${id}')"
>
<i class="fa fa-pen"></i>
</button>

<button
class="delete-button"
onclick="deleteUser('${id}')"
>
<i class="fa fa-trash"></i>
</button>

</div>

</td>

`;


          usersList.appendChild(
            tr
          );

        }
      );


      loadChart();


    }catch(error){

      console.error(
        "Error cargando usuarios:",
        error
      );

    }

  };


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escapeHTML(value){

  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


/* =====================================================
   DELETE USER
===================================================== */

window.deleteUser =
  async id => {

    if(
      !confirm(
        "¿Eliminar este usuario?"
      )
    )
      return;


    await remove(
      ref(
        db,
        "admins/" + id
      )
    );


    loadUsers();

  };


/* =====================================================
   EDIT USER
===================================================== */

window.openEdit =
  id => {

    editModal.style.display =
      "flex";


    editModal.dataset.id =
      id;


    get(
      ref(
        db,
        "admins/" + id
      )
    ).then(
      snap => {

        if(!snap.exists())
          return;


        const u =
          snap.val();


        editUser.value =
          u.user || "";


        editEmail.value =
          u.email || "";


        editPass.value =
          u.pass || "";


        editName.value =
          u.name || "";


        editPhone.value =
          u.phone || "";


        if(u.expire){

          const fechaVence =
            new Date(
              u.expire
            );


          const dias =
            Math.ceil(
              (
                fechaVence.getTime() -
                Date.now()
              ) /
              86400000
            );


          editExpire.value =
            dias > 0
              ? dias
              : 0;

        }else{

          editExpire.value =
            0;

        }


        editRole.value =
          u.role || "";

      }
    );

  };


window.closeModal =
  () => {

    editModal.style.display =
      "none";

  };


/* =====================================================
   SAVE EDIT
===================================================== */

window.saveEdit =
  async () => {

    const id =
      editModal.dataset.id;


    const dias =
      parseInt(
        editExpire.value
      );


    if(
      isNaN(dias) ||
      dias < 0
    ){

      alert(
        "Ingresa una cantidad válida de días"
      );

      return;

    }


    const fecha =
      new Date();


    fecha.setDate(
      fecha.getDate() +
      dias
    );


    const expire =
      fecha
        .toISOString()
        .split("T")[0];


    await update(
      ref(
        db,
        "admins/" + id
      ),
      {

        email:
          editEmail.value.trim(),

        pass:
          editPass.value.trim(),

        name:
          editName.value.trim(),

        phone:
          editPhone.value
            .replace(/\D/g,""),

        expire,

        role:
          editRole.value

      }
    );


    closeModal();

    loadUsers();

  };


/* =====================================================
   CHART
===================================================== */

async function loadChart(){

  const snap =
    await get(
      ref(db,"admins")
    );


  if(!snap.exists())
    return;


  const data =
    Object.entries(
      snap.val()
    )
    .filter(
      ([id]) =>
        id !== "_owner"
    )
    .map(
      ([,u]) => u
    );


  const roles = {};
  const vigente = {};
  const expirado = {};


  data.forEach(
    u => {

      const role =
        u.role ||
        "Sin proveedor";


      if(
        !roles[role]
      ){

        roles[role] =
          0;

        vigente[role] =
          0;

        expirado[role] =
          0;

      }


      roles[role]++;


      const dias =
        u.expire
        ? Math.floor(
            (
              new Date(
                u.expire
              ).getTime() -
              Date.now()
            ) /
            86400000
          )
        : 0;


      if(dias < 0){

        expirado[role]++;

      }else{

        vigente[role]++;

      }

    }
  );


  const labels =
    Object.keys(
      roles
    );


  const ctx =
    document.getElementById(
      "roleChart"
    );


  if(!ctx)
    return;


  if(roleChart)
    roleChart.destroy();


  roleChart =
    new Chart(
      ctx,
      {

        type:"bar",

        data:{

          labels,

          datasets:[

            {
              label:
                "Vigentes",

              data:
                labels.map(
                  r =>
                    vigente[r]
                ),

              backgroundColor:
                "#8b5cf6"
            },

            {
              label:
                "Expirados",

              data:
                labels.map(
                  r =>
                    expirado[r]
                ),

              backgroundColor:
                "#ef4444"
            }

          ]

        },

        options:{

          responsive:true,

          plugins:{
            legend:{
              labels:{
                color:"#fff"
              }
            }
          },

          scales:{

            x:{
              ticks:{
                color:"#fff"
              }
            },

            y:{
              beginAtZero:true,

              ticks:{
                color:"#fff",
                precision:0
              }

            }

          }

        }

      }
    );

}


/* =====================================================
   RENOVAR TODO
===================================================== */

window.renewAll =
  async () => {

    if(
      !confirm(
        "¿Renovar todos los usuarios por 30 días?"
      )
    )
      return;


    const snap =
      await get(
        ref(db,"admins")
      );


    if(!snap.exists())
      return;


    const updates = {};


    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );


    const newExpire =
      new Date(
        today
      );


    newExpire.setDate(
      newExpire.getDate() +
      30
    );


    const formattedExpire =
      newExpire
        .toISOString()
        .split("T")[0];


    Object.entries(
      snap.val()
    ).forEach(
      ([id,u]) => {

        if(
          id === "_owner"
        )
          return;


        updates[
          id + "/expire"
        ] =
          formattedExpire;

      }
    );


    await update(
      ref(db,"admins"),
      updates
    );


    loadUsers();

    loadChart();

  };


/* =====================================================
   MANTENIMIENTO
===================================================== */

window.toggleMaintenance =
  async () => {

    const r =
      ref(
        db,
        "config/maintenance/enabled"
      );


    const snap =
      await get(r);


    const current =
      snap.exists()
        ? snap.val()
        : false;


    const newValue =
      !current;


    await set(
      r,
      newValue
    );


    updateMaintText();

  };


function updateMaintText(){

  get(
    ref(
      db,
      "config/maintenance/enabled"
    )
  ).then(
    s => {

      const el =
        document.getElementById(
          "maintStatus"
        );


      if(!el)
        return;


      el.innerText =
        "Estado mantenimiento: " +
        (
          s.exists() &&
          s.val()
            ? "ACTIVADO"
            : "DESACTIVADO"
        );

    }
  );

}


/* =====================================================
   TOKENS
===================================================== */

window.generateToken =
  async () => {

    const name =
      document
        .getElementById(
          "tokenName"
        )
        .value
        .trim();


    const email =
      document
        .getElementById(
          "tokenEmail"
        )
        .value
        .trim();


    const pass =
      document
        .getElementById(
          "tokenPass"
        )
        .value
        .trim();


    if(
      !name ||
      !email ||
      !pass
    ){

      alert(
        "Completa todos los campos"
      );

      return;

    }


    const token =
      Math.random()
        .toString(36)
        .substring(
          2,
          10
        )
        .toUpperCase();


    await set(
      ref(
        db,
        "tokens/" + token
      ),
      {

        userEmail:
          email,

        userPassword:
          pass,

        userName:
          name,

        used:
          false,

        createdAt:
          Date.now()

      }
    );


    document.getElementById(
      "tokenResult"
    ).innerHTML =
      "<b>Token:</b> " +
      token;


    document.getElementById(
      "tokenName"
    ).value = "";


    document.getElementById(
      "tokenEmail"
    ).value = "";


    document.getElementById(
      "tokenPass"
    ).value = "";


    loadTokens();

  };


async function loadTokens(){

  const snap =
    await get(
      ref(
        db,
        "tokens"
      )
    );


  const tbody =
    document.getElementById(
      "tokensList"
    );


  tbody.innerHTML =
    "";


  if(!snap.exists())
    return;


  Object.entries(
    snap.val()
  ).forEach(
    ([token,data]) => {

      const tr =
        document.createElement(
          "tr"
        );


      tr.innerHTML = `

<td>${escapeHTML(token)}</td>

<td>${escapeHTML(data.userName || "")}</td>

<td>${escapeHTML(data.userEmail || "")}</td>

<td>
<span class="status-badge ${
  data.used
    ? "status-used"
    : "status-available"
}">
${
  data.used
    ? "Usado"
    : "Disponible"
}
</span>
</td>

`;


      tbody.appendChild(
        tr
      );

    }
  );

}


/* =====================================================
   CERRAR MODALES AL HACER CLICK AFUERA
===================================================== */

document.addEventListener(
  "click",
  event => {

    if(
      event.target ===
      editModal
    ){

      closeModal();

    }


    const created =
      document.getElementById(
        "modalCreated"
      );


    if(
      event.target ===
      created
    ){

      closeCreated();

    }

  }
);