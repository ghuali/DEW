// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('index.php');
        productos = await response.json();
        
        if (productos.length > 0) {
            construirCarrusel();
        } else {
            document.getElementById('carousel-track').innerHTML = '<div class="slide"><p>No hay productos disponibles</p></div>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('carousel-track').innerHTML = '<div class="slide"><p>Error al cargar productos</p></div>';
    }
}

function construirCarrusel() {
    const track = document.getElementById('carousel-track');
    
    // Limpiar el contenido actual
    track.innerHTML = '';
    
    // Clon de la última imagen
    const clonFinal = document.createElement('div');
    clonFinal.className = 'slide';
    clonFinal.innerHTML = `<img src="${productos[productos.length - 1].imagen}" alt="${productos[productos.length - 1].nombre}">`;
    track.appendChild(clonFinal);
    
    // Slides reales
    productos.forEach(producto => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
        track.appendChild(slide);
    });
    
    // Clon de la primera imagen
    const clonInicio = document.createElement('div');
    clonInicio.className = 'slide';
    clonInicio.innerHTML = `<img src="${productos[0].imagen}" alt="${productos[0].nombre}">`;
    track.appendChild(clonInicio);
    
    // Iniciar el carrusel
    iniciarCarrusel();
}

function iniciarCarrusel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.slide');
    
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
}

// Cargar productos al inicio
cargarProductos();

// RESTO DE TU CÓDIGO ORIGINAL (validadores, modales, etc.)

const validators = {
    name: { regex: /^[A-Z][a-z]+$/, test(v){ return this.regex.test(v);} },
    dni: { regex: /^[XYZ]?\d{7,8}[A-Z]$/, test(v){ return this.regex.test(v);} },
    email: { regex:/^[\w\.-]+@[\w\.-]+\.\w{2,7}$/, test(v){ return this.regex.test(v);} },
    telefono: { regex:/^[67]\d{8}$/, test(v){ return this.regex.test(v);} },
    IBAN: { regex:/^ES\d{22}$/, test(v){ return this.regex.test(v);} },
    contrasena: { regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/, test(v){ return this.regex.test(v);} }
};

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