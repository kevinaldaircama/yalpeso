if (!localStorage.getItem("sessionToken")) {
  location.href = "/";
}
// Botón volver
const backBtn = document.getElementById("backBtn");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    history.back();
  });
}

// Activar navegación inferior
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// Scroll suave horizontal
document.querySelectorAll(".icons-row, .cards-row").forEach(row => {
  row.addEventListener("wheel", (e) => {
    e.preventDefault();
    row.scrollLeft += e.deltaY;
  });
});
