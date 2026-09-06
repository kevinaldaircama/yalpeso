if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
// Pequeña animación de los iconos
const thief = document.querySelector('.thief');
const lock = document.querySelector('.lock');
const warn = document.querySelector('.warn');

let dir = 1;
setInterval(() => {
  thief.style.transform = `translateY(${dir*2}px)`;
  lock.style.transform = `translateY(${-dir*2}px)`;
  warn.style.transform = `translateY(${dir}px)`;
  dir *= -1;
}, 800);
