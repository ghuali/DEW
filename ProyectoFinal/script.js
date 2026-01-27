const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.slide');


const validators = {
    name: { regex: /^[A-Z][a-z]+$/, test(v){ return this.regex.test(v);} },
    dni: { regex: /^[XYZ]?\d{7,8}[A-Z]$/, test(v){ return this.regex.test(v);} },
    email: { regex:/^[\w\.-]+@[\w\.-]+\.\w{2,7}$/, test(v){ return this.regex.test(v);} },
    telefono: { regex:/^[67]\d{8}$/, test(v){ return this.regex.test(v);} },
    IBAN: { regex:/^ES\d{22}$/, test(v){ return this.regex.test(v);} },
    contrasena: { regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/, test(v){ return this.regex.test(v);} }
};

let index = 1; // empezamos en la primera real
const DELAY = 2000;

function updateCarousel(animate = true) {
  track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
  track.style.transform = `translateX(-${index * 100}%)`;
}

// Posición inicial
updateCarousel(false);

// Autoplay
setInterval(() => {
  index++;
  updateCarousel();

  // Si llegamos al clon final
  if (index === slides.length - 1) {
    setTimeout(() => {
      index = 1;
      updateCarousel(false);
    }, 500);
  }

  // Si llegamos al clon inicial (por seguridad)
  if (index === 0) {
    setTimeout(() => {
      index = slides.length - 2;
      updateCarousel(false);
    }, 500);
  }
}, DELAY);


function validarCampo(campo) {
    const nombre = campo.name;

    if(validators[nombre]?.test(campo.value)) {
        campo.classList.add("valid");
        campo.classList.remove("invalid");
    } else {
        campo.classList.add("invalid");
        campo.classList.remove("valid");
    }
}

// Añadir listener a todos los inputs del formulario
const inputs = document.querySelectorAll("#formRegistro input");

inputs.forEach(input => {
    input.addEventListener("input", () => validarCampo(input));
});


// Selección de elementos
const modalRegistro = document.getElementById("modalRegistro");
const modalLogin = document.getElementById("modalLogin");

const openRegistroBtns = document.querySelectorAll("#openRegistro, #abrirRegistroDesdeLogin");
const openLoginBtns = document.querySelectorAll("#openLogin, #abrirLoginDesdeRegistro");

const closeRegistro = document.getElementById("closeRegistro");
const closeLogin = document.getElementById("closeLogin");

// Abrir registro
openRegistroBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        modalRegistro.style.display = "flex";
        modalLogin.style.display = "none";
    });
});

// Abrir login
openLoginBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        modalLogin.style.display = "flex";
        modalRegistro.style.display = "none";
    });
});

// Cerrar modales
closeRegistro.addEventListener("click", () => modalRegistro.style.display = "none");
closeLogin.addEventListener("click", () => modalLogin.style.display = "none");

// Cerrar al hacer click fuera
window.addEventListener("click", e => {
    if(e.target === modalRegistro) modalRegistro.style.display = "none";
    if(e.target === modalLogin) modalLogin.style.display = "none";
});

