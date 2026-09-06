/* MODAL */

const welcomeModal =
  document.getElementById("welcomeModal");

const countdownEl =
  document.getElementById("countdown");

const closeBtn =
  document.getElementById("closeModal");

let timeLeft = 10;

const timer = setInterval(() => {

  timeLeft--;

  countdownEl.textContent = timeLeft;

  if (timeLeft <= 0) {

    clearInterval(timer);

    countdownEl.style.display = "none";

    closeBtn.style.display = "flex";

  }

}, 1000);

closeBtn.addEventListener("click", () => {

  welcomeModal.style.display = "none";

});


/* SLIDER */

const slides =
  document.querySelectorAll(".slide");

const dots =
  document.querySelectorAll(".dot");

let current = 0;

function showSlide(index){

  slides.forEach(s =>
    s.classList.remove("active")
  );

  dots.forEach(d =>
    d.classList.remove("active")
  );

  slides[index].classList.add("active");

  dots[index].classList.add("active");

}

function nextSlide(){

  current =
    (current + 1) % slides.length;

  showSlide(current);

}

setInterval(nextSlide, 3000);

dots.forEach((dot, index) => {

  dot.addEventListener("click", () => {

    current = index;

    showSlide(current);

  });

});
