// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('index.php');
        productos = await response.json();
        
        if (productos.length > 0) {
            construirCarrusel();
            mostrarProductoDestacado();
            mostrarOtrosProductos();
            cargarCarrito(); // Cargar carrito DESPUÉS de que los productos estén listos
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
    track.innerHTML = '';

    // Clon de la última imagen
    const clonFinal = document.createElement('div');
    clonFinal.className = 'slide';
    clonFinal.innerHTML = `<img src="${productos[productos.length - 1].imagen}" alt="${productos[productos.length - 1].nombre}" data-id="${productos[productos.length - 1].id}">`;
    track.appendChild(clonFinal);

    // Slides reales
    productos.forEach(producto => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}" data-id="${producto.id}">`;
        track.appendChild(slide);
    });

    // Clon de la primera imagen
    const clonInicio = document.createElement('div');
    clonInicio.className = 'slide';
    clonInicio.innerHTML = `<img src="${productos[0].imagen}" alt="${productos[0].nombre}" data-id="${productos[0].id}">`;
    track.appendChild(clonInicio);

    iniciarCarrusel();
}



function iniciarCarrusel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.slide');

    let index = 1;
    const DELAY = 2000;

    function updateCarousel(animate = true) {
        track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    updateCarousel(false);

    setInterval(() => {
        index++;
        updateCarousel();

        if (index === slides.length - 1) {
            setTimeout(() => {
                index = 1;
                updateCarousel(false);
            }, 500);
        }

        if (index === 0) {
            setTimeout(() => {
                index = slides.length - 2;
                updateCarousel(false);
            }, 500);
        }
    }, DELAY);
}

// GESTIÓN DEL CARRITO
let carrito = [];

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    alert(`${producto.nombre} agregado al carrito`);
}

function eliminarDelCarrito(idProducto) {
    console.log('Eliminando producto ID:', idProducto);
    console.log('Carrito antes:', carrito);
    
    carrito = carrito.filter(item => {
        console.log('Comparando item.id:', item.id, 'con idProducto:', idProducto, 'Tipo:', typeof item.id, typeof idProducto);
        return item.id != idProducto; // Cambiado a != en lugar de !==
    });
    
    console.log('Carrito después:', carrito);
    guardarCarrito();
    actualizarCarrito();
}

function cambiarCantidad(idProducto, cambio) {
    console.log('Cambiando cantidad. ID:', idProducto, 'Cambio:', cambio);
    
    const producto = carrito.find(item => item.id == idProducto); // Cambiado a ==
    
    if (producto) {
        console.log('Producto encontrado:', producto);
        producto.cantidad += cambio;
        
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            guardarCarrito();
            actualizarCarrito();
        }
    } else {
        console.log('Producto NO encontrado en carrito');
    }
}

function actualizarCarrito() {
    const carritoVacio = document.getElementById('carritoVacio');
    const carritoContenido = document.getElementById('carritoContenido');
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');
    
    if (!carritoVacio || !carritoContenido || !listaCarrito || !totalCarrito) {
        console.error('Elementos del carrito no encontrados');
        return;
    }
    
    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoContenido.style.display = 'none';
    } else {
        carritoVacio.style.display = 'none';
        carritoContenido.style.display = 'block';
        
        listaCarrito.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p class="precio">€${parseFloat(item.precio).toFixed(2)}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad btn-menos" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad btn-mas" data-id="${item.id}">+</button>
                </div>
                <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
            </div>
        `).join('');
        
        const total = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
        totalCarrito.textContent = total.toFixed(2);
    }
}

// Event delegation para botones del carrito
document.addEventListener('click', function(e) {
    // Botón menos
    if (e.target.classList.contains('btn-menos')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        console.log('Clic en menos, ID:', id);
        cambiarCantidad(id, -1);
    }
    
    // Botón más
    if (e.target.classList.contains('btn-mas')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        console.log('Clic en más, ID:', id);
        cambiarCantidad(id, 1);
    }
    
    // Botón eliminar
    if (e.target.classList.contains('btn-eliminar')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        console.log('Clic en eliminar, ID:', id);
        eliminarDelCarrito(id);
    }
});

// Event listener para clics en las imágenes del carrusel
document.addEventListener('click', function(e) {
    // Verificar si se hizo clic en una imagen del carrusel
    if (e.target.tagName === 'IMG' && e.target.closest('.slide')) {
        const productoId = parseInt(e.target.getAttribute('data-id'));
        const producto = productos.find(p => p.id == productoId);
        
        if (producto) {
            mostrarProductoDestacado(producto);
        }
    }
});

function mostrarProductoDestacado(producto = null) {
    // Si no se pasa un producto, elegir uno aleatorio
    if (!producto && productos.length > 0) {
        producto = productos[Math.floor(Math.random() * productos.length)];
    }
    
    if (producto) {
        const imgElem = document.getElementById('productoDestacadoImg');
        const nombreElem = document.getElementById('productoDestacadoNombre');
        const precioElem = document.getElementById('productoDestacadoPrecio');
        
        if (imgElem) imgElem.src = producto.imagen;
        if (imgElem) imgElem.alt = producto.nombre;
        if (nombreElem) nombreElem.textContent = producto.nombre;
        if (precioElem) precioElem.textContent = `€${parseFloat(producto.precio).toFixed(2)}`;
        
        // Mostrar disponibilidad
        const disponibilidad = producto.disponibilidad == 1 ? 'Disponible' : 'No disponible';
        
        let infoDisponibilidad = document.getElementById('productoDestacadoDisponibilidad');
        if (!infoDisponibilidad) {
            infoDisponibilidad = document.createElement('p');
            infoDisponibilidad.id = 'productoDestacadoDisponibilidad';
            infoDisponibilidad.className = 'disponibilidad';
            const productoInfo = document.querySelector('.producto-info');
            if (productoInfo && precioElem) {
                productoInfo.insertBefore(infoDisponibilidad, precioElem);
            }
        }
        if (infoDisponibilidad) {
            infoDisponibilidad.textContent = disponibilidad;
            infoDisponibilidad.style.color = producto.disponibilidad == 1 ? '#27ae60' : '#e74c3c';
        }
        
        const btnAgregar = document.getElementById('btnAgregarDestacado');
        if (btnAgregar) {
            btnAgregar.onclick = () => agregarAlCarrito(producto);
        }
        
        // Hacer scroll hacia el producto destacado
        const seccionDestacado = document.getElementById('productoDestacado');
        if (seccionDestacado) {
            seccionDestacado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function mostrarOtrosProductos() {
    const productosGrid = document.getElementById('productosGrid');
    
    productosGrid.innerHTML = productos.map(producto => `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <span class="precio">€${parseFloat(producto.precio).toFixed(2)}</span>
            <button class="btn-agregar-producto" data-id="${producto.id}">Agregar al Carrito</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
        btn.addEventListener('click', function() {
            const productoId = parseInt(this.dataset.id);
            const producto = productos.find(p => p.id === productoId);
            if (producto) {
                agregarAlCarrito(producto);
            }
        });
    });
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarProductos);
} else {
    cargarProductos();
}

// RESTO DEL CÓDIGO (validators, modales, etc.) sigue igual...

const validators = {
    name: { regex: /^[A-Z][a-z]+$/, test(v) { return this.regex.test(v); } },
    dni: { regex: /^[XYZ]?\d{7,8}[A-Z]$/, test(v) { return this.regex.test(v); } },
    email: { regex: /^[\w\.-]+@[\w\.-]+\.\w{2,7}$/, test(v) { return this.regex.test(v); } },
    telefono: { regex: /^[67]\d{8}$/, test(v) { return this.regex.test(v); } },
    IBAN: { regex: /^ES\d{22}$/, test(v) { return this.regex.test(v); } },
    contrasena: { regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/, test(v) { return this.regex.test(v); } }
};

function validarCampo(campo) {
    const nombre = campo.name;

    if (validators[nombre]?.test(campo.value)) {
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
    if (e.target === modalRegistro) modalRegistro.style.display = "none";
    if (e.target === modalLogin) modalLogin.style.display = "none";
});

// Verificar sesión al cargar la página
async function verificarSesion() {
    try {
        const response = await fetch('verificar_sesion.php');
        const data = await response.json();
        
        if (data.logged_in) {
            mostrarUsuarioLogueado(data.usuario);
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }
}

// Mostrar información del usuario logueado
function mostrarUsuarioLogueado(usuario) {
    const btnIniciarSesion = document.getElementById('openRegistro');
    if (btnIniciarSesion) {
        btnIniciarSesion.textContent = `Hola, ${usuario.name}`;
        btnIniciarSesion.onclick = (e) => {
            e.preventDefault();
            if (confirm('¿Deseas cerrar sesión?')) {
                cerrarSesion();
            }
        };
    }
}

// Cerrar sesión
async function cerrarSesion() {
    try {
        const response = await fetch('logout.php');
        const data = await response.json();
        
        if (data.success) {
            alert('Sesión cerrada exitosamente');
            location.reload();
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Manejar el formulario de LOGIN
const formLogin = document.getElementById('formLogin');
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(formLogin);
    const data = {
        email: formData.get('email'),
        contrasena: formData.get('contrasena')
    };
    
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            modalLogin.style.display = 'none';
            mostrarUsuarioLogueado(result.usuario);
            formLogin.reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al conectar con el servidor');
    }
});

// Manejar el formulario de REGISTRO
const formRegistro = document.getElementById('formRegistro');
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const inputs = formRegistro.querySelectorAll('input');
    let todosValidos = true;
    
    inputs.forEach(input => {
        validarCampo(input);
        if (input.classList.contains('invalid')) {
            todosValidos = false;
        }
    });
    
    if (!todosValidos) {
        alert('Por favor, corrige los errores en el formulario');
        return;
    }
    
    const formData = new FormData(formRegistro);
    const data = {
        dni: formData.get('dni'),
        name: formData.get('name'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        IBAN: formData.get('IBAN'),
        contrasena: formData.get('contrasena')
    };
    
    try {
        const response = await fetch('registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message + '\nAhora puedes iniciar sesión');
            modalRegistro.style.display = 'none';
            modalLogin.style.display = 'flex';
            formRegistro.reset();
            // Limpiar clases de validación
            inputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
            });
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error al registrar:', error);
        alert('Error al conectar con el servidor');
    }
});

// Verificar sesión al cargar la página
verificarSesion();