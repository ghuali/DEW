// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('index.php?action=obtener_productos');
        productos = await response.json();
        
        if (productos.length > 0) {
            construirCarrusel();
            mostrarProductoDestacado();
            cargarCarrito();
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

    const clonFinal = document.createElement('div');
    clonFinal.className = 'slide';
    clonFinal.innerHTML = `<img src="${productos[productos.length - 1].imagen}" alt="${productos[productos.length - 1].nombre}" data-id="${productos[productos.length - 1].id}">`;
    track.appendChild(clonFinal);

    productos.forEach(producto => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}" data-id="${producto.id}">`;
        track.appendChild(slide);
    });

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
    // Verificar si hay sesión activa
    fetch('index.php?action=verificar_sesion')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                // No hay sesión - mostrar modal de login
                const t = traducciones[idiomaActual];
                alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
                document.getElementById('modalLogin').style.display = 'flex';
                return;
            }
            
            // Sí hay sesión - agregar al carrito
            const productoExistente = carrito.find(item => item.id == producto.id);
            
            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({
                    ...producto,
                    id: parseInt(producto.id),
                    cantidad: 1
                });
            }
            
            guardarCarrito();
            actualizarCarrito();
            const t = traducciones[idiomaActual];
            alert(`${producto.nombre} ${t.alert_agregado}`);
        })
        .catch(error => {
            console.error('Error al verificar sesión:', error);
            alert('Error al verificar sesión');
        });
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id != idProducto);
    guardarCarrito();
    actualizarCarrito();
}

function cambiarCantidad(idProducto, cambio) {
    const producto = carrito.find(item => item.id == idProducto);
    
    if (producto) {
        producto.cantidad += cambio;
        
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            guardarCarrito();
            actualizarCarrito();
        }
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
        
        const t = traducciones[idiomaActual];
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
                <button class="btn-eliminar" data-id="${item.id}">${t.eliminar}</button>
            </div>
        `).join('');
        
        const total = carrito.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
        totalCarrito.textContent = total.toFixed(2);
    }
}

// Event delegation para botones del carrito y carrusel
document.addEventListener('click', function(e) {
    // Botón menos
    if (e.target.classList.contains('btn-menos')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        cambiarCantidad(id, -1);
    }
    
    // Botón más
    if (e.target.classList.contains('btn-mas')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        cambiarCantidad(id, 1);
    }
    
    // Botón eliminar
    if (e.target.classList.contains('btn-eliminar')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        eliminarDelCarrito(id);
    }
    
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
    if (!producto && productos.length > 0) {
        producto = productos[Math.floor(Math.random() * productos.length)];
    }
    
    if (producto) {
        const t = traducciones[idiomaActual];
        const imgElem = document.getElementById('productoDestacadoImg');
        const nombreElem = document.getElementById('productoDestacadoNombre');
        const precioElem = document.getElementById('productoDestacadoPrecio');
        
        if (imgElem) imgElem.src = producto.imagen;
        if (imgElem) imgElem.alt = producto.nombre;
        if (nombreElem) nombreElem.textContent = producto.nombre;
        if (precioElem) precioElem.textContent = `€${parseFloat(producto.precio).toFixed(2)}`;
        
        const disponibilidad = producto.disponibilidad == 1 ? t.disponible : t.no_disponible;
        
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
            btnAgregar.textContent = t.btn_agregar_carrito;
            btnAgregar.onclick = () => agregarAlCarrito(producto);
        }
        
        const seccionDestacado = document.getElementById('productoDestacado');
        if (seccionDestacado) {
            seccionDestacado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// VALIDADORES
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

// MODALES
const modalRegistro = document.getElementById("modalRegistro");
const modalLogin = document.getElementById("modalLogin");
const openLoginBtns = document.querySelectorAll("#openLogin, #abrirLoginDesdeRegistro");
const closeRegistro = document.getElementById("closeRegistro");
const closeLogin = document.getElementById("closeLogin");

// Abrir login desde el enlace "Regístrate" en el modal de login
document.getElementById('abrirRegistroDesdeLogin').addEventListener('click', (e) => {
    e.preventDefault();
    modalRegistro.style.display = "flex";
    modalLogin.style.display = "none";
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

// GESTIÓN DE SESIÓN Y AUTENTICACIÓN
async function verificarSesion() {
    try {
        const response = await fetch('index.php?action=verificar_sesion');
        const data = await response.json();
        
        if (data.logged_in) {
            mostrarUsuarioLogueado(data.usuario);
        } else {
            mostrarBotonLogin();
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        mostrarBotonLogin();
    }
}

function mostrarUsuarioLogueado(usuario) {
    const t = traducciones[idiomaActual];
    const userSection = document.getElementById('userSection');
    if (userSection) {
        userSection.innerHTML = `
            <div class="user-logged">
                <span>${t.nav_hola} ${usuario.name}</span>
                <button class="btn-logout" id="btnCerrarSesion">${t.nav_cerrar_sesion}</button>
            </div>
        `;
        
        document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
            e.preventDefault();
            const tConfirm = traducciones[idiomaActual];
            if (confirm(tConfirm.alert_cerrar_sesion)) {
                cerrarSesion();
            }
        });
    }
}

function mostrarBotonLogin() {
    const t = traducciones[idiomaActual];
    const userSection = document.getElementById('userSection');
    if (userSection) {
        userSection.innerHTML = `
            <a href="#" id="openRegistro">${t.nav_iniciar_sesion}</a>
        `;
        
        document.getElementById('openRegistro').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('modalLogin').style.display = 'flex';
        });
    }
}

async function cerrarSesion() {
    try {
        const t = traducciones[idiomaActual];
        const response = await fetch('index.php?action=logout');
        const data = await response.json();
        
        if (data.success) {
            alert('✅ ' + t.alert_sesion_cerrada);
            mostrarBotonLogin();
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        const t = traducciones[idiomaActual];
        alert('❌ ' + t.alert_error_sesion);
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
        const response = await fetch('index.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        const t = traducciones[idiomaActual];
        
        if (result.success) {
            alert(`✅ ${result.message}\n${t.alert_bienvenido} ${result.usuario.name}!`);
            modalLogin.style.display = 'none';
            mostrarUsuarioLogueado(result.usuario);
            formLogin.reset();
        } else {
            alert(`❌ ${t.alert_error} ${result.message}`);
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        const t = traducciones[idiomaActual];
        alert('❌ ' + t.alert_error_servidor);
    }
});

// Manejar el formulario de REGISTRO
const formRegistro = document.getElementById('formRegistro');
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputs = formRegistro.querySelectorAll('input');
    let todosValidos = true;
    
    inputs.forEach(input => {
        validarCampo(input);
        if (input.classList.contains('invalid')) {
            todosValidos = false;
        }
    });
    
    const t = traducciones[idiomaActual];
    
    if (!todosValidos) {
        alert(t.alert_corregir_errores);
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
        const response = await fetch('index.php?action=registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ ' + t.alert_registrado);
            modalRegistro.style.display = 'none';
            modalLogin.style.display = 'flex';
            formRegistro.reset();
            inputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
            });
        } else {
            alert(`❌ ${t.alert_error} ${result.message}`);
        }
    } catch (error) {
        console.error('Error al registrar:', error);
        alert('❌ ' + t.alert_error_servidor);
    }
});

// INICIALIZACIÓN - UNA SOLA VEZ AL FINAL
window.addEventListener('load', function() {
    // Cargar productos y sesión
    cargarProductos();
    verificarSesion();
    
    // Delay para asegurar que todo esté renderizado
    setTimeout(function() {
        // Botón de idioma
        const btnIdioma = document.getElementById('btnIdioma');
        if (btnIdioma) {
            btnIdioma.addEventListener('click', function(e) {
                e.preventDefault();
                cambiarIdioma();
            });
        }
        
        // Traducir página inicial
        traducirPagina();
    }, 300);
});